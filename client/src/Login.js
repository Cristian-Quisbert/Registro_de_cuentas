import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Swal from 'sweetalert2';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // Estados para el CAPTCHA Matemático
  const [numA, setNumA] = useState(0);
  const [numB, setNumB] = useState(0);
  const [captchaUsuario, setCaptchaUsuario] = useState("");

  const navigate = useNavigate();

  // Función para generar un nuevo CAPTCHA cada vez que carga la página o falla el login
  const generarCaptcha = () => {
    setNumA(Math.floor(Math.random() * 10) + 1); // Número aleatorio del 1 al 10
    setNumB(Math.floor(Math.random() * 10) + 1);
    setCaptchaUsuario(""); // Resetea el campo
  };

  useEffect(() => {
    generarCaptcha();
  }, []);












  const handleLogin = (e) => {
    e.preventDefault();
    
    // 1. Validar el CAPTCHA en el Frontend
    const resultadoCorrecto = numA + numB;
    if (parseInt(captchaUsuario) !== resultadoCorrecto) {
      Swal.fire({ icon: 'error', title: 'CAPTCHA incorrecto', text: 'Por favor, resuelve la operación matemática correctamente.' });
      generarCaptcha(); // Genera uno nuevo por seguridad si falla
      return;
    }

    // 2. Si el CAPTCHA es correcto, enviamos la petición real al Backend
    // ... (Código previo del login)
    Axios.post("http://localhost:3001/api/auth/login", {
      username,
      password
    }).then((response) => {
      // Guardamos el usuario logueado en la memoria local
      localStorage.setItem("usuarioLogueado", response.data.usuario);

      // --- DISPARAR LOG DE INGRESO ---
      Axios.post("http://localhost:3001/api/logs/registrar", {
        usuario: response.data.usuario,
        evento: "INGRESO"
      }).catch(err => console.error("Error al registrar log de ingreso", err));
      // -------------------------------

      Swal.fire({ icon: 'success', title: '¡Ingreso Exitoso!', showConfirmButton: false, timer: 1500 });
      navigate('/dashboard');
    }).catch((error) => {
      console.error(error);
      Swal.fire({ 
        icon: 'error', 
        title: 'Error de Acceso', 
        text: error.response?.data || "No se pudo conectar con el servidor." 
      });
      generarCaptcha(); // Resetea el captcha si las credenciales fallan
    });
  };















  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card bg-dark text-white p-4 shadow-lg border border-secondary" style={{ width: "400px" }}>
        <h3 className="text-center text-success mb-4">🔐 Iniciar Sesión</h3>
        <form onSubmit={handleLogin}>
          
          <div className="mb-3">
            <label className="form-label">Usuario:</label>
            <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Introduce tu usuario" />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Contraseña:</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Introduce tu contraseña" />
          </div>

          {/* CUADRO VISUAL DEL CAPTCHA */}
          <div className="mb-3 p-3 bg-secondary rounded border border-light text-center shadow-sm">
            <label className="form-label fw-bold mb-2 text-white">🛡️ Control de seguridad (Verificación Humana)</label>
            <div className="h5 my-2 text-warning fw-bold">{numA} + {numB} = ?</div>
            <input 
              type="number" 
              className="form-control form-control-sm text-center" 
              placeholder="Escribe el resultado de la suma" 
              value={captchaUsuario} 
              onChange={(e) => setCaptchaUsuario(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="btn btn-success w-100 mt-2">Ingresar al Sistema</button>
          
          <div className="text-center mt-3">
            <Link to="/register" className="text-info text-decoration-none">¿No tienes cuenta? Regístrate aquí</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;