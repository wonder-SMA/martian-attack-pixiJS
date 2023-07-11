export const appConstants = {
  size: {
    WIDTH: window.document.documentElement.clientWidth ? window.document.documentElement.clientWidth : 800,
    HEIGHT: window.document.documentElement.clientHeight ? window.document.documentElement.clientHeight : 800,
  },
  containers: {
    player: 'player',
    bullets: 'bullets',
    people: 'people',
    enemies: 'enemies',
    bombs: 'bombs',
    explosions: 'explosions',
    info: 'info',
  },
  timeouts: {
    playerLock: 2000,
    playerShoot: 500,
  },
  possibility: {
    enemyDirectionChange: 1,
    bomb: 3,
  },
  events: {
    ufoDestroyed: 'ufoDestroyed',
    personKilled: 'personKilled',
    bombDestroyed: 'bombDestroyed',
    youWin: 'youWin',
    gameOver: 'gameOver',
    restartGame: 'restartGame',
  },
  sounds: {
    shot: 'shot',
    miss: 'miss',
    explosion: 'explosion',
    youWin: 'youWin',
    gameOver: 'gameOver',
    background: 'background',
  },
};
