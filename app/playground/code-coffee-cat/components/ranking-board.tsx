type Cat = {
  id: string;
  name: string;
  image: string;
  votes: number;
};

type Props = {
  cats: Cat[];
};

export default function RankingBoard({ cats }: Props) {
  const sorted = [...cats].sort((a, b) => b.votes - a.votes);

  const totalVotes = sorted.reduce((sum, cat) => sum + cat.votes, 0);

  if (totalVotes === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-zinc-950 p-8">
        <p className="text-zinc-500">
          No mascot votes yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
      <div className="space-y-5">
        {sorted.map((cat, index) => {
          const percent =
            totalVotes === 0
              ? 0
              : Math.round((cat.votes / totalVotes) * 100);

          return (
            <div key={cat.id}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      w-8
                      h-8
                      rounded-full
                      bg-zinc-900
                      border
                      border-white/10
                      flex
                      items-center
                      justify-center
                      text-sm
                      font-semibold
                    "
                  >
                    #{index + 1}
                  </div>

                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-12 h-12 object-cover rounded-xl"
                  />

                  <div>
                    <p className="font-semibold text-white">
                      {cat.name}
                    </p>

                    <p className="text-xs text-zinc-500">
                      {percent}% of votes
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-white">
                    {cat.votes}
                  </p>

                  <p className="text-xs text-zinc-500">
                    votes
                  </p>
                </div>
              </div>

              <div className="h-2 rounded-full bg-zinc-900 overflow-hidden">
                <div
                  className="
                    h-full
                    rounded-full
                    bg-white
                    transition-all
                    duration-500
                  "
                  style={{
                    width: `${percent}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}