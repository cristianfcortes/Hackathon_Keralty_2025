export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contáctanos</h1>

      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Ponte en Contacto</h2>
          <p className="text-gray-700 mb-4">
            ¡Estamos aquí para ayudarte! Comunícate con nosotros a través de cualquiera de los siguientes medios.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2">Correo Electrónico</h3>
          <address className="not-italic">
            <a
              href="mailto:contact@example.com"
              className="text-blue-600 hover:underline"
              aria-label="Enviar correo a contact@example.com"
            >
              contact@example.com
            </a>
          </address>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2">Teléfono</h3>
          <address className="not-italic">
            <a
              href="tel:+1-555-0123"
              className="text-blue-600 hover:underline"
              aria-label="Llamar al +1-555-0123"
            >
              +1-555-0123
            </a>
          </address>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2">Dirección</h3>
          <address className="not-italic text-gray-700">
            Calle Principal 123<br />
            Manizales, Caldas<br />
            Colombia
          </address>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2">Horario de Atención</h3>
          <p className="text-gray-700">
            Lunes - Viernes: 9:00 AM - 5:00 PM<br />
            Sábado: 10:00 AM - 2:00 PM<br />
            Domingo: Cerrado
          </p>
        </section>
      </div>
    </div>
  );
}

