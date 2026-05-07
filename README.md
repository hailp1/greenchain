# GreenChain: Blockchain Supply Chain & Certification System

This repository contains the core components for the GreenChain system, a hybrid blockchain solution for supply chain traceability and digital certification.

## Architecture
- **Off-chain (Supabase)**: Stores raw data (batch details, images, entity profiles).
- **On-chain (Cosmos SDK)**: Stores immutable proofs (hashes) and Soulbound Tokens (certificates).
- **Bridge (Node.js)**: Synchronizes data by hashing database entries and anchoring them on the blockchain.

## Setup Instructions

### 1. Off-chain Database (Supabase)
1. Create a new project in Supabase.
2. Run the script in `supabase_schema.sql` in the SQL Editor.
3. Configure **Row Level Security (RLS)** as defined in the script.

### 2. Blockchain (Cosmos SDK)
1. Install [Ignite CLI](https://ignite.com/).
2. Create the chain: `ignite scaffold chain greenchain`.
3. Scaffold the traceability module: `ignite scaffold module traceability`.
4. Copy the files from `blockchain/` into your scaffolded project.
5. Run the chain: `ignite chain serve`.

### 3. Bridge Service
1. Navigate to the root directory.
2. Create a `.env` file:
   ```env
   SUPABASE_URL=your_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   COSMOS_RPC_URL=http://localhost:26657
   ```
3. Install dependencies: `npm install @supabase/supabase-js dotenv`.
4. Run the bridge: `node bridge.js`.

## API Flow
1. **Entity Registration**: Admin adds a farm/company to the `entities` table.
2. **Batch Creation**: Farm adds a record to the `batches` table.
3. **Anchoring**: Bridge automatically detects the new batch, hashes it, and sends it to the Cosmos blockchain.
4. **Verification**: Users scan a QR code (linked to the batch ID) and can verify the data against the `tx_hash` on the blockchain.
5. **Certification**: Admin issues an SBT certificate which is recorded both in Supabase and on-chain.
