use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod terrova {
    use super::*;

    /// Initialize the Terrova protocol with admin settings
    pub fn initialize(ctx: Context<Initialize>, config: ProtocolConfig) -> Result<()> {
        let protocol = &mut ctx.accounts.protocol;
        protocol.admin = ctx.accounts.admin.key();
        protocol.min_stake = config.min_stake;
        protocol.min_evidence_count = config.min_evidence_count;
        protocol.consensus_threshold = config.consensus_threshold;
        protocol.total_nodes = 0;
        protocol.total_verifications = 0;
        protocol.bump = ctx.bumps.protocol;
        Ok(())
    }

    /// Register a new node operator with stake
    pub fn register_node(
        ctx: Context<RegisterNode>,
        location: GeoLocation,
        coverage_radius_km: u32,
    ) -> Result<()> {
        let node = &mut ctx.accounts.node;
        let protocol = &mut ctx.accounts.protocol;

        require!(
            ctx.accounts.stake_account.amount >= protocol.min_stake,
            TerrovaError::InsufficientStake
        );

        node.owner = ctx.accounts.owner.key();
        node.stake_account = ctx.accounts.stake_account.key();
        node.location = location;
        node.coverage_radius_km = coverage_radius_km;
        node.reputation = 100; // Start with perfect reputation
        node.evidence_count = 0;
        node.status = NodeStatus::Active;
        node.registered_at = Clock::get()?.unix_timestamp;
        node.bump = ctx.bumps.node;

        protocol.total_nodes += 1;

        emit!(NodeRegistered {
            node: node.key(),
            owner: node.owner,
            location: node.location.clone(),
        });

        Ok(())
    }

    /// Create a new verification request
    pub fn create_verification_request(
        ctx: Context<CreateVerificationRequest>,
        request_data: VerificationRequestData,
    ) -> Result<()> {
        let request = &mut ctx.accounts.verification_request;
        let protocol = &mut ctx.accounts.protocol;

        request.requester = ctx.accounts.requester.key();
        request.location = request_data.location;
        request.radius_km = request_data.radius_km;
        request.claim_type = request_data.claim_type;
        request.bounty = request_data.bounty;
        request.required_evidence = request_data.required_evidence;
        request.submitted_evidence = 0;
        request.status = VerificationStatus::Pending;
        request.deadline = request_data.deadline;
        request.created_at = Clock::get()?.unix_timestamp;
        request.bump = ctx.bumps.verification_request;

        protocol.total_verifications += 1;

        emit!(VerificationRequestCreated {
            request: request.key(),
            requester: request.requester,
            bounty: request.bounty,
            location: request.location.clone(),
        });

        Ok(())
    }

    /// Submit evidence for a verification request
    pub fn submit_evidence(
        ctx: Context<SubmitEvidence>,
        evidence_data: EvidenceData,
    ) -> Result<()> {
        let evidence = &mut ctx.accounts.evidence;
        let request = &mut ctx.accounts.verification_request;
        let node = &mut ctx.accounts.node;

        // Verify node is active and in range
        require!(node.status == NodeStatus::Active, TerrovaError::NodeNotActive);
        require!(
            is_in_range(&node.location, &request.location, request.radius_km),
            TerrovaError::NodeOutOfRange
        );

        evidence.verification_request = request.key();
        evidence.node = node.key();
        evidence.photo_hash = evidence_data.photo_hash;
        evidence.location = evidence_data.location;
        evidence.weather_data = evidence_data.weather_data;
        evidence.timestamp = Clock::get()?.unix_timestamp;
        evidence.status = EvidenceStatus::Pending;
        evidence.bump = ctx.bumps.evidence;

        request.submitted_evidence += 1;
        node.evidence_count += 1;

        // Check if we have enough evidence to process
        if request.submitted_evidence >= request.required_evidence {
            request.status = VerificationStatus::InProgress;
        }

        emit!(EvidenceSubmitted {
            evidence: evidence.key(),
            request: request.key(),
            node: node.key(),
        });

        Ok(())
    }

    /// Vote on submitted evidence (consensus mechanism)
    pub fn vote_on_evidence(
        ctx: Context<VoteOnEvidence>,
        vote: bool,
    ) -> Result<()> {
        let evidence_vote = &mut ctx.accounts.evidence_vote;
        let evidence = &mut ctx.accounts.evidence;

        evidence_vote.voter = ctx.accounts.voter_node.key();
        evidence_vote.evidence = evidence.key();
        evidence_vote.vote = vote;
        evidence_vote.timestamp = Clock::get()?.unix_timestamp;
        evidence_vote.bump = ctx.bumps.evidence_vote;

        if vote {
            evidence.approve_votes += 1;
        } else {
            evidence.reject_votes += 1;
        }

        emit!(EvidenceVoted {
            evidence: evidence.key(),
            voter: evidence_vote.voter,
            vote,
        });

        Ok(())
    }

    /// Finalize verification and distribute rewards
    pub fn finalize_verification(ctx: Context<FinalizeVerification>) -> Result<()> {
        let request = &mut ctx.accounts.verification_request;
        let protocol = &ctx.accounts.protocol;

        require!(
            request.submitted_evidence >= request.required_evidence,
            TerrovaError::InsufficientEvidence
        );

        // Calculate consensus (simplified)
        // In production, you'd iterate through all evidence and check votes
        request.status = VerificationStatus::Completed;

        emit!(VerificationFinalized {
            request: request.key(),
            status: request.status.clone(),
        });

        Ok(())
    }

    /// Slash a node's stake for fraudulent evidence
    pub fn slash_node(ctx: Context<SlashNode>, slash_amount: u64) -> Result<()> {
        let node = &mut ctx.accounts.node;
        
        require!(
            ctx.accounts.admin.key() == ctx.accounts.protocol.admin,
            TerrovaError::Unauthorized
        );

        node.reputation = node.reputation.saturating_sub(20);
        if node.reputation < 50 {
            node.status = NodeStatus::Suspended;
        }

        emit!(NodeSlashed {
            node: node.key(),
            amount: slash_amount,
            new_reputation: node.reputation,
        });

        Ok(())
    }
}

// ============================================================================
// ACCOUNTS
// ============================================================================

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + Protocol::INIT_SPACE,
        seeds = [b"protocol"],
        bump
    )]
    pub protocol: Account<'info, Protocol>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterNode<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + Node::INIT_SPACE,
        seeds = [b"node", owner.key().as_ref()],
        bump
    )]
    pub node: Account<'info, Node>,
    #[account(mut)]
    pub protocol: Account<'info, Protocol>,
    /// CHECK: Validated in instruction
    pub stake_account: AccountInfo<'info>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(request_data: VerificationRequestData)]
pub struct CreateVerificationRequest<'info> {
    #[account(
        init,
        payer = requester,
        space = 8 + VerificationRequest::INIT_SPACE,
        seeds = [b"verification", requester.key().as_ref(), &protocol.total_verifications.to_le_bytes()],
        bump
    )]
    pub verification_request: Account<'info, VerificationRequest>,
    #[account(mut)]
    pub protocol: Account<'info, Protocol>,
    #[account(mut)]
    pub requester: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitEvidence<'info> {
    #[account(
        init,
        payer = node_owner,
        space = 8 + Evidence::INIT_SPACE,
        seeds = [b"evidence", verification_request.key().as_ref(), node.key().as_ref()],
        bump
    )]
    pub evidence: Account<'info, Evidence>,
    #[account(mut)]
    pub verification_request: Account<'info, VerificationRequest>,
    #[account(
        mut,
        has_one = owner @ TerrovaError::Unauthorized
    )]
    pub node: Account<'info, Node>,
    #[account(mut)]
    pub node_owner: Signer<'info>,
    /// CHECK: Validated by has_one constraint
    pub owner: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VoteOnEvidence<'info> {
    #[account(
        init,
        payer = voter,
        space = 8 + EvidenceVote::INIT_SPACE,
        seeds = [b"vote", evidence.key().as_ref(), voter_node.key().as_ref()],
        bump
    )]
    pub evidence_vote: Account<'info, EvidenceVote>,
    #[account(mut)]
    pub evidence: Account<'info, Evidence>,
    pub voter_node: Account<'info, Node>,
    #[account(mut)]
    pub voter: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FinalizeVerification<'info> {
    #[account(mut)]
    pub verification_request: Account<'info, VerificationRequest>,
    pub protocol: Account<'info, Protocol>,
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct SlashNode<'info> {
    #[account(mut)]
    pub node: Account<'info, Node>,
    pub protocol: Account<'info, Protocol>,
    pub admin: Signer<'info>,
}

// ============================================================================
// STATE
// ============================================================================

#[account]
#[derive(InitSpace)]
pub struct Protocol {
    pub admin: Pubkey,
    pub min_stake: u64,
    pub min_evidence_count: u8,
    pub consensus_threshold: u8, // Percentage (0-100)
    pub total_nodes: u64,
    pub total_verifications: u64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Node {
    pub owner: Pubkey,
    pub stake_account: Pubkey,
    pub location: GeoLocation,
    pub coverage_radius_km: u32,
    pub reputation: u8,
    pub evidence_count: u64,
    pub status: NodeStatus,
    pub registered_at: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct VerificationRequest {
    pub requester: Pubkey,
    pub location: GeoLocation,
    pub radius_km: u32,
    pub claim_type: ClaimType,
    pub bounty: u64,
    pub required_evidence: u8,
    pub submitted_evidence: u8,
    pub status: VerificationStatus,
    pub deadline: i64,
    pub created_at: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Evidence {
    pub verification_request: Pubkey,
    pub node: Pubkey,
    #[max_len(64)]
    pub photo_hash: String,
    pub location: GeoLocation,
    pub weather_data: WeatherData,
    pub timestamp: i64,
    pub status: EvidenceStatus,
    pub approve_votes: u8,
    pub reject_votes: u8,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct EvidenceVote {
    pub voter: Pubkey,
    pub evidence: Pubkey,
    pub vote: bool,
    pub timestamp: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Rewards {
    pub authority: Pubkey,
    pub total_earned: u64,
    pub total_claimed: u64,
    pub available_balance: u64,
    pub last_claim_time: i64,
    pub bump: u8,
}

// ============================================================================
// TYPES
// ============================================================================

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct GeoLocation {
    pub latitude: i64,  // Scaled by 1e7 (e.g., 39.0119 -> 390119000)
    pub longitude: i64, // Scaled by 1e7
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct WeatherData {
    pub temperature: i16,  // Fahrenheit
    pub humidity: u8,      // Percentage
    pub wind_speed: u16,   // mph * 10
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct ProtocolConfig {
    pub min_stake: u64,
    pub min_evidence_count: u8,
    pub consensus_threshold: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct VerificationRequestData {
    pub location: GeoLocation,
    pub radius_km: u32,
    pub claim_type: ClaimType,
    pub bounty: u64,
    pub required_evidence: u8,
    pub deadline: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct EvidenceData {
    #[max_len(64)]
    pub photo_hash: String,
    pub location: GeoLocation,
    pub weather_data: WeatherData,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum NodeStatus {
    Active,
    Inactive,
    Suspended,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum VerificationStatus {
    Pending,
    InProgress,
    Completed,
    Rejected,
    Expired,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub enum ClaimType {
    CropDamage,
    FloodAssessment,
    HailDamage,
    DroughtVerification,
    FireDamage,
    PestInfestation,
    Other,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub enum EvidenceStatus {
    Pending,
    Approved,
    Rejected,
}

// ============================================================================
// EVENTS
// ============================================================================

#[event]
pub struct NodeRegistered {
    pub node: Pubkey,
    pub owner: Pubkey,
    pub location: GeoLocation,
}

#[event]
pub struct VerificationRequestCreated {
    pub request: Pubkey,
    pub requester: Pubkey,
    pub bounty: u64,
    pub location: GeoLocation,
}

#[event]
pub struct EvidenceSubmitted {
    pub evidence: Pubkey,
    pub request: Pubkey,
    pub node: Pubkey,
}

#[event]
pub struct EvidenceVoted {
    pub evidence: Pubkey,
    pub voter: Pubkey,
    pub vote: bool,
}

#[event]
pub struct VerificationFinalized {
    pub request: Pubkey,
    pub status: VerificationStatus,
}

#[event]
pub struct NodeSlashed {
    pub node: Pubkey,
    pub amount: u64,
    pub new_reputation: u8,
}

// ============================================================================
// ERRORS
// ============================================================================

#[error_code]
pub enum TerrovaError {
    #[msg("Insufficient stake amount")]
    InsufficientStake,
    #[msg("Node is not active")]
    NodeNotActive,
    #[msg("Node is out of verification range")]
    NodeOutOfRange,
    #[msg("Insufficient evidence submitted")]
    InsufficientEvidence,
    #[msg("Unauthorized action")]
    Unauthorized,
    #[msg("Verification deadline has passed")]
    DeadlinePassed,
    #[msg("Invalid location coordinates")]
    InvalidLocation,
}

// ============================================================================
// HELPERS
// ============================================================================

fn is_in_range(node_loc: &GeoLocation, request_loc: &GeoLocation, radius_km: u32) -> bool {
    // Simplified distance calculation (Haversine would be more accurate)
    // Using scaled coordinates (1e7)
    let lat_diff = (node_loc.latitude - request_loc.latitude).abs() as f64 / 1e7;
    let lng_diff = (node_loc.longitude - request_loc.longitude).abs() as f64 / 1e7;
    
    // Rough conversion: 1 degree ≈ 111 km
    let distance_km = ((lat_diff.powi(2) + lng_diff.powi(2)).sqrt() * 111.0) as u32;
    
    distance_km <= radius_km
}
= ((lat_diff.powi(2) + lng_diff.powi(2)).sqrt() * 111.0) as u32;
    
    distance_km <= radius_km
}
de_loc.latitude - request_loc.latitude).abs() as f64 / 1e7;
    let lng_diff = (node_loc.longitude - request_loc.longitude).abs() as f64 / 1e7;
    
    // Rough conversion: 1 degree ≈ 111 km
    let distance_km = ((lat_diff.powi(2) + lng_diff.powi(2)).sqrt() * 111.0) as u32;
    
    distance_km <= radius_km
}
