const { Schema, model } = require('mongoose');

//Generamos un schema de los datos que manejara nuestra entidad
//Este es super basico se le pueden agregar condiciones de Required y demas
const especialistaSchema = new Schema({
    prefijo: { type: String, default: "DR." },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    dni: { type: Number, required: true },
    matricula: { type: Number, required: true },
    especialidad: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true }
});

//Pasamos nuestro esquema como parametro para crear un Modelo que nos servira de entrada a nuestra Coleccion
module.exports = model('especialistas', especialistaSchema);