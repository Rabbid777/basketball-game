const g = 9.78;
const dt = 0.05;
let isWin = false;
let isEnd = false;
let isRestart = false;

function startGame(startAngle, startSpeed) {
  const room = new Room();
  const ball = new Ball(startSpeed, startAngle);
  const basket = new Basket();
  document.querySelector(`#end-game-button`).classList.toggle(`hide`);
  isRestart = false;
  let gameTimer = setInterval(() => {
    if (room.isBarrier(ball, basket)) {
      let correctCoordinates = room.getСorrectСoordinates(ball, basket);
      ball.setPosition(correctCoordinates.x, correctCoordinates.y);
      ball.changeDirection(basket);
    };
    ball.move();
    if (ball.isStatic || isRestart) {
      clearInterval(gameTimer);
      ball.setPosition(ball.box.center.x, ball.box.height / 2 + 1);
      if (!isEnd) endGame();
      startNewGame();
    };
    if (basket.isCaught(ball) && !isWin) {
      isWin = true;
      if (!isEnd) endGame();
      ball.setPosition(basket.box.center.x, ball.box.center.y);
      ball.changeDirection(basket);
    }
  }, dt * 1000);
};

function Ball(speed, throwAangle) {
  this.element = document.querySelector(`#ball`);
  this.box = new Box(this.element);
  this.direction = {
    isToRight: true,
    isUp: true,
  };
  this.isStatic = false;
  let v0 = speed;
  let angle = throwAangle;
  let t = 1;
  let vx = 0;
  let vy = 0;
  let v = 0;

  this.setPosition = function (x, y) {
    this.box.updatePosition(x, y);
    shiftObject(this);
  };

  this.move = function () {
    calcValues(this);
    shiftObject(this);
    if (isWin) isWin = false;
  };

  this.changeDirection = function (basket) {
    angle = getNewAngle(vx, vy, this, basket);
    v0 = v0 * 0.8;
    t = 1;
    this.isStatic = Math.floor(v0) === 0 && this.box.y0 <= 1;
  };

  function calcValues(ball) {
    t += dt;
    let x = ball.box.center.x + getX(v0, t, angle);
    let y = ball.box.center.y + getY(v0, t, angle);
    updateDirection(x, y, ball);
    vx = getSpeedX(v0, angle);
    vy = getSpeedY(v0, angle, t);
    v = getSpeed(vx, vy);
    ball.box.updatePosition(x, y);
  };

  function getX(v, t, angle) {
    return v * t * Math.cos(angle);
  };

  function getY(v, t, angle) {
    return v * t * Math.sin(angle) - (g * Math.pow(t, 2)) / 2;
  };

  function updateDirection(x, y, ball) {
    if(y !== ball.box.center.y) ball.direction.isUp = y > ball.box.center.y;
    if(x !== ball.box.center.x) ball.direction.isToRight = x > ball.box.center.x;
  };

  function getSpeedX(v0, angle) {
    return v0 * Math.cos(angle);
  };

  function getSpeedY(v0, angle, t) {
    return v0 * Math.sin(angle) - g * t;
  };

  function getSpeed(vx, vy) {
    return Math.pow(Math.pow(vx, 2) + Math.pow(vy, 2), 1 / 2);
  };

  //За это мне стыдно! Может однажды переосмыслю эти углы.
  function getNewAngle(vx, vy, ball, basket) {
    vy = getCorrectVy(vy, ball);
    let b = Math.atan(vy / vx);
    console.log(ball.direction.isUp);
    if (isWin && isEnd) {
      return -Math.PI / 2;
    } else if (ball.box.y0 <= 1) {
      if (b < (3 * Math.PI) / 2 && b > 0) return Math.PI - b;
      else if (b < 0) return Math.abs(b);
      else return 2 * Math.PI - b;
    } else if (ball.box.y1 >= windowHeight - 1) {
      if (b < 0) return 2 * Math.PI - Math.abs(b);
      else return Math.PI - Math.abs(b);
    } else if (ball.box.x0 <= 1) {
      if (!ball.direction.isUp) return Math.PI / 2 - Math.abs(b);
      else return Math.abs(b);
    } else if (ball.box.x1 >= basket.box.x0 - 1) {
      console.log(ball.direction.isUp,b*180/Math.PI);
      if (ball.direction.isUp) return Math.PI - Math.abs(b);
      else return 2 * Math.PI - b;
    };
  };

  function getCorrectVy(vy, ball) {
    if ((ball.isUp && vy < 0) || (!ball.isUp && vy > 0)) return -vy;
    return vy;
  };
};

function Basket() {
  this.element = document.querySelector(`#basket`);
  this.box = new Box(this.element);

  this.isBasketEdge = function (ball) {
    return (
      ball.box.x1 >= this.box.x0 &&
      ball.box.x0 <= this.box.x0 &&
      ball.box.y0 <= this.box.center.y &&
      ball.box.y1 >= this.box.center.y
    );
  };

  this.isCaught = function (ball) {
    return (
      ball.box.center.x > this.box.x0 &&
      ball.box.x1 <= this.box.x1 &&
      ball.box.center.y >= this.box.center.y &&
      ball.box.y0 <= this.box.y1
    );
  };
};

function Room() {
  this.element = document.querySelector(`#room`);
  this.box = new Box(this.element);
  let isFloor = false;
  let isCeiling = false;
  let isLeftWall = false;
  let isRightWall = false;
  let isBasketEdge = false;

  this.isBarrier = function (ball, basket) {
    isBasketEdge = basket.isBasketEdge(ball);
    isFloor = ball.box.y0 <= this.box.y0;
    isCeiling = ball.box.y1 >= this.box.y1;
    isLeftWall = ball.box.x0 <= this.box.x0;
    isRightWall = ball.box.x1 >= this.box.x1;

    return isBasketEdge || isFloor || isCeiling || isLeftWall || isRightWall;
  };

  this.getСorrectСoordinates = function (ball, basket) {
    let newCoordinates = new Coordinates(ball.box.center.x, ball.box.center.y);
    let halfWidth = Math.floor(ball.box.width / 2);
    let halfHeight = Math.floor(ball.box.height / 2);
    if (isBasketEdge) {
      isBasketEdge = false;
      newCoordinates.x = basket.box.x0 - halfWidth - 1;
    };
    if (isFloor) {
      isFloor = false;
      newCoordinates.y = this.box.y0 + halfHeight + 1;
    };
    if (isCeiling) {
      isCeiling = false;
      newCoordinates.y = this.box.y1 - halfHeight - 1;
    };
    if (isLeftWall) {
      isLeftWall = false;
      newCoordinates.x = this.box.x0 + halfWidth + 1;
    };
    if (isRightWall) {
      isRightWall = false;
      newCoordinates.x = this.box.x1 - halfWidth - 1;
    };
    return newCoordinates;
  };
};

function endGame() {
  document.querySelector(`#end-game-button`).classList.toggle(`hide`);
  isEnd = true;
  let resultElem = document.querySelector(`.result`);
  let resultText = `Попробуй еще!!!`;
  if (isWin) {
    resultText = `ПОЗДРАВЛЯЮ!!!`;  
    counter++;
    document.querySelector(`#counter`).textContent =`${counter}`;
  }
  resultElem.textContent = resultText;
  resultElem.classList.remove(`hide`);
};

function startNewGame() {
  isWin = false;
  isEnd = false;
  document.querySelector(`#new-game-button`).classList.toggle(`hide`);
};

function shiftObject(obj) {
  obj.element.style.left = obj.box.x0 + `px`;
  obj.element.style.bottom = obj.box.y0 + `px`;
};

function Box(element) {
  this.width = parseInt(window.getComputedStyle(element).width, 10);
  this.height = parseInt(window.getComputedStyle(element).height, 10);
  this.x0 = parseInt(window.getComputedStyle(element).left, 10);
  this.y0 = parseInt(window.getComputedStyle(element).bottom, 10);
  this.x1 = this.x0 + this.width;
  this.y1 = this.y0 + this.height;
  let midX = this.x0 + Math.floor(this.width / 2);
  let midY = this.y0 + Math.floor(this.height / 2);
  this.center = new Coordinates(midX, midY);

  this.updatePosition = function (x, y) {
    let halfWidth = Math.floor(this.width / 2);
    let halfHeight = Math.floor(this.height / 2);
    this.center.x = x;
    this.center.y = y;
    this.x0 = x - halfWidth;
    this.y0 = y - halfHeight;
    this.x1 = x + halfWidth;
    this.y1 = y + halfHeight;
  };
};
