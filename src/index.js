const g = 9.78;
const windowHeight = document.documentElement.clientHeight;
const windowWidth = document.documentElement.clientWidth;
let isWin = false;

function Coordinates(x,y) {
    this.x = x;
    this.y = y;
}

function Vertices(element){
    let width = parseInt(window.getComputedStyle(element).width,10);
    let height = parseInt(window.getComputedStyle(element).width,10);
    let x0 = parseInt(window.getComputedStyle(element).left,10);
    let y0 = parseInt(window.getComputedStyle(element).bottom,10);
    this.leftBottom = new Coordinates(x0,y0);
    this.leftTop = new Coordinates(x0,y0+height);
    this.rightBottom = new Coordinates(x0+width,y0);
    this.rightTop = new Coordinates(x0+width,y0+height);
    this.bottomMid = x0 + Math.floor(width/2);
    this.leftMid = y0 + Math.floor(height/2);

    this.updatePosition = function (x,y){
        this.leftBottom.x = x;
        this.leftBottom.y = y;
        this.leftTop.x = x;
        this.leftTop.y = y + height;
        this.rightBottom.x = x + width;
        this.rightBottom.y = y;
        this.rightTop.x = x + width;
        this.rightTop.y = y + height;
        this.bottomMid = x + Math.floor(width/2);
        this.leftMid = y + Math.floor(height/2);
    }
}

const ball = {
    element: document.querySelector(`#ball`),
    vertices:0,
    v0:35,
    v:0,
    angle:0.50,
    t:0,
    dt: 0.05,

    init: function() {
        this.vertices = new Vertices(this.element);
    },

    setPosition: function(x,y){
        this.vertices.updatePosition(x,y);
        this.shiftElement();
    },

    shiftElement: function(){
        this.element.style.left = this.vertices.leftBottom.x+`px`;
        this.element.style.bottom = this.vertices.leftBottom.y+`px`;
    },

    move: function(){
        this.calcBallValues();
        this.shiftElement();
    },

    calcBallValues: function (){
        this.t += this.dt;
        let x = this.vertices.leftBottom.x + getX(this.v0, this.t, this.angle);
        let y = this.vertices.leftBottom.y + getY(this.v0, this.t, this.angle);
        this.vertices.updatePosition(x,y);
        this.v = getSpeed(this.v0, this.angle, this.t);
        this.angle = getAngle(this.v0, this.v, this.t);
    },

    
}

const man = {
    height:0,
    width:0,
    range:300,

    throw: function(){
        
    }
}

const basket = {
    element: document.querySelector(`#basket`),
    vertices: 0,

    init: function(){
        this.vertices = new Vertices(this.element);
    },

    calculateRatio: function(ball){
        if (wall.isWall(ball.vertices.rightBottom.x)) return `isWallHit`;
        if ((ball.vertices.rightBottom.x > this.vertices.leftTop.x)&&
            (ball.vertices.bottomMid > this.vertices.leftTop.x)&&
            (!wall.isWall(ball.vertices.rightBottom.x))&&
            (ball.vertices.rightBottom.y>this.vertices.leftMid)&&
            (ball.vertices.rightBottom.y <= this.vertices.leftTop.y)){ 
            return `isWin`;
        }
        let x =((ball.vertices.rightBottom.x > this.vertices.leftTop.x) &&
        (ball.vertices.bottomMid <= this.vertices.leftTop.x) &&
        (ball.vertices.rightBottom.y < this.vertices.leftMid) &&
        (ball.vertices.rightTop.y > this.vertices.leftMid));
        let y =((ball.vertices.rightBottom.x > this.vertices.leftTop.x) &&
        (ball.vertices.bottomMid > this.vertices.leftTop.x)&&
        (!wall.isWall(ball.vertices.rightBottom.x)) &&
        (ball.vertices.rightBottom.y < this.vertices.leftMid)&&
        (ball.vertices.rightTop.y > this.vertices.leftMid));
        // if (((ball.vertices.rightBottom.x > this.vertices.leftTop.x) &&
        //     (ball.vertices.bottomMid <= this.vertices.leftTop.x) &&
        //     (ball.vertices.rightBottom.y < this.vertices.leftMid)) ||
        //     ((ball.vertices.rightBottom.x > this.vertices.leftTop.x) &&
        //     (ball.vertices.bottomMid > this.vertices.leftTop.x)&&
        //     (!wall.isWall(ball.vertices.rightBottom.x)) &&
        //     (ball.vertices.rightBottom.y < this.vertices.leftMid))){
                
        if (x || y){return `isBasketHit`
        }
        return ``;
    }
}

const wall = {
    x : 0,
    coeffElasticity:0,
    init: function(){
        this.x = basket.vertices.rightBottom.x;
    },
    isWall: function(x){
        return this.x <= x;
    }
}

ball.init();
basket.init();
wall.init();
console.log(basket);
setInterval(game,50);

function game (){
    let ratioStr = basket.calculateRatio(ball);
    if (!ratioStr || ratioStr === `isWin` || ball.v < 0){
        ball.move();
    }
    else if (ratioStr === `isWallHit`){
        ball.setPosition(wall.x - 100,ball.vertices.leftBottom.y - 10);
        changeBallVector();
    }
    else if (ratioStr === `isBasketHit`){
        ball.setPosition(basket.vertices.leftBottom.x-100,
                        ball.vertices.leftBottom-10);
        changeBallVector();
    }
}

function changeBallVector(){
    if (ball.v>ball.v0){
    ball.v0 = -ball.v0;
    ball.v = -ball.v;
    console.log(ball.angle, ball.v, ball.v0);
    ball.angle = - ball.angle;
    }
    else{
        let t = ball.v0;
        ball.v0=-ball.v;
        ball.v = -t;
        ball.angle = Math.PI/4-ball.angle;
    }
}

//!!!!!!!!!
// basket.calcPosition();
// ball.calcPosition();
// let moveTimer = setInterval(()=>{
//     if (basket.isСaught(ball) && !isWin){
//         isWin = true;
//         alert(`win`);
//         if (ball.v0>0) ball.v0 = -ball.v0;
//         ball.angle = ball.angle +1;
//     }
//     if (!isWin && ((ball.coordinates.x+ball.width >= basket.edge.x)&& 
//         (ball.fulcrum.y < basket.edge.y)&&
//         (ball.fulcrum.y + ball.height > basket.edge.y))&&
//         (ball.v0 > 0)){
//         ball.setPosition(basket.coordinates.x-ball.width,ball.coordinates.y);
//         shiftElement();
//         ball.v0 = -ball.v0;
//         ball.angle = ball.angle - Math.PI/2;
//     }
//     else if (!isWin && ((ball.coordinates.x > basket.coordinates.x) &&
//          (ball.coordinates.x < basket.coordinates.x + basket.width - ball.width)&&
//          (ball.coordinates.x +ball.width > basket.coordinates.x+basket.width)&&
//          (ball.v0> 0))){
//         ball.setPosition(basket.coordinates.x + basket.width - ball.width, ball.coordinates.y-10);
//         shiftElement();
//         ball.v0 = -ball.v0/5;
//         ball.angle = ball.angle -1;
//     } else if (ball.coordinates.y - 50 <= 0){
//         ball.setPosition(ball.coordinates.x, 0);
//         shiftElement();
//     }
//     else{
//         ball.move();
//     };

// },100);

function calcObjCoordinates(obj){
    obj.setPosition(parseInt(window.getComputedStyle(obj.element).left,10),
                    parseInt(window.getComputedStyle(obj.element).bottom,10));
}

// function shiftElement(){
//     ball.element.style.left = ball.coordinates.x+`px`;
//     ball.element.style.bottom = ball.coordinates.y+`px`;
// }

function getX(v, t, angle){
    return v * t * Math.cos(angle);
}

function getY(v, t, angle){
    return v * t * Math.sin(angle) - (g * Math.pow(t,2))/2;
}

function getSpeed(v, angle, t){
    let vx = v * Math.cos(angle);
    let vy = v * Math.sin(angle) - g * t;
    return Math.pow((Math.pow(vx,2)+Math.pow(vy,2)),1/2);
}

function getAngle(v0, v, t){
    return Math.asin((Math.pow(v0,2)-Math.pow(v,2)+Math.pow(g,2)*Math.pow(t,2))/(2*v0*g*t));
}