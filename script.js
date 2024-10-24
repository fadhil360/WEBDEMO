const canvas = document.getElementById('pendulumCanvas');
const ctx = canvas.getContext('2d');

// Pendulum properties
let length = 200;
let angle = 0;
let angleVelocity = 0;
let angleAcceleration = 0;
const origin = { x: canvas.width / 2, y: 10 };

let cut = false;
let isDragging = false;
let bobX, bobY;

let ball = {
  x: canvas.width / 2,
  y: 50,
  radius: 10,
  dx: 2,
  dy: 2,
  gravity: 0.98,
  bounce: 0.5,
  velocity: 0,
};
const lengthControl = document.getElementById('length');
const gravityControl = document.getElementById('GR');
const gravityBox = document.getElementById('gravityBox');
const velocityBoxx = document.getElementById('Velx');
const velocityBoxy = document.getElementById('Vely');
document.getElementById('reset').addEventListener('click', function () {
  cut = false;
  bobX = 350;
  bobY = 200;
  angle = 0;
  angleVelocity = 0;
  angleAcceleration = 0;
});
document.getElementById('cut').addEventListener('click', function () {
  if (!cut) {
    cut = true;
    let linearVelocity = angleVelocity * length;
    ball.dx = linearVelocity * Math.cos(angle);
    ball.dy = -linearVelocity * Math.sin(angle);
    console.log('Ball velocity: ', ball.dx, ball.dy);
  }
});
lengthControl.addEventListener('input', function () {
  length = parseInt(this.value);
});
gravityControl.addEventListener('input', function () {
  ball.gravity = parseFloat(this.value);
  gravityBox.textContent = ball.gravity;
});
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPendulum() {
  bobX = origin.x + length * Math.sin(angle);
  bobY = 0 + length * Math.cos(angle);

  if (!cut) {
    ctx.beginPath();
    ctx.moveTo(origin.x, 10);
    ctx.lineTo(bobX, bobY);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();
  }
  if (!cut) {
    linearVelocity = angleVelocity * length;
    linearVelocity * Math.cos(angle) - linearVelocity * Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(bobX, bobY);
    console.log(bobX, bobY);
    ctx.lineTo(
      bobX + linearVelocity * Math.cos(angle) * 10,
      bobY - linearVelocity * Math.sin(angle) * 10
    );
    console.log(
      bobX + linearVelocity * Math.cos(angle),
      bobY + linearVelocity * Math.sin(angle)
    );
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'green';
    ctx.stroke();
  }
  if (!cut) {
    ctx.beginPath();
    ctx.arc(bobX, bobY, ball.radius, 0, 2 * Math.PI);
    ctx.fillStyle = isDragging ? 'red' : 'blue';
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.fill();
    ctx.stroke();
    ball.x = bobX;
    ball.y = bobY;
  } else {
    drawBall();
    updateBallPosition();
  }
}
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'blue';
  ctx.fill();
  ctx.closePath();
}
function updatePendulum() {
  if (!isDragging && !cut) {
    angleAcceleration = ((-1 * ball.gravity) / length) * Math.sin(angle);

    angleVelocity += angleAcceleration;
    angle += angleVelocity;

    angleVelocity *= 1;
    linearVelocity = angleVelocity * length;
    velocityBoxx.textContent = (linearVelocity * Math.cos(angle)).toFixed(2);
    velocityBoxy.textContent = (-linearVelocity * Math.sin(angle)).toFixed(2);
  }
}

function isMouseOverBob(mouseX, mouseY) {
  const distance = Math.sqrt((mouseX - bobX) ** 2 + (mouseY - bobY) ** 2);
  return distance < ball.radius;
}

canvas.addEventListener('mousedown', (e) => {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  if (isMouseOverBob(mouseX, mouseY)) {
    isDragging = true;
    angleVelocity = 0;
  }
});

function updateBallPosition() {
  ball.x += ball.dx;
  ball.y += ball.dy;
  ball.dy += 0.98;
  if (ball.y + ball.radius > canvas.height) {
    ball.y = canvas.height - ball.radius;
    ball.dy *= -ball.bounce;
  }

  if (ball.y - ball.radius < 0) {
    ball.y = ball.radius;
    ball.dy *= -ball.bounce;
  }
  if (ball.x + ball.radius > canvas.width) {
    ball.x = canvas.width - ball.radius;
    ball.dx *= -ball.bounce;
  }

  if (ball.x - ball.radius < 0) {
    ball.x = ball.radius;
    ball.dx *= -ball.bounce;
  }
  if (Math.abs(ball.dy) < 2 && ball.y + ball.radius === canvas.height) {
    ball.dy = 0;
  }
  if (Math.abs(ball.dx) < 2) {
    ball.dx = 0;
  }
}

canvas.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    angle = Math.atan2(origin.x - mouseX, mouseY - 0) * -1;
  }
  const distance = Math.sqrt((e.offsetX - bobX) ** 2 + (e.offsetY - bobY) ** 2);
  if (distance < ball.radius) {
    canvas.style.cursor = 'grab';
  } else {
    canvas.style.cursor = 'default';
  }
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
});

function animate() {
  clearCanvas();
  drawPendulum();
  updatePendulum();
  requestAnimationFrame(animate);
}

animate();
