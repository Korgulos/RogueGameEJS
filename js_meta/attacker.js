//variabile and constant

let attacker = {
  health: 1000,
  shielding: 1000,
  damage: 25,
  actionPoints: 14,
  attack(){
    
  return this.damage*this.actionPoints;
},
};




module.exports = attacker;