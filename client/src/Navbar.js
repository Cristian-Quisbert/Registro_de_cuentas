import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Recuperamos el nombre del usuario guardado en la memoria del navegador
    const usuarioActivo = localStorage.getItem("usuarioLogueado") || "Desconocido";

    // --- DISPARAR LOG DE SALIDA ---
    Axios.post("http://localhost:3001/api/logs/registrar", {
      usuario: usuarioActivo,
      evento: "SALIDA"
    })
    .then(() => {
      // Limpiamos la memoria del navegador al salir por seguridad
      localStorage.removeItem("usuarioLogueado");
      navigate('/');
    })
    .catch((err) => {
      console.error("Error al registrar log de salida", err);
      localStorage.removeItem("usuarioLogueado");
      navigate('/');
    });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary mb-4 shadow">
      <div className="container-fluid">
        <Link className="navbar-brand font-weight-bold text-success" to="/finanzas">
          ⚖️ FinanzApp
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">📊 Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/finanzas">💰 Transacciones (CRUD)</Link>
            </li>
          </ul>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;