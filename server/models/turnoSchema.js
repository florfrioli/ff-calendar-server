const { Schema, model } = require('mongoose');

//Generamos un schema de los datos que manejara nuestra entidad
//Este es super basico se le pueden agregar condiciones de Required y demas
const turnoSchema = new Schema({
    start: { type: String, required: true },
    end: { type: String, required: true },
    title: { type: String, required: true },
    duracion: { type: Number, default: 15 },
    especialista: { type: Schema.Types.ObjectId, required: true }, // linkearlo con un especialista
    paciente: { type: Schema.Types.ObjectId, required: true }, // linkearlo con un paciente
    estado: { type: String, default: "ASIGNADO" },
    color: String
});

//Pasamos nuestro esquema como parametro para crear un Modelo que nos servira de entrada a nuestra Coleccion
module.exports = model('turnos', turnoSchema);