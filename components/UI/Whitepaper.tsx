
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { ArrowLeft, FileText, Hexagon, Database, Cpu, PieChart } from 'lucide-react';
import { useStore } from '../../store';
import { GameStatus } from '../../types';

export const Whitepaper: React.FC = () => {
    const { setStatus } = useStore();

    return (
        <div className="absolute inset-0 z-[100] bg-[#050505] text-gray-300 overflow-y-auto font-sans">
             {/* Header */}
             <div className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur border-b border-white/10 px-6 py-4 flex justify-between items-center">
                 <button 
                    onClick={() => setStatus(GameStatus.MENU)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-mono uppercase tracking-wider"
                 >
                     <ArrowLeft className="w-4 h-4" /> Return to Terminal
                 </button>
                 <div className="flex items-center gap-2">
                     <FileText className="w-4 h-4 text-gray-500" />
                     <span className="font-mono text-sm text-gray-500">DOC_V1.0.2</span>
                 </div>
             </div>

             <div className="max-w-4xl mx-auto px-6 py-16">
                 {/* Title */}
                 <div className="mb-16 border-b border-white/10 pb-8">
                     <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">WHITEPAPER</h1>
                     <p className="text-xl text-gray-500 font-mono">
                         Technical documentation for the RUN-ETH Protocol.
                     </p>
                 </div>

                 {/* 1. Executive Summary */}
                 <section className="mb-16">
                     <div className="flex items-center gap-3 mb-6">
                         <span className="text-xs font-mono border border-gray-700 px-2 py-1 rounded text-gray-500">01</span>
                         <h2 className="text-2xl font-bold text-white">Executive Summary</h2>
                     </div>
                     <p className="text-gray-400 leading-relaxed mb-4">
                         RUN-ETH is a gamified interface for the Ethereum Neural Layer. It visualizes blockchain transaction validation as a high-speed infinite runner, where player skill directly correlates with asset accumulation.
                     </p>
                     <p className="text-gray-400 leading-relaxed">
                         Unlike traditional "Play-to-Earn" models which suffer from hyper-inflationary tokenomics, RUN-ETH employs a "Skill-to-Mine" architecture. Rewards are not guaranteed by time spent, but by the successful completion of cryptographic blocks (levels) and data fragment collection (Runes).
                     </p>
                 </section>

                 {/* 2. Gameplay Mechanics */}
                 <section className="mb-16">
                     <div className="flex items-center gap-3 mb-6">
                         <span className="text-xs font-mono border border-gray-700 px-2 py-1 rounded text-gray-500">02</span>
                         <h2 className="text-2xl font-bold text-white">Core Mechanics</h2>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                         <div className="bg-white/5 p-6 rounded border border-white/5">
                             <Hexagon className="w-6 h-6 text-white mb-4" />
                             <h3 className="text-lg font-bold text-white mb-2">Block Validation</h3>
                             <p className="text-sm text-gray-400">
                                 Players must navigate infinite procedural tracks. Collecting the sequence "R-U-N-E-T-H" validates a block, increasing difficulty and applying a permanent score multiplier for the session.
                             </p>
                         </div>
                         <div className="bg-white/5 p-6 rounded border border-white/5">
                             <Cpu className="w-6 h-6 text-white mb-4" />
                             <h3 className="text-lg font-bold text-white mb-2">Proof of Reflex</h3>
                             <p className="text-sm text-gray-400">
                                 The network speed (game speed) increases linearly with data collection. Failure results in a session terminate. Only validated blocks are committed to the leaderboard.
                             </p>
                         </div>
                     </div>
                 </section>

                 {/* 3. Tokenomics */}
                 <section className="mb-16">
                     <div className="flex items-center gap-3 mb-6">
                         <span className="text-xs font-mono border border-gray-700 px-2 py-1 rounded text-gray-500">03</span>
                         <h2 className="text-2xl font-bold text-white">Tokenomics ($GEMS)</h2>
                     </div>
                     <p className="text-gray-400 leading-relaxed mb-8">
                         $GEMS is the utility token of the ecosystem. It is minted through gameplay and burned through marketplace interactions. The economy is designed to be deflationary during periods of high active user count.
                     </p>

                     <div className="bg-[#111] border border-white/10 rounded-xl p-8 mb-8">
                         <h3 className="font-mono text-gray-500 mb-6 text-sm uppercase tracking-widest">Supply Distribution</h3>
                         <div className="space-y-4">
                             <div className="flex items-center justify-between">
                                 <span className="text-white">Gameplay Rewards (Mining)</span>
                                 <span className="font-mono text-gray-400">45%</span>
                             </div>
                             <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                                 <div className="bg-white h-full w-[45%]"></div>
                             </div>

                             <div className="flex items-center justify-between pt-2">
                                 <span className="text-white">Ecosystem & Treasury</span>
                                 <span className="font-mono text-gray-400">20%</span>
                             </div>
                             <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                                 <div className="bg-gray-400 h-full w-[20%]"></div>
                             </div>

                             <div className="flex items-center justify-between pt-2">
                                 <span className="text-white">Team & Development</span>
                                 <span className="font-mono text-gray-400">15%</span>
                             </div>
                             <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                                 <div className="bg-gray-600 h-full w-[15%]"></div>
                             </div>
                             
                             <div className="flex items-center justify-between pt-2">
                                 <span className="text-white">Liquidity Provision</span>
                                 <span className="font-mono text-gray-400">10%</span>
                             </div>
                             <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                                 <div className="bg-gray-700 h-full w-[10%]"></div>
                             </div>

                             <div className="flex items-center justify-between pt-2">
                                 <span className="text-white">Airdrop / Marketing</span>
                                 <span className="font-mono text-gray-400">10%</span>
                             </div>
                             <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                                 <div className="bg-gray-700 h-full w-[10%]"></div>
                             </div>
                         </div>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="border border-white/10 p-4 rounded">
                             <div className="font-mono text-xs text-gray-500 mb-2">UTILITY</div>
                             <div className="text-white font-bold">Runner Upgrades</div>
                         </div>
                         <div className="border border-white/10 p-4 rounded">
                             <div className="font-mono text-xs text-gray-500 mb-2">SINK MECHANISM</div>
                             <div className="text-white font-bold">Repair & Revives</div>
                         </div>
                         <div className="border border-white/10 p-4 rounded">
                             <div className="font-mono text-xs text-gray-500 mb-2">GOVERNANCE</div>
                             <div className="text-white font-bold">Staking for $RUN</div>
                         </div>
                     </div>
                 </section>

                 {/* 4. Architecture */}
                 <section className="mb-16">
                     <div className="flex items-center gap-3 mb-6">
                         <span className="text-xs font-mono border border-gray-700 px-2 py-1 rounded text-gray-500">04</span>
                         <h2 className="text-2xl font-bold text-white">Technical Architecture</h2>
                     </div>
                     <p className="text-gray-400 leading-relaxed mb-6">
                         The application is built as a hybrid dApp. The high-performance game logic executes off-chain for zero-latency gameplay, while asset ownership and reward settlement occur on-chain.
                     </p>
                     <div className="border-l-2 border-white pl-6 py-2">
                         <p className="text-gray-300 italic">
                             "We believe high-frequency games cannot exist fully on-chain due to block time limitations. RUN-ETH validates sessions via optimistic proofs submitted at the end of every run."
                         </p>
                     </div>
                 </section>

                 <div className="border-t border-white/10 pt-16 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 font-mono">
                     <p>LAST UPDATED: Q4 2024</p>
                     <p>RUN-ETH PROTOCOL FOUNDATION</p>
                 </div>
             </div>
        </div>
    );
};
