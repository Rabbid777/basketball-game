createInterface();

const windowHeight = document.documentElement.clientHeight;
const windowWidth = document.documentElement.clientWidth;

function createInterface() {
  let room = createElem(`div`, `room`, [], `body`);
  let floorImg = createElem(`img`, `floor-img`, [], `#room`);
  floorImg.setAttribute(`src`, `img/floor.png`);
  let dropZone = createElem(`div`, `drop-zone`, [], `#room`);
  createMan();
  let ball = createElem(`div`, `ball`, [], `#man`);
  let basket = createElem(`div`, `basket`, [], `#room`);
  let basketImg = createElem(`img`, `basket-img`, [], `#room`);
  basketImg.setAttribute(`src`, `img/basket.png`);
  let result = createElem(`div`, ``, [`hide`, `result`], `body`);
  let info = createElem(`div`, ``, [`hide`, `info`], `body`);
  let counter = createElem(`div`, `counter`, [], `#room`,`0`);
  let endButton = createElem(`button`, `end-game-button`, [`hide`,], `body`, `Завершить попытку`);

  let newGameButton = createElem(`button`, `new-game-button`, [], `body`, `Начать игру!`);
};

function createMan() {
  let man = createElem(`div`, `man`, [], `#drop-zone`);
  let manBody = createElem(`img`, `body`, [], `#man`);
  manBody.setAttribute(`src`, `img/man.png`);
  let manLeftArm = createArm(`left-arm`);
  let manRightArm = createArm(`right-arm`);
};

function createArm(id) {
  let arm = createElem(`div`, id, [], `#man`);
  let part1 = createElem(`div`, ``, [`part1`], `#${id}`);
  let part2 = createElem(`div`, ``, [`part2`], `#${id}`);
};

function createElem(elem, id, classNames, parentSelector, text) {
  let item = document.createElement(elem);
  if (id) item.setAttribute(`id`, id);
  if (classNames.length > 0)
    classNames.forEach((className) => item.classList.add(className));
  item.textContent = text;
  document.querySelector(parentSelector).appendChild(item);

  return item;
};