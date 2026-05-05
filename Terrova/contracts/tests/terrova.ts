import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Terrova } from "../target/types/terrova";
import { assert } from "chai";

describe("terrova", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Terrova as Program<Terrova>;
  const provider = anchor.getProvider() as anchor.AnchorProvider;

  it("Is initialized!", async () => {
    // Find the protocol PDA
    const [protocolPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("protocol")],
      program.programId
    );

    // Call the initialize instruction
    const tx = await program.methods
      .initialize({
        minStake: new anchor.BN(1000),
        minEvidenceCount: 2,
        consensusThreshold: 75,
      })
      .accounts({
        protocol: protocolPda,
        admin: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Your transaction signature", tx);

    // Fetch the protocol account to verify it was initialized correctly
    const protocolAccount = await program.account.protocol.fetch(protocolPda);
    assert.ok(protocolAccount.admin.equals(provider.wallet.publicKey));
    assert.equal(protocolAccount.minStake.toNumber(), 1000);
    assert.equal(protocolAccount.minEvidenceCount, 2);
    assert.equal(protocolAccount.consensusThreshold, 75);
    assert.equal(protocolAccount.totalNodes.toNumber(), 0);
  });
});
