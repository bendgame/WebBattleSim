
const BATTLE_TEMPLATE = {
    // default templates
    OPPOSITE_AGGRESSIVE: function(canvas, level) {
        let g1 = unit_group.random_tile_spawn(CloneTrooper, 2, level, AI.aggressive),
            g2 = unit_group.random_tile_spawn(B1Battledroid, 4, level, AI.aggressive),
            // now concat to form units
            units = g1.concat(g2);
        return battle(canvas, units, level);
    },
    SNIPERS_NEST: function(canvas, level) {

        let w = canvas.width,
            h = canvas.height;

        let g1 = unit_group.random_tile_group_spawn(CloneTrooper, 15, level, AI.stand),
            g2 = unit_group.random_tile_spawn(B1Battledroid, 50, level, AI.aggressive),
            g3 = unit_group.random_tile_group_spawn(CloneSharpshooter, 4, level, AI.aggressive),
            units = g1.concat(g2, g3);
        return battle(canvas, units, level);
    },
    JEDI_DEFENDERS: function(canvas, level) {
        let w = canvas.width,
            h = canvas.height;
        let g2 = unit_group.make_gaussian(B1Battledroid, 50, w * .5, w * .5 + 50,
                h * .5, h * .5 + 50, AI.aggressive),
            g3 = unit_group.make_gaussian(Jedi, 10, 30, 150,
                20, 150, AI.aggressive),
            g4 = unit_group.make_gaussian(B2Battledroid, 10, w * .8, w * .8 + 50,
                h * .5, h * .5 + 50, AI.aggressive),
            units = g2.concat(g3, g4);
        return battle(canvas, units, level);
    },
    GUERRILLA_WARFARE: function(canvas, level) {
        let w = canvas.width,
            h = canvas.height;
        let g2 = unit_group.make_gaussian(B1Battledroid, 50, w * .5, w * .5 + 50,
                h * .5, h * .5 + 50, AI.aggressive),
            g3 = unit_group.make_gaussian(CloneTrooper, 15, 30, 150,
                20, 150, AI.hit_and_run),
            g4 = unit_group.make_gaussian(CloneTrooper, 15, w * .8, w * .8 + 50,
                h * .8, h * .8 + 50, AI.hit_and_run),
            g5 = unit_group.make_gaussian(CloneSharpshooter, 2, w * .7, w * .8 + 50,
                h * .8, h * .8 + 50, AI.aggressive),
            g6 = unit_group.make_gaussian(B2Battledroid, 10, w * .5, w * .5 + 50,
                h * .5, h * .5 + 50, AI.aggressive),
            units = g2.concat(g3, g4, g5, g6);
        return battle(canvas, units, level);
    },
    TOWER_DEFENCE: function(canvas, level) {
        let w = canvas.width,
            h = canvas.height;
        let g1 = unit_group.make_gaussian(B1Battledroid, 50, w * .5, w * .5 + 50,
                h * .5, h * .5 + 50, AI.aggressive),
            g2 = unit_group.make_gaussian(CloneTrooper, 15, 30, 150,
                20, 150, AI.hit_and_run),
            t = [
                new Turret(30, 30, 500, 5., 100., TEAM.REPUBLIC, 0.06),
                new Turret(70, 30, 500, 5., 100., TEAM.REPUBLIC, 0.06),
                new Turret(30, 70, 500, 5., 100., TEAM.REPUBLIC, 0.06),
                new Turret(70, 70, 500, 5., 100., TEAM.REPUBLIC, 0.06),
                new Turret(w * .4, h * .4, 500, 5., 100., TEAM.CIS, 0.06),
            ],
            objs = g1.concat(g2, t);
        return battle(canvas, objs, level);
    },
    OVERWHELMING_ODDS: function(canvas, level) {
        let w = canvas.width,
            h = canvas.height;
        let clones = unit_group.make_gaussian(CloneTrooper, 25, w * .4, w * .4 + 50,
                h * .4, h * .4 + 50, AI.aggressive),
            droids = unit_group.make_gaussian(B1Battledroid, 5, w * .8, w * .8 + 50,
            h * .7, w * .7 + 50, AI.aggressive),
            other = [new Jedi(w*.4, h*.4+50, AI.aggressive),
                new RandomTileSpawner(UNIT.B1Battledroid, 0.03)],
            objs = clones.concat(droids, other);
        return battle(canvas, objs, level);
    },
    OBSTACLE_NAVIGATION: function(canvas, level) {
        let w = canvas.width,
            h = canvas.height;
        let clones = unit_group.make_gaussian(CloneTrooper, 2, w * .4, w * .4 + 50,
                h * .4, h * .4 + 50, AI.aggressive),
            droids = unit_group.make_gaussian(B1Battledroid, 5, w * .8, w * .8 + 50,
                h * .7, w * .7 + 50, AI.aggressive),
            objs = clones.concat(droids, [new RectObstacle(w/2, 100, 50, h / 2)]);
        return battle(canvas, objs, level);
    },
}