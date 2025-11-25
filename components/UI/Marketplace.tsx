
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Filter, Grid as GridIcon, List, ChevronDown, Check, Zap, Globe, Share2, MoreHorizontal, LayoutGrid, ShoppingCart } from 'lucide-react';
import { useStore } from '../../store';
import { GameStatus, AVAILABLE_RUNNERS, Runner } from '../../types';

export const Marketplace: React.FC = () => {
    const { setStatus, score, ownedRunners, activeRunnerId, buyRunner, equipRunner } = useStore();
    const [search, setSearch] = useState('');
    const [filterRarity, setFilterRarity] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Filter Logic
    const filteredRunners = useMemo(() => {
        return AVAILABLE_RUNNERS.filter(r => {
            const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
            const matchesRarity = filterRarity ? r.rarity === filterRarity : true;
            return matchesSearch && matchesRarity;
        }).sort((a, b) => {
            return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
        });
    }, [search, filterRarity, sortOrder]);

    const handleBuy = (runner: Runner) => {
        if (buyRunner(runner.id, runner.price)) {
            // Success sound or effect could go here
        }
    };

    const CollectionStat = ({ label, value }: { label: string, value: string }) => (
        <div className="flex flex-col items-start px-4 hover:opacity-80 cursor-pointer">
            <span className="text-xl font-bold text-white font-mono">{value}</span>
            <span className="text-xs text-gray-400 font-semibold">{label}</span>
        </div>
    );

    return (
        <div className="absolute inset-0 z-[100] bg-[#121212] text-white overflow-y-auto animate-fade-in custom-scrollbar">
            {/* Navbar (Mini) */}
            <div className="sticky top-0 z-50 bg-[#121212]/95 backdrop-blur-md border-b border-gray-800 px-6 h-16 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={() => setStatus(GameStatus.MENU)} className="text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded flex items-center justify-center font-bold text-black font-cyber text-xs">R</div>
                        <span className="font-cyber font-bold tracking-widest hidden md:block">RUN-ETH</span>
                    </div>
                    <div className="h-6 w-px bg-gray-700 mx-2 hidden md:block"></div>
                    <div className="hidden md:flex relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search items, collections, and accounts" 
                            className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 w-96 text-sm focus:outline-none focus:border-gray-600 transition-colors"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-700 transition-colors cursor-pointer">
                         <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                         <span className="font-mono font-bold text-sm">{score.toLocaleString()} $GEMS</span>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 border-2 border-white/20"></div>
                </div>
            </div>

            {/* Collection Banner */}
            <div className="relative w-full h-64 md:h-80 bg-gray-900 group overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 opacity-80"></div>
                {/* 3D-ish Grid Overlay */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)', backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)' }}></div>
                
                {/* Social/Share Overlay */}
                <div className="absolute top-4 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="p-2 bg-black/50 rounded-lg hover:bg-black/70 text-white"><Globe className="w-4 h-4"/></button>
                     <button className="p-2 bg-black/50 rounded-lg hover:bg-black/70 text-white"><Share2 className="w-4 h-4"/></button>
                     <button className="p-2 bg-black/50 rounded-lg hover:bg-black/70 text-white"><MoreHorizontal className="w-4 h-4"/></button>
                </div>
            </div>

            {/* Collection Info Header */}
            <div className="max-w-[2560px] mx-auto px-8 pb-6 -mt-[60px] relative z-10">
                <div className="flex flex-col gap-4">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl border-4 border-[#121212] bg-black shadow-xl overflow-hidden relative group cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-4xl font-black font-cyber text-black">
                            R
                        </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-3xl font-bold text-white font-cyber tracking-wide">RUN-ETH GENESIS</h1>
                                <div className="bg-cyan-500/20 text-cyan-400 p-0.5 rounded-full"><Check className="w-4 h-4" /></div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                                <span>By</span>
                                <span className="text-white font-bold cursor-pointer hover:text-cyan-400">@RUN-ETH_PROTOCOL</span>
                            </div>
                            <p className="text-gray-400 max-w-2xl text-sm leading-relaxed">
                                The official collection of neural-linked runners for the RUN-ETH protocol. 
                                Each runner grants specific yield multipliers and visual augmentations within the Neural Layer. 
                                Ownership is verified on-chain.
                            </p>
                        </div>
                        
                        {/* Stats Bar */}
                        <div className="flex flex-wrap gap-y-4 divide-x divide-gray-700 bg-gray-900/50 border border-gray-700 rounded-xl p-3 backdrop-blur-sm">
                            <CollectionStat label="floor price" value="1,500 $GEMS" />
                            <CollectionStat label="total volume" value="12.4M" />
                            <CollectionStat label="items" value="11" />
                            <CollectionStat label="owners" value="8.2K" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="border-t border-gray-800 sticky top-16 bg-[#121212] z-30 shadow-md">
                 <div className="px-8 py-4 flex items-center justify-between gap-4">
                      {/* Filter Toggle & Live Search */}
                      <div className="flex items-center gap-4 w-full">
                          <button className="flex items-center gap-2 text-white font-bold hover:opacity-70">
                              <Filter className="w-5 h-5" />
                          </button>
                          <div className="relative w-full max-w-md">
                               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                               <input 
                                  value={search}
                                  onChange={(e) => setSearch(e.target.value)}
                                  placeholder="Search by name or attribute" 
                                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-all"
                               />
                          </div>
                      </div>

                      {/* View Controls */}
                      <div className="flex items-center gap-3 shrink-0">
                           <div className="relative group">
                               <button 
                                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                  className="flex items-center justify-between gap-2 w-48 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white font-bold hover:bg-gray-700 transition-colors"
                               >
                                   {sortOrder === 'asc' ? 'Price: Low to High' : 'Price: High to Low'}
                                   <ChevronDown className="w-4 h-4" />
                               </button>
                           </div>
                           
                           <div className="flex bg-gray-800 rounded-lg border border-gray-700 p-1">
                               <button className="p-2 bg-gray-700 rounded text-white shadow-sm"><LayoutGrid className="w-4 h-4" /></button>
                               <button className="p-2 text-gray-400 hover:text-white"><GridIcon className="w-4 h-4" /></button>
                           </div>
                      </div>
                 </div>
            </div>

            <div className="flex min-h-screen">
                {/* Sidebar Filter */}
                <div className="hidden lg:block w-72 sticky top-[138px] h-[calc(100vh-138px)] overflow-y-auto border-r border-gray-800 p-4 custom-scrollbar">
                     <div className="space-y-2">
                         <div className="font-bold text-white mb-2 text-xs uppercase tracking-wider text-gray-500">Filters</div>
                         
                         {/* Status Accordion (Mock) */}
                         <div className="border-b border-gray-800 py-4">
                             <div className="flex justify-between items-center text-white font-bold mb-2 cursor-pointer">
                                 <span>Status</span>
                                 <ChevronDown className="w-4 h-4" />
                             </div>
                             <div className="grid grid-cols-2 gap-2 mt-2">
                                 <button className="bg-gray-800 border border-gray-700 text-white py-2 rounded-lg text-sm font-bold hover:bg-gray-700">Buy Now</button>
                                 <button className="bg-transparent border border-gray-700 text-white py-2 rounded-lg text-sm font-bold hover:bg-gray-800">New</button>
                             </div>
                         </div>

                         {/* Multiplier Accordion */}
                         <div className="border-b border-gray-800 py-4">
                             <div className="flex justify-between items-center text-white font-bold mb-2 cursor-pointer">
                                 <span>Multiplier</span>
                                 <ChevronDown className="w-4 h-4" />
                             </div>
                             <div className="space-y-2 mt-2">
                                 {[1.5, 2.0, 3.0, 4.0, 5.0].map(m => (
                                     <label key={m} className="flex items-center justify-between cursor-pointer group">
                                         <div className="flex items-center gap-2">
                                             <div className="w-4 h-4 border border-gray-600 rounded flex items-center justify-center group-hover:border-white">
                                                 {/* Mock Checkbox */}
                                             </div>
                                             <span className="text-gray-300 text-sm group-hover:text-white">{m.toFixed(1)}x Boost</span>
                                         </div>
                                         <span className="text-gray-600 text-xs">{(5.0 - m + 1) * 2}</span>
                                     </label>
                                 ))}
                             </div>
                         </div>

                         {/* Rarity Accordion */}
                         <div className="border-b border-gray-800 py-4">
                             <div className="flex justify-between items-center text-white font-bold mb-2 cursor-pointer">
                                 <span>Rarity</span>
                                 <ChevronDown className="w-4 h-4" />
                             </div>
                             <div className="space-y-1 mt-2">
                                 {['COMMON', 'RARE', 'EPIC', 'LEGENDARY'].map(rarity => (
                                     <button 
                                        key={rarity}
                                        onClick={() => setFilterRarity(prev => prev === rarity ? null : rarity)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between items-center ${filterRarity === rarity ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                                     >
                                         <span className="capitalize">{rarity.toLowerCase()}</span>
                                         {filterRarity === rarity && <Check className="w-3 h-3 text-cyan-400" />}
                                     </button>
                                 ))}
                             </div>
                         </div>
                     </div>
                </div>

                {/* Grid Content */}
                <div className="flex-1 p-6">
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                         {filteredRunners.map(runner => {
                             const isOwned = ownedRunners.includes(runner.id);
                             const isEquipped = activeRunnerId === runner.id;
                             const canAfford = score >= runner.price;

                             return (
                                 <div 
                                    key={runner.id} 
                                    className="bg-[#121212] border border-gray-800 rounded-xl overflow-hidden hover:shadow-xl hover:translate-y-[-2px] hover:border-gray-600 transition-all group flex flex-col relative"
                                 >
                                      {/* Card Image */}
                                      <div className={`aspect-square relative overflow-hidden bg-gradient-to-br ${runner.imageGradient}`}>
                                          <div className="absolute inset-0 flex items-center justify-center">
                                              <div 
                                                className="w-1/2 h-2/3 rounded-lg border-2 border-white/20 shadow-2xl relative"
                                                style={{ backgroundColor: runner.color }}
                                              >
                                                   <div className="absolute top-2 right-2 flex flex-col gap-1">
                                                       <div className="w-2 h-2 rounded-full bg-white/50"></div>
                                                       <div className="w-2 h-2 rounded-full bg-white/50"></div>
                                                   </div>
                                              </div>
                                          </div>
                                          
                                          {/* Multiplier Badge */}
                                          <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                                              <Zap className="w-3 h-3 text-yellow-400" />
                                              {runner.multiplier}x
                                          </div>

                                          {/* Buy Overlay (Hover) */}
                                          {!isOwned && (
                                              <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                                                  <button 
                                                      onClick={(e) => { e.stopPropagation(); handleBuy(runner); }}
                                                      disabled={!canAfford}
                                                      className={`w-full py-3 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 ${canAfford ? 'bg-cyan-500 text-white hover:bg-cyan-400' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                                                  >
                                                      {canAfford ? 'Buy Now' : 'Insufficient Funds'}
                                                      <ShoppingCart className="w-4 h-4" />
                                                  </button>
                                              </div>
                                          )}
                                      </div>

                                      {/* Card Details */}
                                      <div className="p-4 flex flex-col gap-3 h-full">
                                          <div className="flex justify-between items-start">
                                              <div>
                                                  <div className="text-gray-500 text-xs font-bold uppercase mb-0.5">{runner.name.split('#')[0]}</div>
                                                  <div className="text-white font-bold font-cyber text-sm">#{runner.name.split('#')[1]}</div>
                                              </div>
                                              {isOwned && (
                                                  <div className={`text-[10px] font-bold px-2 py-1 rounded uppercase border ${isEquipped ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                                                      {isEquipped ? 'Equipped' : 'Owned'}
                                                  </div>
                                              )}
                                          </div>

                                          <div className="mt-auto pt-3 border-t border-gray-800">
                                              {isOwned ? (
                                                  <div className="w-full">
                                                      <button 
                                                          onClick={() => equipRunner(runner.id)}
                                                          disabled={isEquipped}
                                                          className={`w-full py-2 rounded-lg font-bold text-xs transition-colors ${isEquipped ? 'text-gray-500 cursor-default' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
                                                      >
                                                          {isEquipped ? 'Active Runner' : 'Equip Item'}
                                                      </button>
                                                  </div>
                                              ) : (
                                                  <div className="flex flex-col gap-0.5">
                                                      <span className="text-xs text-gray-500 font-medium">Price</span>
                                                      <div className="text-white font-bold text-sm flex items-center gap-1">
                                                          {runner.price === 0 ? 'Free' : runner.price.toLocaleString()} 
                                                          {runner.price > 0 && <span className="text-xs text-gray-400 font-normal">$GEMS</span>}
                                                      </div>
                                                      <div className="text-[10px] text-gray-500">Last Sale: {(runner.price * 0.9).toLocaleString()} $GEMS</div>
                                                  </div>
                                              )}
                                          </div>
                                      </div>
                                 </div>
                             );
                         })}
                     </div>
                </div>
            </div>
        </div>
    );
};
