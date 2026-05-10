# fwd LIFEchain: Institutional Tokenomics & Governance Framework (AGRI)

This document provides a comprehensive analysis and specification of the **Agri Life Token (AGRI)** economic model. Designed for sustainability, transparency, and institutional-grade supply chain verification.

## 1. Token Overview
*   **Token Name:** Agri Life Token
*   **Symbol:** AGRI
*   **Network:** fwd LIFEchain (Geth Proof-of-Authority)
*   **Standard:** ERC-20
*   **Initial Supply:** 18,200,015 AGRI
*   **Maximum Supply:** 10,000,000,000 AGRI (Fixed Cap)

## 2. Core Economic Mechanisms (V2.0)

### A. EARN (Incentive Structure)
1.  **Daily Staking Loyalty (Dynamic):** 
    *   Active users with a positive stake balance can claim a daily reward.
    *   **Formula:** `min(500, (UserStake * 0.1%))` AGRI.
    *   *Purpose:* Encourages higher staking commitment while controlling inflation for smaller holders.
2.  **Audit Verification Fees:**
    *   Auditors earn a fixed fee of **50 AGRI** per verified batch.
    *   Future scaling: Fees will be adjusted based on batch complexity and data volume.
3.  **Staking Yield (APR):**
    *   Target APR: **12.5%** annually, distributed from the Ecosystem Reserve.
    *   The Reserve is initially funded with 70% of the total supply.

### B. BURN & SINK (Deflationary Controls)
1.  **Gas Fee Destruction:**
    *   **30% of all AGRI gas fees** are permanently burned (sent to `0x00...000`).
    *   **70%** are distributed to Validator Nodes to cover infrastructure costs.
2.  **Slashing Protocol:**
    *   **Low Severity (Downtime):** 1% of stake slashed.
    *   **High Severity (Data Fraud):** 100% of stake slashed and burned.
3.  **Circulation Lock:**
    *   Minimum staking period: **14 Days**.
    *   Early withdrawal penalty: **10%** of principal (Burned).

### C. STAKE (Security & Governance)
1.  **Auditor Minimum Stake:** **5,000 AGRI**. (Adjusted from 1,000 to ensure skin-in-the-game).
2.  **Validator Node Stake:** **1,000,000 AGRI**.
3.  **Governance Voting Power:** `1 AGRI = 1 Vote`. Staked AGRI has a **2x multiplier** on voting weight.

## 3. Smart Contract Directory (Verified)

| Contract Name | Purpose | Verified Address |
| :--- | :--- | :--- |
| **AGRI Token** | Core Ledger & Distribution | `0xbE85Cf9DDB93d9ea677e95599779B400437899E8` |
| **Staking Engine** | Yield Management & Locking | `0x0023f9d1b513A290Dbd369B94B86Aa74E761e76B` |
| **Data Anchor** | Supply Chain Notarization | `0x368fAc3D5745a4E6319D443017F72761f830e33C` |

> [!CAUTION]
> Avoid interacting with contract `0x7a250...88D` as it is a third-party router and not part of the fwd LIFEchain ecosystem.

## 4. Distribution & Vesting Schedule

| Allocation | Percentage | Vesting Schedule |
| :--- | :--- | :--- |
| **Ecosystem Reserve** | 70% | 10% TGE, then 24-month linear vesting |
| **Strategic Partners** | 15% | 6-month cliff, then 18-month linear vesting |
| **Development Fund** | 10% | 12-month linear vesting for R&D |
| **Initial Liquidity** | 5% | 100% unlocked for platform launch |

---
*Last Updated: 2026-05-10*
*Document Version: 2.1 (Institutional Grade)*
