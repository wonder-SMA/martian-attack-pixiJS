import { Container, Sprite } from 'pixi.js';
import { getTexture } from '@/common/assets';
import { textureEnum } from '@/common/textures';
import { appConstants } from '@/common/constants';
import { destroySprite, getRandomIntFromInterval } from '@/common/utils';
import { personKilled } from '@/common/eventHub';

let app;
let rootContainer;
let people;
let alivePeopleCoords = [];
let peopleFrames = null;
let tombStoneFrames = null;

export const initPeople = (currApp, root) => {
  if (!peopleFrames) {
    peopleFrames = [
      getTexture(textureEnum.man),
      getTexture(textureEnum.man2),
      getTexture(textureEnum.woman),
    ];
  }

  if (!tombStoneFrames) {
    tombStoneFrames = [
      getTexture(textureEnum.TombStone1),
      getTexture(textureEnum.TombStone2),
    ];
  }

  app = currApp;
  rootContainer = root;
  people = new Container();
  people.name = appConstants.containers.people;
  return people;
};

let x = 10;
let y = appConstants.size.HEIGHT;

const recalculateAlivePeople = () => {
  const remainingPeopleCoords = [];
  people.children.forEach(person => {
    if (person.alive) {
      remainingPeopleCoords.push(person.position.x);
    }
  });
  alivePeopleCoords = [...remainingPeopleCoords];
};

export const destroyPerson = (person) => {
  const personCoords = { x: person.position.x, y: person.position.y };

  if (person.alive) {
    const tombStoneType = tombStoneFrames[getRandomIntFromInterval(0, tombStoneFrames.length - 1)];
    const tombStone = new Sprite(tombStoneType);
    tombStone.anchor.set(0.5, 1);
    tombStone.name = person.name;
    tombStone.alive = false;
    tombStone.position.x = personCoords.x;
    tombStone.position.y = personCoords.y;
    destroySprite(person);
    people.addChild(tombStone);
    recalculateAlivePeople();
    personKilled({ count: getAlivePeople().length });
  } else {
    destroySprite(person);
  }
};

export const restorePeople = () => {
  alivePeopleCoords.length = 0;
  x = 30;
  y = appConstants.size.HEIGHT;

  const toRemove = [];
  people.children.forEach(person => toRemove.push(person));
  toRemove.forEach(person => destroySprite(person));

  let i = 0;

  while (x < appConstants.size.WIDTH) {
    const personType = peopleFrames[getRandomIntFromInterval(0, peopleFrames.length - 1)];
    const person = new Sprite(personType);
    person.anchor.set(0.5, 1);
    person.name = i;
    person.alive = true;
    person.position.x = x;
    person.position.y = y;
    x += person.width + 10;
    people.addChild(person);
    i++;
  }

  recalculateAlivePeople();
};

export const getAlivePeople = () => [...alivePeopleCoords];

export const getAliveRandomPerson = () => {
  const alivePeople = getAlivePeople();

  if (alivePeople.length) {
    return alivePeople[getRandomIntFromInterval(0, alivePeople.length - 1)];
  }

  return null;
};

export const peopleTick = () => {
  people.children.forEach(person => {
    if (person.position.y > y) {
      person.position -= 1;
    }
  });
};
