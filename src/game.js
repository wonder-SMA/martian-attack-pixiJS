import * as PIXI from 'pixi.js';
import { loadAssets } from './common/assets';
import { appConstants } from './common/constants';
import { EventHub } from './common/eventHub';
import { play } from './common/sound';
import { checkCollision } from './common/utils';
import { bombTick, clearBombs, destroyBomb, initBombs } from './sprites/bombs';
import { bulletTick, clearBullets, destroyBullet, initBullets } from './sprites/bullets';
import { addEnemy, destroyEnemy, enemyTick, initEnemies } from './sprites/enemy';
import { explosionTick, initExplosions } from './sprites/explosions';
import { initInfo, updateInfo } from './sprites/info';
import { getGameOver, getYouWin } from './sprites/messages';
import { destroyPerson, getAlivePeople, initPeople, peopleTick, restorePeople } from './sprites/people';
import { initPlayer, getPlayer, playerTick, playerShoot, lockPlayer } from './sprites/player';

const WIDTH = appConstants.size.WIDTH;
const HEIGHT = appConstants.size.HEIGHT;

const gameState = {
  app: null,
  rootContainer: null,
  mousePosition: null,
  stopped: false,
  moveLeft: false,
  moveRight: false,
};

const createScene = () => {
  const app = new PIXI.Application({
    background: '#000',
    antialias: true,
    width: WIDTH,
    height: HEIGHT,
  });
  document.body.appendChild(app.view);
  gameState.app = app;
  const rootContainer = app.stage;
  rootContainer.eventMode = 'static';
  rootContainer.hitArea = app.screen;

  const info = initInfo(app, rootContainer);
  rootContainer.addChild(info);

  const player = initPlayer(app, rootContainer);
  rootContainer.addChild(player);

  const bullets = initBullets(app, rootContainer);
  rootContainer.addChild(bullets);

  const people = initPeople(app, rootContainer);
  restorePeople();
  rootContainer.addChild(people);

  const enemies = initEnemies(app, rootContainer);
  addEnemy();
  rootContainer.addChild(enemies);

  const bombs = initBombs(app, rootContainer);
  rootContainer.addChild(bombs);

  const explosions = initExplosions(app, rootContainer);
  rootContainer.addChild(explosions);
  
  return app;
};

const initInteraction = () => {
  gameState.mousePosition = getPlayer().position.x;

  gameState.app.stage.on('pointermove', event => {
    gameState.mousePosition = event.global.x;
  });

  document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
      event.preventDefault();
      playerShoot();
    }
  });

  gameState.app.ticker.add(() => {
    playerTick(gameState);
    bulletTick();
    peopleTick();
    enemyTick();
    bombTick();
    explosionTick();
    checkAllCollisions();
  });
};

export const initGame = () => {
  loadAssets((progress) => {
    if (progress === 'all') {
      createScene();
      initInteraction();
      updateInfo({ ufoCount: 0, personCount: getAlivePeople().length });
    }
  });
};

const checkAllCollisions = () => {
  const rootContainer = gameState.app.stage;
  const player = rootContainer.getChildByName(appConstants.containers.player);
  const bullets = rootContainer.getChildByName(appConstants.containers.bullets);
  const people = rootContainer.getChildByName(appConstants.containers.people);
  const enemies = rootContainer.getChildByName(appConstants.containers.enemies);
  const bombs = rootContainer.getChildByName(appConstants.containers.bombs);

  if (bullets && enemies) {
    const toRemoveBullets = [];
    const toRemoveEnemy = [];

    bullets.children.forEach(bullet => {
      enemies.children.forEach(enemy => {
        if (checkCollision(bullet, enemy)) {
          if (toRemoveBullets.indexOf(bullet) === -1) {
            toRemoveBullets.push(bullet);
          }
          if (toRemoveEnemy.indexOf(enemy) === -1) {
            toRemoveEnemy.push(enemy);
          }
        }
      });
    });

    toRemoveBullets.forEach(bullet => destroyBullet(bullet));
    toRemoveEnemy.forEach(enemy => destroyEnemy(enemy));
  }

  if (bullets && bombs) {
    const toRemoveBullets = [];
    const toRemoveBombs = [];

    bullets.children.forEach(bullet => {
      bombs.children.forEach(bomb => {
        if (checkCollision(bullet, bomb)) {
          if (toRemoveBullets.indexOf(bullet) === -1) {
            toRemoveBullets.push(bullet);
          }
          if (toRemoveBombs.indexOf(bomb) === -1) {
            toRemoveBombs.push(bomb);
          }
        }
      });
    });

    toRemoveBullets.forEach(bullet => destroyBullet(bullet));
    toRemoveBombs.forEach(bomb => destroyBomb(bomb));
  }

  if (bombs && !player.locked) {
    const toRemove = [];

    bombs.children.forEach(bomb => {
      if (checkCollision(bomb, player)) {
        toRemove.push(bomb);
        lockPlayer();
      }
    });
    toRemove.forEach(bomb => destroyBomb(bomb));
  }

  if (bombs && people) {
    const toRemoveBombs = [];
    const toRemovePeople = [];

    bombs.children.forEach(bomb => {
      people.children.forEach(person => {
        if (checkCollision(bomb, person)) {
          if (toRemoveBombs.indexOf(bomb) === -1) {
            toRemoveBombs.push(bomb);
          }
          if (toRemovePeople.indexOf(person) === -1) {
            toRemovePeople.push(person);
          }
        }
      });
    });
    toRemoveBombs.forEach(bomb => destroyBomb(bomb));
    toRemovePeople.forEach(person => destroyPerson(person));
  }
};

const restartGame = () => {
  clearBombs();
  clearBullets();
  restorePeople();
  updateInfo({ ufoCount: 0, personCount: getAlivePeople() });
};

// Subscribes
EventHub.on(appConstants.events.youWin, () => {
  gameState.app.ticker.stop();
  gameState.app.stage.addChild(getYouWin());
  setTimeout(() => play(appConstants.sounds.youWin), 1000);
});

EventHub.on(appConstants.events.gameOver, () => {
  gameState.app.ticker.stop();
  gameState.app.stage.addChild(getGameOver());
  setTimeout(() => play(appConstants.sounds.gameOver), 1000);
});

EventHub.on(appConstants.events.restartGame, (event) => {
  restartGame();
  if (event === appConstants.events.gameOver) {
    gameState.app.stage.removeChild(getGameOver());

  }
  if (event === appConstants.events.youWin) {
    gameState.app.stage.removeChild(getYouWin());
  }
  gameState.app.ticker.start();
});
