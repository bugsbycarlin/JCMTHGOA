
class Waypoint {
  constructor(x, y, links, home) {
    this.x = x;
    this.y = y;
    this.links = links;
    this.home = home;
  }
}

var waypoints = {};
waypoints[0] = new Waypoint(207,177, [1,9], 1);
waypoints[1] = new Waypoint(343,177, [0,10], 10);
waypoints[2] = new Waypoint(449,177, [3,11], 3);
waypoints[3] = new Waypoint(563,177, [2,4,12], 12);
waypoints[4] = new Waypoint(968,177, [3,5,15], 15);
waypoints[5] = new Waypoint(1073,177, [4,6,40], 4);
waypoints[6] = new Waypoint(1181,177, [5,7,41], 5);
waypoints[7] = new Waypoint(1286,177, [6,8,42], 6);
waypoints[8] = new Waypoint(1399,177, [7,43], 7);

waypoints[9] = new Waypoint(207,304, [0,10,16], 10);
waypoints[10] = new Waypoint(343,304, [1,9,11], 11);
waypoints[11] = new Waypoint(449,304, [10,2,19], 2);

waypoints[12] = new Waypoint(563,270, [3,13], 13);
waypoints[13] = new Waypoint(668,270, [12,21], 21);
waypoints[14] = new Waypoint(870,270, [23,15], 23);
waypoints[15] = new Waypoint(968,270, [14,4], 14);

waypoints[16] = new Waypoint(207,403, [9,17], 9);
waypoints[17] = new Waypoint(267,403, [16,26], 16);
waypoints[18] = new Waypoint(373,403, [27,19], 19);
waypoints[19] = new Waypoint(449,403, [18,11], 11);

waypoints[20] = new Waypoint(563,372, [21,28], 21);
waypoints[21] = new Waypoint(668,372, [20,22,13], 22);
waypoints[22] = new Waypoint(760,372, [21,23], 45); // special
waypoints[23] = new Waypoint(870,372, [22,24,14], 22);
waypoints[24] = new Waypoint(968,372, [23,34], 23);

waypoints[25] = new Waypoint(207,500, [26,29], 29);
waypoints[26] = new Waypoint(267,500, [25,17], 25);
waypoints[27] = new Waypoint(373,500, [28,18,30], 28);
waypoints[28] = new Waypoint(563,500, [27,20,32], 32);

waypoints[29] = new Waypoint(207,592, [30,25,36], 30);
waypoints[30] = new Waypoint(363,592, [27,29,31,37], 27);
waypoints[31] = new Waypoint(449,592, [30,38], 30);

waypoints[32] = new Waypoint(563,658, [28,33], 33);
waypoints[33] = new Waypoint(760,658, [32,34], 45); // special
waypoints[34] = new Waypoint(968,658, [33,24,39], 33);

waypoints[35] = new Waypoint(-100,724, [35], 35); // special
waypoints[36] = new Waypoint(207,724, [35,37,29], 37);
waypoints[37] = new Waypoint(349,724, [36,30], 30);
waypoints[38] = new Waypoint(449,724, [31,39], 39);
waypoints[39] = new Waypoint(968,724, [38,34], 34);
waypoints[40] = new Waypoint(1073,724, [41,5], 5);
waypoints[41] = new Waypoint(1181,724, [40,42,6], 40);
waypoints[42] = new Waypoint(1286,724, [41,43,7], 41);
waypoints[43] = new Waypoint(1399,724, [42,8], 42);

waypoints[44] = new Waypoint(668,500, [45, 47, 48], 45);
waypoints[45] = new Waypoint(760,500, [44, 46], 44); // special
waypoints[46] = new Waypoint(870,500, [45, 49, 50], 45);
waypoints[47] = new Waypoint(668,460, [44], 44);
waypoints[48] = new Waypoint(668,540, [44], 44);
waypoints[49] = new Waypoint(870,460, [46], 46);
waypoints[50] = new Waypoint(870,540, [46], 46);

class Map {
  constructor() {
    
  this.tiles = [
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "x--------x--------------------------------------x",
    "x--------x--------------------------------------x",
    "x---xx---x---x---xxxxxxxxxxxx---x---x---x---x---x",
    "x---xx---x---x-------x--x-------x---x---x---x---x",
    "x------------x-------x--x-------x---x---x---x---x",
    "x------------xxxxx---xxxx----xxxx---x---x---x---x",
    "x---xxxxxx---x------------------x---x---x---x---x",
    "x-----x------x------------------x---x---x---x---x",
    "x-----x------x---xxxx    xxxx---x---x---x---x---x",
    "xxx---x---xxxx---x          x---x---x---x---x---x",
    "x-----x----------x          x---x---x---x---x---x",
    "x-----x----------x          x---x---x---x---x---x",
    "x---xxx---xxxx---x          x---x---x---x---x---x",
    "x------------x---xxxx    xxxx---x---x---x---x---x",
    "x------------x------------------x---x---x---x---x",
    "x---xx---x---x------------------x---x---x---x---x",
    "x---xx---x---xxxxxxxxxxxxxxxx---x---x---x---x---x",
    "---------x----------------------x---------------x",
    "---------x----------------------x---------------x",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  ];


  this.x = 150;
  this.y = 100;
  this.x_spacing = 27;
  this.y_spacing = 32;
  }

  bump(x, y, half_width, half_height) {
    var x1 = x - this.x - half_width + 13; // the posts are skewed
    var x2 = x - this.x + half_width;
    var y1 = y - this.y - half_height;
    var y2 = y - this.y + half_height;

    var pairs = [[x1, y1], [x1, y2], [x2, y1], [x2, y2]];

    for (var i = 0; i < 4; i++) {
      var index_x = Math.floor(pairs[i][0] / this.x_spacing);
      var index_y = Math.floor(pairs[i][1] / this.y_spacing);

      if (index_x >= 0 && index_x < this.tiles[0].length && index_y >= 0 && index_y < this.tiles.length) {
        if (this.tiles[index_y][index_x] === "x") {
          return true;
        }
      }
    }

    return false;
  }
}

