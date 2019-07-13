
function initialize()
{
  $('img').bind('dragstart', function(event) { event.preventDefault(); });
  
  canvas = document.getElementById('canvas');

  //document.addEventListener("mouseup", click_event, false);
  //document.addEventListener("touchstart", touch_event, false);
  document.addEventListener("keydown", key_event, false);
  
  canvas.width = 1600;
  canvas.height = 900;
  //var pos = findPos(canvas);
  //canvas.left = pos[0];
  //canvas.top = pos[1];

  canvas.style.visibility = 'visible';
  var loadingdiv = document.getElementById('loadingdiv');
  loadingdiv.style.visibility = 'hidden';

  setInterval(update,42);

  map = new Map();

  var context = canvas.getContext('2d');
  for (var i = 0; i < 4; i++) {
    horses[i] = new Horse(canvas, 650 + 200 * Math.random(), 400 + 150 * Math.random());
    if (i % 2 == 1) horses[i].waypoint = 22;
  }

  dude = new Dude(canvas, map, Waypoints[35].x, Waypoints[35].y);
}

var fenceImages = [];
fenceImages["horizontal"] = new Image();
fenceImages["horizontal"].src = "Art/Fence/horizontal_fence.png";
fenceImages["vertical"] = new Image();
fenceImages["vertical"].src = "Art/Fence/vertical_fence.png";
fenceImages["solitary"] = new Image();
fenceImages["solitary"].src = "Art/Fence/solitary_fence.png";
fenceImages["corner"] = new Image();
fenceImages["corner"].src = "Art/Fence/corner_fence.png";

var floorImage = new Image();
floorImage.src = "Art/Floor/scratch_floor.png";

var map;
var horses = [];
var dude;

function update() {

  for (var i = 0; i < 4; i++) {
    horses[i].update();
  }

  dude.update();

  render();
}

function render()
{
  // clear the screen
  var context = canvas.getContext('2d');
  context.fillStyle = "#907441";
  context.fillRect(0,0,canvas.width,canvas.height);

  context.drawImage(floorImage, 45, 0);

  //debugRenderWaypoints(context);

  var tiles = map.tiles;
  for (var h = 0; h < tiles.length; h++) {
    for (var w = 0; w < tiles[0].length; w++) {
      draw_x = map.x + map.x_spacing * w;
      draw_y = map.y + map.y_spacing * h;

      if (tiles[h][w] === "x") {
        if (w < tiles[0].length - 1 && h < tiles.length - 1 && tiles[h][w+1] === "x" && map.tiles[h+1][w] === "x") {
          context.drawImage(fenceImages["corner"], draw_x, draw_y);
        } else if (w < tiles[0].length - 1 && tiles[h][w+1] === "x") {
          context.drawImage(fenceImages["horizontal"], draw_x, draw_y);
        } else if (h < tiles.length - 1 && tiles[h+1][w] === "x") {
          context.drawImage(fenceImages["vertical"], draw_x, draw_y);
        } else {
          context.drawImage(fenceImages["solitary"], draw_x, draw_y);
        }
      }

      for (var i = 0; i < 4; i++) {
        if (draw_y - map.y_spacing < horses[i].getZIndex() && draw_y > horses[i].getZIndex()) {
          horses[i].render();
        }
      }

      if (draw_y - map.y_spacing < dude.getZIndex() && draw_y > dude.getZIndex()) {
        dude.render();
      }
    }
  }
}

function renderHorse() {
  var context = canvas.getContext('2d');
  context.save();
  context.translate(x_pos, y_pos);
  if (velocity < 0) {
    context.scale(-1, 1);
  }
  context.drawImage(trotImages[current_frame], -center_x, -center_y);
  context.restore();
}

function key_event(ev) {
  ev.preventDefault();

  if (ev.key == "ArrowLeft") {
    dude.direction = "left";
  } else if (ev.key == "ArrowRight") {
    dude.direction = "right";
  } else if (ev.key == "ArrowUp") {
    dude.direction = "up";
  } else if (ev.key == "ArrowDown") {
    dude.direction = "down";
  }
}

// function findPos(element)
// {
//   var curLeft = 0;
//   var curTop = 0;
//   if(element.offsetParent)
//   {
//     do{
//       curLeft += element.offsetLeft;
//       curTop += element.offsetTop;
//     } while(element = element.offsetParent);
//   }
  
//   return [curLeft, curTop];
// }


// function click_event(ev)
// {
//   ev.preventDefault();

//   var x = ev.pageX - canvas.left;
//   var y = ev.pageY - canvas.top;

//   do_click(x,y);
// }

// function touch_event(ev)
// {
//   console.log(ev);
//   var touch = ev.touches[0];
//   var x = touch.pageX - canvas.left;
//   var y = touch.pageY - canvas.top;
//   do_click(x,y);
// }

// function do_click(x,y)
// {
// }

