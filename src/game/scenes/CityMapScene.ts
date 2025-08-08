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
      const x = 100 + index * 120;
      const y = 150;
      const text = this.add.text(x, y, loc.name, { color: '#ffffff' })
        .setInteractive({ useHandCursor: true })
        .setOrigin(0.5);
      text.on('pointerover', () => {
        this.info.setText(`Риск полиции: ${loc.policeRisk}`);
      });
      text.on('pointerout', () => this.info.setText(''));
      text.on('pointerup', () => {
        this.scene.start(sceneMap[loc.id]);
      });
    });
  }
}
