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
  title: "Green Chain | Core Blockchain Infrastructure",
  description: "Green Chain is a high-performance Core Blockchain for Material Sourcing, Green Tourism, and Social Responsibility using GRE native token.",
  keywords: ["Green Chain", "GreenChain", "Blockchain Infrastructure", "GRE Token", "Sustainability", "Traceability"],
  authors: [{ name: "Green Chain Core Team" }],
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
