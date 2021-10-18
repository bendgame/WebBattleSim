// constructor

class IconI extends Unit {
    constructor(x, y, ai) {
        super(x
            , y
            , UNIT.IconI.SKL
            , UNIT.IconI.DEX
            , UNIT.IconI.CON
            , UNIT.IconI.MVS
            , UNIT.IconI.RANGE
            , TEAM.CIS
            , UNIT.IconI.FIRERATE
            , UNIT.IconI.DEFLECT
            , ai
            , UNIT.IconI.ATKT
            , UNIT.IconI.HDMG
            , UNIT.IconI.MDMG
            , UNIT.IconI.LDMG
            );
        // override attributes
        this.atk_type = AttackType.MELEE;
        this.sizebot = 14;
        this.sizelen = 21;

        this.lightsaber_color = (Math.random() < 0.5) ? [106, 187, 252] : [52, 237, 68];
        this.lightsaber_angle = this._angle + 20;
    }

    dealDamageFrom(source, dmg) {
        // super.dealDamageFrom(source, dmg);
        // we take no damage from units that we are targetting.
        if (source !== this.target) {
            super.dealDamageFrom(source, dmg);
        }
    }

    update(md) {
        super.update(md);
        if (this.isTargetInRange())
        {
            // update lightsaber angle
            this.lightsaber_angle += 0.25;
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