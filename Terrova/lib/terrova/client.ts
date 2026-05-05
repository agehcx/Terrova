import { Program, AnchorProvider, BN } from '@project-serum/anchor';
import { PublicKey, Connection, SystemProgram } from '@solana/web3.js';
import type { Terrova } from './terrova.types';

export class TerrovaClient {
  public program: Program<Terrova>;
  public connection: Connection;
  public provider: AnchorProvider;

  // Scaling factor for coordinates (1e7)
  private static COORD_SCALE = 10_000_000;

  constructor(connection: Connection, wallet: any, programId: PublicKey) {
    this.connection = connection;
    const provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    );
    this.provider = provider;
    
    // In a real app, this IDL would be the generated JSON
    // We use the types.ts as the source of truth here
    this.program = new Program<Terrova>(
      require('./terrova.json'), // We'll need this file or a mock of it
      programId,
      provider
    );
  }

  private scaleCoord(val: number): BN {
    return new BN(Math.round(val * TerrovaClient.COORD_SCALE));
  }

  private unscaleCoord(val: BN): number {
    return val.toNumber() / TerrovaClient.COORD_SCALE;
  }

  /**
   * Register a new node
   */
  async registerNode(latitude: number, longitude: number, coverageRadiusKm: number) {
    try {
      const [nodePda] = PublicKey.findProgramAddressSync(
        [Buffer.from('node'), this.provider.wallet.publicKey.toBuffer()],
        this.program.programId
      );

      const [protocolPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('protocol')],
        this.program.programId
      );

      const tx = await this.program.methods
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
          stakeAccount: this.provider.wallet.publicKey, // Placeholder for actual stake account
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

  /**
   * Submit evidence
   */
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
          nodeAddress.toBuffer()
        ],
        this.program.programId
      );

      const tx = await this.program.methods
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

      return { success: true, tx };
    } catch (error) {
      console.error('[Terrova] Error submitting evidence:', error);
      return { success: false, error };
    }
  }

  /**
   * Create a verification request
   */
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
      const [protocolPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('protocol')],
        this.program.programId
      );
      
      const protocol = await this.program.account.protocol.fetch(protocolPda);
      
      const [verificationPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('verification'),
          this.provider.wallet.publicKey.toBuffer(),
          protocol.totalVerifications.toArrayLike(Buffer, 'le', 8)
        ],
        this.program.programId
      );

      const tx = await this.program.methods
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

      return { success: true, tx };
    } catch (error) {
      console.error('[Terrova] Error creating request:', error);
      return { success: false, error };
    }
  }

  /**
   * Claim rewards
   */
  async claimRewards() {
    try {
      const [rewardsPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('rewards'), this.provider.wallet.publicKey.toBuffer()],
        this.program.programId
      );

      const tx = await this.program.methods
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

  /**
   * Fetch all nodes and map to UI type
   */
  async fetchAllNodes() {
    try {
      const accounts = await this.program.account.node.all();
      return accounts.map(acc => ({
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
}
