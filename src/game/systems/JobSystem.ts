import Phaser from 'phaser';
import jobsData from '../data/jobs.json';
import { JobDef, SkillId } from '../util/types';
import SkillSystem from './SkillSystem';
import EconomySystem from './EconomySystem';
import StatsSystem from './StatsSystem';

const jobs: Record<string, JobDef> = {} as any;
(jobsData as JobDef[]).forEach(j => (jobs[j.id] = j));

export default class JobSystem extends Phaser.Events.EventEmitter {
  private current?: { def: JobDef; endMinute: number };

  constructor(private skills: SkillSystem, private economy: EconomySystem, private stats: StatsSystem) {
    super();
  }

  interview(id: string): boolean {
    const job = jobs[id];
    if (!job) return false;
    const req = job.req?.skills;
    if (req) {
      for (const [k, v] of Object.entries(req)) {
        if (this.skills.get(k as SkillId).level < (v || 0)) return false;
      }
    }
    return Math.random() < 0.7; // simple random success
  }

  startShift(id: string, nowMinute: number): boolean {
    const job = jobs[id];
    if (!job) return false;
    const shift = job.shifts[0]; // simplified
    this.current = { def: job, endMinute: nowMinute + (shift.end - shift.start) * 60 };
    this.stats.modify({ energy: -shift.fatigue });
    return true;
  }

  update(nowMinute: number): void {
    if (this.current && nowMinute >= this.current.endMinute) {
      const hours = (this.current.def.shifts[0].end - this.current.def.shifts[0].start);
      this.economy.modify(hours * this.current.def.wagePerHour);
      this.emit('payout', this.current.def.id);
      this.current = undefined;
    }
  }
}
