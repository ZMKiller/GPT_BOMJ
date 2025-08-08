export class RNG {
  private seed: number;

  constructor(seed: number = Date.now()) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  private next(): number {
    this.seed = (this.seed * 48271) % 2147483647;
    return this.seed;
  }

  rand(): number {
    return (this.next() - 1) / 2147483646;
  }

  randInt(min: number, max: number): number {
    return Math.floor(this.rand() * (max - min + 1)) + min;
  }

  choice<T>(arr: T[]): T {
    return arr[this.randInt(0, arr.length - 1)];
  }
}
