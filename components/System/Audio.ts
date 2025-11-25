
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { RUN_SPEED_BASE } from '../../types';

export class AudioController {
  ctx: AudioContext | null = null;
  masterGain: GainNode | null = null;
  filterNode: BiquadFilterNode | null = null;

  // BGM State
  isPlaying = false;
  bpm = 128; // Base House Tempo
  baseBpm = 128;
  nextNoteTime = 0.0;
  current16thNote = 0; // 0-15 loop
  timerID: number | null = null;
  lookahead = 25.0; // ms
  scheduleAheadTime = 0.1; // s

  // Musical State
  rootNote = 48; // C3
  scale = [0, 3, 5, 7, 10]; // Minor Pentatonic intervals

  constructor() {
    // Lazy initialization
  }

  init() {
    if (!this.ctx) {
      // Support for standard and webkit prefixed AudioContext
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.4; 

      // Create a Global Filter for Menu/Game transitions (Lowpass)
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.value = 20000; // Start open
      this.filterNode.Q.value = 1;

      // Chain: Sources -> MasterGain -> Filter -> Destination
      this.masterGain.connect(this.filterNode);
      this.filterNode.connect(this.ctx.destination);
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

  setMenuMode(isMenu: boolean) {
      if (!this.ctx || !this.filterNode || !this.masterGain) return;
      const t = this.ctx.currentTime;
      
      if (isMenu) {
          // Muffle music (Lowpass at 600Hz) and lower volume slightly
          this.filterNode.frequency.exponentialRampToValueAtTime(600, t + 1.5);
          this.masterGain.gain.exponentialRampToValueAtTime(0.3, t + 1.5);
      } else {
          // Open filter (Full spectrum) and boost volume
          this.filterNode.frequency.exponentialRampToValueAtTime(22000, t + 1.0);
          this.masterGain.gain.exponentialRampToValueAtTime(0.5, t + 1.0);
      }
  }

  setGameSpeed(speed: number) {
    // Dynamic tempo scaling:
    // Base 128 BPM.
    // As speed increases, BPM increases.
    const ratio = Math.max(0.5, speed / RUN_SPEED_BASE);
    
    // Cap at 1.5x (approx 192 BPM)
    const targetBpm = Math.min(this.baseBpm * 1.5, this.baseBpm * ratio);
    
    // Smooth transition
    this.bpm = this.bpm * 0.9 + targetBpm * 0.1;
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

  // Convert MIDI note to Frequency
  mtof(note: number) {
      return 440 * Math.pow(2, (note - 69) / 12);
  }

  scheduleNote(beatNumber: number, time: number) {
    if (!this.ctx || !this.masterGain) return;

    // --- FUNKY CYBER HOUSE PATTERN ---

    // KICK: Driving 4-on-the-floor
    if (beatNumber % 4 === 0) {
        this.playKick(time); 
    } 

    // CLAP/SNARE: on 4 and 12 (Backbeat)
    if (beatNumber === 4 || beatNumber === 12) {
        this.playSnare(time, true);
    } 
    // Ghost Snares for funk
    if (beatNumber === 15 || beatNumber === 7) {
        if (Math.random() > 0.5) this.playSnare(time, false);
    }

    // HI-HAT: Off-beat open, tight closed
    if (beatNumber % 4 === 2) {
        this.playHiHat(time, true); // Open on & of beat
    } else if (beatNumber % 2 === 0) {
        this.playHiHat(time, false); // Closed
    }

    // BASS: Octave bouncing
    // Pattern changes every bar conceptually, but we keep it simple loop
    // Root C (36)
    const baseNote = 36; 
    
    if (beatNumber === 0) this.playBass(time, this.mtof(baseNote));
    if (beatNumber === 2) this.playBass(time, this.mtof(baseNote + 12)); // Octave
    if (beatNumber === 3) this.playBass(time, this.mtof(baseNote));
    if (beatNumber === 6) this.playBass(time, this.mtof(baseNote));
    if (beatNumber === 8) this.playBass(time, this.mtof(baseNote));
    if (beatNumber === 10) this.playBass(time, this.mtof(baseNote + 12)); // Octave
    if (beatNumber === 11) this.playBass(time, this.mtof(baseNote + 3)); // Minor 3rd pop
    if (beatNumber === 14) this.playBass(time, this.mtof(baseNote));

    // LEAD: Arpeggio / Melody
    // C Minor Pentatonic
    const leadScale = [60, 63, 65, 67, 70, 72, 75]; // C4 range
    
    // Play on specific 16ths
    if ([0, 3, 6, 9, 12, 14].includes(beatNumber)) {
        // Pseudo-random but deterministic melody based on time
        const index = (beatNumber + Math.floor(time)) % leadScale.length;
        const note = leadScale[index];
        this.playLead(time, this.mtof(note), 0.15);
        
        // Harmony (5th)
        if (beatNumber % 4 === 0) {
             this.playLead(time, this.mtof(note + 7), 0.15); 
        }
    }
  }

  // --- Synthesizers ---

  playKick(time: number) {
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();

    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
    
    gain.gain.setValueAtTime(1.0, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(time);
    osc.stop(time + 0.5);
  }

  playSnare(time: number, isMain: boolean) {
    // White Noise Snap
    const bufferSize = this.ctx!.sampleRate * (isMain ? 0.1 : 0.05);
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1);
    }
    const noise = this.ctx!.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1500;

    const gain = this.ctx!.createGain();
    gain.gain.setValueAtTime(isMain ? 0.7 : 0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + (isMain ? 0.2 : 0.1));

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);
    noise.start(time);
    noise.stop(time + 0.2);
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
    filter.frequency.value = 7000;

    const gain = this.ctx!.createGain();
    gain.gain.setValueAtTime(isOpen ? 0.2 : 0.1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + (isOpen ? 0.15 : 0.05));

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);
    noise.start(time);
    noise.stop(time + 0.3);
  }

  playBass(time: number, freq: number) {
    // FM Bass
    const osc = this.ctx!.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 5;
    filter.frequency.setValueAtTime(freq * 4, time);
    filter.frequency.exponentialRampToValueAtTime(freq, time + 0.2);

    const gain = this.ctx!.createGain();
    gain.gain.setValueAtTime(0.6, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(time);
    osc.stop(time + 0.3);
  }

  playLead(time: number, freq: number, duration: number) {
    // Detuned Super Saw effect (3 oscillators)
    const detune = 5;
    [0, -detune, detune].forEach(d => {
        const osc = this.ctx!.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, time);
        osc.detune.value = d;

        const gain = this.ctx!.createGain();
        gain.gain.setValueAtTime(0.08, time); // Lower gain per osc to prevent clipping
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

        const filter = this.ctx!.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(freq * 3, time);
        filter.frequency.linearRampToValueAtTime(freq, time + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(time);
        osc.stop(time + duration);
    });
  }

  // --- SFX ---

  playGemCollect() {
    if (!this.ctx || !this.masterGain) this.init();
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.linearRampToValueAtTime(2000, t + 0.1);
    
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  playLetterCollect() {
    if (!this.ctx || !this.masterGain) this.init();
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    
    // Major Chord arpeggio fast
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.value = f;
        const start = t + i * 0.04;
        gain.gain.setValueAtTime(0.15, start);
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
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(isDouble ? 300 : 150, t);
    osc.frequency.linearRampToValueAtTime(isDouble ? 600 : 300, t + 0.2);
    
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  playDamage() {
    if (!this.ctx || !this.masterGain) this.init();
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, t);
    osc.frequency.exponentialRampToValueAtTime(10, t + 0.4);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(t);
    osc.stop(t + 0.4);
  }
}

export const audio = new AudioController();
