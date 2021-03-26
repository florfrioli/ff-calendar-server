module.exports = {
    nombrePropio(string) {
        let mayuscula = string.charAt(0).toUpperCase();
        let resto = string.slice(1).toLowerCase();
        return `${mayuscula}${resto}`;
    },

    esValidoDNI(numero) {
        var ex_regular_dni;
        ex_regular_dni = /^\d{8}(?:[-\s]\d{4})?$/;
        return (ex_regular_dni.test(String(numero)));
    },

    noEstaVacio(string) {
        return (string != null && string != "");
    }

};