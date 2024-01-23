const BUBBLE_GROWTH = 200;

class Bubble {
  constructor(x, y, radius, color, x_speed, y_speed) {
    this.state = 0;
    this.x = x;
    this.y = y;
    this.maxRadius = radius;
    this.radius = radius / BUBBLE_GROWTH;
    this.color = color;
    this.x_speed = x_speed;
    this.y_speed = y_speed;
    this.direction = Math.random() * Math.PI * 2;
  }

  updatePos() {
    //update x and y positions
    this.x += Math.cos(this.direction) * this.x_speed;
    this.y += Math.sin(this.direction) * this.y_speed;

    // grow bubble if in growth state
    if (this.state === 0) {
      if (this.radius >= this.maxRadius) this.state === 1;
      else this.radius += this.maxRadius / BUBBLE_GROWTH;
    }

    // check for left collision
    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.direction = Math.atan2(
        Math.sin(this.direction),
        Math.cos(this.direction) * -1
      );
      // check for right collision
    } else if (this.x + this.radius > 1) {
      this.x = 1 - this.radius;
      this.direction = Math.atan2(
        Math.sin(this.direction),
        Math.cos(this.direction) * -1
      );
    }
    // check for top collision
    if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.direction = Math.atan2(
        Math.sin(this.direction) * -1,
        Math.cos(this.direction)
      );
      // check for bottom collision
    } else if (this.y + this.radius > 1) {
      this.y = 1 - this.radius;
      this.direction = Math.atan2(
        Math.sin(this.direction) * -1,
        Math.cos(this.direction)
      );
    }
  }

  popBubble() {
    return true;
  }
}

export default Bubble;
