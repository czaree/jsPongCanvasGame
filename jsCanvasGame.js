const canvas = document.getElementById("demoCanvas");
const start = document.getElementById("startBtn");
const stop = document.getElementById("stopBtn");
const ctx = canvas.getContext("2d");
var keys = {};
var raf;
var rafTitle;
var frameCount = 0;
var moveUpPlayer = true;
var moveDownPlayer = true;
var moveUpEnemy = true;
var moveDownEnemy = true;
var playerAi = true;
var playerScore = 0;
var enemyScore = 0;

const pauseBtn = {
  x: canvas.width - 35,
  y: 10,
  width: 25,
  color: "#235800",
  draw() {
    ctx.strokeStyle = this.color;
    ctx.strokeRect(this.x, this.y, this.width, this.width);
    ctx.strokeRect(this.x + 5, this.y + 5, this.width / 5, this.width - 10);
    ctx.strokeRect(this.x + 15, this.y + 5, this.width / 5, this.width - 10);
  }
}

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
  },
  moveUp() {
    if (moveUpPlayer == true) {
      if (this.y > 10) {
        this.y -= this.vy;
      }
    }
  },
  moveDown() {
    if (moveDownPlayer == true) {
      if (this.y < canvas.height - (this.height + 10)) {
        this.y += this.vy;
      }
    }
  },
  stopMoveUp() {
    moveUpPlayer == false;
  },
  stopMoveDown() {
    moveDownPlayer == false;
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
    if (moveUpEnemy == true) {
      if (this.y > 10) {
        this.y -= this.vy;
      }
    }
  },
  moveDown() {
    if (moveDownEnemy == true) {
      if (this.y < canvas.height - (this.height + 10)) {
        this.y += this.vy;
      }
    }
  },
  stopMoveUp() {
    moveUpEnemy == false;
  },
  stopMoveDown() {
    moveDownEnemy == false;
  }
}

function playerScoreDisplay() {
  ctx.font = "20px Monospace";
  ctx.fillStyle = "#235800";
  ctx.fillText(playerScore, (canvas.width / 2) + 50, 30);
}

function enemyScoreDisplay() {
  ctx.font = "20px Monospace";
  ctx.fillStyle = "#235800";
  ctx.fillText(enemyScore, (canvas.width / 2) - 50, 30);
}

//init
if (canvas.getContext) {
  ball.draw();
  playerBar.draw();
  enemyBar.draw();

  rafTitle = window.requestAnimationFrame(drawTitle);

  start.addEventListener("click", (e) => {
    playerScore = 0;
    enemyScore = 0;
    playerScoreDisplay();
    enemyScoreDisplay();
    playerAi = false;
    raf = window.requestAnimationFrame(drawGame);
    window.cancelAnimationFrame(rafTitle);
  });

  stop.addEventListener("click", (e) => {
    playerAi = true;
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


    window.cancelAnimationFrame(raf);
    rafTitle = window.requestAnimationFrame(drawTitle);
  });

  window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    e.preventDefault();
  });
  window.addEventListener("keyup", (e) => {
    delete keys[e.key];
  });

  /*canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log("x: " + x + " y: " + y);
    console.log(pauseBtn.x);
  });*/
}

function input() {
  if (playerAi == false) {
    if ("w" in keys) {
      if (playerBar.y > 10) {
        playerBar.y -= playerBar.vy;
      }
    } else if ("s" in keys) {
      if (playerBar.y < canvas.height - (playerBar.height + 10)) {
        playerBar.y += playerBar.vy;
      }
    }
  }
}

function ballCollision() {
  if (((ball.x + ball.vx - ball.radius <= playerBar.x + playerBar.width) && (ball.y + ball.vy > playerBar.y) && (ball.y + ball.vy <= playerBar.y + playerBar.height)) || ((ball.x + ball.vx + ball.radius >= enemyBar.x) && (ball.y + ball.vy > enemyBar.y) && (ball.y + ball.vy <= enemyBar.y + enemyBar.height))) {
    if (ball.vx < 6.5) {
      ball.vx += 0.2;
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
    let offset = Math.floor(Math.random() * 100 + 100);
    if (Math.round(Math.random()) == 0) {
      offset = -offset;
    }
    ball.predictY = ball.y + Math.floor(Math.random() * 20 - 10);
    if (offset % Math.floor(Math.random() * 10 + 1) == 0) {
      ball.predictY += offset;
      //console.log(offset);
    }
  }
  if (ball.vx > 0) {
    if (ball.predictY < enemyBar.y + (enemyBar.height / 2) - 10) {
      moveUpEnemy == true;
      enemyBar.moveUp();
    } else if (ball.predictY > enemyBar.y + (enemyBar.height / 2) + 10) {
      moveDownEnemy == true;
      enemyBar.moveDown();
    } else {
      /*moveUp == false;
      moveDown == false;*/
    }
  }
}

function playerPredict() {
  if (playerAi == true) {
    if (frameCount % 20 == 10) {
      ball.predictY = ball.y + Math.floor(Math.random() * 20 - 10);
    }
    if (ball.vx < 0) {
      if (ball.predictY < playerBar.y + (playerBar.height / 2) - 5) {
        moveUpPlayer == true;
        playerBar.moveUp();
      } else if (ball.predictY > playerBar.y + (playerBar.height / 2) + 5) {
        moveDownPlayer == true;
        playerBar.moveDown();
      } else {
        /*moveUp == false;
        moveDown == false;*/
      }
    }
  }
}

function resetPos() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.vx = Math.floor(Math.random() * 5.5 + 4.25);
}

function drawGame() {
  playerAi = false;
  ctx.clearRect(0,0, canvas.width, canvas.height);
  ball.draw();
  playerBar.draw();
  enemyBar.draw();
  pauseBtn.draw();
  playerScoreDisplay();
  enemyScoreDisplay();
  input();

  ball.move();

  enemyPredict();
  frameCount++;

  raf = window.requestAnimationFrame(drawGame);
}

function drawTitle() {
  playerAi = true;
  ctx.clearRect(0,0, canvas.width, canvas.height);
  ball.draw();
  playerBar.draw();
  enemyBar.draw();

  ball.move();

  enemyPredict();
  playerPredict();
  frameCount++;

  ctx.drawImage(document.getElementById("pongTitle"), canvas.style.width / 2, canvas.style.height / 2);

  rafTitle = window.requestAnimationFrame(drawTitle);
}
