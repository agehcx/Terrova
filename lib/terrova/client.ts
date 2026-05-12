import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import { PublicKey, Connection, SystemProgram } from '@solana/web3.js';
import idl from './terrova.json';

export class TerrovaClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public program: Program<any>;
  public connection: Connection;
  public provider: AnchorProvider;

  private static COORD_SCALE = 10_000_000;

  constructor(connection: Connection, wallet: any, _programId?: PublicKey) {
    this.connection = connection;
    const provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    );
    this.provider = provider;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.program = new Program<any>(idl as any, provider);
  }

  private scaleCoord(val: number): BN {
    return new BN(Math.round(val * TerrovaClient.COORD_SCALE));
  }

  private unscaleCoord(val: BN): number {
    return val.toNumber() / TerrovaClient.COORD_SCALE;
  }

  getNodePda(): PublicKey {
    const [nodePda] = PublicKey.findProgramAddressSync(
      [Buffer.from('node'), this.provider.wallet.publicKey.toBuffer()],
      this.program.programId
    );
    return nodePda;
  }

  getProtocolPda(): PublicKey {
    const [protocolPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('protocol')],
      this.program.programId
    );
    return protocolPda;
  }

  getRewardsPda(walletPubkey?: PublicKey): PublicKey {
    const key = walletPubkey ?? this.provider.wallet.publicKey;
    const [rewardsPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('rewards'), key.toBuffer()],
      this.program.programId
    );
    return rewardsPda;
  }

  async registerNode(latitude: number, longitude: number, coverageRadiusKm: number) {
    try {
      const nodePda = this.getNodePda();
      const protocolPda = this.getProtocolPda();

      const tx = await this.methods
        .registerNode(
          {
            latitude: this.scaleCoord(latitude),
            longitude: this.scaleCoord(longitude),
          },
          coverageRadiusKm
        )
        .accounts({
          node: nodePda,
          protocol: protocolPda,
          stakeAccount: this.provider.wallet.publicKey,
          owner: this.provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return { success: true, tx };
    } catch (error) {
      console.error('[Terrova] Error registering node:', error);
      return { success: false, error };
    }
  }

  async submitEvidence(
    verificationRequestAddress: PublicKey,
    nodeAddress: PublicKey,
    photoHash: string,
    latitude: number,
    longitude: number,
    weather: { temp: number; humidity: number; wind: number }
  ) {
    try {
      const [evidencePda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('evidence'),
          verificationRequestAddress.toBuffer(),
          nodeAddress.toBuffer(),
        ],
        this.program.programId
      );

      const tx = await this.methods
        .submitEvidence({
          photoHash,
          location: {
            latitude: this.scaleCoord(latitude),
            longitude: this.scaleCoord(longitude),
          },
          weatherData: {
            temperature: weather.temp,
            humidity: weather.humidity,
            windSpeed: weather.wind * 10,
          },
        })
        .accounts({
          evidence: evidencePda,
          verificationRequest: verificationRequestAddress,
          node: nodeAddress,
          nodeOwner: this.provider.wallet.publicKey,
          owner: this.provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return { success: true, tx, evidencePda: evidencePda.toBase58() };
    } catch (error) {
      console.error('[Terrova] Error submitting evidence:', error);
      return { success: false, error };
    }
  }

  async createVerificationRequest(
    latitude: number,
    longitude: number,
    radiusKm: number,
    claimType: any,
    bounty: number,
    requiredEvidence: number,
    deadlineSeconds: number
  ) {
    try {
      const protocolPda = this.getProtocolPda();
      const protocol = await this.accounts.protocol.fetch(protocolPda);

      const [verificationPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('verification'),
          this.provider.wallet.publicKey.toBuffer(),
          protocol.totalVerifications.toArrayLike(Buffer, 'le', 8),
        ],
        this.program.programId
      );

      const tx = await this.methods
        .createVerificationRequest({
          location: {
            latitude: this.scaleCoord(latitude),
            longitude: this.scaleCoord(longitude),
          },
          radiusKm,
          claimType,
          bounty: new BN(bounty),
          requiredEvidence,
          deadline: new BN(deadlineSeconds),
        })
        .accounts({
          verificationRequest: verificationPda,
          protocol: protocolPda,
          requester: this.provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return { success: true, tx, verificationPda: verificationPda.toBase58() };
    } catch (error) {
      console.error('[Terrova] Error creating request:', error);
      return { success: false, error };
    }
  }

  async voteOnEvidence(evidencePda: PublicKey, voterNodePda: PublicKey, vote: boolean) {
    try {
      const [evidenceVotePda] = PublicKey.findProgramAddressSync(
        [Buffer.from('vote'), evidencePda.toBuffer(), voterNodePda.toBuffer()],
        this.program.programId
      );

      const tx = await this.methods
        .voteOnEvidence(vote)
        .accounts({
          evidenceVote: evidenceVotePda,
          evidence: evidencePda,
          voterNode: voterNodePda,
          voter: this.provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return { success: true, tx };
    } catch (error) {
      console.error('[Terrova] Error voting on evidence:', error);
      return { success: false, error };
    }
  }

  async claimRewards() {
    try {
      const rewardsPda = this.getRewardsPda();

      const tx = await this.methods
        .claimRewards()
        .accounts({
          rewards: rewardsPda,
          authority: this.provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return { success: true, tx };
    } catch (error) {
      console.error('[Terrova] Error claiming rewards:', error);
      return { success: false, error };
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private get accounts(): any { return (this.program as any).account; }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private get methods(): any { return (this.program as any).methods; }

  async fetchAllNodes(): Promise<Array<{ pubkey: string; owner: string; location: { latitude: number; longitude: number }; coverageRadiusKm: number; reputation: number; evidenceCount: number; status: string; registeredAt: Date }>> {
    try {
      const accounts = await this.accounts.node.all();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return accounts.map((acc: any) => ({
        pubkey: acc.publicKey.toBase58(),
        owner: acc.account.owner.toBase58(),
        location: {
          latitude: this.unscaleCoord(acc.account.location.latitude),
          longitude: this.unscaleCoord(acc.account.location.longitude),
        },
        coverageRadiusKm: acc.account.coverageRadiusKm,
        reputation: acc.account.reputation,
        evidenceCount: acc.account.evidenceCount.toNumber(),
        status: Object.keys(acc.account.status)[0],
        registeredAt: new Date(acc.account.registeredAt.toNumber() * 1000),
      }));
    } catch (error) {
      console.error('[Terrova] Error fetching nodes:', error);
      return [];
    }
  }

  async fetchAllVerifications(): Promise<Array<{ pubkey: string; requester: string; location: { latitude: number; longitude: number }; radiusKm: number; claimType: string; bounty: number; requiredEvidence: number; submittedEvidence: number; status: string; deadline: Date; createdAt: Date }>> {
    try {
      const accounts = await this.accounts.verificationRequest.all();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return accounts.map((acc: any) => ({
        pubkey: acc.publicKey.toBase58(),
        requester: acc.account.requester.toBase58(),
        location: {
          latitude: this.unscaleCoord(acc.account.location.latitude),
          longitude: this.unscaleCoord(acc.account.location.longitude),
        },
        radiusKm: acc.account.radiusKm,
        claimType: Object.keys(acc.account.claimType)[0] as string,
        bounty: acc.account.bounty.toNumber(),
        requiredEvidence: acc.account.requiredEvidence,
        submittedEvidence: acc.account.submittedEvidence,
        status: Object.keys(acc.account.status)[0] as string,
        deadline: new Date(acc.account.deadline.toNumber() * 1000),
        createdAt: new Date(acc.account.createdAt.toNumber() * 1000),
      }));
    } catch (error) {
      console.error('[Terrova] Error fetching verifications:', error);
      return [];
    }
  }

  async fetchAllEvidence(): Promise<Array<{ pubkey: string; verificationRequest: string; node: string; photoHash: string; location: { latitude: number; longitude: number }; weatherData: { temperature: number; humidity: number; windSpeed: number }; timestamp: Date; status: string; approveVotes: number; rejectVotes: number }>> {
    try {
      const accounts = await this.accounts.evidence.all();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return accounts.map((acc: any) => ({
        pubkey: acc.publicKey.toBase58(),
        verificationRequest: acc.account.verificationRequest.toBase58(),
        node: acc.account.node.toBase58(),
        photoHash: acc.account.photoHash,
        location: {
          latitude: this.unscaleCoord(acc.account.location.latitude),
          longitude: this.unscaleCoord(acc.account.location.longitude),
        },
        weatherData: {
          temperature: acc.account.weatherData.temperature,
          humidity: acc.account.weatherData.humidity,
          windSpeed: acc.account.weatherData.windSpeed / 10,
        },
        timestamp: new Date(acc.account.timestamp.toNumber() * 1000),
        status: Object.keys(acc.account.status)[0] as string,
        approveVotes: acc.account.approveVotes,
        rejectVotes: acc.account.rejectVotes,
      }));
    } catch (error) {
      console.error('[Terrova] Error fetching evidence:', error);
      return [];
    }
  }

  async fetchRewards(walletPubkey?: PublicKey) {
    try {
      const rewardsPda = this.getRewardsPda(walletPubkey);
      const account = await this.accounts.rewards.fetchNullable(rewardsPda);
      if (!account) return null;
      return {
        totalEarned: account.totalEarned.toNumber(),
        totalClaimed: account.totalClaimed.toNumber(),
        availableBalance: account.availableBalance.toNumber(),
        lastClaimTime:
          account.lastClaimTime.toNumber() > 0
            ? new Date(account.lastClaimTime.toNumber() * 1000)
            : null,
      };
    } catch (error) {
      console.error('[Terrova] Error fetching rewards:', error);
      return null;
    }
  }

  async fetchProtocol() {
    try {
      const protocolPda = this.getProtocolPda();
      const account = await this.accounts.protocol.fetchNullable(protocolPda);
      if (!account) return null;
      return {
        admin: account.admin.toBase58(),
        minStake: account.minStake.toNumber(),
        minEvidenceCount: account.minEvidenceCount,
        consensusThreshold: account.consensusThreshold,
        totalNodes: account.totalNodes.toNumber(),
        totalVerifications: account.totalVerifications.toNumber(),
      };
    } catch (error) {
      console.error('[Terrova] Error fetching protocol:', error);
      return null;
    }
  }
}
