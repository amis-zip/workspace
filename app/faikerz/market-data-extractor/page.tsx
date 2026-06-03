import Link from "next/link";

import Navbar from "../../components/Navbar";

export default function MarketDataExtractorPage() {
  return (
    <main className="min-h-screen bg-black text-white p-10">
      <Navbar />

      <div className="max-w-4xl mx-auto">
        <Link
          href="/faikerz"
          className="text-gray-500 hover:text-white transition mb-8 inline-block"
        >
          ← Back to FAiKERZ
        </Link>

        <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-black p-8 md:p-10">
          <p className="mb-3 text-xs tracking-[0.18em] uppercase text-lime-300">
            Internal Tool
          </p>

          <h1 className="text-4xl md:text-6xl font-bold mb-5">
            Market Data Extractor
          </h1>

          <p className="text-zinc-400 text-lg leading-relaxed max-w-3xl">
            Extracts marketplace product data from 11st, Naver, and Coupang
            store HTML, filters by keywords, and generates DB-ready Excel files.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href="/tools/MarketDataExtractor_v12.zip"
              download
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-medium text-black hover:bg-zinc-200 transition"
            >
              Download Tool
            </a>

            <Link
              href="/faikerz"
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-zinc-300 hover:text-white hover:border-white/30 transition"
            >
              Back to Tools
            </Link>
          </div>
        </section>

        <section className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            ["Markets", "11st · Naver · Coupang"],
            ["Output", "DB-ready Excel format"],
            ["Mode", "Local web tool"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-zinc-950 p-5"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                {label}
              </p>

              <p className="mt-3 text-lg font-semibold text-zinc-200">
                {value}
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
