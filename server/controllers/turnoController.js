const TurnoModel = require('../models/turnoSchema.js'); // Traigo mi modelo de esquema Turno
const Turno = require('../classes/turno.js'); // Traigo mi modelo de esquema Turno
const { esValidoDNI } = require('../services/formater.js');

// Encerrando aca exporto todas.
module.exports = {
        async getTurno(req, res) { // Nos devuelve un usuario, en caso de no encontrarlo devuelve 404
            const { params: { idordni } } = req;
            const turno = await TurnoModel.findOne({
                $or: [
                    { "_id": idordni },
                    { "paciente": idordni }
                ]
            }); // VER CON QUE BUSCAR.
            if (turno) return res.status(200).json({ turno });
            else return res.status(404).json({ error: "Not found/No encontrado" });
        },

        async getTurnoPaciente(req, res) { // Nos devuelve un usuario, en caso de no encontrarlo devuelve 404
            const { params: { id } } = req;
            const turnos = await TurnoModel.find({ "paciente": id });
            if (turnos) return res.status(200).json({ turnos });
            else return res.status(404).json({ error: "Not found/No encontrado" });
        },

        async getTurnoEspecialista(req, res) { // Nos devuelve un usuario, en caso de no encontrarlo devuelve 404
            const { params: { id } } = req;
            const turnos = await TurnoModel.find({ "especialista": id });
            if (turnos) return res.status(200).json({ turnos });
            else return res.status(404).json({ error: "Not found/No encontrado" });
        },

        async postTurno(req, res) { // Agrega un usuario si se pasan nombre, apellido y email en el body de la request
            const { anio, mes, dia, hora, minutos, duracion, especialista, paciente } = req.body;
            //console.log("se hizo un post");
            //console.log(req.body);
            if (anio && mes && dia && hora && minutos && duracion && paciente && especialista) {
                if (esValidoDNI(paciente) && esValidoDNI(especialista)) {
                    const turno = new Turno(anio, mes, dia, hora, minutos, especialista, paciente);
                    const checkTurno = await TurnoModel.findOne({
                        $and: [
                            { start: turno.getInicioTurno() },
                            { end: turno.getFinTurno() },
                            { paciente: turno.getIDBusqueda() }
                        ]
                    }); // Ver el findOne
                    if (!checkTurno) {
                        turno.getDTO()
                            .then((infoTurno) => {
                                const newTurno = new TurnoModel(infoTurno);
                                newTurno.save(newTurno);
                                return res.status(201).json({ ok: "turno Creado correctamente" });
                            })
                            .catch((err) => {
                                return res.status(400).json({ error: "turno no pudo crearse - " + err });
                            })
                    } else {
                        return res.status(400).json({ error: "Ya existe un turno " });
                    }
                } else {
                    return res.status(400).json({ error: "DNI INVALIDO" });
                }
            } else {
                return res.status(400).json({ error: "Faltan propiedades" });
            }
        },

        async putTurno(req, res) { // Actualiza los datos de un usuario pasandole el nombre o email como parametro
            const { id } = req.params;
            const { paciente, estado } = req.body;
            const update = {};
            if (paciente) update.paciente = paciente;
            if (estado) {
                update.estado = estado.toUpperCase();
                update.color = (new Turno()).getNewColor(estado.toUpperCase());
            }
            const updateTurno = await TurnoModel.updateOne({ "_id": id }, update);
            if (updateTurno.n) { //n == numero de documentos modificados
                return res.status(200).json({ ok: true });
            } else {
                return res.status(404).json({ error: "Turno not found/Turno no encontrado" });
            }
        },

        async deleteTurno(req, res) { //Elimina un usuario pasandole por querys nombre y email
            const { id } = req.query;
            if (!id) return res.status(400).json({ error: "Not enough parameters/Faltan parametros" });
            TurnoModel.deleteOne({ _id: id }, (err) => {
                //Aunque no haya un documento que borrar nunca trae errores
                //Esta query siempre devuelve status 200 como si hubiera borrado
                if (err) {
                    return res.status(404).json({ error: "Turno not found/Turno no encontrado" });
                } else {
                    return res.status(200).json({ ok: true });
                }
            })
        },

        async getAllTurnos(req, res) {
            const turno = await TurnoModel.find();
            if (turno) return res.status(200).json({ turno });
            else return res.status(404).json({ error: "Coleccion inexistente" });
        }
    }
    //Todos los controladores los haremos con async debido a que esto nos permite usar la instruccion "await"
    //La instruccion "await", significa "esperar", hara que cuando tengamos una promesa espere a que se resuelva antes de seguir ejecutando la siguiente linea