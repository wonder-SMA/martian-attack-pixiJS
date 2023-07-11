import { AnimatedSprite, Container, Texture } from 'pixi.js';
import { appConstants } from '@/common/constants';
import { destroySprite, getRandomIntFromInterval } from '@/common/utils';
import { play } from '@/common/sound';

let app;
let rootContainer;
let explosions;

const explosionTypes = [
  'Explosion_Sequence',
  'Explosion_Sequence1',
  'Explosion_Sequence2',
  'Explosion_Sequence3',
];
const explosionTextures = {};

export const initExplosions = (currApp, root) => {
  app = currApp;
  rootContainer = root;
  explosions = new Container();
  explosions.name = appConstants.containers.explosions;
  return explosions;
};

export const addExplosion = (coords) => {
  const explosionType = explosionTypes[getRandomIntFromInterval(0, explosionTypes.length - 1)];
  let currExplosionTexture = [];

  if (explosionTextures[explosionType]) {
    currExplosionTexture = explosionTextures[explosionType];
  } else {
    for (let i = 1; i < 13; i++) {
      const texture = Texture.from(`${explosionType} ${i}.png`);
      currExplosionTexture.push(texture);
    }
    explosionTextures[explosionType] = currExplosionTexture;
  }

  const explosion = new AnimatedSprite(currExplosionTexture);
  explosion.loop = false;
  explosion.animationSpeed = 0.2;
  explosion.anchor.set(0.5);
  explosion.position.set(coords.x, coords.y);
  explosions.addChild(explosion);
  explosion.play();
  play(appConstants.sounds.explosion);
};

export const explosionTick = () => {
  const toRemove = [];
  explosions.children.forEach(explosion => {
    if (!explosion.playing) {
      toRemove.push(explosion);
    }
  });
  toRemove.forEach(explosion => destroySprite(explosion));
};
