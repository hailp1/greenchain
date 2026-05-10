import type { Metadata } from "next";
import { Be_Vietnam_Pro, EB_Garamond } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { cn } from "@/lib/utils";

const beVietnam = Be_Vietnam_Pro({ 
  subsets: ["vietnamese", "latin"], 
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-be-vietnam" 
});

const ebGaramond = EB_Garamond({ 
  subsets: ["vietnamese", "latin"], 
  variable: "--font-garamond", 
  style: ["italic", "normal"] 
});

export const metadata: Metadata = {
  title: "fwd LIFEchain | Blockchain Verified Agriculture",
  description: "fwd LIFEchain is a transparent ecosystem for verifying the Vietnamese agricultural supply chain using Blockchain & AI.",
  keywords: ["fwd LIFEchain", "fwdlife.vn", "Blockchain Agriculture", "Lê Phúc Hải", "Traceability"],
  authors: [{ name: "Lê Phúc Hải" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={cn(beVietnam.variable, ebGaramond.variable, "font-sans")}>
      <body className="antialiased font-sans" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
