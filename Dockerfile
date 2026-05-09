# Dockerfile for FWD Blockchain Node ONLY
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
# Chỉ cài các dependencies cần thiết cho Hardhat
RUN apk add --no-cache netcat-openbsd
RUN npm install

COPY . .

# Mở cổng 8545 cho RPC Blockchain
EXPOSE 8545

# Chạy Hardhat Node với cấu hình cố định 31337
CMD npx hardhat node --hostname 0.0.0.0
