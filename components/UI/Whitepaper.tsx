
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { ArrowLeft, FileText, Hexagon, Database, Cpu, PieChart, ChevronRight, X, Zap, Hammer, Vote, Home, Shield, Activity, Gamepad2 } from 'lucide-react';
import { useStore } from '../../store';
import { GameStatus } from '../../types';

type DetailView = 'MAIN' | 'UTILITY' | 'SINK' | 'GOVERNANCE' | 'HOW_TO_PLAY';

export const Whitepaper: React.FC = () => {
    const { setStatus } = useStore();
    const [view, setView] = useState<DetailView>('MAIN');

    const renderContent = () => {
        if (view === 'HOW_TO_PLAY') {
             return (
                <div className="animate-fade-in max-w-4xl">
                    <div className="mb-10">
                        <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg inline-block mb-4">
                            <Gamepad2 className="w-8 h-8 text-green-400" />
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4">How to Play</h2>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">
                            Master the controls and mechanics to maximize your $GEMS yield.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* 1. Controls */}
                        <div className="bg-gray-900/50 p-6 rounded-xl border border-white/10">
                            <h3 className="text-2xl font-bold text-white mb-6">Controls</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between bg-black/40 p-3 rounded border border-gray-700">
                                        <span className="text-gray-300">Move Left</span>
                                        <div className="flex gap-2">
                                            <kbd className="bg-gray-800 px-2 py-1 rounded text-xs font-mono border border-gray-600">Left Arrow</kbd>
                                            <span className="text-gray-500">or</span>
                                            <kbd className="bg-gray-800 px-2 py-1 rounded text-xs font-mono border border-gray-600">Swipe Left</kbd>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between bg-black/40 p-3 rounded border border-gray-700">
                                        <span className="text-gray-300">Move Right</span>
                                        <div className="flex gap-2">
                                            <kbd className="bg-gray-800 px-2 py-1 rounded text-xs font-mono border border-gray-600">Right Arrow</kbd>
                                            <span className="text-gray-500">or</span>
                                            <kbd className="bg-gray-800 px-2 py-1 rounded text-xs font-mono border border-gray-600">Swipe Right</kbd>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                     <div className="flex items-center justify-between bg-black/40 p-3 rounded border border-gray-700">
                                        <span className="text-gray-300">Jump</span>
                                        <div className="flex gap-2">
                                            <kbd className="bg-gray-800 px-2 py-1 rounded text-xs font-mono border border-gray-600">Space</kbd>
                                            <kbd className="bg-gray-800 px-2 py-1 rounded text-xs font-mono border border-gray-600">Up Arrow</kbd>
                                            <kbd className="bg-gray-800 px-2 py-1 rounded text-xs font-mono border border-gray-600">W</kbd>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between bg-black/40 p-3 rounded border border-gray-700">
                                        <span className="text-gray-300">Double Jump</span>
                                        <div className="text-xs text-gray-500">Purchase Ability in Shop</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Objectives */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-900/50 p-6 rounded-xl border border-white/10">
                                <h3 className="text-xl font-bold text-white mb-3">The Objective</h3>
                                <p className="text-gray-400 text-sm mb-4">
                                    Your goal is to validate blocks by collecting the letters:
                                </p>
                                <div className="flex gap-1 justify-center py-4">
                                    {['R','U','N','-','E','T','H'].map((c, i) => (
                                        <div key={i} className="w-8 h-10 bg-gray-800 rounded border border-gray-600 flex items-center justify-center font-bold font-cyber text-cyan-400">
                                            {c}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-gray-400 text-sm mt-4">
                                    Collecting the full sequence advances the Sector level and speeds up the runner.
                                </p>
                            </div>

                            <div className="bg-gray-900/50 p-6 rounded-xl border border-white/10">
                                <h3 className="text-xl font-bold text-white mb-3">Items & Economy</h3>
                                <ul className="space-y-4">
                                    <li className="flex gap-3">
                                        <div className="w-10 h-10 bg-cyan-900/30 rounded flex items-center justify-center shrink-0">
                                            <Hexagon className="w-5 h-5 text-cyan-400" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-sm">Blue/Cyan Gems</div>
                                            <div className="text-xs text-gray-400">Standard currency. Worth 50 points.</div>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="w-10 h-10 bg-yellow-900/30 rounded flex items-center justify-center shrink-0">
                                            <Hexagon className="w-5 h-5 text-yellow-400" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-sm">Yellow Cubes (Gold Gems)</div>
                                            <div className="text-xs text-gray-400">High value currency found in difficult spots. Worth 100 points.</div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
             );
        }

        if (view === 'UTILITY') {
            return (
                <div className="animate-fade-in max-w-4xl">
                    <div className="mb-10">
                        <div className="p-3 bg-cyan-900/20 border border-cyan-500/30 rounded-lg inline-block mb-4">
                            <Zap className="w-8 h-8 text-cyan-400" />
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4">Runner Upgrades & Utility</h2>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">
                            The RUN-ETH ecosystem centers around the <span className="text-white">Neural Runner</span>, a dynamic NFT asset that directly influences gameplay efficiency and reward output.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="border border-white/10 p-6 rounded-xl bg-gray-900/50">
                            <h3 className="text-xl font-bold text-white mb-4">Multiplier Mechanics</h3>
                            <p className="text-gray-400 mb-4 text-sm">
                                Every runner possesses a native <span className="text-cyan-400">Gem Multiplier</span> attribute. This multiplier is applied to every $GEM collected during a run.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex justify-between items-center border-b border-gray-800 pb-2">
                                    <span className="text-gray-400">Common</span>
                                    <span className="text-white font-mono font-bold">1.0x - 1.2x</span>
                                </li>
                                <li className="flex justify-between items-center border-b border-gray-800 pb-2">
                                    <span className="text-blue-400">Rare</span>
                                    <span className="text-white font-mono font-bold">1.5x - 1.7x</span>
                                </li>
                                <li className="flex justify-between items-center border-b border-gray-800 pb-2">
                                    <span className="text-purple-400">Epic</span>
                                    <span className="text-white font-mono font-bold">2.0x - 3.0x</span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-yellow-400">Legendary</span>
                                    <span className="text-white font-mono font-bold">3.5x - 5.0x</span>
                                </li>
                            </ul>
                        </div>
                        <div className="border border-white/10 p-6 rounded-xl bg-gray-900/50">
                            <h3 className="text-xl font-bold text-white mb-4">Durability & Repair</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                High-tier runners are powerful but fragile. Over time, runners accumulate "Network Fatigue" which reduces their multiplier efficiency.
                            </p>
                            <div className="mt-4 p-4 bg-black/40 rounded border border-gray-700">
                                <div className="text-xs text-gray-500 mb-1">EXAMPLE MECHANIC</div>
                                <p className="text-sm text-gray-300">
                                    A Legendary Runner (5.0x) may drop to 2.5x efficiency if not maintained. Players must spend $GEMS to refresh the runner's neural link.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (view === 'SINK') {
             return (
                <div className="animate-fade-in max-w-4xl">
                    <div className="mb-10">
                        <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg inline-block mb-4">
                            <Hammer className="w-8 h-8 text-red-400" />
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4">Deflationary Sink Mechanisms</h2>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">
                            To prevent hyperinflation of the $GEMS token, RUN-ETH implements aggressive sink mechanisms that permanently remove tokens from circulation.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-900/50 p-6 rounded-xl border border-white/10 flex gap-4">
                            <div className="h-full pt-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div></div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">The Repair Loop</h3>
                                <p className="text-gray-400">
                                    The primary sink. As mentioned in Utility, keeping high-tier NFT runners operational requires consistent $GEMS expenditure. This scales dynamically with the total active user base.
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-900/50 p-6 rounded-xl border border-white/10 flex gap-4">
                            <div className="h-full pt-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div></div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Emergency Revives</h3>
                                <p className="text-gray-400">
                                    During a run, players can spend $GEMS to recover from a crash. The cost doubles with each revive in a single session, quickly becoming a significant token sink for competitive players pushing leaderboard records.
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-900/50 p-6 rounded-xl border border-white/10 flex gap-4">
                            <div className="h-full pt-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div></div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Synthesis (Breeding)</h3>
                                <p className="text-gray-400">
                                    Players can burn two Common runners + a significant $GEMS fee to mint a Rare runner. This "Burn-to-Mint" mechanic reduces both the NFT supply and the Token supply simultaneously.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (view === 'GOVERNANCE') {
             return (
                <div className="animate-fade-in max-w-4xl">
                    <div className="mb-10">
                        <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg inline-block mb-4">
                            <Vote className="w-8 h-8 text-purple-400" />
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4">DAO Governance</h2>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">
                            RUN-ETH is designed to be community-owned. The governance module allows $GEMS holders to steer the development of the protocol.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
                            <h3 className="text-lg font-bold text-white mb-3">Map Voting</h3>
                            <p className="text-sm text-gray-400">
                                Stakers vote on the next "Sector" theme (e.g., Neon City vs. Martian Wasteland) to be developed and released.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
                            <h3 className="text-lg font-bold text-white mb-3">Reward Balancing</h3>
                            <p className="text-sm text-gray-400">
                                The community can vote to adjust the "Global Emission Rate" of $GEMS if inflation runs too high or too low.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
                            <h3 className="text-lg font-bold text-white mb-3">Treasury Allocation</h3>
                            <p className="text-sm text-gray-400">
                                Proposals for marketing budgets, partnership grants, and developer bounties are ratified on-chain.
                            </p>
                        </div>
                    </div>
                    
                    <div className="p-6 bg-yellow-900/10 border border-yellow-500/20 rounded-xl">
                        <h4 className="text-yellow-400 font-bold mb-2">Phase 3 Implementation</h4>
                        <p className="text-sm text-gray-400">
                            Governance modules are currently in development and scheduled for release in Phase 3. Until then, the core team retains stewardship of the protocol parameters.
                        </p>
                    </div>
                </div>
            );
        }

        // MAIN VIEW
        return (
            <div className="animate-fade-in max-w-4xl">
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
                            {/* ... (Other bars same as before) ... */}
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
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <button onClick={() => setView('HOW_TO_PLAY')} className="border border-white/10 p-4 rounded hover:bg-white/5 transition-colors text-left group">
                            <div className="font-mono text-xs text-gray-500 mb-2 group-hover:text-green-400 transition-colors">GUIDE</div>
                            <div className="text-white font-bold flex justify-between items-center">
                                How to Play
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </button>
                        <button onClick={() => setView('UTILITY')} className="border border-white/10 p-4 rounded hover:bg-white/5 transition-colors text-left group">
                            <div className="font-mono text-xs text-gray-500 mb-2 group-hover:text-cyan-400 transition-colors">UTILITY</div>
                            <div className="text-white font-bold flex justify-between items-center">
                                Runner Upgrades
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </button>
                        <button onClick={() => setView('SINK')} className="border border-white/10 p-4 rounded hover:bg-white/5 transition-colors text-left group">
                            <div className="font-mono text-xs text-gray-500 mb-2 group-hover:text-red-400 transition-colors">SINK MECHANISM</div>
                            <div className="text-white font-bold flex justify-between items-center">
                                Repair & Revives
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </button>
                        <button onClick={() => setView('GOVERNANCE')} className="border border-white/10 p-4 rounded hover:bg-white/5 transition-colors text-left group">
                            <div className="font-mono text-xs text-gray-500 mb-2 group-hover:text-purple-400 transition-colors">GOVERNANCE</div>
                            <div className="text-white font-bold flex justify-between items-center">
                                Staking for $RUN
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </button>
                    </div>
                </section>

                <div className="border-t border-white/10 pt-16 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 font-mono">
                    <p>LAST UPDATED: Q4 2024</p>
                    <p>RUN-ETH PROTOCOL FOUNDATION</p>
                </div>
            </div>
        );
    };

    const NavItem = ({ id, icon: Icon, label }: { id: DetailView, icon: any, label: string }) => (
        <button 
            onClick={() => setView(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${view === id ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );

    return (
        <div className="absolute inset-0 z-[100] bg-[#050505] text-gray-300 overflow-hidden font-sans flex flex-col">
             {/* Header */}
             <div className="bg-[#050505]/95 border-b border-white/10 px-6 py-4 flex justify-between items-center shrink-0">
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

             <div className="flex flex-1 overflow-hidden">
                 {/* Sidebar Navigation */}
                 <div className="hidden lg:block w-64 border-r border-white/10 bg-black/40 p-6 flex-col gap-2 overflow-y-auto">
                     <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">Contents</div>
                     <NavItem id="MAIN" icon={Home} label="Overview" />
                     <NavItem id="HOW_TO_PLAY" icon={Gamepad2} label="How to Play" />
                     <NavItem id="UTILITY" icon={Activity} label="Utility" />
                     <NavItem id="SINK" icon={Shield} label="Mechanics" />
                     <NavItem id="GOVERNANCE" icon={Vote} label="Governance" />
                 </div>

                 {/* Main Content Area */}
                 <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 bg-[#050505]">
                     {renderContent()}
                 </div>
             </div>
        </div>
    );
};
