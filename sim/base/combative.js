// combative objects have an identifier,
// and a *Target* as well as
// positional, team and color coordinates from Sprite

/*
A Combative extends Sprite, has a position id, with hit points and a potential target object of interest.
Combative also can move, so they contain dx and dy, with temp variables _nddx, _nddy which are normalized
directions of which way to go.
 */

class Combative extends Sprite {

    /**
     * Creates a 'combative'.
     * @param x : float
     * @param y : float
     * @param team : number
     * @param con : number
     */
    constructor(x, y, team, con) {
        super(x, y, team);
        // set ID and hit points
        // constitution converted directly to HP
        this.hp = this.MAX_HP = 20 + (con * 7);
        // target set to null
        this.target = null;
        // a bunch of hidden parameters for directional derivatives
        this.dx = 0.0;
        this.dy = 0.0;

        // floats
        this._nddx = 0.0;
        this._nddy = 0.0;
        this._dist = 0.0;
        this._angle = 0.0;
    }

    /**
     * Updates the derivative variables to the new target location.
     * @param other : {}
     * @param update_angle : boolean
     * @param add_perturbation : boolean
     */
    updateToTarget(other = this.target,
                   update_angle = true,
                   add_perturbation = false) {

        if (other) {
            if (add_perturbation)
            {
                this.dx = other.x - this.x + (Math.random() * 2 - 1);
                this.dy = other.y - this.y + (Math.random() * 2 - 1);
            }
            else {
                this.dx = other.x - this.x;
                this.dy = other.y - this.y;
            }
            this._dist = utils.distance2XY(this.dx, this.dy);
            // calculate normalized directional derivatives
            this._nddx = this.dx / this._dist;
            this._nddy = this.dy / this._dist;
            // update the directional angle (to plot arrow).
            if (update_angle) {
                this._angle = Math.atan2(this.dy, this.dx);
            }
        }
    }

    /**
     * Moves the combative in the direction of its derivative.
     * @param md : battle
     * @param speed : float
     */
    translate(md, speed) {
        this.x += this._nddx * speed;
        this.y += this._nddy * speed;
        // bounds check to edge of the map
        this.bounds_check(md);
    }

    angleToTarget() {
        return this._angle;
    }

    dealDamageFrom(source, dmg) {
        // default setting; apply damage directly to the HP.
        this.hp -= dmg;
    }

    isTargetAlive() {
        return (this.target && this.target.hp > 0.0);
    }

}