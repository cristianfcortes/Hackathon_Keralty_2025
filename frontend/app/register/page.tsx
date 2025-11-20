"use client";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  function register() {
    router.push("/home");
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 py-10">
      <h1 className="text-3xl font-extrabold text-blue-500 mb-6 tracking-tight text-center drop-shadow">Local Trip Bogotá</h1>
      <div className="w-[320px] bg-white rounded-xl shadow-lg border border-blue-200 flex flex-col items-center p-6">
        <h2 className="text-xl font-bold mb-3 text-blue-700 text-center">Registro</h2>
        <form onSubmit={register} className="w-full gap-5 flex flex-col">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-semibold text-blue-700">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-semibold text-blue-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-semibold text-blue-700">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded w-full font-bold text-base hover:bg-blue-600 transition duration-300 shadow"
          >
            Registrarse
          </button>
        </form>
        <div className="mt-4 w-full text-center">
          <a
            href="/login"
            className="text-blue-500 hover:underline text-sm"
          >
            ¿Ya tienes cuenta? Inicia sesión aquí
          </a>
        </div>
      </div>
    </div>
  );
}
