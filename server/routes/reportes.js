// usamos el framework express para crear rutas y manejar solicitudes HTTP
const express = require('express');
// creamos un router que es un subenrutador de la ruta principal (index.js)
const router = express.Router();
// mysql2 es para traducir las consultas SQL a JavaScript
const mysql = require('mysql2');
// PDFKit es para generar archivos PDF
const PDFDocument = require('pdfkit');

// conexión a la base de datos
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'empleados_crud'
});

// método get para generar un reporte en PDF del usuario logeado
router.get("/pdf", (req, res) => {
    // obtenemos el usuario actualmente logeado
    let usuario = req.query.usuario;

    if (!usuario || usuario === "undefined") {
        usuario = "admin"; 
    }

    console.log(`Generando PDF para el usuario: ${usuario}`); 
    
    // consultamos la base de datos para obtener las transacciones activas
    db.query("SELECT * FROM transacciones WHERE activo = 1 AND usuario = ? ORDER BY fecha DESC", [usuario], (err, result) => {
        
        if (err) {
            console.error(err);
            return res.status(500).send("Error al obtener los datos para el reporte");
        }

        // Crea el documento en blanco en la memoria con un margen de 50 unidades
        const doc = new PDFDocument({ margin: 50 });
        
        // Indicamos que el contenido que se va a enviar es un PDF y ponemos un nombre al archivo que se descargue
        res.setHeader('Content-Type', 'application/pdf');
        // obliga al navegador a descargar el archivo en lugar de mostrarlo (attchment = adjunto)
        res.setHeader('Content-Disposition', 'attachment; filename=Reporte_FinanzApp.pdf');
        // conectamos el flujo de datos del PDF al objeto de respuesta para que se envíe al cliente
        doc.pipe(res);

        doc.fillColor('#2ec4b6').fontSize(24).text('FinanzApp - Reporte Financiero', { align: 'center' });
        doc.fillColor('#333333').fontSize(10).text(`Fecha de generación: ${new Date().toLocaleDateString()}`, { align: 'center' });
        doc.moveDown(2);

        doc.fillColor('#111111').fontSize(14).text(`Historial de Movimientos de: ${usuario}`, { underline: true });
        doc.moveDown(1);

        // Definimos la posición inicial para la tabla
        let y = doc.y; 

        doc.fontSize(11).font('Helvetica-Bold');
        doc.text('Descripción', 50, y);
        doc.text('Monto', 220, y);
        doc.text('Tipo', 300, y);
        doc.text('Categoría', 380, y);
        doc.text('Fecha', 480, y);
        
        doc.moveTo(50, y + 15).lineTo(550, y + 15).strokeColor('#aaaaaa').stroke();
        doc.font('Helvetica').fontSize(10);
        y += 25;

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