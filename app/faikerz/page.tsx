import Navbar from "../components/Navbar";
import ToolCard from "../components/ToolCard";

import { faikerzTools } from "../data/tools";

export default function FaikerzPage() {
  return (
    <main className="min-h-screen bg-black text-white p-10">

      <Navbar />

      <div className="max-w-5xl mx-auto">

        <a
          href="/"
          className="text-gray-500 hover:text-white transition mb-6 inline-block"
        >
          ← Back
        </a>

        <h1 className="text-5xl font-bold mb-6">
          FAiKERZ
        </h1>

        <p className="text-gray-400 mb-12">
          internal operations & tools
        </p>

        <div className="grid gap-4">

          {faikerzTools.map((tool) => (

            <ToolCard
              key={tool.title}
              title={tool.title}
              description={tool.description}
              href={tool.href}
              color={tool.color as any}
              badge={tool.badge}
              icon={tool.icon}
            />

          ))}

        </div>

      </div>

    </main>
  );
}