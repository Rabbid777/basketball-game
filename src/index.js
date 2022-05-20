const g = 9.78;
const windowHeight = document.documentElement.clientHeight;
const windowWidth = document.documentElement.clientWidth;
let isWin = false;

function Coordinates(x,y) {
    this.x = x;
    this.y = y;
}

function Box(element){
    this.width = parseInt(window.getComputedStyle(element).width,10);
    this.height = parseInt(window.getComputedStyle(element).width,10);
    this.x0 = parseInt(window.getComputedStyle(element).left,10);
    this.y0 = parseInt(window.getComputedStyle(element).bottom,10);
    this.x1 = this.x0 + this.width;
    this.y1 = this.y0 + this.height;
    let midX = this.x0 + Math.floor(this.width/2);
    let midY = this.y0 + Math.floor(this.height/2);
    this.center = new Coordinates(midX, midY);

    this.updatePosition = function (x,y){
        this.x0 = x;
        this.y0 = y;
        this.x1 = x + this.width;
        this.y1 = y + this.height;
        this.center.x = x + Math.floor(this.width/2);
        this.center.y = y + Math.floor(this.height/2);
    }

}

function Ball () {
    this.element= document.querySelector(`#ball`);
    this.box = new Box(this.element);
    this.direction = true;
    let v0 = 30;
    let vx = 0;
    let vy =0;
    let v= 0;
    let angle = 0.5;
    let t= 0;
    let tmax =0;
    let dt = 0.05;

    this.setPosition = function(x,y){
        this.box.updatePosition(x,y);
        shiftObject(this);
    };

    this.move = function(){
        calcValues(this);
        shiftObject(this);
    };

    this.changeDirection = function(){
        this.direction = false;
        alert(angle);
        angle = getNewAngle(vx,vy,t,tmax);
        v0 = v;
        t=0;
        calcValues(this);
    }

    function calcValues(ball){
        if(t===0) tmax= getTmax(v0,angle);
        t += dt;
        let x = ball.box.x0 + getX(v0, t, angle);
        let y = ball.box.y0 + getY(v0, t, angle);
        ball.box.updatePosition(x,y);
        vx = getSpeedX(v0,angle);
        vy = getSpeedY(v0,angle,t);
        v = getSpeed(vx,vy);
    };

    function getTmax(v,angle){
        return v * Math.sin(angle)/g;
    }
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
    
    function getNewAngle(vx,vy,t,tmax){
        // if(t<tmax) return Math.PI/2 - vy/vx;
        // if (t>tmax) return Math.PI - Math.atan(vy/vx);
        return Math.PI - Math.atan(vy/vx);
    };
    
}

const man = {
    height:0,
    width:0,
    range:300,

    throw: function(){
        
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
                (ball.box.y1 <= wall.x)) && 
               ((ball.box.center.y <= this.box.y1) && 
                (ball.box.center.y) >= (this.box.y0));
    };

}

function Wall() {
    this.x = basket.box.x1;
    this.isWall = function(x){
        return this.x <= x;
    }
}

const ball = new Ball();
const basket = new Basket();
const wall = new Wall();

setInterval(game,50);

function game (){
    let isWin = false;
    if(basket.isBasketEdge(ball) && ball.direction){
        ball.changeDirection();
        ball.setPosition(basket.box.x0 - ball.box.width,ball.box.y0);
    }
    else if (wall.isWall(ball.box.x1) && ball.direction){
        ball.changeDirection();
        ball.setPosition(wall.x - ball.box.width,ball.box.y0);
    }
    else ball.move();
    if (basket.isCaught(ball)){
        isWin = true;
    }
}

function shiftObject(obj){
    obj.element.style.left = obj.box.x0+`px`;
    obj.element.style.bottom = obj.box.y0+`px`;
};