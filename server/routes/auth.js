const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'print',
    database: 'empleados_crud'
});

// --- RUTA: REGISTRAR USUARIO (CON ENCRIPTACOÓN BCRYPT) ---
router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Generamos los rounds de sal (salt) para hacer el hash ultra seguro
        const saltRounds = 10;
        // Encriptamos la contraseña de forma asíncrona
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Guardamos el usuario con la contraseña ya encriptada
        db.query(
            "INSERT INTO usuarios (username, password) VALUES (?,?)",
            [username, hashedPassword],
            (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).send("El nombre de usuario ya está registrado.");
                    }
                    console.log(err);
                    return res.status(500).send("Error al crear el usuario.");
                }
                res.status(201).send("Usuario registrado con éxito.");
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor.");
    }
});

// --- RUTA: LOGIN / INICIAR SESIÓN ---
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Buscamos si el usuario existe
    db.query("SELECT * FROM usuarios WHERE username = ?", [username], async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error en el servidor.");
        }

        if (result.length === 0) {
            return res.status(401).send("Usuario o contraseña incorrectos.");
        }

        const usuario = result[0];

        // Comparamos la contraseña ingresada con el hash guardado en la BD
        const coincide = await bcrypt.compare(password, usuario.password);

        if (!coincide) {
            return res.status(401).send("Usuario o contraseña incorrectos.");
        }

        // Si coincide, respondemos con éxito devolviendo los datos del usuario logueado
        // Nota: Esto nos servirá en la siguiente fase para armar el Log de accesos.
        res.send({ mensaje: "Ingreso exitoso", usuario: usuario.username });
    });
});

module.exports = router;