"use client";

import { useEffect, useMemo, useState } from "react";
import { initialCats } from "../data";

type Vote = {
  user_id?: string;
  voter_id?: string;
  mascot_ids: string[];
  apparel_types: string[];
  team?: string;
  created_at?: string;
  updated_at?: string;
};

const apparelLabels: Record<string, string> = {
  tshirt: "T-Shirt",
  hoodie: "Hoodie",
  ziphoodie: "Zip Hoodie",
};

export default function AdminPage() {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [debugError, setDebugError] = useState<string | null>(null);
  const fetchVotes = async () => {
    setLoading(true);
    setDebugError(null);

    const response = await fetch("/api/code-coffee-cat/votes", {
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("ADMIN VOTES API ERROR:", result);
      setVotes([]);
      setDebugError(result.error || "Failed to load votes.");
      setLoading(false);
      return;
    }

    setVotes((result.votes || []) as Vote[]);
    setLastUpdated(new Date().toLocaleTimeString());
    setLoading(false);
  };

  useEffect(() => {
    fetchVotes();

    const interval = setInterval(fetchVotes, 5000);

    return () => clearInterval(interval);
  }, []);

  const mascotCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    initialCats.forEach((cat) => {
      counts[cat.id] = 0;
    });

    votes.forEach((vote) => {
      vote.mascot_ids?.forEach((id) => {
        counts[id] = (counts[id] || 0) + 1;
      });
    });

    return counts;
  }, [votes]);

  const apparelCounts = useMemo(() => {
    const counts: Record<string, number> = {
      tshirt: 0,
      hoodie: 0,
      ziphoodie: 0,
    };

    votes.forEach((vote) => {
      const apparel = vote.apparel_types?.[0];

      if (!apparel) return;

      counts[apparel] = (counts[apparel] || 0) + 1;
    });

    return counts;
  }, [votes]);

  const teamCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    votes.forEach((vote) => {
      if (!vote.team) return;

      counts[vote.team] =
        (counts[vote.team] || 0) + 1;
   });

   return counts;
  }, [votes]);

  const totalMascotVotes = Object.values(mascotCounts).reduce(
    (a, b) => a + b,
    0
  );

  const totalApparelVotes = Object.values(apparelCounts).reduce(
    (a, b) => a + b,
    0
  );

  const sortedTeams = Object.entries(teamCounts).sort(
    (a, b) => b[1] - a[1]
  );

  const sortedMascots = initialCats
    .map((cat) => ({
      ...cat,
      count: mascotCounts[cat.id] || 0,
    }))
    .sort((a, b) => b.count - a.count);

  const sortedApparel = Object.entries(apparelCounts).sort(
    (a, b) => b[1] - a[1]
  );

  const topMascot = sortedMascots[0];
  const topApparel = sortedApparel[0];
  const lastVote = votes[0];

  return (
    <main className="min-h-screen bg-black text-white px-4 md:px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <a
          href="/playground/code-coffee-cat"
          className="inline-block mb-8 text-sm text-zinc-600 hover:text-white transition"
        >
          ← Vote Page
        </a>

        <section className="mb-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="mb-3 text-xs tracking-[0.18em] uppercase text-zinc-500">
                Live Dashboard
              </p>

              <h1 className="text-4xl md:text-6xl font-semibold tracking-[0.06em] uppercase">
                CAT GPT Admin
              </h1>

              <p className="mt-5 text-zinc-500 max-w-2xl leading-relaxed">
                Live mascot ranking and apparel demand tracking for the
                FAiKERZ CAT GPT release.
              </p>
            </div>

            <div className="rounded-full border border-white/10 bg-zinc-950 px-4 py-2 text-xs text-zinc-500">
              {loading
                ? "Loading..."
                : `Auto refresh · ${lastUpdated || "—"}`}
            </div>
          </div>
        </section>

        {debugError && (
          <section className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-red-300">
              Admin Votes Error
            </p>

            <p className="mt-2 text-sm text-red-200">
              {debugError}
            </p>
          </section>
        )}

        <section className="grid md:grid-cols-4 gap-4 mb-14">
          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Unique Voters
            </p>

            <h3 className="mt-4 text-5xl font-semibold">
              {votes.length}
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Mascot Selections
            </p>

            <h3 className="mt-4 text-5xl font-semibold">
              {totalMascotVotes}
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Apparel Votes
            </p>

            <h3 className="mt-4 text-5xl font-semibold">
              {totalApparelVotes}
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Last Vote
            </p>

            <h3 className="mt-4 text-sm font-semibold leading-relaxed text-zinc-300">
              {lastVote?.updated_at || lastVote?.created_at
                ? new Date(
                    lastVote.updated_at || lastVote.created_at || ""
                  ).toLocaleString()
                : "-"}
            </h3>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-4 mb-16">
          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Current Favorite
            </p>

            {topMascot && topMascot.count > 0 ? (
              <div className="mt-6 flex items-center gap-5">
                <img
                  src={topMascot.image}
                  alt={topMascot.name}
                  className="w-24 h-24 rounded-2xl object-cover border border-white/10"
                />

                <div>
                  <h2 className="text-3xl font-semibold">
                    {topMascot.name}
                  </h2>

                  <p className="mt-2 text-zinc-500">
                    {topMascot.count} votes
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-6 text-zinc-500">
                No mascot votes yet.
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Most Requested Apparel
            </p>

            {topApparel && topApparel[1] > 0 ? (
              <div className="mt-6">
                <h2 className="text-3xl font-semibold">
                  {apparelLabels[topApparel[0]] || topApparel[0]}
                </h2>

                <p className="mt-2 text-zinc-500">
                  {topApparel[1]} votes
                </p>
              </div>
            ) : (
              <p className="mt-6 text-zinc-500">
                No apparel votes yet.
              </p>
            )}
          </div>
        </section>

        <section className="mb-20">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Mascot Ranking
            </p>

            <h2 className="mt-3 text-4xl font-semibold">
              Live Vote Ranking
            </h2>
          </div>

          <div className="space-y-4">
            {sortedMascots.map((cat, index) => {
              const percentage = totalMascotVotes
                ? (cat.count / totalMascotVotes) * 100
                : 0;

              const cardClass =
                index === 0 && cat.count > 0
                  ? "border-white/20 bg-zinc-900"
                  : "border-white/10 bg-zinc-950";

              return (
                <div
                  key={cat.id}
                  className={`rounded-3xl border p-6 transition-all duration-500 ${cardClass}`}
                >
                  <div className="flex items-center justify-between mb-5 gap-4">
                    <div className="flex items-center gap-5">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-white/10"
                      />

                      <div>
                        <h3 className="text-xl font-semibold">
                          {cat.name}
                        </h3>

                        <p className="text-sm text-zinc-500">
                          {percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-3xl font-semibold">
                        {cat.count}
                      </p>

                      <p className="text-xs text-zinc-500 mt-1">
                        votes
                      </p>
                    </div>
                  </div>

                  <div className="h-2 rounded-full bg-zinc-900 overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-700"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Apparel Demand
            </p>

            <h2 className="mt-3 text-4xl font-semibold">
              Product Interest
            </h2>
          </div>

          <div className="space-y-4">
            {sortedApparel.map(([id, count]) => {
              const percentage = totalApparelVotes
                ? (count / totalApparelVotes) * 100
                : 0;

              return (
                <div
                  key={id}
                  className="rounded-3xl border border-white/10 bg-zinc-950 p-6"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {apparelLabels[id] || id}
                      </h3>

                      <p className="text-sm text-zinc-500">
                        {percentage.toFixed(1)}%
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-3xl font-semibold">
                        {count}
                      </p>

                      <p className="text-xs text-zinc-500 mt-1">
                        votes
                      </p>
                    </div>
                  </div>

                  <div className="h-2 rounded-full bg-zinc-900 overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-700"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
                <section className="mb-20">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Team Participation
            </p>

            <h2 className="mt-3 text-4xl font-semibold">
              Department Breakdown
            </h2>

            <p className="mt-3 text-zinc-500">
              Total participants: {votes.length}
            </p>
          </div>

          <div className="space-y-4">
            {sortedTeams.map(([team, count]) => {
              const percentage = votes.length
                ? (count / votes.length) * 100
                : 0;

              return (
                <div
                  key={team}
                  className="rounded-3xl border border-white/10 bg-zinc-950 p-6"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {team}
                      </h3>

                      <p className="text-sm text-zinc-500">
                        {percentage.toFixed(1)}%
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-3xl font-semibold">
                        {count}
                      </p>

                      <p className="text-xs text-zinc-500 mt-1">
                        participants
                      </p>
                    </div>
                  </div>

                  <div className="h-2 rounded-full bg-zinc-900 overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-700"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}