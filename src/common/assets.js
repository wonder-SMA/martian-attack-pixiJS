import { Assets } from 'pixi.js';
import { allTextures, textureEnum } from './textures';

Object.entries(allTextures).forEach(([key, value]) => {
  Assets.add(key, value);
});

const textures = new Map();

export const loadAssets = (onProgress) => {
  const textureNames = Object.values(textureEnum);

  Assets.load(textureNames, onProgress).then(data => {
    Object.entries(data).forEach(([key, value]) => {
      textures.set(key, value);
    });

    onProgress('all');
  });
};

export const getTexture = (id) => textures.has(id) ? textures.get(id) : null;
