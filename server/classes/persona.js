class Persona {
    constructor(nombre = "", apellido = "", dni, celular, mail) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.celular = celular;
        this.email = mail;
    };

    //Getters:
    getNombre() {
        return this.nombre;
    };

    getApellido() {
        return this.apellido;
    };

    getDNI() {
        return this.dni;
    };

    getCelular() {
        return this.celular;
    };

    getEmail() {
        return this.email;
    };

}
module.exports = Persona;