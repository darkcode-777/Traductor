const express = require('express');
const app = express();
const port = 3000;

// Get the client
const mysql = require('mysql2/promise');
const cors = require('cors');
const session = require('express-session');

// Configuración de CORS: Permitir solicitudes desde el cliente React
app.use(cors({
    origin: 'http://localhost:5173',  // Elimina la barra al final
    credentials: true                 // Permitir el uso de cookies (sesión)
}));

app.use(session({
    secret: 'asdafghjajnalkam6179811',
    resave: false,           // No resguardar la sesión si no ha sido modificada
    saveUninitialized: true  // Guardar la sesión incluso si no ha sido inicializada
}));

// Crear la conexión a la base de datos
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'login',
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Ruta de login
app.get('/login', async (req, res) => { // req es lo que enviamos, res es lo que respondemos
    const datos = req.query;

    try {
        const [results, fields] = await connection.query(
            "SELECT * FROM usuarios WHERE usuario = ? AND clave = ?",
            [datos.usuario, datos.clave]
        );

        if (results.length > 0) {
            req.session.usuario = datos.usuario;
            res.status(200).send('Inicio sesión correctamente');
        } else {
            res.status(401).send('Usuario o clave incorrectos');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Error en la base de datos');
    }
});

// Ruta de validación de sesión
app.get('/validar', (req, res) => {
    if (req.session.usuario) {
        res.status(200).send('Sesión validada');
    } else {
        res.status(401).send('No autorizado');
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});