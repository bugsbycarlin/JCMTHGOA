
var dudeImages = [];
dudeImages[0] = new Image();
dudeImages[0].src = "Art/Dude/placeholder.png";

class Dude {
  constructor(canvas, map, x_pos, y_pos) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.center_x = 22;
    this.center_y = 12;
    this.half_width = 18;
    this.half_height = 6;
    this.velocity = 5.0;
    this.x_velocity = 0.0;
    this.y_velocity = 0.0;

    this.total_frames = 0;
    this.current_frame = 0;

    this.x_pos = x_pos;
    this.y_pos = y_pos;

    //this.old_waypoint = -1;
    //this.waypoint = 33;

    this.direction = "right";

    this.map = map;
  }

  update() {
    this.current_frame += 1;
    if (this.current_frame > this.total_frames) {
      this.current_frame = 0;
    }

    if (this.direction === "right") {
      this.x_velocity = this.velocity;
      this.y_velocity = 0;
    } else if (this.direction === "left") {
      this.x_velocity = -this.velocity;
      this.y_velocity = 0;
    } else if (this.direction === "up") {
      this.y_velocity = -this.velocity;
      this.x_velocity = 0;
    } else if (this.direction === "down") {
      this.y_velocity = this.velocity;
      this.x_velocity = 0;
    }

    if (!map.bump(this.x_pos + this.x_velocity, this.y_pos + this.y_velocity, this.half_width, this.half_height)) {
      this.x_pos += this.x_velocity;
      this.y_pos += this.y_velocity;
    }
  }

  render() {
    this.context.save();
    this.context.translate(this.x_pos, this.y_pos);
    if (this.x_velocity < 0) {
      this.context.scale(-1, 1);
    }
    this.context.drawImage(dudeImages[this.current_frame], -this.center_x, -this.center_y);
    this.context.restore();
  }

  getZIndex() {
    return this.y_pos - this.center_y;
  }
}

