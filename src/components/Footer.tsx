'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, ShieldCheck, Cpu, Github, Twitter, Linkedin, ArrowRight, Sprout, Database, Terminal, FileCode, Landmark } from 'lucide-react';
import { ethers } from 'ethers';

export default function Footer() {
  const [latestBlock, setLatestBlock] = useState<number | string>("Loading...");

  useEffect(() => {
    const fetchBlock = async () => {
      try {
        const provider = new ethers.JsonRpcProvider("https://rpc.fwdlife.vn");
        const block = await provider.getBlockNumber();
        setLatestBlock(block);
      } catch (e) {
        setLatestBlock("Error");
      }
    };
    fetchBlock();
    const interval = setInterval(fetchBlock, 10000); // Update every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-natural-900 text-white pt-24 pb-12 px-6 md:px-12 relative overflow-hidden print:hidden border-t border-white/5">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24 mb-20">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-8">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-black text-xs transition-transform group-hover:scale-110">
                 AGRI
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                   <span className="font-sans text-2xl font-black text-white uppercase tracking-tighter">Green</span>
                   <span className="font-serif text-lg font-light text-slate-400 lowercase">chain</span>
                </div>
                <p className="text-[10px] font-medium text-slate-500 mt-2 uppercase tracking-widest">Farm · Worth · Driven</p>
              </div>
            </Link>
            <p className="text-slate-400 text-sm md:text-lg font-light leading-relaxed max-w-md italic">
              "Ensuring transparency through cryptographic truth."
              <br />
              <span className="text-[10px] not-italic text-slate-500 uppercase tracking-widest">Ph.D Research Protocol by NCS Le Phuc Hai</span>
            </p>
            <div className="flex gap-4">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <Link key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-500 transition-all">
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Infrastructure</h4>
              <ul className="space-y-4">
                {[
                  { name: "Main Explorer", href: "/explorer", icon: Database },
                  { name: "Node Network", href: "/explorer/nodes", icon: Cpu },
                  { name: "Portal Admin", href: "/portal", icon: Sprout },
                ].map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-sm font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                       <link.icon size={14} className="opacity-40" />
                       {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Documentation</h4>
              <ul className="space-y-4">
                {[
                  { name: "Technical Docs", href: "/explorer/resources", icon: FileCode },
                  { name: "Smart Contracts", href: "/explorer/smart-contracts", icon: ShieldCheck },
                  { name: "API Reference", href: "/explorer/apis", icon: Terminal },
                  { name: "Governance", href: "/explorer/governance", icon: Landmark }
                ].map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-sm font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                       <link.icon size={14} className="opacity-40" />
                       {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1 space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400">Live Status</h4>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-5">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Network Live</span>
                </div>
                <div className="space-y-2">
                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Latest Synced Block</p>
                   <div className="flex items-baseline gap-1">
                      <span className="text-xs font-mono text-white">#</span>
                      <span className="text-lg font-mono font-black text-white">{latestBlock.toLocaleString()}</span>
                   </div>
                </div>
                <div className="pt-2 border-t border-white/5">
                   <p className="text-[8px] font-medium text-slate-500 italic">Syncing across 24 validator nodes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
             <Link href="/legal/terms" className="hover:text-white">Terms of Use</Link>
             <Link href="/legal/privacy" className="hover:text-white">Privacy Policy</Link>
             <Link href="/legal/cookies" className="hover:text-white">Cookie Protocol</Link>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
            © 2026 GREEN CHAIN · GRE PROTOCOL · ALL RIGHTS RESERVED. 
          </p>
        </div>
      </div>
    </footer>
  );
}
