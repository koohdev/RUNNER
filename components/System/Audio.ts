
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
  bpm = 128; // Faster, more exciting base tempo
  baseBpm = 128;
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
      this.masterGain.gain.value = 0.4; // Slightly louder master
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
    // Dynamic tempo scaling
    const ratio = Math.max(0.8, speed / RUN_SPEED_BASE);
    // Cap at 1.5x so it doesn't get too chaotic
    const targetBpm = Math.min(this.baseBpm * 1.5, this.baseBpm * ratio);
    this.bpm = targetBpm;
  }

  scheduler() {
    if (!this.ctx) return;

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

    // --- High Energy Pattern ---

    // KICK: Four on the floor + syncopated ghost kicks
    if (beatNumber % 4 === 0) {
        this.playKick(time, true); // Accent
    } else if (beatNumber === 14 || beatNumber === 7) {
        // Funky ghost kicks
        this.playKick(time, false);
    }

    // SNARE/CLAP: on 4 and 12 (standard 2 & 4)
    if (beatNumber === 4 || beatNumber === 12) {
        this.playSnare(time);
    }

    // HI-HAT: Off-beats (Open) and active 16ths (Closed)
    if (beatNumber % 4 === 2) {
        this.playHiHat(time, true); // Open
    } else {
        this.playHiHat(time, false); // Closed tick
    }

    // BASS: Bouncy Octave Jump Pattern
    // Root: F (87.31) -> G (98.00) -> A# (116.54) -> C (130.81)
    // Progression changes every measure (16 beats) - Simulated by checking a global counter or simplified to a loop
    // Let's do a 2-bar loop feel by using modulo on a larger scale or just simple variations
    
    let root = 87.31; // F2
    if (beatNumber > 8) root = 98.00; // G2

    // Funky Bass Rhythm: 0, 2(short), 3, 6, 8, 10(octave), 12, 14
    if ([0, 3, 6, 8, 12, 14].includes(beatNumber)) {
        this.playBass(time, root, false);
    } else if ([2, 10].includes(beatNumber)) {
        this.playBass(time, root * 2, true); // Octave pop
    }

    // LEAD: Arpeggiated Plucks
    // Pentatonic scale run
    // F Minor Pentatonic: F, Ab, Bb, C, Eb
    const scale = [349.23, 415.30, 466.16, 523.25, 622.25, 698.46]; 
    
    // Play on off-16ths for energy
    if ([2, 5, 7, 10, 13, 15].includes(beatNumber)) {
        // Randomize notes from scale for "jamming" feel
        // Use a pseudo-random index based on time to keep it deterministic-ish but fun
        const idx = (beatNumber * 3 + Math.floor(time)) % scale.length;
        this.playLead(time, scale[idx]);
    }
  }

  // --- Synthesizers ---

  playKick(time: number, accent: boolean) {
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();

    osc.frequency.setValueAtTime(accent ? 180 : 150, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.4);
    
    gain.gain.setValueAtTime(accent ? 1.0 : 0.6, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(time);
    osc.stop(time + 0.4);
  }

  playSnare(time: number) {
    // Noise snap
    const bufferSize = this.ctx!.sampleRate * 0.1;
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.8;
    }
    const noise = this.ctx!.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2000;

    const gain = this.ctx!.createGain();
    gain.gain.setValueAtTime(0.6, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);
    noise.start(time);
    noise.stop(time + 0.15);

    // Impact Tone
    const osc = this.ctx!.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, time);
    osc.frequency.exponentialRampToValueAtTime(100, time + 0.1);
    
    const oscGain = this.ctx!.createGain();
    oscGain.gain.setValueAtTime(0.4, time);
    oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
    
    osc.connect(oscGain);
    oscGain.connect(this.masterGain!);
    osc.start(time);
    osc.stop(time + 0.1);
  }

  playHiHat(time: number, isOpen: boolean) {
    const bufferSize = this.ctx!.sampleRate * (isOpen ? 0.3 : 0.05);
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx!.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 10000;

    const gain = this.ctx!.createGain();
    gain.gain.setValueAtTime(isOpen ? 0.15 : 0.1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + (isOpen ? 0.2 : 0.05));

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);
    noise.start(time);
    noise.stop(time + (isOpen ? 0.2 : 0.05));
  }

  playBass(time: number, freq: number, isPop: boolean) {
    const osc = this.ctx!.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, time);
    filter.frequency.exponentialRampToValueAtTime(isPop ? 2000 : 600, time + 0.05);
    filter.frequency.exponentialRampToValueAtTime(100, time + 0.2);
    filter.Q.value = 5; // Acid-like resonance

    const gain = this.ctx!.createGain();
    gain.gain.setValueAtTime(isPop ? 0.35 : 0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.25);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(time);
    osc.stop(time + 0.25);
  }

  playLead(time: number, freq: number) {
    const osc = this.ctx!.createOscillator();
    osc.type = 'square'; // 8-bit sound
    osc.frequency.setValueAtTime(freq, time);

    const gain = this.ctx!.createGain();
    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

    // Simple delay effect
    const delay = this.ctx!.createDelay();
    delay.delayTime.value = 0.15;
    const delayGain = this.ctx!.createGain();
    delayGain.gain.value = 0.3;

    osc.connect(gain);
    gain.connect(this.masterGain!);
    gain.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(this.masterGain!); // One repeat

    osc.start(time);
    osc.stop(time + 0.1);
  }

  // --- SFX (Unchanged logic, re-declared for completeness) ---

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
        gain.gain.setValueAtTime(0.3, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.3);
        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(start);
        osc.stop(start + 0.3);
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
    for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 2 - 1; }
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
