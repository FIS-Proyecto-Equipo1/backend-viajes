const mongoose = require('mongoose');

const travelSchema = new mongoose.Schema({
    id_cliente: Number,
    id_vehiculo: Number,
    estado: String,
    duracion: Number
});

// travelSchema.methods.cleanup = function() {
//     return {id_cliente: this.id_cliente,
//             id_vehiculo: this.id_vehiculo,
//             estado: this.estado,
//             duracion:this.duracion};
// }


const Travel = mongoose.model('Travel', travelSchema);

module.exports = Travel;