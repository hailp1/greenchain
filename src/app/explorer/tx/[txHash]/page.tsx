'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ethers } from 'ethers';
import { 
  CheckCircle2, Clock, Info, HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

export default function TransactionDetail() {
  const params = useParams();
  const txHash = params.txHash as string;
  const [tx, setTx] = useState<any>(null);
  const [receipt, setReceipt] = useState<any>(null);
  const [block, setBlock] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'state'>('overview');

  useEffect(() => {
    const fetchTxData = async () => {
      try {
        setLoading(true);
        // Try Blockchain first (EVM hashes usually start with 0x and are 66 chars)
        let txData = null;
        let receiptData = null;
        let blockData = null;
        const queryHash = txHash.startsWith('0x') ? txHash : `0x${txHash}`;

        try {
          if (txHash.length >= 60) {
            [txData, receiptData] = await Promise.all([
              provider.getTransaction(queryHash),
              provider.getTransactionReceipt(queryHash)
            ]);

            if (txData && txData.blockNumber != null) {
              blockData = await provider.getBlock(txData.blockNumber);
            }
          }
        } catch (e) {
          console.warn("RPC fetch error", e);
        }

        // If not found on blockchain, check Supabase (Platform Transactions)
        if (!txData) {
          // Reconstruct UUID if it's 32 chars
          let sbQueryId = txHash.replace('0x', '');
          if (sbQueryId.length === 32) {
            sbQueryId = `${sbQueryId.slice(0,8)}-${sbQueryId.slice(8,12)}-${sbQueryId.slice(12,16)}-${sbQueryId.slice(16,20)}-${sbQueryId.slice(20)}`;
          }

          const { data: sbTx } = await supabase
            .from('token_transactions')
            .select('*')
            .eq('id', sbQueryId)
            .maybeSingle();

          if (sbTx) {
            txData = {
              hash: txHash,
              from: sbTx.sender_address || '0x0000000000000000000000000000000000000000',
              to: sbTx.receiver_address || '0x0000000000000000000000000000000000000000',
              value: ethers.parseEther((sbTx.amount || 0).toString()),
              gasPrice: 0n,
              gasLimit: 0n,
              nonce: 0,
              data: `Platform Transfer: ${sbTx.description || sbTx.type}`
            };
            receiptData = {
              status: 1,
              gasUsed: 0n,
              transactionIndex: 0,
              logs: []
            };
            blockData = {
              timestamp: Math.floor(new Date(sbTx.created_at).getTime() / 1000),
              number: 'Platform Ledger'
            };
          }
        }

        if (!txData) {
          setError("Transaction not found.");
          return;
        }

        setTx(txData);
        setReceipt(receiptData);
        setBlock(blockData);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Unable to connect to node.");
      } finally {
        setLoading(false);
      }
    };

    if (txHash) fetchTxData();
  }, [txHash]);

  const calculateTxFee = () => {
    if (!tx || !receipt) return "0";
    const feeWei = BigInt(receipt.gasUsed) * BigInt(tx.gasPrice);
    return ethers.formatEther(feeWei);
  };

  const decodeInputData = (data: string) => {
    if (!data || data === '0x') return 'Transfer';
    if (data.startsWith('0x40c10f19')) return 'Mint Asset';
    if (data.startsWith('0xa9059cbb')) return 'ERC20 Transfer';
    if (data.startsWith('0x095ea7b3')) return 'Approve';
    if (data.startsWith('0x368fac3d')) return 'Anchor Data';
    return 'Contract Call';
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Header />
      
      <main className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="mb-6 flex items-center gap-2 border-b border-slate-200 pb-4">
           <h1 className="text-xl font-bold text-slate-800">Transaction Details</h1>
        </div>

        {error ? (
           <div className="bg-white p-10 rounded border border-slate-200 shadow-sm text-center">
              <h2 className="text-lg font-bold text-slate-800 mb-2">Transaction Not Found</h2>
              <p className="text-slate-600">{error}</p>
           </div>
        ) : (
           <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden text-sm">
              
              <div className="flex gap-6 border-b border-slate-200 px-4 bg-slate-50/50">
                 {['overview', 'logs', 'state'].map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`py-3 px-2 font-medium capitalize transition-colors ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
                    >
                       {tab} {tab === 'logs' && receipt?.logs ? `(${receipt.logs.length})` : ''}
                    </button>
                 ))}
              </div>

              {activeTab === 'overview' && (
                 <div className="divide-y divide-slate-100">
                    
                    <Row label="Transaction Hash">
                       <span className="font-medium text-slate-900 break-all">{txHash}</span>
                    </Row>
                    
                    <Row label="Status">
                       <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${receipt?.status === 1 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                          {receipt?.status === 1 ? <CheckCircle2 size={12} /> : <Info size={12} />}
                          {receipt?.status === 1 ? 'Success' : 'Failed'}
                       </div>
                    </Row>
                    
                    <Row label="Block">
                       {typeof block?.number === 'string' ? (
                          <span className="font-medium text-slate-800">{block.number}</span>
                       ) : (
                          <Link href={`/explorer/blocks/${tx?.blockNumber}`} className="text-blue-600 hover:text-blue-800 font-medium">{tx?.blockNumber}</Link>
                       )}
                       {typeof block?.number !== 'string' && (
                          <span className="ml-2 px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded border border-slate-200">Confirmed</span>
                       )}
                    </Row>
                    
                    <Row label="Timestamp">
                       <div className="flex items-center gap-1.5">
                          <Clock size={14} className="text-slate-400" />
                          <span>{block ? `${Math.floor((Date.now() - block.timestamp * 1000) / 60000)} mins ago (${new Date(block.timestamp * 1000).toLocaleString()})` : '...'}</span>
                       </div>
                    </Row>
                    
                    <div className="h-4 bg-slate-50/30"></div>
                    
                    <Row label="From">
                       <Link href={`/explorer/address/${tx?.from}`} className="text-blue-600 hover:text-blue-800 font-medium break-all">{tx?.from}</Link>
                    </Row>
                    
                    <Row label="To">
                       <Link href={`/explorer/address/${tx?.to}`} className="text-blue-600 hover:text-blue-800 font-medium break-all">{tx?.to || 'Contract Creation'}</Link>
                    </Row>

                    <div className="h-4 bg-slate-50/30"></div>

                    <Row label="Value">
                       <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">{ethers.formatEther(tx?.value || 0)} AGRI</span>
                          <span className="text-slate-500 text-xs">(${(parseFloat(ethers.formatEther(tx?.value || 0)) * 2326.88).toFixed(2)})</span>
                       </div>
                    </Row>

                    <Row label="Transaction Fee">
                       <div className="flex items-center gap-2">
                          <span className="text-slate-900">{calculateTxFee()} AGRI</span>
                          <span className="text-slate-500 text-xs">(${(parseFloat(calculateTxFee()) * 2326.88).toFixed(2)})</span>
                       </div>
                    </Row>

                    <Row label="Gas Price">
                       {ethers.formatUnits(tx?.gasPrice || 0, 'gwei')} Gwei
                    </Row>

                    <Row label="Gas Limit & Usage by Txn">
                       {tx?.gasLimit.toString()} | {receipt?.gasUsed.toString()} <span className="text-slate-500 text-xs ml-1">({(Number(receipt?.gasUsed) / Number(tx?.gasLimit) * 100).toFixed(2)}%)</span>
                    </Row>

                    <div className="h-4 bg-slate-50/30"></div>

                    <Row label="More Details">
                       <div className="space-y-4">
                          <div>
                             <span className="text-slate-500 mr-2">Nonce:</span> {tx?.nonce}
                          </div>
                          <div>
                             <span className="text-slate-500 mr-2">Position In Block:</span> {receipt?.transactionIndex}
                          </div>
                       </div>
                    </Row>

                    <Row label="Input Data">
                       <div className="bg-slate-50 p-3 rounded border border-slate-200 font-mono text-xs text-slate-600 break-all max-h-48 overflow-y-auto whitespace-pre-wrap">
                          {tx?.data}
                       </div>
                    </Row>

                 </div>
              )}

              {activeTab === 'logs' && (
                 <div className="p-4">
                    {receipt?.logs?.length === 0 ? (
                       <p className="text-slate-500 text-center py-8">No event logs found for this transaction.</p>
                    ) : (
                       <div className="space-y-4">
                          {receipt?.logs?.map((log: any, i: number) => (
                             <div key={i} className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                                   {i}
                                </div>
                                <div className="flex-grow space-y-2">
                                   <div className="grid grid-cols-[100px_1fr] gap-4">
                                      <span className="text-slate-500 font-medium">Address</span>
                                      <Link href={`/explorer/address/${log.address}`} className="text-blue-600 hover:text-blue-800 break-all">{log.address}</Link>
                                   </div>
                                   <div className="grid grid-cols-[100px_1fr] gap-4">
                                      <span className="text-slate-500 font-medium">Topics</span>
                                      <div className="space-y-1">
                                         {log.topics.map((t: string, idx: number) => (
                                            <div key={idx} className="flex gap-2">
                                               <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 text-[10px]">{idx}</span>
                                               <span className="font-mono text-xs text-slate-700 break-all">{t}</span>
                                            </div>
                                         ))}
                                      </div>
                                   </div>
                                   <div className="grid grid-cols-[100px_1fr] gap-4">
                                      <span className="text-slate-500 font-medium">Data</span>
                                      <div className="bg-slate-50 p-2 rounded border border-slate-200 font-mono text-xs break-all text-slate-600">
                                         {log.data}
                                      </div>
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>
                    )}
                 </div>
              )}

           </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function Row({ label, children }: { label: string, children: React.ReactNode }) {
   return (
      <div className="flex flex-col md:flex-row py-4 px-4 md:px-6 hover:bg-slate-50/50 transition-colors">
         <div className="w-full md:w-1/4 flex items-start gap-1 mb-1 md:mb-0">
            <HelpCircle size={14} className="text-slate-400 mt-0.5 shrink-0" />
            <span className="text-slate-500 font-medium">{label}:</span>
         </div>
         <div className="w-full md:w-3/4 text-slate-800">
            {children}
         </div>
      </div>
   );
}
