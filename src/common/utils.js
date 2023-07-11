export const getRandomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export const checkCollision = (obj1, obj2) => {
  if (obj1 && obj2) {
    const obj1Coords = obj1.getBounds();
    const obj2Coords = obj2.getBounds();

    return obj1Coords.x < obj2Coords.x + obj2Coords.width
      && obj1Coords.y < obj2Coords.y + obj2Coords.height
      && obj2Coords.x < obj1Coords.x + obj1Coords.width
      && obj2Coords.y < obj1Coords.y + obj1Coords.height;
  }
  return false;
};

export const destroySprite = (sprite) => {
  sprite.parent.removeChild(sprite);
  sprite.destroy({ children: true });
};
