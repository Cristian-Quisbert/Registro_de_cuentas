import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Axios from 'axios';
import Swal from 'sweetalert2';

function Registro() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fuerza, setFuerza] = useState("Débil");
  const [colorFuerza, setColorFuerza] = useState("text-danger");
  const navigate = useNavigate();

  // Función que evalúa la contraseña en tiempo real
  const evaluarContrasena = (clave) => {
    setPassword(clave);

    if (clave.length === 0) {
      setFuerza("Débil");
      setColorFuerza("text-danger");
      return;
    }

    // Criterios
    const tieneNumeros = /\d/.test(clave);
    const tieneLetras = /[a-zA-Z]/.test(clave);
    const tieneEspeciales = /[!@#$%^&*(),.?":{}|<>]/.test(clave);
    const longitudCorrecta = clave.length >= 8;

    // Conteo de puntos de seguridad
    let puntos = 0;
    if (tieneLetras) puntos++;
    if (tieneNumeros) puntos++;
    if (tieneEspeciales) puntos++;
    if (longitudCorrecta) puntos++;

    // Clasificación
    if (puntos <= 2) {
      setFuerza("Débil ❌");
      setColorFuerza("text-danger");
    } else if (puntos === 3) {
      setFuerza("Intermedia ⚠️");
      setColorFuerza("text-warning");
    } else if (puntos === 4) {
      setFuerza("¡Fuerte!  (Segura para el profesor)");
      setColorFuerza("text-success");
    }
  };

  const handleRegistro = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      Swal.fire({ icon: "error", title: "Campos vacíos", text: "Todos los campos son obligatorios." });
      return;
    }

    // Enviamos los datos al backend (crearemos esta ruta en la siguiente fase)
    Axios.post("http://localhost:3001/api/auth/register", {
      username,
      password
    }).then(() => {
      Swal.fire({ icon: "success", title: "¡Usuario Creado!", text: "Ya puedes iniciar sesión.", timer: 2000 });
      navigate("/"); // Redirige al login
    }).catch((error) => {
      console.error(error);
      Swal.fire({ icon: "error", title: "Error", text: error.response?.data || "No se pudo registrar al usuario." });
    });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card bg-dark text-white p-4 shadow-lg border border-secondary" style={{ width: "420px" }}>
        <h3 className="text-center text-success mb-4">📝 Registro de Usuario</h3>
        <form onSubmit={handleRegistro}>
          
          <div className="mb-3">
            <label className="form-label">Nombre de Usuario:</label>
            <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Ej. jordan123" />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña:</label>
            <input type="password" className="form-control" value={password} onChange={(e) => evaluarContrasena(e.target.value)} required placeholder="Mínimo 8 caracteres" />
            
            {/* Indicador visual de seguridad */}
            <div className="form-text mt-2 text-white">
              Seguridad: <span className={`fw-bold ${colorFuerza}`}>{fuerza}</span>
            </div>
            <small className="text-muted d-block mt-1">Tip: Usa letras, números y símbolos para hacerla fuerte.</small>
          </div>

          <button type="submit" className="btn btn-success w-100 mt-3">Registrar Cuenta</button>
          
          <div className="text-center mt-3">
            <Link to="/" className="text-info text-decoration-none">¿Ya tienes cuenta? Inicia sesión aquí</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registro;