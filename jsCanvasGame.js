const canvas = document.getElementById("demoCanvas");
const start = document.getElementById("startBtn");
const stop = document.getElementById("stopBtn");
const ctx = canvas.getContext("2d");
var keys = {};
let raf;

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  vx: 5,
  vy: 2,
  radius: 25,
  color: "#8CDE56",
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  },
  move() {
    if (ballCollision() == true) {
      this.x = -this.x;
      ball.draw();
      playerBar.draw();
      enemyBar.draw();
    }

    this.x += this.vx;
    this.y += this.vy;

    if (this.x + this.vx > canvas.width || this.x + this.vx < 0) {
      this.vx = -this.vx;
    }

    if (this.y + this.vy > canvas.height || this.y + this.vy < 0) {
      this.vy = -this.vy;
    }
  }
}

const playerBar = {
  width: 20,
  height: 100,
  x: 50,
  y: (canvas.height / 2) - 25,
  vy: 5,
  color: "#235800",
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

const enemyBar = {
  width: playerBar.width,
  height: playerBar.height,
  x: canvas.width - 50,
  y: (canvas.height / 2) - 75,
  vy: 5,
  color: playerBar.color,
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

//init
if (canvas.getContext) {
  ball.draw();
  playerBar.draw();
  enemyBar.draw();

  start.addEventListener("click", (e) => {
    raf = window.requestAnimationFrame(draw);
  });

  stop.addEventListener("click", (e) => {
    window.cancelAnimationFrame(raf);
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.draw();
    playerBar.draw();
    enemyBar.draw();
  });

  window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    e.preventDefault();
  });
  window.addEventListener("keyup", (e) => {
    delete keys[e.key];
  });
}

function input() {
  if ("w" in keys) {
    if (playerBar.y > 25) {
      playerBar.y -= playerBar.vy;
    }
  } else if ("s" in keys) {
    if (playerBar.y < canvas.height - (playerBar.height + 25)) {
      playerBar.y += playerBar.vy;
    }
  }
}

function enemyMove() {

}

function ballCollision() {
  if (((ball.x + ball.vx <= playerBar.x + playerBar.width) && (ball.y + ball.vy > playerBar.y) && (ball.y + ball.vy <= playerBar.y + playerBar.height)) || ((ball.x + ball.vx >= enemyBar.x) && (ball.y + ball.vy > enemyBar.y) && (ball.y + ball.vy <= enemyBar.y + enemyBar.height))) {
    return true;
  } else {
    return false;
  }
}

function draw() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  ball.draw();
  playerBar.draw();
  enemyBar.draw();
  input();

  ball.move();

  raf = window.requestAnimationFrame(draw);
}
