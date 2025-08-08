import Phaser from 'phaser';

import BootScene from './scenes/BootScene';
import PreloadScene from './scenes/PreloadScene';
import CityMapScene from './scenes/CityMapScene';
import UIScene from './scenes/UIScene';
import DowntownScene from './scenes/locations/DowntownScene';
import ParkScene from './scenes/locations/ParkScene';
import ShelterScene from './scenes/locations/ShelterScene';
import JobCenterScene from './scenes/locations/JobCenterScene';
import MarketScene from './scenes/locations/MarketScene';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#2d2d2d',
  canvas,
  scene: [
    BootScene,
    PreloadScene,
    CityMapScene,
    UIScene,
    DowntownScene,
    ParkScene,
    ShelterScene,
    JobCenterScene,
    MarketScene
  ]
};

export default GameConfig;
