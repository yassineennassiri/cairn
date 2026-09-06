"use client"; // this instruction sends page.tsx to the browser to run.

import { useState, useEffect } from "react";

type Link = {
  id: number;
  url: string;
  createdAt: string;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState<Link[]>([]);

  async function fetchLinks() {
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data);
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  async function handleSave() {
    await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    setUrl("");
    fetchLinks();
  }

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Cairn</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a URL"
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={handleSave}
          className="bg-black text-white rounded px-4 py-2"
        >
          Save
        </button>
      </div>

      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.id} className="border rounded px-3 py-2">
            {link.url}
          </li>
        ))}
      </ul>
    </main>
  );
}
