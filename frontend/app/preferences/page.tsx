"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const preferencias = [
    "Iglesias",
    "Monumentos",
    "Museos",
    "Parques",
    "Plazas",
    "Gastronomía",
    "Centros culturales",
    "Vida nocturna",
    "Arquitectura colonial",
    "Ferias y mercados",
  ];

  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);

  const toggleSeleccion = (idx: number) => {
    setSeleccionadas((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };


  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  function handleEnviar() {
    setShowModal(true);
    setTimeout(() => {
      router.push("/home");
    }, 3000);
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Contenido principal */}
      <main className="flex-1 flex flex-col items-center justify-center py-6 px-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Preferencias del viajero en Bogotá
        </h1>
        <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl">
          Personaliza tu busqueda de experiencias y sitios turísticos en la
          ciudad con la ayuda de estos parámetros.
        </p>

        {/* Badges de preferencias */}
        <div className="flex flex-wrap justify-center gap-4 max-w-3xl">
          {preferencias.map((pref, idx) => (
            <span
              key={pref}
              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium cursor-pointer transition-colors
                ${
                  seleccionadas.includes(idx)
                    ? "bg-green-500 text-white"
                    : "bg-gray-50 text-gray-600"
                }
              `}
              onClick={() => toggleSeleccion(idx)}
            >
              {pref}
            </span>
          ))}
        </div>
        <div className="mt-8">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-300 transition duration-700"
            onClick={handleEnviar}
          >
            ¡Enviar!
          </button>
        </div>

        {/* Modal de éxito */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center animate-scale-up">
              <h2 className="text-2xl font-bold mb-4 text-green-600">¡Preferencias guardadas con éxito!</h2>
              <p className="text-gray-700">Serás redirigido en unos segundos...</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Mi App de Viajes. Todos los derechos
        reservados.
      </footer>
    </div>
  );
}
