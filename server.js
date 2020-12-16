var express = require('express');
var bodyParser = require('body-parser');
const Travel = require('./travels');

var BASE_API_PATH = "/api/v1";

var app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("<html><body><h1>My server</h1></body></html>");
});

// GET viajes
app.get(BASE_API_PATH + "/travels", (req, res) => {
    console.log(Date() + " - GET /travels");
    Travel.find({}, (err, travels) => {
        if (err) {
            console.log(Date() + "-" + err);
            res.sendStatus(500);
        } else {
            res.send(travels.map((travel) => {
                return travel;
            }));
        }
    });
});

// GET viajes por ID
app.get(BASE_API_PATH + "/travels/:id", (req, res) => {
    console.log(Date() + " - GET /travels");
    Travel.findById(req.params.id, (err, travels) => {
        if (err) {
            console.log(Date() + "-" + err);
            res.sendStatus(500);
        } else {
            res.send(travels)
        }
    });
});

// GET viaje por ID de cliente
app.get(BASE_API_PATH + "/travels/cliente/:id", (req, res) => {
    console.log(Date() + " - GET /travels");
    Travel.find({id_cliente:req.params.id}, (err, travels) => {
        if (err) {
            console.log(Date() + "-" + err);
            res.sendStatus(500);
        } else {
            res.send(travels)
        }
    });
});

// POST crear viaje
app.post(BASE_API_PATH + "/travels", (req, res) => {
    console.log(Date() + " - POST /travels");
    var travel = req.body;
    Travel.create(travel, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(201);
        }
    });
});




module.exports = app;