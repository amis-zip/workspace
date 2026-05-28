"use client";

import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import CatCard from "./components/cat-card";

import { initialCats } from "./data";
import { CatVariant } from "./types";

const STORAGE_KEY = "code-coffee-cat-votes-v2";
const USER_VOTE_KEY = "code-coffee-cat-user-vote-v2";

export default function CodeCoffeeCatPage() {
  const [cats, setCats] = useState<CatVariant[]>(initialCats);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedVotes = localStorage.getItem(STORAGE_KEY);
    const savedUserVote = localStorage.getItem(USER_VOTE_KEY);

    if (savedVotes) {
      setCats(JSON.parse(savedVotes));
    }

    if (savedUserVote) {
      setHasVoted(true);
      setSelectedIds(JSON.parse(savedUserVote));
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

  const submitVote = () => {
    if (selectedIds.length !== 2 || hasVoted) return;

    const updatedCats = cats.map((cat) =>
      selectedIds.includes(cat.id)
        ? { ...cat, votes: cat.votes + 1 }
        : cat
    );

    setCats(updatedCats);
    setHasVoted(true);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCats));
    localStorage.setItem(USER_VOTE_KEY, JSON.stringify(selectedIds));
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-black text-white px-4 md:px-6 py-8 md:py-10">
      <Navbar />

      <div className="max-w-5xl mx-auto">
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

          <p className="mt-4 text-zinc-400">
            Pick your 2 favorite variants.
          </p>
        </section>

        {hasVoted ? (
          <div className="mb-8 rounded-2xl border border-white/10 bg-zinc-950 p-6">
            <h2 className="text-xl font-semibold">
              Thanks for voting.
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Your picks have been submitted.
              Voting is limited to one submission per device.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {selectedIds.map((id) => {
                const cat = cats.find((c) => c.id === id);

                return (
                  <div
                    key={id}
                    className="
                      rounded-full
                      border
                      border-white/10
                      px-3
                      py-1
                      text-sm
                      text-zinc-300
                    "
                  >
                    {cat?.name}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div
            className="
              sticky
              bottom-4
              md:top-4
              z-20
              mb-8
              rounded-2xl
              border
              border-white/10
              bg-black/80
              backdrop-blur
              p-3
              md:p-4
            "
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-300">
                {selectedIds.length}/2 selected
              </span>

              <button
                type="button"
                onClick={submitVote}
                disabled={selectedIds.length !== 2}
                className={`
                  px-5
                  h-9
                  rounded-full
                  text-sm
                  font-medium
                  transition-all
                  duration-200

                  ${
                    selectedIds.length === 2
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

            {selectedIds.length === 2 && (
              <p className="mt-3 text-xs text-zinc-500">
                Ready to submit your picks.
              </p>
            )}
          </div>
        )}

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
      </div>
    </main>
  );
}