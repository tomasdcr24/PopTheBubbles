import { randomInt } from "./utils/random.js";
import Bubble from "./helpers/bubble.js";

const ASPECT_RATIO = screen.width / screen.height;
const MAX_BUBBLES = 20;
const MIN_RADIUS = 20;
const MAX_RADIUS = 40;
const BUBBLE_COLOR = "Azure";
const BUBBLE_SPEED = 0.2;
const CLICKS_TO_POP = 1;
const SPAWN_TIME = 400;

var bubbles = [];
var popCount = 0;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
window.addEventListener("click", clickBubble);

/* window.addEventListener("resize", resizeCanvas); */

/* function resizeCanvas() {
  draw();
} */

function clickBubble(event) {
  let clickX = event.clientX;
  let clickY = event.clientY;
  let currBubble = bubbles.length - 1;
  while (currBubble >= 0) {
    let bubX = bubbles[currBubble].x;
    let bubY = bubbles[currBubble].y;
    let bubRad = bubbles[currBubble].radius;
    let xDist = (bubX - clickX) * (bubX - clickX);
    let yDist = (bubY - clickY) * (bubY - clickY);
    let bubbleClicked = xDist + yDist <= bubRad * bubRad;
    if (bubbleClicked) {
      let popBubble = bubbles[currBubble].popBubble();
      if (popBubble) {
        bubbles.splice(currBubble, 1);
        document.getElementById("pop-count").innerText = ++popCount;
      }
    }
    currBubble--;
  }
}

function addBubble(x, y, radius, color, speed, clicksToPop) {
  if (bubbles.length < MAX_BUBBLES) {
    if (arguments.length === 0) {
      x = randomInt(canvas.width / 10, (canvas.width * 9) / 10);
      y = randomInt(canvas.height / 10, (canvas.height * 9) / 10);
      radius = randomInt(MIN_RADIUS, MAX_RADIUS);
      color = BUBBLE_COLOR;
      speed = BUBBLE_SPEED;
      clicksToPop = CLICKS_TO_POP;
    }
    bubbles.push(new Bubble(x, y, radius, color, speed, clicksToPop));
  }
}

function drawBubbles(width, height) {
  let currBubble = 0;
  let numBubbles = bubbles.length;

  while (currBubble < numBubbles) {
    //TODO fix bubble to make it look better
    let { x, y, radius, color } = bubbles[currBubble];
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    let gradient = ctx.createRadialGradient(
      x - radius * 0.55,
      y - radius * 0.55,
      radius / 8,
      x - radius * 0.55,
      y - radius * 0.55,
      radius / 10
    );
    gradient.addColorStop(0, "#ffffff20");
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, "#ffffff90");
    ctx.fillStyle = gradient;

    ctx.fill();
    ctx.shadowBlur = 1;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowColor = color;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.globalAlpha = 1;
    bubbles[currBubble].updatePos(width, height);
    currBubble++;
  }
}

function draw() {
  let width = canvas.clientWidth;
  let height = canvas.clientHeight;
  /* if (width > height) width = height;
  else height = width; */
  canvas.width = width;
  canvas.height = height;
  ctx.clearRect(0, 0, width, height);
  drawBubbles(width, height);

  window.requestAnimationFrame(draw);
}

setInterval(addBubble, SPAWN_TIME);
draw();
