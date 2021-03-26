const User = require('../models/userSchema'); // Traigo mi modelo de esquema User
const EspecialistaModel = require('../models/especialistaSchema');
const UserModel = require('../models/userSchema');
/* const jwt = require('jsonwebtoken'); */
module.exports = {
        async signInUser(req, res) {
            const { email } = req.body;
            if (email) {
                const checkUsuario = await UserModel.findOne({ email });
                if (checkUsuario) {
                    console.log("Se logueo: " + checkUsuario.email);
                    return res.status(200).json({ token: checkUsuario.token, admin: checkUsuario.admin });
                } else return res.status(404).json({ error: "Usuario Not found/No encontrado" });
            } else return res.status(400).json({ error: "Faltan propiedades" });
        },

        async signInWithMail(req, res) {
            const { email } = req.body;
            console.log("POST email: " + email);
            if (email) {
                const checkEspecialista = await EspecialistaModel.findOne({ email });
                const checkUser = await UserModel.findOne({ email });
                if (checkEspecialista) {
                    return res.status(200).json({ ok: "Puede registrarse" });
                } else if (checkUser) {
                    if (checkUser.admin) return res.status(200).json({ ok: "Puede registrarse" });
                } else return res.status(404).json({ error: "Usuario Not found/No encontrado" });
            } else return res.status(400).json({ error: "Faltan propiedades" });
        },

        async getUser(req, res) { // Nos devuelve un usuario, en caso de no encontrarlo devuelve 404
            const { params: { email } } = req;
            const user = await User.findOne({ email });
            if (user) return res.status(200).json({ user });
            else return res.status(404).json({ error: "Not found/No encontrado" });
        },

        async getUserLogeado(req, res) { // Nos devuelve un usuario, en caso de no encontrarlo devuelve 404
            const { params: { token } } = req;
            //console.log("LLego busqueda con token: " + token);
            const user = await User.findOne({ token });
            if (user) {
                const especialista = await EspecialistaModel.findOne({ _id: user.especialista });
                return res.status(200).json({ especialista });
            } else return res.status(404).json({ error: "Not found/No encontrado" });
        },

        async postUser(req, res) { // Agrega un usuario si se pasan nombre, apellido y email en el body de la request
            const { email, password, token } = req.body;
            //console.log("---->Llega un post con: " + email + "- " + password + "- " + token);
            if (password && email && token) {
                const checkUser = await User.findOne({ email });
                const checkEsp = await EspecialistaModel.findOne({ email });
                if (checkEsp) {
                    if (!checkUser) {
                        const newUser = new User(req.body);
                        newUser.password = newUser.encryptPassword(password);
                        newUser.especialista = checkEsp._id;
                        newUser.admin = false;
                        newUser.token = token;
                        newUser.save(newUser);
                        return res.status(201).json({ ok: "usuario creado correctamente" });
                    } else return res.status(404).json({ error: "YA existe un usuario" });
                } else {
                    if (checkUser) {
                        const update = {};
                        if (password) update.password = new User().encryptPassword(password);
                        if (token) update.token = token;
                        const updateUser = await User.updateOne({ email }, update);
                        if (updateUser.admin) {
                            if (updateUser.n) { //n == numero de documentos modificados
                                return res.status(201).json({ ok: "usuario ADMIN creado correctamente" });
                            } else return res.status(404).json({ error: "Hubo un error, intente de nuevo." });
                        }
                    } else return res.status(404).json({ error: "El usuario no es un especialista" });
                }
            } else return res.status(400).json({ error: "Not enough properties/Faltan propiedades" });
        },


        async putUser(req, res) { // Actualiza los datos de un usuario pasandole el nombre o email como parametro
            const { email } = req.params;
            const { password, admin } = req.body;
            const update = {};
            if (admin) update.admin = admin;
            if (password) update.password = new User().encryptPassword(password);

            const updateUser = await User.updateOne({ email }, update);

            if (updateUser.n) { //n == numero de documentos modificados
                return res.status(200).json({ ok: true });
            } else {
                return res.status(404).json({ error: "User not found/Usuario no encontrado" });
            }
        },
        async deleteUser(req, res) { //Elimina un usuario pasandole por querys nombre y email
            const { email } = req.query;
            if (!email) return res.status(400).json({ error: "Not enough parameters/Faltan parametros" });
            User.deleteOne({ email }, (err) => {
                //Aunque no haya un documento que borrar nunca trae errores
                //Esta query siempre devuelve status 200 como si hubiera borrado
                if (err) {
                    return res.status(404).json({ error: "User not found/Usuario no encontrado" });
                } else {
                    return res.status(200).json({ ok: true });
                }
            })
        }
    }
    //Todos los controladores los haremos con async debido a que esto nos permite usar la instruccion "await"
    //La instruccion "await", significa "esperar", hara que cuando tengamos una promesa espere a que se resuelva antes de seguir ejecutando la siguiente linea