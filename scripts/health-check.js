const { ethers } = require('ethers');
require('dotenv').config();

async function checkStability() {
  const localRpc = "http://127.0.0.1:8545";
  const remoteRpc = process.env.RPC_URL || "https://rpc.fwdlife.vn";
  
  const targets = [localRpc, remoteRpc];
  
  for (const rpcUrl of targets) {
    console.log(`\n[Health Check] Testing: ${rpcUrl}`);
    try {
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const network = await provider.getNetwork();
      const blockNumber = await provider.getBlockNumber();
      console.log(`[Success] Chain ID: ${network.chainId.toString()} | Block: ${blockNumber}`);
      console.log(`[STATUS] Node at ${rpcUrl} is STABLE.`);
      return; // Exit if any node is stable
    } catch (error) {
      console.warn(`[Warning] Node at ${rpcUrl} is UNREACHABLE.`);
    }
  }

  console.error("\n[CRITICAL] All Green Chain Core endpoints are OFFLINE!");
  process.exit(1);
}

checkStability();
