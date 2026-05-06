import React from "react";

export default function BlogFilters({ search, setSearch, status, setStatus, sort, setSort }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto_auto]">
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-2.5"
        placeholder="Search posts..."
      />
      <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-gray-300 px-4 py-2.5">
        <option value="all">All statuses</option>
        <option value="published">Published</option>
        <option value="draft">Drafts</option>
      </select>
      <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-xl border border-gray-300 px-4 py-2.5">
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="title">Title</option>
      </select>
    </div>
  );
}
