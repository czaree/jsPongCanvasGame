const canvas = document.getElementById("demoCanvas");
const start = document.getElementById("startBtn");
const stop = document.getElementById("stopBtn");
const ctx = canvas.getContext("2d");
var keys = {};
var raf;
var frameCount = 0;
var moveUp = true;
var moveDown = true;
var playerScore = 0;
var enemyScore = 0;

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  predictY: canvas.height / 2,
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
      this.vx = -this.vx;
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
  },
  moveUp() {
    if (moveUp == true) {
      if (this.y > 10) {
        this.y -= this.vy;
      }
    }
  },
  moveDown() {
    if (moveDown == true) {
      if (this.y < canvas.height - (this.height + 10)) {
        this.y += this.vy;
      }
    }
  },
  stopMoveUp() {
    moveUp == false;
  },
  stopMoveDown() {
    moveDown == false;
  }
}

function playerScoreDisplay() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#235800";
  ctx.fillText(playerScore, (canvas.width / 2) + 50, 30);
}

function enemyScoreDisplay() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#235800";
  ctx.fillText(enemyScore, (canvas.width / 2) - 50, 30);
}

//init
if (canvas.getContext) {
  ball.draw();
  playerBar.draw();
  enemyBar.draw();
  playerScoreDisplay();
  enemyScoreDisplay();

  start.addEventListener("click", (e) => {
    raf = window.requestAnimationFrame(draw);
  });

  stop.addEventListener("click", (e) => {
    window.cancelAnimationFrame(raf);
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    playerScore = 0;
    enemyScore = 0;
    ball.draw();
    playerBar.draw();
    enemyBar.draw();
    playerScoreDisplay();
    enemyScoreDisplay();
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
    if (playerBar.y > 10) {
      playerBar.y -= playerBar.vy;
    }
  } else if ("s" in keys) {
    if (playerBar.y < canvas.height - (playerBar.height + 10)) {
      playerBar.y += playerBar.vy;
    }
  }
  if ("ArrowUp" in keys) {
    enemyBar.moveUp();
  } else if ("ArrowDown" in keys) {
    enemyBar.moveDown();
  }
}

function ballCollision() {
  if (((ball.x + ball.vx - ball.radius <= playerBar.x + playerBar.width) && (ball.y + ball.vy > playerBar.y) && (ball.y + ball.vy <= playerBar.y + playerBar.height)) || ((ball.x + ball.vx + ball.radius >= enemyBar.x) && (ball.y + ball.vy > enemyBar.y) && (ball.y + ball.vy <= enemyBar.y + enemyBar.height))) {
    if (ball.vx < 6) {
      ball.vx += 0.1;
    }
    return true;
  } else if (ball.x + ball.vx < playerBar.x) {
    playerScore++;
    resetPos();
    console.log(playerScore, enemyScore);
    return true;
  } else if (ball.x + ball.vx > enemyBar.x + enemyBar.width) {
    enemyScore++;
    resetPos();
    console.log(playerScore, enemyScore);
    return true;
  }
  else {
    return false;
  }
}

function enemyPredict() {
  if (frameCount % 20 == 0) {
    ball.predictY = ball.y + Math.floor(Math.random() * 20 - 10);
  }
  if (ball.vx > 0) {
    if (ball.predictY < enemyBar.y + (enemyBar.height / 2) - 5) {
      moveUp == true;
      enemyBar.moveUp();
    } else if (ball.predictY > enemyBar.y + (enemyBar.height / 2) + 5) {
      moveDown == true;
      enemyBar.moveDown();
    } else {
      /*moveUp == false;
      moveDown == false;*/
    }
  }
}

function resetPos() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.vx = Math.floor(Math.random() * 5.5 + 3.75);
}

function draw() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  ball.draw();
  playerBar.draw();
  enemyBar.draw();
  playerScoreDisplay();
  enemyScoreDisplay();
  input();

  ball.move();

  enemyPredict();
  frameCount++;

  raf = window.requestAnimationFrame(draw);
}
