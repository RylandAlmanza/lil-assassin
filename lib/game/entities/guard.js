ig.module(
    'game.entities.guard'
)
.requires(
    'impact.entity'
)
.defines(function() {

EntityGuard = ig.Entity.extend({
    size: {x: 8, y: 8},

    maxVel: {x: 50, y: 200},
    friction: {x: 600, y: 0},

    type: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,

    animSheet: new ig.AnimationSheet('media/guard.png', 8, 8),

    flip: false,
    accelGround: 400,
    accelAir: 200,
    jump: 125,
    health: 10,
    dead: false,
    target: null,

    init: function(x, y, settings) {
        this.parent(x, y, settings);

        this.addAnim('idle', 1, [0]);
        this.addAnim('run', 0.4, [0, 1]);
        this.addAnim('dead', 1, [5]);

        var accel = this.standing ? this.accelGround : this.accelAir;
        this.accel.x = -accel;
    },

    update: function() {
        if (!this.dead) {
            if (this.target != null) {
                var accel = this.standing ? this.accelGround : this.accelAir;
                var guard_center = {x: this.pos.x + this.size.x / 2, y: this.pos.y + this.size.y / 2};
                var target_distance = {}
                target_distance.x = (this.target.pos.x + this.target.size.x / 2) - (this.pos.x + this.size.x / 2);
                target_distance.y = (this.target.pos.y + this.target.size.y / 2) - (this.pos.y + this.size.y / 2);
                var tr = ig.game.collisionMap.trace(guard_center.x, guard_center.y, target_distance.x, target_distance.y, 1, 1);
                if (!tr.collision.x && !tr.collision.y) {
                    if (this.target.pos.x > this.pos.x) {
                        this.accel.x = accel;
                    } else if (this.target.pos.x < this.pos.x) {
                        this.accel.x = -accel;
                    }
                } else {
                    this.target = null;
                    this.accel.x = -accel;
                }
            }
            if (this.vel.x != 0) {
                if (this.vel.x > 0) {
                    this.flip = false;
                } else if (this.vel.x < 0) {
                    this.flip = true;
                }
                this.currentAnim = this.anims.run;
            } else {
                this.currentAnim = this.anims.idle;
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
        if (this.target == null) {
            if (res.collision.x) {
                var accel = this.standing ? this.accelGround : this.accelAir;
                if (this.vel.x > 0) {
                    this.accel.x = -accel;
                } else if (this.vel.x < 0) {
                    this.accel.x = accel;
                }
            }
        }

        // Continue resolving the collision as normal
        this.parent(res);
    }
});

});
