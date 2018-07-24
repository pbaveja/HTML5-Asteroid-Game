// function Triangle() {
//   var canvas = document.getElementById('canvas');
//   var context = canvas.getContext('2d');
//   canvas.width = 600;
//   canvas.height = 480;
  
//   context.beginPath();
//   context.moveTo(canvas.width/2, canvas.height/2);
  
//   context.lineTo(canvas.width/2+10,canvas.height/2+30);
//   context.lineTo(canvas.width/2-10, canvas.height/2+30);
//   context.lineTo(canvas.width/2, canvas.height/2);
//   context.stroke();
// }
// window.onload = Triangle;

var Asteroids = function(theGame) {
    this.thecanvas = Asteroids.thecanvas(this, theGame);
    return this;
}

Asteroids.thecanvas = function(game, theGame) {
    var canvas = document.getElementById('canvas');
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    theGame.appendChild(canvas);
    return canvas;
}

GAME_WIDTH = 600;
GAME_HEIGHT = 480;
window.onload = Asteroids(document.getElementById('theGame'));