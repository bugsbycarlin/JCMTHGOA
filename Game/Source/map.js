
class Waypoint {
  constructor(x, y, links, home) {
    this.x = x;
    this.y = y;
    this.links = links;
    this.home = home;
  }
}

class Map {
  constructor() {
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
        if (this.tiles[index_y][index_x] === "x" || this.tiles[index_y][index_x] === "y") {
          return true;
        }
      }
    }

    return false;
  }
}


class Map_One extends Map {
  constructor() {
    super();
    this.tiles = [
      "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "------------------------------------------------x",
      "------------------------------------------------x",
      "x----------------------x------------------------x",
      "x----------------------x------------------------x",
      "x----------------------x------------------------x",
      "x----------------------x------------------------x",
      "x----------------------x------------------------x",
      "x----------------------x------------------------x",
      "------------------------------------------------x",
      "------------------------------------------------x",
      "x----------------------x------------------------x",
      "x----------------------x------------------------x",
      "x----------------------x------------------------x",
      "x----------------------x------------------------x",
      "x----------------------x-------------yyyy    yyyy",
      "x----------------------x-------------y          y",
      "-------------------------------------           y",
      "-------------------------------------           y",
      "-------------------------------------y          y",
      "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxyyyyyyyyyyyy",
    ];

    this.waypoints = {};

    this.waypoints[0] = new Waypoint(215,160, [1, 7, 35], 1);
    this.waypoints[1] = new Waypoint(360,160, [0, 8, 2], 8);
    this.waypoints[2] = new Waypoint(550,160, [1, 9, 3], 3);
    this.waypoints[3] = new Waypoint(720,160, [2, 10, 4], 10);
    this.waypoints[4] = new Waypoint(830,160, [3, 11, 5], 5);
    this.waypoints[5] = new Waypoint(1130,160, [4, 12, 6], 6);
    this.waypoints[6] = new Waypoint(1300,160, [5, 13], 13);

    this.waypoints[7] = new Waypoint(215,285, [0, 8, 14], 8);
    this.waypoints[8] = new Waypoint(360,285, [1, 7, 9, 15], 15);
    this.waypoints[9] = new Waypoint(550,285, [2, 8, 10, 16], 10);
    this.waypoints[10] = new Waypoint(720,285, [3, 9, 17], 17);
    this.waypoints[11] = new Waypoint(830,285, [4, 12, 18], 12);
    this.waypoints[12] = new Waypoint(1130,285, [11, 5, 13, 19], 19);
    this.waypoints[13] = new Waypoint(1300,285, [6, 12, 20], 20);

    this.waypoints[14] = new Waypoint(215,415, [7, 15, 21, 36], 15);
    this.waypoints[15] = new Waypoint(360,415, [8, 14, 16, 22], 22);
    this.waypoints[16] = new Waypoint(550,415, [9, 15, 17, 23], 17);
    this.waypoints[17] = new Waypoint(720,415, [18, 10, 16, 24], 18);
    this.waypoints[18] = new Waypoint(830,415, [17, 11, 25, 19], 19);
    this.waypoints[19] = new Waypoint(1130,415, [18, 12, 20, 26], 20);
    this.waypoints[20] = new Waypoint(1300,415, [13, 19, 27], 27);

    this.waypoints[21] = new Waypoint(215,555, [14, 28, 22], 22);
    this.waypoints[22] = new Waypoint(360,555, [21, 15, 29, 23], 29);
    this.waypoints[23] = new Waypoint(550,555, [22, 16, 24, 30], 24);
    this.waypoints[24] = new Waypoint(720,555, [17, 23, 31], 31);
    this.waypoints[25] = new Waypoint(830,555, [18, 32, 26], 32);
    this.waypoints[26] = new Waypoint(1130,555, [25, 27, 19], 27);
    this.waypoints[27] = new Waypoint(1300,555, [26, 20], 34);

    this.waypoints[28] = new Waypoint(215,670, [21, 29, 37], 29);
    this.waypoints[29] = new Waypoint(360,670, [28, 22, 30], 30);
    this.waypoints[30] = new Waypoint(550,670, [29, 23, 31], 31);
    this.waypoints[31] = new Waypoint(720,670, [30, 24, 32], 32);
    this.waypoints[32] = new Waypoint(830,670, [31, 25, 33], 33);
    this.waypoints[33] = new Waypoint(1130,670, [32, 26], 34);
    this.waypoints[34] = new Waypoint(1300,670, [38, 39], 38);

    this.waypoints[35] = new Waypoint(-100,160, [35], 35);
    this.waypoints[36] = new Waypoint(-100,415, [36], 36);
    this.waypoints[37] = new Waypoint(-100,670, [37], 37);

    this.waypoints[38] = new Waypoint(1200,670, [34], 34);
    this.waypoints[39] = new Waypoint(1400,670, [34, 40, 41], 34);
    this.waypoints[40] = new Waypoint(1400,620, [39], 39);
    this.waypoints[41] = new Waypoint(1400,720, [39], 39);

    this.central_waypoint = 34;
    this.escape_waypoints = [27, 33];
    this.success_waypoints = [38, 34, 39, 40, 41];
    this.failure_waypoints = [35, 36, 37];
    this.horse_start_waypoints = [38, 34, 39];

    this.x = 150;
    this.y = 100;
    this.x_spacing = 27;
    this.y_spacing = 32;

    this.num_horses = 10;

    this.map_number = 1;
  }
}

class Map_Two extends Map {
  constructor() {
    super();
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
      "x-----x------x---yyyy    yyyy---x---x---x---x---x",
      "xxx---x---xxxx---y          y---x---x---x---x---x",
      "x-----x----------y          y---x---x---x---x---x",
      "x-----x----------y          y---x---x---x---x---x",
      "x---xxx---xxxx---y          y---x---x---x---x---x",
      "x------------x---yyyy    yyyy---x---x---x---x---x",
      "x------------x------------------x---x---x---x---x",
      "x---xx---x---x------------------x---x---x---x---x",
      "x---xx---x---xxxxxxxxxxxxxxxx---x---x---x---x---x",
      "---------x----------------------x---------------x",
      "---------x----------------------x---------------x",
      "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    ];

    this.waypoints = {};
    this.waypoints[0] = new Waypoint(207,177, [1,9], 1);
    this.waypoints[1] = new Waypoint(343,177, [0,10], 10);
    this.waypoints[2] = new Waypoint(449,177, [3,11], 3);
    this.waypoints[3] = new Waypoint(563,177, [2,4,12], 12);
    this.waypoints[4] = new Waypoint(968,177, [3,5,15], 15);
    this.waypoints[5] = new Waypoint(1073,177, [4,6,40], 4);
    this.waypoints[6] = new Waypoint(1181,177, [5,7,41], 5);
    this.waypoints[7] = new Waypoint(1286,177, [6,8,42], 6);
    this.waypoints[8] = new Waypoint(1399,177, [7,43], 7);

    this.waypoints[9] = new Waypoint(207,304, [0,10,16], 10);
    this.waypoints[10] = new Waypoint(343,304, [1,9,11], 11);
    this.waypoints[11] = new Waypoint(449,304, [10,2,19], 2);

    this.waypoints[12] = new Waypoint(563,270, [3,13], 13);
    this.waypoints[13] = new Waypoint(668,270, [12,21], 21);
    this.waypoints[14] = new Waypoint(870,270, [23,15], 23);
    this.waypoints[15] = new Waypoint(968,270, [14,4], 14);

    this.waypoints[16] = new Waypoint(207,403, [9,17], 9);
    this.waypoints[17] = new Waypoint(267,403, [16,26], 16);
    this.waypoints[18] = new Waypoint(373,403, [27,19], 19);
    this.waypoints[19] = new Waypoint(449,403, [18,11], 11);

    this.waypoints[20] = new Waypoint(563,372, [21,28], 21);
    this.waypoints[21] = new Waypoint(668,372, [20,22,13], 22);
    this.waypoints[22] = new Waypoint(760,372, [21,23], 45); // special
    this.waypoints[23] = new Waypoint(870,372, [22,24,14], 22);
    this.waypoints[24] = new Waypoint(968,372, [23,34], 23);

    this.waypoints[25] = new Waypoint(207,500, [26,29], 29);
    this.waypoints[26] = new Waypoint(267,500, [25,17], 25);
    this.waypoints[27] = new Waypoint(373,500, [28,18,30], 28);
    this.waypoints[28] = new Waypoint(563,500, [27,20,32], 32);

    this.waypoints[29] = new Waypoint(207,592, [30,25,36], 30);
    this.waypoints[30] = new Waypoint(363,592, [27,29,31,37], 27);
    this.waypoints[31] = new Waypoint(449,592, [30,38], 30);

    this.waypoints[32] = new Waypoint(563,658, [28,33], 33);
    this.waypoints[33] = new Waypoint(760,658, [32,34], 45); // special
    this.waypoints[34] = new Waypoint(968,658, [33,24,39], 33);

    this.waypoints[35] = new Waypoint(-100,724, [35], 35); // special
    this.waypoints[36] = new Waypoint(207,724, [35,37,29], 37);
    this.waypoints[37] = new Waypoint(349,724, [36,30], 30);
    this.waypoints[38] = new Waypoint(449,724, [31,39], 39);
    this.waypoints[39] = new Waypoint(968,724, [38,34], 34);
    this.waypoints[40] = new Waypoint(1073,724, [41,5], 5);
    this.waypoints[41] = new Waypoint(1181,724, [40,42,6], 40);
    this.waypoints[42] = new Waypoint(1286,724, [41,43,7], 41);
    this.waypoints[43] = new Waypoint(1399,724, [42,8], 42);

    this.waypoints[44] = new Waypoint(668,500, [45, 47, 48], 45);
    this.waypoints[45] = new Waypoint(760,500, [44, 46], 44); // special
    this.waypoints[46] = new Waypoint(870,500, [45, 49, 50], 45);
    this.waypoints[47] = new Waypoint(668,460, [44], 44);
    this.waypoints[48] = new Waypoint(668,540, [44], 44);
    this.waypoints[49] = new Waypoint(870,460, [46], 46);
    this.waypoints[50] = new Waypoint(870,540, [46], 46);

    this.central_waypoint = 45;
    this.escape_waypoints = [22, 33];
    this.success_waypoints = [44, 45, 46, 47, 48, 49, 50];
    this.failure_waypoints = [35];
    this.horse_start_waypoints = [44, 45, 46];

    this.x = 150;
    this.y = 100;
    this.x_spacing = 27;
    this.y_spacing = 32;

    this.num_horses = 8;

    this.map_number = 2;
  }
}

class Map_Three extends Map {
  constructor() {
    super();
    this.tiles = [
      "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "x-----------------------------------------------x",
      "x--xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx--x",
      "x-----------------------------------------------x",
      "x--xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx--x",
      "x-----------------------------------------------x",
      "x--xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx--x",
      "x-----------------------------------------------x",
      "x--xxxxxxxxxxxxxxyyyy    yyyyxxxxxxxxxxxxxxxxx--x",
      "x----------------y          y-------------------x",
      "x----------------y          y-------------------x",
      "x----------------y          y-------------------x",
      "x----------------y          y-------------------x",
      "x--xxxxxxxxxxxxxxyyyy    yyyyxxxxxxxxxxxxxxxxx--x",
      "x-----------------------------------------------x",
      "x--xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx--x",
      "x-----------------------------------------------x",
      "x--xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx--x",
      "------------------------------------------------x",
      "------------------------------------------------x",
      "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    ];

    this.waypoints = {};

    this.waypoints[0] = new Waypoint(198,144, [1, 4], 4);
    this.waypoints[1] = new Waypoint(615,144, [0, 2], 0);
    this.waypoints[2] = new Waypoint(913,144, [1, 3], 3);
    this.waypoints[3] = new Waypoint(1412,144, [2, 7], 7);

    this.waypoints[4] = new Waypoint(198,210, [0, 5, 8], 8);
    this.waypoints[5] = new Waypoint(615,210, [4, 6], 4);
    this.waypoints[6] = new Waypoint(913,210, [5, 7], 7);
    this.waypoints[7] = new Waypoint(1412,210, [3, 6, 11], 11);

    this.waypoints[8] = new Waypoint(198,270, [4, 9, 12], 12);
    this.waypoints[9] = new Waypoint(615,270, [8, 10], 8);
    this.waypoints[10] = new Waypoint(913,270, [9, 11], 11);
    this.waypoints[11] = new Waypoint(1412,270, [7, 10, 15], 15);

    this.waypoints[12] = new Waypoint(198,335, [8, 13, 16], 13);
    this.waypoints[13] = new Waypoint(615,335, [12, 42], 42);
    this.waypoints[14] = new Waypoint(913,335, [42, 15], 42);
    this.waypoints[15] = new Waypoint(1412,335, [11, 14, 19], 14);

    this.waypoints[16] = new Waypoint(198,400, [12, 20], 12);
    this.waypoints[17] = new Waypoint(655,400, [21], 21);
    this.waypoints[18] = new Waypoint(880,400, [22], 22);
    this.waypoints[19] = new Waypoint(1412,400, [15, 23], 15);

    this.waypoints[20] = new Waypoint(198,450, [16, 24], 24);
    this.waypoints[21] = new Waypoint(655,450, [17, 25, 41], 41);
    this.waypoints[22] = new Waypoint(880,450, [18, 26, 41], 41);
    this.waypoints[23] = new Waypoint(1412,450, [19, 27], 27);

    this.waypoints[24] = new Waypoint(198,500, [20, 28], 28);
    this.waypoints[25] = new Waypoint(655,500, [21], 21);
    this.waypoints[26] = new Waypoint(880,500, [22], 22);
    this.waypoints[27] = new Waypoint(1412,500, [23, 31], 31);

    this.waypoints[28] = new Waypoint(198,560, [24, 32, 29], 29);
    this.waypoints[29] = new Waypoint(615,560, [28, 43], 43);
    this.waypoints[30] = new Waypoint(913,560, [31, 43], 43);
    this.waypoints[31] = new Waypoint(1412,560, [27, 30, 35], 30);

    this.waypoints[32] = new Waypoint(198,622, [28, 33, 36], 28);
    this.waypoints[33] = new Waypoint(615,622, [32, 34], 32);
    this.waypoints[34] = new Waypoint(913,622, [33, 35], 35);
    this.waypoints[35] = new Waypoint(1412,622, [31, 34, 39], 31);

    this.waypoints[36] = new Waypoint(198,705, [40, 32, 37], 32);
    this.waypoints[37] = new Waypoint(615,705, [36, 38], 36);
    this.waypoints[38] = new Waypoint(913,705, [37, 39], 39);
    this.waypoints[39] = new Waypoint(1412,705, [38, 35], 35); 

    this.waypoints[40] = new Waypoint(-100,705, [40], 40); // game over
    this.waypoints[41] = new Waypoint(765,450, [41, 21, 22], 21); // central home
    this.waypoints[42] = new Waypoint(765,335, [13, 14], 41); // escape 1
    this.waypoints[43] = new Waypoint(765,560, [29, 30], 41); // escape 2

    this.central_waypoint = 41;
    this.escape_waypoints = [42, 43];
    this.success_waypoints = [17, 21, 25, 41, 18, 22, 26];
    this.failure_waypoints = [40];
    this.horse_start_waypoints = [21, 41, 22];

    this.x = 150;
    this.y = 100;
    this.x_spacing = 27;
    this.y_spacing = 32;

    this.num_horses = 8;

    this.map_number = 3;
  }
}


