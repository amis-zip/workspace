import { Check } from "lucide-react";
import { CatVariant } from "../types";

type Props = {
  cat: CatVariant;
  selected: boolean;
  disabled: boolean;
  hasVoted: boolean;
  onToggle: () => void;
};

export default function CatCard({
  cat,
  selected,
  disabled,
  hasVoted,
  onToggle,
}: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={(disabled || hasVoted) && !selected}
      className={`
        group
        relative
        text-left
        rounded-2xl
        overflow-hidden
        border
        bg-zinc-950
        will-change-transform
        transition-all
        duration-300
        ease-out

        ${
          selected
            ? `
              border-white
              scale-[1.015]
              shadow-[0_0_24px_rgba(255,255,255,0.05)]
            `
            : `
              border-white/10
              hover:border-white/20
              hover:-translate-y-1
            `
        }

        ${
          disabled && !selected
            ? `
              opacity-40
              grayscale-[0.25]
              cursor-not-allowed
            `
            : `
              cursor-pointer
            `
        }
      `}
    >
      <div className="relative aspect-[0.92] bg-black overflow-hidden">

        <img
          src={cat.image}
          alt={cat.name}
          className="
            w-full
            h-full
            object-cover
            transition-all
            duration-500
            ease-out
            group-hover:scale-[1.02]
          "
        />

        {selected && (
          <div
            className="
              absolute
              top-3
              right-3
              rounded-full
              bg-white
              text-black
              p-1.5
              shadow-lg
            "
          >
            <Check className="w-4 h-4" />
          </div>
        )}

      </div>

      <div className="p-4 pb-5">

        <div className="flex items-center justify-between gap-3">

          <h2 className="text-lg md:text-xl font-semibold text-white">
            {cat.name}
          </h2>

          {selected && (
            <span className="text-xs text-zinc-300">
              Selected
            </span>
          )}

        </div>

        <p className="mt-1 text-[11px] text-zinc-400">
          {cat.tagline}
        </p>

      </div>

    </button>
  );
}