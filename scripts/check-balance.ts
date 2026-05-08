import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  const account = "0x9f51163eCAF618ca4d1977fF71C962AeaaF43ee5";
  const tokenAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
  
  const token = await ethers.getContractAt("FWDToken", tokenAddress);
  const balance = await token.balanceOf(account);
  const name = await token.name();
  const symbol = await token.symbol();
  
  console.log(`--- KẾT QUẢ KIỂM TRA BLOCKCHAIN ---`);
  console.log(`Tên Token: ${name}`);
  console.log(`Ký hiệu: ${symbol}`);
  console.log(`Địa chỉ ví: ${account}`);
  console.log(`Số dư: ${ethers.formatUnits(balance, 18)} ${symbol}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
