
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
    description: string;
}

export const AVAILABLE_RUNNERS: Runner[] = [
    {
        id: 'runner_default',
        name: 'PROTO-01',
        rarity: 'COMMON',
        multiplier: 1.0,
        color: '#00aaff',
        secondaryColor: '#00ffff',
        price: 0,
        description: 'Standard issue runner unit.'
    },
    {
        id: 'runner_crimson',
        name: 'RED VELOCITY',
        rarity: 'RARE',
        multiplier: 1.2,
        color: '#ff0055',
        secondaryColor: '#ff99aa',
        price: 5000,
        description: 'Optimized for high-speed data extraction.'
    },
    {
        id: 'runner_phantom',
        name: 'PHANTOM OPS',
        rarity: 'EPIC',
        multiplier: 2.0,
        color: '#9d00ff',
        secondaryColor: '#d400ff',
        price: 15000,
        description: 'Stealth coating with advanced mining algorithms.'
    },
    {
        id: 'runner_gold',
        name: 'ETHEREUM PRIME',
        rarity: 'LEGENDARY',
        multiplier: 5.0,
        color: '#ffd700',
        secondaryColor: '#ffffff',
        price: 50000,
        description: 'The ultimate validator node avatar. Maximum yield.'
    }
];