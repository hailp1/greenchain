import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  const recipient = "0x9f51163eCAF618ca4d1977fF71C962AeaaF43ee5";
  const amount = ethers.parseEther("10000"); // Bơm 10k AGRI
  
  const tokenAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
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
