import Phaser from 'phaser';
import { Systems } from './BootScene';
import HUD from '../ui/HUD';

export default class UIScene extends Phaser.Scene {
  private systems!: Systems;
  private hud!: HUD;

  constructor() {
    super({ key: 'UIScene' });
  }

  create(): void {
    this.systems = this.game.registry.get('systems') as Systems;
    this.hud = new HUD(this, this.systems);
    this.scene.bringToTop();

    // refresh HUD periodically
    this.systems.stats.on('changed', () => this.hud.refresh());
    this.systems.economy.on('cash', () => this.hud.refresh());
    this.systems.time.onTick(1, () => this.hud.refresh());
    this.game.events.on('toast', (msg: string) => this.hud.toast(msg));

    // mobile action button
    const begBtn = this.add.text(this.scale.width - 60, this.scale.height - 60, 'Попросить', {
      color: '#ffffff',
      backgroundColor: '#000000'
    })
      .setPadding(10)
      .setOrigin(1, 1)
      .setInteractive({ useHandCursor: true });
    begBtn.on('pointerdown', () => {
      this.game.events.emit('action', 'beg');
      this.systems.audio.click();
    });

    // virtual joystick
    const stickBase = this.add.circle(80, this.scale.height - 80, 40, 0x000000, 0.3).setInteractive();
    const stick = this.add.circle(80, this.scale.height - 80, 20, 0xffffff, 0.5).setInteractive();
    let stickPointer: Phaser.Input.Pointer | null = null;
    stickBase.on('pointerdown', (p: Phaser.Input.Pointer) => {
      stickPointer = p;
      stick.setPosition(p.x, p.y);
    });
    this.input.on('pointermove', p => {
      if (stickPointer && p.id === stickPointer.id) {
        stick.setPosition(p.x, p.y);
        this.game.events.emit('move', { x: p.x - stickBase.x, y: p.y - stickBase.y });
      }
    });
    this.input.on('pointerup', p => {
      if (stickPointer && p.id === stickPointer.id) {
        stickPointer = null;
        stick.setPosition(stickBase.x, stickBase.y);
        this.game.events.emit('move', { x: 0, y: 0 });
      }
    });
  }

  update(): void {
    // show fps in dev mode
    if (!this.debugText) {
      this.debugText = this.add.text(10, this.scale.height - 20, '', { color: '#ffffff' });
    }
    this.debugText.setText(`fps:${Math.floor(this.game.loop.actualFps)}`);
  }

  private debugText?: Phaser.GameObjects.Text;
}
