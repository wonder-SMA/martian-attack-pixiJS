import { AnimatedSprite, Texture, Container, ColorMatrixFilter } from 'pixi.js';
import { destroySprite, getRandomIntFromInterval } from '@/common/utils';
import { appConstants } from '@/common/constants';
import { play } from '@/common/sound';

let app;
let rootContainer;
let bullets;
let timeout;

const bulletTypes = ['Bullet_Sequence1', 'Bullet_Sequence2'];
const bulletSpeed = 2;
const bulletTexture = {};

export const initBullets = (currApp, root) => {
  app = currApp;
  rootContainer = root;
  bullets = new Container();
  bullets.name = appConstants.containers.bullets;
  return bullets;
};

export const addBullet = (coords) => {
  if (timeout) {
    play(appConstants.sounds.miss);
    return;
  }

  const bulletType = bulletTypes[getRandomIntFromInterval(0, bulletTypes.length - 1)];
  let currBulletTexture = [];

  if (bulletTexture[bulletType]) {
    currBulletTexture = bulletTexture[bulletType];
  } else {
    for (let i = 1; i < 7; i++) {
      const texture = Texture.from(`${bulletType} ${i}.png`);
      currBulletTexture.push(texture);
    }
    bulletTexture[bulletType] = currBulletTexture;
  }

  const bullet = new AnimatedSprite(currBulletTexture);
  const filter = new ColorMatrixFilter();
  bullet.loop = false;
  const { matrix } = filter;
  matrix[1] = Math.sin(Math.random() * 10);
  matrix[2] = Math.cos(Math.random() * 10);
  matrix[3] = Math.cos(Math.random() * 10);
  matrix[4] = Math.sin(Math.random() * 10);
  matrix[5] = Math.sin(Math.random() * 10);
  matrix[6] = Math.sin(Math.random() * 10);
  bullet.filters = [filter];
  bullet.animationSpeed = 0.2;
  bullet.anchor.set(0.5);
  bullet.position.set(coords.x, coords.y - 30);
  bullets.addChild(bullet);
  bullet.play();

  timeout = setTimeout(() => {
    timeout = null;
  }, appConstants.timeouts.playerShoot);
};

export const destroyBullet = (bullet) => {
  destroySprite(bullet);
};

export const clearBullets = () => bullets.children.forEach(bullet => destroyBullet(bullet));

export const bulletTick = () => {
  const toRemove = [];
  bullets.children.forEach(bullet => {
    bullet.position.y -= bulletSpeed * 2;

    if (bullet.position.y < 0) {
      toRemove.push(bullet);
    }

  });
  toRemove.forEach(bullet => destroyBullet(bullet));
};

export const getBullets = () => [...bullets];
