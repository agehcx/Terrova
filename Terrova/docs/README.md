# Introduction to Terrova

Welcome to the official documentation for **Terrova**, the decentralized physical infrastructure network (DePIN) for agricultural insurance verification on Solana.

## What is Terrova?

Terrova bridges the gap between smart contract insurance policies and real-world agricultural events. By incentivizing a decentralized network of node operators to capture, hash, and verify geospatial evidence (like crop damage photos or drought conditions), Terrova enables fully automated, trustless claims settlement.

### The Problem

Traditional agricultural insurance is plagued by slow manual assessments, high administrative overhead, and subjective dispute resolution. When a natural disaster strikes, farmers often wait months for claims adjusters to process their payouts.

### The Solution

By utilizing Solana's high-throughput architecture, Terrova allows:

* **Insurers** to automatically broadcast "Verification Requests" to a specific geographic radius.
* **Node Operators** (local actors with smartphones or drones) to capture cryptographically signed evidence.
* **Smart Contracts** to tally consensus and instantly release bounties and insurance payouts once the evidence threshold is met.

## Network Participants

* **Requesters (Insurers):** Stake SOL as bounties and define the radius, required evidence count, and deadline for claim verifications.
* **Node Operators:** Stake TRV tokens to join the network. They submit geotagged evidence and earn bounties for accurate reporting.

## How it Works

1. **Request Creation:** A smart contract triggers a verification request for a specific GPS coordinate and radius.
2. **Evidence Submission:** Node operators within the radius travel to the location, capture photos/sensor data, and submit the hashed data on-chain.
3. **Consensus & Validation:** The network cross-references the submissions for geographic and temporal accuracy.
4. **Settlement:** Once consensus is reached, the evidence is approved. The node operators receive their bounty, and the insurance smart contract executes the payout to the farmer.
