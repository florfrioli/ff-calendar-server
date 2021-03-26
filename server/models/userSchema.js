const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

//Generamos un schema de los datos que manejara nuestra entidad
//Este es super basico se le pueden agregar condiciones de Required y demas
const userSchema = new Schema({
    email: String,
    password: String,
    especialista: { type: Schema.Types.ObjectId },
    token: String,
    admin: Boolean
});

userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password); // devuelve un boolean
};

//Pasamos nuestro esquema como parametro para crear un Modelo que nos servira de entrada a nuestra Coleccion
module.exports = model('usuarios', userSchema);