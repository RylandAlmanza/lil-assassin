ig.module(
    'game.main' 
)
.requires(
    'impact.game',
    'impact.font',

    'game.entities.player',
    'game.entities.guard',
    'game.levels.test4'
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

        this.loadLevel(LevelTest4);
    },

    update: function() {
        this.parent();

        var player = this.getEntitiesByType(EntityPlayer)[0];

        if(player) {
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
        }
    },
	
    draw: function() {
        this.parent();

        this.font.draw('Arrow Keys, Z', 2, 2)
    }
});

ig.main('#canvas', LilAssassinGame, 60, 240, 160, 2);

});
