'use client';
import { motion } from 'framer-motion';
import { PackagePlus } from 'lucide-react';

interface SupplyChainProps {
  batches: any[];
  newHarvest: any;
  setNewHarvest: (val: any) => void;
  handleSign: () => Promise<void>;
  isSigning: boolean;
  isSuccess: boolean;
}

export default function SupplyChain({
  batches,
  newHarvest,
  setNewHarvest,
  handleSign,
  isSigning,
  isSuccess
}: SupplyChainProps) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase">Supply Chain <span className="text-emerald-500">Ops</span></h2>
        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Blockchain Ledger for GREcultural Verification</p>
      </div>

      <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Product Category</label>
            <select 
              value={newHarvest.product_name}
              onChange={(e) => setNewHarvest({...newHarvest, product_name: e.target.value})}
              className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="">Select Product...</option>
              <option value="Trà Atisô (Lạc Dương)">Trà Atisô (Lạc Dương)</option>
              <option value="Yến Sào (Ninh Hòa)">Yến Sào (Ninh Hòa)</option>
              <option value="Sầu Riêng (Đắk Lắk)">Sầu Riêng (Đắk Lắk)</option>
              <option value="Cà Phê Arabica (Cầu Đất)">Cà Phê Arabica (Cầu Đất)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Estimated Yield (kg)</label>
            <input 
              type="number" 
              value={newHarvest.quantity}
              onChange={(e) => setNewHarvest({...newHarvest, quantity: Number(e.target.value)})}
              className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none" 
            />
          </div>
        </div>

        <button 
          onClick={handleSign}
          disabled={isSigning || isSuccess}
          className={`w-full py-6 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] shadow-2xl transition-all ${isSuccess ? 'bg-emerald-500 text-white' : 'bg-natural-900 text-white hover:bg-black'}`}
        >
          {isSigning ? 'SIGNING LEDGER...' : isSuccess ? 'HARVEST VERIFIED' : 'SIGN DATA TO BLOCKCHAIN'}
        </button>
      </div>

      <section className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-sm font-black text-natural-900 uppercase tracking-widest">Recent Batch History</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {batches.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">No operational batches found</div>
          ) : batches.map((batch, i) => (
            <div key={i} className="p-6 flex items-center justify-between group hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <PackagePlus size={18} />
                </div>
                <div>
                  <p className="text-sm font-black text-natural-950 uppercase">{batch.product_name}</p>
                  <p className="text-[10px] text-slate-400 font-bold tracking-widest">ID: {batch.id.slice(0,8)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-natural-950">{batch.quantity} KG</p>
                <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest ${batch.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                  {batch.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
