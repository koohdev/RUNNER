
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Environment } from './components/World/Environment';
import { Player } from './components/World/Player';
import { LevelManager } from './components/World/LevelManager';
import { Effects } from './components/World/Effects';
import { HUD } from './components/UI/HUD';
import { LandingPage } from './components/UI/LandingPage';
import { Marketplace } from './components/UI/Marketplace';
import { Whitepaper } from './components/UI/Whitepaper';
import { useStore } from './store';
import { GameStatus, RUN_SPEED_BASE } from './types';
import { audio } from './components/System/Audio';

// Dynamic Camera Controller
const CameraController = () => {
  const { camera, size } = useThree();
  const { laneCount, status } = useStore();
  
  useFrame((state, delta) => {
    // If on Menu/Landing page or Marketplace or Whitepaper, do a slow flyby
    if (status === GameStatus.MENU || status === GameStatus.MARKETPLACE || status === GameStatus.WHITEPAPER) {
        // Slow drift
        camera.position.lerp(new THREE.Vector3(0, 4, 12), delta * 0.5);
        camera.lookAt(0, 2, -20);
        return;
    }

    // Determine if screen is narrow (mobile portrait)
    const aspect = size.width / size.height;
    const isMobile = aspect < 1.2; 

    // Calculate expansion factors
    const heightFactor = isMobile ? 2.0 : 0.5;
    const distFactor = isMobile ? 4.5 : 1.0;

    // Base (3 lanes): y=5.5, z=8
    // Calculate target based on how many extra lanes we have relative to the start
    const extraLanes = Math.max(0, laneCount - 3);

    const targetY = 5.5 + (extraLanes * heightFactor);
    const targetZ = 8.0 + (extraLanes * distFactor);

    const targetPos = new THREE.Vector3(0, targetY, targetZ);
    
    // Smoothly interpolate camera position
    camera.position.lerp(targetPos, delta * 2.0);
    
    // Look further down the track to see the end of lanes
    camera.lookAt(0, 0, -30); 
  });
  
  return null;
};

// Music Controller Component
const MusicController = () => {
  const { status, speed } = useStore();

  useEffect(() => {
    // Global listener to initialize audio context on first user interaction
    const initAudio = () => {
        if (audio.ctx?.state === 'suspended' || !audio.ctx) {
            audio.init();
        }
        if (!audio.isPlaying) {
            audio.startBGM();
        }
    };
    
    // Listen for any click or keypress to start audio engine
    window.addEventListener('pointerdown', initAudio, { once: true });
    window.addEventListener('keydown', initAudio, { once: true });
    
    return () => {
         window.removeEventListener('pointerdown', initAudio);
         window.removeEventListener('keydown', initAudio);
    };
  }, []);

  useEffect(() => {
    // Switch between Menu Mode (Muffled/Chill) and Game Mode (Clear/Fast)
    if (status === GameStatus.PLAYING) {
       audio.setMenuMode(false);
    } else {
       audio.setMenuMode(true);
    }
  }, [status]);

  useFrame(() => {
    if (status === GameStatus.PLAYING) {
      audio.setGameSpeed(speed);
    } else {
      // Idle tempo for menu (slower than game)
      audio.setGameSpeed(RUN_SPEED_BASE * 0.7); 
    }
  });

  return null;
};

function Scene() {
  const { status } = useStore();
  return (
    <>
        <Environment />
        <group>
            <group userData={{ isPlayer: true }} name="PlayerGroup">
                 {/* Show Player in menu for visual interest, but maybe idle? */}
                 <Player />
            </group>
            <LevelManager />
        </group>
        <Effects />
    </>
  );
}

function App() {
  const { status } = useStore();

  const renderUI = () => {
      switch(status) {
          case GameStatus.MENU: return <LandingPage />;
          case GameStatus.MARKETPLACE: return <Marketplace />;
          case GameStatus.WHITEPAPER: return <Whitepaper />;
          default: return <HUD />;
      }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      {renderUI()}
      
      <Canvas
        shadows
        dpr={[1, 1.5]} 
        gl={{ antialias: false, stencil: false, depth: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 5.5, 8], fov: 60 }}
        className="absolute inset-0 z-0"
      >
        <MusicController />
        <CameraController />
        <Suspense fallback={null}>
            <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
