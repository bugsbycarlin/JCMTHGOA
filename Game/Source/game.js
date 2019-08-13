
var context;

var mode = "title";

var seconds_of_this_crap = 0;

// var tries_left = 3;

var pens_to_go = 5;

var num_horses;

var cussin_sound_available = true;

var cussin_frequency = 3000;
var next_cuss = 0;
var time_since_cussin = 0;

var fence_images = [];
fence_images["horizontal"] = new Image();
fence_images["horizontal"].src = "Art/Fence/horizontal_fence.png";
fence_images["vertical"] = new Image();
fence_images["vertical"].src = "Art/Fence/vertical_fence.png";
fence_images["solitary"] = new Image();
fence_images["solitary"].src = "Art/Fence/solitary_fence.png";
fence_images["corner"] = new Image();
fence_images["corner"].src = "Art/Fence/corner_fence.png";
fence_images["extension"] = new Image();
fence_images["extension"].src = "Art/Fence/extension_fence.png";

title_horse = [];
for (var i = 1; i <= 21; i++) {
  title_horse[i] = new Image();
  title_horse[i].src = "Art/TitleTrot/rear_trot_" + i + ".png";
}
title_horse_1_frame = 1;
title_horse_2_frame = 1;

var game_over_image = new Image();
game_over_image.src = "Art/Display/game_over.png";

var game_win_image = new Image();
game_win_image.src = "Art/Display/game_win.png";

var background_image = new Image();
background_image.src = "Art/Background/farm.png";

var title_image = new Image();
title_image.src = "Art/Display/title_screen.png";

var credits_image = new Image();
credits_image.src = "Art/Display/credits.png";

var martha_image = new Image();
martha_image.src = "Art/Display/martha.png";

var last_pen_image = new Image();
last_pen_image.src = "Art/Display/last_pen.png";

var pens_to_go_image = new Image();
pens_to_go_image.src = "Art/Display/pens_to_go.png";

var seconds_of_this_crap_image = new Image();
seconds_of_this_crap_image.src = "Art/Display/seconds_of_this_crap.png";

// var tries_left_image = new Image();
// tries_left_image.src = "Art/Display/tries_left.png";

var number_text = [];
for (var i = 0; i < 10; i++) {
  number_text[i] = new Image();
  number_text[i].src = "Art/Display/" + i + ".png";
}

var map;
var horses = [];
var dude;
var poops = [];

function initialize()
{
  $('img').bind('dragstart', function(event) { event.preventDefault(); });
  
  canvas = document.getElementById('canvas');

  //document.addEventListener("mouseup", click_event, false);
  //document.addEventListener("touchstart", touch_event, false);
  document.addEventListener("keydown", handleKeys, false);
  
  canvas.width = 1600;
  canvas.height = 900;
  //var pos = findPos(canvas);
  //canvas.left = pos[0];
  //canvas.top = pos[1];

  canvas.style.visibility = 'visible';
  var loadingdiv = document.getElementById('loadingdiv');
  loadingdiv.style.visibility = 'hidden';

  setInterval(update,36);
  setInterval(updateDude,24);

  context = canvas.getContext('2d');

  map = new Map_One();

  resetGame();
  mode = "title";
}

function resetGame() {
  mode = "game";

  seconds_of_this_crap = 0;
  // tries_left = 3;
  pens_to_go = 5;
  num_horses = map.num_horses;

  dude = new Dude(canvas, map, -93, 724);

  for (var i = 0; i < num_horses; i++) {
    horses[i] = new Horse(canvas,
      dude,
      650 + 200 * Math.random(),
      500,
      map.horse_start_waypoints[i % 3]);
  }

  poops = [];
}

function cueTheMusic() {
  var volume = 0.4;
  $("#song_1").prop("volume",volume);
  $("#song_2").prop("volume",volume);
  $("#song_3").prop("volume",volume);
  $("#song_4").prop("volume", volume);
  
  $("#song_1").bind("ended", function(){
    $("#song_2").trigger("play");
  });
  $("#song_2").bind("ended", function(){
    $("#song_3").trigger("play");
  });
  $("#song_3").bind("ended", function(){
    $("#song_4").trigger("play");
  });
  $("#song_4").bind("ended", function(){
    $("#song_1").trigger("play");
  });

  // Start with one of the first three songs.
  var first_song_string = "#song_" + (Math.floor(Math.random() * 3) + 1).toString();
  $(first_song_string).trigger("play");

  // $("#cussin").prop("volume",0.8);
  // $("#cussin").trigger("play");
  // $("#cussin").bind("ended", function(){
  //   $("#cussin").trigger("play");
  // });

  next_cuss = cussin_frequency + Math.floor(Math.random() * cussin_frequency);
}

function update() {
  if (mode === "title") {
    //pass
  } else if (mode === "game") {
    if (dude.state != "failed" && dude.state != "succeeded") {
      seconds_of_this_crap += 36.0/1000.0;
    }

    updateGame();
  }

  render();
}

function updateGame() {

  if (dude.state === "succeeded") {
    return;
  }

  var no_escapes_yet = true;
  var wayward_horse = false;
  for (var i = 0; i < num_horses; i++) {
    horses[i].update();

    horses[i].maybePoop(poops);

    if (horses[i].has_escaped) {
      no_escapes_yet = false;
    }

    if (!map.success_waypoints.includes(horses[i].waypoint) || map.escape_waypoints.includes(horses[i].old_waypoint)) {
      wayward_horse = true;
    }
  }

  if (!no_escapes_yet && !wayward_horse) {
    dude.succeed();
  }

  for (var i = 0; i < poops.length; i++) {
    poops[i].update();
  }

  // if (dude.state != "failed" && dude.state != "kicked_fall") {
  //   time_since_cussin += 36.0;
  //   if (time_since_cussin > next_cuss && cussin_sound_available) {
  //     cussin_sound_available = false;
  //     var cussin_string = "#cussin_" + (Math.floor(Math.random() * 28) + 1).toString();
  //     $(cussin_string).trigger("play");
  //     $(cussin_string).bind("ended", function(){
  //       cussin_sound_available = true;
  //     });
  //     time_since_cussin = 0;
  //     next_cuss = cussin_frequency + Math.floor(Math.random() * cussin_frequency);
  //   }
  // }
}

function updateDude() {
  if (mode === "title") {
    return;
  }
  dude.update();

  for (var i = 0; i < poops.length; i++) {
    if (dude.state === "running" && poops[i].state === "fresh" && dude.state != "crap" && distance(dude.x_pos, dude.y_pos, poops[i].x, poops[i].y) < 8) {
      dude.stepInCrap();
      poops[i].state = "destroyed";
      var crap_sound_string = "#crap_" + (Math.floor(Math.random() * 10) + 1).toString();
      if (cussin_sound_available) {
        cussin_sound_available = false;
        $(crap_sound_string).trigger("play");
        $(crap_sound_string).bind("ended", function(){
          cussin_sound_available = true;
        });
      }
    }
  }
}

function debugRenderWaypoints() {
  for (var i = 0; i <= 43; i++) {
    var w1 = map.waypoints[i];
    for (var j = 0; j < w1.links.length; j++) {
      var w2 = map.waypoints[w1.links[j]];
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

  for (const [key, value] of Object.entries(map.waypoints)) {
    var i = parseInt(key);
    if (!map.success_waypoints.includes(i)) {
      drawNumber(i, map.waypoints[i].x, map.waypoints[i].y);
    }
  }
}


function render() {
  // clear the screen
  context.fillStyle = "#907441";
  context.fillRect(0,0,canvas.width,canvas.height);

  if (mode === "title") {
    renderTitle(context);
  } else {
    renderGame(context);
  }
}

function drawNumber(number, x, y) {
  if (number > 0) {
    var display_number = number;
    var digits = Math.floor(Math.log(number) / Math.log(10));
    for (var i = digits; i >= 0; i--) {
      var current_digit = Math.floor(display_number / (Math.pow(10, i)));
      display_number -= Math.pow(10, i) * current_digit;
      context.drawImage(number_text[current_digit], x + 26 * (digits - i), y); 
    }
    return digits;
  } else if (number === 0) {
    context.drawImage(number_text[0], x, y);
    return 0;
  }
}

function renderTitle(context) {
  //context.drawImage(title_image, 0, 0);

  context.fillStyle = "#FFFFFF";
  context.fillRect(0,0,canvas.width,canvas.height);

  context.drawImage(background_image, 0, 0);

  context.drawImage(title_horse[Math.floor(title_horse_1_frame)], 140, 100);
  context.drawImage(title_horse[Math.floor(title_horse_2_frame)], 1210, 100);

  //context.drawImage(title_image, 0, 0);
  context.drawImage(title_image, 0, -180);

  context.drawImage(credits_image, -10, 0);

  title_horse_1_frame += 0.5;
  if (title_horse_1_frame >= title_horse.length) {
    title_horse_1_frame = 1;
  }
  title_horse_2_frame += 0.5;
  if (title_horse_2_frame >= title_horse.length) {
    title_horse_2_frame = 1;
  }
}

function renderGame(context) {

  context.drawImage(background_image, 0, 0);

  //debugRenderWaypoints();

  dude.renderEffect();

  if (dude.state === "kicked_fall" && dude.current_frame < 10) {
    this.context.save();
    this.context.translate(
      Math.floor(Math.random() * 10) - 5,
      Math.floor(Math.random() * 10) - 5);
  }

  for (var i = 0; i < poops.length; i++) {
    poops[i].render();
  }

  context.drawImage(martha_image, 570, 30);

  var tiles = map.tiles;
  for (var h = 0; h < tiles.length; h++) {
    for (var w = 0; w < tiles[0].length; w++) {
      draw_x = map.x + map.x_spacing * w;
      draw_y = map.y + map.y_spacing * h;

      if (tiles[h][w] === "x") {
        //if(h === 0 || h == =tiles.length - 1) {
        //context.drawImage(fence_images["extension"], draw_x, draw_y);
        //draw_y -= 5;
        //}

        if (w < tiles[0].length - 1 && h < tiles.length - 1 && tiles[h][w+1] === "x" && map.tiles[h+1][w] === "x") {
          context.drawImage(fence_images["corner"], draw_x, draw_y);
        } else if (w < tiles[0].length - 1 && tiles[h][w+1] === "x") {
          context.drawImage(fence_images["horizontal"], draw_x, draw_y);
        } else if (h < tiles.length - 1 && tiles[h+1][w] === "x") {
          context.drawImage(fence_images["vertical"], draw_x, draw_y);
        } else {
          context.drawImage(fence_images["solitary"], draw_x, draw_y);
        }

        //if (h === 0 || h === tiles.length - 1) draw_y += 40;
        //draw_y += 5;
      }

      for (var i = 0; i < num_horses; i++) {
        if (draw_y + 25 <= horses[i].y_pos && draw_y + 25 + map.y_spacing > horses[i].y_pos) {
          horses[i].render();
        }
      }

      if (draw_y + 25 <= dude.y_pos && draw_y + 25 + map.y_spacing > dude.y_pos) {
        dude.render();
      }
    }
  }

  if (dude.state === "failed") {
    context.drawImage(game_over_image, -35, 155);
  }

  if (dude.state === "succeeded") {
    context.drawImage(game_win_image, 0, 0);
  }

  // var display_seconds = seconds_of_this_crap;
  // var digits = Math.floor(Math.log(seconds_of_this_crap) / Math.log(10));
  // for (var i = digits; i >= 0; i--) {
  //   var current_digit = Math.floor(display_seconds / (Math.pow(10, i)));
  //   display_seconds -= Math.pow(10, i) * current_digit;
  //   context.drawImage(number_text[current_digit], 10 + 26 * (digits - i), 8); 
  // }
  var digits = drawNumber(Math.floor(seconds_of_this_crap), 10, 8);

  context.drawImage(seconds_of_this_crap_image, 26 * digits + 50, 8);

  // drawNumber(tries_left, 710, 8);
  // context.drawImage(tries_left_image, 750, 8);

  if(pens_to_go > 1) {
    drawNumber(pens_to_go, 1305, 8);
    context.drawImage(pens_to_go_image, 1350, 8);
  } else {
    context.drawImage(last_pen_image, 1380, 8);
  }

  if (dude.state === "kicked_fall" && dude.current_frame < 10) {
    this.context.restore();
  }
}

// function renderHorse() {
//   context.save();
//   context.translate(x_pos, y_pos);
//   if (velocity < 0) {
//     context.scale(-1, 1);
//   }
//   context.drawImage(trotImages[current_frame], -center_x, -center_y);
//   context.restore();
// }

function distance(x1, y1, x2, y2) {
  var x_diff = Math.abs(x1 - x2);
  var y_diff = Math.abs(y1 - y2);
  return Math.sqrt(x_diff*x_diff + y_diff*y_diff);
}

function insideEllipse(e_x, e_y, e_width, e_height, x, y) {
  return Math.pow(x - e_x, 2) / Math.pow(e_width, 2) + Math.pow(y - e_y, 2) / Math.pow(e_height, 2) <= 1;
}

function handleKeys(ev) {
  ev.preventDefault();

  if (mode === "game") {
    handleGameKeys(ev);
  } else if (mode === "title") {
    handleTitleKeys(ev);
  }
}

function handleGameKeys(ev) {
  if (dude.state === "running" || dude.state === "crap" || dude.state === "stopped") {
    var old_direction = dude.direction;
    if (ev.key === "ArrowLeft") {
      dude.direction = "left";
    } else if (ev.key === "ArrowRight") {
      dude.direction = "right";
    } else if (ev.key === "ArrowUp") {
      dude.direction = "up";
    } else if (ev.key === "ArrowDown") {
      dude.direction = "down";
    }

    if (old_direction != dude.direction && Math.random() * 100 < 65) {
      if (cussin_sound_available && dude.state != "succeeded" && dude.state != "failed" && dude.state != "kicked_fall") {
        cussin_sound_available = false;
        var cussin_string = "#cussin_" + (Math.floor(Math.random() * 29) + 1).toString();
        $(cussin_string).trigger("play");
        $(cussin_string).bind("ended", function(){
          cussin_sound_available = true;
        });
      }
    }
  }

  if (ev.key === "f") {
    dude.fail()
  }

  if (dude.state === "failed" && ev.key === "Enter") {
    resetGame();
  }
}

function handleTitleKeys(ev) {
  if (ev.key === "Enter") {
    console.log("switching");
    mode = "game";

    cueTheMusic();
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

