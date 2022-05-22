const express = require("express");
const db = require("../data/database");
const Rogue = require("../js_meta/rogue");
const attacker = require("../js_meta/attacker");
const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("main");
});

router.get("/main", async (req, res) => {
  const setAttribute = await queryAbilities();

  res.render("main", { setAttribute: setAttribute });
});

router.get("/start", async (req, res) => {
  const roguecaracter = await queryRogueCharacter();
  const query = `UPDATE rogue.abilitys SET ap = ${roguecaracter.rogueAp()}, hp = ${roguecaracter.rogueHealth()}, sh = ${roguecaracter.rogueShielding()},
    atap = ${attacker.actionPoints}, athp = ${attacker.health}, atsh = ${
    attacker.shielding
  }, atdmg = ${attacker.damage} WHERE id = 1;`;
  await db.query(query);
  res.redirect("main");
});

router.get("/melee", async (req, res) => {
  roguecaracter = await queryRogueCharacter();
  const setAttribute = await queryAbilities();
  meleeAttack(setAttribute);
  apCounter(setAttribute);
  await queryEnd(setAttribute);
  res.redirect("main");
});

router.get("/marksman", async (req, res) => {
  roguecaracter = await queryRogueCharacter();
  const setAttribute = await queryAbilities();
  marksmanAttack(setAttribute);
  apCounter(setAttribute);
  await queryEnd(setAttribute);
  res.redirect("main");
});

router.get("/defense", async (req, res) => {
  roguecaracter = await queryRogueCharacter();
  const setAttribute = await queryAbilities();
  if (setAttribute.hp < roguecaracter.rogueHealth()) {
    setAttribute.hp += roguecaracter.defenseFunction();
  }
  apCounter(setAttribute);
  await queryEnd(setAttribute);
  res.redirect("main");
});

router.get("/athletics", async (req, res) => {
  roguecaracter = await queryRogueCharacter();
  const setAttribute = await queryAbilities();
  if (setAttribute.sh <= roguecaracter.rogueShielding()) {
    setAttribute.sh += roguecaracter.athleticsFunction();
  }
  apCounter(setAttribute);
  await queryEnd(setAttribute);
  res.redirect("main");
});

router.get("/weaponsMaster", async (req, res) => {
    roguecaracter = await queryRogueCharacter();
    const setAttribute = await queryAbilities();
    if (setAttribute.ap > 6) {
        for (let i = 0; i < 6; i++) {
            marksmanAttack(setAttribute);
            meleeAttack(setAttribute);
            apCounter(setAttribute);
        }
    }
    
    await queryEnd(setAttribute);
    res.redirect("main");
});

router.get("/character", async (req, res) => {
  const setAttribute = await queryAbilities();
  roguecaracter = await queryRogueCharacter();
  roguecaracter.athletics

  res.render("character", { roguecaracter: roguecaracter });
});

/////////// Functions for routes /////////////////

function marksmanAttack(setAttribute) {
  if (setAttribute.athp - roguecaracter.marksmanFunction() >= 0) {
    setAttribute.athp = setAttribute.athp - roguecaracter.marksmanFunction();
  } else {
    setAttribute.athp = 0;
  }
}

async function queryEnd(setAttribute) {
  const query = `UPDATE rogue.abilitys SET ap = ${setAttribute.ap},
    athp = ${setAttribute.athp}, atsh = ${setAttribute.atsh}, 
    hp = ${setAttribute.hp}, sh = ${setAttribute.sh} WHERE id = 1;`;
  await db.query(query);
}

function meleeAttack(setAttribute) {
  if (
    setAttribute.atsh == 0 &&
    setAttribute.athp - roguecaracter.meleeFunction() >= 0
  ) {
    setAttribute.athp = setAttribute.athp - roguecaracter.meleeFunction();
  } else if (setAttribute.atsh == 0) {
    setAttribute.athp = 0;
  }
  if (setAttribute.atsh - roguecaracter.meleeFunction() >= 0) {
    setAttribute.atsh = setAttribute.atsh - roguecaracter.meleeFunction();
  } else {
    setAttribute.atsh = 0;
  }
}

function apCounter(setAttribute) {
  if (setAttribute.ap >= 2) {
    setAttribute.ap -= 1;
  } else {
    setAttribute.ap = roguecaracter.rogueAp();
    if (setAttribute.sh - attacker.attack() >= 0) {
      setAttribute.sh = setAttribute.sh - attacker.attack();
    } else {
      setAttribute.sh = 0;
    }
    if (setAttribute.sh == 0 && setAttribute.hp - attacker.attack() >= 0) {
      setAttribute.hp = setAttribute.hp - attacker.attack();
    } else if (setAttribute.sh == 0) {
      setAttribute.hp = 0;
    }
  }
}

async function queryAbilities() {
  const query = `SELECT ap,hp,sh,atap,athp,atsh,atdmg FROM rogue.abilitys 
  where id = 1`;
  const [data] = await db.query(query);
  const ap = data[0].ap;
  const hp = data[0].hp;
  const sh = data[0].sh;
  const atap = data[0].atap;
  const athp = data[0].athp;
  const atsh = data[0].atsh;
  const atdmg = data[0].atdmg;
  return { ap, hp, sh, atap, athp, atsh, atdmg };
}

async function queryRogueCharacter() {
  const query = `SELECT strength,constitution,dexterity,weaponsMaster,melee,
  marksman,athletics,defense FROM rogue.character where id_character = 1`;
  const [data] = await db.query(query);
  const rg = data[0];
  return new Rogue(
    rg.strength,
    rg.constitution,
    rg.dexterity,
    rg.weaponsMaster,
    rg.melee,
    rg.marksman,
    rg.athletics,
    rg.defense
  );
}


module.exports = router;
