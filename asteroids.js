var Asteroids = function(theGame) {
    this.thecanvas = Asteroids.thecanvas(this, theGame);
    this.player = Asteroids.player(this);
    this.roidBelt = Asteroids.roidBelt(this);
    this.keyState = Asteroids.keyState(this);
    this.listen = Asteroids.listen(this);
    Asteroids.play(this);
    //return this;
};

Asteroids.play = function(game) {
    var context = game.thecanvas.getContext('2d');
    
    //create new default asteroids
    var roids = game.roidBelt.getBelt();
    var x, y;
    for (var j = 0; j < NUM_OF_ROIDS; j++) {
        var playerpos = game.player.getPosition(); // playerpos[300,240]
        var myBuffer = ROID_SIZE * 2 + game.player.getRadius(); // 114
        x = Math.floor(Math.random() * GAME_WIDTH);
        y = Math.floor(Math.random() * GAME_HEIGHT);
        // console.log(distBetweenPoints(playerpos[0],playerpos[1], x, y) + " : " + myBuffer);
        if (distBetweenPoints(playerpos[0],playerpos[1], x, y) > myBuffer) {
            // console.log("PUSH ASTEROID INTO BELT");
            var myroid = Asteroids.asteroid(game, x, y);
            roids.push(myroid);
        }
    }

    //using RAF with a fallback to setInterval
    requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    setInterval;

    //setInterval(update, 1000/FPS);
    requestAnimationFrame(update, 1000/FPS);

    function update() {
        // context.save(); 
        context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        //******PLAYER SHIP********
        if (!game.player.isDead()) {
            //thrusting movement
            if (game.keyState.getState(UP_CODE)) {
                game.player.thrusting = true;
                game.player.thrust(THRUST_ACC, context);
            }
            else if (!game.keyState.getState(UP_CODE)) {
                game.player.thrusting = false;
                game.player.thrust(FRICTION_VALUE, context);
            }

            //draw the player ship
            game.player.draw(context);

            //directional movement for the ship
            if (game.keyState.getState(LEFT_CODE)) {
                game.player.rotate(ROTATE_SPEED/FPS);
            }
            if (game.keyState.getState(RIGHT_CODE)) {
                game.player.rotate(-ROTATE_SPEED/FPS);
            }
            game.player.move();     //move the ship by updating position(add velocity vector to position vector)
        }

        //*******ASTEROIDS CREATION AND MOVEMENT*******
        roids = game.roidBelt.getBelt();
        for (var i = 0; i < game.roidBelt.getLength(); i++) {
            //draw each asteroid
            roids[i].draw(context);
            //move each asteroid
            roids[i].move();

            if(Asteroids.collision(game.player, roids[i]) && !game.player.isDead() && !game.player.isInvincible()) {
                game.player.die();
            }
        }
        requestAnimationFrame(update, 1000/FPS);
    }
};

Asteroids.thecanvas = function(game, theGame) {
    var canvas = document.getElementById('canvas');
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    //theGame.appendChild(canvas);
    return canvas;
};

Asteroids.player = function(game) {
    var pos = [GAME_WIDTH/2,GAME_HEIGHT/2];
    var direction = Math.PI/2;
    var r = 14;
    var vel = [0,0];
    var thrusting = false;
    var dead = false;
    var invincible = false;
    var lives = PLAYER_LIVES;
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
                if (Math.sqrt(vel[0] * vel[0] + vel[1] * vel[1]) >= MAX_SPEED) {
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
        },
        getRadius: function() {
            return r;
        },
        getPosition: function() {
            return pos;
        },

        die: function() {
            if (!dead) {
                dead = true;
                invincible = true;
                pos = [GAME_WIDTH/2,GAME_HEIGHT/2];
                direction = Math.PI/2;
                vel = [0,0];
                thrusting = false;
                lives--;
                console.log("You died");
                if (lives > 0) {
                    setTimeout(function() {
                        dead = false;
                        game.player.ressurect();
                    }, DEATH_TIMEOUT);
                } else {
                    console.log("Game Over");
                }
            }
        },

        ressurect: function() {
            setTimeout(function() {
                dead = false;
                invincible = false;
            }, INVINCIBLE_TIMEOUT);
        },

        isDead: function() {
            return dead;
        },

        isInvincible: function() {
            return invincible;
        }
    };
};

Asteroids.asteroid = function(game, x, y) {
    var pos = [x,y];
    var vel = [
    Math.random()*ROID_SPEED/FPS*(Math.random() < 0.5 ? 1 : -1), 
    Math.random()*ROID_SPEED/FPS*(Math.random() < 0.5 ? 1 : -1)
    ];
    var r = ROID_SIZE;
    var vertex = Math.random() * 12 + 5;
    var direction = Math.random() * 2*Math.PI;
    var offs = [];
    for (var i = 0; i < vertex; i++) {
        offs.push(Math.random() * ROID_JAG * 2 + 1 - ROID_JAG);
    }

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
        },
        draw: function(context) {
            //get to first asteroid point
            context.beginPath();
            context.moveTo(
                pos[0] + r*offs[0] * Math.cos(direction),
                pos[1] + r*offs[0] * Math.sin(direction)
                );
            //draw polygon
            for (var k = 1; k < vertex; k++) {
                context.lineTo(
                    pos[0] + r*offs[k] * Math.cos(direction + k * 2*Math.PI/vertex),
                    pos[1] + r*offs[k] * Math.sin(direction + k * 2*Math.PI/vertex)
                    );
            }
            context.closePath();
            context.stroke();

        },
        move: function() {
            //move: add vel to pos
            pos[0] += vel[0];
            pos[1] += vel[1];
            
            //handle edge of screen
            if (pos[0] < 0-r) {
                pos[0] = canvas.width + r;
            } else if (pos[0] > canvas.width + r) {
                pos[0] = 0-r;
            }

            if (pos[1] < 0-r) {
                pos[1] = canvas.height + r;
            } else if (pos[1] > canvas.height + r) {
                pos[1] = 1-r;
            }
        }
    };
};

Asteroids.roidBelt = function(game) {
    var roids = [];

    return {
        push: function(newRoid) {
            return roids.push(newRoid);
        },
        pop: function() {
            return roids.pop();
        },
        getBelt: function() {
            return roids;
        },
        getLength: function() {
            return roids.length;
        }
    };
};

Asteroids.collision = function(a, b) {
    var a_pos = a.getPosition();
    var b_pos = b.getPosition();

    var distance = distBetweenPoints(a_pos[0], a_pos[1], b_pos[0], b_pos[1]);

    if (distance <= (a.getRadius() + b.getRadius())) {
        return true;
    } else {
        return false;
    }
};

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
    };
};

Asteroids.listen = function(game) {
    window.addEventListener('keydown', function(event) {
        switch (event.which) {
            case LEFT_CODE:
            case RIGHT_CODE:
            case UP_CODE:
            case SPACE_CODE:
            event.preventDefault();
            event.stopPropagation();
            game.keyState.on(event.which);
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
            game.keyState.off(event.which);
            return false;
        }
        return true;
    }, true);
};

function distBetweenPoints(x1, y1, x2, y2) {
    return Math.floor(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
}

LEFT_CODE = 37;
RIGHT_CODE = 39;
UP_CODE = 38;
SPACE_CODE = 32;
GAME_WIDTH = 600;
GAME_HEIGHT = 480;
FPS = 60; 

ROTATE_SPEED = Math.PI;
THRUST_ACC = 0.2;
FRICTION_VALUE = 0.03;
MAX_SPEED = 2;
INVINCIBLE_TIMEOUT = 3000;
DEATH_TIMEOUT = 2000;
PLAYER_LIVES = 3;

NUM_OF_ROIDS = 5;
ROID_SPEED = 40;
ROID_SIZE = 50;
ROID_JAG = 0.3; //0 = no jaggedness, 1 = lots of jaggedness

window.onload = Asteroids(document.getElementById('theGame'));