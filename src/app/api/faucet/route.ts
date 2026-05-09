import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import FWDTokenArtifact from '@/artifacts/contracts/FWDToken.sol/FWDToken.json';

const RPC_URL = "https://rpc.fwdlife.vn";
const OPERATOR_PRIVATE_KEY = process.env.BRIDGE_OPERATOR_PRIVATE_KEY || process.env.OPERATOR_PRIVATE_KEY;
const TOKEN_ADDRESS = process.env.FWD_TOKEN_ADDRESS || "0xbE85Cf9DDB93d9ea677e95599779B400437899E8";

export async function POST(request: Request) {
  try {
    const { address } = await request.json();
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    if (!OPERATOR_PRIVATE_KEY || !RPC_URL) {
      return NextResponse.json({ error: 'Server configuration error: Private key or RPC URL missing' }, { status: 500 });
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(OPERATOR_PRIVATE_KEY, provider);
    const tokenContract = new ethers.Contract(TOKEN_ADDRESS, FWDTokenArtifact.abi, wallet);

    const amount = ethers.parseUnits("1000", 18);
    
    // 1. Send Native Gas (AGRI)
    console.log(`[Faucet] Sending native gas to ${address}...`);
    try {
      const gasTx = await wallet.sendTransaction({
        to: address,
        value: ethers.parseEther("0.1") // 0.1 AGRI is enough for many transactions
      });
      await gasTx.wait();
    } catch (gasErr) {
      console.warn("[Faucet] Native gas transfer failed (might be gas-less node?):", gasErr);
    }

    // 2. Mint ERC-20 Tokens
    console.log(`[Faucet] Minting tokens for ${address}...`);
    const tx = await tokenContract.mint(address, amount);
    await tx.wait();

    return NextResponse.json({ success: true, txHash: tx.hash, amount: "1000" });
  } catch (err: any) {
    console.error('Faucet error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
