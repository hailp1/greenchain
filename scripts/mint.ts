import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  const recipient = "0x9f51163eCAF618ca4d1977fF71C962AeaaF43ee5";
  const amount = ethers.parseEther("10000"); // Bơm 10k AGRI
  
  const tokenAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
  const token = await ethers.getContractAt("FWDToken", tokenAddress);
  
  console.log(`Minting 10,000 AGRI directly to ${recipient}...`);
  // Vì ví Deployer là Owner, ta có thể dùng hàm mint
  const tx = await token.mint(recipient, amount);
  await tx.wait();
  
  console.log(`✅ Thành công! Đã bơm 10,000 AGRI vào ví của bạn.`);
  console.log(`Giao dịch: ${tx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
