import Phaser from 'phaser';
import '../styles/main.scss';

import BootScene from '../game/scenes/BootScene';
import PreloadScene from '../game/scenes/PreloadScene';
import CityMapScene from '../game/scenes/CityMapScene';
import UIScene from '../game/scenes/UIScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#000',
  scene: [BootScene, PreloadScene, CityMapScene, UIScene]
};

new Phaser.Game(config);
