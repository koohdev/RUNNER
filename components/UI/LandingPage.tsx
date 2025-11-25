
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { Wallet, ChevronRight, Zap, Globe, Shield, MessageCircle, Github, FileText, Copy, Check, ExternalLink, ShoppingBag, Trophy } from 'lucide-react';
import { useStore } from '../../store';
import { audio } from '../System/Audio';
import { GameStatus } from '../../types';

// Custom Icons
const XLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
);

const DiscordLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 127.14 96.36" aria-hidden="true" className={className} fill="currentColor">
        <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.89,105.89,0,0,0,126.6,80.22c1.24-23.23-13.28-47.57-18.9-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
    </svg>
);

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string; id?: string }> = ({ title, children, className = "", id }) => (
    <section id={id} className={`py-20 px-6 border-t border-white/10 relative ${className}`}>
        <div className="max-w-6xl mx-auto relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-12 font-cyber tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                {title}
            </h2>
            {children}
        </div>
    </section>
);

const FeatureCard: React.FC<{ icon: any; title: string; desc: string }> = ({ icon: Icon, title, desc }) => (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-cyan-500/50 transition-all hover:-translate-y-1 group">
        <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-900/30 transition-colors">
            <Icon className="w-6 h-6 text-cyan-400" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-white font-cyber">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
);

const StepCard: React.FC<{ num: string; title: string; desc: string }> = ({ num, title, desc }) => (
    <div className="relative pl-16 md:pl-0 group">
        {/* Desktop Circle */}
        <div className="hidden md:flex absolute -left-[25px] top-0 w-[50px] h-[50px] bg-black border-2 border-cyan-500 rounded-full z-10 items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-transform">
             <span className="font-bold text-cyan-400 text-xl font-mono">{num}</span>
        </div>
        
        {/* Mobile Circle */}
        <div className="md:hidden absolute left-0 top-0 w-10 h-10 bg-cyan-900/50 border border-cyan-500 rounded-full flex items-center justify-center z-10">
             <span className="font-bold text-cyan-300 text-sm font-mono">{num}</span>
        </div>

        <div className="md:border-l-2 border-white/10 md:pl-12 pb-12 relative min-h-[100px]">
             <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{title}</h3>
             <p className="text-gray-400 leading-relaxed max-w-md">{desc}</p>
        </div>
    </div>
);

// Mock Leaderboard Data
const LEADERBOARD_DATA = [
    { rank: 1, user: '0x71C...9A23', score: '2,840,500', reward: '5000 $GEMS' },
    { rank: 2, user: '0x3aB...11fF', score: '2,100,000', reward: '2500 $GEMS' },
    { rank: 3, user: 'runner.eth', score: '1,950,450', reward: '1000 $GEMS' },
    { rank: 4, user: 'cyber_ninj4', score: '1,820,000', reward: '500 $GEMS' },
    { rank: 5, user: '0x992...2211', score: '1,500,100', reward: '250 $GEMS' },
];

const TICKER_ITEMS = [
    "NETWORK: ETHEREUM L2", 
    "STATUS: LIVE", 
    "$GEMS: SIMULATION MODE", 
    "PROTOCOL UPDATED", 
    "MARKETPLACE DEMO LIVE", 
    "LEGENDARY RUNNER PREVIEW"
];

const CONTRACT_ADDRESS = "0x11c9513afd6f403A0414240B185d3FdA4139f7D1";

export const LandingPage: React.FC = () => {
    const { startGame, setStatus } = useStore();
    const [copied, setCopied] = useState(false);

    const handleStart = () => {
        audio.init();
        audio.startBGM();
        startGame();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(CONTRACT_ADDRESS);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="absolute inset-0 z-[100] overflow-y-auto bg-black/80 text-white scroll-smooth">
            {/* Ambient Background Noise */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none z-0"></div>

            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                         <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded flex items-center justify-center font-bold text-black font-cyber">R</div>
                         <span className="font-cyber font-bold text-xl tracking-widest">RUN-ETH</span>
                    </div>
                    <div className="hidden md:flex gap-8 text-sm font-mono text-gray-300 items-center">
                        <a href="#about" className="hover:text-cyan-400 transition-colors">ABOUT</a>
                        <button onClick={() => setStatus(GameStatus.MARKETPLACE)} className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                            MARKETPLACE <span className="bg-purple-600 text-white text-[10px] px-1 rounded">NEW</span>
                        </button>
                        <a href="#earn" className="hover:text-cyan-400 transition-colors">EARN</a>
                        <button onClick={() => setStatus(GameStatus.WHITEPAPER)} className="hover:text-cyan-400 transition-colors">
                            WHITEPAPER
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                         <a href="https://app.uniswap.org" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 px-4 py-2 bg-pink-600/10 border border-pink-500/30 text-pink-400 font-bold rounded hover:bg-pink-600/20 transition-all text-xs font-mono">
                            <img src="https://images.seeklogo.com/logo-png/39/2/uniswap-logo-png_seeklogo-398214.png" className="w-5 h-5" alt="Uniswap" />
                            GET $GEMS
                         </a>
                         <button onClick={handleStart} className="px-6 py-2 bg-white text-black font-bold rounded hover:scale-105 transition-transform text-sm font-mono">
                             PLAY DEMO
                         </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative min-h-screen flex items-center px-6 pt-20 pb-20">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-900/30 border border-yellow-500/30 text-yellow-400 text-xs font-mono tracking-widest uppercase animate-fade-in">
                            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                            DEMONET LIVE
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black font-cyber leading-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 drop-shadow-[0_0_30px_rgba(0,255,255,0.2)]">
                            RUN TO <br />
                            <span className="text-cyan-400">$EARN</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                            Navigate the Ethereum Neural Layer. Collect fragments, dodge firewalls, and simulated $GEMS in this Web3 infinite runner prototype.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button 
                                onClick={handleStart}
                                className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-lg rounded hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,255,255,0.4)] overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center">
                                    ENTER DEMO <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                            <button className="px-8 py-4 border border-white/20 text-white font-bold text-lg rounded hover:bg-white/5 transition-all flex items-center justify-center gap-2 cursor-not-allowed opacity-70" title="Coming in Phase 2">
                                <Wallet className="w-5 h-5" /> WALLET (SOON)
                            </button>
                        </div>

                        <div className="flex gap-8 pt-8 text-xs font-mono text-gray-500">
                             <div>
                                 <div className="text-white text-lg font-bold">12K+</div>
                                 <div>DEMO RUNS</div>
                             </div>
                             <div>
                                 <div className="text-white text-lg font-bold">PHASE 1</div>
                                 <div>CURRENT STAGE</div>
                             </div>
                        </div>
                    </div>
                    {/* Hero Visual is the 3D Canvas behind */}
                </div>
            </header>

            {/* Ticker - Fixed Animation */}
            <div className="bg-cyan-900/20 border-y border-cyan-500/20 py-3 overflow-hidden flex">
                <div className="animate-marquee whitespace-nowrap flex gap-12 text-sm font-mono text-cyan-400 px-6">
                     {/* Duplicate items to create seamless loop */}
                     {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                         <span key={i} className="flex items-center gap-2">
                             <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-50"></span>
                             {item}
                         </span>
                     ))}
                </div>
            </div>

            {/* About / Features */}
            <Section title="THE PROTOCOL" id="about">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeatureCard 
                        icon={Zap}
                        title="Hyper-Speed Gameplay"
                        desc="Reflex-based infinite runner mechanics. Speed increases with every data fragment collected."
                    />
                    <FeatureCard 
                        icon={Globe}
                        title="Web3 Native Design"
                        desc="Built with a decentralized future in mind. Assets, skins, and achievements are designed for on-chain integration."
                    />
                    <FeatureCard 
                        icon={Shield}
                        title="Skill-Based Mining"
                        desc="Master the track. While NFT Skins boost your yield potential, your raw score depends entirely on your reflexes and survival time."
                    />
                </div>
            </Section>

            {/* Community & Contract Section */}
            <Section title="COMMUNITY & CONTRACT" id="socials">
                <div className="bg-gray-900/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
                     <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                         <div className="w-full md:w-auto">
                             <div className="text-sm text-gray-400 mb-2 font-mono uppercase tracking-widest">Official CA</div>
                             <button 
                                onClick={handleCopy}
                                className="group relative w-full md:w-auto flex items-center justify-between bg-black/50 border border-cyan-500/30 rounded-full px-6 py-4 hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all"
                             >
                                 <span className="font-mono text-cyan-400 text-sm md:text-base mr-4 truncate max-w-[250px] md:max-w-none">
                                     {CONTRACT_ADDRESS}
                                 </span>
                                 {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-500 group-hover:text-white" />}
                                 {copied && <span className="absolute -top-8 right-0 bg-green-500 text-black text-xs font-bold px-2 py-1 rounded">COPIED!</span>}
                             </button>
                         </div>
                         
                         <div className="flex flex-wrap justify-center gap-4">
                             <a href="#" className="flex items-center gap-2 px-4 py-3 bg-gray-800 rounded-lg hover:bg-cyan-900/30 hover:text-cyan-400 transition-colors border border-gray-700">
                                 <ExternalLink className="w-4 h-4" />
                                 <span className="font-bold text-sm">DEXSCREENER</span>
                             </a>
                             <a href="#" className="flex items-center gap-2 px-4 py-3 bg-gray-800 rounded-lg hover:bg-cyan-900/30 hover:text-cyan-400 transition-colors border border-gray-700">
                                 <ExternalLink className="w-4 h-4" />
                                 <span className="font-bold text-sm">DEXTOOLS</span>
                             </a>
                             <a href="#" className="flex items-center gap-2 px-4 py-3 bg-gray-800 rounded-lg hover:bg-pink-900/30 hover:text-pink-400 transition-colors border border-gray-700">
                                 <img src="https://images.seeklogo.com/logo-png/39/2/uniswap-logo-png_seeklogo-398214.png" className="w-4 h-4 grayscale group-hover:grayscale-0" alt="Uni" />
                                 <span className="font-bold text-sm">UNISWAP</span>
                             </a>
                             <a href="#" className="flex items-center gap-2 px-4 py-3 bg-gray-800 rounded-lg hover:bg-black/50 hover:text-white transition-colors border border-gray-700">
                                 <XLogo className="w-4 h-4" />
                                 <span className="font-bold text-sm">X</span>
                             </a>
                             <a href="#" className="flex items-center gap-2 px-4 py-3 bg-gray-800 rounded-lg hover:bg-indigo-900/30 hover:text-indigo-400 transition-colors border border-gray-700">
                                 <DiscordLogo className="w-5 h-5" />
                                 <span className="font-bold text-sm">DISCORD</span>
                             </a>
                         </div>
                     </div>
                </div>
            </Section>

            {/* Marketplace Preview */}
            <Section title="NFT MARKETPLACE" id="marketplace" className="bg-gradient-to-br from-purple-900/20 to-black">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                     <div>
                         <div className="inline-block px-3 py-1 mb-4 rounded bg-purple-900/50 text-purple-300 text-xs font-bold border border-purple-500/30">
                             LIVE DEMO
                         </div>
                         <h3 className="text-3xl font-bold text-white mb-6">Equip. Run. Multiply.</h3>
                         <p className="text-gray-400 mb-8 text-lg">
                             Preview the advanced neural runners that will boost your mining efficiency. 
                             In the full release, these runners will be on-chain assets that grant permanent multipliers.
                         </p>
                         <ul className="space-y-4 mb-8">
                             <li className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-gray-400 font-bold border border-gray-700">1x</div>
                                 <span className="text-gray-300 font-mono">Common Runners</span>
                             </li>
                             <li className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded bg-blue-900/30 flex items-center justify-center text-blue-400 font-bold border border-blue-500/30">1.7x</div>
                                 <span className="text-blue-200 font-mono">Rare Runners (Velocity Series)</span>
                             </li>
                             <li className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded bg-purple-900/30 flex items-center justify-center text-purple-400 font-bold border border-purple-500/30">3x</div>
                                 <span className="text-purple-200 font-mono">Epic Runners (Phantom Series)</span>
                             </li>
                             <li className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded bg-yellow-900/30 flex items-center justify-center text-yellow-400 font-bold border border-yellow-500/30">5x</div>
                                 <span className="text-yellow-200 font-mono">Legendary Runners (Genesis)</span>
                             </li>
                         </ul>
                         <button 
                            onClick={() => setStatus(GameStatus.MARKETPLACE)}
                            className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                        >
                             <ShoppingBag className="w-5 h-5" /> VISIT MARKETPLACE DEMO
                         </button>
                     </div>
                     <div className="relative">
                          {/* Decorative Cards */}
                          <div className="absolute top-0 right-0 w-48 h-64 bg-gray-800 rounded-lg border-2 border-yellow-500/50 transform rotate-6 z-10 shadow-2xl"></div>
                          <div className="absolute top-4 right-12 w-48 h-64 bg-gray-800 rounded-lg border-2 border-blue-500/50 transform -rotate-3 z-0"></div>
                          <div className="bg-gray-900/80 border border-gray-700 p-6 rounded-xl relative z-20 backdrop-blur-sm">
                              <div className="flex justify-between items-center mb-4">
                                  <div className="font-cyber font-bold text-xl text-yellow-400">ETHEREUM PRIME</div>
                                  <div className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded border border-yellow-500/50">LEGENDARY</div>
                              </div>
                              <div className="h-40 bg-black/50 rounded mb-4 flex items-center justify-center">
                                  <span className="text-6xl">🏃</span>
                              </div>
                              <div className="flex justify-between items-center">
                                  <span className="text-gray-400 text-sm">Multiplier</span>
                                  <span className="text-xl font-bold text-white">5.0x</span>
                              </div>
                          </div>
                     </div>
                </div>
            </Section>

            {/* Leaderboard */}
            <Section title="GLOBAL LEADERBOARD" id="leaderboard">
                <div className="bg-gray-900/40 border border-white/10 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-4 bg-black/50 p-4 font-mono text-gray-500 text-sm tracking-widest border-b border-white/10">
                        <div>RANK</div>
                        <div className="col-span-2">USER</div>
                        <div className="text-right">SCORE</div>
                    </div>
                    {LEADERBOARD_DATA.map((row) => (
                        <div key={row.rank} className="grid grid-cols-4 p-4 items-center hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                            <div className="flex items-center gap-2">
                                {row.rank <= 3 && <Trophy className={`w-4 h-4 ${row.rank === 1 ? 'text-yellow-400' : row.rank === 2 ? 'text-gray-400' : 'text-orange-500'}`} />}
                                <span className={`font-bold font-mono ${row.rank === 1 ? 'text-yellow-400 text-xl' : 'text-white'}`}>{row.rank}</span>
                            </div>
                            <div className="col-span-2 font-mono text-cyan-300">{row.user}</div>
                            <div className="text-right font-bold text-white">{row.score}</div>
                        </div>
                    ))}
                    <div className="p-4 bg-cyan-900/10 text-center text-cyan-400 text-sm hover:bg-cyan-900/20 cursor-pointer transition-colors">
                        VIEW FULL RANKINGS (SIMULATED)
                    </div>
                </div>
            </Section>

            {/* How to Earn */}
            <Section title="HOW TO EARN" id="earn" className="bg-gradient-to-b from-black to-gray-900">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-4">
                         <StepCard 
                            num="01"
                            title="Start the Run"
                            desc="Initiate a session. No gas fees for the current demo mode."
                         />
                         <StepCard 
                            num="02"
                            title="Collect Data"
                            desc="Gather the letters R-U-N-E-T-H to complete blocks. Each block completion multiplies your score."
                         />
                         <StepCard 
                            num="03"
                            title="Mint Rewards (Coming Soon)"
                            desc="In Phase 2, convert your score into $GEMS tokens directly to your connected wallet."
                         />
                    </div>
                    <div className="relative h-[400px] bg-cyan-900/10 rounded-2xl border border-cyan-500/20 flex items-center justify-center p-8">
                        <div className="text-center">
                            <div className="text-6xl font-black text-white mb-4 font-cyber">1,000</div>
                            <div className="text-cyan-400 font-mono tracking-widest uppercase mb-8">Points = 1 $GEM</div>
                            <button className="px-6 py-3 bg-gray-700 text-gray-300 font-bold rounded-full cursor-not-allowed">
                                TOKENOMICS (LOCKED)
                            </button>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Whitepaper CTA - REDESIGNED */}
            <Section title="DOCUMENTATION" id="whitepaper" className="relative overflow-hidden">
                 {/* Background decoration */}
                 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                 <div className="relative z-10 bg-gray-900/40 backdrop-blur-sm border border-white/10 p-8 md:p-12 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-cyan-500/30 transition-colors">
                     <div>
                         <div className="flex items-center gap-3 mb-4">
                             <div className="p-2 bg-gray-800 rounded text-cyan-400"><FileText className="w-6 h-6" /></div>
                             <h3 className="text-3xl font-black font-cyber text-white">PROTOCOL WHITEPAPER</h3>
                         </div>
                         <p className="text-gray-400 max-w-xl text-lg leading-relaxed">
                             Deep dive into the <span className="text-cyan-400">game theory</span>, tokenomics mathematics, and the smart contract architecture powering the RUN-ETH ecosystem.
                         </p>
                     </div>
                     <button 
                        onClick={() => setStatus(GameStatus.WHITEPAPER)}
                        className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold text-lg rounded hover:bg-white hover:text-black transition-all flex items-center gap-3 font-mono group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                     >
                         READ V1.0 <ChevronRight className="w-5 h-5" />
                     </button>
                 </div>
            </Section>

            {/* Roadmap */}
            <Section title="ROADMAP" id="roadmap">
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                     {[
                         { phase: "PHASE 1", title: "Alpha Demo", active: true, items: ["Infinite Runner Engine", "Local Marketplace", "Simulated Economy"] },
                         { phase: "PHASE 2", title: "Web3 Integration", active: false, items: ["Wallet Connection", "On-Chain Assets", "$GEMS Token Generation"] },
                         { phase: "PHASE 3", title: "Expansion", active: false, items: ["Multiplayer Races", "Governance Token", "Staking Rewards"] },
                         { phase: "PHASE 4", title: "Metaverse", active: false, items: ["Land Sales", "User Generated Maps", "VR Support"] }
                     ].map((p, i) => (
                         <div key={i} className={`p-6 rounded-xl border ${p.active ? 'bg-cyan-900/20 border-cyan-500' : 'bg-gray-900/40 border-gray-800'}`}>
                             <div className={`text-xs font-bold mb-2 px-2 py-1 inline-block rounded ${p.active ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-500'}`}>{p.phase}</div>
                             <h3 className="text-xl font-bold text-white mb-4">{p.title}</h3>
                             <ul className="space-y-2">
                                 {p.items.map((item, idx) => (
                                     <li key={idx} className="flex items-center text-sm text-gray-400">
                                         <div className={`w-1.5 h-1.5 rounded-full mr-2 ${p.active ? 'bg-cyan-400' : 'bg-gray-600'}`}></div>
                                         {item}
                                     </li>
                                 ))}
                             </ul>
                         </div>
                     ))}
                 </div>
            </Section>

            {/* Footer */}
            <footer className="bg-black border-t border-white/10 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                             <div className="w-8 h-8 bg-white rounded flex items-center justify-center font-bold text-black font-cyber">R</div>
                             <span className="font-cyber font-bold text-xl tracking-widest">RUN-ETH</span>
                        </div>
                        <p className="text-gray-500 text-sm max-w-xs">
                            The premier high-speed runner of the decentralized web. <br/>
                            <span className="text-cyan-500">Currently in Alpha Demo.</span>
                        </p>
                    </div>
                    
                    <div className="flex gap-6">
                        <a href="#" className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all">
                            <XLogo className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-[#5865F2] hover:text-white transition-all">
                            <DiscordLogo className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all">
                            <Github className="w-5 h-5" />
                        </a>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between text-xs text-gray-600 font-mono">
                    <p>© 2024 RUN-ETH PROTOCOL. ALL RIGHTS RESERVED.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <button onClick={() => setStatus(GameStatus.WHITEPAPER)} className="hover:text-white">WHITEPAPER</button>
                        <a href="#" className="hover:text-white">TERMS</a>
                        <a href="#" className="hover:text-white">PRIVACY</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
