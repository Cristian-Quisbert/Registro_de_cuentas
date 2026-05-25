import { useState, useEffect } from 'react'; 
import Axios from 'axios';
import Swal from 'sweetalert2'; 
import Navbar from './Navbar'; // <--- AGREGA ESTO EN LAS IMPORTACIONES

function Finanzas() {
  const usuarioActivo = localStorage.getItem("usuarioLogueado") || "admin";
  // Estados para el formulario financiero
  const [descripcion, setDescripcion] = useState(""); 
  const [monto, setMonto] = useState("");     
  const [tipo, setTipo] = useState("Ingreso");     
  const [categoria, setCategoria] = useState("Sueldo");   
  const [fecha, setFecha] = useState("");   
  const [id, setId] = useState();           
  const [editar, setEditar] = useState(false);
  const [transaccionesList, setTransaccionesList] = useState([]);

  useEffect(() => {
    getTransacciones();
  }, []);

  // Base URL de nuestra ruta asignada en el backend
  const API_URL = "http://localhost:3001/api/transacciones";

  
  // --- FUNCIÓN: CREAR (VALIDADA) ---
  const add = () => {
    // 1. Validar campos vacíos
    if (!descripcion.trim() || !monto || !fecha) {
      Swal.fire({ icon: "error", title: "Campos incompletos", text: "Por favor, llena todos los campos obligatorios." });
      return; // Detiene la ejecución
    }

    // 2. Validar que el monto sea un número positivo real
    if (parseFloat(monto) <= 0) {
      Swal.fire({ icon: "error", title: "Monto inválido", text: "El monto de la transacción debe ser mayor a 0." });
      return;
    }

    // Si pasa las validaciones, hace la petición Axios original
    Axios.post(`${API_URL}/create`, {
      descripcion, 
      monto, 
      tipo, 
      categoria, 
      fecha,
      usuario: usuarioActivo // <--- Guardamos la transacción amarrada a este usuario
    }).then(() => {
      getTransacciones();   
      limpiarCampos();  
      Swal.fire({ title: "¡Registro Exitoso!", icon: "success", timer: 2000 });
    }).catch((error) => {
      console.error(error);
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo registrar" });
    });
  };

  // --- FUNCIÓN: ACTUALIZAR (VALIDADA) ---
  const update = () => {
    // 1. Validar campos vacíos
    if (!descripcion.trim() || !monto || !fecha) {
      Swal.fire({ icon: "error", title: "Campos incompletos", text: "No puedes dejar campos vacíos al actualizar." });
      return;
    }

    // 2. Validar monto positivo
    if (parseFloat(monto) <= 0) {
      Swal.fire({ icon: "error", title: "Monto inválido", text: "El monto debe ser mayor a 0." });
      return;
    }

    Axios.put(`${API_URL}/update`, {
      id, descripcion, monto, tipo, categoria, fecha 
    }).then(() => {
      getTransacciones();  
      limpiarCampos(); 
      Swal.fire({ title: "¡Actualizado!", icon: "success", timer: 2000 });
    }).catch((error) => {
      console.error(error);
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar" });
    });
  };

  // --- FUNCIÓN: ELIMINAR (Lógica) ---
  const deleteTrans = (val) => {
    Swal.fire({
      title: "¿Confirmar eliminación?",
      html: `<i>¿Desea eliminar la transacción: <b>${val.descripcion}</b>?<br><small class="text-danger">Se aplicará eliminación lógica en la BD.</small></i>`,
      icon: "warning",
      showCancelButton: true,      
      confirmButtonColor: "#3085d6", 
      cancelButtonColor: "#d33",    
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`${API_URL}/delete/${val.id}`)
          .then(() => {
            getTransacciones();  
            limpiarCampos(); 
            Swal.fire({ title: "¡Eliminado!", text: "El registro ha sido removido de la vista.", icon: "success", timer: 2000 });
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar." });
          });
      }
    });
  };

  const limpiarCampos = () => {
    setDescripcion(""); 
    setMonto(""); 
    setTipo("Ingreso"); 
    setCategoria("Sueldo"); 
    setFecha(""); 
    setEditar(false); 
  };

  const prepararEdicion = (val) => {
    setEditar(true);       
    setDescripcion(val.descripcion); 
    setMonto(val.monto);     
    setTipo(val.tipo);     
    setCategoria(val.categoria);   
    // Formatear fecha para el input HTML (YYYY-MM-DD)
    setFecha(val.fecha.split('T')[0]);   
    setId(val.id);         
  };

  const getTransacciones = () => {
    Axios.get(API_URL, {
      params: { usuario: usuarioActivo } // <--- Enviamos el usuario para filtrar
    }).then((response) => {
      setTransaccionesList(response.data); 
    }).catch((error) => console.error(error));
  };
  return (
    <div className="container mt-4">
      <Navbar />
      <h2 className="text-center mb-4">💰 Control de Finanzas Personales</h2>
      
      {/* FORMULARIO */}
      <div className="card text-center mb-4 shadow">
        <div className="card-header bg-secondary text-white">Nueva Transacción</div>
        <div className="card-body">
          
          <div className="input-group mb-3">
            <span className="input-group-text">Descripción:</span>
            <input type="text" onChange={(e) => setDescripcion(e.target.value)} className="form-control" value={descripcion} placeholder="Ej. Pago de alquiler, Almuerzo..." />
          </div>
          
          <div className="input-group mb-3">
            <span className="input-group-text">Monto ($):</span>
            <input type="number" onChange={(e) => setMonto(e.target.value)} className="form-control" value={monto} placeholder="0.00" />
          </div>
          
          <div className="input-group mb-3">
            <span className="input-group-text">Tipo:</span>
            <select className="form-select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="Ingreso">📈 Ingreso</option>
              <option value="Gasto">📉 Gasto</option>
            </select>
          </div>
          
          <div className="input-group mb-3">
            <span className="input-group-text">Categoría:</span>
            <select className="form-select" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              <option value="Sueldo">Sueldo / Ingreso</option>
              <option value="Comida">Alimentación</option>
              <option value="Transporte">Transporte</option>
              <option value="Servicios">Servicios Básicos</option>
              <option value="Educación">Educación</option>
              <option value="Entretenimiento">Entretenimiento / Ocio</option>
            </select>
          </div>
          
          <div className="input-group mb-3">
            <span className="input-group-text">Fecha:</span>
            <input type="date" onChange={(e) => setFecha(e.target.value)} className="form-control" value={fecha} />
          </div>
        </div>

        <div className="card-footer text-body-secondary">
          {editar ? (
            <div>
              <button className="btn btn-warning m-2" onClick={update}>Actualizar</button> 
              <button className="btn btn-info m-2" onClick={limpiarCampos}>Cancelar</button>
            </div>
          ) : (
            <button className="btn btn-success px-4" onClick={add}>Guardar Movimiento</button>
          )}
        </div>
      </div>

      {/* BOTÓN REPORTE PDF FILTRADO CON BACKTICKS */}
      <div className="d-flex justify-content-end mb-3">
        <a 
          href={`http://localhost:3001/api/reportes/pdf?usuario=${usuarioActivo}`} 
          className="btn btn-danger shadow-sm fw-bold"
        >
          📄 Descargar Reporte en PDF
        </a>
      </div>

      {/* TABLA DE RESULTADOS */}
      <table className="table table-dark table-striped shadow">
        <thead>
          <tr>
            <th scope="col">Descripción</th>
            <th scope="col">Monto</th>
            <th scope="col">Tipo</th>
            <th scope="col">Categoría</th>
            <th scope="col">Fecha</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {transaccionesList.map((val, key) => (
            <tr key={val.id || key}>
              <td>{val.descripcion}</td>
              <td className={val.tipo === 'Ingreso' ? "text-success font-weight-bold" : "text-danger"}>
                {val.tipo === 'Ingreso' ? `+$${val.monto}` : `-$${val.monto}`}
              </td>
              <td>{val.tipo}</td>
              <td><span className="badge bg-secondary">{val.categoria}</span></td>
              <td>{val.fecha.split('T')[0]}</td>
              <td>
                <button className="btn btn-info btn-sm m-1" onClick={() => prepararEdicion(val)}>Editar</button>
                <button className="btn btn-danger btn-sm m-1" onClick={() => deleteTrans(val)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Finanzas;