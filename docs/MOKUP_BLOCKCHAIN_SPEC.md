# MÔ TẢ CHI TIẾT MOCKUP BLOCKCHAIN: HỆ THỐNG XÁC MINH CHUNG (V3)

Tài liệu này mô tả kiến trúc của hệ thống xác minh sản phẩm tổng quát, sử dụng công nghệ Blockchain giả lập và lưu trữ dạng NoSQL.

---

## 1. Kiến trúc Hệ thống (General Architecture)
Hệ thống không phụ thuộc vào một loại sản phẩm cụ thể. Mọi sản phẩm (ví dụ: **Nước Yến**) đều được quản lý thông qua một cấu trúc dữ liệu linh hoạt.

*   **Product ID:** Mã định danh duy nhất.
*   **Metadata (NoSQL style):** Chứa các thuộc tính tùy biến theo nhóm sản phẩm (độ tinh khiết, ngày thu hoạch, chứng chỉ, v.v.).
*   **Chain Data:** Lịch sử các bước xác minh được mã hóa (hashing).

---

## 2. Mô phỏng NoSQL Storage
Trong bản mockup, chúng ta sẽ sử dụng các file JSON hoặc `localStorage` để mô phỏng một database NoSQL (như MongoDB):

```json
// data/products.json
[
  {
    "id": "BIRD-NEST-001",
    "category": "Bird's Nest",
    "name": "Nước Yến Nguyên Chất",
    "attributes": {
      "purity": "98%",
      "protein_content": "32%",
      "origin": "Khánh Hòa"
    },
    "history_id": "CHAIN-BN-001"
  }
]
```

---

## 3. Các Phân hệ Chức năng

### 3.1. General Verification Page (Trang xác minh chung)
*   Chấp nhận bất kỳ mã định danh sản phẩm nào.
*   Tự động render giao diện dựa trên loại sản phẩm (Dynamic UI).
*   Hiển thị các "Chứng chỉ Kỹ thuật số" (Digital Certificates) được lưu trên Blockchain.

### 3.2. AI-Driven Trust Evaluation
*   AI phân tích dữ liệu NoSQL để đưa ra điểm số tin cậy (Trust Score).
*   Giải thích lý do: "Dữ liệu được xác thực bởi 3 bên độc lập trên chuỗi khối".

---

## 4. Giao diện & Trải nghiệm (UI/UX)
*   **Minimalist & High-Tech:** Sử dụng gam màu tối, phông chữ không chân hiện đại.
*   **Modular Design:** Các khối thông tin (Blocks) có thể linh hoạt thay đổi nội dung tùy theo loại sản phẩm đang được xác minh.

---

## 5. Cấu trúc Source Code (Next.js)

```text
/src
  /lib
    /store
      nosql-sim.ts      (Mô phỏng CRUD cho NoSQL)
    /blockchain
      core.ts           (Hàm tạo Block và tính Hash)
  /app
    /verify/[id]        (Trang xác minh sản phẩm linh hoạt)
    /api/product        (API giả lập để lấy dữ liệu sản phẩm)
  /components
    /dynamic-fields     (Render các thuộc tính tùy biến)
    /blockchain-visual  (Hiển thị chuỗi khối)
```

---
*Tài liệu đã được cập nhật: Chuyển trọng tâm sang Hệ thống xác minh chung và sử dụng Nước Yến làm ví dụ điển hình.*
