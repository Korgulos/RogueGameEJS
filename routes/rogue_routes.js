const express = require("express");
const db = require("../data/database")

const router = express.Router();

router.get("/",(req,res)=>{
    res.redirect("main");
});

router.get("/main",async (req,res)=>{
    //const [posts] = await db.query("SELECT * FROM posts INNER JOIN authors ON posts.author_id = authors.id_authors");
    res.render("main");
});



module.exports = router;