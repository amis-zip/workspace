"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import {
  faikerzTools,
  playgroundTools,
  labsTools,
} from "../data/tools";

export default function CommandMenu() {

  const [open, setOpen] = useState(false);

  useEffect(() => {

    const down = (e: KeyboardEvent) => {

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((open) => !open);
      }

    };

    document.addEventListener("keydown", down);

    return () => document.removeEventListener("keydown", down);

  }, []);

  const runCommand = (url: string) => {
    window.location.href = url;
    setOpen(false);
  };

  return (
    <Command.Dialog
     open={open}
     onOpenChange={setOpen}
     label="Global Command Menu"
     className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-32"
>

  <div className="sr-only">
    Command Menu
  </div>

      <div className="w-full max-w-xl rounded-2xl border border-gray-800 bg-zinc-900/95 overflow-hidden shadow-2xl">

        <Command.Input
          placeholder="Search tools..."
          className="w-full bg-transparent border-b border-gray-800 px-4 py-4 outline-none text-white"
        />

        <Command.List className="max-h-[400px] overflow-y-auto p-2 text-white">

          <Command.Empty className="p-4 text-sm text-gray-500">
            No results found.
          </Command.Empty>

          <Command.Group heading="Navigation">

  <Command.Item
  value="home"
  onSelect={() => runCommand("/")}
  className="
  px-4 py-3 rounded-lg cursor-pointer
  text-white
  hover:bg-white/10
  data-[selected=true]:bg-white/10
  "
>
  Home
</Command.Item>

  <Command.Item
  value="faikerz"
  onSelect={() => runCommand("/faikerz")}
  className="
  px-4 py-3 rounded-lg cursor-pointer
  text-white
  hover:bg-white/10
  data-[selected=true]:bg-white/10
  "
>
  FAiKERZ
</Command.Item>

  <Command.Item
  value="labs"
  onSelect={() => runCommand("/labs")}
  className="
  px-4 py-3 rounded-lg cursor-pointer
  text-white
  hover:bg-white/10
  data-[selected=true]:bg-white/10
  "
>
  LABS
</Command.Item>

  <Command.Item
  value="playground"
  onSelect={() => runCommand("/playground")}
  className="
  px-4 py-3 rounded-lg cursor-pointer
  text-white
  hover:bg-white/10
  data-[selected=true]:bg-white/10
  "
>
  PLAYGROUND
</Command.Item>

</Command.Group>

<Command.Group heading="Tools">

  {[...faikerzTools, ...playgroundTools, ...labsTools].map((tool) => (

    <Command.Item
      key={tool.title}
      value={tool.title.toLowerCase()}
      onSelect={() => {
        if ("href" in tool && tool.href) {
         runCommand(tool.href);
        }
      }}
      className="
        px-4 py-3 rounded-lg cursor-pointer
        text-white
        hover:bg-white/10
        data-[selected=true]:bg-white/10
"
    >
      {tool.title}
    </Command.Item>

  ))}

</Command.Group>

        </Command.List>

      </div>

    </Command.Dialog>
  );
}