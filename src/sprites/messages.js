import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { appConstants } from '@/common/constants';
import { restartGame } from '@/common/eventHub';

const style = new TextStyle({
  fontFamily: 'Arial',
  fontSize: 36,
  fontStyle: 'normal',
  fontWeight: 'bold',
  fill: ['#fff', '#00ff99'],
  stroke: '#4a1850',
  strokeThickness: 5,
  dropShadow: true,
  dropShadowColor: '#000',
  dropShadowBlur: 4,
  dropShadowDistance: 6,
  wordWrap: true,
  wordWrapWidth: 440,
  lineJoin: 'round',
});

// Game over
const gameOverMessage = new Container();
gameOverMessage.eventMode = 'static';

gameOverMessage.on('pointertap', () => restartGame(appConstants.events.gameOver));

export const getGameOver = () => {
  gameOverMessage.position.x = appConstants.size.WIDTH / 2 - gameOverMessage.width / 2;
  gameOverMessage.position.y = appConstants.size.HEIGHT / 2 - gameOverMessage.height / 2;
  return gameOverMessage;
};

const graphics = new Graphics();
graphics.lineStyle(1, 0xff00ff, 1);
graphics.beginFill(0x650a5a, 0.25);
graphics.drawRoundedRect(0, 0, 250, 100, 16);
graphics.endFill();
gameOverMessage.addChild(graphics);

const gameOverText = new Text('Game Over', style);
gameOverText.anchor.set(0.5);
gameOverText.position.set(250 / 2, 100 / 2);
gameOverMessage.addChild(gameOverText);

// You win
const youWinMessage = new Container();
youWinMessage.eventMode = 'static';

youWinMessage.on('pointertap', () => restartGame(appConstants.events.youWin));

export const getYouWin = () => {
  youWinMessage.position.x = appConstants.size.WIDTH / 2 - youWinMessage.width / 2;
  youWinMessage.position.y = appConstants.size.HEIGHT / 2 - youWinMessage.height / 2;
  return youWinMessage;
};

const graphics2 = new Graphics();
graphics2.lineStyle(1, 0xff00ff, 1);
graphics2.beginFill(0x650a5a, 0.25);
graphics2.drawRoundedRect(0, 0, 250, 100, 16);
graphics2.endFill();
youWinMessage.addChild(graphics2);

const youWinText = new Text('You win!', style);
youWinText.anchor.set(0.5);
youWinText.position.set(250 / 2, 100 / 2);
youWinMessage.addChild(youWinText);
