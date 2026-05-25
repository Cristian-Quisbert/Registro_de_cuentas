const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const PDFDocument = require('pdfkit');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'print',
    database: 'empleados_crud'
});

// --- RUTA: GENERAR PDF DE TRANSACCIONES (GET) ---
router.get("/pdf", (req, res) => {
    let usuario = req.query.usuario;

    if (!usuario || usuario === "undefined") {
        usuario = "admin"; 
    }

    console.log(`Generando PDF para el usuario: ${usuario}`); // Esto saldrá en tu terminal de Node para auditar
    
    // CORRECCIÓN: Añadido "AND usuario = ?" y pasado [usuario] como parámetro
    db.query("SELECT * FROM transacciones WHERE activo = 1 AND usuario = ? ORDER BY fecha DESC", [usuario], (err, result) => {
        
        if (err) {
            console.error(err);
            return res.status(500).send("Error al obtener los datos para el reporte");
        }

        // Creamos un documento PDF en memoria
        const doc = new PDFDocument({ margin: 50 });

        // Configuramos las cabeceras HTTP para que el navegador entienda que es un archivo de descarga
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=Reporte_FinanzApp.pdf');

        // Canalizamos la salida del PDF directamente a la respuesta HTTP (Stream)
        doc.pipe(res);

        // --- DISEÑO DEL ENCABEZADO ---
        doc.fillColor('#2ec4b6').fontSize(24).text('FinanzApp - Reporte Financiero', { align: 'center' });
        doc.fillColor('#333333').fontSize(10).text(`Fecha de generación: ${new Date().toLocaleDateString()}`, { align: 'center' });
        doc.moveDown(2);

        doc.fillColor('#111111').fontSize(14).text(`Historial de Movimientos de: ${usuario}`, { underline: true });
        doc.moveDown(1);

        // --- TABLA DE DATOS CASERA ---
        let y = doc.y; // Capturamos la posición vertical actual

        // Encabezados de columnas
        doc.fontSize(11).font('Helvetica-Bold');
        doc.text('Descripción', 50, y);
        doc.text('Monto', 220, y);
        doc.text('Tipo', 300, y);
        doc.text('Categoría', 380, y);
        doc.text('Fecha', 480, y);
        
        // Línea divisoria
        doc.moveTo(50, y + 15).lineTo(550, y + 15).strokeColor('#aaaaaa').stroke();
        doc.font('Helvetica').fontSize(10);
        y += 25;

        // Iteramos sobre los registros de la base de datos
        result.forEach(trans => {
            doc.text(trans.descripcion, 50, y, { width: 160, maxRows: 1 });
            
            const signo = trans.tipo === 'Ingreso' ? '+' : '-';
            doc.text(`${signo}$${trans.monto}`, 220, y);
            
            doc.text(trans.tipo, 300, y);
            doc.text(trans.categoria, 380, y);
            
            const fechaFormateada = new Date(trans.fecha).toLocaleDateString();
            doc.text(fechaFormateada, 480, y);
            
            y += 20;

            // Control básico de salto de página si la tabla es muy larga
            if (y > 700) {
                doc.addPage();
                y = 50;
            }
        });

        // Finalizamos el documento
        doc.end();
    });
});

module.exports = router;