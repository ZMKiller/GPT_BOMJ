import { GameState, SaveDataV1 } from '../util/types';
import TimeSystem from './TimeSystem';

const KEY = 'hobo.save.v1';

export default class SaveSystem {
  constructor(private state: GameState, time: TimeSystem) {
    const loaded = this.load();
    if (loaded) { Object.assign(this.state, loaded); time.set(loaded.day, loaded.minute); }
    time.onTick(30, () => this.save());
  }

  save(): void {
    const data: SaveDataV1 = { version: 1, state: this.state };
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  load(): GameState | undefined {
    const raw = localStorage.getItem(KEY);
    if (!raw) return undefined;
    try {
      const data: SaveDataV1 = JSON.parse(raw);
      if (data.version === 1) return data.state;
      return this.migrate(data as any);
    } catch {
      return undefined;
    }
  }

  migrate(_data: any): GameState | undefined {
    // placeholder for future versions
    return undefined;
  }
}
