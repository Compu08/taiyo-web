const express = require("express");
const mysql = require('mysql2/promise');
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

mysql.createConnection({
    host: "taiyoviajes.tur.ar",
    user: "taiyovia_admin",
    password: "50095009",
    database: "taiyovia_pax",
}).then(dbPax => {
    const pool = mysql.createPool(dbPax);

    app.get("/getPassengersData", async (req, res) => {
        try {
            const result = await Promise.all(pool.query("SELECT * FROM Ushuaia_y_Tolhuin ORDER BY butaca"));
            res.send(result);
        } catch (error) {
            res.send(error);
        }
    });

    app.listen(3001, () => {

    });

});