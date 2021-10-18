
class B1Battledroid extends Unit {
    constructor(x, y, ai) {
        super(x, y, UNIT.B1Battledroid.SKL,
            UNIT.B1Battledroid.DEX, UNIT.B1Battledroid.CON,
            UNIT.B1Battledroid.MVS, UNIT.B1Battledroid.RANGE,
            TEAM.CIS, UNIT.B1Battledroid.FIRERATE,
            UNIT.B1Battledroid.DEFLECT, ai
            , UNIT.B1Battledroid.ATKT
            , UNIT.B1Battledroid.HDMG
            , UNIT.B1Battledroid.MDMG
            , UNIT.B1Battledroid.LDMG);
    }
}

class B2Battledroid extends Unit {

    constructor(x, y, ai) {
        super(x, y, UNIT.B2Battledroid.SKL,
            UNIT.B2Battledroid.DEX, UNIT.B2Battledroid.CON,
            UNIT.B2Battledroid.MVS, UNIT.B2Battledroid.RANGE,
            TEAM.CIS, UNIT.B2Battledroid.FIRERATE,
            UNIT.B2Battledroid.DEFLECT, ai
            , UNIT.B2Battledroid.ATKT
            , UNIT.B2Battledroid.HDMG
            , UNIT.B2Battledroid.MDMG
            , UNIT.B2Battledroid.LDMG);
        this.sizebot = 13;
        this.sizelen = 18;
    }

}

class CloneTrooper extends Unit {
    constructor(x, y, ai) {
        super(x, y, UNIT.CloneTrooper.SKL,
            UNIT.CloneTrooper.DEX, UNIT.CloneTrooper.CON,
            UNIT.CloneTrooper.MVS, UNIT.CloneTrooper.RANGE,
            TEAM.REPUBLIC, UNIT.CloneTrooper.FIRERATE,
            UNIT.CloneTrooper.DEFLECT, ai
            , UNIT.CloneTrooper.ATKT
            , UNIT.CloneTrooper.HDMG
            , UNIT.CloneTrooper.MDMG
            , UNIT.CloneTrooper.LDMG);
    }
}

class Jedi2 extends Icon3{
    constructor(x, y, ai) {
        super(x
            , y
            , UNIT.Jedi2.SKL
            , UNIT.Jedi2.DEX
            , UNIT.Jedi2.CON
            , UNIT.Jedi2.MVS
            , UNIT.Jedi2.RANGE
            , TEAM.REPUBLIC
            , UNIT.Jedi2.FIRERATE
            , UNIT.Jedi2.DEFLECT
            , ai
            , UNIT.Jedi2.ATKT
            , UNIT.Jedi2.HDMG
            , UNIT.Jedi2.MDMG
            , UNIT.Jedi2.LDMG);
        // override attributes
        this.atk_type = AttackType.MELEE;
        this.sizebot = 14;
        this.sizelen = 21;

        this.lightsaber_color = (Math.random() < 0.5) ? [106, 187, 252] : [52, 237, 68];
        this.lightsaber_angle = this._angle + 20;
    }
}