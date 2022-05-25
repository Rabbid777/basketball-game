const g = 9.78;
const dt = 0.05;
const windowHeight = document.documentElement.clientHeight;
const windowWidth = document.documentElement.clientWidth;
let isWin = false;

function Coordinates(x,y) {
    this.x = x;
    this.y = y;
}

function Box(element){
    this.width = parseInt(window.getComputedStyle(element).width,10);
    this.height = parseInt(window.getComputedStyle(element).height,10);
    this.x0 = parseInt(window.getComputedStyle(element).left,10);
    this.y0 = parseInt(window.getComputedStyle(element).bottom,10);
    this.x1 = this.x0 + this.width;
    this.y1 = this.y0 + this.height;
    let midX = this.x0 + Math.floor(this.width/2);
    let midY = this.y0 + Math.floor(this.height/2);
    this.center = new Coordinates(midX, midY);

    this.updatePosition = function (x,y){
        let halfWidth = Math.floor(this.width/2);
        let halfHeight =  Math.floor(this.height/2);
        this.center.x = x;
        this.center.y = y;
        this.x0 = x - halfWidth;
        this.y0 = y - halfHeight;
        this.x1 = x + halfWidth;
        this.y1 = y + halfHeight;
    }

}


function Ball () {
    this.element= document.querySelector(`#ball`);
    this.box = new Box(this.element);
    let v0 = 35;
    let angle = 0.6;
    let t= 1;
    let vx = 0;
    let vy =0;
    let v= 0;
    this.isUp = true;

    this.setPosition = function(x,y){
        this.box.updatePosition(x,y);
        shiftObject(this);
    };

    this.move = function(){
        calcValues(this);
        shiftObject(this);
    };

    this.changeDirection = function(basket){
        angle = getNewAngle(vx,vy,this,basket);
        v0 = v0 * 0.9;
        t=1;
        calcValues(this);
        shiftObject(this);
    }

    this.isEnd = function(){
        let isLeftAngle = (Math.floor(this.box.x0)<=1) && 
                          (Math.floor(this.box.y0)<=1) &&
                          (angle >= Math.PI/2) && 
                          (angle <= 3*Math.PI/2);
        let isRightAngle = (Math.floor(this.box.x1) <= (windowWidth - this.box.width)) && 
                           (Math.floor(this.box.y0<=1)) &&
                           (angle <= Math.PI/2) && 
                           (angle >= 3*Math.PI/2);
        return isLeftAngle || isRightAngle || Math.ceil(v0) === 0;
    }
    

    function calcValues(ball){
        t += dt;
        let x = ball.box.center.x + getX(v0, t, angle);
        let y = ball.box.center.y + getY(v0, t, angle);
        if (y > ball.box.center.y) ball.isUp = true
        else ball.isUp = false;
        vx = getSpeedX(v0,angle);
        vy = getSpeedY(v0,angle,t);
        v = getSpeed(vx,vy);
        ball.box.updatePosition(x,y);
    };

    function getX(v, t, angle){
        return v * t * Math.cos(angle);
    };
    
    function getY(v, t, angle){
        return v * t * Math.sin(angle) - (g * Math.pow(t,2))/2;
    };
    
    function getSpeedX(v0,angle){
        return v0 * Math.cos(angle);
    };
    
    function getSpeedY(v0,angle,t){
        return v0*Math.sin(angle) - g * t;
    };
    
    function getSpeed(vx,vy){
        return Math.pow((Math.pow(vx,2)+Math.pow(vy,2)),1/2);
    };

    function getNewAngle(vx,vy,ball,basket){
        vy = getCorrectVy(vy,ball);
        let b = Math.atan(vy/vx);

        if (ball.box.y0 <=1){
            if (b < 3*Math.PI/2 && b >0) return Math.PI-b;
            else if (b < 0) return Math.abs(b);
            else return 2*Math.PI -b;
        } else if (ball.box.y1 >=windowHeight-1){
            if (b <Math.PI/2 && b>0) return Math.PI + b;
            else return b - Math.PI;
        } else if (ball.box.x0 <= 1){
            return Math.abs(b);
        } else if (ball.box.x1 >= basket.box.x0 -1 ){
            if (b < 0) return Math.PI - Math.abs(b);
            else if (ball.isUp) return Math.PI+b;
            else return b - Math.PI;
        }
    };

    function getCorrectVy(vy,ball){
        if ((ball.isUp && vy<0) || (!ball.isUp && vy>0)) return -vy;
        return vy;
        // let arr = [vx,vy];
        // if ((ball.isUp && vx<0) || (!ball.isUp && vx>0)) return [-vx,vy];
        // if ((ball.isUp && vy<0) || (!ball.isUp && vy>0)) return [vx,-vy];
        // if (!ball.isUp && vx > 0 && (ball.box.x0 <=1)) return [-vx,vy];
        // if (ball.isUp && vx < 0 && (ball.box.x1 >=windowWidth-1)) return [-vx,vy];
        // if (!ball.isUp && vy >0 && (ball.box.y0 <=1)) return [vx,-vy];
        // if (vy < 0 && (ball.box.y1 >= windowHeight-1)) return [vx,-vy];
    }
}

function Basket () {
    this.element = document.querySelector(`#basket`),
    this.box = new Box(this.element);

    this.isBasketEdge = function(ball){
        return (ball.box.x1 >= this.box.x0) &&
               ((ball.box.y0 <= this.box.y1) && 
                (ball.box.y1 >=this.box.y0));
    };

    this.isCaught = function(ball){
        return ((ball.box.center.x > this.box.x0) && 
                (ball.box.y1 <= this.box.x1)) && 
               ((ball.box.center.y <= this.box.y1) && 
                (ball.box.center.y) >= (this.box.y0));
    };

}

function Room (){
    this.element = document.querySelector(`#room`);
    this.box = new Box(this.element);
    let isFloor = false;
    let isCeiling = false;
    let isLeftWall = false;
    let isRightWall = false;
    let isBasketEdge = false;

    this.isBarrier = function(ball,basket){
        isBasketEdge = basket.isBasketEdge(ball);
        isFloor = ball.box.y0 <= this.box.y0;
        isCeiling = ball.box.y1 >= this.box.y1;
        isLeftWall = ball.box.x0 <= this.box.x0;
        isRightWall = ball.box.x1 >=this.box.x1;

        return (isBasketEdge || isFloor || isCeiling || isLeftWall || isRightWall);
    };

    this.getСorrectСoordinates = function(ball,basket){
        let newCoordinates = new Coordinates(ball.box.center.x,ball.box.center.y);
        let halfWidth = Math.floor(ball.box.width/2);
        let halfHeight = Math.floor(ball.box.height/2);
        if (isBasketEdge) {
            isBasketEdge = false;
            newCoordinates.x = basket.box.x0-halfWidth - 1;
        }
        if (isFloor) {
            isFloor = false;
            newCoordinates.y = this.box.y0 + halfHeight + 1;
        }
        if (isCeiling) {
            isCeiling = false;
            newCoordinates.y = this.box.y1- halfHeight - 1;
        }
        if (isLeftWall) {
            isLeftWall =false; 
            newCoordinates.x = this.box.x0 + halfWidth +1;
        }
        if (isRightWall) {
            isRightWall = false;
            newCoordinates.x = this.box.x1-halfWidth -1;
        }
        return newCoordinates;
    }
    

}

const room = new Room();
const ball = new Ball();
const basket = new Basket();

let gameTimer = setInterval(game,dt*1000);

function game (){
    let isWin = false;
    if(room.isBarrier(ball,basket)){    
        let correctCoordinates = room.getСorrectСoordinates(ball,basket);
        ball.setPosition(correctCoordinates.x,correctCoordinates.y);
        ball.changeDirection(basket);
    }
    else {
        ball.move();
        if (ball.isEnd()) clearInterval(gameTimer);
    }
    if (basket.isCaught(ball)){
        isWin = true;
    }
}

function shiftObject(obj){
    obj.element.style.left = obj.box.x0+`px`;
    obj.element.style.bottom = obj.box.y0+`px`;
};