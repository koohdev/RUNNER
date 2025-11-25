
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { RUN_SPEED_BASE } from '../../types';

export class AudioController {
  ctx: AudioContext | null = null;
  masterGain: GainNode | null = null;

  // BGM State
  isPlaying = false;
  bpm = 110; 
  baseBpm = 110;
  nextNoteTime = 0.0;
  current16thNote = 0; // 0-15 loop
  timerID: number | null = null;
  lookahead = 25.0; // ms
  scheduleAheadTime = 0.1; // s

  constructor() {
    // Lazy initialization
  }

  init() {
    if (!this.ctx) {
      // Support for standard and webkit prefixed AudioContext
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.35; // Master volume
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // --- Background Music Sequencer ---

  startBGM() {
    if (this.isPlaying) return;
    this.init();
    if (!this.ctx) return;
    
    this.isPlaying = true;
    this.current16thNote = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.05;
    this.scheduler();
  }

  stopBGM() {
    this.isPlaying = false;
    if (this.timerID !== null) {
      window.clearTimeout(this.timerID);
      this.timerID = null;
    }
  }

  setGameSpeed(speed: number) {
    // Scale BPM based on speed relative to base speed
    // e.g., if speed is 2x base, bpm is 2x base
    // Clamp minimum ratio to avoid stalling music
    const ratio = Math.max(0.8, speed / RUN_SPEED_BASE);
    this.bpm = this.baseBpm * ratio;
  }

  scheduler() {
    if (!this.ctx) return;

    // While there are notes that will need to play before the next interval, 
    // schedule them and advance the pointer.
    while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.current16thNote, this.nextNoteTime);
      this.advanceNote();
    }
    
    if (this.isPlaying) {
      this.timerID = window.setTimeout(() => this.scheduler(), this.lookahead);
    }
  }

  advanceNote() {
    const secondsPerBeat = 60.0 / this.bpm;
    // 16th note = 1/4 of a beat
    this.nextNoteTime += 0.25 * secondsPerBeat; 

    this.current16thNote++;
    if (this.current16thNote === 16) {
      this.current16thNote = 0;
    }
  }

  scheduleNote(beatNumber: number, time: number) {
    if (!this.ctx || !this.masterGain) return;

    // --- Drum Pattern (Fun Retro Beat) ---
    // Kick: 0, 4, 8, 12 (Four on floor) + occasional syncopation
    if (beatNumber % 4 === 0) {
        this.playKick(time);
    } else if (beatNumber === 14) {
        // Double kick at end of bar for energy
        this.playKick(time);
    }

    // Snare: 4, 12 (Standard backbeat)
    if (beatNumber === 4 || beatNumber === 12) {
        this.playSnare(time);
    }

    // HiHat: Every 2nd 16th (8th notes)
    if (beatNumber % 2 === 0) {
        this.playHiHat(time, beatNumber % 4 === 2); // Accent off-beats slightly
    }

    // --- Bassline (Driving Arpeggio) ---
    // Simple energetic progression: C - F - G - C
    // 16 steps total. 4 steps per chord roughly.
    // C2 (65.41), F2 (87.31), G2 (98.00)
    
    let bassFreq = 65.41; // C2
    if (beatNumber >= 4 && beatNumber < 8) bassFreq = 87.31; // F2
    if (beatNumber >= 8 && beatNumber < 12) bassFreq = 98.00; // G2
    if (beatNumber >= 12) bassFreq = 130.81; // C3 (Octave up for turnaround)

    // Play bass on almost every step for "rolling" feel, skip a few for groove
    if (beatNumber !== 2 && beatNumber !== 10) {
        this.playBass(time, bassFreq);
    }

    // --- Lead / Melody (Playful Blips) ---
    // Sparse, syncopated melody
    const melodyScale = [523.25, 659.25, 783.99, 1046.50]; // C Major Arp
    
    if ([0, 3, 6, 9, 12, 14].includes(beatNumber)) {
        const noteIdx = (beatNumber + (Math.floor(time) % 2)) % melodyScale.length;
        // Randomize octave slightly for fun
        const freq = melodyScale[noteIdx]; 
        this.playLead(time, freq);
    }
  }

  // --- Synthesizers ---

  playKick(time: number) {
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();

    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
    
    gain.gain.setValueAtTime(0.8, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(time);
    osc.stop(time + 0.5);
  }

  playSnare(time: number) {
    // Noise buffer
    const bufferSize = this.ctx!.sampleRate * 0.2; // 0.2s
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.ctx!.createBufferSource();
    noise.buffer = buffer;

    // Filter for "snap"
    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;

    const gain = this.ctx!.createGain();
    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    noise.start(time);
    noise.stop(time + 0.2);
    
    // Slight tone for body
    const osc = this.ctx!.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, time);
    const oscGain = this.ctx!.createGain();
    oscGain.gain.setValueAtTime(0.2, time);
    oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
    
    osc.connect(oscGain);
    oscGain.connect(this.masterGain!);
    osc.start(time);
    osc.stop(time + 0.1);
  }

  playHiHat(time: number, isOpen: boolean) {
    const bufferSize = this.ctx!.sampleRate * 0.1;
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx!.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 8000;

    const gain = this.ctx!.createGain();
    const volume = isOpen ? 0.15 : 0.1;
    const decay = isOpen ? 0.1 : 0.05;

    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + decay);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    noise.start(time);
    noise.stop(time + decay);
  }

  playBass(time: number, freq: number) {
    const osc = this.ctx!.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    // Filter envelope for "wub"
    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, time);
    filter.frequency.linearRampToValueAtTime(800, time + 0.05);
    filter.frequency.exponentialRampToValueAtTime(200, time + 0.2);
    filter.Q.value = 2;

    const gain = this.ctx!.createGain();
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.linearRampToValueAtTime(0, time + 0.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(time);
    osc.stop(time + 0.2);
  }

  playLead(time: number, freq: number) {
    const osc = this.ctx!.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);

    const gain = this.ctx!.createGain();
    gain.gain.setValueAtTime(0.1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

    // Slight delay/reverb effect simulation via simple echo
    // (Optional, keeping it simple for now to avoid complexity)

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(time);
    osc.stop(time + 0.15);
  }

  // --- Sound Effects (Existing) ---

  playGemCollect() {
    if (!this.ctx || !this.masterGain) this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(2000, t + 0.1);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  playLetterCollect() {
    if (!this.ctx || !this.masterGain) this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    
    const freqs = [523.25, 659.25, 783.99]; 
    
    freqs.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        
        osc.type = 'triangle';
        osc.frequency.value = f;
        
        const start = t + (i * 0.04);
        const dur = 0.3;

        gain.gain.setValueAtTime(0.3, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + dur);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        
        osc.start(start);
        osc.stop(start + dur);
    });
  }

  playJump(isDouble = false) {
    if (!this.ctx || !this.masterGain) this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const startFreq = isDouble ? 400 : 200;
    const endFreq = isDouble ? 800 : 450;

    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + 0.15);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  playDamage() {
    if (!this.ctx || !this.masterGain) this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    
    const bufferSize = this.ctx.sampleRate * 0.3; 
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, t);
    osc.frequency.exponentialRampToValueAtTime(20, t + 0.3);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.6, t);
    oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    
    noise.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.3);
    noise.start(t);
    noise.stop(t + 0.3);
  }
}

export const audio = new AudioController();
