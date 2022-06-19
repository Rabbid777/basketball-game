const scale = 0.008;
const startPosition = [200, 500];

let newGameButton = document.querySelector(`#new-game-button`);

newGameButton.addEventListener(`click`, (e) => {
  document.querySelector(`.result`).classList.add(`hide`);
  let ball = document.querySelector(`#ball`);
  ball.style.left = startPosition[0] + `px`;
  ball.style.bottom = startPosition[1] + `px`;
  document.querySelector(`.info`).textContent = `Возьми мяч и брось в корзину! Дождись результата!`;
  document.querySelector(`.info`).classList.toggle(`hide`);
  newGameButton.classList.toggle(`hide`);
  let man = new Man();
  dragElement(ball, document.querySelector(`#drop-zone`),man);
});

function dragElement(elem, dropZone, man) {
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
    man.arm.move(x1,windowHeight - y1);
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
// 10
  function isOutOfDropZone() {
    let r = parseInt(window.getComputedStyle(dropZone).width, 10) / 2 +10;
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


function Man() {
  this.element = document.querySelector(`#man`);
  let height = parseInt(window.getComputedStyle(this.element).height, 10);
  let width = parseInt(window.getComputedStyle(this.element).width, 10);
  // let arms = {
  //   left: new Arm(`left`,ball),
  //   right: new Arm(`right`,ball),
  // };
  this.arm = new Arm(`left`);
}

function Arm(side){
  this.element = document.querySelector(`#${side}-arm`);
  this.part1Element = getPartElem(1);
  this.part2Element = getPartElem(2);
  this.part1Position = new Position(this.part1Element);
  this.part2Position = new Position(this.part2Element);
  let shoulder = new Coordinates(this.part1Position.x0, this.part1Position.y0);
  let length = this.part1Position.height + this.part2Position.height;
  let quarter = 0;

  this.move = function(x,y){
    quarter = calcQuarter(x,y,shoulder);
    let distance = calcDistance(x,y,shoulder);
    if (distance > length) return;
    let distanceAngle = calcDistanceAngle(y,distance,shoulder);
    let partDistanceAngle = calcPartDistanceAngle(distance,this);
    let partsAnglesArr = calcPartsAnglesArr(distanceAngle,partDistanceAngle,quarter);
    //console.log(partDistanceAngle*180 / Math.PI);
    let foldPoint = calcFoldPoint(partsAnglesArr[0],this,shoulder,quarter);
    let newCoordinatesPart1 = calcNewCoordinates(this.part1Position.height,
                                                 partsAnglesArr[0], quarter,
                                                 shoulder.x, shoulder.y,1);
    let newCoordinatesPart2 = calcNewCoordinates(this.part2Position.height,
                                                 partsAnglesArr[1], quarter,
                                                 foldPoint.x,foldPoint.y,2);
    //console.log(foldPoint, newCoordinatesPart2);
    //console.log(partsAnglesArr[0]*180 / Math.PI,partsAnglesArr[1]*180 / Math.PI);
    //console.log(`эээ`, newCoordinatesPart1, newCoordinatesPart2);
    this.part1Position.update(newCoordinatesPart1,partsAnglesArr[0]);
    this.part2Position.update(newCoordinatesPart2,partsAnglesArr[1]);
  }

  function calcQuarter(x,y,shoulder){
    if(x>=shoulder.x && y>=shoulder.y) return 1;
    if(x<=shoulder.x && y>=shoulder.y) return 2;
    if(x<=shoulder.x && y<=shoulder.y) return 3;
    if(x>=shoulder.x && y<=shoulder.y) return 4;
  }
  
  function calcDistance(x,y,shoulder){
    return Math.pow(Math.pow((x-shoulder.x),2)+Math.pow((y-shoulder.y),2),1/2);
  };

  function calcDistanceAngle(y,distance,shoulder){
    return Math.asin(Math.abs(y-shoulder.y)/distance);
  };

  function calcPartDistanceAngle(distance,arm){
    return Math.acos(distance/(2*arm.part1Position.height));
  };

  function calcPartsAnglesArr(distanceAngle,partDistanceAngle,quarter){
    //console.log(distanceAngle* 180 / Math.PI,partDistanceAngle* 180 / Math.PI,quarter);
    if (quarter === 1) return [Math.PI/2 - distanceAngle + partDistanceAngle,
                               Math.PI/2 - distanceAngle - partDistanceAngle];
    if (quarter === 2) return [Math.PI/2 - distanceAngle - partDistanceAngle,
                               Math.PI/2 - distanceAngle + partDistanceAngle];
    if (quarter === 3) return [Math.PI/2 + distanceAngle,
                               Math.PI/2 + distanceAngle + partDistanceAngle];
    if (quarter === 4) return [Math.PI/2 + distanceAngle + partDistanceAngle,
                               Math.PI/2 + distanceAngle - partDistanceAngle];
  };

  function calcFoldPoint(part1Angle,arm, shoulder,quarter){
    let alpha = Math.PI/2 - part1Angle;
    if (quarter === 2) alpha = - (Math.PI/2 - Math.abs(part1Angle));
    else if (quarter === 3) alpha = Math.PI/2 + part1Angle;
    else if (quarter === 4) alpha = Math.PI/2 - part1Angle;
    return new Coordinates(shoulder.x + arm.part1Position.height*Math.cos(alpha),
                           shoulder.y + arm.part1Position.height*Math.sin(alpha));
  };

  function calcNewCoordinates(l,angle,quarter,x0,y0,part){
    let dx = 0;
    let dy = 0;
    let x = 0;
    let y = 0;
    if(quarter === 1){
      dx = (l/2) * Math.sin(angle);
      x = x0 + dx;
      dy = l * Math.pow(Math.cos((Math.PI - Math.abs(angle))/2),2);
      y = y0 - dy;
    } else if (quarter ===2){
      dx = (l/2) * Math.sin(angle);
      x = x0 - dx;
      dy = l * Math.pow(Math.cos((Math.PI - Math.abs(angle))/2),2);
      y = y0 -dy;
    } else if (quarter === 3){
      dx = (l/2) * Math.sin(Math.PI - angle);
      x = x0 - dx;
      dy = l - l * Math.pow(Math.cos(angle)/2,2);
      y = y0 - dy;
    } else if (quarter === 4) {
      dx = (l/2)* Math.sin(Math.PI - angle);
      x = x0 + dx;
      // if (part === 2) dy = l * Math.pow(Math.cos(angle)/2,2);
      // else 
      dy = l - l * Math.pow(Math.cos(angle)/2,2);
      y = y0-dy;
      console.log(angle, y0,dy,y);
    }
    //console.log(angle*180/Math.PI,dy,dx);
    return new Coordinates(x,y);
    // if(angle<=0 && Math.abs(angle) <= Math.PI/2){
    //   dx = (l/2) * Math.sin(angle);
    //   x = x0 - dx;
    //   dy = dx * Math.tan(angle);
    //   y = y0 -dy;
    //   console.log(x,y,x0,y0,dx,angle * 180 / Math.PI);
    // } else if (angle <= 0 && Math.abs(angle) >= Math.PI/2){
    //   dx = (l/2) * Math.sin(Math.PI - angle);
    //   x = x0 - dx;
    //   dy = l - dx * Math.tan(Math.PI-angle);
    //   y = y0 - dy;
    // } else if (angle >= 0 && angle <= Math.PI/2){
    //   dx = (l/2) * Math.sin(angle);
    //   x = x0 + dx;
    //   dy = dx * Math.tan(angle);
    //   y = y0 - dy;
    //   console.log(`1`,x,y,x0,y0,dx,angle * 180 / Math.PI);
    // } else if (angle >= 0 && angle >= Math.PI/2){
    //   dx = (l/2)* Math.sin(Math.PI - angle);
    //   x = x0 + dx;
    //   dy = l - dx * Math.tan(Math.PI-angle);
    //   y = y0-dy;
    // }
  };

  function getPartElem(num){
    if (side === `left`) return document.querySelectorAll(`.part${num}`)[0];
    else document.querySelectorAll(`.part${num}`)[1];
  };
}

function Position(element){
  this.width = parseInt(window.getComputedStyle(element).width, 10);
  this.height = parseInt(window.getComputedStyle(element).height, 10);
  this.x0 = parseInt(window.getComputedStyle(element).left, 10);
  this.y0 = parseInt(window.getComputedStyle(element).bottom, 10);
  this.angle = parseInt(window.getComputedStyle(element).transform, 10);
  this.quarter = 0;

  this.update = function(coord,angle){
    this.x0 = coord.x;
    this.y0 = coord.y;
    this.angle = angle;
    shift(coord.x,coord.y,angle,element);
  }

  function shift(x,y,angle,element){
    element.style.left = x + `px`;
    element.style.bottom = y + `px`;
    element.style.transform = `rotate(${angle}rad)`;
  }
}

function Coordinates(x, y) {
  this.x = x;
  this.y = y;
}