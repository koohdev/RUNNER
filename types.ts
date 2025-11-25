
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


export enum GameStatus {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  SHOP = 'SHOP',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY',
  MARKETPLACE = 'MARKETPLACE',
  WHITEPAPER = 'WHITEPAPER'
}

export enum ObjectType {
  OBSTACLE = 'OBSTACLE',
  GEM = 'GEM',
  LETTER = 'LETTER',
  SHOP_PORTAL = 'SHOP_PORTAL',
  ALIEN = 'ALIEN',
  MISSILE = 'MISSILE'
}

export interface GameObject {
  id: string;
  type: ObjectType;
  position: [number, number, number]; // x, y, z
  active: boolean;
  value?: string; // For letters (G, E, M...)
  color?: string;
  targetIndex?: number; // Index in the GEMINI target word
  points?: number; // Score value for gems
  hasFired?: boolean; // For Aliens
}

export const LANE_WIDTH = 2.2;
export const JUMP_HEIGHT = 2.5;
export const JUMP_DURATION = 0.6; // seconds
export const RUN_SPEED_BASE = 22.5;
export const SPAWN_DISTANCE = 120;
export const REMOVE_DISTANCE = 20; // Behind player

// Google-ish Neon Colors adapted for RUN-ETH
export const GEMINI_COLORS = [
    '#2979ff', // R - Blue
    '#ff1744', // U - Red
    '#ffea00', // N - Yellow
    '#ffffff', // - - White
    '#2979ff', // E - Blue
    '#00e676', // T - Green
    '#ff1744', // H - Red
];

export interface ShopItem {
    id: string;
    name: string;
    description: string;
    cost: number;
    icon: any; // Lucide icon component
    oneTime?: boolean; // If true, remove from pool after buying
}

export interface Runner {
    id: string;
    name: string;
    rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
    multiplier: number;
    color: string;
    secondaryColor: string; // For details
    price: number; // in $GEMS
    description?: string;
    seller: string;
    imageGradient: string;
}

export const AVAILABLE_RUNNERS: Runner[] = [
    {
        id: 'runner_default',
        name: 'Runner #0001',
        rarity: 'COMMON',
        multiplier: 1.0,
        color: '#00aaff',
        secondaryColor: '#00ffff',
        price: 0,
        description: 'Standard issue unit.',
        seller: '@RUN-ETH',
        imageGradient: 'from-blue-900 to-cyan-900'
    },
    {
        id: 'runner_scout',
        name: 'Runner #1042',
        rarity: 'COMMON',
        multiplier: 1.2,
        color: '#00cc88',
        secondaryColor: '#ccffcc',
        price: 1500,
        description: 'Lightweight scout model.',
        seller: '@RUN-ETH',
        imageGradient: 'from-green-900 to-emerald-900'
    },
    {
        id: 'runner_swift',
        name: 'Runner #2291',
        rarity: 'RARE',
        multiplier: 1.5,
        color: '#ffaa00',
        secondaryColor: '#ffffaa',
        price: 5000,
        description: 'Enhanced servos for speed.',
        seller: '@RUN-ETH',
        imageGradient: 'from-orange-900 to-yellow-900'
    },
    {
        id: 'runner_crimson',
        name: 'Runner #2884',
        rarity: 'RARE',
        multiplier: 1.7,
        color: '#ff0055',
        secondaryColor: '#ff99aa',
        price: 8500,
        description: 'Optimized red velocity casing.',
        seller: '@RUN-ETH',
        imageGradient: 'from-red-900 to-pink-900'
    },
    {
        id: 'runner_phantom',
        name: 'Runner #3301',
        rarity: 'EPIC',
        multiplier: 2.0,
        color: '#9d00ff',
        secondaryColor: '#d400ff',
        price: 15000,
        seller: '@RUN-ETH',
        imageGradient: 'from-purple-900 to-indigo-900'
    },
    {
        id: 'runner_spectre',
        name: 'Runner #3599',
        rarity: 'EPIC',
        multiplier: 2.5,
        color: '#4400ff',
        secondaryColor: '#8844ff',
        price: 22000,
        seller: '@RUN-ETH',
        imageGradient: 'from-indigo-900 to-blue-900'
    },
    {
        id: 'runner_vortex',
        name: 'Runner #4120',
        rarity: 'EPIC',
        multiplier: 3.0,
        color: '#00ffcc',
        secondaryColor: '#ffffff',
        price: 35000,
        seller: '@RUN-ETH',
        imageGradient: 'from-teal-900 to-cyan-900'
    },
    {
        id: 'runner_cyber',
        name: 'Runner #5002',
        rarity: 'LEGENDARY',
        multiplier: 3.5,
        color: '#ff00ff',
        secondaryColor: '#00ffff',
        price: 45000,
        seller: '@RUN-ETH',
        imageGradient: 'from-pink-900 to-purple-900'
    },
    {
        id: 'runner_prime',
        name: 'Runner #8888',
        rarity: 'LEGENDARY',
        multiplier: 4.0,
        color: '#ffffff',
        secondaryColor: '#000000',
        price: 60000,
        seller: '@RUN-ETH',
        imageGradient: 'from-gray-100 to-gray-400'
    },
    {
        id: 'runner_gold',
        name: 'Runner #9999',
        rarity: 'LEGENDARY',
        multiplier: 4.5,
        color: '#ffd700',
        secondaryColor: '#ffffff',
        price: 75000,
        description: 'Pure gold plating.',
        seller: '@RUN-ETH',
        imageGradient: 'from-yellow-700 to-yellow-500'
    },
    {
        id: 'runner_genesis',
        name: 'Genesis #0000',
        rarity: 'LEGENDARY',
        multiplier: 5.0,
        color: '#000000',
        secondaryColor: '#ffd700',
        price: 100000,
        description: 'The Original.',
        seller: '@RUN-ETH',
        imageGradient: 'from-gray-900 to-black'
    }
];
