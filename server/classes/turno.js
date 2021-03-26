const Paciente = require("./paciente");
const Especialista = require("./especialista");
const { nombrePropio, esValidoDNI, noEstaVacio } = require('../services/formater');
class Turno {
    constructor(anio = "2021", mes = "", dia = "", hora = "", minutos = "", especialista, paciente, estado = "PENDIENTE") {
        this.anio = anio; // ver como modelar fecha y hora
        this.mes = mes; // ver como modelar fecha y hora
        this.dia = dia; // ver como modelar fecha y hora
        this.hora = hora;
        this.minutos = minutos;
        this.duracion = 15; // deberia ser la duracion del especialista
        this.especialista = especialista; // Sería un objeto especialista
        this.paciente = paciente; // Sería un objeto paciente linkeado por id
        this.estado = estado; // --> Asignado, confirmado, cancelado, atendido
        this.color = '#AD8BE0';
    };

    // A partir de los datos del turno, devuelve un objeto "evento" que es lo que lee el calendar.
    // --> VER COMO MODELAR LA FECHA Y HORA

    armarJSON() {
        return new Promise((resolve, reject) => {
            this.getEspecialistaDelTurno()
                .then((especialista) => {
                    let idEspecialista = especialista._id;
                    this.getPacienteDelTurno()
                        .then((paciente) => {
                            let idPaciente = paciente._id;
                            let titulo = this.armarTituloDelEvento(paciente);
                            //console.log(`paciente-id: ${idPaciente} - titulo: ${titulo} - esp-id ${idEspecialista}`);
                            if (idPaciente && titulo && idEspecialista) {
                                resolve({
                                    title: titulo,
                                    start: this.getInicioTurno(),
                                    end: this.getFinTurno(),
                                    paciente: idPaciente,
                                    especialista: idEspecialista,
                                    color: this.getNewColor(this.estado),
                                    estado: this.estado,
                                    duracion: this.duracion
                                });
                            } else {
                                reject("datos incompletos");
                            }
                        })
                        .catch((err) => { console.log(err); });
                })
                .catch((err) => console.log(err));
        })
    }

    async getDTO() {
        return new Promise((resolve, reject) => {
            this.armarJSON()
                .then((respuesta => {
                    resolve(respuesta);
                }))
                .catch((err) => console.log(err));
        })
    };

    getPacienteDelTurno() {
        return new Promise((resolve, reject) => {
            let pax = new Paciente();
            pax.getPacienteDB(this.paciente)
                .then((paciente) => {
                    if (paciente) {
                        resolve(paciente);
                    } else {
                        reject("errorrrrr");
                    }
                })
                .catch((err) => console.log(err));
        })
    };

    getInicioTurno() {
        return `${this.anio}-${this.mes}-${this.dia}T${this.hora}:${this.minutos}:00`;
    };

    getFinTurno() {
        let fin = this.duracion + Number(this.minutos);
        return `${this.anio}-${this.mes}-${this.dia}T${this.hora}:${fin}:00`;
    };

    async getEspecialistaDelTurno() {
        return new Promise((resolve, reject) => {
            let esp = new Especialista();
            esp.getEspecialistaDB(this.especialista)
                .then((especialista) => {
                    if (especialista) {
                        resolve(especialista);
                    } else {
                        reject("errorrrrr");
                    }
                })
                .catch((err) => console.log(err));
        })
    };

    getIDBusqueda() {
        let paciente = new Paciente();
        paciente.getPacienteDB(this.paciente)
            .then((paciente) => {
                const { _id } = paciente;
                //console.log("id: " + _id);
                return (_id.toString());
            })
            .catch((err) => {
                console.log("error: " + err);
                return null;
            });
    };


    armarTituloDelEvento(paciente) {
        let pax = new Paciente();
        pax.actualizar(paciente);
        return `${pax.getApellido()}, ${pax.getNombre()}`;
    };

    setEstado(nuevoEstado) {
        this.estado = nuevoEstado;
        this.actualizarColor(nuevoEstado);
    };

    // Cambia el color del turno
    getNewColor(estado) {
        switch (estado) {
            case "CONFIRMADO":
                return '#593196';
            case "ATENDIDO":
                return '#1A98ED';
            case "PENDIENTE":
                return '#AD8BE0';
            case "CANCELADO":
                return '#FC5185';
            case "EN ESPERA":
                return '#1AE5EF';
            case "AUSENTE":
                return '#FFC2E9';
            default:
                return '#99C1FC';
        }
    };

    getColor() {
        return this.color;
    };
}

module.exports = Turno;