const express = require('express');
const app = express();
const cors = require('cors');

// Middlewares
app.use(cors());
app.use(express.json());

// ==========================================
// CONTROL DE RUTAS (ROUTES)
// ==========================================
// Importamos el archivo de rutas que acabamos de crear
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