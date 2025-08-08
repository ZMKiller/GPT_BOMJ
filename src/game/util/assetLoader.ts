import Phaser from 'phaser';

// Track which assets were missing so scenes can react (e.g. show text placeholder)
const missingImages = new Set<string>();
const missingAudio = new Set<string>();

function assetExists(url: string): boolean {
  const xhr = new XMLHttpRequest();
  try {
    xhr.open('HEAD', url, false);
    xhr.send();
    return xhr.status >= 200 && xhr.status < 400;
  } catch {
    return false;
  }
}

function generatePlaceholder(scene: Phaser.Scene, key: string): void {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  g.fillStyle(0x999999, 1);
  g.fillRect(0, 0, 1, 1);
  g.generateTexture(key, 1, 1);
  g.destroy();
}

export function loadImageSafe(scene: Phaser.Scene, key: string, url: string): void {
  if (assetExists(url)) {
    scene.load.image(key, url);
  } else {
    missingImages.add(key);
    generatePlaceholder(scene, key);
    console.warn(`Missing image asset at ${url}, using placeholder`);
  }
}

export function isImageMissing(key: string): boolean {
  return missingImages.has(key);
}

export function loadAudioSafe(scene: Phaser.Scene, key: string, urls: string[]): void {
  const url = urls[0];
  if (assetExists(url)) {
    scene.load.audio(key, urls);
  } else {
    missingAudio.add(key);
    const ctx = scene.sound.context;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
    scene.cache.audio.add(key, { buffer });
    console.warn(`Missing audio asset at ${url}, using silent placeholder`);
  }
}

export function isAudioMissing(key: string): boolean {
  return missingAudio.has(key);
}
