"use client";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  function login() {
    router.push("/home");
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 py-10">
      <h1 className="text-3xl font-extrabold text-blue-500 mb-6 tracking-tight text-center drop-shadow">Local Trip Bogotá</h1>
      <div className="w-[320px] bg-white rounded-xl shadow-lg border border-blue-200 flex flex-col items-center p-6">
        <h2 className="text-xl font-bold mb-3 text-blue-700 text-center">Inicio de Sesión</h2>
        <form onSubmit={login} className="w-full gap-5 flex flex-col">
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
            Login
          </button>
        </form>
        <div className="mt-4 w-full text-center">
          <a
            href="/register"
            className="text-blue-500 hover:underline text-sm"
          >
            ¿No tienes cuenta? Regístrate aquí
          </a>
        </div>
      </div>
    </div>
  );
}
