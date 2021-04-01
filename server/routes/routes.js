const routes = require('express').Router(); //Router se encarga de rutear las uris.
const { getUserLogeado, signInUser, signInWithMail, getUser, postUser, putUser, deleteUser } = require('../controllers/userController'); //Traemos las funciones controladores
const { getAllPacientes, getPaciente, postPaciente, putPaciente, deletePaciente } = require('../controllers/pacienteController'); //Traemos las funciones controladores
const { getAllEspecialistas, getEspecialista, postEspecialista, putEspecialista, deleteEspecialista } = require('../controllers/especialistaController'); //Traemos las funciones controladores
const { getAllTurnos, getTurno, postTurno, putTurno, deleteTurno, getTurnoPaciente, getTurnoEspecialista } = require('../controllers/turnoController'); //Traemos las funciones controladores
const { verifyToken, getUserByUID, verifyPermisos } = require('../services/validate-token');

// Rutas Usuarios:
//routes.get("/api/user/:email", getUser);
routes.post("/api/user", postUser);
//routes.put("/api/user/:email", putUser);
//routes.delete("/api/user", deleteUser);
routes.post('/api/user/signup', postUser); // listo
routes.post('/api/user/signin', signInUser); // listo ?
routes.post('/api/check-user', signInWithMail); // listo
routes.get("/api/user", verifyToken, getUserByUID, getUserLogeado);

// Rutas Pacientes:
routes.get("/api/paciente", verifyToken, getUserByUID, getAllPacientes);
routes.get("/api/paciente/:idordni", verifyToken, getUserByUID, getPaciente);
routes.post("/api/paciente", verifyToken, getUserByUID, postPaciente);
routes.put("/api/paciente/:dni", verifyToken, getUserByUID, putPaciente);
routes.delete("/api/paciente", verifyToken, getUserByUID, deletePaciente);

// Rutas Turnos:
routes.get("/api/turno", verifyToken, getUserByUID, getAllTurnos);
routes.get("/api/turno/:idordni", verifyToken, getUserByUID, getTurno);
routes.get("/api/turno/paciente/:id", verifyToken, getUserByUID, getTurnoPaciente);
routes.get("/api/turno/especialista/:id", verifyToken, getUserByUID, getTurnoEspecialista);
routes.post("/api/turno", verifyToken, getUserByUID, postTurno);
routes.put("/api/turno/:id", verifyToken, getUserByUID, putTurno);
routes.delete("/api/turno", verifyToken, getUserByUID, deleteTurno);

// Rutas Especialistas:
routes.get("/api/especialista", verifyToken, getUserByUID, getAllEspecialistas);
routes.get("/api/especialista/:idordni", verifyToken, getUserByUID, getEspecialista);
routes.post("/api/especialista", verifyToken, getUserByUID, postEspecialista);
routes.put("/api/especialista/:dni", verifyToken, getUserByUID, putEspecialista);
routes.delete("/api/especialista", verifyToken, getUserByUID, deleteEspecialista);
//routes.delete("/api/especialista", verifyToken, getUserByUID, verifyPermisos, deleteEspecialista); // ver de que solo el admin agregue y borre especialistas.

module.exports = routes;