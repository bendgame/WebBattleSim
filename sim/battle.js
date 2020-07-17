const battle = (ctx, objects, field) => ({
    /*
    our Battle object contains everything in the instance needed
    to update our game logic for a single Battle instance.
     */
    // drawing context
    ctx: ctx,
    // game logic mechanics from simulation params
    UU_COLLISION: false,
    // frames
    t: 0,
    // time
    now: Date.now(),
    then: Date.now(),
    delta: 1.,
    freezedelta: 1.,
    // running / frame-based
    running: false,
    T_MAX: 2000,
    // object array for all objects
    objects: objects,
    // unit arrays
    units: objects.filter(u => u instanceof Unit),
    // alive roster
    _alive: [],
    // alive unit per team caches
    _c_alive: [],
    _r_alive: [],
    // information about the battlefield, including w and h
    field: field,
    // projectiles
    projectiles: [],
    // melee attacks
    melees: [],
    // spawners
    spawners: objects.filter(s => s instanceof Spawner),
    // turrets
    turrets: objects.filter(u => u instanceof Turret),

    // START FUNCTION to START the BATTLE
    start: function() {
        if (!this.running) {
            // check whether mechanics are set
            this.UU_COLLISION = document.getElementById("unit_collision").checked;
            // start running
            this.running = true;
            this.t = 0;
            // re-assign ids to all units
            for (let i = 0; i < this.units.length; i++) {
                this.units[i].id = i;
            }
            // set caches
            this.setCaches();
            // randomly assign start targets
            ai_init_target.nearest(this._c_alive, this._r_alive);
            // assign targets to turrets if possible
            for (let i = 0; i < this.turrets.length; i++) {
                let t = this.turrets[i],
                    enemy = this.get_enemies(t.team);
                t.target = enemy[utils.randomInt(0, enemy.length-1)];
            }
            // render once before update loop
            this.render();
        }
    },

    anim_continue: function() {
        return (this.t < this.T_MAX && this.has_alive_units());
    },

    has_alive_units: function() {
        // checks whether any alive units remain
        return (this._r_alive.length > 0 && this._c_alive.length > 0);
    },

    get_enemies: function(team) {
        // get the array of the enemy of the team passed
        if (team === TEAM.REPUBLIC) {
            return this._c_alive;
        } else if (team === TEAM.CIS) {
            return this._r_alive;
        } else {
            alert("team '" + team + "' not recognized.");
        }
    },

    get_allies: function(team) {
        if (team === TEAM.REPUBLIC) {
            return this._r_alive;
        } else if (team === TEAM.CIS) {
            return this._c_alive;
        } else {
            alert("team '" + team + "' not recognized.");
        }
    },

    filter_objects: function(every_t = 15) {
        // go through and filter out the non-alive objects every so often
        if (this.t % every_t === 0) {
            this.projectiles = this.projectiles.filter(p => p.active);
            this.melees = this.melees.filter(m => m.active);
        }
    },

    setDelta: function() {
        this.now = Date.now();
        this.delta = (this.now - this.then) / 1000.; // for seconds
        this.then = this.now;
        if (this.t % 20 === 0) {
            this.freezedelta = this.delta;
        }
    },

    setCaches: function() {
        this._alive = this.units.filter(u => u.hp > 0.);
        this._r_alive = this._alive.filter(u => u.team === TEAM.REPUBLIC);
        this._c_alive = this._alive.filter(u => u.team === TEAM.CIS);
    },

    update: function() {
        // add frame
        this.t++;
        // update clock
        this.setDelta();
        // update which units are alive...
        this.setCaches();

        let update_f = (element, i) => element.update(this);

        this.units.forEach(update_f);
        this.turrets.forEach(update_f);
        this.spawners.forEach(update_f);
        this.projectiles.forEach(update_f);
        this.melees.forEach(update_f);

        // filter out obsolete objects.
        this.filter_objects();
        // finally, draw
        this.render();
    },

    // render the battlefield.
    render: function() {
        // clears the screen
        draw.cls(this.ctx, this.field.width, this.field.height);
        // this.ctx.drawImage(this.bg_image, 0, 0, this.field.width, this.field.height);
        let render_f = (element, i) => element.render(this.ctx);

        // render in this order
        this.units.forEach(render_f);
        this.turrets.forEach(render_f);
        this.projectiles.forEach(render_f);
        this.melees.forEach(render_f);

        // add text to update timestep, number of units
        this.ctx.font = "30px Arial";
        this.ctx.strokeText("BattleSimulator", this.field.width - 220, 30);

        // add counter at bottom right
        let stats = ("Republic: " + this._r_alive.length + " CIS: "
            + this._c_alive.length + " t: " + this.t + " fps: " + Math.floor(1. / this.freezedelta));
        this.ctx.font = "12px Arial";
        this.ctx.strokeText(stats, this.field.width - 200, this.field.height - 20);
    },

})