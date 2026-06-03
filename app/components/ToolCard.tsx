import Link from "next/link";

import {
  Pizza,
  FlaskConical,
  Shield,
  Radar,
  Cat,
  Flame,
  Database,
} from "lucide-react";

type ToolCardProps = {
  title: string;
  description: string;
  href?: string;
  color:
  | "pink"
  | "blue"
  | "green"
  | "yellow"
  | "orange"
  | "purple";
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
    cat: Cat,
    database: Database,
  };

  const Icon = icon
    ? icons[icon as keyof typeof icons]
    : null;

  const colors = {
   pink: "hover:border-pink-400/70",
   blue: "hover:border-blue-400/70",
   green: "hover:border-lime-400/70",
   yellow: "hover:border-yellow-400/70",
   orange: "hover:border-cyan-400/70",
   purple: "hover:border-purple-400/70",
  };

  const badgeColors = {
   pink: "bg-emerald-500/20 text-emerald-300",
   blue: "bg-blue-500/20 text-blue-300",
   green: "bg-lime-500/20 text-lime-300",
   yellow: "bg-yellow-500/20 text-yellow-300",
   orange: "bg-cyan-500/20 text-cyan-300",
   purple: "bg-purple-500/20 text-purple-300",
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
        hover:shadow-[0_0_40px_rgba(132,204,22,0.12)]
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

  if (!href) {
    return card;
  }

  const isExternal = href.startsWith("http");

  if (isExternal) {
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

  return (
    <Link href={href}>
      {card}
    </Link>
  );
}