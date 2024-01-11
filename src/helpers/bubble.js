class Bubble {
  constructor(x, y, radius, color, bubbleSpeed, clicksToPop) {
    this.state = 0;
    this.x = x;
    this.y = y;
    this.initialRadius = radius;
    this.radius = radius / 200;
    this.color = color;
    this.bubbleSpeed = bubbleSpeed;
    this.clicksToPop = clicksToPop;
    this.clicks = 0;
    this.direction = Math.random() * Math.PI * 2;
  }

  updatePos(width, height) {
    if (this.state === 0) {
      if (this.radius >= this.initialRadius) this.state === 1;
      else this.radius += this.initialRadius / 200;
    }
    this.x += Math.cos(this.direction) * this.bubbleSpeed;
    this.y += Math.sin(this.direction) * this.bubbleSpeed;
    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.direction = Math.atan2(
        Math.sin(this.direction),
        Math.cos(this.direction) * -1
      );
    } else if (this.x + this.radius > width) {
      this.x = width - this.radius;
      this.direction = Math.atan2(
        Math.sin(this.direction),
        Math.cos(this.direction) * -1
      );
    }
    if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.direction = Math.atan2(
        Math.sin(this.direction) * -1,
        Math.cos(this.direction)
      );
    } else if (this.y + this.radius > height) {
      this.y = height - this.radius;
      this.direction = Math.atan2(
        Math.sin(this.direction) * -1,
        Math.cos(this.direction)
      );
    }
  }

  //TODO rework after dedicing whether to keep multiple clicks
  popBubble() {
    if (++this.clicks < this.clicksToPop) {
      this.radius -= this.originalRadius / (this.clicksToPop * 2);
      return false;
    } else {
      return true;
    }
  }
}

export default Bubble;
