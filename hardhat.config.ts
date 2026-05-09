import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    hardhat: {
      chainId: 300489,
    },
    localhost: {
      url: "http://127.0.0.1:8546",
      chainId: 300489,
    },
    // When ready for testnet, uncomment and configure:
    // sepolia: {
    //   url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
    //   accounts: [process.env.PRIVATE_KEY!],
    // },
    // bscTestnet: {
    //   url: "https://data-seed-prebsc-1-s1.binance.org:8545",
    //   chainId: 97,
    //   accounts: [process.env.PRIVATE_KEY!],
    // },
  },
};

export default config;
