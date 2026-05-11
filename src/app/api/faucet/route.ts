import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import FWDTokenArtifact from '@/artifacts/contracts/FWDToken.sol/FWDToken.json';
import { supabaseService as supabase } from '@/lib/supabase-service';
import { RPC_URL, GREEN_TOKEN_ADDRESS } from '@/lib/contracts/config';

const OPERATOR_PRIVATE_KEY = process.env.BRIDGE_OPERATOR_PRIVATE_KEY || process.env.OPERATOR_PRIVATE_KEY;
const TOKEN_ADDRESS = process.env.GREEN_TOKEN_ADDRESS || process.env.FWD_TOKEN_ADDRESS || GREEN_TOKEN_ADDRESS;
const COOLDOWN_HOURS = 1;

export async function POST(request: Request) {
  try {
    const { address } = await request.json();
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    // Persistent Rate Limiting Logic via Supabase
    const { data: lastClaim } = await supabase
      .from('token_transactions')
      .select('created_at')
      .ilike('receiver_address', address)
      .eq('type', 'FAUCET')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastClaim) {
      const msSince = Date.now() - new Date(lastClaim.created_at).getTime();
      const cooldownMs = COOLDOWN_HOURS * 60 * 60 * 1000;
      if (msSince < cooldownMs) {
        const remainingMinutes = Math.ceil((cooldownMs - msSince) / (60 * 1000));
        return NextResponse.json({ error: `You have already claimed tokens recently. Please wait ${remainingMinutes} minutes before requesting again.` }, { status: 429 });
      }
    }

    if (!OPERATOR_PRIVATE_KEY || !RPC_URL) {
      return NextResponse.json({ error: 'Server configuration error: Private key or RPC URL missing' }, { status: 500 });
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(OPERATOR_PRIVATE_KEY, provider);
    const tokenContract = new ethers.Contract(TOKEN_ADDRESS, FWDTokenArtifact.abi, wallet);

    const amount = ethers.parseUnits("1000", 18);
    
    // 1. Send Native Gas (GRE)
    console.log(`[Faucet] Sending native gas to ${address}...`);
    try {
      const gasTx = await wallet.sendTransaction({
        to: address,
        value: ethers.parseEther("0.1") // 0.1 GRE is enough for many transactions
      });
      await gasTx.wait();
    } catch (gasErr) {
      console.warn("[Faucet] Native gas transfer failed (might be gas-less node?):", gasErr);
    }

    // 2. Mint ERC-20 Tokens
    console.log(`[Faucet] Minting tokens for ${address}...`);
    const tx = await tokenContract.mint(address, amount);
    await tx.wait();

    // Record the claim time on success in database
    await supabase.from('token_transactions').insert([{
      receiver_address: address.toLowerCase(),
      amount: 1000,
      type: 'FAUCET',
      description: 'System Faucet Claim'
    }]);

    return NextResponse.json({ success: true, txHash: tx.hash, amount: "1000" });
  } catch (err: any) {
    console.error('Faucet error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
