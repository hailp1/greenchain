import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  const recipient = "0x9f51163eCAF618ca4d1977fF71C962AeaaF43ee5";
  
  // 1. Gửi 10 ETH làm phí gas
  const [deployer] = await ethers.getSigners();
  console.log("Gửi 10 ETH phí gas...");
  await deployer.sendTransaction({
    to: recipient,
    value: ethers.parseEther("10.0"),
  });

  // 2. Gửi thêm 10,000 AGRI
  const tokenAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
  const token = await ethers.getContractAt("FWDToken", tokenAddress);
  console.log("Gửi thêm 10,000 AGRI...");
  await token.mint(recipient, ethers.parseEther("10000"));
  
  console.log(`✅ Đã xong! Hãy kiểm tra MetaMask mạng fwd LIFEchain.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
