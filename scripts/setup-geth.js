const ethers = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Generating Validator Accounts...");
  const validators = [];
  
  // Create 3 random wallets for the 3 Nodes
  for (let i = 1; i <= 3; i++) {
    const wallet = ethers.Wallet.createRandom();
    validators.push(wallet);
    console.log(`Node ${i} Address: ${wallet.address}`);
    // Save private key for node configuration
    const dir = path.join(__dirname, "..", "geth-network", `node${i}`, "keystore");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "private_key.txt"), wallet.privateKey.replace('0x', ''));
  }

  // Also include the bridge operator wallet (from Hardhat/Frontend) so you have initial funds
  // We'll use a standard test key to ensure you have money on the new chain
  const devAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  console.log("\nBuilding Genesis block for fwd LIFEchain (Chain ID: 300489)...");
  
  // Create the extradata string (32 bytes of vanity + concatenated validator addresses + 65 bytes signature)
  const vanity = "0x0000000000000000000000000000000000000000000000000000000000000000";
  const validatorAddresses = validators.map(v => v.address.replace('0x', '')).join('');
  const signatureSuffix = "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
  const extraData = vanity + validatorAddresses + signatureSuffix;

  const genesis = {
    "config": {
      "chainId": 300489,
      "homesteadBlock": 0,
      "eip150Block": 0,
      "eip155Block": 0,
      "eip158Block": 0,
      "byzantiumBlock": 0,
      "constantinopleBlock": 0,
      "petersburgBlock": 0,
      "istanbulBlock": 0,
      "berlinBlock": 0,
      "londonBlock": 0,
      "clique": {
        "period": 3,
        "epoch": 30000
      }
    },
    "difficulty": "1",
    "gasLimit": "30000000",
    "extradata": extraData,
    "alloc": {
      [devAddress]: { "balance": "1000000000000000000000000" } // 1,000,000 AGRI for dev testing
    }
  };

  validators.forEach(v => {
      genesis.alloc[v.address] = { "balance": "1000000000000000000000" }; // Give validators some gas
  });

  const genesisPath = path.join(__dirname, "..", "geth-network", "genesis.json");
  fs.writeFileSync(genesisPath, JSON.stringify(genesis, null, 2));
  
  console.log(`Genesis file created successfully at: ${genesisPath}`);
  console.log("Initialization complete!");
}

main().catch(console.error);
