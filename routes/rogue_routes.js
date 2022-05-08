
const express = require("express");
const db = require("../data/database");
const Rogue = require("../js_meta/rogue");
const router = express.Router();

let roguecaracter = NaN;
console.log(roguecaracter);

let ap = 0;
let hp = 0;
let sd = 0;

router.get("/", (req, res) => {
    res.redirect("main");
});

router.get("/main", async (req, res) => {
    const query = `SELECT strength,constitution,dexterity,weaponsMaster,melee,marksman,athletics,defense FROM rogue.character where id_character = 2`;
    const [data] = await db.query(query);
    const rg = data[0];
    roguecaracter = new Rogue(rg.strength, rg.constitution, rg.dexterity, rg.weaponsMaster, rg.melee, rg.marksman, rg.athletics, rg.defense);
    console.log(roguecaracter.meleeFunction());
    res.render("main",{roguecaracter:roguecaracter});
});

router.get("/melee", async (req, res) => {
    
    //console.log(roguecaracter.meleeFunction());
    res.render("main");
});

module.exports = router;