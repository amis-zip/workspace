import Navbar from "../../components/Navbar";
import MarketDataExtractorClient from "./MarketDataExtractorClient";

export default function MarketDataExtractorPage() {
  return (
    <main className="min-h-screen bg-black text-white px-4 md:px-6 py-10">
      <Navbar />

      <div className="max-w-6xl mx-auto">
        <a
          href="/faikerz"
          className="inline-block mb-8 text-sm text-zinc-600 hover:text-white transition"
        >
          ← Back to FAiKERZ
        </a>

        <section className="rounded-3xl border border-white/10 bg-zinc-950 p-8 md:p-10">
          <p className="mb-3 text-xs tracking-[0.18em] uppercase text-lime-400">
            Internal Web Tool
          </p>

          <h1 className="text-4xl md:text-6xl font-semibold tracking-[0.06em] uppercase">
            Market Data Extractor
          </h1>

          <p className="mt-6 text-zinc-400 leading-relaxed max-w-3xl">
            Upload saved marketplace store HTML, filter product listings by
            keywords, preview matches, and generate a DB-ready Excel file.
          </p>
        </section>

        <MarketDataExtractorClient />
      </div>
    </main>
  );
}
