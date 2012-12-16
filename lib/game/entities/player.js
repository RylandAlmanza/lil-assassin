ig.module(
    'game.entities.player'
)
.requires(
    'impact.entity'
)
.defines(function() {

EntityPlayer = ig.Entity.extend({
    size: {x: 8, y: 8},

    maxVel: {x: 100, y: 200},
    friction: {x: 600, y: 0},

    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,

    animSheet: new ig.AnimationSheet('media/assassin.png', 8, 8),

    flip: false,
    accelGround: 400,
    accelAir: 200,
    jump: 125,
    health: 10,
    onWallRight: false,
    onWallLeft: false,
    canWallRun: true,
    dead: false,

    init: function(x, y, settings) {
        this.parent(x, y, settings);

        this.addAnim('idle', 1, [0]);
        this.addAnim('run', 0.2, [0, 1]);
        this.addAnim('wallrun', 0.2, [2, 3]);
        this.addAnim('dead', 1, [6]);
    },

    update: function() {
        var accel = this.standing ? this.accelGround : this.accelAir;
        if (!this.dead) {
            if (ig.input.state('left')) {
                this.accel.x = -accel;
                this.flip = true;
            } else if (ig.input.state('right')) {
                this.accel.x = accel;
                this.flip = false;
            } else {
                this.accel.x = 0;
            }

            if (ig.input.pressed('jump')) {
                if (this.standing) {
                    this.vel.y = -this.jump;
                } else if (this.onWallRight && this.canWallRun && this.vel.y <= 0) {
                    this.vel.y = -this.jump;
                    this.vel.x = -this.jump / 2;
                    this.canWallRun = false;
                } else if (this.onWallLeft && this.canWallRun && this.vel.y <= 0) {
                    this.vel.y = -this.jump;
                    this.vel.x = this.jump / 2;
                    this.canWallRun = false
                }
            }

            if (this.vel.x != 0) {
                this.currentAnim = this.anims.run;
            } else {
                this.currentAnim = this.anims.idle;
            }
            if (!this.standing && (this.onWallRight || this.onWallLeft) && this.canWallRun && this.vel.y <= 0) {
                this.currentAnim = this.anims.wallrun;
            }
        } else {
            this.vel.x = 0;
            this.accel.x = 0;
            this.currentAnim = this.anims.dead;
        }

        this.currentAnim.flip.x = this.flip;

        this.parent();
    },

    handleMovementTrace: function( res ) {
        if (res.collision.x && this.vel.x > 0) {
            this.onWallRight = true;
        } else if (res.collision.x && this.vel.x < 0) {
            this.onWallLeft = true;
        } else {
            this.onWallRight = false;
            this.onWallLeft = false;
        }

        if (res.collision.y && this.vel.y > 0) {
            this.canWallRun = true;
        }

        // Continue resolving the collision as normal
        this.parent(res);
    },

    check: function(other) {
        if (this.dead == false) {
            if (other.dead == false) {
                if (other.flip == false && this.flip == false) {
                    if (this.pos.x < other.pos.x) {
                        other.dead = true;
                    } else if (this.pos.x > other.pos.x) {
                        this.dead = true;
                    }
                } else if (other.flip == true && this.flip == true) {
                    if (this.pos.x > other.pos.x) {
                        other.dead = true;
                    } else if (this.pos.x < other.pos.x) {
                        this.dead = true;
                    }
                } else {
                    this.dead = true;
                }
            }
        }
        this.parent(other);
    }
});

});
