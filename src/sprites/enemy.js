import { AnimatedSprite, Container } from 'pixi.js';
import { getTexture } from '@/common/assets';
import { textureEnum } from '@/common/textures';
import { appConstants } from '@/common/constants';
import { destroySprite, getRandomIntFromInterval } from '@/common/utils';
import { ufoDestroyed } from '@/common/eventHub';
import { addExplosion } from './explosions';
import { getAliveRandomPerson, getAlivePeople } from './people';
import { addBomb } from './bombs';

let app;
let rootContainer;
let enemies;

export const initEnemies = (currApp, root) => {
  app = currApp;
  rootContainer = root;
  enemies = new Container();
  enemies.name = appConstants.containers.enemies;
  return enemies;
};

export const addEnemy = () => {
  const textures = [
    getTexture(textureEnum.shipBlue),
    getTexture(textureEnum.shipBlue2),
  ];
  const enemy = new AnimatedSprite(textures);
  enemy.anchor.set(0.5, 1);
  enemy.scale.set(0.5);
  const alivePerson = getAliveRandomPerson();

  if (alivePerson) {
    enemy.position.x = alivePerson;
  } else {
    enemy.x = getRandomIntFromInterval(20, appConstants.size.WIDTH - 20);
  }

  enemy.y = 80;
  enemy.customData = {
    left: true,
  };
  enemy.animationSpeed = 0.1;
  enemies.addChild(enemy);
  return enemy;
};

export const destroyEnemy = (enemy) => {
  addExplosion({ x: enemy.position.x, y: enemy.position.y - enemy.height / 2});
  destroySprite(enemy);
  ufoDestroyed();
  setTimeout(() => addEnemy(), 1000);
};

export const enemyTick = () => {
  const alivePeople = getAlivePeople();
  enemies.children.forEach(enemy => {
    let directionChanged = false;

    if (enemy.customData.left) {
      enemy.position.x -= 1;

      if (enemy.position.x < 20) {
        enemy.customData.left = false;
        directionChanged = true;
      }
    } else {
      enemy.position.x += 1;

      if (enemy.position.x > appConstants.size.WIDTH - 20) {
        enemy.customData.left = true;
        directionChanged = true;
      }
    }

    if (!directionChanged && Math.random() * 100 < appConstants.possibility.enemyDirectionChange) {
      enemy.customData.left = !enemy.customData.left;
      const idx = getRandomIntFromInterval(0, 1);
      enemy.gotoAndStop(idx);
    }

    const isUnderPerson = alivePeople.filter(personPosition => {
      return (personPosition - 10 <= enemy.position.x) && (personPosition + 10 >= enemy.position.x);
    });

    if (isUnderPerson.length) {

      if (Math.random() * 100 < appConstants.possibility.bomb) {
        addBomb(enemy.position);
      }
    } else {

      if (Math.random() * 100 < appConstants.possibility.bomb / 4) {
        addBomb(enemy.position);
      }
    }
  });
};

