import Phaser from 'phaser';
import locationsData from '../data/locations.json';
import { LocationDef, LocationId } from '../util/types';

const locs: LocationDef[] = locationsData as any;

const sceneMap: Record<string, string> = {
  downtown: 'DowntownScene',
  park: 'ParkScene',
  shelter: 'ShelterScene',
  jobcenter: 'JobCenterScene',
  market: 'MarketScene'
};

export default class CityMapScene extends Phaser.Scene {
  private info!: Phaser.GameObjects.Text;
  constructor() {
    super({ key: 'CityMapScene' });
  }

  create(): void {
    this.info = this.add.text(10, 570, '', { color: '#ffff00' });

    locs.forEach((loc, index) => {
      const x = 100 + index * 140;
      const y = 150;
      const icon = this.add.image(x, y, 'player_idle').setDisplaySize(48, 48).setInteractive({ useHandCursor: true });
      const text = this.add.text(x, y + 40, loc.name, { color: '#ffffff' }).setOrigin(0.5);
      icon.on('pointerover', () => {
        const hours = loc.openHours ? `${loc.openHours.start}-${loc.openHours.end}` : 'круглосуточно';
        this.info.setText(`трафик:${loc.spawn.density} полиция:${loc.policeRisk} время:${hours}`);
      });
      icon.on('pointerout', () => this.info.setText(''));
      icon.on('pointerup', () => {
        this.scene.start(sceneMap[loc.id]);
      });
    });
  }
}
