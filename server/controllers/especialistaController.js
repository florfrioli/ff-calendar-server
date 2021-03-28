const EspecialistaModel = require('../models/especialistaSchema'); // Traigo mi modelo de esquema Especialista
const Especialista = require('../classes/especialista');
const { esValidoDNI } = require('../services/formater');
const userModel = require('../models/userSchema');
// Encerrando aca exporto todas.
module.exports = {
        async getEspecialista(req, res) { // Nos devuelve un usuario, en caso de no encontrarlo devuelve 404
            const { params: { idordni } } = req;

            const especialista = await EspecialistaModel.findOne({ $or: [{ "dni": idordni }, { "id": idordni }] });
            if (especialista) return res.status(200).json({ especialista });
            else return res.status(404).json({ error: "Especialista not found/Especialista no encontrado" });


        },

        async postEspecialista(req, res) { // Agrega un usuario si se pasan nombre, apellido y email en el body de la request
            const { prefijo, name, lastname, dni, matricula, especialidad, email, phone } = req.body;
            //console.log(req.body);
            if (esValidoDNI(dni)) {
                if (prefijo && name && lastname && email && dni && phone && matricula && especialidad) {
                    const checkEspecialista = await EspecialistaModel.findOne({ dni });
                    if (!checkEspecialista) {
                        const especialista = new Especialista(prefijo, name, lastname, dni, matricula, especialidad, phone, email);
                        const newEspecialista = new EspecialistaModel(especialista.getDTO());
                        newEspecialista.save(newEspecialista);
                        return res.status(201).json({ ok: "Especialista creado correctamente!" });
                    } else {
                        return res.status(400).json({ error: "Ya existe un especialista con ese DNI" });
                    }
                } else {
                    return res.status(400).json({ error: "Faltan propiedades" });
                }
            } else {
                return res.status(400).json({ error: "El DNI no tiene un formato válido" });
            }
        },

        async putEspecialista(req, res) { // Actualiza los datos de un usuario pasandole el nombre o email como parametro
            const { dni } = req.params;
            const { prefijo, name, lastname, matricula, especialidad, email, phone } = req.body;
            if (esValidoDNI(dni)) {
                const update = {};
                if (prefijo) update.prefijo = prefijo;
                if (name) update.name = name;
                if (lastname) update.lastname = lastname;
                if (email) update.email = email;
                if (dni) update.dni = dni;
                if (matricula) update.matricula = matricula;
                if (especialidad) update.especialidad = especialidad;
                if (phone) update.phone = phone;

                const updateEspecialista = await EspecialistaModel.updateOne({ dni }, update);

                if (updateEspecialista.n) { //n == numero de documentos modificados
                    return res.status(200).json({ ok: "El especialista fue modificado." });
                } else {
                    return res.status(404).json({ error: "Especialista not found/Especialista no encontrado" });
                }
            } else {
                return res.status(404).json({ error: "El DNI no tiene un formato válido" });
            }
        },

        async deleteEspecialista(req, res) { //Elimina un usuario pasandole por querys nombre y email
            const { dni } = req.query;
            if (!dni) return res.status(400).json({ error: "Not enough parameters/Faltan parametros" });
            else {
                const especialista = await EspecialistaModel.findOne({ dni });
                if (especialista) {
                    EspecialistaModel.deleteOne({ dni }, (err) => {
                        if (err) {
                            return res.status(404).json({ error: "Especialista not found/Especialista no encontrado" });
                        } else {
                            userModel.deleteOne({ especialista: especialista._id }, (error) => {
                                if (error) {} else return res.status(200).json({ ok: "El especialista fue eliminado." });
                            })
                        }
                    })
                } else {
                    return res.status(400).json({ error: "Especialista no encontrado" });
                }
            }
        },

        async getAllEspecialistas(req, res) {
            const especialista = await EspecialistaModel.find();
            if (especialista) return res.status(200).json({ especialista });
            else return res.status(404).json({ error: "Coleccion inexistente" });
        }
    }
    //Todos los controladores los haremos con async debido a que esto nos permite usar la instruccion "await"
    //La instruccion "await", significa "esperar", hara que cuando tengamos una promesa espere a que se resuelva antes de seguir ejecutando la siguiente linea