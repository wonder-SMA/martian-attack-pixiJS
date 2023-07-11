import { Container, Sprite } from 'pixi.js';
import { getTexture } from '@/common/assets';
import { textureEnum } from '@/common/textures';
import { appConstants } from '@/common/constants';
import { destroySprite } from '@/common/utils';
import { bombDestroyed } from '@/common/eventHub';
import { addExplosion } from './explosions';

let app;
let rootContainer;
let bombs;

const bombSpeed = 2;

export const initBombs = (currApp, root) => {
  app = currApp;
  rootContainer = root;
  bombs = new Container();
  bombs.name = appConstants.containers.bombs;
  return bombs;
};

export const addBomb = (coords) => {
  const bomb = new Sprite(getTexture(textureEnum.bomb));
  bomb.anchor.set(0.5);
  bomb.scale.set(0.3);
  bomb.position.set(coords.x, coords.y + 10);
  bomb.rotation = Math.PI;
  bombs.addChild(bomb);
};

export const destroyBomb = (bomb) => {
  addExplosion({ x: bomb.position.x, y: bomb.position.y + bomb.height / 2 });
  destroySprite(bomb);
  bombDestroyed();
};

export const clearBombs = () => {
  const toRemove = [];
  bombs.children.forEach(bomb => {
    toRemove.push(bomb);
  });
  toRemove.forEach(bomb => destroyBomb(bomb));
};

export const bombTick = () => {
  const toRemove = [];
  bombs.children.forEach(bomb => {
    bomb.position.y += bombSpeed * 2;

    if (bomb.position.y > appConstants.size.HEIGHT) {
      toRemove.push(bomb);
    }
  });
  toRemove.forEach(bomb => destroyBomb(bomb));
};
