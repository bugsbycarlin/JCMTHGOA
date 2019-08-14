
var horse_colors = ["Brown", "DarkBrown", "Yellow", "Black"];

var horse_images = {};

var kick_sound_available = true;

for (var c = 0; c < horse_colors.length; c++) {
  var color = horse_colors[c];
  horse_images[color] = {};

  horse_images[color]["side_trot"] = [];
  for (var i = 1; i <= 21; i++) {
    horse_images[color]["side_trot"][i] = new Image();
    horse_images[color]["side_trot"][i].src = "Art/" + color + "Horse/side_trot_" + i + ".png";
  }

  horse_images[color]["front_trot"] = [];
  for (var i = 1; i <= 21; i++) {
    horse_images[color]["front_trot"][i] = new Image();
    horse_images[color]["front_trot"][i].src = "Art/" + color + "Horse/front_trot_" + i + ".png";
  }

  horse_images[color]["rear_trot"] = [];
  for (var i = 1; i <= 21; i++) {
    horse_images[color]["rear_trot"][i] = new Image();
    horse_images[color]["rear_trot"][i].src = "Art/" + color + "Horse/rear_trot_" + i + ".png";
  }

  horse_images[color]["back_kick"] = [];
  for (var i = 1; i <= 7; i++) {
    horse_images[color]["back_kick"][i] = new Image();
    horse_images[color]["back_kick"][i].src = "Art/" + color + "Horse/back_kick_" + i + ".png";
  }
}

var frown_image = new Image();
frown_image.src = "Art/Display/frown.png";

var home_image = new Image();
home_image.src = "Art/Display/home.png";

var heart_image = new Image();
heart_image.src = "Art/Display/heart.png";

var exclamation_mark_image = new Image();
exclamation_mark_image.src = "Art/Display/exclamation_mark.png";

var poop_images = [];
for (var i = 1; i <= 3; i++) {
  poop_images[i] = new Image();
  poop_images[i].src = "Art/Doodads/poop_" + i + ".png";
}

var horse_poop_rate = 1600; // higher is less often. 1600 is pretty good. 400 is great fun for testing.

var poop_drop_height = 40;

var panic_time = 108;

var kick_outer_range = 80;
var kick_inner_range = 30;
var kick_vertical_tolerance = 15;

class Poop {
  constructor(x, y, poop_scattering_adjustment, style) {
    this.context = canvas.getContext('2d');
    this.x = x;
    this.y = y;
    this.vy = 0;
    this.display_y = this.y - poop_scattering_adjustment - poop_drop_height;
    this.style = style;
    this.state = "fresh";
  }

  update() {
    if (this.display_y < this.y) {
      this.vy += 1;
      this.display_y += this.vy;
      if (this.display_y > this.y) {
        this.display_y = this.y;
        this.vy = 0;
      }
    }
  }

  render() {
    if (this.state === "fresh") {
      this.context.drawImage(poop_images[this.style], this.x - 8, this.display_y - 8);
    }
  }
}

class Horse {
  constructor(canvas, dude, x_pos, y_pos, waypoint) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.center_x = 50;
    this.center_y = 80;
    this.original_velocity = 2.5;
    this.velocity = 2.5;
    this.x_velocity = 0.0;
    this.y_velocity = 0.0;

    this.current_frame = 0;

    this.x_pos = x_pos;
    this.y_pos = y_pos;

    this.old_waypoint = waypoint;
    this.waypoint = waypoint;

    this.dude = dude;

    this.dude_nearby = false;
    this.running_home = 0;
    this.can_flip = true;
    this.startled = 0;
    this.musky = 0;

    this.color = horse_colors[Math.floor(Math.random() * horse_colors.length)];

    this.current_animation = "side_trot";

    this.effect_animation_portion = 0;

    this.waypoints_seen = 0;

    this.has_escaped = false;
  }

  update() {
    this.current_frame += 1;
    if (this.current_frame >= horse_images[this.color][this.current_animation].length) {
      this.current_frame = 1;

      if (this.current_animation === "back_kick") {
        this.current_animation = "side_trot";
        this.current_frame = 10;
      }
    }

    this.effect_animation_portion += 0.04;
    if (this.effect_animation_portion > 1) {
      this.effect_animation_portion = -0.25;
    }

    if (this.current_animation === "back_kick") {
      return;
    }

    if (this.startled > 0) {
      this.startled -= 1;
    }

    if (this.musky > 0) {
      this.musky -= 1;
    }

    if (this.dude.state === "running") {
      var kick = false;
      if (this.dude.direction === "right" 
        && this.x_velocity > 0 
        && this.dude.x_pos < this.x_pos - kick_inner_range
        && this.dude.x_pos > this.x_pos - kick_outer_range
        && Math.abs(this.dude.y_pos - this.y_pos + 10) < kick_vertical_tolerance) {
        kick = true;
        this.x_pos -= 30;
        this.dude.x_velocity = 1; // force velocity in case it hasn't caught up with direction
      } else if (this.dude.direction === "left" 
        && this.x_velocity < 0 
        && this.dude.x_pos > this.x_pos + kick_inner_range
        && this.dude.x_pos < this.x_pos + kick_outer_range
        && Math.abs(this.dude.y_pos - this.y_pos + 10) < kick_vertical_tolerance) {
        kick = true;
        this.x_pos += 30;
        this.dude.x_velocity = -1; // force velocity in case it hasn't caught up with direction
      }
      if (kick) {
        this.current_animation = "back_kick";
        this.current_frame = 1;
        this.dude.kickedFall();
        if (kick_sound_available) {
          kick_sound_available = false;
          $("#kick").trigger("play");
          $("#kick").bind("ended", function(){
            kick_sound_available = true;
          });
        }
        return;
      }
    }

    this.dude_nearby = false;
    if (insideEllipse(this.dude.x_pos, this.dude.y_pos, dude_range_x, dude_range_y, this.x_pos, this.y_pos)) {
      this.dude_nearby = true;
      if (this.running_home === 0) {
        this.running_home = panic_time;
      }
    }

    this.running_home -= 1;
    if (this.running_home < 0) {
      this.running_home = 0;
    }
    if (this.running_home < 26) {
      this.can_flip = true;
    }

    var w = map.waypoints[this.waypoint];
    var x_diff = Math.abs(this.x_pos - w.x);
    var y_diff = Math.abs(this.y_pos - w.y);

    // Reached waypoint. Get a new waypoint.
    if (distance(this.x_pos, this.y_pos, w.x, w.y) < 5) {
      this.waypoints_seen += 1;

      if (map.failure_waypoints.includes(this.waypoint)) {
        this.dude.fail();
      }

      this.old_waypoint = this.waypoint;

      this.velocity = this.original_velocity;

      // If we've never escaped, and we can, let's escape!
      if (this.has_escaped === false && this.old_waypoint === map.central_waypoint) {
        this.waypoint = map.escape_waypoints[Math.floor(Math.random() * map.escape_waypoints.length)];
        this.has_escaped = true;
      } else if (this.musky > 0) {
        if (map.success_waypoints.includes(w.home)) {
          this.waypoint = w.home;
        } else {
          // seek the dude
          var potential_waypoints = [];
          for (var i = 0; i < w.links.length; i++) {
            var point = w.links[i];
            var v_x = map.waypoints[point].x - map.waypoints[this.old_waypoint].x;
            var v_y = map.waypoints[point].y - map.waypoints[this.old_waypoint].y;
            var n_x = 10 * v_x / (v_x * v_x + v_y * v_y);
            var n_y = 10 * v_y / (v_x * v_x + v_y * v_y);
            if (distance(
              this.x_pos + n_x, 
              this.y_pos + n_y,
              this.dude.x_pos,
              this.dude.y_pos) < distance(this.x_pos, this.y_pos, this.dude.x_pos, this.dude.y_pos)) {
              potential_waypoints.push(point);
            }
          }
          
          if (potential_waypoints.length > 0) {
            this.waypoint = potential_waypoints[Math.floor(Math.random() * potential_waypoints.length)];
          } else {
            this.waypoint = w.links[Math.floor(Math.random() * w.links.length)];
          }
        }
      } else if (!map.success_waypoints.includes(this.waypoint) && this.running_home > 0) {
        // Look for the waypoint that lets you escape the dude

        // all the waypoints that take you away from the dude
        var potential_waypoints = [];
        for (var i = 0; i < w.links.length; i++) {
          var point = w.links[i];
          var v_x = map.waypoints[point].x - map.waypoints[this.old_waypoint].x;
          var v_y = map.waypoints[point].y - map.waypoints[this.old_waypoint].y;
          var n_x = 10 * v_x / (v_x * v_x + v_y * v_y);
          var n_y = 10 * v_y / (v_x * v_x + v_y * v_y);
          if (distance(
            this.x_pos + n_x, 
            this.y_pos + n_y,
            this.dude.x_pos,
            this.dude.y_pos) > distance(this.x_pos, this.y_pos, this.dude.x_pos, this.dude.y_pos)) {
            potential_waypoints.push(point);
          }
        }
        
        if (potential_waypoints.length > 0) {
          this.waypoint = potential_waypoints[Math.floor(Math.random() * potential_waypoints.length)];
        } else {
          this.waypoint = w.links[Math.floor(Math.random() * w.links.length)];
        }

        // If the dude's not actually nearby, run home
        if (this.dude_nearby === false && !map.success_waypoints.includes(this.waypoint)) {
          this.waypoint = w.home;
        }

        // If the home waypoint is available, take this, highest priority
        if (map.success_waypoints.includes(w.home)) {
          this.waypoint = w.home;
        }
      } else {
        // Here we can just choose a random waypoint. Note that home is never one of the options.
        this.waypoint = w.links[Math.floor(Math.random() * w.links.length)];
      }
    }

    // Oh heck, the dude. I'm going to turn around.
    if (this.dude_nearby && this.can_flip) {
      var x_to_dude = Math.abs(this.x_pos - this.dude.x_pos);
      var y_to_dude = Math.abs(this.y_pos - this.dude.y_pos);
      var x_test_velocity = 0;
      var y_test_velocity = 0;
      if (y_to_dude > x_to_dude) {
        y_test_velocity = this.y_velocity;
      } else {
        x_test_velocity = this.x_velocity;
      }

      if (distance(
        this.x_pos + x_test_velocity, 
        this.y_pos + y_test_velocity,
        this.dude.x_pos,
        this.dude.y_pos) < distance(this.x_pos, this.y_pos, this.dude.x_pos, this.dude.y_pos)
        && !map.success_waypoints.includes(this.waypoint)) {
        this.temp = this.waypoint;
        this.waypoint = this.old_waypoint;
        this.old_waypoint = this.temp;
        this.can_flip = false;
        this.running_home = panic_time;
      }
    }

    if (x_diff > y_diff) {
      this.y_velocity = 0.0;
      this.y_pos = 0.9 * this.y_pos + 0.1 * w.y;
      if (this.x_pos > w.x) {
        this.x_velocity = -1 * this.velocity;
      } else {
        this.x_velocity = this.velocity;
      }
      this.current_animation = "side_trot";
      this.center_x = 50;
    } else if (y_diff > x_diff) {
      this.x_velocity = 0.0;
      this.x_pos = 0.9 * this.x_pos + 0.1 * w.x;
      if (this.y_pos > w.y) {
        this.y_velocity = -1 * this.velocity;
        this.current_animation = "rear_trot";
        this.center_x = 24;
      } else {
        this.y_velocity = this.velocity;
        this.current_animation = "front_trot";
        this.center_x = 14;
      }
    }

    this.x_pos += this.x_velocity;
    this.y_pos += this.y_velocity;
  }

  maybePoop(poops) {
    if (horse_poop_rate * Math.random() < 5 || (this.startled > 0 && 100 * Math.random() < 10)) {
      // make a poop!
      if (this.current_animation === "side_trot") {
        var butt_adjustment = -20;
        if (this.x_velocity < 0) {
          butt_adjustment = 20;
        }
        var poop_scattering_adjustment = -10 + Math.floor(Math.random() * 20 + 1);
        poops.push(new Poop(this.x_pos + butt_adjustment, this.y_pos + poop_scattering_adjustment, poop_scattering_adjustment, Math.floor((Math.random() * 3) + 1)));
      }
    }
  }

  renderEffect() {
    if (this.effect_animation_portion < 0) {
      return;
    }

    context.globalAlpha = 1.0 - this.effect_animation_portion;
    this.context.beginPath();
    this.context.lineWidth = "3";
    this.context.strokeStyle = "red";
    //this.context.arc(100, 75, 50, 0, 2 * Math.PI);
    this.context.ellipse(
      this.x_pos, this.y_pos,
      200 * this.effect_animation_portion, 100 * this.effect_animation_portion,
      0, 0, 2 * Math.PI);
    this.context.stroke();
    context.globalAlpha = 1.0;
    this.context.strokeStyle = "black";
    //void ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle [, anticlockwise]);
  }

  render() {
    this.context.save();
    this.context.translate(this.x_pos, this.y_pos);
    if (this.x_velocity < 0) {
      this.context.scale(-1, 1);
    }
    this.context.drawImage(horse_images[this.color][this.current_animation][this.current_frame], -this.center_x, -this.center_y);
    
    if (!map.success_waypoints.includes(this.old_waypoint)) {
      var emotion_bubble_adjustment = 0;
      if (this.current_animation === "front_trot") emotion_bubble_adjustment = 0;
      if (this.current_animation === "rear_trot") emotion_bubble_adjustment = 9;
      if (this.current_animation === "side_trot") emotion_bubble_adjustment = 92;
      if (this.startled > 0) {
        this.context.drawImage(exclamation_mark_image, -this.center_x + emotion_bubble_adjustment, -this.center_y - 35)
      } else if (this.musky > 0) {
        this.context.drawImage(heart_image, -this.center_x + emotion_bubble_adjustment, -this.center_y - 35)
      } else if (this.running_home > 0 && !this.dude_nearby) {
        this.context.drawImage(home_image, -this.center_x + emotion_bubble_adjustment, -this.center_y - 35)
      } else if (this.dude_nearby) {
        this.context.drawImage(frown_image, -this.center_x + emotion_bubble_adjustment, -this.center_y - 35)
      }
    }

    this.context.restore();

    // debug render location
    // this.context.beginPath();
    // this.context.arc(
    //   this.x_pos, this.y_pos - 10, 5,
    //   0, 2 * Math.PI);
    // this.context.stroke();
  }
}

