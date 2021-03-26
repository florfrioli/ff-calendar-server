require('dotenv').config(); // Variables de entorno
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes/routes');


const PORT = process.env.PORT || 3000; // Puerto declarado o un por defecto.
const { DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;
const DB_URL = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@consultorio.m3rwk.mongodb.net/${DB_NAME}`;


mongoose.connect(DB_URL, { //Metodo para conectar a la base de datos, tiene 3 parametros:
    useNewUrlParser: true, //Primero le pasamos la URI con las credenciales de acceso en DB_URL
    useUnifiedTopology: true //Segundo le pasamos un objeto con opciones de config, las que use yo son las basicas a usar para no tener problemas de conexion
}, () => { //Por ultimo le pasamos una funcion como callback para ejecutar una vez que se conecte
    console.log('MongoDB conectado'); //Si se logra conectar nos muestra esto en consola
})

mongoose.connection.on('connected', function() {
    console.log('Conectado a la base de datos: ' + DB_URL)
});
mongoose.connection.on('error', function(err) {
    console.log('Error al conectar a la base de datos: ' + err)
});
mongoose.connection.on('disconnected', function() {
    console.log('Desconectado de la base de datos')
});

process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.log('Desconectado de la base de datos al terminar la app')
        process.exit(0)
    })
});


const app = express();
app.use(session({
    secret: 'mysecretsession',
    resave: false,
    saveUninitialized: false
}));


app.use(cors()); // Errores de cors -> Middleware
app.use(express.json()); // Se encarga de parsear el body de las request, si no lo ponemos no podemos leerlo

app.use('/', routes); // Usamos nuestro archivo routes como middleware personalizado


try {
    app.listen(PORT, () => {
        console.log(`Server en puerto ${PORT}`);
    });
} catch (error) {
    console.log(`Error en puerto ${PORT}`, error);
}