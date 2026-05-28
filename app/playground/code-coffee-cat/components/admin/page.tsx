"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

type Vote = {
  mascot_ids: string[];
  apparel_types: string[];
};

export default function AdminPage() {
  const [votes, setVotes] = useState<Vote[]>([]);

  useEffect(() => {
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    const { data } = await supabase
      .from("votes")
      .select("*");

    if (data) {
      setVotes(data);
    }
  };

  const mascotCounts: Record<string, number> = {};
  const apparelCounts: Record<string, number> = {};

  votes.forEach((vote) => {

    vote.mascot_ids.forEach((id) => {
      mascotCounts[id] = (mascotCounts[id] || 0) + 1;
    });

    vote.apparel_types.forEach((id) => {
      apparelCounts[id] = (apparelCounts[id] || 0) + 1;
    });

  });

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-12">
          CAT GPT Admin
        </h1>

        <section className="mb-14">

          <h2 className="text-2xl font-semibold mb-6">
            Mascot Votes
          </h2>

          <div className="space-y-3">

            {Object.entries(mascotCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([id, count]) => (
                <div
                  key={id}
                  className="flex items-center justify-between border border-white/10 rounded-xl px-5 py-4"
                >
                  <span className="capitalize">
                    {id}
                  </span>

                  <span>
                    {count}
                  </span>
                </div>
              ))}

          </div>

        </section>

        <section>

          <h2 className="text-2xl font-semibold mb-6">
            Apparel Demand
          </h2>

          <div className="space-y-3">

            {Object.entries(apparelCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([id, count]) => (
                <div
                  key={id}
                  className="flex items-center justify-between border border-white/10 rounded-xl px-5 py-4"
                >
                  <span>
                    {id}
                  </span>

                  <span>
                    {count}
                  </span>
                </div>
              ))}

          </div>

        </section>

      </div>

    </main>
  );
}