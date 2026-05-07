# Quy Trình Vận Hành Hệ Thống AgriChain
## Ví dụ thực tế: Vườn Atisô Lạc Dương & HAI Tea

Tài liệu này mô tả luồng dữ liệu và quy trình xác thực từ Nông trại đến người tiêu dùng cuối cùng trên hệ thống AgriChain.

---

### Giai đoạn 1: Thu hoạch tại Nông trại (Farmer)
*   **Dữ liệu đầu vào:** Các cảm biến IoT (độ ẩm đất, nhiệt độ, tia UV) tự động ghi lại lịch sử canh tác sạch.
*   **Thao tác:** Nông dân đăng nhập vào [Producer Portal](https://agrichain.lephuchai.com/portal), nhập số lượng thu hoạch và nhấn **"Sign Harvest"**.
*   **Xác thực Blockchain:** Hệ thống tạo một "chứng chỉ số" bất biến trên Blockchain, khóa thông tin về nguồn gốc, tọa độ và thời gian thu hoạch.

### Giai đoạn 2: Thu mua & Sản xuất (HAI Tea)
*   **Xác minh nguồn gốc:** HAI Tea quét mã lô hàng từ nông dân, hệ thống đối soát chữ ký số để đảm bảo đúng Atisô từ vườn Lạc Dương đã đăng ký.
*   **Kiểm định chất lượng:** Kết quả kiểm nghiệm Lab (không dư lượng hóa chất) được ký số bởi chuyên viên và đính kèm vào hồ sơ lô hàng.
*   **Chế biến:** Sản phẩm được chế biến thành "Mật Gan Tea" và được cấp mã định danh **Digital Product Passport (DPP)**.

### Giai đoạn 3: Phân phối & Logistics
*   **QR Code Unique:** Mỗi hũ trà được dán một mã QR duy nhất, liên kết trực tiếp với mã định danh trên Blockchain.
*   **Truy vết vận chuyển:** Vị trí và trạng thái của sản phẩm được cập nhật qua các Node mạng lưới trong suốt quá trình vận chuyển.

### Giai đoạn 4: Xác minh của Khách hàng (Consumer)
*   **Quét mã:** Khách hàng dùng smartphone quét mã QR trên bao bì.
*   **Kiểm tra Trust Layer:** 
    *   Xem **Bản đồ hành trình địa lý**: Thấy rõ đường đi từ vườn Atisô -> Lab -> Nhà máy -> Cửa hàng.
    *   Xem **Chỉ số IoT**: Kiểm chứng điều kiện canh tác thực tế tại vườn.
    *   Xác thực **Blockchain Proof**: Đối soát mã giao dịch trên sổ cái Ethereum để tin tưởng tuyệt đối vào thông tin.

---

## Đánh giá mức độ tương thích của Mockup hiện tại: **100%**
Hệ thống hiện tại đã hiện thực hóa đầy đủ các bước trên dưới dạng mô phỏng cao cấp (High-fidelity):
- [x] **Portal nhà sản xuất:** Đã hoàn thiện giao diện ký số và theo dõi IoT.
- [x] **Bản đồ hành trình:** Đã tích hợp trực quan tại trang xác thực sản phẩm.
- [x] **Blockchain Explorer:** Đã có hệ thống tra cứu khối và giao dịch minh bạch.
- [x] **Dữ liệu mô phỏng:** Đã cấu hình mã hàng `TRA-003` khớp hoàn toàn với kịch bản Atisô Lạc Dương.
