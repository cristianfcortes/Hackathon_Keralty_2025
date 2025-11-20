export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-gray-700 mb-4">
            We&apos;re here to help! Reach out to us through any of the following methods.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2">Email</h3>
          <address className="not-italic">
            <a
              href="mailto:contact@example.com"
              className="text-blue-600 hover:underline"
              aria-label="Send email to contact@example.com"
            >
              contact@example.com
            </a>
          </address>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2">Phone</h3>
          <address className="not-italic">
            <a
              href="tel:+1-555-0123"
              className="text-blue-600 hover:underline"
              aria-label="Call us at +1-555-0123"
            >
              +1-555-0123
            </a>
          </address>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2">Address</h3>
          <address className="not-italic text-gray-700">
            123 Main Street<br />
            New York, NY 10001<br />
            United States
          </address>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2">Office Hours</h3>
          <p className="text-gray-700">
            Monday - Friday: 9:00 AM - 5:00 PM<br />
            Saturday: 10:00 AM - 2:00 PM<br />
            Sunday: Closed
          </p>
        </section>
      </div>
    </div>
  );
}

