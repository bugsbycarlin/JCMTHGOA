
//shadow = new Image();
//shadow.src = "Art/Dude/shadow.png";

center_x = {};
center_y = {};

var dude_images = {};
dude_images["sideways_run"] = [];
for (var i = 1; i <= 32; i++) {
  dude_images["sideways_run"][i] = new Image();
  dude_images["sideways_run"][i].src = "Art/Dude/sideways_run_" + i + ".png";
}
center_x["sideways_run"] = 25;
center_y["sideways_run"] = 80;

dude_images["static"] = [];
for (var i = 1; i <= 20; i++) {
  dude_images["static"][3 * i - 2] = new Image();
  dude_images["static"][3 * i - 2].src = "Art/Dude/static_" + i + ".png";
  dude_images["static"][3 * i - 1] = new Image();
  dude_images["static"][3 * i - 1].src = "Art/Dude/static_" + i + ".png";
  dude_images["static"][3 * i] = new Image();
  dude_images["static"][3 * i].src = "Art/Dude/static_" + i + ".png";
}
center_x["static"] = 25;
center_y["static"] = 80;

dude_images["sad"] = [];
for (var i = 1; i <= 50; i++) {
  dude_images["sad"][i] = new Image();
  dude_images["sad"][i].src = "Art/Dude/sad_" + i + ".png";
}
center_x["sad"] = 25;
center_y["sad"] = 80;

dude_images["crap_surprise"] = [];
for (var i = 1; i <= 50; i++) {
  dude_images["crap_surprise"][i] = new Image();
  dude_images["crap_surprise"][i].src = "Art/Dude/crap_surprise_" + i + ".png";
}
center_x["crap_surprise"] = 37;
center_y["crap_surprise"] = 90;

dude_range_x = 200;
dude_range_y = 120;

class Dude {
  constructor(canvas, map, x_pos, y_pos) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.half_width = 18;
    this.half_height = 0;
    this.velocity = 3.2;
    this.x_velocity = 0.0;
    this.y_velocity = 0.0;

    this.effect_animation_portion = 0;

    this.x_pos = x_pos;
    this.y_pos = y_pos;

    this.current_frame = 1;

    this.direction = "right";

    this.map = map;

    this.current_animation = "sideways_run";

    this.state = "running";
  }

  fail() {
    if (this.state != "failed") {
      this.state = "failed";
      this.current_frame = 1;
      this.current_animation = "sad";
    }
  }

  stepInCrap() {
    if (this.state != "crap") {
      this.state = "crap";
      this.current_frame = 1;
      this.current_animation = "crap_surprise";
    }
  }

  update() {
    this.current_frame += 1;
    if (this.current_frame >= dude_images[this.current_animation].length) {
      if (this.state === "failed") {
        this.current_frame -= 1;
      }
      else {
        this.current_frame = 1;

        if (this.state === "crap") {
          this.state = "running";
          this.current_animation = "sideways_run";
          this.current_frame = 10;
        }
      }
    }

    if (this.state === "failed") {
      return;
    }

    this.effect_animation_portion += 0.02;
    if (this.effect_animation_portion > 1) {
      this.effect_animation_portion = -0.25;
    }

    if (this.state === "crap") {
      return;
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
      if (this.state === "stopped") {
        this.state = "running";
        this.current_animation = "sideways_run";
        this.current_frame = 10;
      }
    } else {
      if (this.state != "stopped") {
        this.current_animation = "static";
        this.current_frame = 3;
        this.state = "stopped";
      }
    }
  }

  renderEffect() {
    if (this.state === "failed" || this.effect_animation_portion < 0) {
      return;
    }
    context.globalAlpha = 1.0 - this.effect_animation_portion;
    this.context.beginPath();
    //this.context.arc(100, 75, 50, 0, 2 * Math.PI);
    this.context.ellipse(
      this.x_pos, this.y_pos,
      dude_range_x * this.effect_animation_portion, dude_range_y * this.effect_animation_portion,
      0, 0, 2 * Math.PI);
    this.context.stroke();
    context.globalAlpha = 1.0;
    //void ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle [, anticlockwise]);
  }

  render() {
    var running_offset = 0;
    if (this.current_animation === "sideways_run") {
      var t = ((this.current_frame + 8) % 16);
      running_offset = 0.25 * (-0.5 * t * t + 8 * t);
    }
    this.context.save();
    this.context.translate(this.x_pos, this.y_pos - running_offset);
    if (this.x_velocity < 0) {
      this.context.scale(-1, 1);
    }
    // this.context.globalAlpha = 0.2;
    // this.context.drawImage(shadow, -18, -10);
    // this.context.globalAlpha = 1.0;
    this.context.drawImage(dude_images[this.current_animation][this.current_frame], -center_x[this.current_animation], -center_y[this.current_animation]);
    this.context.restore();
  }

  getZIndex() {
    return this.y_pos;
  }
}

