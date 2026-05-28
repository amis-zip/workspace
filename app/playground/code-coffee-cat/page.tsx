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

  const [apparelType, setApparelType] = useState<string | null>(
    null
  );

  useEffect(() => {
    const savedVotes = localStorage.getItem(STORAGE_KEY);

    const savedUserVote =
      localStorage.getItem(USER_VOTE_KEY);

    if (savedVotes) {
      setCats(JSON.parse(savedVotes));
    }

    if (savedUserVote) {
      const parsed = JSON.parse(savedUserVote);

      setSelectedIds(parsed.selectedCats || []);

      setApparelType(parsed.apparelType || null);

      setHasVoted(true);
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(cats)
    );
  }, [cats, mounted]);

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

  const submitVote = async () => {
    if (selectedIds.length !== 2) return;

    if (!apparelType) return;

    const previousVoteRaw =
      localStorage.getItem(USER_VOTE_KEY);

    const previousVotes = previousVoteRaw
      ? JSON.parse(previousVoteRaw)
      : null;

    let updatedCats = [...cats];

    // 이전 투표 차감
    if (previousVotes?.selectedCats) {
      updatedCats = updatedCats.map((cat) => {
        if (
          previousVotes.selectedCats.includes(cat.id)
        ) {
          return {
            ...cat,
            votes: Math.max(0, cat.votes - 1),
          };
        }

        return cat;
      });
    }

    // 새 투표 추가
    updatedCats = updatedCats.map((cat) => {
      if (selectedIds.includes(cat.id)) {
        return {
          ...cat,
          votes: cat.votes + 1,
        };
      }

      return cat;
    });

    setCats(updatedCats);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedCats)
    );

    localStorage.setItem(
      USER_VOTE_KEY,
      JSON.stringify({
        selectedCats: selectedIds,
        apparelType,
      })
    );

    setHasVoted(true);
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-black text-white px-4 md:px-6 py-10">
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

          <p className="mt-4 text-zinc-400 text-sm md:text-base leading-relaxed">
            Help decide the final CAT GPT teamwear release.
            Pick your favorite apparel type and choose your
            top 2 mascot variants.
          </p>
        </section>

        <section className="mb-12">
          <p className="mb-4 text-[11px] tracking-[0.18em] text-zinc-500 uppercase">
            Apparel Survey
          </p>

          <h2 className="text-2xl font-semibold mb-6">
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
              const active =
                apparelType === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() =>
                    setApparelType(item.id)
                  }
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
                          bg-zinc-900
                          shadow-[0_0_24px_rgba(255,255,255,0.05)]
                        `
                        : `
                          border-white/10
                          bg-zinc-950
                          hover:border-white/20
                        `
                    }
                  `}
                >
                  <h3 className="text-lg font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    {item.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-14">
          <p className="mb-4 text-[11px] tracking-[0.18em] text-zinc-500 uppercase">
            Official Mockup
          </p>

          <h2 className="text-3xl font-semibold mb-4">
            T-Shirts
          </h2>

          <p className="max-w-3xl text-sm text-zinc-400 leading-relaxed mb-8">
            Vintage washed black apparel concept with
            oversized silhouette, back graphic, sleeve
            detail, and CAT GPT mascot branding.
          </p>

          <div className="rounded-3xl overflow-hidden border border-white/10 bg-zinc-950">
            <img
              src="/mockups/tshirt-board.png"
              alt="CAT GPT Teamwear Mockup"
              className="w-full h-auto object-cover"
            />
          </div>
        </section>

        <div className="sticky top-4 z-20 mb-8 rounded-2xl border border-white/10 bg-black/80 backdrop-blur p-3 md:p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-300">
              {selectedIds.length}/2 mascot picks
              selected
            </span>

            <button
              type="button"
              onClick={submitVote}
              disabled={
                selectedIds.length !== 2 ||
                !apparelType
              }
              className={`
                px-5
                h-9
                rounded-full
                text-sm
                font-medium
                transition-all
                duration-200

                ${
                  selectedIds.length === 2 &&
                  apparelType
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
              {hasVoted
                ? "Update Picks"
                : "Submit Picks"}
            </button>
          </div>

          <p className="mt-3 text-xs text-zinc-500">
            You can update your vote later.
          </p>
        </div>

        <section className="mb-6">
          <p className="mb-3 text-[11px] tracking-[0.18em] text-zinc-500 uppercase">
            Mascot Vote
          </p>

          <h2 className="text-3xl font-semibold">
            Pick your 2 favorite CAT GPT variants
          </h2>
        </section>

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