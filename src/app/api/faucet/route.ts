import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import FWDTokenArtifact from '@/artifacts/contracts/FWDToken.sol/FWDToken.json';

const RPC_URL = process.env.RPC_URL || "https://rpc.fwdlife.vn";
const OPERATOR_PRIVATE_KEY = process.env.BRIDGE_OPERATOR_PRIVATE_KEY || process.env.OPERATOR_PRIVATE_KEY;
const TOKEN_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

export async function POST(request: Request) {
  try {
    const { address } = await request.json();
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    if (!OPERATOR_PRIVATE_KEY || !process.env.RPC_URL) {
      return NextResponse.json({ error: 'Server configuration error: Private key or RPC URL missing' }, { status: 500 });
    }

    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(OPERATOR_PRIVATE_KEY, provider);
    const tokenContract = new ethers.Contract(TOKEN_ADDRESS, FWDTokenArtifact.abi, wallet);

    const amount = ethers.parseUnits("1000", 18);
    
    // Check balance of operator first
    const operatorBalance = await tokenContract.balanceOf(wallet.address);
    if (operatorBalance < amount) {
        return NextResponse.json({ error: 'Faucet is empty' }, { status: 500 });
    }

    const tx = await tokenContract.mint(address, amount);
    await tx.wait();

    return NextResponse.json({ success: true, txHash: tx.hash, amount: "1000" });
  } catch (err: any) {
    console.error('Faucet error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
