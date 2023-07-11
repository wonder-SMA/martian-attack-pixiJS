import { Container, Graphics, Sprite, Text, TextStyle } from 'pixi.js';
import { getTexture } from '@/common/assets';
import { appConstants } from '@/common/constants';
import { textureEnum } from '@/common/textures';
import { EventHub, gameOver, youWin } from '@/common/eventHub';
import { muteEffects, pauseBackground, playBackground, unMuteEffects } from '@/common/sound';

let app;
let rootContainer;
let info;

let ufoCount;
let ufoText;

let personCount;
let personText;

let musicOff;
let musicOffStatus = true;

let effectsOff;
let effectsOffStatus = true;

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

export const initInfo = (currApp, root) => {
  app = currApp;
  rootContainer = root;

  const musicOnTexture = getTexture(textureEnum.musicOn);
  const musicOffTexture = getTexture(textureEnum.musicOff);
  const effectsOnTexture = getTexture(textureEnum.effectsOn);
  const effectsOffTexture = getTexture(textureEnum.effectsOff);

  info = new Container();
  info.name = appConstants.containers.info;
  info.alpha = 0.6;

  const infoPanel = new Container();
  infoPanel.position.set(20, 20);
  info.addChild(infoPanel);

  const graphics = new Graphics();
  graphics.lineStyle(1, 0xff00ff, 1);
  graphics.beginFill(0x650a5a, 0.25);
  graphics.drawRoundedRect(0, 0, 150, 100, 16);
  graphics.endFill();
  infoPanel.addChild(graphics);

  // Ufo
  const ufo = new Sprite(getTexture(textureEnum.enemyShip));
  ufo.name = 'ufo';
  ufo.scale.set(0.3);
  ufo.position.set(15, 11);
  infoPanel.addChild(ufo);

  ufoText = new Text('0', style);
  ufoText.name = 'ufoText';
  ufoText.position.set(90, 0);
  infoPanel.addChild(ufoText);

  // Person
  const person = new Sprite(getTexture(textureEnum.man));
  person.name = 'person';
  person.scale.set(0.8);
  person.position.set(22, 50);
  infoPanel.addChild(person);

  personText = new Text('0', style);
  personText.name = 'personText';
  personText.position.set(90, 45);
  infoPanel.addChild(personText);

  // Music
  const musicButton = new Container();
  musicButton.name = 'musicButton';
  musicButton.position.set(appConstants.size.WIDTH - 100, 100);
  musicButton.eventMode = 'static';
  info.addChild(musicButton);

  const graphicsMusicOff = new Graphics();
  graphicsMusicOff.lineStyle(2, 0xff00ff, 1);
  graphicsMusicOff.beginFill(0x650a5a, 0.25);
  graphicsMusicOff.drawCircle(15, 15, 30);
  graphicsMusicOff.endFill();
  musicButton.addChild(graphicsMusicOff);

  musicOff = new Sprite(musicOffStatus ? musicOffTexture : musicOnTexture);
  musicOff.name = 'musicOff';
  musicOff.position.set(-9, -9);
  musicButton.addChild(musicOff);

  musicOffStatus ? pauseBackground() : playBackground();

  musicButton.on('pointertap', () => {
    musicOffStatus = !musicOffStatus;
    musicOff.texture = musicOffStatus ? musicOffTexture : musicOnTexture;
    musicOffStatus ? pauseBackground() : playBackground();
  });

  // Effects
  const effectsButton = new Container();
  effectsButton.name = 'effectsButton';
  effectsButton.position.set(appConstants.size.WIDTH - 100, 200);
  effectsButton.eventMode = 'static';
  info.addChild(effectsButton);

  const graphicsEffectsOff = new Graphics();
  graphicsEffectsOff.lineStyle(2, 0xff00ff, 1);
  graphicsEffectsOff.beginFill(0x650a5a, 0.25);
  graphicsEffectsOff.drawCircle(15, 15, 30);
  graphicsEffectsOff.endFill();
  effectsButton.addChild(graphicsEffectsOff);

  effectsOff = new Sprite(effectsOffStatus ? effectsOffTexture : effectsOnTexture);
  effectsOff.name = 'effectsOff';
  effectsOff.position.set(-9, -9);
  effectsButton.addChild(effectsOff);

  effectsOffStatus ? muteEffects() : unMuteEffects();

  effectsButton.on('pointertap', () => {
    effectsOffStatus = !effectsOffStatus;
    effectsOff.texture = effectsOffStatus ? effectsOffTexture : effectsOnTexture;
    effectsOffStatus ? muteEffects() : unMuteEffects();
  });

  return info;
};

export const updateInfo = data => {
  ufoCount = data.ufoCount;
  ufoText.text = `${ufoCount}`;
  personCount = data.personCount;
  personText.text = `${personCount}`;
};

// Subscribes
EventHub.on(appConstants.events.personKilled, event => {
  personCount = event.count;
  personText.text = `${personCount}`;
  if (personCount === 0) {
    gameOver();
  }
});

EventHub.on(appConstants.events.ufoDestroyed, () => {
  ufoCount += 1;
  ufoText.text = `${ufoCount}`;
  if (ufoCount === 10) {
    youWin();
  }
});
