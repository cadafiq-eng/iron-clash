export interface Mech {
  id: string;
  name: string;
  level: number;
  power: number; // 0-100
  speed: number; // 0-100
  armor: number; // 0-100
  image: string;
  colorClass: string; // text-primary, text-secondary, etc.
  bgColor: string; // border-primary-container etc
  description: string;
  chassisIntegrity: number; // 100%
  coreResonance: 'STABLE' | 'OVERCHARGED' | 'CRITICAL';
  maxModSlots: number;
  equippedMods: string[]; // ids of mods
}

export interface Modification {
  id: string;
  name: string;
  description: string;
  statImpact: {
    power?: number;
    speed?: number;
    armor?: number;
  };
  icon: string;
}

export interface Mission {
  id: string;
  name: string;
  sectorName: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'BOSS';
  xpReward: number;
  scrapReward: string;
  objectivesCount: number;
  objectives: string[];
  isCompleted: boolean;
  coords: { x: number; y: number }; // Top position, left position on relative map
  locked: boolean;
  levelNum: string;
  statusText: string;
  description: string;
}

export type GameMode = 'kids' | 'adult';

export interface PlayerState {
  pilotName: string;
  level: number;
  xp: number;
  highScore: number;
  completedMissions: string[];
  selectedMechId: string;
  equippedModIds: Record<string, string[]>; // mechId -> modIds
  mechIntegrities: Record<string, number>; // mechId -> percentage
}
