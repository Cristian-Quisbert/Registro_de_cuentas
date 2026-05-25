const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Conexión temporal aquí (luego la centralizaremos)
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'print',
    database: 'empleados_crud'
});


// --- RUTA: CREAR TRANSACCIÓN (MODIFICADA) ---
router.post("/create", (req, res) => {
    // Recibimos también el campo 'usuario' desde el Frontend
    const { descripcion, monto, tipo, categoria, fecha, usuario } = req.body;

    db.query(
        "INSERT INTO transacciones (descripcion, monto, tipo, categoria, fecha, usuario) VALUES (?,?,?,?,?,?)",
        [descripcion, monto, tipo, categoria, fecha, usuario],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al registrar la transacción");
            } else {
                res.send(result);
            }
        }
    );
});

// --- RUTA: LEER SOLO LAS DEL USUARIO LOGUEADO (MODIFICADA) ---
// Ahora usamos req.query para recibir el usuario desde el Frontend
router.get("/", (req, res) => {
    const usuario = req.query.usuario; 

    db.query(
        "SELECT * FROM transacciones WHERE activo = 1 AND usuario = ? ORDER BY fecha DESC", 
        [usuario], 
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.send(result);
            }
        }
    );
});

// --- RUTA: ACTUALIZAR (PUT) ---
router.put("/update", (req, res) => {
    const { id, descripcion, monto, tipo, categoria, fecha } = req.body;

    db.query(
        "UPDATE transacciones SET descripcion=?, monto=?, tipo=?, categoria=?, fecha=? WHERE id=?",
        [descripcion, monto, tipo, categoria, fecha, id],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al actualizar");
            } else {
                res.send(result);
            }
        }
    );
});

// --- RUTA: ELIMINACIÓN LÓGICA (DELETE modificado) ---
// ¡Clave para la defensa! No usamos DELETE, usamos UPDATE para cambiar el estado a 0
router.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    db.query("UPDATE transacciones SET activo = 0 WHERE id = ?", id, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error al eliminar la transacción");
        } else {
            res.send(result);
        }
    });
});

module.exports = router;