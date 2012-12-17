ig.module(
    'game.main' 
)
.requires(
    'impact.game',
    'impact.font',

    'game.entities.player',
    'game.entities.guard',
    'game.entities.king',
    'game.levels.main'
)
.defines(function() {

LilAssassinGame = ig.Game.extend({

    gravity: 300,

    font: new ig.Font( 'media/04b03.font.png' ),


    init: function() {
        ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
        ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
        ig.input.bind(ig.KEY.Z, 'jump');
        ig.input.bind(ig.KEY.X, 'attack');
        ig.input.bind(ig.KEY.R, 'reset');

        this.loadLevel(LevelMain);
    },

    update: function() {
        this.parent();

        var player = this.getEntitiesByType(EntityPlayer)[0];

        if(player) {
            if (ig.input.pressed('reset')) {
                ig.game.loadLevelDeferred(LevelMain);
            }
            this.screen.x = player.pos.x - ig.system.width/2;
            this.screen.y = player.pos.y - ig.system.height/2;
            if (this.screen.x < 0) {
                this.screen.x = 0;
            }
            if (this.screen.y < 0) {
                this.screen.y = 0;
            }
            m = this.backgroundMaps[0];
            if (this.screen.x > (m.width * m.tilesize) - ig.system.width) {
                this.screen.x = (m.width * m.tilesize) - ig.system.width;
            }
            if (this.screen.y > (m.height * m.tilesize) - ig.system.height) {
                this.screen.y = (m.height * m.tilesize) - ig.system.height;
            }
            var guards = this.getEntitiesByType(EntityGuard);
            for (var i = 0; i < guards.length; i++) {
                if ((guards[i].flip && player.pos.x < guards[i].pos.x) || (guards[i].flip == false && player.pos.x > guards[i].pos.x)) {
                    if (player.pos.y <= guards[i].pos.y + guards[i].size.y && player.pos.y + player.size.y >= guards[i].pos.y) {
                        var guard_center = {x: guards[i].pos.x + guards[i].size.x / 2, y: guards[i].pos.y + guards[i].size.y / 2};
                        var player_distance = {}
                        player_distance.x = (player.pos.x + player.size.x / 2) - (guards[i].pos.x + guards[i].size.x / 2);
                        player_distance.y = (player.pos.y + player.size.y / 2) - (guards[i].pos.y + guards[i].size.y / 2);
                        var tr = ig.game.collisionMap.trace(guard_center.x, guard_center.y, player_distance.x, 0, 1, 1);
                        if (!tr.collision.x && !tr.collision.y) {
                            guards[i].target = player;
                        }
                    }
                }
            }
        }
    },
	
    draw: function() {
        this.parent();

        //this.font.draw('Assassinate the king!\nArrow Keys, Z\nWalk into someone from behind to assassinate!', 2, 2)
    }
});

ig.main('#canvas', LilAssassinGame, 60, 240, 160, 3);

});
