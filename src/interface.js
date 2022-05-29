createInterface();

const windowHeight = document.documentElement.clientHeight;
const windowWidth = document.documentElement.clientWidth;

function createInterface(){
    let room = createElem(`div`, `room`,`body`);
    let ball = createElem(`div`, `ball`,`#room`);
    dragElement(ball);
    let basket = createElem(`div`,`basket`,`#room`);
    let basketImg = createElem(`img`,`basket-img`,`#room`);
    basketImg.setAttribute(`src`,`img/basket.png`);
    let man = createElem(`div`,`man`,`#room`);
    let manBody = createElem(`img`,`body`,`#man`);
    manBody.setAttribute(`src`,`img/man.png`)
    let manLeftArm = createElem(`div`,`left-arm`,`#man`);
    let manRightArm = createElem(`div`,`right-arm`,`#man`);

    let newGameButton = createElem(`button`,`new-game-button`,`body`,`Начать игру!`);
}

function createElem(elem, id, parentSelector, text) {
    let item = document.createElement(elem);
    if (id) item.setAttribute(`id`, id);
    item.textContent = text;
    document.querySelector(parentSelector).appendChild(item);

    return item;
}

function dragElement(elem){
    let xMax = 600;
    let yMax = 600;
    let startX = 0;
    let startY = 0;
    let x0 =0;
    let y0 =0;
    let x1 = 0;
    let y1=0;
    let timer =0;
    let dt = 0.05;
    let speeds =[];
    let angle = 0;

    elem.onmousedown = dragMouseDown;


    function dragMouseDown(e){
        e = e || window.event;
        e.preventDefault();
        x1 = e.clientX;
        y1 = e.clientY;
        startX = x1;
        startY = y1;
        timer = setInterval(trackSpeed,dt*1000);
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
        if (x1 >550 || windowHeight - y1 > 550){
            closeDragElement();
            return;
        }
        elem.style.top = (elem.offsetTop - y0) + `px`;
        elem.style.left = (elem.offsetLeft - x0) + `px`;
      }
    
      function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        elem.style.top = null;
        elem.style.bottom = y1 + `px`;
        clearInterval(timer);
        let speed = 0;
        if (speeds.length === 0) speed = 0;
        else if (speeds.length < 5) {
            speed = (speeds.reduce(
                (previousValue, currentValue) => previousValue + currentValue))/speeds.length;
        } else {
            for(let i = 0; i<5;i++){
                speed += speeds[speeds.length-1-i];
            }
            speed = speed/5;
        }
        console.log(angle,speed);
        startGame(angle, speed*2);
        speeds.length = 0;
      }

      function trackSpeed(){
          let x = x1 - startX;
          let y = y1 - startY;
          startX = x1;
          startY = y1;
          if (x === 0 && y > 0) angle = -Math.PI;
          else if (x=== 0 && y < 0) angle = Math.PI;
          else if (x===0 && y === 0) angle = 0;
          else if (x > 0 && y > 0) angle = - Math.atan(y / x);
          else if (x > 0) angle =  -Math.atan(y / x);
          else if (y>0) angle = Math.PI - Math.atan(y / x);
          else angle = Math.PI/2 + Math.atan(y / x);
          let s = Math.pow(Math.pow(x,2) + Math.pow(y,2),1/2) * 0.008;
          speeds.push(s/dt);
      }
  
} 

    function setStartingValues(angle,speed){
        startSpeed = speed;
        startAngle = angle;
}
 