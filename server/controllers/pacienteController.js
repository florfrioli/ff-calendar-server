const PacienteModel = require('../models/pacienteSchema'); // Traigo mi modelo de esquema PacienteModel
const Paciente = require('../classes/paciente');
const { esValidoDNI } = require('../services/formater');
const TurnoModel = require('../models/turnoSchema');
// Encerrando aca exporto todas.
module.exports = {
        async getPaciente(req, res) { // Nos devuelve un usuario, en caso de no encontrarlo devuelve 404
            const { params: { idordni } } = req;
            if (esValidoDNI(idordni)) {
                const paciente = await PacienteModel.findOne({ dni: idordni });
                if (paciente) return res.status(200).json({ paciente });
                else return res.status(404).json({ error: " Pacient not found/ Paciente No encontrado" });
            } else {
                const paciente = await PacienteModel.findOne({ _id: idordni });
                if (paciente) return res.status(200).json({ paciente });
                else return res.status(404).json({ error: "Pacient not found/ Paciente no encontrado" });
            }
        },

        async postPaciente(req, res) { // Agrega un usuario si se pasan nombre, apellido y email en el body de la request
            const { name, lastname, dni, obraSocial, email, phone } = req.body;
            //console.log("se hizo un post");
            //console.log(req.body);
            if (esValidoDNI(dni)) {
                if (name && lastname && email && dni && obraSocial && phone) {
                    const checkPaciente = await PacienteModel.findOne({ dni });
                    if (!checkPaciente) {
                        const paciente = new Paciente(name, lastname, dni, obraSocial, phone, email);
                        const newPaciente = new PacienteModel(paciente.getDTO()); //(req.body); //MODEL
                        newPaciente.save(newPaciente);
                        return res.status(201).json({ ok: "Paciente creado correctamente!" });
                    } else {
                        return res.status(400).json({ error: "Ya existe un paciente con ese DNI" });
                    }
                } else {
                    return res.status(400).json({ error: "Faltan propiedades" });
                }
            } else {
                return res.status(400).json({ error: "El DNI no tiene un formato válido" });
            }
        },

        async putPaciente(req, res) { // Actualiza los datos de un usuario pasandole el nombre o email como parametro
            const { dni } = req.params;
            if (esValidoDNI(dni)) {
                const { name, lastname, obraSocial, email, phone } = req.body;
                //console.log("LLEgo un put con: " + req.body);
                const update = {};
                if (name) update.name = name;
                if (lastname) update.lastname = lastname;
                if (email) update.email = email;
                if (dni) update.dni = dni;
                if (obraSocial) update.obraSocial = obraSocial;
                if (phone) update.phone = phone;

                const updatePaciente = await PacienteModel.updateOne({ dni }, update);

                if (updatePaciente.n) { //n == numero de documentos modificados
                    return res.status(200).json({ ok: "Paciente modificado correctamente!" });
                } else {
                    return res.status(404).json({ error: "Pacient not found/Paciente no encontrado" });
                }
            } else {
                return res.status(400).json({ error: "El DNI no tiene un formato válido" });
            }
        },

        async deletePaciente(req, res) { //Elimina un usuario pasandole por querys nombre y email
            const { dni } = req.query;
            if (!dni) return res.status(400).json({ error: "Not enough parameters/Faltan parametros" });
            if (esValidoDNI(dni)) {
                const paciente = await PacienteModel.findOne({ dni });
                if (paciente) {
                    await TurnoModel.deleteMany({ paciente: paciente._id });
                    PacienteModel.deleteOne({
                        dni
                    }, (err) => {
                        //Aunque no haya un documento que borrar nunca trae errores
                        //Esta query siempre devuelve status 200 como si hubiera borrado
                        if (err) {
                            return res.status(404).json({ error: "Pacient not found/Paciente no encontrado" });
                        } else {
                            return res.status(200).json({ ok: "El paciente fue eliminado" });
                        }
                    })
                } else return res.status(404).json({ error: "Pacient not found/Paciente no encontrado" });
            } else {
                return res.status(400).json({ error: "El DNI no tiene un formato válido" });
            }
        },

        async getAllPacientes(req, res) {
            const paciente = await PacienteModel.find();
            if (paciente) return res.status(200).json({ paciente });
            else return res.status(404).json({ error: "Coleccion inexistente" });
        }
    }
    //Todos los controladores los haremos con async debido a que esto nos permite usar la instruccion "await"
    //La instruccion "await", significa "esperar", hara que cuando tengamos una promesa espere a que se resuelva antes de seguir ejecutando la siguiente linea