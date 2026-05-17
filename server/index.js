// ==========================================
// 1. IMPORTACIÓN DE LIBRERÍAS (DEPENDENCIAS)
// ==========================================

// Importamos Express, el framework que nos permite crear un servidor web y definir rutas de manera sencilla.
const express = require('express');
// Inicializamos Express ejecutándolo en una constante llamada 'app'. De aquí en adelante, 'app' es nuestro servidor.
const app = express();

// Importamos el conector de MySQL para Node.js, que nos da las herramientas para enviar consultas SQL a la base de datos.
const mysql = require('mysql2');

// Importamos CORS (Cross-Origin Resource Sharing).
// Es una librería de seguridad OBLIGATORIA. Si no la pones, tu navegador bloqueará las peticiones de React (puerto 3000) hacia Node (puerto 3001) por venir de orígenes diferentes.
const cors = require('cors');


// ==========================================
// 2. MIDDLEWARES (CONFIGURACIONES INTERMEDIAS)
// ==========================================

// Le decimos a nuestra app que use CORS para permitir conexiones externas (en este caso, desde tu Frontend de React).
app.use(cors());

// Le indicamos al servidor que sea capaz de entender e interpretar el formato JSON cuando reciba datos en el cuerpo (body) de las peticiones.
app.use(express.json());


// ==========================================
// 3. CONEXIÓN A LA BASE DE DATOS
// ==========================================

// Creamos la configuración para enlazarnos con MySQL.
const db = mysql.createConnection({
    host: 'localhost',       // El servidor de tu base de datos está en tu propia máquina.
    user: 'root',            // El usuario administrador por defecto de MySQL.
    password: "",            // Contraseña de MySQL (en servidores locales como XAMPP suele venir vacía).
    database: 'empleados crud' // El nombre exacto de la base de datos que creaste en phpMyAdmin o MySQL Workbench.
});


// ==========================================
// 4. RUTAS DEL API (ENDPOINTS)
// ==========================================

// --- RUTA: CREAR (POST) ---
// Se ejecuta cuando el Frontend hace un 'Axios.post' a "http://localhost:3001/create"
app.post("/create", (req, res) => {
    // 'req' (Request) es la petición. Dentro de 'req.body' viajan los datos que el usuario escribió en el formulario de React.
    const nombre = req.body.nombre;
    const edad = req.body.edad;
    const pais = req.body.pais;
    const cargo = req.body.cargo;
    const anios = req.body.anios;

    // db.query ejecuta una consulta SQL. 
    // Usamos los signos de interrogación '?' (Placeholders) por seguridad, para evitar un hackeo llamado "Inyección SQL".
    db.query("INSERT INTO empleados (nombre, edad, pais, cargo, anios) VALUES (?,?,?,?,?)", 
    [nombre, edad, pais, cargo, anios], // Node reemplaza los '?' en orden con las variables de este arreglo.
    (err, result) => {
        // Esta función se ejecuta cuando la base de datos responde:
        if (err) {
            console.log(err); // Muestra el error en la terminal negra de Node (no en el navegador).
            res.status(500).send("Error al registrar"); // 'res' (Response) es la respuesta. Enviamos un código 500 (Error del servidor).
        } else {
            res.send(result); // Si todo sale bien, le respondemos a React con el resultado exitoso (ej. el ID generado).
        }
    });
}); 


// --- RUTA: LEER / TRAER TODO (GET) ---
// Se ejecuta cuando el Frontend hace un 'Axios.get' a "http://localhost:3001/empleados"
app.get("/empleados", (req, res) => {
  // Pedimos a MySQL todas las columnas de la tabla empleados.
  db.query("SELECT * FROM empleados", (err, result) => {
    if (err) {
      console.log("¡ERROR REAL EN EL BACKEND!", err);
      res.status(500).send(err);
    } else {
      res.send(result); // Enviamos a React el arreglo con todas las filas encontradas. Esto es lo que llena tu tabla visual.
    }
  });
});


// --- RUTA: ACTUALIZAR (PUT) ---
// Se ejecuta cuando el Frontend hace un 'Axios.put' a "http://localhost:3001/update"
app.put("/update", (req, res) => {
    // Al igual que en el POST, extraemos los datos modificados desde el cuerpo de la petición.
    const id = req.body.id;
    const nombre = req.body.nombre;
    const edad = req.body.edad;
    const pais = req.body.pais;
    const cargo = req.body.cargo;
    const anios = req.body.anios;

    // Ejecutamos un UPDATE de SQL. El WHERE id=? asegura que solo se modifique a ese empleado en específico.
    db.query("UPDATE empleados SET nombre=?, edad=?, pais=?, cargo=?, anios=? WHERE id=?",
    [nombre, edad, pais, cargo, anios, id], // 'id' se coloca al final porque corresponde al último '?' del WHERE.
    (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error al actualizar el empleado"); 
        } else {
            res.send(result); // Respondemos a React confirmando el cambio.
        }
    });
});


// --- RUTA: ELIMINAR (DELETE) ---
// Se ejecuta cuando el Frontend hace un 'Axios.delete' a "http://localhost:3001/delete/5" (por ejemplo).
// El ":id" en la ruta es un parámetro dinámico (una variable en la URL).
app.delete("/delete/:id", (req, res) => {
    // Como el ID viene dentro de la URL y no en el cuerpo, se extrae usando 'req.params.id'
    const id = req.params.id;
    
    // Ejecutamos la orden de borrado en MySQL filtrando por el ID recibido.
    db.query("DELETE FROM empleados WHERE id=?", id, 
    (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error al eliminar el empleado"); 
        } else {
            res.send(result); // Respondemos éxito.
        }
    });
});


// ==========================================
// 5. ENCENDIDO DEL SERVIDOR
// ==========================================

// Le decimos a nuestro servidor Express que se quede "escuchando" peticiones de forma permanente en el puerto 3001.
app.listen(3001, () => {
    // Este mensaje saldrá en tu consola/terminal en cuanto ejecutes el comando `node index.js` o `nodemon`.
    console.log('Servidor corriendo con éxito en el puerto 3001');
});