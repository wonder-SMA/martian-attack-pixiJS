import { Howl } from 'howler';
import { appConstants } from './constants';

const sounds = {};

let muteEffectsStatus = true;

sounds[appConstants.sounds.shot] = new Howl({
  src: ['assets/sounds/shot.mp3'],
  volume: 0.5,
});

sounds[appConstants.sounds.miss] = new Howl({
  src: ['assets/sounds/miss.mp3'],
  volume: 0.5,
});

sounds[appConstants.sounds.explosion] = new Howl({
  src: ['assets/sounds/explosion.mp3'],
  volume: 0.5,
});

sounds[appConstants.sounds.youWin] = new Howl({
  src: ['assets/sounds/you_win.mp3'],
  volume: 1,
});

sounds[appConstants.sounds.gameOver] = new Howl({
  src: ['assets/sounds/game_over.mp3'],
  volume: 1,
});

sounds[appConstants.sounds.background] = new Howl({
  src: ['assets/sounds/background.mp3'],
  volume: 0.3,
  loop: true,
  autoplay: false,
});

export const playBackground = () => sounds[appConstants.sounds.background].play();

export const pauseBackground = () => sounds[appConstants.sounds.background].pause();

export const play = id => !muteEffectsStatus && sounds[id].play();

export const pause = id => sounds[id].pause();

export const resume = id => sounds[id].resume();

export const stop = id => sounds[id].stop();

export const muteEffects = () => {
  muteEffectsStatus = true;
};

export const unMuteEffects = () => {
  muteEffectsStatus = false;
};
