import Phaser from 'phaser';

/** Preloads minimal generated textures/audio and shows a short tutorial. */
export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    // --- GENERATED TEXTURES ---
    // Player idle frame
    this.textures.generate('player_idle', {
      data: [
        '....33....',
        '...3333...',
        '...3333...',
        '..333333..',
        '..333333..',
        '...3333...',
        '...3333...',
        '....33....'
      ],
      pixelWidth: 4,
      pixelHeight: 4
    });
    // Player walking frame (arms out)
    this.textures.generate('player_walk', {
      data: [
        '..3....3..',
        '..333333..',
        '..333333..',
        '.33333333.',
        '.33333333.',
        '..333333..',
        '...3333...',
        '..3....3..'
      ],
      pixelWidth: 4,
      pixelHeight: 4
    });

    // Simple coin texture
    this.textures.generate('coin', {
      data: ['.77', '777', '.77'],
      pixelWidth: 4,
      pixelHeight: 4
    });

    // Rain drop texture
    this.textures.generate('raindrop', {
      data: ['8', '8', '8', '8'],
      pixelWidth: 1,
      pixelHeight: 4
    });

    // --- AUDIO --- (generated via WebAudio later)
  }

  create(): void {
    // show simple tutorial sequence then start game
    const tips = [
      'Добро пожаловать! Следи за полосками HUD.',
      'Нажми на карту, чтобы перейти в локацию.',
      'Используй кнопку "Попросить" для заработка.'
    ];
    const txt = this.add.text(400, 300, '', {
      color: '#ffffff',
      wordWrap: { width: 600 },
      align: 'center'
    }).setOrigin(0.5).setAlpha(0);

    const showNext = () => {
      const msg = tips.shift();
      if (!msg) {
        txt.destroy();
        this.scene.start('CityMapScene');
        this.scene.launch('UIScene');
        this.scene.bringToTop('UIScene');
        return;
      }
      txt.setText(msg);
      this.tweens.add({
        targets: txt,
        alpha: 1,
        duration: 300,
        yoyo: true,
        hold: 1500,
        onComplete: showNext
      });
    };

    showNext();
  }
}
