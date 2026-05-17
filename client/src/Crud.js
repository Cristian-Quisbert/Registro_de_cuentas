// ==========================================
// 1. IMPORTACIONES DE LIBRERÍAS
// ==========================================
// useState: Nos permite crear "variables inteligentes" (estados) que React vigila. Si cambian, la pantalla se actualiza.
// useEffect: Nos permite ejecutar código automáticamente en ciertos momentos (por ejemplo, al abrir la página).
import { useState, useEffect } from 'react'; 

// Axios: Es la herramienta que usamos para conectarnos y hablar con nuestro servidor (Backend en el puerto 3001).
import Axios from 'axios';

// Swal (SweetAlert2): Es la librería que usamos para mostrar alertas bonitas en vez de los feos carteles del navegador.
import Swal from 'sweetalert2'; 

// Definimos nuestra función componente. En React, todo componente es una función que devuelve código visual (HTML/JSX).
function Crud() {

  // ==========================================
  // 2. ESTADOS (VARIABLES INTERNAS DE REACT)
  // ==========================================
  // React no usa variables comunes (como let o const) para los formularios, porque necesita "redibujar" la pantalla cuando escribes.
  // Cada par de líneas se lee así: const [valor_actual, función_para_cambiar_el_valor] = useState(valor_inicial);
  
  const [nombre, setNombre] = useState(""); // Guarda el texto que el usuario escribe en el input de "Nombre"
  const [edad, setEdad] = useState("");     // Guarda el número de la "Edad"
  const [pais, setPais] = useState("");     // Guarda el texto del "País"
  const [cargo, setCargo] = useState("");   // Guarda el texto del "Cargo"
  const [anios, setAnios] = useState("");   // Guarda el número de los "Años de experiencia"
  const [id, setId] = useState();           // Guarda el ID del empleado que estamos editando o eliminando (es invisible para el usuario)

  // Este estado es un interruptor (Booleano: true/false). 
  // Si es 'false', la tarjeta muestra el botón "Registrar". Si es 'true', cambia a los botones "Actualizar" y "Cancelar".
  const [editar, setEditar] = useState(false);

  // Aquí guardaremos la lista completa de empleados que nos devuelva la base de datos (empieza como un arreglo vacío []).
  const [empleadosList, setEmpleadosList] = useState([]);


  // ==========================================
  // 3. EFECTOS (CICLO DE VIDA)
  // ==========================================
  // useEffect se ejecuta solo cuando React termina de renderizar el diseño en la pantalla por primera vez.
  useEffect(() => {
    getEmpleados(); // Llamamos a la función para traer a los empleados de la base de datos inmediatamente al abrir la app.
  }, []); // Los corchetes vacíos [] significan: "Solo ejecútate UNA VEZ al cargar la página".


  // ==========================================
  // 4. FUNCIONES LÓGICAS (CONEXIÓN AL BACKEND)
  // ==========================================

  // --- FUNCIÓN: CREAR / REGISTRAR ---
  const add = () => {
    // Axios.post envía datos nuevos al servidor en la ruta "/create"
    Axios.post("http://localhost:3001/create", {
      // Le mandamos al backend un objeto con la información actual de nuestros estados
      nombre, edad, pais, cargo, anios 
    }).then(() => {
      // .then significa: "Si el servidor respondió que todo salió BIEN, haz lo siguiente:"
      getEmpleados();   // Volvemos a pedir la lista de empleados para que el nuevo aparezca en la tabla.
      limpiarCampos();  // Vaciamos los formularios para que queden limpios para un nuevo registro.
      
      // Mostramos el mensaje flotante verde de éxito
      Swal.fire({
        title: "<strong>¡Registro Exitoso!</strong>",
        html: `<i>El empleado <b>${nombre}</b> ha sido registrado correctamente.</i>`,
        icon: "success",
        timer: 3000 // La alerta se cierra sola a los 3 segundos (3000 milisegundos)
      });
    }).catch((error) => {
      // .catch significa: "Si el servidor falló o la base de datos explotó, haz lo siguiente:"
      console.error("Error al registrar empleado:", error); // Muestra el error técnico en la consola (F12)
      Swal.fire({ icon: "error", title: "Oops...", text: "No se pudo registrar al empleado" });
    });
  };

  // --- FUNCIÓN: ACTUALIZAR / EDITAR ---
  const update = () => {
    // Axios.put se usa para modificar un registro existente en la ruta "/update"
    Axios.put("http://localhost:3001/update", {
      // Muy importante mandar el 'id' para que el backend sepa A CUÁL empleado de la tabla debe modificar.
      id, nombre, edad, pais, cargo, anios 
    }).then(() => {
      // Si la base de datos se actualizó correctamente:
      getEmpleados();  // Refrescamos la tabla con los datos nuevos.
      limpiarCampos(); // Reseteamos los inputs y devolvemos el botón a modo "Registrar".
      
      Swal.fire({
        title: "<strong>¡Actualización Exitosa!</strong>",
        html: `<i>El empleado <b>${nombre}</b> fue actualizado con éxito.</i>`,
        icon: "success",
        timer: 3000
      });
    }).catch((error) => {
      console.error("Error al actualizar empleado:", error);
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar el registro" });
    });
  };

  // --- FUNCIÓN: ELIMINAR ---
  // Recibe como parámetro 'val', que es el objeto completo del empleado seleccionado en la fila de la tabla.
  const deleteEmple = (val) => {
    // Primero preguntamos al usuario si está seguro mediante un aviso de advertencia (icon: "warning")
    Swal.fire({
      title: "¿Confirmar eliminado?",
      html: `<i>¿Desea eliminar a <b>${val.nombre}</b>?</i>`,
      icon: "warning",
      showCancelButton: true,      // Muestra el botón de "Cancelar"
      confirmButtonColor: "#3085d6", // Color azul para el botón de confirmar
      cancelButtonColor: "#d33",    // Color rojo para el botón de cancelar
      confirmButtonText: "Sí, ¡eliminarlo!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      // Si el usuario hizo clic en el botón de confirmar ("Sí, ¡eliminarlo!"):
      if (result.isConfirmed) {
        // Axios.delete envía la orden de borrado. Pasamos el ID directamente en la URL (ej: /delete/5)
        Axios.delete(`http://localhost:3001/delete/${val.id}`)
          .then(() => {
            // Si el backend lo borró con éxito de la base de datos:
            getEmpleados();  // Volvemos a cargar la lista para que desaparezca de la tabla.
            limpiarCampos(); // Limpiamos campos por precaución (por si lo estábamos editando justo en ese momento)
            
            Swal.fire({ title: "¡Eliminado!", text: `El empleado ${val.nombre} ha sido eliminado.`, icon: "success", timer: 2000 });
          })
          .catch((error) => {
            console.error("Error al eliminar empleado:", error);
            Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar al empleado." });
          });
      }
    });
  };

  // --- FUNCIÓN: LIMPIAR FORMULARIO ---
  const limpiarCampos = () => {
    // Reseteamos todos los estados a su valor vacío original.
    setNombre(""); 
    setEdad(""); 
    setPais(""); 
    setCargo(""); 
    setAnios(""); 
    setEditar(false); // Apagamos el modo edición para volver al formulario de "Registrar".
  };

  // --- FUNCIÓN: PREPARAR EDICIÓN (Pasar datos de la tabla al formulario) ---
  // Cuando el usuario presiona "Editar" en una fila, capturamos toda la información de ese empleado ('val')
  const editarEmpleado = (val) => {
    setEditar(true);       // Encendemos el interruptor. Ahora la tarjeta cambia sus botones a modo actualización.
    setNombre(val.nombre); // Rellenamos el input de Nombre con lo que ya estaba guardado en la base de datos.
    setEdad(val.edad);     // Rellenamos la Edad.
    setPais(val.pais);     // Rellenamos el País.
    setCargo(val.cargo);   // Rellenamos el Cargo.
    setAnios(val.anios);   // Rellenamos los Años de experiencia.
    setId(val.id);         // Guardamos secretamente su ID en el estado para usarlo después al guardar cambios.
  };

  // --- FUNCIÓN: LEER / TRAER EMPLEADOS ---
  const getEmpleados = () => {
    // Le pide al servidor mediante un método GET que nos devuelva todo lo que tiene la tabla 'empleados'
    Axios.get("http://localhost:3001/empleados").then((response) => {
      // response.data contiene la respuesta real del servidor (el arreglo con las filas de la BD)
      setEmpleadosList(response.data); // Guardamos esa lista en nuestro estado para que React la dibuje en la tabla.
    }).catch((error) => {
      console.error("Error al obtener empleados:", error);
    });
  };


  // ==========================================
  // 5. DISEÑO VISUAL (HTML / JSX)
  // ==========================================
  return (
    <div className="container mt-4">
      
      {/* TARJETA DEL FORMULARIO (CAMPOS DE TEXTO) */}
      <div className="card text-center mb-4">
        <div className="card-header">Gestión de empleados</div>
        <div className="card-body">
          
          {/* INPUT: NOMBRE */}
          <div className="input-group mb-3">
            <span className="input-group-text">Nombre:</span>
            {/* onChange: Cada vez que el usuario presiona una tecla, se ejecuta setNombre con el texto actualizado (e.target.value) */}
            {/* value={nombre}: Vincula el input directamente con nuestro estado. Si el estado cambia (ej. al limpiar), el input también cambía automáticamente */}
            <input type="text" onChange={(e) => setNombre(e.target.value)} className="form-control" value={nombre} placeholder="Ingrese un nombre" />
          </div>
          
          {/* INPUT: EDAD */}
          <div className="input-group mb-3">
            <span className="input-group-text">Edad:</span>
            <input type="number" onChange={(e) => setEdad(e.target.value)} className="form-control" value={edad} placeholder="Ingrese la edad" />
          </div>
          
          {/* INPUT: PAÍS */}
          <div className="input-group mb-3">
            <span className="input-group-text">País:</span>
            <input type="text" onChange={(e) => setPais(e.target.value)} className="form-control" value={pais} placeholder="Ingrese el pais" />
          </div>
          
          {/* INPUT: CARGO */}
          <div className="input-group mb-3">
            <span className="input-group-text">Cargo:</span>
            <input type="text" onChange={(e) => setCargo(e.target.value)} className="form-control" value={cargo} placeholder="Ingrese el cargo" />
          </div>
          
          {/* INPUT: EXPERIENCIA */}
          <div className="input-group mb-3">
            <span className="input-group-text">Años:</span>
            <input type="number" onChange={(e) => setAnios(e.target.value)} className="form-control" value={anios} placeholder="Ingrese los años" />
          </div>
        </div>

        {/* PIE DE LA TARJETA: BOTONES DINÁMICOS */}
        <div className="card-footer text-body-secondary">
          {/* Renderizado condicional usando un operador ternario (condición ? si_es_verdadero : si_es_falso) */}
          {editar ? (
            // Si editar === true (Estamos modificando un registro):
            <div>
              <button className="btn btn-warning m-2" onClick={update}>Actualizar</button> 
              <button className="btn btn-info m-2" onClick={limpiarCampos}>Cancelar</button>
            </div>
          ) : (
            // Si editar === false (Es un registro nuevo común y corriente):
            <button className="btn btn-secondary" onClick={add}>Registrar</button>
          )}
        </div>
      </div>

      {/* TABLA DE RESULTADOS */}
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Edad</th>
            <th scope="col">País</th>
            <th scope="col">Cargo</th>
            <th scope="col">Experiencia</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* .map() es un bucle en JavaScript. Recorre el arreglo de 'empleadosList' uno por uno. */}
          {/* 'val' representa al empleado actual en esta iteración del bucle, 'key' es la posición en el arreglo */}
          {empleadosList.map((val, key) => (
            // key={val.id}: React necesita de forma obligatoria un identificador único para cada fila por temas de rendimiento.
            <tr key={val.id || key}>
              <th>{val.id}</th>
              <td>{val.nombre}</td>
              <td>{val.edad}</td>
              <td>{val.pais}</td>
              <td>{val.cargo}</td>
              <td>{val.anios}</td>
              <td>
                <div className="d-grid gap-2 d-md-block">
                  {/* Botón Editar: Le pasa todo el objeto 'val' de esta fila a la función 'editarEmpleado' */}
                  <button className="btn btn-info m-1" type="button" onClick={() => editarEmpleado(val)}>Editar</button>
                  {/* Botón Eliminar: Le pasa todo el objeto 'val' de esta fila a la función 'deleteEmple' */}
                  <button className="btn btn-danger m-1" onClick={() => deleteEmple(val)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Exportamos nuestro componente procesado para que el archivo App.js pueda importarlo y usarlo en la app.
export default Crud;