"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

// Datos más realistas para los sitios más visitados
const dataBarras = [
  { name: "Museo del Oro", visitas: 1345 },
  { name: "Parque Simón Bolívar", visitas: 1120 },
  { name: "Catedral Primada", visitas: 890 },
  { name: "Monumento a Bolívar", visitas: 670 },
  { name: "Plaza de Bolívar", visitas: 540 },
];

// Datos de torta basados en la misma proporción
const dataTorta = [
  { name: "Museos", value: 1345 },
  { name: "Parques", value: 1120 },
  { name: "Iglesias", value: 890 },
  { name: "Monumentos", value: 670 },
  { name: "Plazas", value: 540 },
];
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];

// Datos de línea con tendencia mensual más creíble
const dataLinea = [
  { mes: "Ene", visitas: 420 },
  { mes: "Feb", visitas: 510 },
  { mes: "Mar", visitas: 780 },
  { mes: "Abr", visitas: 950 },
  { mes: "May", visitas: 1200 },
  { mes: "Jun", visitas: 1450 },
  { mes: "Jul", visitas: 1600 },
  { mes: "Ago", visitas: 1580 },
  { mes: "Sep", visitas: 1420 },
  { mes: "Oct", visitas: 1300 },
  { mes: "Nov", visitas: 1100 },
  { mes: "Dic", visitas: 1700 },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Contenido principal */}
      <main className="flex-1 flex flex-col items-center py-16 px-6 space-y-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center">
          Reportes Turísticos de Bogotá
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-3xl">
          Visualización de datos sobre sitios turísticos más visitados, tendencias de
          asistencia y observaciones clave para planificar futuras experiencias.
        </p>

        {/* Gráficas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">
          {/* Barras */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Sitios más visitados
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataBarras}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visitas" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Torta */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Distribución de categorías
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dataTorta}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {dataTorta.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Línea de tendencia */}
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-5xl">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Tendencia mensual de visitas
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataLinea}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="visitas"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Observaciones */}
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-4xl">
          <h2 className="text-xl font-semibold mb-4">Observaciones</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              El <span className="font-semibold">Museo del Oro</span> sigue siendo el sitio más popular, especialmente entre turistas internacionales.
            </li>
            <li>
              Los <span className="font-semibold">parques principales</span> muestran mayor afluencia los fines de semana y días festivos.
            </li>
            <li>
              Algunos <span className="font-semibold">monumentos históricos</span> requieren mayor promoción para aumentar su visibilidad.
            </li>
            <li>
              Se recomienda crear <span className="font-semibold">rutas culturales temáticas</span> para distribuir mejor a los visitantes por la ciudad.
            </li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Mi App de Viajes. Todos los derechos reservados.
      </footer>
    </div>
  );
}
