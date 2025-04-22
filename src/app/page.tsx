import { Command } from "lucide-react";
import { CardDemo } from "@/components/card";

export default async function Home() {

  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-4 items-center mb-6">
        <Command className="w-14 h-14" />
        <h1 className="font-sans text-6xl font-bold">HackOrda MVP - Phase 1</h1>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <CardDemo />
        <CardDemo />
        <CardDemo />
        <CardDemo />
        <CardDemo />
        <CardDemo />
        <CardDemo />
        <CardDemo />
      </div>
    </div>
  );
}