createInterface();

const windowHeight = document.documentElement.clientHeight;
const windowWidth = document.documentElement.clientWidth;

function createInterface() {
  let room = createElem(`div`, `room`, [], `body`);
  let dropZone = createElem(`div`, `drop-zone`, [], `#room`);
  let ball = createElem(`div`, `ball`,[], `#drop-zone`);
  let basket = createElem(`div`, `basket`,[], `#room`);
  let basketImg = createElem(`img`, `basket-img`,[], `#room`);
  basketImg.setAttribute(`src`, `img/basket.png`);
  createMan();
  let result = createElem(`div`, ``,[`hide`,`result`], `body`);
  let info = createElem(`div`, ``,[`hide`,`info`], `body`);

  let newGameButton = createElem(`button`,`new-game-button`, [],`body`,`Начать игру!`);

  // newGameButton.addEventListener(`click`, (e) => {
  //   result.classList.add(`hide`);
  //   ball.style.left = startPosition[0] + `px`;
  //   ball.style.bottom = startPosition[1] + `px`;
  //   dragElement(ball, dropZone, man);
  //   info.textContent = `Возьми мяч и брось в корзину! Дождись результата!`;
  //   info.classList.toggle(`hide`);
  //   newGameButton.classList.toggle(`hide`);
  // });
}

function createMan(){
  let man = createElem(`div`, `man`, [], `#drop-zone`);
  let manBody = createElem(`img`, `body`,[], `#man`);
  manBody.setAttribute(`src`, `img/man.png`);
  let manLeftArm = createArm(`left-arm`);
  //let manRightArm = createArm(`right-arm`);
}

function createArm(id){
  let arm = createElem(`div`,id,[],`#man`);
  let part1 = createElem(`div`,``,[`part1`],`#${id}`);
  let part2 = createElem(`div`,``,[`part2`],`#${id}`);

}


function createElem(elem, id, classNames, parentSelector, text) {
  let item = document.createElement(elem);
  if (id) item.setAttribute(`id`, id);
  if (classNames.length > 0) classNames.forEach( className => item.classList.add(className));
  item.textContent = text;
  document.querySelector(parentSelector).appendChild(item);

  return item;
}