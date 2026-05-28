"use client";

import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";

import CatCard from "./components/cat-card";

import { initialCats } from "./data";
import { CatVariant } from "./types";

import { supabase } from "@/lib/supabase";

const STORAGE_KEY = "code-coffee-cat-votes-v2";
const USER_ID_KEY = "code-coffee-cat-user-id";

export default function CodeCoffeeCatPage() {
  const [cats, setCats] = useState<CatVariant[]>(initialCats);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedApparel, setSelectedApparel] = useState<string[]>([]);

  const [hasSaved, setHasSaved] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedVotes = localStorage.getItem(STORAGE_KEY);

    if (savedVotes) {
      setCats(JSON.parse(savedVotes));
    }

    let voterId = localStorage.getItem(USER_ID_KEY);

    if (!voterId) {
      voterId = crypto.randomUUID();
      localStorage.setItem(USER_ID_KEY, voterId);
    }

    loadExistingVote(voterId);

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cats));
  }, [cats, mounted]);

  const loadExistingVote = async (voterId: string) => {
    const { data } = await supabase
      .from("votes")
      .select("*")
      .eq("voter_id", voterId)
      .single();

    if (data) {
      setSelectedIds(data.mascot_ids || []);
      setSelectedApparel(data.apparel_types || []);
      setHasSaved(true);
    }
  };

  const toggleCat = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }

      if (prev.length >= 2) {
        return prev;
      }

      return [...prev, id];
    });
  };

  const toggleApparel = (type: string) => {
    setSelectedApparel((prev) => {
      if (prev.includes(type)) {
        return prev.filter((item) => item !== type);
      }

      return [...prev, type];
    });
  };

  const submitVote = async () => {
    if (selectedIds.length !== 2) return;

    const voterId = localStorage.getItem(USER_ID_KEY);

    if (!voterId) return;

    const updatedCats = initialCats.map((cat) => ({
      ...cat,
      votes: cat.votes,
    }));

    setCats(updatedCats);

    await supabase
      .from("votes")
      .upsert({
        voter_id: voterId,
        mascot_ids: selectedIds,
        apparel_types: selectedApparel,
      });

    setHasSaved(true);
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <Navbar />

      <div className="max-w-6xl mx-auto">

        <a
          href="/playground"
          className="inline-block mb-8 text-sm text-zinc-600 hover:text-white transition"
        >
          ← Back
        </a>

        <section className="mb-10">

          <p className="mb-3 text-xs tracking-[0.18em] text-zinc-500 uppercase">
            FAiKERZ Teamwear Vote
          </p>

          <h1
            className="
              text-3xl
              md:text-5xl
              font-semibold
              tracking-[0.08em]
              uppercase
              text-white
            "
          >
            CODE. COFFEE. CAT.
          </h1>

          <p className="mt-4 text-zinc-400 max-w-2xl">
            Help decide the final CAT GPT teamwear release.
            Pick your favorite apparel types and choose your top 2 mascot variants.
          </p>

        </section>

        <section className="mb-16">

          <p className="mb-3 text-xs tracking-[0.18em] text-zinc-500 uppercase">
            Apparel Survey
          </p>

          <h2 className="text-2xl font-semibold text-white mb-6">
            What would you actually wear?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {[
              {
                id: "tshirt",
                title: "T-Shirt",
                desc: "Daily oversized fit",
              },
              {
                id: "hoodie",
                title: "Hoodie",
                desc: "Heavyweight pullover",
              },
              {
                id: "ziphoodie",
                title: "Zip Hoodie",
                desc: "Layered streetwear fit",
              },
            ].map((item) => {
              const active = selectedApparel.includes(item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleApparel(item.id)}
                  className={`
                    rounded-2xl
                    border
                    p-5
                    text-left
                    transition-all
                    duration-300

                    ${
                      active
                        ? `
                          border-white
                          bg-white/[0.03]
                        `
                        : `
                          border-white/10
                          hover:border-white/20
                        `
                    }
                  `}
                >
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-zinc-500">
                    {item.desc}
                  </p>
                </button>
              );
            })}

          </div>

        </section>

        <section className="mb-16">

          <p className="mb-3 text-xs tracking-[0.18em] text-zinc-500 uppercase">
            Official Mockup
          </p>

          <h2 className="text-3xl font-semibold text-white mb-4">
            T-Shirts
          </h2>

          <p className="text-zinc-500 mb-8 max-w-3xl">
            Current production mockup for the oversized vintage T-shirt version.
            Hoodie and zip hoodie concepts may be developed based on team demand.
          </p>

          <div className="overflow-hidden rounded-3xl border border-white/10">
            <img
              src="/mockups/tshirt-board.png"
              alt="CAT GPT mockup"
              className="w-full object-cover"
            />
          </div>

        </section>

        <section className="mb-10">

          <p className="mb-3 text-xs tracking-[0.18em] text-zinc-500 uppercase">
            Mascot Vote
          </p>

          <h2 className="text-3xl font-semibold text-white mb-8">
            Pick your 2 favorite CAT GPT variants
          </h2>

        </section>

        <div className="sticky top-4 z-20 mb-10 rounded-2xl border border-white/10 bg-black/80 backdrop-blur p-4">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-zinc-300">
                {selectedIds.length}/2 mascot picks selected
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Select at least 1 apparel type.
              </p>
            </div>

            <button
              type="button"
              onClick={submitVote}
              disabled={
                selectedIds.length !== 2 ||
                selectedApparel.length === 0
              }
              className={`
                px-5
                h-10
                rounded-full
                text-sm
                font-medium
                transition-all
                duration-200

                ${
                  selectedIds.length === 2 &&
                  selectedApparel.length > 0
                    ? `
                      bg-zinc-200
                      text-black
                      hover:bg-white
                    `
                    : `
                      bg-zinc-900
                      text-zinc-600
                      cursor-not-allowed
                    `
                }
              `}
            >
              {hasSaved ? "Update Picks" : "Save Picks"}
            </button>

          </div>

          {hasSaved && (
            <p className="mt-3 text-xs text-zinc-500">
              Your selections are saved. You can still update them later.
            </p>
          )}

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

          {cats.map((cat) => (
            <CatCard
              key={cat.id}
              cat={cat}
              selected={selectedIds.includes(cat.id)}
              disabled={
                selectedIds.length >= 2 &&
                !selectedIds.includes(cat.id)
              }
              hasVoted={hasSaved}
              onToggle={() => toggleCat(cat.id)}
            />
          ))}

        </div>

      </div>
    </main>
  );
}