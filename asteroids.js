var Asteroids = function(theGame) {
    this.thecanvas = Asteroids.thecanvas(this, theGame);
    this.player = Asteroids.player(this);
    this.keyState = Asteroids.keyState(this);
    this.listen = Asteroids.listen(this);

    Asteroids.play(this);
    return this;
}

Asteroids.play = function(game){
    var context = game.thecanvas.getContext('2d');

    setInterval(update, 1000/FPS);

    function update() {
        // context.save();
        context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        game.player.draw(context);
        game.player.rotate(ROTATE_SPEED);
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
    var r = 15;
    
    return {
        draw: function(context) {
            context.beginPath();
            context.moveTo(
                pos[0] + r * Math.cos(direction),
                pos[1] - r * Math.sin(direction)
            );
            context.lineTo(
                pos[0] - r/3 * (Math.cos(direction) + Math.sin(direction)),
                pos[1] + r/3 * (Math.sin(direction) - Math.cos(direction))
            );
            context.lineTo(
                pos[0] - r/3 * (Math.cos(direction) - Math.sin(direction)),
                pos[1] + r/3 * (Math.sin(direction) + Math.cos(direction))
            );
            context.closePath();
            context.stroke();
        },
        rotate: function(rspeed) {
            direction += rspeed;
        }
    }
}

Asteroids.keyState = function(game) {
    var kstate = [];
    kstate[LEFT_CODE] = false;
    kstate[RIGHT_CODE] = false;
    kstate[UP_CODE] = false;
    kstate[SPACE_CODE] = false;

    return {
        on: function(key) {
            kstate[key] = true;
        },
        off: function(key) {
            kstate[key] = false;
        },
        getState: function(key) {
            if (typeof kstate[key] != 'undefined')
                return kstate[key];
            return false;
        }
    }
}

Asteroids.listen = function(game) {
    window.addEventListener('keydown', function(event) {
        switch (event.which) {
            case LEFT_CODE:
            case RIGHT_CODE:
            case UP_CODE:
            case SPACE_CODE:
                event.preventDefault();
                event.stopPropagation();
                game.keyState.on(event.which)
                return false;
        }
        return true;
    }, true);

    window.addEventListener('keyup', function(event) {
        switch (event.which) {
            case LEFT_CODE:
            case RIGHT_CODE:
            case UP_CODE:
            case SPACE_CODE:
                event.preventDefault();
                event.stopPropagation();
                game.keyState.off(event.which)
                return false;
        }
        return true;
    }, true);
}

LEFT_CODE = 37;
RIGHT_CODE = 39;
UP_CODE = 38;
SPACE_CODE = 32;
GAME_WIDTH = 600;
GAME_HEIGHT = 480;
FPS = 30; 
ROTATE_SPEED = Math.PI/10;

window.onload = Asteroids(document.getElementById('theGame'));