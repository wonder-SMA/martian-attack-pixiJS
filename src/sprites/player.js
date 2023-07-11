import { Sprite } from 'pixi.js';
import { getTexture } from '@/common/assets';
import { textureEnum } from '@/common/textures';
import { appConstants } from '@/common/constants';
import { addBullet } from './bullets';

let app;
let player;
let lockTimeoutId;

export const initPlayer = (currApp, root) => {
  if (player) {
    return player;
  }

  app = currApp;
  player = new Sprite(getTexture(textureEnum.spaceShip));
  player.name = appConstants.containers.player;
  player.anchor.set(0.5);
  player.scale.set(0.3);
  player.position.x = appConstants.size.WIDTH / 2;
  player.position.y = appConstants.size.HEIGHT - 200;
  return player;
};

export const lockPlayer = () => {
  if (lockTimeoutId) {
    return;
  }
  player.locked = true;
  lockTimeoutId = setTimeout(() => {
    lockTimeoutId = null;
    player.locked = false;
  }, appConstants.timeouts.playerLock);
};

export const playerShoot = () => {
  if (!player.locked) {
    addBullet({ x: player.position.x, y: player.position.y })
  }
};

export const playerTick = (state) => {
  if (player.locked) {
    player.alpha = 0.5;
  } else {
    player.alpha = 1;
  }

  const playerPosition = player.position.x;
  player.position.x = state.mousePosition;

  if (player.position.x < playerPosition) {
    player.rotation = -0.3;
  } else if (player.position.x > playerPosition) {
    player.rotation = 0.3;
  } else {
    player.rotation = 0;
  }
};

export const getPlayer = () => player;
