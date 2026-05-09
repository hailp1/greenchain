import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { createClient } from '@supabase/supabase-js';
import FWDAnchorArtifact from '@/artifacts/contracts/FWDAnchor.sol/FWDAnchor.json';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const RPC_URL = process.env.RPC_URL || "https://rpc.fwdlife.vn";
const OPERATOR_PRIVATE_KEY = process.env.BRIDGE_OPERATOR_PRIVATE_KEY;
const ANCHOR_ADDRESS = process.env.FWD_ANCHOR_ADDRESS || "0x368fAc3D5745a4E6319D443017F72761f830e33C";

export async function POST(request: Request) {
  try {
    const { entity_id, product_name, quantity, gps } = await request.json();

    if (!entity_id || !product_name || !quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Create batch in Supabase
    const { data: batch, error: bError } = await supabase
      .from('batches')
      .insert([{
        entity_id,
        product_name,
        quantity,
        gps,
        status: 'PENDING',
        timestamp: new Date().toISOString()
      }])
      .select()
      .single();

    if (bError) throw bError;

    // 2. Anchor to Blockchain
    if (RPC_URL && OPERATOR_PRIVATE_KEY) {
      try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(OPERATOR_PRIVATE_KEY, provider);
        const anchorContract = new ethers.Contract(ANCHOR_ADDRESS, FWDAnchorArtifact.abi, wallet);

        // Generate a hash of the batch data for anchoring
        const dataToHash = JSON.stringify({ id: batch.id, product_name, quantity, gps });
        const root = ethers.keccak256(ethers.toUtf8Bytes(dataToHash));

        const tx = await anchorContract.anchorRoot(root);
        const receipt = await tx.wait();

        // 3. Save to blockchain_ledger
        await supabase.from('blockchain_ledger').insert([{
            batch_id: batch.id,
            tx_hash: tx.hash,
            block_height: receipt.blockNumber,
            anchored_at: new Date().toISOString()
        }]);

        return NextResponse.json({ success: true, batchId: batch.id, txHash: tx.hash });
      } catch (anchorErr) {
        console.error('Anchoring failed, but batch saved:', anchorErr);
        // We still return success for the batch creation, but indicate the anchor is pending
        return NextResponse.json({ success: true, batchId: batch.id, txHash: null, warning: 'Blockchain anchor pending' });
      }
    }

    return NextResponse.json({ success: true, batchId: batch.id });

  } catch (err: any) {
    console.error('Batch creation error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
