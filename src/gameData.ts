import { Mech, Modification, Mission } from './types';

export const INITIAL_MECHS: Mech[] = [
  {
    id: 'red-leader',
    name: 'RED LEADER',
    level: 42,
    power: 85,
    speed: 60,
    armor: 92,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmVFOnWaVxdZSUE-IrF8bAJSkIHK_cd8dj9Aln0-9KjEUxI1xCqVClVJk6RnWa6VORgZyDND3u0Ulh0PNRPdTDYnQnLs_WL32htebLbghmLxCUIi9TRzG0Qp3dwDHxLKLxaiI5XluoIwHemMZo9z6iLkosiAshpCWcRr5KP4NryJY_SSEbq_Jw3IpkjGaGlFi-IV9WFNQ_KoqtCFSxRH1q2N_vQpPFp2DiV9xI2vK9bry7trXFh8BNGQ',
    colorClass: 'text-primary',
    bgColor: 'border-primary-container',
    description: 'A powerful red mechanical robot hero optimized for high impact vanguard combat.',
    chassisIntegrity: 100,
    coreResonance: 'STABLE',
    maxModSlots: 5,
    equippedMods: ['fusion-reactor', 'heavy-plating', 'nano-repair-bots']
  },
  {
    id: 'blue-defender',
    name: 'BLUE DEFENDER',
    level: 35,
    power: 65,
    speed: 40,
    armor: 98,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpMWZtpzVJGkTsm-NxTiUXn3HHUAp5u-dKpDaon-CEjWdQQdMJYKddjzbBTKMChQDTKkhDI_kM94tpDA6T3KiVvUB3gcmmdjJjY2h0GoHZS8JlFjBVN0MjgM5NtplrUHozzObm_S-hLjt_OKZ0qAZ2sE70GB38vFCB4ICfOVVRXSH0A5B9i9XkAoUpVv7IfNkemzh77Uare1Q3vMWjeE2VTzeok82-tBRWijwxrLnmM6KWSzY2zKCWww',
    colorClass: 'text-secondary',
    bgColor: 'border-secondary-container',
    description: 'Sentry-grade heavyweight chassis with solid armor configuration and reinforced arm shield plates.',
    chassisIntegrity: 100,
    coreResonance: 'STABLE',
    maxModSlots: 4,
    equippedMods: ['heavy-plating']
  },
  {
    id: 'yellow-scout',
    name: 'YELLOW SCOUT',
    level: 28,
    power: 50,
    speed: 95,
    armor: 55,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIh-p2OneS-ZQCl53aiRkNLY29w5YjBlN0tmN_6IQzuSYauaVIpHCQqWP7loBZWWFjTO2QPCOPPLzUsmEN-wOLq1hMYG8e2-K2w-a_nBtHFquWrRJtXZ8E2eGNC-UIPdNilrjurumq9DOBXRusN_MjGEGD8vnjddzIYw_Qs-mxzB8AttIUXqiC32dUauTvzqc9sXlFU6S7eNRB25xIlIq_FQs6X6ybvVyhP1wuYI2N4pQMumPJEUQkFg',
    colorClass: 'text-tertiary',
    bgColor: 'border-tertiary-container',
    description: 'Sleek, aerodynamic prototype equipped with sensory arrays and lightning-fast traversal systems.',
    chassisIntegrity: 100,
    coreResonance: 'STABLE',
    maxModSlots: 3,
    equippedMods: ['overcharged-thrusters']
  }
];

export const AVAILABLE_MODS: Modification[] = [
  {
    id: 'fusion-reactor',
    name: 'Fusion Core Overdrive',
    description: '+15 Power boost via active plasma circulation.',
    statImpact: { power: 15 },
    icon: 'bolt'
  },
  {
    id: 'heavy-plating',
    name: 'Tungsten-Carbide Plating',
    description: '+15 Armor reinforcement, -5 Traversal Speed.',
    statImpact: { armor: 15, speed: -5 },
    icon: 'shield'
  },
  {
    id: 'overcharged-thrusters',
    name: 'Aero-Boost Jetpack',
    description: '+15 Traversal Speed, -5 Structural Armor.',
    statImpact: { speed: 15, armor: -5 },
    icon: 'rocket_launch'
  },
  {
    id: 'nano-repair-bots',
    name: 'Self-Assembling Nanites',
    description: '+5 Power & +5 Armor, active hull reconstruction.',
    statImpact: { power: 5, armor: 5 },
    icon: 'build'
  },
  {
    id: 'matrix-core',
    name: 'Chronos Quantum Matrix',
    description: '+10 Power, +10 Traversal Speed, +10 Armor.',
    statImpact: { power: 10, speed: 10, armor: 10 },
    icon: 'settings_input_component'
  }
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'mission-01',
    name: 'GOLDEN FORGE',
    sectorName: 'SECTOR: ADVENTURE ZONE EXPLORATION',
    difficulty: 'MEDIUM',
    xpReward: 1500,
    scrapReward: '0.8K',
    objectivesCount: 3,
    objectives: ['Investigate forge core temperature', 'Gather gold titanium nuggets', 'Uplink telemetry data'],
    isCompleted: true,
    coords: { x: 400, y: 200 },
    locked: false,
    levelNum: '01',
    statusText: 'FOUND IT!',
    description: 'A glowing structural forge hidden deep within ancient mechanical valleys.'
  },
  {
    id: 'mission-02',
    name: 'IRON FORGE',
    sectorName: 'SECTOR: STEEL OLYMPUS',
    difficulty: 'HARD',
    xpReward: 2500,
    scrapReward: '1.2K',
    objectivesCount: 3,
    objectives: ['Defend mining outpost OMEGA-7', 'Sabotage main cooling tower', 'Defeat Vanguard Scout Titan'],
    isCompleted: false,
    coords: { x: 300, y: 400 },
    locked: false,
    levelNum: '02',
    statusText: 'ACTIVE',
    description: 'Heavy industrial district overrun by giant rogue Goliath titans.'
  },
  {
    id: 'mission-03',
    name: 'CYBER CORE',
    sectorName: 'SECTOR: NEO-TOKYO MATRIX',
    difficulty: 'HARD',
    xpReward: 3500,
    scrapReward: '2.5K',
    objectivesCount: 4,
    objectives: ['Decrypt main access gates', 'Purge corrupt AI matrix files', 'Recover classified nanite plans', 'Overclock defense capacitors'],
    isCompleted: false,
    coords: { x: 450, y: 650 },
    locked: true,
    levelNum: '03',
    statusText: 'MYSTERY',
    description: 'Glitchy neon-infused control center covered in digital security locks.'
  },
  {
    id: 'mission-04',
    name: 'SKY ANCHOR',
    sectorName: 'SECTOR: HIGH TRAJECTORY CLOUD',
    difficulty: 'HARD',
    xpReward: 4200,
    scrapReward: '3.0K',
    objectivesCount: 3,
    objectives: ['Disable localized storm generators', 'Realign satellite solar panels', 'Clear airspace of fighter drones'],
    isCompleted: false,
    coords: { x: 250, y: 850 },
    locked: true,
    levelNum: '04',
    statusText: 'LOCKED',
    description: 'Hanging platform facility surrounded by high-voltage static storms.'
  },
  {
    id: 'mission-05',
    name: 'TITAN RAMPART',
    sectorName: 'SECTOR: THE GREAT VOID GATE',
    difficulty: 'BOSS',
    xpReward: 8000,
    scrapReward: '10.0K',
    objectivesCount: 5,
    objectives: ['Destroy defensive shields', 'Avoid boss energy beam strikes', 'Cripple engine thrust actuators', 'Expose core thermal heat exhaust', 'Strike lethal blow'],
    isCompleted: false,
    coords: { x: 500, y: 1050 },
    locked: true,
    levelNum: '05',
    statusText: 'BOSS LOCKED',
    description: 'Armored heavy battleship hangar home to the legendary Titan of Steel.'
  }
];

export function getCustomizedStats(mech: Mech, equippedModIds: string[]): { power: number; speed: number; armor: number } {
  let power = mech.power;
  let speed = mech.speed;
  let armor = mech.armor;

  equippedModIds.forEach(modId => {
    const mod = AVAILABLE_MODS.find(m => m.id === modId);
    if (mod) {
      if (mod.statImpact.power) power += mod.statImpact.power;
      if (mod.statImpact.speed) speed += mod.statImpact.speed;
      if (mod.statImpact.armor) armor += mod.statImpact.armor;
    }
  });

  // Clamp stats between 5 and 100
  return {
    power: Math.min(100, Math.max(5, power)),
    speed: Math.min(100, Math.max(5, speed)),
    armor: Math.min(100, Math.max(5, armor))
  };
}

// Simple synthesizer sound generator using browser Web Audio API
export function playSynthBeep(type: 'click' | 'select' | 'damage' | 'shield' | 'level-up' | 'game-over' | 'victory') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'select') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'damage') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'shield') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'victory') {
      // play a quick happy arpeggio
      const notes = [300, 450, 600, 900];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.15);
      });
    } else if (type === 'level-up') {
      const notes = [400, 600, 800, 1200];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.12);
      });
    } else if (type === 'game-over') {
      const notes = [400, 300, 200, 100];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.25);
      });
    }
  } catch (e) {
    console.warn('Web Audio Context not supported or allowed yet.', e);
  }
}
