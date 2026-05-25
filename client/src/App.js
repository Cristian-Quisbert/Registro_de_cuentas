import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Registro from './Registro';
import Finanzas from './Finanzas';

function App() {
  return (
    <Router>
      <Routes>
        {/* La ruta raíz "/" mostrará siempre el formulario de acceso */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registro />} />
        {/* Rutas protegidas internamente por el sistema de navegación */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/finanzas" element={<Finanzas />} />
      </Routes>
    </Router>
  );
}

export default App;