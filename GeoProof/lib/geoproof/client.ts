import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import { PublicKey, Connection, Keypair } from '@solana/web3.js';
import type { Geoproof } from './geoproof.types';

export class GeoProofClient {
  public program: Program<Geoproof>;
  public connection: Connection;
  public provider: AnchorProvider;

  constructor(connection: Connection, wallet: any, programId: PublicKey) {
    this.connection = connection;
    
    // Create provider with wallet
    const provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    );
    this.provider = provider;

    // Initialize program - IDL would be imported from generated types
    const idl = {
      version: '0.1.0',
      name: 'geoproof',
      instructions: [],
      accounts: [],
      events: [],
    } as Idl;

    this.program = new Program<Geoproof>(idl, programId, provider);
  }

  /**
   * Register a new node in the network
   */
  async registerNode(
    name: string,
    latitude: number,
    longitude: number,
    region: string
  ) {
    try {
      const nodePda = await this.deriveNodePda(this.provider.wallet.publicKey);
      
      const tx = await this.program.methods
        .registerNode(name, latitude, longitude, region)
        .accounts({
          node: nodePda,
          authority: this.provider.wallet.publicKey,
          systemProgram: PublicKey.default,
        })
        .rpc();

      return { success: true, tx };
    } catch (error) {
      console.error('[GeoProof] Error registering node:', error);
      return { success: false, error };
    }
  }

  /**
   * Submit evidence for a location
   */
  async submitEvidence(
    verificationRequestId: string,
    latitude: number,
    longitude: number,
    imageHash: string,
    timestamp: number
  ) {
    try {
      const evidencePda = await this.deriveEvidencePda(verificationRequestId);
      
      const tx = await this.program.methods
        .submitEvidence(
          verificationRequestId,
          latitude,
          longitude,
          imageHash,
          new (require('@solana/web3.js').BN)(timestamp)
        )
        .accounts({
          evidence: evidencePda,
          submitter: this.provider.wallet.publicKey,
          systemProgram: PublicKey.default,
        })
        .rpc();

      return { success: true, tx };
    } catch (error) {
      console.error('[GeoProof] Error submitting evidence:', error);
      return { success: false, error };
    }
  }

  /**
   * Create a verification request
   */
  async createVerificationRequest(
    claimId: string,
    targetLatitude: number,
    targetLongitude: number,
    requiredEvidence: number,
    timeoutSeconds: number
  ) {
    try {
      const verificationPda = await this.deriveVerificationPda(claimId);
      
      const tx = await this.program.methods
        .createVerificationRequest(
          claimId,
          targetLatitude,
          targetLongitude,
          requiredEvidence,
          timeoutSeconds
        )
        .accounts({
          verification: verificationPda,
          requester: this.provider.wallet.publicKey,
          systemProgram: PublicKey.default,
        })
        .rpc();

      return { success: true, tx };
    } catch (error) {
      console.error('[GeoProof] Error creating verification request:', error);
      return { success: false, error };
    }
  }

  /**
   * Verify evidence and update verification status
   */
  async verifyEvidence(
    verificationRequestId: string,
    evidenceIndex: number,
    isValid: boolean
  ) {
    try {
      const verificationPda = await this.deriveVerificationPda(verificationRequestId);
      const evidencePda = await this.deriveEvidencePda(verificationRequestId);
      
      const tx = await this.program.methods
        .verifyEvidence(verificationRequestId, evidenceIndex, isValid)
        .accounts({
          verification: verificationPda,
          evidence: evidencePda,
          verifier: this.provider.wallet.publicKey,
          systemProgram: PublicKey.default,
        })
        .rpc();

      return { success: true, tx };
    } catch (error) {
      console.error('[GeoProof] Error verifying evidence:', error);
      return { success: false, error };
    }
  }

  /**
   * Claim rewards for verification work
   */
  async claimRewards() {
    try {
      const rewardsPda = await this.deriveRewardsPda(this.provider.wallet.publicKey);
      
      const tx = await this.program.methods
        .claimRewards()
        .accounts({
          rewards: rewardsPda,
          authority: this.provider.wallet.publicKey,
          systemProgram: PublicKey.default,
        })
        .rpc();

      return { success: true, tx };
    } catch (error) {
      console.error('[GeoProof] Error claiming rewards:', error);
      return { success: false, error };
    }
  }

  /**
   * PDA derivation helpers
   */
  private async deriveNodePda(authority: PublicKey) {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from('node'), authority.toBuffer()],
      this.program.programId
    );
    return pda;
  }

  private async deriveEvidencePda(verificationId: string) {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from('evidence'), Buffer.from(verificationId)],
      this.program.programId
    );
    return pda;
  }

  private async deriveVerificationPda(claimId: string) {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from('verification'), Buffer.from(claimId)],
      this.program.programId
    );
    return pda;
  }

  private async deriveRewardsPda(authority: PublicKey) {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from('rewards'), authority.toBuffer()],
      this.program.programId
    );
    return pda;
  }

  /**
   * Fetch node account data
   */
  async fetchNode(nodeAddress: PublicKey) {
    try {
      return await this.program.account.node.fetch(nodeAddress);
    } catch (error) {
      console.error('[GeoProof] Error fetching node:', error);
      return null;
    }
  }

  /**
   * Fetch all nodes
   */
  async fetchAllNodes() {
    try {
      return await this.program.account.node.all();
    } catch (error) {
      console.error('[GeoProof] Error fetching all nodes:', error);
      return [];
    }
  }

  /**
   * Fetch verification request
   */
  async fetchVerification(verificationAddress: PublicKey) {
    try {
      return await this.program.account.verification.fetch(verificationAddress);
    } catch (error) {
      console.error('[GeoProof] Error fetching verification:', error);
      return null;
    }
  }
}
