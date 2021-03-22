const utils = {
    /**
     * Calculates the euclidean distance between two points.
     * @param x1 : float
     * @param y1 : float
     * @param x2 : float
     * @param y2 : float
     * @returns {number}
     */
    distanceXY: function(x1, y1, x2, y2) {
        /* Computes 2D euclidean distance using points x1,x2 and y1,y2.
         */
        let dx = x2 - x1,
            dy = y2 - y1;
        return Math.sqrt(dx*dx + dy*dy);
    },

    /**
     * Calculates the euclidean distance from two derivatives.
     * @param dx : float
     * @param dy : float
     * @returns {number}
     */
    distance2XY: function(dx, dy) {
        /* Using the pre-calculated derivatives dx = x2-x1, dy = y2-y1
        Calculates the euclidean distance between them.
         */
        return Math.sqrt(dx*dx + dy*dy);
    },
    rotate: function(cx, cy, x, y, angle) {
        // rotate clockwise x, y around central point cx, cy by degrees angle
        let radians = (Math.PI / 180.0) * angle,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            dx = x - cx,
            dy = y - cy,
            nx = (cos * dx) + (sin * dy) + cx,
            ny = (cos * dy) - (sin * dx) + cy;
        return [nx, ny];
    },
    uniform: function(a, b) {
        return Math.random() * (b - a) + a;
    },
    randomInt: function(min, max) {
        // returns min... max-1
        return Math.floor(min + Math.random() * (max - min + 1));
    },
    gauss1: function(start, end) {
        let r = 0,
            v = 6;
        for (let i = v; i > 0; i--)
        {
            r += Math.random();
        }
        return (r / v) * (end - start) + start;

    },
    gauss2: function() {
        /* A standard gaussian with 0 mean and 1 std
        * gauss improves in accuracy as v -> inf. */
        let r = 0,
            v = 6;
        for (let i = v; i > 0; i--)
        {
            r += Math.random();
        }
        return r / v;
    },
    uniformArray: function(n, a=0, b=1) {
        // @ts-ignore
        return Array.from({length: n}, () => Math.random() * (b - a) + a);
    },
    gaussianArray: function(n, m = 0, sd  = 1) {
        let e = [];
        for (let i = 0; i < n; i++) {
            e.push(utils.gauss1(m, sd));
        }
        return e;
    },
    fade: function(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    },
    perlin_scale: function(n) {
        return (1 + n) / 2;
    },
    lerp: function(t, a, b) {
        return a + t * (b - a);
    },
    minmax: function(t, a, b) {
        /* Converts variable in range [a, b] to [0, 1] */
        return (t - a) / (b - a);
    },
    grad: function(hash, x, y, z) {
        let h = hash & 15,
            u = h < 8 ? x : y,
            v = h < 4 ? y : h===12||h===14 ? x : z;
        return ((h&1) === 0 ? u : -u) + ((h&2) === 0 ? v : -v);
    },
    rgb_greyscale: function(value) {
        /* converts a value in range [0..1] to greyscale RGB */
        return [Math.floor(value*255), Math.floor(value*255), Math.floor(value*255)];
    }
};

String.prototype.format = function (args) {
    let str = this;
    // @ts-ignore
    return str.replace(String.prototype.format.regex, function(item) {
        let intVal = parseInt(item.substring(1, item.length - 1)),
            replace;
        if (intVal >= 0) {
            replace = args[intVal];
        } else if (intVal === -1) {
            replace = "{";
        } else if (intVal === -2) {
            replace = "}";
        } else {
            replace = "";
        }
        return replace;
    });
};

String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");
