// set up canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// function to generate random number

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value

function randomRGB() {
  return `rgb(${random(100, 255)},${random(100, 255)},${random(100, 255)})`;
}

class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

class Ball extends Shape {
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY);
    this.x = x;
    this.y = y;
    this.velX = velX; // velX / velY are values added to x / y --- each time the method that calls for addition is called
    this.velY = velY;
    this.color = color;
    this.size = size;
    this.exists = true;
  }
}

class Evil extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20); // notice the hardcoded values
    this.x = x;
    this.y = y;
    this.color = "white";
    this.size = 10;
  }
}

//Ball methods: draw(), update(), collisionDetect()
Ball.prototype.draw = function(){
  ctx.beginPath();   
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);  // trace an arc, length = 2rPI
  ctx.fill();     // add fill, place the drawing on "paper"  -- this is 100% like vector drawing

}

Ball.prototype.update = function() {
if ((this.x + this.size) >= width) {
this.velX = -(this.velX);
}

if ((this.x - this.size) <= 0) {
this.velX = -(this.velX);
}

if ((this.y + this.size) >= height) {
this.velY = -(this.velY);
}

if ((this.y - this.size) <= 0) {
this.velY = -(this.velY);
}

this.x += this.velX;
this.y += this.velY;
}

Ball.prototype.collisionDetect = function() {

 for (let i = 0; i < balls.length; i++){  
  let dx = this.x - balls[i].x;     
  let dy = this.y - balls[i].y;
  let d = Math.sqrt(dx ** 2 + dy ** 2);
   for (let j = i + 1; j < balls.length; j++){
    let gx = balls[j].x;
    let gy = balls[j].y;
    let g = Math.sqrt(gx ** 2 + gy ** 2);
    if (d === g && balls[i].color != 'transparent' && balls[j].color != 'transparent'){
       balls[i].color = randomRGB();
       balls[j].color = randomRGB();  
           
     } 
   } 
   
 } 
} 

const balls = [];

while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );

  balls.push(ball);
}

Evil.prototype.drawE = function () {
  ctx.beginPath();
  ctx.strokeStyle = "red";
  ctx.lineWidth = 3;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
};

Evil.prototype.bounds = function () {
  //what happens when evilC reaches max/min width/height?

  if (this.x + this.size >= width) {
    //max width
    this.x = this.size; //appears on the opposite side
  }

  if (this.x - this.size < 0) {
    // min width -- MUST be < 0 & != 0, otherwise, it will conflict with the previous 'if' statement
    this.x = width - this.size * 1.001; // any number just over 1 so it appears on the opposite side and doesn't get "stuck"
  }

  if (this.y + this.size >= height) {
    //max height
    this.y = this.size;
  }

  if (this.y - this.size < 0) {
    this.y = height - this.size * 1.001;
  }
}; 

Evil.prototype.setControls = function () {
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "a":
        this.x -= this.velX;
        break;
      case "d":
        this.x += this.velX;
        break;
      case "s":
        this.y += this.velY;
        break;
      case "w":
        this.y -= this.velY;
        break;
    }
  });
};

Evil.prototype.collisionDetect1 = function () {
  let collision1 = 0;
  for (let i = 0; i < balls.length; i++) {
    let dx = this.x - balls[i].x;
    let dy = this.y - balls[i].y;
    let d = Math.sqrt(dx ** 2 + dy ** 2);
    if (d < 10 + balls[i].size && balls[i].color != "transparent") {
      balls[i].color = "transparent";
      collision1++;
      console.log(collision1);
    } 
  } 
}; 

let evilC = new Evil(random(10, width - 10), random(10, height - 10));
evilC.setControls();

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';  // this covers up the previous frame's drawing before the next one is drawn, gives the fading trail effect
    ctx.fillRect(0, 0, width, height); 
    evilC.bounds();
    evilC.drawE();
    evilC.collisionDetect1();

for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
    
}
  requestAnimationFrame(loop);  //the modern version of setInterval()
} // loop

loop();
