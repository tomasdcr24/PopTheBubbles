const POP_SPEED = 0.005;
const MAX_RADIUS = 1.2;

class PoppingBubble {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.maxRadius = radius * MAX_RADIUS;
    this.radius = radius;
  }

  pop() {
    if (this.radius < this.maxRadius) {
      this.radius += this.radius * POP_SPEED;
      return false;
    } else return true;
  }
}

export default PoppingBubble;
