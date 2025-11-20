"use client";

import { useState } from "react";

export default function Home() {
  const [visitantes, setVisitantes] = useState(0); // Comienza en 0

  const actualizarVisitantes = () => {
    setVisitantes(Math.floor(Math.random() * (500 - 50 + 1)) + 50);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Contenido principal */}
      <main className="flex-1 flex flex-col items-center justify-center py-16 px-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center">
          Visitantes en zonas de Bogotá
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-6xl">
          {/* Mapa */}
          <div className="w-full md:w-2/3 h-[400px] rounded-2xl overflow-hidden shadow-lg">
            <iframe
              title="Mapa de Bogotá"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.740561254496!2d-74.08174908474568!3d4.609710443648745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f99b0e2eecb17%3A0x8679cf4e1e3c8e23!2sBogot%C3%A1%2C%20Colombia!5e0!3m2!1ses!2sco!4v1694567890123!5m2!1ses!2sco"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
            ></iframe>
          </div>

          <div className="flex flex-col items-center gap-4">
            {/* Botón para actualizar visitantes */}
            <button
              onClick={actualizarVisitantes}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Ver visitantes del sitio seleccionado
            </button>

            {/* Círculo con número de visitantes */}
            <div className="flex items-center justify-center w-48 h-48 rounded-full bg-blue-100 shadow-lg">
              <span className="text-4xl font-bold text-blue-700">{visitantes}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Mi App de Viajes. Todos los derechos reservados.
      </footer>
    </div>
  );
}
