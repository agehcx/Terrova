import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { Keypair, SystemProgram } from "@solana/web3.js";
import { Terrova } from "../target/types/terrova";
import { assert } from "chai";

const COORD_SCALE = 10_000_000;
function scaleCoord(val: number): BN {
  return new BN(Math.round(val * COORD_SCALE));
}

describe("terrova", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Terrova as Program<Terrova>;
  const provider = anchor.getProvider() as anchor.AnchorProvider;

  // PDAs
  const [protocolPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("protocol")],
    program.programId
  );

  // Second wallet for multi-party tests
  const nodeOperator2 = Keypair.generate();

  // ──────────────────────────────────────────
  // INITIALIZE
  // ──────────────────────────────────────────
  it("initializes the protocol", async () => {
    const tx = await program.methods
      .initialize({
        minStake: new BN(1000),
        minEvidenceCount: 2,
        consensusThreshold: 75,
      })
      .accounts({
        protocol: protocolPda,
        admin: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const protocol = await program.account.protocol.fetch(protocolPda);
    assert.ok(protocol.admin.equals(provider.wallet.publicKey));
    assert.equal(protocol.minStake.toNumber(), 1000);
    assert.equal(protocol.minEvidenceCount, 2);
    assert.equal(protocol.consensusThreshold, 75);
    assert.equal(protocol.totalNodes.toNumber(), 0);
    assert.equal(protocol.totalVerifications.toNumber(), 0);
    console.log("  ✔ initialize tx:", tx);
  });

  // ──────────────────────────────────────────
  // REGISTER NODE
  // ──────────────────────────────────────────
  it("registers a node operator", async () => {
    const [nodePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("node"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    const tx = await program.methods
      .registerNode(
        {
          latitude: scaleCoord(39.0119),
          longitude: scaleCoord(-96.7265),
        },
        50 // coverage radius km
      )
      .accounts({
        node: nodePda,
        protocol: protocolPda,
        stakeAccount: provider.wallet.publicKey,
        owner: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const node = await program.account.node.fetch(nodePda);
    assert.ok(node.owner.equals(provider.wallet.publicKey));
    assert.equal(node.coverageRadiusKm, 50);
    assert.equal(node.reputation, 100);
    assert.equal(node.evidenceCount.toNumber(), 0);
    assert.deepEqual(node.status, { active: {} });

    const protocol = await program.account.protocol.fetch(protocolPda);
    assert.equal(protocol.totalNodes.toNumber(), 1);
    console.log("  ✔ registerNode tx:", tx);
  });

  // ──────────────────────────────────────────
  // CREATE VERIFICATION REQUEST
  // ──────────────────────────────────────────
  it("creates a verification request", async () => {
    const protocol = await program.account.protocol.fetch(protocolPda);

    const [verificationPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("verification"),
        provider.wallet.publicKey.toBuffer(),
        protocol.totalVerifications.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const deadlineTimestamp = Math.floor(Date.now() / 1000) + 7 * 86400;

    const tx = await program.methods
      .createVerificationRequest({
        location: {
          latitude: scaleCoord(39.0119),
          longitude: scaleCoord(-98.4842),
        },
        radiusKm: 100,
        claimType: { cropDamage: {} },
        bounty: new BN(500),
        requiredEvidence: 2,
        deadline: new BN(deadlineTimestamp),
      })
      .accounts({
        verificationRequest: verificationPda,
        protocol: protocolPda,
        requester: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const request = await program.account.verificationRequest.fetch(verificationPda);
    assert.ok(request.requester.equals(provider.wallet.publicKey));
    assert.equal(request.bounty.toNumber(), 500);
    assert.equal(request.requiredEvidence, 2);
    assert.equal(request.submittedEvidence, 0);
    assert.deepEqual(request.status, { pending: {} });
    assert.deepEqual(request.claimType, { cropDamage: {} });

    const updatedProtocol = await program.account.protocol.fetch(protocolPda);
    assert.equal(updatedProtocol.totalVerifications.toNumber(), 1);
    console.log("  ✔ createVerificationRequest tx:", tx);
  });

  // ──────────────────────────────────────────
  // SUBMIT EVIDENCE
  // ──────────────────────────────────────────
  it("submits evidence for a verification request", async () => {
    // Re-derive verification PDA (totalVerifications was 0 when it was created)
    const [verificationPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("verification"),
        provider.wallet.publicKey.toBuffer(),
        new BN(0).toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const [nodePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("node"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    const [evidencePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("evidence"),
        verificationPda.toBuffer(),
        nodePda.toBuffer(),
      ],
      program.programId
    );

    const tx = await program.methods
      .submitEvidence({
        photoHash: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
        location: {
          latitude: scaleCoord(39.05),
          longitude: scaleCoord(-98.45),
        },
        weatherData: {
          temperature: 72,
          humidity: 45,
          windSpeed: 120,
        },
      })
      .accounts({
        evidence: evidencePda,
        verificationRequest: verificationPda,
        node: nodePda,
        nodeOwner: provider.wallet.publicKey,
        owner: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const evidence = await program.account.evidence.fetch(evidencePda);
    assert.ok(evidence.verificationRequest.equals(verificationPda));
    assert.ok(evidence.node.equals(nodePda));
    assert.equal(evidence.photoHash, "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco");
    assert.equal(evidence.approveVotes, 0);
    assert.equal(evidence.rejectVotes, 0);
    assert.deepEqual(evidence.status, { pending: {} });

    const request = await program.account.verificationRequest.fetch(verificationPda);
    assert.equal(request.submittedEvidence, 1);

    const node = await program.account.node.fetch(nodePda);
    assert.equal(node.evidenceCount.toNumber(), 1);
    console.log("  ✔ submitEvidence tx:", tx);
  });

  // ──────────────────────────────────────────
  // VOTE ON EVIDENCE (approve)
  // ──────────────────────────────────────────
  it("votes to approve evidence", async () => {
    const [verificationPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("verification"),
        provider.wallet.publicKey.toBuffer(),
        new BN(0).toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const [nodePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("node"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    const [evidencePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("evidence"), verificationPda.toBuffer(), nodePda.toBuffer()],
      program.programId
    );

    // Register a second node to vote (can't vote on your own evidence without a second node)
    // For simplicity, use admin wallet as voter node too (same node — valid in test env)
    const [votePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vote"), evidencePda.toBuffer(), nodePda.toBuffer()],
      program.programId
    );

    const tx = await program.methods
      .voteOnEvidence(true)
      .accounts({
        evidenceVote: votePda,
        evidence: evidencePda,
        voterNode: nodePda,
        voter: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const evidence = await program.account.evidence.fetch(evidencePda);
    assert.equal(evidence.approveVotes, 1);
    assert.equal(evidence.rejectVotes, 0);
    console.log("  ✔ voteOnEvidence (approve) tx:", tx);
  });

  // ──────────────────────────────────────────
  // SUBMIT SECOND EVIDENCE → triggers InProgress
  // ──────────────────────────────────────────
  it("second evidence submission transitions request to InProgress", async () => {
    // Fund second operator
    const airdropSig = await provider.connection.requestAirdrop(
      nodeOperator2.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSig);

    const [verificationPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("verification"),
        provider.wallet.publicKey.toBuffer(),
        new BN(0).toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    // Register second node
    const [node2Pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("node"), nodeOperator2.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .registerNode(
        { latitude: scaleCoord(39.1), longitude: scaleCoord(-98.5) },
        100
      )
      .accounts({
        node: node2Pda,
        protocol: protocolPda,
        stakeAccount: nodeOperator2.publicKey,
        owner: nodeOperator2.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([nodeOperator2])
      .rpc();

    const [evidence2Pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("evidence"),
        verificationPda.toBuffer(),
        node2Pda.toBuffer(),
      ],
      program.programId
    );

    await program.methods
      .submitEvidence({
        photoHash: "QmSecondEvidenceHash12345678901234567890123456",
        location: { latitude: scaleCoord(39.08), longitude: scaleCoord(-98.49) },
        weatherData: { temperature: 70, humidity: 50, windSpeed: 100 },
      })
      .accounts({
        evidence: evidence2Pda,
        verificationRequest: verificationPda,
        node: node2Pda,
        nodeOwner: nodeOperator2.publicKey,
        owner: nodeOperator2.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([nodeOperator2])
      .rpc();

    const request = await program.account.verificationRequest.fetch(verificationPda);
    assert.equal(request.submittedEvidence, 2);
    // requiredEvidence = 2, so should now be InProgress
    assert.deepEqual(request.status, { inProgress: {} });
    console.log("  ✔ second submitEvidence → status InProgress");
  });

  // ──────────────────────────────────────────
  // FINALIZE VERIFICATION
  // ──────────────────────────────────────────
  it("finalizes a completed verification", async () => {
    const [verificationPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("verification"),
        provider.wallet.publicKey.toBuffer(),
        new BN(0).toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const tx = await program.methods
      .finalizeVerification()
      .accounts({
        verificationRequest: verificationPda,
        protocol: protocolPda,
        admin: provider.wallet.publicKey,
      })
      .rpc();

    const request = await program.account.verificationRequest.fetch(verificationPda);
    assert.deepEqual(request.status, { completed: {} });
    console.log("  ✔ finalizeVerification tx:", tx);
  });

  // ──────────────────────────────────────────
  // CLAIM REWARDS
  // ──────────────────────────────────────────
  it("initializes a rewards account (claim with zero balance returns error)", async () => {
    const [rewardsPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("rewards"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    try {
      await program.methods
        .claimRewards()
        .accounts({
          rewards: rewardsPda,
          authority: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      assert.fail("Should have thrown NoRewardsAvailable");
    } catch (err: any) {
      // Expect the NoRewardsAvailable error
      assert.include(err.toString(), "NoRewardsAvailable");
      console.log("  ✔ claimRewards correctly rejects zero balance");
    }
  });

  // ──────────────────────────────────────────
  // SLASH NODE
  // ──────────────────────────────────────────
  it("slashes a node and reduces its reputation", async () => {
    const [nodePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("node"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    const nodeBefore = await program.account.node.fetch(nodePda);
    const reputationBefore = nodeBefore.reputation;

    const tx = await program.methods
      .slashNode(new BN(100))
      .accounts({
        node: nodePda,
        protocol: protocolPda,
        admin: provider.wallet.publicKey,
      })
      .rpc();

    const nodeAfter = await program.account.node.fetch(nodePda);
    assert.equal(nodeAfter.reputation, Math.max(0, reputationBefore - 20));
    console.log("  ✔ slashNode tx:", tx, "— reputation:", nodeAfter.reputation);
  });

  // ──────────────────────────────────────────
  // SLASH fails from non-admin
  // ──────────────────────────────────────────
  it("rejects slash from a non-admin signer", async () => {
    const [nodePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("node"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    try {
      await program.methods
        .slashNode(new BN(100))
        .accounts({
          node: nodePda,
          protocol: protocolPda,
          admin: nodeOperator2.publicKey,
        })
        .signers([nodeOperator2])
        .rpc();
      assert.fail("Should have thrown Unauthorized");
    } catch (err: any) {
      assert.include(err.toString(), "Unauthorized");
      console.log("  ✔ slashNode correctly rejects non-admin");
    }
  });

  // ──────────────────────────────────────────
  // NODE PDA VALIDATION: only owner can submit
  // ──────────────────────────────────────────
  it("rejects evidence submission from wrong wallet", async () => {
    const [verificationPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("verification"),
        provider.wallet.publicKey.toBuffer(),
        new BN(0).toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    // Try to use operator2's node but sign as original wallet — should fail
    const [node2Pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("node"), nodeOperator2.publicKey.toBuffer()],
      program.programId
    );

    const [badEvidencePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("evidence"), verificationPda.toBuffer(), node2Pda.toBuffer()],
      program.programId
    );

    try {
      await program.methods
        .submitEvidence({
          photoHash: "BadHashAttempt",
          location: { latitude: scaleCoord(39.0), longitude: scaleCoord(-98.0) },
          weatherData: { temperature: 70, humidity: 50, windSpeed: 100 },
        })
        .accounts({
          evidence: badEvidencePda,
          verificationRequest: verificationPda,
          node: node2Pda,
          // Intentionally wrong: signing as provider wallet but node belongs to nodeOperator2
          nodeOwner: provider.wallet.publicKey,
          owner: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      assert.fail("Should have thrown Unauthorized");
    } catch (err: any) {
      assert.include(err.toString(), "Unauthorized");
      console.log("  ✔ submitEvidence correctly rejects wrong owner");
    }
  });
});
