const routes = require('express').Router(); //Router se encarga de rutear las uris.
const { getUserLogeado, signInUser, signInWithMail, getUser, postUser, putUser, deleteUser } = require('../controllers/userController'); //Traemos las funciones controladores
const { getAllPacientes, getPaciente, postPaciente, putPaciente, deletePaciente } = require('../controllers/pacienteController'); //Traemos las funciones controladores
const { getAllEspecialistas, getEspecialista, postEspecialista, putEspecialista, deleteEspecialista } = require('../controllers/especialistaController'); //Traemos las funciones controladores
const { getAllTurnos, getTurno, postTurno, putTurno, deleteTurno, getTurnoPaciente, getTurnoEspecialista } = require('../controllers/turnoController'); //Traemos las funciones controladores
const verifyToken = require('../services/validate-token');

// Rutas Usuarios:
routes.get("/api/user/:email", getUser);
routes.post("/api/user", postUser);
routes.put("/api/user/:email", putUser);
routes.delete("/api/user", deleteUser);
routes.post('/api/user/signup', postUser);
routes.post('/api/user/signin', signInUser);
routes.post('/api/check-user', signInWithMail);
routes.get("/api/user/session/:token", getUserLogeado);

// Rutas Pacientes:
routes.get("/api/paciente", verifyToken, getAllPacientes);
routes.get("/api/paciente/:idordni", verifyToken, getPaciente);
routes.post("/api/paciente", verifyToken, postPaciente);
routes.put("/api/paciente/:dni", verifyToken, putPaciente);
routes.delete("/api/paciente", verifyToken, deletePaciente);

// Rutas Turnos:
routes.get("/api/turno", verifyToken, getAllTurnos);
routes.get("/api/turno/:idordni", verifyToken, getTurno);
routes.get("/api/turno/paciente/:id", verifyToken, getTurnoPaciente);
routes.get("/api/turno/especialista/:id", verifyToken, getTurnoEspecialista);
routes.post("/api/turno", verifyToken, postTurno);
routes.put("/api/turno/:id", verifyToken, putTurno);
routes.delete("/api/turno", verifyToken, deleteTurno);

// Rutas Especialistas:
routes.get("/api/especialista", verifyToken, getAllEspecialistas);
routes.get("/api/especialista/:idordni", verifyToken, getEspecialista);
routes.post("/api/especialista", verifyToken, postEspecialista);
routes.put("/api/especialista/:dni", verifyToken, putEspecialista);
routes.delete("/api/especialista", verifyToken, deleteEspecialista);

module.exports = routes;