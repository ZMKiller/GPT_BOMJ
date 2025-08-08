import Phaser from 'phaser';

interface LocationButton {
  label: string;
  sceneKey: string;
  x: number;
  y: number;
}

export default class CityMapScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CityMapScene' });
  }

  create(): void {
    const locations: LocationButton[] = [
      { label: 'Downtown', sceneKey: 'DowntownScene', x: 100, y: 100 },
      { label: 'Park', sceneKey: 'ParkScene', x: 300, y: 100 },
      { label: 'Shelter', sceneKey: 'ShelterScene', x: 500, y: 100 },
      { label: 'Job Center', sceneKey: 'JobCenterScene', x: 200, y: 250 },
      { label: 'Market', sceneKey: 'MarketScene', x: 400, y: 250 }
    ];

    locations.forEach(loc => {
      const text = this.add.text(loc.x, loc.y, loc.label, { color: '#ffffff' })
        .setInteractive({ useHandCursor: true })
        .setOrigin(0.5);
      text.on('pointerup', () => {
        this.scene.start(loc.sceneKey);
      });
    });
  }
}
