'use client';

import { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, Keyboard, AlertCircle } from 'lucide-react';

interface QRScannerProps {
  onClose: () => void;
}

export default function QRScanner({ onClose }: QRScannerProps) {
  const [error, setError] = useState<string>('');
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const [manualId, setManualId] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  const startCamera = async () => {
    try {
      setError('');
      const html5QrCode = new Html5Qrcode("reader");
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 15,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
            const qrboxSize = Math.floor(minEdgeSize * 0.7);
            return {
              width: qrboxSize,
              height: qrboxSize
            };
          }
        },
        (decodedText) => {
          handleSuccess(decodedText);
        },
        (errorMessage) => {
          // Scanning...
        }
      );
      setIsCameraStarted(true);
    } catch (err) {
      console.error("Camera start error:", err);
      setError("Không thể truy cập Camera. Hãy đảm bảo bạn đã cấp quyền.");
    }
  };

  const handleSuccess = async (decodedText: string) => {
    try {
      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current.stop();
      }
      
      let id = decodedText.trim();
      if (decodedText.includes('/verify/')) {
        const parts = decodedText.split('/verify/');
        id = parts[parts.length - 1].split('?')[0].split('#')[0].replace('/', '');
      }
      
      // Visual feedback
      document.body.style.backgroundColor = "#10b981";
      setTimeout(() => {
        window.location.href = `/verify/${id}`;
      }, 300);
    } catch (err) {
      console.error("Success handle error:", err);
      // Fallback redirect if stop fails
      window.location.href = `/verify/${decodedText}`;
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId.trim()) {
      window.location.href = `/verify/${manualId.trim()}`;
    }
  };

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 md:p-6 backdrop-blur-xl">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:rotate-90"
      >
        <X size={24} />
      </button>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white/10">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <h3 className="font-black text-slate-900 tracking-tight">XÁC THỰC BLOCKCHAIN</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Traceability Scanner v2.1</p>
          </div>
          <button 
            onClick={() => setIsManualMode(!isManualMode)}
            className="p-2 rounded-xl bg-natural-50 text-natural-600 hover:bg-natural-100 transition-colors"
          >
            {isManualMode ? <Camera size={20} /> : <Keyboard size={20} />}
          </button>
        </div>
        
        <div className="relative aspect-square bg-slate-900 overflow-hidden">
          {!isManualMode ? (
            <>
              <div id="reader" className="w-full h-full"></div>
              {!isCameraStarted && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 animate-bounce">
                    <Camera size={40} />
                  </div>
                  <button 
                    onClick={startCamera}
                    className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/40 hover:bg-emerald-600 transition-all active:scale-95"
                  >
                    BẮT ĐẦU QUÉT CAMERA
                  </button>
                  {error && (
                    <div className="mt-6 flex items-center gap-2 text-red-400 text-xs bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20">
                      <AlertCircle size={14} />
                      {error}
                    </div>
                  )}
                </div>
              )}
              {isCameraStarted && (
                <div className="absolute inset-0 pointer-events-none border-[40px] border-black/40">
                   <div className="w-full h-full border-2 border-emerald-400/50 rounded-3xl relative">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-lg"></div>
                      <div className="absolute inset-0 bg-emerald-400/5 animate-pulse"></div>
                   </div>
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-natural-900">
               <h4 className="text-white font-bold mb-6">Nhập mã định danh SP</h4>
               <form onSubmit={handleManualSubmit} className="w-full space-y-4">
                  <input 
                    type="text" 
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value.toUpperCase())}
                    placeholder="VD: YEN-001"
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white text-center text-xl font-black tracking-widest focus:outline-none focus:border-emerald-500 transition-all"
                    autoFocus
                  />
                  <button 
                    type="submit"
                    className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    XÁC THỰC NGAY
                  </button>
               </form>
            </div>
          )}
        </div>
        
        <div className="p-6 text-center bg-slate-50">
          <p className="text-xs text-slate-400 font-medium">Hệ thống tự động nhận diện mã QR trên bao bì sản phẩm.</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
         <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
           AI Powered Verification
         </div>
      </div>
    </div>
  );
}
