// usa express para crear rutas
const express = require('express');
// usar router como un mini servidor
const router = express.Router();
// mysql2 es para traducir queries
const mysql = require('mysql2');
// bcrypt es para encriptar las contraseñas al logearse
const bcrypt = require('bcrypt');

// esta es la conexión con la BBDD
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'empleados_crud'
});

// método post para registrar a un nuevo usuario
router.post("/register", async (req, res) => {
    // obtenermos el nombre de usuario y la contraseña para el usuario nuevo
    const { username, password } = req.body;
    // intentamos:
    try {
        // encripta la contraseña 10 veces, es el estándar
        const saltRounds = 10;
        // procede a encriptar y la contraseña ahora se llama hashedPassword
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // hace la consulta
        db.query(
            // inserta al nuevo usuario en la BBDD y se le pasa los valores
            "INSERT INTO usuarios (username, password) VALUES (?,?)",
            // pasamos el valor de nombre de usuario y la contraseña antes encriptada
            [username, hashedPassword],
            (err, result) => {
                if (err) {
                    // esto controla que no haya dos usuario con el mismo nombre
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).send("El nombre de usuario ya está registrado.");
                    }
                    console.log(err);
                    return res.status(500).send("Error al crear el usuario.");
                }
                // si todo sale bien, se envía un mensaje de éxito
                res.status(201).send("Usuario registrado con éxito.");
            }
        );
        // si hay un error se ejecuta esto:
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor.");
    }
});

// método post para logear a un usuario existente
router.post("/login", (req, res) => {
    // obtenemos el nombre de usuario y la contraseña 
    const { username, password } = req.body;
    // hacemos la consulta para buscar al usuario por su nombre
    db.query("SELECT * FROM usuarios WHERE username = ?", [username], 
        // esta función se ejecuta después de la consulta, recibe un error o el resultado de la consulta
        async (err, result) => {
        if (err) {
            // si hay un error en la consulta, se muestra en consola y se envía un mensaje de error
            console.log(err);
            return res.status(500).send("Error en el servidor.");
        }

        if (result.length === 0) {
            // si no se encuentra el usuario, se envía un mensaje de error
            return res.status(401).send("Usuario o contraseña incorrectos.");
        }
        
        // si se encuentra el usuario, se compara la contraseña ingresada con la contraseña encriptada en la BBDD
        const usuario = result[0];
        const coincide = await bcrypt.compare(password, usuario.password);

        if (!coincide) {
            return res.status(401).send("Usuario o contraseña incorrectos.");
        }
        // si la contraseña es correcta, se envía un mensaje de éxito y el nombre de usuario
        res.send({ mensaje: "Ingreso exitoso", usuario: usuario.username });
    });
});

module.exports = router;