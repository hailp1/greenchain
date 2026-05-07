'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { db, Product } from '@/lib/store/nosql-sim';
import { ArrowLeft, Download, QrCode, Share2, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function QRGeneratorPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await db.getCollection('products');
      setProducts(data);
      if (data.length > 0) {
        setSelectedProductId(data[0].id);
      }
    };
    fetchProducts();
  }, []);

  const selectedProduct = products.find(p => p.id === selectedProductId);
  
  // The value encoded in QR can be just the ID or the full URL
  // We'll use just the ID for maximum compatibility with our scanner
  const qrValue = selectedProductId;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 1000, 1000);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `QR_${selectedProductId}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <main className="min-h-screen bg-[#fdfcf8] text-natural-950 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-natural-900 transition-colors font-bold text-xs uppercase tracking-widest mb-8">
            <ArrowLeft size={16} /> Quay lại trang chủ
          </Link>
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 rounded-2xl bg-natural-900 text-white flex items-center justify-center shadow-lg shadow-natural-900/20">
                <QrCode size={24} />
             </div>
             <div>
                <h1 className="text-3xl font-black tracking-tight">Trình tạo mã QR SP</h1>
                <p className="text-slate-500 font-medium text-sm">Công cụ tạo mã truy xuất nguồn gốc Blockchain cho sản phẩm</p>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-natural-900/5">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">1. Chọn sản phẩm</h3>
              <div className="space-y-3">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProductId(product.id)}
                    className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between group ${
                      selectedProductId === product.id 
                      ? 'bg-natural-900 border-natural-900 text-white shadow-lg' 
                      : 'bg-white border-slate-100 text-slate-600 hover:border-natural-200'
                    }`}
                  >
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${selectedProductId === product.id ? 'text-natural-400' : 'text-slate-400'}`}>
                        {product.category}
                      </p>
                      <p className="font-bold">{product.name}</p>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      selectedProductId === product.id ? 'bg-white/10' : 'bg-slate-50'
                    }`}>
                      <Check size={16} className={selectedProductId === product.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-emerald-900 p-8 rounded-[2rem] text-white shadow-xl shadow-emerald-900/20">
               <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4">Ghi chú nghiên cứu</h3>
               <p className="text-sm font-light leading-relaxed opacity-80">
                 Mã QR này chứa định danh duy nhất của sản phẩm trong hệ thống Blockchain mô phỏng. Khi quét, hệ thống sẽ tự động tìm kiếm chữ ký tương ứng và truy xuất toàn bộ lịch sử chuỗi cung ứng.
               </p>
            </div>
          </div>

          {/* QR Preview */}
          <div className="flex flex-col items-center">
            <motion.div 
              key={selectedProductId}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-2xl flex flex-col items-center w-full max-w-sm sticky top-12"
            >
              <div className="p-4 bg-white border-2 border-slate-50 rounded-3xl mb-8 shadow-inner">
                <QRCodeSVG 
                  id="qr-code-svg"
                  value={qrValue} 
                  size={200}
                  level="H"
                  includeMargin={false}
                />
              </div>

              <div className="text-center mb-8">
                 <h4 className="font-black text-lg text-natural-900 mb-1">{selectedProduct?.name}</h4>
                 <p className="text-xs font-mono text-slate-400 font-bold uppercase tracking-widest">ID: {selectedProductId}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full">
                 <button 
                  onClick={downloadQR}
                  className="flex items-center justify-center gap-2 py-4 bg-natural-900 text-white rounded-2xl font-bold text-xs hover:bg-black transition-all active:scale-95"
                 >
                   <Download size={16} /> TẢI ẢNH
                 </button>
                 <button 
                  onClick={copyToClipboard}
                  className="flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs hover:bg-slate-200 transition-all active:scale-95"
                 >
                   {copied ? <Check size={16} /> : <Copy size={16} />}
                   {copied ? 'ĐÃ SAO CHÉP' : 'SAO CHÉP ID'}
                 </button>
              </div>
              
              <div className="mt-8 pt-8 border-t border-slate-50 w-full flex justify-center">
                 <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    Verified Blockchain ID
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
