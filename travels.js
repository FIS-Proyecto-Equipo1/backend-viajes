const mongoose = require('mongoose');

const valores_estado = ['EN CURSO', 'FINALIZADO']
const format_duracion=new RegExp('[0-9]{3}[ ]{1}[min]{1}'); //TODO: NO FUNCIONA, CAMBIAR y AÑADIR en duracion


const travelSchema = new mongoose.Schema({
    id_cliente: {type:String, unique: true, required: true},
    id_vehiculo: {type:String, unique: true, required: true}, //TODO: MATRICULA?
    estado: {type: String, required: true, enum:valores_estado},
    duracion: {type: String, required: true}
});


const Travel = mongoose.model('Travel', travelSchema);

module.exports = Travel;