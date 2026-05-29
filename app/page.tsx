import Link from "next/link";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToolCard from "./components/ToolCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-10">

      <Navbar />

      <div className="max-w-5xl mx-auto">

        <div className="mb-16">

          <h1 className="text-6xl font-bold mb-4">
            AMY S.
          </h1>

          <p className="text-gray-400 text-lg">
            personal workspace
          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-3">

          <Link href="/faikerz">
            <div>
              <ToolCard
                title="FAiKERZ"
                description="internal operations & tools"
                color="green"
                badge="ACTIVE"
                icon="shield"
              />
            </div>
          </Link>

          <Link href="/labs">
            <div>
              <ToolCard
                title="LABS"
                description="experiments & automation"
                color="blue"
                badge="TOP SECRET"
                icon="flask"
              />
            </div>
          </Link>

          <Link href="/playground">
            <div>
              <ToolCard
                title="PLAYGROUND"
                description="fun projects & side apps"
                color="pink"
                icon="pizza"
              />
            </div>
          </Link>

        </div>

      </div>

      <Footer />

    </main>
  );
}