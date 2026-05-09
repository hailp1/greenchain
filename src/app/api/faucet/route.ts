import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import FWDTokenArtifact from '@/artifacts/contracts/FWDToken.sol/FWDToken.json';

const RPC_URL = process.env.RPC_URL || "http://localhost:8545";
const OPERATOR_PRIVATE_KEY = process.env.OPERATOR_PRIVATE_KEY;
const TOKEN_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

export async function POST(request: Request) {
  try {
    const { address } = await request.json();
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    if (!OPERATOR_PRIVATE_KEY) {
      return NextResponse.json({ error: 'Server configuration error: Private key missing' }, { status: 500 });
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
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
