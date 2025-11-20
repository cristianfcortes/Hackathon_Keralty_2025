"use client";

import Link from "next/dist/client/link";
import Image from "next/image";
import userImg from "@/public/userImg.png";
import pageImg from "@/public/pageImg.png";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    router.push("/preferences");
  }
  return (
    <header className="w-full h-16 bg-white flex items-center justify-around shadow-md">
      <div className="h-16 flex items-center cursor-pointer ">
        <Image src={pageImg} alt="Logo" width={50} height={15000} />
      </div>
      <div>
        <ul className="flex gap-5">
          <li>
            <Link href="/home">Inicio</Link>
          </li>
          <li>
            <Link href="/chat_page">chat</Link>
          </li>
          <li>
            <Link href="/report">Reportes</Link>
          </li>
          <li>
            <Link href="/preferences">Preferencias</Link>
          </li>
          <li>
            <Link href="/visit">Visitas</Link>
          </li>
        </ul>
      </div>
      <div className="h-16 flex items-center cursor-pointer">
        <Image src={userImg} alt="User Image" width={50} height={50} onClick={handleClick} />
      </div>
    </header>
  );
}
