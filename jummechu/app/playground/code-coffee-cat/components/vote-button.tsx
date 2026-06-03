type Props = {
  onVote: () => void;
  disabled?: boolean;
};

export default function VoteButton({
  onVote,
  disabled,
}: Props) {
  return (
    <button
      onClick={onVote}
      disabled={disabled}
      className={`
  w-full
  py-3
  rounded-2xl
  font-medium
  transition-all
  border

  ${
    disabled
      ? `
        border-[#7ED957]/20
        bg-[#7ED957]/10
        text-[#7ED957]
      `
      : `
        border-white/10
        bg-white
        text-black
        hover:bg-zinc-200
      `
  }
`}
    >
      {disabled ? "Voted" : "Vote"}
    </button>
  );
}