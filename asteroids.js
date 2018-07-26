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
    var direction = -Math.PI/2;
    
    return {
        draw: function(context) {
            context.translate(pos[0], pos[1]);
            context.rotate(direction);
            context.beginPath();

            context.moveTo(10,0);
            context.lineTo(-5,5);
            context.lineTo(-5,-5);
            context.lineTo(10,0);

            context.stroke();
        }
    }
}

GAME_WIDTH = 600;
GAME_HEIGHT = 480;
FPS = 30; 

window.onload = Asteroids(document.getElementById('theGame'));