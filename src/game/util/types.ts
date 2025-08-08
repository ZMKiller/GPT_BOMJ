export enum StatId {
  Health = 'health',
  Hunger = 'hunger',
  Energy = 'energy',
  Mood = 'mood',
  Hygiene = 'hygiene'
}

export enum SkillId {
  Charm = 'charm',
  Survival = 'survival',
  Persistence = 'persistence',
  Politeness = 'politeness',
  Diligence = 'diligence',
  Thievery = 'thievery'
}

export enum LocationId {
  Downtown = 'downtown',
  Park = 'park',
  Shelter = 'shelter',
  JobCenter = 'jobcenter',
  Market = 'market'
}

export enum NpcArchetype {
  Kind = 'kind',
  Stingy = 'stingy',
  Busy = 'busy',
  Tourist = 'tourist'
}

export interface ItemDef {
  id: string;
  name: string;
  type: 'food' | 'drink' | 'tool' | 'clothes';
  price: number;
  effects?: Partial<Record<StatId, number>>;
  durab?: number;
  req?: {
    skill?: Partial<Record<SkillId, number>>;
    home?: boolean;
  };
}

export interface LocationDef {
  id: string;
  name: string;
  bgKey?: string;
  actions: Array<'beg' | 'rest' | 'collect' | 'shop' | 'wash' | 'interview'>;
  policeRisk: number;
  spawn: { npcTypes: string[]; density: number };
  openHours?: { start: number; end: number };
}

export interface NpcArchetypeDef {
  id: 'kind' | 'stingy' | 'busy' | 'tourist';
  baseDonateChance: number;
  donateRange: [number, number];
  modifiers?: {
    timeOfDay?: Record<'day' | 'night', number>;
    location?: Record<string, number>;
    hygieneThresholds?: Array<{ lt: number; mod: number }>;
  };
}

export interface JobDef {
  id: string;
  title: string;
  wagePerHour: number;
  req?: {
    skills?: Partial<Record<SkillId, number>>;
    home?: boolean;
    clothes?: string;
  };
  shifts: Array<{ start: number; end: number; fatigue: number; events?: string[] }>;
}

export interface EventDef {
  id: string;
  when?: { location?: string[]; time?: ('day' | 'night')[]; chance: number };
  text: string;
  options: Array<{ id: string; label: string; effects?: {
    money?: number;
    stats?: Partial<Record<StatId, number>>;
    items?: { add?: string[]; remove?: string[] };
    flags?: Record<string, boolean>;
  } }>;
}

export interface GameState {
  money: number;
  day: number; // 0..6
  minute: number; // minutes of current day
  location: LocationId;
  stats: Record<StatId, number>;
  skills: Record<SkillId, { level: number; xp: number }>;
  inventory: string[];
}

export interface SaveDataV1 {
  version: 1;
  state: GameState;
}
