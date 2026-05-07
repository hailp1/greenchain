# TÓM TẮT HỆ THỐNG XÁC MINH (BLOCKCHAIN VERIFICATION SYSTEM)

**Mục tiêu:** Xây dựng hệ thống xác minh nguồn gốc chung (Generic Verification System) dựa trên Blockchain và AI, có thể áp dụng cho nhiều loại sản phẩm khác nhau.

## 1. Sản phẩm Demo (Case Study)
*   **Sản phẩm chính:** Nước Yến (Bird's Nest) - Tập trung vào việc xác minh nguồn gốc tổ yến, quy trình chưng cất và kiểm định chất lượng.
*   **Khả năng mở rộng:** Hệ thống được thiết kế để dễ dàng thay đổi nhóm sản phẩm (Nông sản, Thực phẩm chức năng, Hàng xa xỉ) thông qua cấu hình database.

## 2. Công nghệ Lưu trữ (Mockup Storage)
*   Sử dụng mô hình **NoSQL** giả lập.
*   Dữ liệu được lưu trữ dưới dạng các đối tượng JSON linh hoạt, cho phép thay đổi cấu trúc sản phẩm mà không cần thay đổi schema cứng nhắc.

## 3. Các Thành phần Cốt lõi
*   **General Blockchain Ledger:** Lưu trữ các dấu vết (tracks) của sản phẩm.
*   **Dynamic Product Schema:** Định nghĩa các thuộc tính riêng cho từng loại sản phẩm (ví dụ: Nước Yến có độ đạm, Nông sản có chứng chỉ VietGAP).
*   **AI Verification Logic:** Đánh giá tính minh bạch dựa trên dữ liệu thu thập được.

---
*Ghi chú: Bản mockup này sẽ ưu tiên tính linh hoạt và khả năng tùy biến sản phẩm cao.*
