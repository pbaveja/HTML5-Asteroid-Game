var Asteroids = function(theGame) {
    this.thecanvas = Asteroids.thecanvas(this, theGame);
    this.player = Asteroids.player(this);

    Asteroids.play(this);
    return this;
}

Asteroids.play = function(game){
    var context = game.thecanvas.getContext('2d');

    setInterval(update, 1000/FPS);

    function update() {
        game.player.draw(context);
    }

}

Asteroids.thecanvas = function(game, theGame) {
    var canvas = document.getElementById('canvas');
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    //theGame.appendChild(canvas);
    return canvas;
}

Asteroids.player = function(game) {

    var pos = [GAME_WIDTH/2,GAME_HEIGHT/2];
    var direction = Math.PI/2;
    var r = 6;
    
    return {
        draw: function(context) {
            context.beginPath();
            context.moveTo(
                pos[0] + r * Math.cos(direction),
                pos[1] - r * Math.sin(direction)
            );
            context.lineTo(
                pos[0] - r * (Math.cos(direction) + Math.sin(direction)),
                pos[1] + r * (Math.sin(direction) - Math.cos(direction))
            );
            context.lineTo(
                pos[0] - r * (Math.cos(direction) - Math.sin(direction)),
                pos[1] + r * (Math.sin(direction) + Math.cos(direction))
            );
            context.closePath();
            context.stroke();
        }
    }
}

GAME_WIDTH = 600;
GAME_HEIGHT = 480;
FPS = 30; 

window.onload = Asteroids(document.getElementById('theGame'));