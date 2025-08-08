import Phaser from 'phaser';
import { GameState, StatId, SkillId, LocationId } from '../util/types';
import TimeSystem from '../systems/TimeSystem';
import StatsSystem from '../systems/StatsSystem';
import SkillSystem from '../systems/SkillSystem';
import EconomySystem from '../systems/EconomySystem';
import InventorySystem from '../systems/InventorySystem';
import EventSystem from '../systems/EventSystem';
import SaveSystem from '../systems/SaveSystem';
import NPCSystem from '../systems/NPCSystem';
import JobSystem from '../systems/JobSystem';
import AudioManager from '../util/audio';
import { loadImageSafe } from '../util/assetLoader';
import { imageAssets, bootImages } from '../../assets/assetManifest';

export interface Systems {
  time: TimeSystem;
  stats: StatsSystem;
  skills: SkillSystem;
  economy: EconomySystem;
  inventory: InventorySystem;
  events: EventSystem;
  save: SaveSystem;
  npc: NPCSystem;
  jobs: JobSystem;
  audio: AudioManager;
  state: GameState;
}

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    bootImages.forEach(key => loadImageSafe(this, key, imageAssets[key]));
  }

  create(): void {
    this.scale.scaleMode = Phaser.Scale.FIT;
    this.scale.refresh();

    const state: GameState = {
      money: 0,
      day: 0,
      minute: 8 * 60,
      location: LocationId.Downtown,
      stats: {
        [StatId.Health]: 100,
        [StatId.Hunger]: 0,
        [StatId.Energy]: 100,
        [StatId.Mood]: 50,
        [StatId.Hygiene]: 100
      },
      skills: {
        [SkillId.Charm]: { level: 0, xp: 0 },
        [SkillId.Survival]: { level: 0, xp: 0 },
        [SkillId.Persistence]: { level: 0, xp: 0 },
        [SkillId.Politeness]: { level: 0, xp: 0 },
        [SkillId.Diligence]: { level: 0, xp: 0 },
        [SkillId.Thievery]: { level: 0, xp: 0 }
      },
      inventory: []
    };

    const time = new TimeSystem(state.day, state.minute);
    const skills = new SkillSystem(state.skills);
    const stats = new StatsSystem(time, state.stats);
    const economy = new EconomySystem(state, stats, skills, time);
    const inventory = new InventorySystem(stats, economy);
    const events = new EventSystem(economy, stats, inventory);
    const npc = new NPCSystem();
    const jobs = new JobSystem(skills, economy, stats);
    const save = new SaveSystem(state, time);
    const audio = new AudioManager();
    audio.startMusic();

    const systems: Systems = { time, stats, skills, economy, inventory, events, save, npc, jobs, audio, state };
    this.game.registry.set('systems', systems);

    time.onTick(60, () => {
      const ev = events.roll({ location: state.location, time: time.isDay() ? 'day' : 'night' });
      if (ev) { this.game.events.emit('toast', ev.text); events.apply(ev); }
    });

    // update systems every frame
    this.game.events.on('step', (_t: number, d: number) => {
      time.update(d / 1000);
      jobs.update(time.now().hour * 60 + time.now().minute);
    });

    this.scene.start('PreloadScene');
  }
}
