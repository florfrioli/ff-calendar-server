const jwt = require('jsonwebtoken');
const UserModel = require('../models/userSchema');

// middleware to validate token (rutas protegidas)
async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        //console.log(token);
        if (!token) return res.status(401).json({ error: 'Acceso denegado' })
        try {
            let checkUSer = await UserModel.findOne({ token });
            if (checkUSer) {
                next() // continuamos  
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: 'token no es válido' })
        }
    }
};

module.exports = verifyToken;