import Phaser from 'phaser';
import { GameConfig } from '@game';
import './styles/ui.scss';

// defer game creation until DOM is ready to avoid renderType errors
window.addEventListener('load', () => {
  new Phaser.Game(GameConfig);
});
