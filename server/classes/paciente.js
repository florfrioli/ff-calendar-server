const Persona = require('./persona');
const PacienteModel = require('../models/pacienteSchema');
const { nombrePropio, esValidoDNI, noEstaVacio } = require('../services/formater');
class Paciente extends Persona {
    constructor(nombre = "", apellido = "", dni, obraSocial = "Particular", celular, email = "") {
        super(nombre, apellido, dni, celular, email);
        this.obraSocial = obraSocial;
        this.pacienteDB;
    };

    // Getters:
    getObraSocial() {
        return this.obraSocial;
    };

    getDTO() {
        let paciente = {
            name: nombrePropio(this.getNombre()),
            lastname: nombrePropio(this.getApellido()),
            dni: this.getDNI(),
            email: this.getEmail(),
            phone: this.getCelular(),
            obraSocial: nombrePropio(this.getObraSocial())
        };
        return paciente;
    }; //--> devuelve data JSON - valida los datos

    async getPacienteDB(unDNI) {
        let paciente = await PacienteModel.findOne({ dni: unDNI });
        return new Promise((resolve, reject) => {
            if (paciente) {
                //console.log("Encontre Paciente");
                resolve(paciente);
            } else {
                reject("no encontrado paciente en db");
            }
        });
    };

    /*  async buscarEnDB(unDNI) {
         let paciente = await PacienteModel.findOne({ dni: unDNI });
         return paciente;
     }; */

    getPacienteConDNI(unDNI) {
        this.getPacienteDB(unDNI)
            .then((paciente) => {
                const { name, lastname, dni, obraSocial, phone, email } = paciente;
                return new Paciente(name, lastname, dni, obraSocial, phone, email);
            })
            .catch((err) => { console.log("error get dni " + err) });
    };

    getIDPaciente() {
        this.getPacienteDB(unDNI)
            .then((paciente) => {
                const { _id } = paciente;
                return _id.toString();
            })
            .catch((err) => { console.log("error get id") });
    };

    actualizar(pacienteJSON) {
        if (this.estaCompleto(pacienteJSON)) {
            this.nombre = pacienteJSON.name;
            this.apellido = pacienteJSON.lastname;
            this.dni = pacienteJSON.dni;
            this.celular = pacienteJSON.phone;
            this.email = pacienteJSON.email;
            this.obraSocial = pacienteJSON.obraSocial;
        }
    };

    estaCompleto(pacienteJSON) {
        return (noEstaVacio(pacienteJSON.name) && noEstaVacio(pacienteJSON.lastname) && noEstaVacio(pacienteJSON.dni) && noEstaVacio(pacienteJSON.phone))
    };
}

module.exports = Paciente;