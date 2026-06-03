"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {

  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-800 bg-black/80 backdrop-blur sticky top-0 z-50 mb-10">

      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        <Link
          href="/"
          className="text-2xl font-bold hover:text-gray-300 transition"
        >
          Dashboard
        </Link>

        <div className="flex items-center gap-10 text-sm">

          <Link
            href="/faikerz"
            className={`transition ${
              pathname === "/faikerz"
                ? "text-pink-400"
                : "text-gray-400 hover:text-pink-400"
            }`}
          >
            FAiKERZ
          </Link>

          <Link
            href="/labs"
            className={`transition ${
              pathname === "/labs"
                ? "text-blue-400"
                : "text-gray-400 hover:text-blue-400"
            }`}
          >
            LABS
          </Link>

          <Link
            href="/playground"
            className={`transition ${
              pathname === "/playground"
                ? "text-green-400"
                : "text-gray-400 hover:text-green-400"
            }`}
          >
            PLAYGROUND
          </Link>

        </div>

        <div className="flex items-center gap-4 text-xs">

          <a
            href="https://claude.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition"
          >
            Claude
          </a>

          <a
            href="https://mail.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition"
          >
            Gmail
          </a>

          <a
            href="https://drive.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition"
          >
            Drive
          </a>

        </div>

      </div>

    </nav>
  );
}