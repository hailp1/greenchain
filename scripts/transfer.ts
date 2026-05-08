import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  const recipient = "0x9f51163eCAF618ca4d1977fF71C962AeaaF43ee5";
  const amount = ethers.parseEther("1000");
  
  // Hardcoded from current config.ts
  const tokenAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
  
  const token = await ethers.getContractAt("FWDToken", tokenAddress);
  
  console.log(`Sending 1,000 AGRI to ${recipient}...`);
  const tx = await token.transfer(recipient, amount);
  await tx.wait();
  
  console.log(`✅ Success! Hash: ${tx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
