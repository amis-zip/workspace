"use client";

import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import CatCard from "./components/cat-card";

import { initialCats } from "./data";
import { CatVariant } from "./types";

const STORAGE_KEY = "code-coffee-cat-votes-v2";
const USER_VOTE_KEY = "code-coffee-cat-user-vote-v2";
const APPAREL_KEY = "code-coffee-cat-apparel-v2";

const apparelOptions = [
  {
    id: "tshirt",
    label: "T-Shirt",
    desc: "Daily oversized fit",
  },
  {
    id: "hoodie",
    label: "Hoodie",
    desc: "Heavyweight pullover",
  },
  {
    id: "ziphoodie",
    label: "Zip Hoodie",
    desc: "Layered streetwear fit",
  },
];

export default function CodeCoffeeCatPage() {
  const [cats, setCats] = useState<CatVariant[]>(initialCats);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [selectedApparel, setSelectedApparel] = useState<string[]>([]);

  const [hasVoted, setHasVoted] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedVotes = localStorage.getItem(STORAGE_KEY);

    const savedUserVote = localStorage.getItem(USER_VOTE_KEY);

    const savedApparel = localStorage.getItem(APPAREL_KEY);

    if (savedVotes) {
      setCats(JSON.parse(savedVotes));
    }

    if (savedUserVote) {
      setHasVoted(true);
      setSelectedIds(JSON.parse(savedUserVote));
    }

    if (savedApparel) {
      setSelectedApparel(JSON.parse(savedApparel));
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cats));
  }, [cats, mounted]);

  const toggleCat = (id: string) => {
    if (hasVoted) return;

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

  const toggleApparel = (id: string) => {
    if (hasVoted) return;

    setSelectedApparel((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }

      return [...prev, id];
    });
  };

  const submitVote = () => {
    if (
      selectedIds.length !== 2 ||
      selectedApparel.length === 0 ||
      hasVoted
    ) {
      return;
    }

    const updatedCats = cats.map((cat) =>
      selectedIds.includes(cat.id)
        ? { ...cat, votes: cat.votes + 1 }
        : cat
    );

    setCats(updatedCats);

    setHasVoted(true);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCats));

    localStorage.setItem(
      USER_VOTE_KEY,
      JSON.stringify(selectedIds)
    );

    localStorage.setItem(
      APPAREL_KEY,
      JSON.stringify(selectedApparel)
    );
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-black text-white px-5 md:px-8 py-10">
      <Navbar />

      <div className="max-w-6xl mx-auto">
        <a
          href="/playground"
          className="inline-block mb-8 text-sm text-zinc-600 hover:text-white transition"
        >
          ← Back
        </a>

        {/* HERO */}
        <section className="mb-14">
          <p className="mb-3 text-xs tracking-[0.18em] text-zinc-500 uppercase">
            FAIKERZ Teamwear Vote
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

          <p className="mt-4 text-zinc-400 max-w-2xl leading-relaxed">
            Help decide the final CAT GPT teamwear release.
            Pick your favorite apparel types and choose
            your top 2 mascot variants.
          </p>
        </section>

        {/* APPAREL SURVEY */}
        <section className="mb-16">
          <div className="mb-6">
            <p className="text-xs tracking-[0.18em] uppercase text-zinc-500">
              Apparel Survey
            </p>

            <h2 className="mt-3 text-2xl md:text-3xl font-semibold">
              What would you actually wear?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {apparelOptions.map((item) => {
              const active = selectedApparel.includes(item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleApparel(item.id)}
                  disabled={hasVoted}
                  className={`
                    rounded-2xl
                    border
                    p-6
                    text-left
                    transition-all
                    duration-300

                    ${
                      active
                        ? `
                          border-white
                          bg-zinc-900
                          shadow-[0_0_30px_rgba(255,255,255,0.06)]
                        `
                        : `
                          border-white/10
                          bg-zinc-950
                          hover:border-white/20
                        `
                    }

                    ${
                      hasVoted
                        ? "cursor-not-allowed opacity-70"
                        : "cursor-pointer"
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {item.label}
                    </h3>

                    {active && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </div>

                  <p className="mt-2 text-sm text-zinc-500">
                    {item.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* MOCKUP */}
        <section className="mb-16">
          <div className="mb-6">
            <p className="text-xs tracking-[0.18em] uppercase text-zinc-500">
              Official Mockup
            </p>

            <h2 className="mt-3 text-2xl md:text-4xl font-semibold">
              T-Shirts
            </h2>

            <p className="mt-3 text-zinc-500 max-w-2xl">
              Vintage washed black apparel concept with
              oversized silhouette, back graphics,
              sleeve details, and CAT GPT mascot branding.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950">
            <img
              src="/mockups/teamwear-board.png"
              alt="CAT GPT Teamwear Mockup"
              className="w-full h-auto object-cover"
            />
          </div>
        </section>

        {/* VOTE BAR */}
        {hasVoted ? (
          <div className="mb-10 rounded-2xl border border-white/10 bg-zinc-950 p-6">
            <h2 className="text-xl font-semibold">
              Thanks for voting.
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Your picks have been submitted successfully.
            </p>
          </div>
        ) : (
          <div className="sticky top-4 z-20 mb-10 rounded-2xl border border-white/10 bg-black/80 backdrop-blur p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
                Submit Picks
              </button>
            </div>
          </div>
        )}

        {/* CAT VOTE */}
        <section className="pb-10">
          <div className="mb-6">
            <p className="text-xs tracking-[0.18em] uppercase text-zinc-500">
              Mascot Vote
            </p>

            <h2 className="mt-3 text-2xl md:text-3xl font-semibold">
              Pick your 2 favorite CAT variants
            </h2>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
            {cats.map((cat) => (
              <CatCard
                key={cat.id}
                cat={cat}
                selected={selectedIds.includes(cat.id)}
                disabled={selectedIds.length >= 2}
                hasVoted={hasVoted}
                onToggle={() => toggleCat(cat.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}