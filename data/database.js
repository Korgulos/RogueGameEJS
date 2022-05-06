const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    database: "rogue",
    user: "root",
    password: "777VoivoD777"
});

module.exports = pool;