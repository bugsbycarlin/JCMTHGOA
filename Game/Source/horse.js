
var horse_colors = ["Brown", "DarkBrown", "Yellow", "Black"];

var horse_images = {};

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
}

var poop_images = [];
for (var i = 1; i <= 3; i++) {
  poop_images[i] = new Image();
  poop_images[i].src = "Art/Doodads/poop_" + i + ".png";
}

var horse_poop_rate = 1600; // higher is less often. 1600 is pretty good. 400 is great fun for testing.

var poop_drop_height = 40;

class Poop {
  constructor(x, y, poop_scattering_adjustment, style) {
    this.context = canvas.getContext('2d');
    this.x = x;
    this.y = y;
    this.vy = 0;
    this.display_y = this.y - poop_scattering_adjustment - poop_drop_height;
    this.style = style;
    this.status = "fresh";
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
    if (this.status == "fresh") {
      this.context.drawImage(poop_images[this.style], this.x - 8, this.display_y - 8);
    }
  }
}

class Horse {
  constructor(canvas, dude, x_pos, y_pos) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.center_x = 50;
    this.center_y = 80;
    this.original_velocity = 2.5;
    this.velocity = 2.5;
    this.x_velocity = 0.0;
    this.y_velocity = 0.0;

    this.total_frames = 21;
    this.current_frame = 0;

    this.x_pos = x_pos;
    this.y_pos = y_pos;

    this.old_waypoint = -1;
    this.waypoint = 33;

    this.dude = dude;

    this.color = horse_colors[Math.floor(Math.random() * horse_colors.length)];

    this.current_animation = "side_trot";
  }

  update() {
    this.current_frame += 1;
    if (this.current_frame > this.total_frames) {
      this.current_frame = 1;
    }

    var close_to_dude = false;
    if (distance(this.x_pos, this.y_pos, this.dude.x_pos, this.dude.y_pos) < 200) {
      close_to_dude = true;
    }

    var w = waypoints[this.waypoint];
    var x_diff = Math.abs(this.x_pos - w.x);
    var y_diff = Math.abs(this.y_pos - w.y);
    if (distance(this.x_pos, this.y_pos, w.x, w.y) < 5) {

      if (this.waypoint === 35) {
        this.dude.fail();
      }

      this.old_waypoint = this.waypoint;

      this.velocity = this.original_velocity;
      // if (!close_to_dude) {
      //   this.waypoint = w.links[Math.floor(Math.random() * w.links.length)];
      // } else {
      //   var dist = -1;
      //   //var home = waypoints[45];
      //   for (var i = 0; i < w.links.length; i++) {
      //     var w2 = waypoints[w.links[i]];
      //     if (distance(this.dude.x_pos, this.dude.y_pos, w2.x, w2.y) > dist) {
      //       dist = distance(this.dude.x_pos, this.dude.y_pos, w2.x, w2.y);
      //       this.waypoint = w.links[i];
      //     }
      //   }
      // }

      this.waypoint = w.links[Math.floor(Math.random() * w.links.length)];

      

      if (close_to_dude === true && this.waypoint < 44) {
        if (Math.floor(Math.random() * 100) < 50) {
          this.waypoint = w.home;
        }
      }

      // } && (this.old_waypoint === 22 || this.old_waypoint === 33)) {
      //   this.waypoint = 45;
      // }
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

    if (close_to_dude) {
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
        && this.waypoint < 44) {
        this.temp = this.waypoint;
        this.waypoint = this.old_waypoint;
        this.old_waypoint = this.temp;
        this.velocity = this.dude.velocity;
      }
    }

    this.x_pos += this.x_velocity;
    this.y_pos += this.y_velocity;
  }

  maybePoop(poops) {
    if (horse_poop_rate * Math.random() < 5) {
      // make a poop!
      if (this.current_animation == "side_trot") {
        var butt_adjustment = -20;
        if (this.x_velocity < 0) {
          butt_adjustment = 20;
        }
        var poop_scattering_adjustment = -10 + Math.floor(Math.random() * 20 + 1);
        poops.push(new Poop(this.x_pos + butt_adjustment, this.y_pos + poop_scattering_adjustment, poop_scattering_adjustment, Math.floor((Math.random() * 3) + 1)));
      }
    }
  }

  render() {
    this.context.save();
    this.context.translate(this.x_pos, this.y_pos);
    if (this.x_velocity < 0) {
      this.context.scale(-1, 1);
    }
    this.context.drawImage(horse_images[this.color][this.current_animation][this.current_frame], -this.center_x, -this.center_y);
    this.context.restore();
  }
}

