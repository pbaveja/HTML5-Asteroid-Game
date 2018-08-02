var Asteroids = function(theGame) {
    this.thecanvas = Asteroids.thecanvas(this, theGame);
    this.player = Asteroids.player(this);
    this.keyState = Asteroids.keyState(this);
    this.listen = Asteroids.listen(this);
    this.asteroid = Asteroids.asteroid(this);
    Asteroids.play(this);
    //return this;
}

Asteroids.play = function(game){
    var context = game.thecanvas.getContext('2d');

    setInterval(update, 1000/FPS);

    function update() {
        // context.save();
        context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        if (game.keyState.getState(UP_CODE)) {
            game.player.thrusting = true;
            game.player.thrust(THRUST_ACC, context);
        }
        else if (!game.keyState.getState(UP_CODE)) {
            game.player.thrusting = false;
            game.player.thrust(FRICTION_VALUE, context);
        }

        game.player.draw(context);

        if (game.keyState.getState(LEFT_CODE)) {
            game.player.rotate(ROTATE_SPEED);
        }
        if (game.keyState.getState(RIGHT_CODE)) {
            game.player.rotate(-ROTATE_SPEED);
        }
        game.player.move();
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
    var r = 14;
    var vel = [0,0];
    var thrusting = false;
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
        },
        thrust: function(thrust, context) {
            if (game.player.thrusting) {
                vel[0] += thrust*Math.cos(direction);
                vel[1] -= thrust*Math.sin(direction);
                if (Math.sqrt(vel[0] * vel[0] + vel[1] * vel[1]) > MAX_SPEED) {
                    vel[0] *= 0.95;
                    vel[1] *= 0.95;
                }
                //thruster draw
                context.beginPath();
                context.moveTo(
                    pos[0] - r * 2/3*Math.cos(direction),
                    pos[1] + r * 2/3*Math.sin(direction)
                    );
                context.lineTo(
                    pos[0] - r/3 * (1.2*Math.cos(direction) + 1/2*Math.sin(direction)),
                    pos[1] + r/3 * (1.2*Math.sin(direction) - 1/2*Math.cos(direction))
                    );
                context.lineTo(
                    pos[0] - r/3 * (1.2*Math.cos(direction) - 1/2*Math.sin(direction)),
                    pos[1] + r/3 * (1.2*Math.sin(direction) + 1/2*Math.cos(direction))
                    );
                context.closePath();
                // context.fillStyle = "red";
                // context.fill();
                context.stroke();
            }
            else {
                vel[0] -= thrust*vel[0]/FPS;
                vel[1] -= thrust*vel[1]/FPS;
            }
        },
        move: function() {
            pos[0] += vel[0];
            if (pos[0] < 0)
                pos[0] = GAME_WIDTH + pos[0];
            else if (pos[0] > GAME_WIDTH)
                pos[0] -= GAME_WIDTH;

            pos[1] += vel[1];
            if (pos[1] < 0)
                pos[1] = GAME_HEIGHT + pos[1];
            else if (pos[1] > GAME_HEIGHT)
                pos[1] -= GAME_HEIGHT;
        }
    }
}

Asteroids.asteroid = function(game) {
    var pos = [0, 0];
    var vel = [0, 0];
    var r = 30;

    return {
        getPosition: function() {
            return pos;
        },
        setPosition: function(npos) {
            pos = npos;
        },
        getVelocity: function() {
            return vel;
        },
        setVelocity: function(nvel) {
            vel = nvel;
        },
        getRadius: function() {
            return r;
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
FPS = 60; 
ROTATE_SPEED = Math.PI/60;
THRUST_ACC = 0.3;
FRICTION_VALUE = 0.03;
MAX_SPEED = 2;

var asteroids = [];

window.onload = Asteroids(document.getElementById('theGame'));