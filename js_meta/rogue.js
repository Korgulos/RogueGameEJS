skils = {
  f: 1.2,
  e: 1.4,
  d: 1.6,
  c: 1.8,
  d: 2,
  a: 2.2,
  s: 2.4,
  ss: 2.6,
  sss: 2.8,
}

class Rogue {

  constructor(strength, constitution, dexterity, weaponsMaster, melee, marksman, athletics, defense) {
    this.strength = strength;
    this.constitution = constitution;
    this.dexterity = dexterity;
    this.weaponsMaster = weaponsMaster;
    this.melee = melee;
    this.marksman = marksman;
    this.athletics = athletics;
    this.defense = defense;
  }

  rogueHealth() {
    let hl = this.constitution * this.strength * skils[this.defense];
    return hl;
  }

  rogueShielding() {
    let sl = this.dexterity * this.constitution * skils[this.athletics];
    return sl;
  }

  rogueAp() {
    let ap = (this.dexterity / 10) * ((this.constitution * this.strength) / 20) * skils[this.athletics];
    ap = Math.floor(ap / 10);
    return ap;
  }

  meleeFunction() {
    let clkulus = this.strength * skils[this.melee] * skils[this.weaponsMaster];
    return clkulus;
  }
  marksmanFunction() {
    let clkulus = (this.dexterity * skils[this.marksman] * skils[this.weaponsMaster]) / 2;
    return clkulus;
  }

  defenseFunction() {
    let clkulus = ((this.strength * this.constitution * skils[this.defense]) / 10) * skils[this.defense];
    return clkulus;
  }

  athleticsFunction() {

    let clkulus = ((this.dexterity * this.constitution * skils[this.athletics]) / 10) * skils[this.athletics];
    return clkulus;
  }

  weaponsMasterFunction() {
    let clkulus = (this.meleeFunction + this.marksmanFunction) * skils[this.weaponsMaster];
    return clkulus;
  }

}



module.exports = Rogue;