"use client";
import Image from "next/image";
import IaImg from "@/public/iaImg.png";
import { useRouter } from "next/navigation";

export default function FloatingPerson() {
  const router = useRouter();

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    router.push("/chat_page");
  }
  return (
    <div
      className="fixed left-1/2 z-50 flex items-center w-auto h-40 cursor-pointer"
      style={{ bottom: "24px", transform: "translateX(-50%)" }}
      onClick={handleClick}
    >
      <Image
        src={IaImg}
        className="w-40 h-40 object-cover rounded-full border-4 border-white shadow-md"
        alt="Logo"
      />
      <div className="relative ml-4 bg-white text-gray-800 px-4 py-2 rounded-xl shadow-lg w-44 flex items-center flex-col">
        <p className="text-sm font-medium">¡Bienvenido a Bogotá!</p>
        <p className="text-sm font-medium">
          Yo soy <strong>Localito</strong>, tu asistente virtual.
        </p>
        <p className="text-sm font-medium">
          ¡Clikame y te ayudare a conocer esta hermosa cuidad!
        </p>

        {/* Punta del globo hacia la izquierda */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 w-0 h-0 border-t-6 border-b-6 border-r-8 border-t-transparent border-b-transparent border-r-white"></div>
      </div>
    </div>
  );
}
