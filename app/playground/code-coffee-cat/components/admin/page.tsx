"use client";

import { useEffect, useState } from "react";

import Navbar from "@/app/components/Navbar";

import RankingBoard from "@/app/playground/code-coffee-cat/components/ranking-board";

import { initialCats } from "@/app/playground/code-coffee-cat/data";
import { CatVariant } from "@/app/playground/code-coffee-cat/types";
const STORAGE_KEY = "code-coffee-cat-votes-v2";

export default function AdminPage() {
  const [cats, setCats] =
    useState<CatVariant[]>(initialCats);

  useEffect(() => {
    const saved =
      localStorage.getItem(STORAGE_KEY);

    if (saved) {
      setCats(JSON.parse(saved));
    }
  }, []);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">

      <Navbar />

      <div className="max-w-4xl mx-auto">

        <a
          href="/playground/code-coffee-cat"
          className="
            inline-block
            mb-8
            text-sm
            text-zinc-600
            hover:text-white
            transition
          "
        >
          ← Back
        </a>

        <div className="mb-10">

          <p className="
            mb-3
            text-xs
            tracking-[0.35em]
            text-zinc-500
            uppercase
          ">
            Admin Dashboard
          </p>

          <h1 className="
            text-4xl
            tracking-[0.2em]
            font-light
            uppercase
          ">
            Vote Results
          </h1>

        </div>

        <RankingBoard cats={cats} />

      </div>

    </main>
  );
}