// express es para crear rutas y manejar solicitudes
const express = require('express');
// esto es una subruta de la ruta principal que es index.js
const router = express.Router();
// mysql2 es para traducir las consultas
const mysql = require('mysql2');

// esta la conexión a la BBDD
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'empleados_crud'
});

// método POST para registrar el log de los usuarios
router.post("/registrar", (req, res) => {
    // obtenemos el usuario y el evento (accion realizada)
    const { usuario, evento } = req.body;
    
    // obtenemos la IP, es let porque puede cambiar
    let ip = req.ip;
    // limpieza de la IP para localhost, ya que puede aparecer como ::1 o ::ffff;
    if (ip === "::1" || ip === "::ffff:127.0.0.1") {
        ip = "127.0.0.1"; // Limpieza visual si estás probando en localhost
    }

    // obtenemos el navegador a partir del user agent, con un valor por defecto de "Desconocido" si no se encuentra
    const browserRaw = req.headers['user-agent'] || "Desconocido";
    
    // hacemos una detección básica del navegador a partir del user agent
    let browser = "Otro Navegador";
    if (browserRaw.includes("Brave") || browserRaw.includes("Chrome") && !browserRaw.includes("Edg")) {
        browser = "Brave / Chrome";
    } else if (browserRaw.includes("Firefox")) {
        browser = "Mozilla Firefox";
    } else if (browserRaw.includes("Safari") && !browserRaw.includes("Chrome")) {
        browser = "Safari";
    }

    db.query(
        // la consulta SQL para insertar el log en la tabla logs, con los valores obtenidos
        "INSERT INTO logs (usuario, ip, evento, browser, fecha_hora) VALUES (?, ?, ?, ?, NOW())",
        // pasamos los valores como un array para evitar inyecciones SQL
        [usuario, ip, evento, browser],
        (err, result) => {
            if (err) {
                console.error("Error al guardar el log:", err);
                return res.status(500).send("No se pudo auditar el evento.");
            }
            res.send("Log auditado correctamente.");
        }
    );
});

module.exports = router;