const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'print',
    database: 'empleados_crud'
});

// --- RUTA: REGISTRAR UN EVENTO EN EL LOG (POST) ---
router.post("/registrar", (req, res) => {
    const { usuario, evento } = req.body;
    
    // Captura nativa de la IP del cliente
    let ip = req.ip;
    if (ip === "::1" || ip === "::ffff:127.0.0.1") {
        ip = "127.0.0.1"; // Limpieza visual si estás probando en localhost
    }

    // Captura nativa del Navegador web (User-Agent)
    const browserRaw = req.headers['user-agent'] || "Desconocido";
    
    // Simplificar el texto del navegador para que no guarde una cadena gigante legible a medias
    let browser = "Otro Navegador";
    if (browserRaw.includes("Brave") || browserRaw.includes("Chrome") && !browserRaw.includes("Edg")) {
        browser = "Brave / Chrome";
    } else if (browserRaw.includes("Firefox")) {
        browser = "Mozilla Firefox";
    } else if (browserRaw.includes("Safari") && !browserRaw.includes("Chrome")) {
        browser = "Safari";
    }

    // Insertar en la base de datos (la fecha y hora se guardan solas con NOW() o DEFAULT CURRENT_TIMESTAMP)
    db.query(
        "INSERT INTO logs (usuario, ip, evento, browser, fecha_hora) VALUES (?, ?, ?, ?, NOW())",
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