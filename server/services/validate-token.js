//const firebaseConfig = require('./firebase');
var admin = require('firebase-admin');
var serviceAccount = require("../ff-calendar-2021-firebase-adminsdk-2kw5d-ef9588d367.json");
const userModel = require('../models/userSchema');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ff-calendar-2021-default-rtdb.firebaseio.com"
});


// middleware to validate token (rutas protegidas)
async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        //console.log(token);
        if (!token) return res.status(403).json({ error: 'Acceso denegado' })
        else {
            admin.auth().verifyIdToken(token)
                .then((decodedToken) => {
                    const uid = decodedToken.uid;
                    const email = decodedToken.email;
                    req.uid = uid;
                    // console.log(uid, email);
                    next()
                })
                .catch((error) => {
                    if (error.code == 'auth/id-token-expired') {
                        console.log('expiro token');
                        return res.status(401).json({ error: 'Token vencido' });
                    }
                    console.log(error);
                    return res.status(401).json({ error: 'Token no es válido' });
                });
        }
    }
};


async function getUserByUID(req, res, next) {
    let uid = req.uid;
    let usuario = await userModel.findOne({ uid });
    if (usuario) {
        console.log('Request de: ' + usuario.email);
        req.user = usuario;
        next();
    } else return res.status(403).json({ error: 'Acceso denegado' })
};


async function verifyPermisos(req, res, next) {
    let usuario = req.user;
    if (usuario.admin) {
        console.log('Usuario admin, permiso okey');
        next();
    } else return res.status(403).json({ error: 'Usuario no admin, no autorizado' });
}

module.exports = { verifyToken, getUserByUID, verifyPermisos };