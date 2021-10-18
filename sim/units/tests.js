// A Unit is an object that can move, attack, defend and in general has a large, diverse set of
// capabilities.

/*
Units are the main object of reference which contain the D&D stats of ATK, DEX, CON, etc.
they can move and attack primarily, towards a target of reference, using a selection
of AI capabilities.
 */

class Icon3 extends Combative {

    constructor(x, y, skl, dex, con, mvs, range,
                team, fire_rate, dflr, ai, atkt, hdmg, mdmg, ldmg) {
        // call element
        super(x, y, team, con);
        // attributes
        this.hit_radius = 8;
        this.skl = skl;
        this.dex = dex;
        this.base_speed = this.speed = mvs;
        this.range = range;
        this.fire_rate = fire_rate;
        this.dflr = dflr;
        this.ai = ai;
        this.atkt = atkt;
        this.hdmg = hdmg;
        this.mdmg = mdmg;
        this.ldmg = ldmg;

        // default attack type
        this.atk_type = AttackType.PROJECTILE;
        // a critical modifier of 2 is default
        this.crit_modifier = 2.0;
        // default unit size
        this.sizebot = 10;
        this.sizelen = 17;

        this.cooldown = 0.0;

        this._crit_this_round = false;
        // a cache for astar search and an index as to where we currently are.
        this.astar = {
            // filled with list of GridNode.
            result: [],
            // index pointing to node.
            i: 0
        }
        // holds the coordinates of the tile we are over.
        this.tile = null;

    }

    _unit_collision_check(md, s) {
        // iterate over every alive unit and check (assuming not us) whether there is a single circle collision
        let collision_units = md._alive.filter(e =>
            ((e !== this) && collide.circle_circle(this.x, this.y, this.hit_radius * .7,
                e.x, e.y, e.hit_radius * .7))
        );
        // oscillate
        if (collision_units.length > 0) {
            this.updateToTarget(collision_units[0], false, true);
            this.translate(md, this.speed*-.3*s);
            this.updateToTarget();
            return true;
        }
        return false;
    }
    // public functions

    _tile_collision_check(md, s) {
        /* check to see if the updated position moves onto an unpassable tile, and if so return true.
         */
        // check if, after translation, we move onto another tile
        let fx = this.x + (this.dd.x * this.speed * s),
            fy = this.y + (this.dd.y * this.speed * s),
            tile_other = md.level.tileAt(fx, fy);

        return !tile_other.passable;
    }

    /**
     * Updates the a* cache elements.
     * assumes a valid target is set.
     */
    update_astar(md) {
        // check whether target is null, and if so we just skip
        if (this.target !== null) {
            // in the rare case our target doesn't have a tile, we use their position.
            let target_tile = (this.target.tile) ? this.target.tile : md.level.getGridNode(this.target.x, this.target.y);
            // perform a-star search.
            this.astar.result = astar.search(md.level.graph, this.tile, target_tile);
            this.astar.i = 0;
        }
    }

    /**
     * Updates the normalized directional derivatives using the tile.
     */
    _direction_astar(md) {
        if (this.astar.result.length > this.astar.i) {
            // we have another tile to move
            let node = this.astar.result[this.astar.i],
                ls = md.level.size,
                halfLevel = ls / 2,
                // convert node into pixel locations - center of the tile.
                pix_x = (node.x * ls) + halfLevel,
                pix_y = (node.y * ls) + halfLevel;

            // if we're near the current node, move on to the next one next time.
            if (this.tile.x === node.x && this.tile.y === node.y) {
                this.astar.i += 1;
            }
            // calculate derivatives and move in that direction
            this.updateToTarget({x: pix_x, y: pix_y}, false);
            // we update the angle only using the target.
            this.setAngleToTarget(this.target.x - this.x, this.target.y - this.y);

        } else {
            this.updateToTarget(this.target);
        }
    }

    move(md, speed=1.0) {

        this.speed = this.base_speed * ((this.tile.weight !== 0) ? 1/this.tile.weight : 1);

        // if we're using A*, choose the next tile along in the node list
        if (md.parameters.UNIT_MOVE_MODE === "astar") {
            // this will set directional derivatives, not angle, but not move.
            this._direction_astar(md);
        } else {
            // else derivatives are the location of our target.
            this.updateToTarget();
        }

        // if we have tile collision on
        if (md.parameters.IS_TILE_COLLISION && this._tile_collision_check(md, speed)) {
            // AND we collide with a tile, block
            return;
        }
        // if we collide with another unit..
        if (md.parameters.IS_UNIT_COLLISION && this._unit_collision_check(md, speed)) {
            return;
        }
        // now move if we can.
        this.translate(md, this.speed*speed);

    }
    
    isTargetInRange() {
        return (this._dist <= this.range);
    }

    roll_damage() {
        /* Calculates the damage roll for this round.
         */
        this._crit_this_round = false;
        let mod_damage = 0.0;
        
        
        //Determin hit strenght: heavy, medium, light
        let dmgt = Dice.d2d6();
        console.log(Dice.d2d6())
        
        //determin hit damage
        if (dmgt === 12) {
            if (Dice.d2d6() >= this.skl) {
                                               //mod_damage = (this.atk + Dice.d2d8()) - (this.target.dex + Dice.d1d8());
                mod_damage = this.hdmg;
            }
            //on 12 crit chance increases dramatically             
            if (Math.random() < 0.74)
                {
                    mod_damage *= this.crit_modifier;
                    this._crit_this_round = true;
                }
            
        } else if (dmgt >= 10) {
                    if (Dice.d2d6() >= this.skl + 4) {
                                                       //mod_damage = (this.atk + Dice.d2d8()) - (this.target.dex + Dice.d1d8());
                        mod_damage = this.hdmg;
                    }             
                    if (Math.random() < 0.03)
                        {
                            mod_damage *= this.crit_modifier;
                            this._crit_this_round = true;
                        }
                    
                      
        } else if (dmgt >= 8){
            if (Dice.d2d6() >= this.skl + 2){
                 mod_damage = this.mdmg;
            } 
            if (Math.random() < 0.03)
            {
                mod_damage *= this.crit_modifier;
                this._crit_this_round = true;
            }

        }else if (dmgt === 2){
            if (Dice.d2d6() >= this.skl + 2){
                 mod_damage = this.ldmg;
            } 
            
        } 
        else {
            if (Dice.d2d6() >= this.skl){
                mod_damage = this.ldmg;
            } 

            if (Math.random() < 0.03)
            {
                mod_damage *= this.crit_modifier;
                this._crit_this_round = true;
            }
        }
    
        return mod_damage;
    }

    roll_damage_og() {
        /* Calculates the damage roll for this round.
         */
        this._crit_this_round = false;
        let mod_damage = 0.0;
        /* Rolls attack chance as
            (BASE ATTACK + 1d6) > Opp. BASE DEX
         */
        if ((this.atk + Dice.d1d6()) >= this.target.dex) {
            // attack proceeds

            /*
            Calculate damage as:
                (BASE ATTACK + 2d8) - (Opp BASE DEX + 1d8) OR 1.
             */
            mod_damage = (this.atk + Dice.d2d8()) - (this.target.dex + Dice.d1d8());
            // make sure mod_damage is at least 1
            if (mod_damage <= 0.0) {
                mod_damage = 1.0;
            }
            /* 3% crit chance */
            if (Math.random() < 0.03)
            {
                mod_damage *= this.crit_modifier;
                this._crit_this_round = true;
            }
        }
        return mod_damage;
    }
    
    attack(md) {
        let mod_damage = this.roll_damage();

        if (mod_damage > 0.0 && this.cooldown >= this.fire_rate)
        {
            // create an object to handle this damage output
            if (this.atk_type === AttackType.PROJECTILE) {
                md.projectiles.push(new Projectile(this, mod_damage, 5., 2.5, this._crit_this_round));
            } else if (this.atk_type === AttackType.MELEE) {
                md.melees.push(new Melee(this, mod_damage, this.target));
            } else {
                alert("Attack type'" + this.atk_type + "' not recognized");
            }
            // reset the cooldown
            this.cooldown = 0.0;
        }
    }
    
    // update and render defaults

    
    dealDamageFrom(source, dmg) {
        // super.dealDamageFrom(source, dmg);
        // we take no damage from units that we are targetting.
        if (source !== this.target) {
            super.dealDamageFrom(source, dmg);
        }
    }

    update(md) {
        this.alive = this.hp > 0.0;
        if (this.alive) {
            // add on the delta to our global cooldown
            this.cooldown += md.time.delta;
            this.updateToTarget();
            // update our tile position
            this.tile = md.level.getGridNode(this.x, this.y);
            // call AI
            this.ai(this, md);
        }
        if (this.isTargetInRange())
        {
            // update lightsaber angle
            this.lightsaber_angle += 0.25;
        }
    }

    render(ctx) {
        // default rendering
        if (this.alive) {
            // hit box circle
            //draw.circle(ctx, this.x, this.y, this.color, 8);
            draw.arrow(ctx, this.x, this.y,
                this._angle, this.color, this.sizebot,
                this.sizelen);
            draw.arrow_edge(ctx, this.x, this.y, this._angle, this.sizebot, this.sizelen);
            // draw a health bar on top if damaged
            if (this.hp < this.MAX_HP && IS_HP_DISPLAYED) {
                draw.healthbar(ctx, this.x, this.y - 6, this.hp / this.MAX_HP);
            }
            // draw which tile we're over
            if (this.tile !== null && IS_TILE_DISPLAYED) {
                draw.text(ctx, this.x, this.y - 10, "("+this.tile.x+","+this.tile.y+")", [0, 0, 0]);
            }

        } else {
            draw.cross(ctx, this.x, this.y, this.color, this.sizebot);
        }

    }

    render(ctx) {
        // default rendering
        if (this.hp > 0.0) {
            // hit box circle
            // draw slightly adjusted arrow
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this._angle);
            ctx.beginPath();
            ctx.fillStyle = "rgba({0}, {1}, {2}, 0.9)".format(this.color);
            let arrlen = this.sizelen / 2,
                arrbot = this.sizebot / 2;
            ctx.moveTo(arrlen, 2);
            ctx.lineTo(arrlen, -2);
            ctx.lineTo(0, -arrbot);
            ctx.lineTo(-2, -arrbot+3);
            ctx.lineTo(-5, -arrbot);
            ctx.lineTo(-arrlen, -arrbot);
            ctx.lineTo(-arrlen, arrbot);
            ctx.lineTo(-5, arrbot);
            ctx.lineTo(-2, arrbot-3);
            ctx.lineTo(0, arrbot);
            ctx.lineTo(arrlen, 2);
            ctx.fill();
            ctx.restore();

            // draw lightsaber
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this._angle + this.lightsaber_angle);
            // draw a long rectangle stick to represent lightsaber
            ctx.fillStyle = "rgba({0},{1},{2},0.8)".format(this.lightsaber_color);
            ctx.fillRect(0, -3, 15, 2.5); //light saber dimensions
            ctx.restore();

            // draw a health bar on top if damaged
            if (this.hp < this.MAX_HP && IS_HP_DISPLAYED) {
                draw.healthbar(ctx, this.x, this.y - 6, this.hp / this.MAX_HP);
            }

        } else {
            draw.cross(ctx, this.x, this.y, this.color, this.sizebot);
        }
    }

}
