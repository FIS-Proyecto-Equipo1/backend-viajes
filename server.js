//heroku container:push web -a urbanio-travels
//heroku container:release web -a urbanio-travels

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const Travel = require('./travels');
const VehiculosResource = require('./vehiculosResource');
const FacturasResource = require('./facturasResource.js');


var BASE_API_PATH = "/api/v1";
var app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("<html><body><h1>My server</h1></body></html>");
});


// POST crear viaje
app.post(BASE_API_PATH + "/travels", (req, res) => {
    idCliente = req.header('x-user');
    console.log(Date() + " - POST /travels");
    var travel = req.body;
    Travel.create(travel, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } 
        else {
            res.sendStatus(201);
        }
    });
});


// GET todos los viajes
app.get(BASE_API_PATH + "/travels", (req, res) => {
    idCliente = req.header('x-user');
    rolCliente = req.header('rol');
    console.log(`user: ${idCliente}`);
    console.log(`rol: ${rolCliente}`);
    console.log(Date() + " - GET /travels");
    if (idCliente) {

        if (rolCliente !== 'ADMIN') {
            console.log(Date()+" - No tiene privilegios para ver todos los viajes");
            res.status(403).send()
        }
        
        else {   
            Travel.find({}, (err, travels) => {
                if (err) {
                    console.log(Date() + "-" + err);
                    res.sendStatus(500);
                } 
                else{
                    console.log(req.query);
                    res.send(travels)
                }
            });
        }
    }
    else {
        console.log(Date()+" - No es una llamada autenticada por el api gateway");
        res.status(400).send()
    }

});


// Busqueda de viajes a través de una variable ej /travels/find?CLAVE=VALOR
app.get(BASE_API_PATH + "/travels/find", (req, res) => {
    idCliente = req.header('x-user');
    console.log(`user: ${idCliente}`);
    console.log(Date() + " - GET /travels");
    Travel.findOne(req.query, (err, travels) => {
        if (err) {
            console.log(Date() + "-" + err);
            res.sendStatus(500);

        }else if(travels == null){
            res.sendStatus(404);
        }
        else{
            console.log(req.query);
            res.status(200).send(travels)
        }
    });
});


//PATCH modificar estado viaje ej /travels/1234567
app.patch(BASE_API_PATH+'/travels/:id', async (req, res) => {
    try{
        idCliente = req.header('x-user');

        console.log(Date() + " - PATCH /travels");
        const updatedPost = await Travel.updateOne(
            {_id: req.params.id},
            {$set: {
                estado: req.body.estado,
                duracion: req.body.duracion
            }});
        res.json(updatedPost);
        //patch a vehiculos estado:trayecto->disponible
        VehiculosResource.patchVehicle(req.body.id_vehiculo, VehiculosResource.STATUS_DISPONIBLE)
        .then(() => {
            console.log("OK VEHICULOS " + req.body.id_vehiculo + " " + req.body.id_cliente + " " + req.body.duracion);
            res.sendStatus(201);
        })
        .catch((error) => {
            console.log("error llamada api vehiculos: " + error);
            res.sendStatus(404);
        });
        //post a facturas
        FacturasResource.postBills(req.body.id_cliente, req.body.id_vehiculo, req.body.duracion)
        .then(() => {
            console.log("OK FACTURAS");
            res.sendStatus(201);
        })
        .catch((error) => {
            console.log("error llamada api facturas: " + error);
            res.sendStatus(404);
        });
    }
    catch(err){
        console.log(Date() + "-" + err);
        res.sendStatus(500);
    }
});

//DELETE viaje por ID ej /travels/1234567
app.delete(BASE_API_PATH+'/travels/:id', async (req, res) => {
    try{
        idCliente = req.header('x-user');
        console.log(Date() + " - DELETE /travels");
        const updatedPost = await Travel.deleteOne(
            {_id: req.params.id},
            {$set: {estado: req.body.estado}});
        res.sendStatus(202);
    }
    catch(err){
        console.log(Date() + "-" + err);
        res.sendStatus(500);
    }
});

// // GET viajes por ID
// app.get(BASE_API_PATH + "/travels/:id", (req, res) => {
//     console.log(Date() + " - GET /travels");
//     Travel.findById(req.params.id, (err, travels) => {
//         if (err) {
//             console.log(Date() + "-" + err);
//             res.sendStatus(500);
//         } else {
//             res.send(travels)
//         }
//     });
// });


module.exports = app;