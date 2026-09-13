"use client"; // this instruction sends page.tsx to the browser to run.

import { useState, useEffect } from "react";

type Link = {
  id: number;
  url: string;
  createdAt: string;
  title: string | null;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState<Link[]>([]);
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function fetchLinks() {
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data);
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  async function handleSave() {
  if (saving) return
  setError(null)
  setSaving(true)

  try {
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setError(data?.error ?? 'Something went wrong. Please try again.')
      return
    }

    setUrl('')
    await fetchLinks()
  } catch {
    setError('Could not reach Cairn. Check your connection.')
  } finally {
    setSaving(false)
  }
}

  async function handleDelete(id: number) {
  await fetch(`/api/links/${id}`, {
    method: "DELETE",
  });
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
        disabled={saving}
        className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
      </div>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.id} className="flex justify-between items-center border rounded px-3 py-2">
            <span>
              {link.title ?? <span className="text-gray-400 italic">Unavailable</span>}
              <span className="block text-xs text-gray-500">{link.url}</span>
            </span>
            <button
              onClick={() => handleDelete(link.id)}
              className="text-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
