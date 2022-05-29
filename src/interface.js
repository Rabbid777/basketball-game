createInterface();

const windowHeight = document.documentElement.clientHeight;
const windowWidth = document.documentElement.clientWidth;
const scale = 0.008;
const startPosition = [100, 300];

function createInterface() {
  let room = createElem(`div`, `room`, `body`);
  let dropZone = createElem(`div`, `drop-zone`, `#room`);
  let ball = createElem(`div`, `ball`, `#drop-zone`);
  let basket = createElem(`div`, `basket`, `#room`);
  let basketImg = createElem(`img`, `basket-img`, `#room`);
  basketImg.setAttribute(`src`, `img/basket.png`);
  let man = createElem(`div`, `man`, `#drop-zone`);
  let manBody = createElem(`img`, `body`, `#man`);
  manBody.setAttribute(`src`, `img/man.png`);
  let manLeftArm = createElem(`div`, `left-arm`, `#man`);
  let manRightArm = createElem(`div`, `right-arm`, `#man`);
  let result = createElem(`div`, ``, `body`);
  result.classList.add(`hide`);
  result.classList.add(`result`);
  let info = createElem(`div`, ``, `body`);
  info.classList.add(`info`);
  info.classList.toggle(`hide`);

  let newGameButton = createElem(
    `button`,
    `new-game-button`,
    `body`,
    `Начать игру!`
  );
  newGameButton.addEventListener(`click`, (e) => {
    result.classList.add(`hide`);
    ball.style.left = startPosition[0] + `px`;
    ball.style.bottom = startPosition[1] + `px`;
    dragElement(ball, dropZone);
    info.textContent = `Возьми мяч и брось в корзину!`;
    info.classList.toggle(`hide`);
    newGameButton.classList.toggle(`hide`);
  });
}

function createElem(elem, id, parentSelector, text) {
  let item = document.createElement(elem);
  if (id) item.setAttribute(`id`, id);
  item.textContent = text;
  document.querySelector(parentSelector).appendChild(item);

  return item;
}

function dragElement(elem, dropZone) {
  let startX = 0;
  let startY = 0;
  let x0 = 0;
  let y0 = 0;
  let x1 = 0;
  let y1 = 0;
  let dx = 0;
  let dy = 0;
  let timer = 0;
  let dt = 0.05;
  let speeds = [];
  let angle = 0;

  elem.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    dropZone.classList.add(`select`);
    document.querySelector(`.info`).classList.toggle(`hide`);
    e = e || window.event;
    e.preventDefault();
    x1 = e.clientX;
    y1 = e.clientY;
    startX = x1;
    startY = y1;
    calcMouseShift();
    timer = setInterval(trackSpeedAndAngle, dt * 1000);
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    x0 = x1 - e.clientX;
    y0 = y1 - e.clientY;
    x1 = e.clientX;
    y1 = e.clientY;
    if (isOutOfDropZone()) {
      closeDragElement();
      return;
    }
    elem.style.top = elem.offsetTop - y0 + `px`;
    elem.style.left = elem.offsetLeft - x0 + `px`;
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    elem.onmousedown = null;
    dropZone.classList.remove(`select`);
    elem.style.top = null;
    elem.style.bottom = windowHeight - y1 + `px`;
    clearInterval(timer);
    let speed = calcSpeed();
    startGame(angle, speed * 1.5);
  }

  function trackSpeedAndAngle() {
    let x = x1 - startX;
    let y = y1 - startY;
    startX = x1;
    startY = y1;
    let prevAngle = angle;
    calcAngle(x, y);
    if (Math.abs(prevAngle - angle) >= Math.PI / 2) {
      speeds.length = 0;
    }
    let s = Math.pow(Math.pow(x, 2) + Math.pow(y, 2), 1 / 2) * scale;
    speeds.push(s / dt);
  }

  function isOutOfDropZone() {
    let r = parseInt(window.getComputedStyle(dropZone).width, 10) / 2;
    let centerX = parseInt(window.getComputedStyle(dropZone).left, 10) + r;
    let centerY = parseInt(window.getComputedStyle(dropZone).bottom, 10) + r;
    let ballX = x1 - dx;
    let ballY = windowHeight - y1 - dy;
    return (
      Math.floor(Math.pow(ballX - centerX, 2) + Math.pow(ballY - centerY, 2)) >=
      Math.floor(Math.pow(r, 2))
    );
  }

  function calcMouseShift() {
    let ball = document.querySelector(`#ball`);
    let r = parseInt(window.getComputedStyle(ball).width, 10) / 2;
    let x = parseInt(window.getComputedStyle(ball).left, 10) + r;
    let y = parseInt(window.getComputedStyle(ball).bottom, 10) + r;
    dx = x1 - x;
    dy = windowHeight - y1 - y;
  }

  function calcAngle(x, y) {
    if (x === 0 && y > 0) angle = -Math.PI;
    else if (x === 0 && y < 0) angle = Math.PI;
    else if (x === 0 && y === 0) angle = 0;
    else if (x > 0 && y > 0) angle = 2 * Math.PI - Math.abs(Math.atan(y / x));
    else if (x > 0) angle = -Math.atan(y / x);
    else if (y > 0) angle = Math.PI - Math.atan(y / x);
    else angle = Math.PI / 2 + Math.atan(y / x);
  }

  function calcSpeed() {
    let speed = 0;
    let speedsWithoutZeros = speeds.filter((value) => {
      return value !== 0;
    });
    if (speedsWithoutZeros.length === 0) speed = 0;
    else
      speed =
        speedsWithoutZeros.reduce(
          (previousValue, currentValue) => previousValue + currentValue
        ) / speedsWithoutZeros.length;
    speeds.length = 0;
    return speed;
  }
}
