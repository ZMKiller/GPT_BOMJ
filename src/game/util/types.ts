export enum StatId {
  Money = 'money',
  Food = 'food',
  Mood = 'mood',
  Health = 'health'
}

export enum SkillId {
  Music = 'music',
  Business = 'business'
}

export enum LocationId {
  Downtown = 'downtown',
  Park = 'park',
  Shelter = 'shelter',
  JobCenter = 'jobcenter',
  Market = 'market'
}

export enum NpcArchetype {
  Generic = 'generic'
}

export interface GameState {
  money: number;
  time: number;
  location: LocationId;
  stats: Record<StatId, number>;
  skills: Record<SkillId, number>;
}

export interface SaveDataV1 {
  version: 1;
  state: GameState;
}
