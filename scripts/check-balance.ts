import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  const [deployer] = await ethers.getSigners();
  const tokenAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  
  const ethBalance = await ethers.provider.getBalance(deployer.address);
  const token = await ethers.getContractAt("FWDToken", tokenAddress);
  const tokenBalance = await token.balanceOf(deployer.address);
  
  console.log(`--- KẾT QUẢ KIỂM TRA TÀI KHOẢN TỔNG ---`);
  console.log(`Địa chỉ: ${deployer.address}`);
  console.log(`Số dư ETH: ${ethers.formatEther(ethBalance)} ETH`);
  console.log(`Số dư AGRI: ${ethers.formatEther(tokenBalance)} AGRI`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
