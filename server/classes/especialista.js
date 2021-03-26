const Persona = require('../classes/persona');
const EspecialistaModel = require('../models/especialistaSchema');
const { nombrePropio, esValidoDNI, noEstaVacio } = require('../services/formater');
class Especialista extends Persona {
    constructor(prefijo = "Dr", nombre = "", apellido = "", dni, matricula, especialidad = "", celular, mail) {
        super(nombre, apellido, dni, celular, mail);
        this.prefijo = prefijo;
        this.matricula = matricula;
        this.especialidad = especialidad;
    };

    // Métodos faltan resolver
    agregarDiaAtencion(nuevoDia) {
        this.diasAtencion.add(nuevoDia);
    };

    agregarHorarioAtencion(nuevoHorario) {
        this.horariosAtencion.add(nuevoHorario);
    };
    // Getters:
    getPrefijo() {
        return this.prefijo;
    };
    getMatricula() {
        return this.matricula;
    };
    getEspecialidad() {
        return this.especialidad;
    };

    async getEspecialistaDB(unDNI) {
        let especialista = await EspecialistaModel.findOne({ dni: unDNI });
        return new Promise((resolve, reject) => {
            if (especialista) {
                //console.log("Encontre el especialista");
                resolve(especialista);
            } else {
                reject("no encontrado paciente en db");
            }
        });
    };


    getInfoDelDNI(unDNI) {
        let especialista = this.getEspecialistaDB(unDNI);
        return new Especialista(especialista.prefijo, especialista.name, especialista.lastname, especialista.dni, especialista.matricula, especialista.especialidad, especialista.phone, especialista.email);
    }; // --> Ver si está bien esto

    getIDEspecialista(unDNI) {
        let especialista = this.getEspecialistaDB(unDNI);
        return especialista._id;
    };

    getDTO() {
        let especialista = {
            prefijo: this.getPrefijo(),
            name: nombrePropio(this.getNombre()),
            lastname: nombrePropio(this.getApellido()),
            dni: this.getDNI(),
            email: this.getEmail(),
            phone: this.getCelular(),
            matricula: this.getMatricula(),
            especialidad: nombrePropio(this.getEspecialidad())
        };
        return especialista;
    }; //--> devuelve data JSON - valida los datos

    actualizar(espJSON) {
        if (this.estaCompleto(espJSON)) {
            this.nombre = espJSON.name;
            this.apellido = espJSON.lastname;
            this.dni = espJSON.dni;
            this.celular = espJSON.phone;
            this.email = espJSON.email;
            this.matricula = espJSON.matricula;
            this.prefijo = espJSON.prefijo;
            this.especialidad = espJSON.especialidad;
        }
    };

    estaCompleto(pacienteJSON) {
        return (noEstaVacio(espJSON.name) && noEstaVacio(espJSON.lastname) && noEstaVacio(espJSON.dni) && noEstaVacio(espJSON.matricula) && noEstaVacio(espJSON.email) && noEstaVacio(espJSON.especialidad));
    };

}

module.exports = Especialista;