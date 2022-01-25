const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path');

app.use(cors());
app.use(express.json());


//Serve Static assets if in production
if(process.env.NODE_ENV === 'production'){
    app.use(express.static('taiyo-web/build'));

    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'taiyo-web','build', 'index.html'));
    })
}

const dbPax = require('knex')({
    client: 'mysql2',
    connection: {
        host: "taiyoviajes.tur.ar",
        user: "taiyovia_admin",
        password: "50095009",
        database: "taiyovia_pax",
    }
});

const dbUsuario = require('knex')({
    client: 'mysql2',
    connection: {
        host: "taiyoviajes.tur.ar",
        user: "taiyovia_admin",
        password: "50095009",
        database: "taiyovia_usuario",
    }
});

app.get("/getPassengersData", async (req, res) => {
    console.log(req.originalUrl);
    dbPax.from(req.query.selectedTrip).select("*").orderBy("id", "asc").then((rows) =>{
        res.json(rows);
    })
});

app.get("/getTripsData", async (req, res) => {
    dbUsuario.from("viajes_disponibles").select("*").orderBy("fecha", "asc").then((rows) =>{
        res.json(rows);
    })
});

app.get("/getRecibosData", async (req, res) => {
    dbUsuario.from("recibos").select("*").orderBy("id", "asc").then((rows) =>{
        res.json(rows);
    })
});

app.get("/addNewRecibo", async (req, res) => {
    dbUsuario.from("recibos").insert(JSON.parse(req.query.recibo)).then(() => console.log("data inserted"))
    .catch((err) => { console.log(err); throw err });
});

app.get("/addNewPassenger", async (req, res) => {
    dbPax.from(req.query.selectedTrip).insert(JSON.parse(req.query.passenger)).then(() => console.log("data inserted"))
    .catch((err) => { console.log(err); throw err });
});

app.get("/deletePassenger", async (req, res) => {
    dbPax.from(req.query.selectedTrip).where("dni",req.query.passengerDni).del().then(() => console.log("data deleted"))
    .catch((err) => { console.log(err); throw err });
});


app.listen(3001, () => {
    console.log("LISTENING");
});