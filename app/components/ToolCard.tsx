import {
  Radar,
  Shield,
  Flame,
  Pizza,
  FlaskConical,
} from "lucide-react";

type ToolCardProps = {
  title: string;
  description: string;
  href?: string;
  color?: "pink" | "blue" | "green" | "yellow";
  badge?: string;
  icon?: string;
};

export default function ToolCard({
  title,
  description,
  href,
  color = "pink",
  badge,
  icon,
}: ToolCardProps) {

  const icons = {
    radar: Radar,
    shield: Shield,
    flame: Flame,
    pizza: Pizza,
    flask: FlaskConical,
  };

  const Icon = icon
    ? icons[icon as keyof typeof icons]
    : null;

  const colors = {
    pink: "hover:border-pink-500/60",
    blue: "hover:border-blue-500/60",
    green: "hover:border-green-500/60",
    yellow: "hover:border-yellow-500/60",
  };

  const badgeColors = {
    pink: "bg-pink-500/20 text-pink-300",
    blue: "bg-blue-500/20 text-blue-300",
    green: "bg-green-500/20 text-green-300",
    yellow: "bg-yellow-500/20 text-yellow-300",
  };

  const card = (
    <div
      className={`
        rounded-3xl
        border
        border-gray-800
        bg-gradient-to-b
        from-zinc-900
        to-black
        p-8
        transition-all
        duration-300
        ease-out
        cursor-pointer
        hover:scale-[1.015]
        hover:-translate-y-1
        hover:shadow-[0_0_50px_rgba(255,255,255,0.12)]
        ${colors[color]}
      `}
    >

      <div className="flex items-start justify-between mb-3">

        <div className="flex items-center gap-3">

          {Icon && (
            <Icon className="w-7 h-7 text-white/80" />
          )}

          <h2 className="text-3xl font-bold">
            {title}
          </h2>

        </div>

        {badge && (
          <span
            className={`
              text-xs
              px-2
              py-1
              rounded-full
              ${badgeColors[color]}
            `}
          >
            {badge}
          </span>
        )}

      </div>

      <p className="text-gray-400">
        {description}
      </p>

    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {card}
      </a>
    );
  }

  return card;
}