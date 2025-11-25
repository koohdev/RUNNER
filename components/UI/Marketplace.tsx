
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { ArrowLeft, Wallet, Check, Lock, Zap, Star } from 'lucide-react';
import { useStore } from '../../store';
import { GameStatus, AVAILABLE_RUNNERS, Runner } from '../../types';

export const Marketplace: React.FC = () => {
    const { setStatus, score, ownedRunners, activeRunnerId, buyRunner, equipRunner } = useStore();

    const handleBuy = (runner: Runner) => {
        if (buyRunner(runner.id, runner.price)) {
            // Optional: Play sound or show feedback
        }
    };

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'COMMON': return 'text-gray-400 border-gray-600';
            case 'RARE': return 'text-blue-400 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]';
            case 'EPIC': return 'text-purple-400 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]';
            case 'LEGENDARY': return 'text-yellow-400 border-yellow-500 shadow-[0_0_25px_rgba(234,179,8,0.5)]';
            default: return 'text-white border-white';
        }
    };

    return (
        <div className="absolute inset-0 z-[100] bg-black/90 text-white overflow-y-auto backdrop-blur-sm animate-fade-in">
             <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

             {/* Header */}
             <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
                 <button 
                    onClick={() => setStatus(GameStatus.MENU)}
                    className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
                 >
                     <ArrowLeft className="w-5 h-5" /> BACK TO MENU
                 </button>
                 <div className="flex items-center gap-2 bg-gray-900/80 px-4 py-2 rounded-full border border-cyan-500/30">
                     <Wallet className="w-5 h-5 text-cyan-400" />
                     <span className="font-mono font-bold text-xl">{score.toLocaleString()} $GEMS</span>
                 </div>
             </div>

             <div className="max-w-7xl mx-auto px-6 py-12">
                 <div className="text-center mb-12">
                     <h1 className="text-5xl font-black font-cyber text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
                         NFT MARKETPLACE
                     </h1>
                     <p className="text-gray-400 max-w-2xl mx-auto">
                         Acquire advanced neural runners to boost your mining efficiency. 
                         Runners are stored on-chain and grant permanent multipliers to your $GEMS yield.
                     </p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                     {AVAILABLE_RUNNERS.map((runner) => {
                         const isOwned = ownedRunners.includes(runner.id);
                         const isEquipped = activeRunnerId === runner.id;
                         const canAfford = score >= runner.price;
                         const rarityClass = getRarityColor(runner.rarity);

                         return (
                             <div 
                                key={runner.id} 
                                className={`relative bg-gray-900/60 rounded-xl overflow-hidden border-2 transition-all hover:-translate-y-2 group ${rarityClass.split(' ')[1]} ${rarityClass.split(' ')[2]}`}
                             >
                                 {/* Image Placeholder - In a real app this would be the 3D model preview or image */}
                                 <div className="h-48 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center relative overflow-hidden">
                                     <div 
                                        className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity"
                                        style={{ background: `radial-gradient(circle at center, ${runner.color}, transparent 70%)` }}
                                     ></div>
                                     <div className="relative z-10 w-20 h-32 rounded-lg border-2 border-white/20 shadow-xl" style={{ backgroundColor: runner.color }}>
                                          <div className="absolute inset-x-0 top-4 h-2 bg-black/20"></div>
                                          <div className="absolute inset-x-0 bottom-10 h-10 bg-black/10"></div>
                                     </div>
                                     
                                     {isEquipped && (
                                         <div className="absolute top-3 right-3 bg-green-500 text-black text-xs font-bold px-2 py-1 rounded flex items-center">
                                             <Check className="w-3 h-3 mr-1" /> EQUIPPED
                                         </div>
                                     )}
                                 </div>

                                 <div className="p-6">
                                     <div className="flex justify-between items-start mb-2">
                                         <h3 className="text-xl font-bold font-cyber">{runner.name}</h3>
                                         <span className={`text-xs font-bold px-2 py-1 rounded border ${rarityClass.split(' ')[0]} border-current`}>
                                             {runner.rarity}
                                         </span>
                                     </div>
                                     
                                     <p className="text-gray-400 text-sm mb-4 min-h-[40px]">{runner.description}</p>
                                     
                                     <div className="flex items-center gap-2 mb-6 text-yellow-400 font-mono">
                                         <Zap className="w-4 h-4" />
                                         <span>{runner.multiplier}x GEM YIELD</span>
                                     </div>

                                     {isOwned ? (
                                         <button 
                                            onClick={() => equipRunner(runner.id)}
                                            disabled={isEquipped}
                                            className={`w-full py-3 rounded font-bold transition-all ${isEquipped ? 'bg-gray-700 cursor-default text-gray-400' : 'bg-white text-black hover:bg-cyan-400'}`}
                                         >
                                             {isEquipped ? 'EQUIPPED' : 'EQUIP RUNNER'}
                                         </button>
                                     ) : (
                                         <button 
                                            onClick={() => handleBuy(runner)}
                                            disabled={!canAfford}
                                            className={`w-full py-3 rounded font-bold flex items-center justify-center gap-2 transition-all ${canAfford ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:brightness-110' : 'bg-gray-800 cursor-not-allowed text-gray-500'}`}
                                         >
                                             {canAfford ? <Wallet className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                             {runner.price === 0 ? 'FREE' : `${runner.price.toLocaleString()} $GEMS`}
                                         </button>
                                     )}
                                 </div>
                             </div>
                         );
                     })}
                 </div>
             </div>
        </div>
    );
};
