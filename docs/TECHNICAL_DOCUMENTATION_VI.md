# Tài liệu Mô tả Chức năng Dự án fwd LIFEchain (Green Chain)

## 1. Tổng quan Dự án
**fwd LIFEchain** là một nền taching Blockchain chuyên dụng cho lĩnh vực nông nghiệp (Agritech), được thiết kế để giải quyết bài toán minh bạch nguồn gốc sản phẩm. Dự án kết hợp giữa công nghệ Blockchain tiên tiến và các lý thuyết kinh tế/hành vi người tiêu dùng (S-O-R Framework) để xây dựng niềm tin cho nông sản Việt.

---

## 2. Các Phân hệ Chức năng Chính

### 2.1. Hệ thống Truy xuất Nguồn gốc (Verification & PoO)
Đây là hạt nhân của dự án, sử dụng giao thức **ST-PoO (Smart Trust Proof of Origin)**.
*   **Xác thực QR Code:** Cho phép người dùng quét mã QR trên sản phẩm để kiểm tra nguồn gốc.
*   **Bằng chứng Nguồn gốc (PoO):** Hiển thị dữ liệu thời gian thực từ IoT, vị trí địa lý (Geo-fencing) và sự đồng thuận xã hội để chứng minh sản phẩm thực sự đến từ nơi đã công bố.
*   **Quản lý Lô hàng (Batch Management):** Quản lý thông tin chi tiết từng đợt nông sản, từ ngày thu hoạch đến quy trình đóng gói.

### 2.2. Blockchain Explorer (Trình khám phá mạng lưới)
Một công cụ trực quan giúp người dùng và chuyên gia theo dõi hoạt động của mạng lưới Blockchain AGRI.
*   **Theo dõi Giao dịch:** Xem chi tiết các giao dịch (Transactions) theo thời gian thực.
*   **Kiểm tra Khối (Blocks):** Hiển thị các khối dữ liệu đã được xác thực trên mạng lưới.
*   **Địa chỉ & Số dư:** Tra cứu thông tin ví và số dư token AGRI.
*   **Đồng bộ dữ liệu (Sync):** Hệ thống tự động đồng bộ dữ liệu từ chuỗi (On-chain) về cơ sở dữ liệu Supabase để truy vấn nhanh.

### 2.3. Cổng thông tin Tài chính & Staking (Portal)
Nơi người dùng tương tác với tài sản số (AGRI Token).
*   **Staking:** Cho phép người dùng đặt cọc token AGRI để nhận thưởng hoặc tham gia vào cơ chế bảo mật mạng lưới.
*   **Claiming:** Nhận phần thưởng từ hoạt động Staking hoặc các chiến dịch của hệ thống.
*   **Transfer:** Chuyển đổi và gửi nhận token giữa các ví trong hệ thống.
*   **Faucet:** Hệ thống vòi cấp phát token thử nghiệm cho mục đích test hệ thống.

### 2.4. Hệ thống Danh tiếng & Tin tức (Reputation & News)
*   **Reputation Score:** Đánh giá độ tin cậy của các thực thể (HTX, nông dân, doanh nghiệp) dựa trên tính nhất quán của dữ liệu cung cấp.
*   **Insights & News:** Cổng thông tin cập nhật các nghiên cứu khoa học, chiến dịch "Số hóa nông sản" và các xu hướng Mar-Tech mới nhất.

---

## 3. Kiến trúc Công nghệ (Technical Stack)

*   **Frontend:** Next.js 15+ (App Router), Tailwind CSS, Framer Motion (hiệu ứng mượt mà).
*   **Backend & API:** Next.js API Routes (Serverless Functions).
*   **Database:** Supabase (PostgreSQL) + Real-time subscriptions.
*   **Blockchain Integration:** 
    *   Hợp đồng thông minh (Smart Contracts) viết bằng Solidity (Hardhat).
    *   Tích hợp thư viện Ethers.js để tương tác với mạng lưới.
    *   Hỗ trợ đa chuỗi (Ethereum, BSC, Cosmos SDK).
*   **Authentication:** Google OAuth qua Supabase Auth.

---

## 4. Giá trị Nghiên cứu & Học thuật
Dự án không chỉ là một ứng dụng kỹ thuật mà còn là một nền tảng thực nghiệm cho luận án tiến sĩ:
*   Áp dụng **Lý thuyết Tín hiệu (Signaling Theory)** vào lĩnh vực nông nghiệp.
*   Sử dụng mô hình **S-O-R (Stimulus-Organism-Response)** để đo lường mức độ tin tưởng và ý định mua hàng của người dùng khi tiếp cận dữ liệu Blockchain.
*   Thu thập dữ liệu thực tế để phục vụ phân tích mô hình cấu trúc tuyến tính (SEM).

---
*Tài liệu này được cập nhật tự động dựa trên cấu trúc mã nguồn hiện tại của dự án.*
