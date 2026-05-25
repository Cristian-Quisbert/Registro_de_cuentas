import { useEffect, useState } from 'react';
import Axios from 'axios';
import Navbar from './Navbar';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function Dashboard() {
  const [dataGrafico, setDataGrafico] = useState([]);
  const [totales, setTotales] = useState({ ingresos: 0, gastos: 0, balance: 0 });

  useEffect(() => {
    // 1. Recuperamos el usuario logueado actualmente
    const usuarioActivo = localStorage.getItem("usuarioLogueado") || "admin";

    // 2. Enviamos el usuario como parámetro (params) en el GET
    Axios.get("http://localhost:3001/api/transacciones", {
      params: { usuario: usuarioActivo }
    })
    .then((response) => {
      const lista = response.data;
      
      let sumaIngresos = 0;
      let sumaGastos = 0;

      lista.forEach(trans => {
        const montoNum = parseFloat(trans.monto);
        if (trans.tipo === 'Ingreso') {
          sumaIngresos += montoNum;
        } else if (trans.tipo === 'Gasto') {
          sumaGastos += montoNum;
        }
      });

      setTotales({
        ingresos: sumaIngresos,
        gastos: sumaGastos,
        balance: sumaIngresos - sumaGastos
      });

      setDataGrafico([
        { name: 'Ingresos', value: sumaIngresos },
        { name: 'Gastos', value: sumaGastos }
      ]);
    })
    .catch(err => console.error("Error al cargar estadísticas:", err));
  }, []);

  // Colores para el gráfico: Verde para ingresos, Rojo para gastos
  const COLORES = ['#2ec4b6', '#e71d36'];

  return (
    <div className="container mt-4">
      <Navbar />
      <div className="container text-white mt-4">
        <h2 className="text-center mb-4">📊 Panel de Estadísticas Financieras</h2>

        {/* TARJETAS DE TOTALES RESUMIDOS */}
        <div className="row text-center mb-4">
          <div className="col-md-4 mb-3">
            <div className="card bg-success text-white shadow-sm">
              <div className="card-body">
                <h5>Total Ingresos</h5>
                <h3 className="fw-bold">${totales.ingresos.toFixed(2)}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card bg-danger text-white shadow-sm">
              <div className="card-body">
                <h5>Total Gastos</h5>
                <h3 className="fw-bold">${totales.gastos.toFixed(2)}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card bg-secondary text-white shadow-sm">
              <div className="card-body">
                <h5>Balance Neto</h5>
                <h3 className={`fw-bold ${totales.balance >= 0 ? "text-info" : "text-warning"}`}>
                  ${totales.balance.toFixed(2)}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENEDOR DEL GRÁFICO ESTADÍSTICO */}
        <div className="card bg-dark p-4 border border-secondary shadow-lg mx-auto" style={{ maxWidth: "500px" }}>
          <h5 className="text-center mb-3 text-success">Distribución del Presupuesto</h5>
          <div style={{ width: '100%', height: 300 }}>
            {totales.ingresos === 0 && totales.gastos === 0 ? (
              <p className="text-center text-muted pt-5">No hay datos suficientes para generar el gráfico. Registra movimientos en el CRUD.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataGrafico}
                    cx="50%"
                    cy="50%"
                    innerRadius={60} /* Transforma el pastel en una dona elegante */
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dataGrafico.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORES[index % COLORES.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;