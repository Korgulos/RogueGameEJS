
const express = require("express");
const db = require("../data/database");
const Rogue = require("../js_meta/rogue");
const router = express.Router();


router.get("/", (req, res) => {
    res.redirect("main");

});

router.get("/main", async (req, res) => {
    const setAttribute = await queryAbilities();

    res.render("main",{setAttribute:setAttribute});

});

router.get("/start", async (req, res) => {
    const roguecaracter = await queryRogueCharacter();
    
    const query = `UPDATE rogue.abilitys SET ap = ${roguecaracter.rogueAp()}, hp = ${roguecaracter.rogueHealth()}, sh = ${roguecaracter.rogueShielding()},
    atap = 14, athp = 1100, atsh = 950, atdmg = 60 WHERE id = 1;`;
    await db.query(query);
    res.redirect("main");
});

router.get("/melee", async (req, res) => {
    roguecaracter = await queryRogueCharacter();
    const setAttribute = await queryAbilities();
    if(setAttribute.atsh == 0 && setAttribute.athp - roguecaracter.meleeFunction() >= 0){
        setAttribute.athp = setAttribute.athp - roguecaracter.meleeFunction();
    }else if(setAttribute.atsh == 0){setAttribute.athp = 0;}
    if(setAttribute.atsh - roguecaracter.meleeFunction() >= 0){
        setAttribute.atsh = setAttribute.atsh - roguecaracter.meleeFunction();
    }else{setAttribute.atsh = 0;}
    const query = `UPDATE rogue.abilitys SET athp = ${setAttribute.athp}, atsh = ${setAttribute.atsh} WHERE id = 1;`;
    await db.query(query);
    res.redirect("main");
});

router.get("/marksman", async (req, res) => {
    roguecaracter = await queryRogueCharacter();
    const setAttribute = await queryAbilities();
    if(setAttribute.athp - roguecaracter.marksmanFunction() >= 0){
        setAttribute.athp = setAttribute.athp - roguecaracter.marksmanFunction();
    }else{setAttribute.athp = 0;}
    const query = `UPDATE rogue.abilitys SET athp = ${setAttribute.athp} WHERE id = 1;`;
    await db.query(query);
    res.redirect("main");
});

router.get("/defense", async (req, res) => {
    roguecaracter = await queryRogueCharacter();
    const setAttribute = await queryAbilities();
    if(setAttribute.hp < roguecaracter.rogueHealth()){
        setAttribute.hp += roguecaracter.defenseFunction();
    }
    const query = `UPDATE rogue.abilitys SET hp = ${setAttribute.hp} WHERE id = 1;`;
    await db.query(query);
    res.redirect("main");
});

router.get("/athletics", async (req, res) => {
    roguecaracter = await queryRogueCharacter();
    const setAttribute = await queryAbilities();
    if(setAttribute.sh <= roguecaracter.rogueShielding()){
        setAttribute.sh += roguecaracter.athleticsFunction();
    }
    const query = `UPDATE rogue.abilitys SET sh = ${setAttribute.sh} WHERE id = 1;`;
    await db.query(query);
    res.redirect("main");
});

router.get("/weaponsMaster", async (req, res) => {
    roguecaracter = await queryRogueCharacter();
    const setAttribute = await queryAbilities();
    setAttribute.hp -= 500;
    setAttribute.sh -= 500;
    const query = `UPDATE rogue.abilitys SET hp = ${setAttribute.hp}, sh = ${setAttribute.sh} WHERE id = 1;`;
    await db.query(query);
    res.redirect("main");
});

/////////// Functions for routes /////////////////

async function queryAbilities() {
    const query = `SELECT ap,hp,sh,atap,athp,atsh,atdmg FROM rogue.abilitys where id = 1`;
    const [data] = await db.query(query);
    const ap = data[0].ap;
    const hp = data[0].hp;
    const sh = data[0].sh;
    const atap = data[0].atap;
    const athp = data[0].athp;
    const atsh = data[0].atsh;
    const atdmg = data[0].atdmg;
    console.log(data[0]);
    return { ap, hp, sh, atap, athp, atsh, atdmg };
}

async function queryRogueCharacter() {
    const query = `SELECT strength,constitution,dexterity,weaponsMaster,melee,marksman,athletics,defense FROM rogue.character where id_character = 1`;
    const [data] = await db.query(query);
    const rg = data[0];
    return new Rogue(rg.strength, rg.constitution, rg.dexterity, rg.weaponsMaster, rg.melee, rg.marksman, rg.athletics, rg.defense);

}


module.exports = router;