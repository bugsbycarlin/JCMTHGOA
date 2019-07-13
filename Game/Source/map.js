

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
    var x1 = x - this.x - half_width;
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

