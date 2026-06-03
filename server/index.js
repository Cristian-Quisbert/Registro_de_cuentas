// Importa la libreria de express, express es el framework que permite escuchar peticiones HTTP
const express = require('express');
// Inicia express y app contiene todos los métodos para configurar el servidor
const app = express();
// importa el paquete cors para permitir solicitudes desde el frontend (Cross-Origin Resource Sharing)
const cors = require('cors');

// Middleware es una función que se ejecuta antes de llegar a las rutas, en este caso cors y express.json
app.use(cors()); // dice que acepte peticiones de otro puerto, en este caso el frontend
app.use(express.json()); // traduce el cuerpo de las peticiones a formato JSON para que sea fácil de usar en el backend

// importamos el archivo de rutas que acabamos de crear
const transaccionesRoutes = require('./routes/transacciones');
const authRoutes = require('./routes/auth');
const logsRoutes = require('./routes/logs');
const reportesRoutes = require('./routes/reportes');

// Le decimos a Express que use esas rutas. Ahora todas empezarán con "/api/transacciones"
app.use('/api/transacciones', transaccionesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/reportes', reportesRoutes);

// Encendido del Servidor
app.listen(3001, () => {
    console.log('Servidor corriendo con éxito en el puerto 3001');
});