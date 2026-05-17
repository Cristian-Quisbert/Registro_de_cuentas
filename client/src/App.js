// ==========================================
// 1. IMPORTACIONES DE ESTILOS Y COMPONENTES
// ==========================================

// Importa los estilos CSS personalizados de tu aplicación (colores, fondos, fuentes generales).
import './App.css';

// Importa los estilos de Bootstrap. 
// Gracias a esta línea, puedes usar clases como "container", "card", "btn-warning" o "table-striped" en tu componente Crud.
import 'bootstrap/dist/css/bootstrap.min.css';

// Importa el componente que acabamos de limpiar y guardar en el archivo 'Crud.js'.
// Nota: Usamos "Crud" con 'C' mayúscula porque en React todos los componentes creados por ti deben empezar con mayúscula.
import Crud from './Crud'; 


// ==========================================
// 2. COMPONENTE PRINCIPAL (RAÍZ)
// ==========================================

// Definimos la función principal llamada App. 
// Cuando tu proyecto de React arranca, lo primero que busca es este componente para renderizarlo en el navegador.
function App() {
  
  // return: Aquí indicamos qué queremos que dibuje este componente en la pantalla.
  return (
    // Renderizamos nuestro componente modular. 
    // Al escribir <Crud />, React va al archivo 'Crud.js', toma todo el formulario, la tabla y la lógica, y los mete justo aquí.
    <Crud />
  );
}

// ==========================================
// 3. EXPORTACIÓN
// ==========================================

// Exportamos el componente App por defecto. 
// Esto permite que el archivo index.js (el archivo oculto que conecta React con el HTML real) pueda cargar toda tu aplicación.
export default App;