class Recordatorio {
    constructor(turno = "", mensaje = "", celular = "", estado = "programado", fechaDeEnvio = "") {
        this.turno = turno; // objeto turno linkeado por id
        this.mensaje = mensaje; // Podría venir por default, o armarse un template con los datos del turno
        this.celular = celular; // A donde enviarlo
        this.estado = estado; // --> Programado, enviado, leido, recibido, etc.
        this.fechaDeEnvio = fechaDeEnvio; // Cuanta anticipación para el envío del msj
    };

    enviarRecordatorio() {
        if (this.fechaDeEnvio == fechaActual) { // ver como comparar la fecha actual
            //servicio.enviarRecordatorio
        }
    };

    modificarMensaje(nuevoMensaje) {
        this.mensaje = nuevoMensaje;
    };

    reprogramarEnvio(nuevaFecha) {
        this.fechaDeEnvio = nuevaFecha;
    };

}