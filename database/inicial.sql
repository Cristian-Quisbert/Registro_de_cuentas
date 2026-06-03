USE empleados_crud;

-- 1. TABLA DE USUARIOS (Para auth.js)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- 2. TABLA DE TRANSACCIONES (Para transacciones.js y reportes.js)
CREATE TABLE IF NOT EXISTS transacciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    tipo VARCHAR(20) NOT NULL, 
    categoria VARCHAR(50) NOT NULL,
    fecha DATE NOT NULL,
    usuario VARCHAR(50) NOT NULL,
    activo INT DEFAULT 1 -- Nuestro interruptor de borrado lógico
);

-- 3. TABLA DE LOGS DE AUDITORÍA (Para logs.js)
CREATE TABLE IF NOT EXISTS logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL,
    ip VARCHAR(45) NOT NULL,
    evento VARCHAR(100) NOT NULL,
    browser VARCHAR(100) NOT NULL,
    fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP
);