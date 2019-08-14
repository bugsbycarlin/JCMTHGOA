
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

dude_images["celebration"] = [];
for (var i = 1; i <= 7; i++) {
  dude_images["celebration"][i] = new Image();
  dude_images["celebration"][i].src = "Art/Dude/celebration_" + i + ".png";
}
center_x["celebration"] = 25;
center_y["celebration"] = 110;

dude_images["kicked_fall"] = [];
for (var i = 1; i <= 22; i++) {
  dude_images["kicked_fall"][i] = new Image();
  dude_images["kicked_fall"][i].src = "Art/Dude/kicked_fall_" + i + ".png";
}
for (var i = 23; i <= 84; i++) {
  dude_images["kicked_fall"][i] = dude_images["kicked_fall"][22];
}
center_x["kicked_fall"] = 147;
center_y["kicked_fall"] = 80;

var dust_cloud_image = new Image();
dust_cloud_image.src = "Art/Display/dust_cloud.png";
var dust_cloud_x = 0;
var dust_cloud_y = 0;
var dust_cloud_direction = "left";
var dust_cloud_ttl = -1;
var dust_cloud_speed = 2;

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
      $("#i_give_up").trigger("play");
    }
  }

  succeed() {
    if (this.state != "succeeded") {
      this.state = "succeeded";
      this.current_frame = 1;
      this.current_animation = "celebration";
      $("#well_alright").trigger("play");
    }
  }

  stepInCrap() {
    if (this.state != "crap") {
      this.state = "crap";
      this.current_frame = 1;
      this.current_animation = "crap_surprise";
    }
  }

  kickedFall() {
    if (this.state != "kicked_fall") {
      this.state = "kicked_fall";
      this.current_frame = 1;
      this.current_animation = "kicked_fall";
    }
  }

  reverseCloud(old_direction) {
    if (old_direction === "up" || old_direction === "down") {
      return;
    }
    dust_cloud_x = this.x_pos;
    dust_cloud_y = this.y_pos - 12;
    dust_cloud_direction = old_direction;
    dust_cloud_ttl = 12;

  }

  update() {
    this.current_frame += 1;
    if (this.current_frame >= dude_images[this.current_animation].length) {
      if (this.state === "failed" || this.state === "succeeded") {
        this.current_frame -= 1;
      }
      else {
        this.current_frame = 1;

        if (this.state === "crap") {
          this.state = "running";
          this.current_animation = "sideways_run";
          this.current_frame = 10;
        }

        if (this.state == "kicked_fall") {
          this.state = "running";
          this.current_animation = "sideways_run";
          this.current_frame = 10;
          if (this.direction == "right") {
            this.x_pos -= 70;
            while (map.bump(this.x_pos + this.x_velocity, this.y_pos + this.y_velocity, this.half_width, this.half_height)) {
              this.x_pos -= 10;
            }
          } else {
            this.x_pos += 70;
            while (map.bump(this.x_pos + this.x_velocity, this.y_pos + this.y_velocity, this.half_width, this.half_height)) {
              this.x_pos += 10;
            }
          }
        }
      }
    }

    if (dust_cloud_ttl >= 0) {
      dust_cloud_ttl -= 1;
      if (dust_cloud_direction === "left") {
        dust_cloud_x -= dust_cloud_speed;
      } else if (dust_cloud_direction === "right") {
        dust_cloud_x += dust_cloud_speed;
      } else if (dust_cloud_direction === "up") {
        dust_cloud_y -= dust_cloud_speed;
      } else if (dust_cloud_direction === "down") {
        dust_cloud_y += dust_cloud_speed;
      }
      dust_cloud_ttl -= 1;
    }

    if (this.state === "failed" || this.state === "succeeded") {
      return;
    }

    this.effect_animation_portion += 0.02;
    if (this.effect_animation_portion > 1) {
      this.effect_animation_portion = -0.25;
    }

    if (this.state === "crap" || this.state === "kicked_fall") {
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
    if (this.state === "failed" || this.state === "succeeded" || this.state === "kicked_fall" || this.effect_animation_portion < 0) {
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
    if (dust_cloud_ttl >= 0) {
      this.context.drawImage(dust_cloud_image, dust_cloud_x, dust_cloud_y);
    }

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

    // debug render location
    // this.context.beginPath();
    // this.context.arc(
    //   this.x_pos, this.y_pos, 5,
    //   0, 2 * Math.PI);
    // this.context.stroke();
  }

  getZIndex() {
    return this.y_pos;
  }
}

