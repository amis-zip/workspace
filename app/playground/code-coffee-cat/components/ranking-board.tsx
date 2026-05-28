import { CatVariant } from "../types";

type Props = {
  cats: CatVariant[];
};

export default function RankingBoard({ cats }: Props) {
  const sorted = [...cats].sort((a, b) => b.votes - a.votes);
  const totalVotes = cats.reduce((acc, cur) => acc + cur.votes, 0);

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold">Admin Ranking</h2>
        <span className="text-sm text-zinc-400">{totalVotes} votes</span>
      </div>

      <div className="space-y-3">
        {sorted.map((cat, index) => (
          <div
            key={cat.id}
            className="flex items-center justify-between border-b border-white/5 pb-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-zinc-500">#{index + 1}</span>
              <span className="font-medium">{cat.name}</span>
            </div>

            <span className="text-zinc-300">{cat.votes}</span>
          </div>
        ))}
      </div>
    </div>
  );
}