# FWD LIFEchain: AGRI Tokenomics & Smart Contract Ecosystem

This document outlines the economic model and technical infrastructure of the **Agri Life Token (AGRI)**, the native utility and governance token of the fwd LIFEchain network.

## 1. Token Overview
*   **Token Name:** Agri Life Token
*   **Symbol:** AGRI
*   **Network:** fwd LIFEchain (Geth Proof-of-Authority)
*   **Standard:** ERC-20
*   **Initial Supply:** 18,200,015 AGRI (Current Ledger State)
*   **Maximum Supply:** 1,000,000,000 AGRI (Fixed Hard Cap)

## 2. Core Economic Mechanisms

### A. EARN (Income Streams)
*   **Audit Rewards:** Validators and Auditors earn AGRI for every agricultural batch successfully verified and anchored to the blockchain.
*   **Staking Yield:** Holders who lock their AGRI in the Staking Contract receive periodic rewards from the network's reserve pool.
*   **Platform Participation:** Direct incentives for farmers who maintain high data fidelity and transparency in their supply chain.

### B. BURN & SINK (Deflationary Controls)
*   **Transaction Fees (Gas):** All network interactions cost AGRI. A percentage of gas fees is burned to offset minting rewards.
*   **Slashing Penalties:** Malicious actors or auditors who verify fraudulent data have their staked AGRI burned as a penalty.
*   **Circulation Lock:** Staking requires a minimum lock-up period, effectively removing tokens from the liquid market.

### C. STAKE (Security & Governance)
*   **Auditor Minimum Stake:** 1,000 AGRI (Required to participate in verification).
*   **Validator Nodes:** Institutional nodes require a significant stake to ensure network security and consensus integrity.

## 3. Smart Contract Directory

| Contract Name | Purpose | Address (Mainnet) |
| :--- | :--- | :--- |
| **AGRI Token** | Core ERC-20 Logic & Distribution | `0xbE85Cf9DDB93d9ea677e95599779B400437899E8` |
| **Staking Engine** | Manages yields and asset locking | `0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D` |
| **Data Anchor** | Links supply chain batches to the ledger | `0x8B922711ca6937e2A7697472097721867142488c` |
| **Reputation Module** | Tracks auditor reliability on-chain | `0x2e069D1574044A526E859E859E859E859E859E85` |

## 4. Distribution (Genesis)
The initial distribution was performed through the **Null Address** (`0x0000000000000000000000000000000000000000`) at block height 1. 
*   **Ecosystem Reserve:** 70% (Audit rewards, community incentives)
*   **Strategic Partners:** 15% (Validators & Infrastructure nodes)
*   **Development Fund:** 10% (R&D, Academic research support)
*   **Initial Liquidity:** 5% (Platform launch)

---
*Last Updated: 2026-05-10*
*Institutional Reference: fwd LIFEchain Foundation*
