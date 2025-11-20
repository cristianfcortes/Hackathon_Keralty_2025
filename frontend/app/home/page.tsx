import FloatingPerson from "./FloatingPerson";

function reditect() {
  console.log("sf");
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Contenido principal */}
      <main className="flex-1 flex flex-col items-center justify-center py-10 px-4 space-y-8">
        {/* Mapa */}
        <div className="w-full max-w-5xl h-[500px] rounded-2xl overflow-hidden shadow-lg">
          <iframe
            title="Mapa de Bogotá"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.740561254496!2d-74.08174908474568!3d4.609710443648745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f99b0e2eecb17%3A0x8679cf4e1e3c8e23!2sBogot%C3%A1%2C%20Colombia!5e0!3m2!1ses!2sco!4v1694567890123!5m2!1ses!2sco"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
          ></iframe>
        </div>

        {/* Persona con globo de diálogo flotante centrado abajo (Client Component) */}
        <FloatingPerson />
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Mi App. Todos los derechos reservados.
      </footer>
    </div>
  );
}
