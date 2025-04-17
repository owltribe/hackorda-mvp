import { Command } from "lucide-react";

export default async function Home() {

  return (
    <div className="flex items-center gap-2">
      <Command className="w-14 h-14" />
      <h1 className="font-sans text-6xl font-bold">HackOrda MVP - Phase 1</h1>
    </div>
  );
}