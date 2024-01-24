import { randomFloat } from "./utils/random.js";
import Bubble from "./objects/bubble.js";
import PoppingBubble from "./objects/poppingBubble.js";

const ASPECT_RATIO = 1; //screen.width / screen.height;
const MAX_BUBBLES = 20;
const MIN_RADIUS = 0.05;
const MAX_RADIUS = 0.1;
const BUBBLE_COLOR = "Azure";
const MIN_SPEED = 0.1;
const MAX_SPEED = 0.2;
const SPAWN_TIME = 300;

var bubbles = [];
var poppingBubbles = [];
var popCount = 0;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var overlay = document.getElementById("overlay");
canvas.style.setProperty("--r", ASPECT_RATIO);

window.addEventListener("click", clickBubble);

window.addEventListener("resize", resizeCanvas);

function repositionOverlay() {
  overlay.style.setProperty(
    "--right",
    "calc(" + canvas.offsetLeft + "px" + " + 0.25em)"
  );
  overlay.style.setProperty(
    "--top",
    "calc(" + canvas.offsetTop + "px" + " + 0.25em)"
  );
}

repositionOverlay();

function resizeCanvas() {
  repositionOverlay();
}

// handle bubble popping when clicked
function clickBubble(event) {
  let clickX = (event.clientX - canvas.offsetLeft) / canvas.width;
  let clickY = (event.clientY - canvas.offsetTop) / canvas.height;
  let currBubble = bubbles.length - 1;
  while (currBubble >= 0) {
    let bubX = bubbles[currBubble].x;
    let bubY = bubbles[currBubble].y;
    let bubRad = bubbles[currBubble].radius;
    let xDist = (bubX - clickX) * (bubX - clickX);
    let yDist = (bubY - clickY) * (bubY - clickY);
    let bubbleClicked = xDist + yDist <= bubRad * bubRad;
    if (bubbleClicked) {
      poppingBubbles.push(new PoppingBubble(bubX, bubY, bubRad));
      bubbles.splice(currBubble, 1);
      overlay.innerText = ++popCount;
    }
    currBubble--;
  }
}

// create bubble and add it to bubbles array
function addBubble(x, y, radius, color, x_speed, y_speed) {
  if (bubbles.length < MAX_BUBBLES) {
    if (arguments.length === 0) {
      radius = randomFloat(MIN_RADIUS, MAX_RADIUS);
      x = randomFloat(radius + 0.05, 1 - radius - 0.05);
      y = randomFloat(radius + 0.05, 1 - radius - 0.05);
      color = BUBBLE_COLOR;
      x_speed = randomFloat(MIN_SPEED, MAX_SPEED) / canvas.width;
      y_speed = randomFloat(MIN_SPEED, MAX_SPEED) / canvas.height;
    }
    bubbles.push(new Bubble(x, y, radius, color, x_speed, y_speed));
  }
}

// draw bubbles on screen
function drawBubbles(width, height) {
  let currBubble = 0;
  let numBubbles = bubbles.length;

  while (currBubble < numBubbles) {
    let { x, y, radius, color } = bubbles[currBubble];

    //outline
    ctx.shadowBlur = 1;
    ctx.shadowColor = color;
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = (radius * Math.max(width, height)) / 50;

    //gradient for coloring
    const grd = ctx.createLinearGradient(
      (x - radius) * width,
      (y - radius) * height,

      (x - radius / -1) * width,
      (y - radius / -1) * height
    );
    grd.addColorStop(0, "white");
    grd.addColorStop(0.5, color);
    grd.addColorStop(1, "grey");

    // bubble
    ctx.beginPath();
    ctx.arc(
      x * width,
      y * height,
      radius * Math.max(width, height),
      0,
      Math.PI * 2
    );
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.stroke();

    //bubble small ball detail
    ctx.beginPath();
    ctx.arc(
      (x - radius / 1.4) * width,
      (y - radius / 4) * height,
      (radius * Math.max(width, height)) / 15,
      0,
      Math.PI * 2
    );
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();

    //bubble small ellipse detail
    ctx.beginPath();
    ctx.ellipse(
      (x - radius / 2.2) * width,
      (y - radius / 1.6) * height,
      (radius * Math.max(width, height)) / 8,
      (radius * Math.max(width, height)) / 4,
      Math.PI / 4,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.stroke();

    bubbles[currBubble].updatePos();
    currBubble++;
  }
}

// draw bubbles popping on screen
function drawPoppingBubbles(width, height) {
  let currBubble = 0;
  let numBubbles = poppingBubbles.length;
  let cleanUpBubbles = [];

  while (currBubble < numBubbles) {
    let { x, y, radius } = poppingBubbles[currBubble];

    const grd = ctx.createRadialGradient(
      x * width,
      y * height,
      (radius * Math.max(width, height)) / 10,
      x * width,
      y * height,
      radius * Math.max(width, height) * 10
    );
    grd.addColorStop(0, "transparent");
    grd.addColorStop(1, "black");

    ctx.fillStyle = grd;
    ctx.moveTo(x, y);
    ctx.beginPath();
    ctx.arc(
      x * width,
      y * height,
      radius * Math.max(width, height),
      0,
      Math.PI * 2
    );

    ctx.fill();

    if (poppingBubbles[currBubble].pop()) {
      cleanUpBubbles.push(currBubble);
    }
    currBubble++;
  }

  cleanUpBubbles.forEach((bubPos) => poppingBubbles.splice(bubPos, 1));
}

//draw canvas and elements
function draw() {
  let width = canvas.clientWidth;
  let height = canvas.clientHeight;
  canvas.width = width;
  canvas.height = height;
  ctx.clearRect(0, 0, width, height);
  drawBubbles(width, height);
  drawPoppingBubbles(width, height);
  window.requestAnimationFrame(draw);
}

setInterval(addBubble, SPAWN_TIME);
draw();
