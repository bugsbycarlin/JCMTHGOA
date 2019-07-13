
var trotImages = [];
for (var i = 1; i <= 21; i++) {
  trotImages[i] = new Image();
  trotImages[i].src = "Art/HorseSidewaysTrot/sideways_trot_" + i + ".png";
}

class Waypoint {
  constructor(x, y, links) {
    this.x = x;
    this.y = y;
    this.links = links;
  }
}

var Waypoints = {};
Waypoints[0] = new Waypoint(207,157, [1,9]);
Waypoints[1] = new Waypoint(343,157, [0,10]);
Waypoints[2] = new Waypoint(449,157, [3,11]);
Waypoints[3] = new Waypoint(563,157, [2,4,12]);
Waypoints[4] = new Waypoint(968,157, [3,5,15]);
Waypoints[5] = new Waypoint(1073,157, [4,6,40]);
Waypoints[6] = new Waypoint(1181,157, [5,7,41]);
Waypoints[7] = new Waypoint(1286,157, [6,8,42]);
Waypoints[8] = new Waypoint(1399,157, [7,43]);

Waypoints[9] = new Waypoint(207,284, [0,10,16]);
Waypoints[10] = new Waypoint(343,284, [1,9,11]);
Waypoints[11] = new Waypoint(449,284, [10,2,19]);

Waypoints[12] = new Waypoint(563,250, [3,13]);
Waypoints[13] = new Waypoint(668,250, [12,21]);
Waypoints[14] = new Waypoint(870,250, [23,15]);
Waypoints[15] = new Waypoint(968,250, [14,4]);

Waypoints[16] = new Waypoint(207,383, [9,17]);
Waypoints[17] = new Waypoint(267,383, [16,26]);
Waypoints[18] = new Waypoint(373,383, [27,19]);
Waypoints[19] = new Waypoint(449,383, [18,11]);

Waypoints[20] = new Waypoint(563,352, [21,28]);
Waypoints[21] = new Waypoint(668,352, [20,22,13]);
Waypoints[22] = new Waypoint(760,352, [21,23]); // special
Waypoints[23] = new Waypoint(870,352, [22,24,14]);
Waypoints[24] = new Waypoint(968,352, [23,34]);

Waypoints[25] = new Waypoint(207,480, [26,29]);
Waypoints[26] = new Waypoint(267,480, [25,17]);
Waypoints[27] = new Waypoint(373,480, [28,18,30]);
Waypoints[28] = new Waypoint(563,480, [27,20,32]);

Waypoints[29] = new Waypoint(207,572, [30,25,36]);
Waypoints[30] = new Waypoint(363,572, [27,29,31,37]);
Waypoints[31] = new Waypoint(449,572, [30,38]);

Waypoints[32] = new Waypoint(563,608, [28,33]);
Waypoints[33] = new Waypoint(760,608, [32,34]); // special
Waypoints[34] = new Waypoint(968,608, [33,24,39]);

Waypoints[35] = new Waypoint(50,704, [35]); // special
Waypoints[36] = new Waypoint(207,704, [35,37,29]);
Waypoints[37] = new Waypoint(349,704, [36,30]);
Waypoints[38] = new Waypoint(449,704, [31,39]);
Waypoints[39] = new Waypoint(968,704, [38,34]);
Waypoints[40] = new Waypoint(1073,704, [41,5]);
Waypoints[41] = new Waypoint(1181,704, [40,42,6]);
Waypoints[42] = new Waypoint(1286,704, [41,43,7]);
Waypoints[43] = new Waypoint(1399,704, [42,8]);

function debugRenderWaypoints(context) {
  console.log("in here");
  for (var i = 0; i <= 43; i++) {
    var w1 = Waypoints[i];
    for (var j = 0; j < w1.links.length; j++) {
      var w2 = Waypoints[w1.links[j]];
      //console.log(w1.x, w1.y, w2.x, w2.y);
      if (i > w1.links[j]) {
        context.lineWidth = 4;
      } else {
        context.lineWidth = 0;
      }
      context.beginPath();
      context.moveTo(w1.x, w1.y);
      context.lineTo(w2.x, w2.y);
      context.stroke();
    }
  }
}

class Horse {
  constructor(canvas, x_pos, y_pos) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.center_x = 50;
    this.center_y = 44;
    this.velocity = 2.5;
    this.x_velocity = 0.0;
    this.y_velocity = 0.0;

    this.total_frames = 21;
    this.current_frame = 0;

    this.x_pos = x_pos;
    this.y_pos = y_pos;

    this.old_waypoint = -1;
    this.waypoint = 33;
  }

  update() {
    this.current_frame += 1;
    if (this.current_frame > this.total_frames) {
      this.current_frame = 1;
    }

    var w = Waypoints[this.waypoint];
    var x_diff = Math.abs(this.x_pos - w.x);
    var y_diff = Math.abs(this.y_pos - w.y);
    if (Math.sqrt(x_diff*x_diff + y_diff*y_diff) < 5) {
      this.old_waypoint = this.waypoint;
      this.waypoint = w.links[Math.floor(Math.random() * w.links.length)];
    } else if (x_diff > y_diff) {
      this.y_velocity = 0.0;
      this.y_pos = 0.9 * this.y_pos + 0.1 * w.y;
      if (this.x_pos > w.x) {
        this.x_velocity = -1 * this.velocity;
      } else {
        this.x_velocity = this.velocity;
      }
    } else if (y_diff > x_diff) {
      this.x_velocity = 0.0;
      this.x_pos = 0.9 * this.x_pos + 0.1 * w.x;
      if (this.y_pos > w.y) {
        this.y_velocity = -1 * this.velocity;
      } else {
        this.y_velocity = this.velocity;
      }
    }

    // if (this.x_pos < 2 * this.center_x || this.x_pos > this.canvas.width - 2 * this.center_x) {
    //   this.x_velocity *= -1;
    // }

    this.x_pos += this.x_velocity;
    this.y_pos += this.y_velocity;
  }

  render() {
    this.context.save();
    this.context.translate(this.x_pos, this.y_pos);
    if (this.x_velocity < 0) {
      this.context.scale(-1, 1);
    }
    this.context.drawImage(trotImages[this.current_frame], -this.center_x, -this.center_y);
    this.context.restore();
  }

  getZIndex() {
    return this.y_pos - this.center_y;
  }
}

