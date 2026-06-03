// usa express para crear rutas
const express = require('express');
// crea un router de express, el router es como un mini servidor que solo maneja las rutas relacionadas a transacciones
const router = express.Router();
// mysql2 es la librería que usaremos para conectar con la base de datos MySQL
const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    // Puerto local, usuario root, contraseña print, y la base de datos empleados_crud
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'empleados_crud'
});


// el post es para crear una nueva transacción
router.post("/create", (req, res) => {
    // guardamos las variables recibidas del frontend en constantes para usarlas en la consulta SQL
    const { descripcion, monto, tipo, categoria, fecha, usuario } = req.body;

    db.query(
        // consulta SQL para insertar los datos recibidos, los '?' son placeholders que se llenan con el array siguiente
        "INSERT INTO transacciones (descripcion, monto, tipo, categoria, fecha, usuario) VALUES (?,?,?,?,?,?)",
        // para llenar los placeholders, pasamos un array con las variables en el mismo orden que los '?'
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

// método get para obteer transacciones
router.get("/", (req, res) => {
    // en usuario guardamos al usuario logeado actualmente
    const usuario = req.query.usuario; 

    db.query(
        // obtiene todas las transsacciones activas del 'usuario'
        "SELECT * FROM transacciones WHERE activo = 1 AND usuario = ? ORDER BY fecha DESC", 
        // usuario que se debe buscar en la BBDD
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


// método put para actualizar una transacción existente
router.put("/update", (req, res) => {
    // guardamos en un objeto lo enviado del frontend
    const { id, descripcion, monto, tipo, categoria, fecha } = req.body;

    db.query(
        // actualiza la transacción
        "UPDATE transacciones SET descripcion=?, monto=?, tipo=?, categoria=?, fecha=? WHERE id=?",
        // datos para actualizar la transacción
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


// método delete para borrar una transacción
router.delete("/delete/:id", (req, res) => {
    // obtenemos el id de la transacción
    const id = req.params.id;
    // hace el borrado lógico con 'activo = 0' para no perder los datos de la transacción
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