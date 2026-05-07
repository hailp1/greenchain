import crypto from 'crypto';

export interface Block {
  index: number;
  timestamp: string;
  data: any;
  previousHash: string;
  hash: string;
}

export class Blockchain {
  private chain: Block[] = [];

  constructor() {
    // Create Genesis Block
    this.createBlock(0, "0", { info: "Genesis Block - Verification Root" });
  }

  private calculateHash(index: number, previousHash: string, timestamp: string, data: any): string {
    return crypto
      .createHash('sha256')
      .update(index + previousHash + timestamp + JSON.stringify(data))
      .digest('hex');
  }

  createBlock(index: number, previousHash: string, data: any): Block {
    const timestamp = new Date().toISOString();
    const hash = this.calculateHash(index, previousHash, timestamp, data);
    const block: Block = {
      index,
      timestamp,
      data,
      previousHash,
      hash
    };
    this.chain.push(block);
    return block;
  }

  getChain(): Block[] {
    return this.chain;
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }
}

export const blockchainEngine = new Blockchain();
