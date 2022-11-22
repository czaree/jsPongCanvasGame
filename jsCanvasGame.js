const canvas = document.getElementById("demoCanvas");
const start = document.getElementById("startBtn");
const stop = document.getElementById("stopBtn");
const ctx = canvas.getContext("2d");
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
  }
}

const bar = {
  x: 100,
  y: canvas.height / 2,
  width: 25,
  height: 100,
  color: "#235800",
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

if (canvas.getContext) {
  ball.draw();
  start.addEventListener("click", (e) => {
    raf = window.requestAnimationFrame(draw);
  });

  stop.addEventListener("click", (e) => {
    window.cancelAnimationFrame(raf);
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.draw();
  });

  addEventListener() {
    
  }
}

function draw() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  ball.draw();
  bar.draw();

  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
    ball.vx = -ball.vx;
  }

  if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
    ball.vy = -ball.vy;
  }

  raf = window.requestAnimationFrame(draw);
}
