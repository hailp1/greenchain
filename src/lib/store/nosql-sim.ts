/**
 * NoSQL-style Storage Simulation
 * This module provides a simple interface to manage dynamic agricultural product data.
 */

export interface BlockchainNode {
  id?: string;
  type: 'FARM' | 'LAB' | 'PROCESSING' | 'LOGISTICS' | 'RETAIL';
  title: string;
  location: string;
  coordinates: string;
  timestamp: string;
  documents: { name: string; url: string }[];
  images: string[];
  description: string;
  hash: string;
  txHash?: string;
  blockNumber?: number;
  gasUsed?: string;
  telemetry?: {
    label: string;
    unit: string;
    data: { time: string; value: number }[];
  }[];
}

export interface Transaction {
  hash: string;
  blockNumber: number;
  from: string;
  to: string;
  value: string;
  timestamp: string;
  status: 'Success' | 'Pending' | 'Failed';
  gasUsed: string;
  gasPrice: string;
  nonce: number;
  inputData?: string;
}

export interface Block {
  number: number;
  hash: string;
  parentHash: string;
  validator: string;
  timestamp: string;
  transactionCount: number;
  size: string;
  gasUsed: string;
  gasLimit: string;
  reward: string;
  baseFeePerGas: string;
}

export interface Product {
  id: string;
  category: string;
  name: string;
  image?: string;
  attributes: Record<string, any>;
  sustainability?: {
    score: number;
    carbon_footprint: string;
    water_saved: string;
    social_impact: string;
    ai_insight: string;
  };
  nodes: BlockchainNode[];
}

class NoSQLSim {
  private collections: Record<string, any[]> = {
    blocks: [
      { number: 19482415, hash: "0x8e...2f", parentHash: "0x7a...1e", validator: "Node_Omega_99", timestamp: "2026-04-15T09:05:00Z", transactionCount: 156, size: "1.4 MB", gasUsed: "15,200,000", gasLimit: "30,000,000", reward: "2.18 ETH", baseFeePerGas: "13.2 Gwei" },
      { number: 19482412, hash: "0x8e2f0b4e6d8c0a2f4b6e8d0c2a4f6b8e0d4c6a2f8b0e4d6c8a2f0b4e6d8c0a2f", parentHash: "0x7a2f0b4e6d8c0a2f4b6e8d0c2a4f6b8e0d4c6a2f8b0e4d6c8a2f0b4e6d8c0a1e", validator: "Node_Alpha_77", timestamp: "2026-04-15T09:00:00Z", transactionCount: 142, size: "1.2 MB", gasUsed: "14,820,109", gasLimit: "30,000,000", reward: "2.14 ETH", baseFeePerGas: "12.5 Gwei" },
      { number: 19482411, hash: "0x3d...f2", parentHash: "0x2c...e1", validator: "Node_Zeta_15", timestamp: "2026-04-15T08:58:00Z", transactionCount: 88, size: "0.7 MB", gasUsed: "8,500,000", gasLimit: "30,000,000", reward: "2.01 ETH", baseFeePerGas: "11.8 Gwei" },
      { number: 19482289, hash: "0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0", parentHash: "0x8b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b9c", validator: "Node_Beta_12", timestamp: "2026-04-13T09:00:00Z", transactionCount: 98, size: "0.8 MB", gasUsed: "9,210,442", gasLimit: "30,000,000", reward: "1.98 ETH", baseFeePerGas: "10.2 Gwei" },
      { number: 19482155, hash: "0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4", parentHash: "0x2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b", validator: "Node_Gamma_05", timestamp: "2026-04-12T14:20:00Z", transactionCount: 215, size: "2.1 MB", gasUsed: "22,540,112", gasLimit: "30,000,000", reward: "3.5 ETH", baseFeePerGas: "15.8 Gwei" }
    ],
    network_stats: [
      {
        price: "$1.42",
        price_change: "+2.4%",
        market_cap: "$2.5B",
        tps: "14.2",
        gas_price: "12 Gwei",
        total_blocks: "19,482,415",
        total_txns: "500,214,882",
        validators: "128 Active",
        nodes_online: "1,024",
        daily_volume: "45,000 AGRI"
      }
    ],
    latest_blocks: [
      { height: 19482415, timestamp: "5s ago", txns: 156, validator: "Node_Omega_99", reward: "2.18 ETH", size: "1.4 MB" },
      { height: 19482412, timestamp: "1m ago", txns: 142, validator: "Node_Alpha_77", reward: "2.14 ETH", size: "1.2 MB" },
      { height: 19482411, timestamp: "3m ago", txns: 88, validator: "Node_Zeta_15", reward: "2.01 ETH", size: "0.7 MB" },
      { height: 19482289, timestamp: "1d ago", txns: 98, validator: "Node_Beta_12", reward: "1.98 ETH", size: "0.8 MB" },
      { height: 19482155, timestamp: "2d ago", txns: 215, validator: "Node_Gamma_05", reward: "3.5 ETH", size: "2.1 MB" }
    ],
    transactions: [
      { hash: "0x7d2a8b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a", blockNumber: 19482041, from: "0xFarmer_NH_442", to: "0xAgri_V3", value: "0 ETH", timestamp: "2026-04-10T08:30:00Z", status: "Success", gasUsed: "21,000", gasPrice: "12.5 Gwei", nonce: 142, inputData: "0x48656c6c6f2041677269436861696e" },
      { hash: "0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4", blockNumber: 19482155, from: "0xLab_HCM_881", to: "0xAgri_V3", value: "0 ETH", timestamp: "2026-04-12T14:20:00Z", status: "Success", gasUsed: "45,210", gasPrice: "15.8 Gwei", nonce: 88, inputData: "0x50726f7465696e20436f6e74656e74" },
      { hash: "0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0", blockNumber: 19482289, from: "0xLog_CL_55", to: "0xAgri_V3", value: "0 ETH", timestamp: "2026-04-13T09:00:00Z", status: "Success", gasUsed: "32,840", gasPrice: "10.2 Gwei", nonce: 21, inputData: "0x54656d70657261747572653a203132" },
      { hash: "0x5e1bd9c4a6f2b8e0d4c6a2f8b0e4d6c8a2f0b4e6d8c0a2f4b6e8d0c2a4f6b8e0", blockNumber: 19482412, from: "0xRetail_Q3_01", to: "0xAgri_V3", value: "0 ETH", timestamp: "2026-04-15T09:00:00Z", status: "Success", gasUsed: "18,900", gasPrice: "12.5 Gwei", nonce: 12, inputData: "0x417272697665642061742053686f77726f6f6d" },
      { hash: "0x1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2", blockNumber: 19482415, from: "0xOracle_Weather_01", to: "0xAgri_V3", value: "0 ETH", timestamp: "2026-04-15T09:05:00Z", status: "Success", gasUsed: "12,400", gasPrice: "13.2 Gwei", nonce: 5, inputData: "0x576561746865723a20436c656172" }
    ],
    latest_transactions: [
      { hash: "0x1f2a...f2", timestamp: "5s ago", from: "0xOracle_W", to: "0xAgri_V3", value: "0 ETH", fee: "0.0002 ETH" },
      { hash: "0x5e1b...e0", timestamp: "1m ago", from: "0xRetail_3", to: "0xAgri_V3", value: "0 ETH", fee: "0.0003 ETH" },
      { hash: "0x9c0d...c0", timestamp: "1d ago", from: "0xLog_CL", to: "0xAgri_V3", value: "0 ETH", fee: "0.0006 ETH" },
      { hash: "0x3a4b...a4", timestamp: "2d ago", from: "0xLab_HCM", to: "0xAgri_V3", value: "0 ETH", fee: "0.0008 ETH" }
    ],
    products: [
      {
        id: "YEN-001",
        category: "Yến Sào",
        name: "Yến Sào Tinh Chế Thượng Hạng",
        image: "/assets/packaging.png",
        attributes: {
          origin: "Khánh Hòa",
          weight: "100g",
          purity: "99.9%",
          grade: "AAA",
          blockchain: "Ethereum (ERC-721)",
          smart_contract: "0x7a2d...f9e1"
        },
        sustainability: {
          score: 98,
          carbon_footprint: "0.2kg CO2e",
          water_saved: "450L",
          social_impact: "Tạo 50 việc làm địa phương",
          ai_insight: "Dựa trên phân tích từ Blockchain, sản phẩm này đạt tiêu chuẩn khai thác bền vững. Quy trình không sử dụng hóa chất và bảo tồn hệ sinh thái hang yến tự nhiên tại Ninh Hòa."
        },
        nodes: [
          {
            id: "node-1",
            type: 'FARM',
            title: "Nhà Yến Ninh Hòa",
            location: "Ninh Hòa, Khánh Hòa",
            coordinates: "12.4844° N, 109.1309° E",
            timestamp: "2026-04-10T08:30:00Z",
            documents: [
              { name: "Chứng nhận GlobalGAP #GG-8812", url: "#" },
              { name: "Nhật ký khai thác số 45", url: "#" }
            ],
            images: [
              "https://images.unsplash.com/photo-1590402444816-a1284b33e1d1?w=800&q=80",
              "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"
            ],
            description: "Thu hoạch từ hệ thống nhà yến đạt chuẩn bảo tồn tự nhiên, không can thiệp vào chu kỳ sinh sản của yến.",
            hash: "0x8f3a74b1e4a6d9c8b2f1e0a3d5c7b9a8f2e4d6c8b0a2f4e6d8c0b2a4f6e8d0c2",
            txHash: "0x7d2a8b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a",
            blockNumber: 19482041,
            gasUsed: "21,000"
          },
          {
            id: "node-2",
            type: 'LAB', // Wait, previous code had LAB as node-2 in the view_file but my earlier edit tried to make it PROCESSING. Let's stick to the current file state.
            title: "Trung Tâm Kiểm Định NCS",
            location: "Quận 1, TP.HCM",
            coordinates: "10.7769° N, 106.7009° E",
            timestamp: "2026-04-12T14:20:00Z",
            documents: [
              { name: "Kết quả kiểm tra độ đạm Eurofins", url: "#" },
              { name: "Chứng nhận ATVSTP #AT-112", url: "#" }
            ],
            images: [
              "https://images.unsplash.com/photo-1579152276502-745f4685c807?w=800&q=80",
              "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80"
            ],
            description: "Phân tích hàm lượng protein (60%+) và độ tinh khiết tuyệt đối, không tạp chất.",
            hash: "0x2d9ca1f3b5e7d9c1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9",
            txHash: "0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4",
            blockNumber: 19482155,
            gasUsed: "45,210",
            telemetry: [
              {
                label: "Nhiệt độ phòng Lab",
                unit: "°C",
                data: [
                  { time: "14:00", value: 24.2 },
                  { time: "14:10", value: 24.5 },
                  { time: "14:20", value: 24.1 }
                ]
              }
            ]
          },
          {
            id: "node-3",
            type: 'LOGISTICS',
            title: "Vận Chuyển Lạnh Đảm Bảo",
            location: "Kho Phân Phối Cát Lái",
            coordinates: "10.7625° N, 106.7536° E",
            timestamp: "2026-04-13T09:00:00Z",
            documents: [
              { name: "Biên bản bàn giao kho lạnh", url: "#" },
              { name: "Lịch trình GPS #TR-442", url: "#" }
            ],
            images: [
              "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
              "https://images.unsplash.com/photo-1591768793355-74d7ca736056?w=800&q=80"
            ],
            description: "Đóng gói chân không và vận chuyển nhiệt độ chuẩn duy trì dưới 15 độ C.",
            hash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
            txHash: "0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0",
            blockNumber: 19482289,
            gasUsed: "32,840",
            telemetry: [
              {
                label: "Nhiệt độ thùng lạnh",
                unit: "°C",
                data: [
                  { time: "07:00", value: 12.5 },
                  { time: "08:00", value: 13.2 },
                  { time: "09:00", value: 12.8 }
                ]
              },
              {
                label: "Độ ẩm",
                unit: "%",
                data: [
                  { time: "07:00", value: 45 },
                  { time: "08:00", value: 46 },
                  { time: "09:00", value: 45 }
                ]
              }
            ]
          },
          {
            id: "node-4",
            type: 'RETAIL',
            title: "Showroom Premium",
            location: "Quận 3, TP.HCM",
            coordinates: "10.7825° N, 106.6836° E",
            timestamp: "2026-04-15T09:00:00Z",
            documents: [
              { name: "Hóa đơn VAT điện tử", url: "#" },
              { name: "Chứng nhận đại lý ủy quyền", url: "#" }
            ],
            images: [
              "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
              "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
            ],
            description: "Sản phẩm đã có mặt tại showroom chính hãng, bảo quản trong tủ chuyên dụng.",
            hash: "0x5e1bd9c4a6f2b8e0d4c6a2f8b0e4d6c8a2f0b4e6d8c0a2f4b6e8d0c2a4f6b8e0",
            txHash: "0x2a4f6b8e0d4c6a2f8b0e4d6c8a2f0b4e6d8c0a2f4b6e8d0c2a4f6b8e0d4c6a2",
            blockNumber: 19482412,
            gasUsed: "18,900"
          }
        ]
      },
      {
        id: "CAFE-002",
        category: "Cà Phê",
        name: "Cà Phê Arabica Cầu Đất",
        attributes: {
          origin: "Đà Lạt, Lâm Đồng",
          roast: "Medium",
          altitude: "1600m",
          process: "Honey Process"
        },
        nodes: [
          {
            id: "node-5",
            type: 'FARM',
            title: "Farm Cầu Đất",
            location: "Xuân Trường, Đà Lạt",
            coordinates: "11.8544° N, 108.5309° E",
            timestamp: "2026-03-20T07:00:00Z",
            documents: [{ name: "Chứng nhận Organic", url: "#" }],
            images: ["https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80"],
            description: "Thu hoạch thủ công tại vùng nguyên liệu cao 1600m.",
            hash: "0x1a2bc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2"
          },
          {
            id: "node-6",
            type: 'PROCESSING',
            title: "Xưởng Rang Xay",
            location: "Khu Công Nghiệp Lộc Sơn",
            coordinates: "11.5321° N, 107.8214° E",
            timestamp: "2026-03-25T10:00:00Z",
            documents: [{ name: "Hồ sơ rang xay", url: "#" }],
            images: ["https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&q=80"],
            description: "Rang theo profile Medium Roast, phát triển hương vị hoa quả.",
            hash: "0x4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b"
          }
        ]
      },
      {
        id: "TRA-003",
        category: "Trà Thảo Mộc",
        name: "Mát Gang Tea - Atisô Đà Lạt",
        image: "/assets/matgang.png",
        attributes: {
          origin: "Lạc Dương, Lâm Đồng",
          weight: "50g (20 túi lọc)",
          process: "Sấy lạnh công nghệ cao",
          grade: "Premium Organic",
          blockchain: "Ethereum (ERC-721)",
          smart_contract: "0x9c3d...e4a2"
        },
        sustainability: {
          score: 95,
          carbon_footprint: "0.15kg CO2e",
          water_saved: "320L",
          social_impact: "Hỗ trợ 20 hộ nông dân dân tộc thiểu số",
          ai_insight: "Sản phẩm sử dụng công nghệ sấy lạnh tiết kiệm 40% năng lượng so với sấy nhiệt truyền thống. Vùng nguyên liệu đạt chuẩn GlobalGAP."
        },
        nodes: [
          {
            id: "node-7",
            type: 'FARM',
            title: "Nông trại Atisô Lạc Dương",
            location: "Lạc Dương, Lâm Đồng",
            coordinates: "11.9844° N, 108.4309° E",
            timestamp: "2026-04-01T06:00:00Z",
            documents: [
              { name: "Chứng nhận GlobalGAP #GG-7742", url: "#" },
              { name: "Chứng nhận Organic JAS", url: "#" }
            ],
            images: [
              "https://images.unsplash.com/photo-1515471209610-dae1c9a581c5?w=800&q=80",
              "https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=800&q=80"
            ],
            description: "Thu hoạch hoa Atisô vào sáng sớm để đảm bảo dược tính Cynarin cao nhất. Quy trình thu hoạch được giám sát bởi hệ thống IoT thời gian thực.",
            hash: "0x3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e",
            txHash: "0x3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e",
            telemetry: [
              {
                label: "Độ ẩm đất",
                unit: "%",
                data: [
                  { time: "05:00", value: 65.2 },
                  { time: "06:00", value: 64.8 },
                  { time: "07:00", value: 64.5 }
                ]
              },
              {
                label: "Nhiệt độ môi trường",
                unit: "°C",
                data: [
                  { time: "05:00", value: 16.2 },
                  { time: "06:00", value: 16.8 },
                  { time: "07:00", value: 18.2 }
                ]
              },
              {
                label: "Chỉ số UV",
                unit: "Index",
                data: [
                  { time: "05:00", value: 0.1 },
                  { time: "06:00", value: 0.5 },
                  { time: "07:00", value: 1.2 }
                ]
              }
            ]
          },
          {
            id: "node-8",
            type: 'PROCESSING',
            title: "Nhà máy Sấy Lạnh Đà Lạt",
            location: "Phường 12, Đà Lạt",
            coordinates: "11.9444° N, 108.4509° E",
            timestamp: "2026-04-03T09:00:00Z",
            documents: [
              { name: "Hồ sơ kỹ thuật sấy lạnh", url: "#" },
              { name: "Chứng nhận ISO 22000:2018", url: "#" }
            ],
            images: [
              "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800&q=80",
              "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80"
            ],
            description: "Chế biến bằng công nghệ sấy lạnh hiện đại giúp giữ nguyên màu sắc tự nhiên.",
            hash: "0x7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c"
          },
          {
            id: "node-9",
            type: 'RETAIL',
            title: "Hệ thống Farm-to-Table",
            location: "Quận 1, TP.HCM",
            coordinates: "10.7769° N, 106.7009° E",
            timestamp: "2026-04-10T08:00:00Z",
            documents: [
              { name: "Chứng nhận ATVSTP TP.HCM", url: "#" },
              { name: "Giấy phép lưu hành sản phẩm", url: "#" }
            ],
            images: [
              "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
              "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800&q=80"
            ],
            description: "Phân phối trực tiếp tại các cửa hàng nông sản hữu cơ cao cấp.",
            hash: "0x1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2"
          }
        ]
      }
    ]
  };

  async getCollection(name: string): Promise<any[]> {
    return this.collections[name] || [];
  }

  async findOne(collection: string, query: Record<string, any>): Promise<any | null> {
    const list = await this.getCollection(collection);
    return list.find(item => 
      Object.entries(query).every(([key, value]) => item[key] === value)
    ) || null;
  }
}

export const db = new NoSQLSim();
