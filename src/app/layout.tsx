import type { Metadata } from "next";
import { Inter, EB_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ebGaramond = EB_Garamond({ subsets: ["latin"], variable: "--font-garamond", style: ["italic", "normal"] });

export const metadata: Metadata = {
  title: "fwd LIFEchain | Blockchain Verified Agriculture",
  description: "fwd LIFEchain is a transparent ecosystem for verifying the Vietnamese agricultural supply chain using Blockchain & AI.",
  keywords: ["fwd LIFEchain", "fwdlife.vn", "Farm Worth Driven", "Blockchain Agriculture", "Lê Phúc Hải", "Traceability", "Digital Agriculture"],
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
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
