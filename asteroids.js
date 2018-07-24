var Asteroids = function(theGame) {
    this.thecanvas = Asteroids.thecanvas(this, theGame);
    this.player = Asteroids.player(this);
    return this;
}

Asteroids.thecanvas = function(game, theGame) {
    var canvas = document.getElementById('canvas');
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    theGame.appendChild(canvas);
    return canvas;
}

Asteroids.player = function(game) {
    var pos = [GAME_WIDTH/2,GAME_HEIGHT/2];
    var context = game.thecanvas.getContext('2d');
    context.beginPath();

    context.moveTo(pos[0], pos[1]);
    context.lineTo(pos[0]+10,pos[1]+30);
    context.lineTo(pos[0]-10, canvas.height/2+30);
    context.lineTo(pos[0], pos[1]);
    context.stroke();
}

GAME_WIDTH = 600;
GAME_HEIGHT = 480;

window.onload = Asteroids(document.getElementById('theGame'));