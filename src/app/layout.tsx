import type { Metadata } from "next";
import { Inter, EB_Garamond } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ebGaramond = EB_Garamond({ subsets: ["latin"], variable: "--font-garamond", style: ["italic", "normal"] });

export const metadata: Metadata = {
  title: "fwd LIFEchain | Dự án Mokup Xác thực Blockchain - Lê Phúc Hải",
  description: "Dự án Mokup xác thực thông tin qua Blockchain của Lê Phúc Hải. fwd LIFEchain là hệ sinh thái minh bạch hóa chuỗi cung ứng nông nghiệp Việt Nam, tập trung vào giá trị sạch và an toàn.",
  keywords: ["fwd LIFEchain", "fwdlife.vn", "Farm Worth Driven", "Blockchain Agriculture", "Lê Phúc Hải", "Traceability", "Nông nghiệp số"],
  authors: [{ name: "Lê Phúc Hải" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${ebGaramond.variable}`}>
      <body className="antialiased font-sans">
        {children}
        <Footer />
      </body>
    </html>
  );
}
