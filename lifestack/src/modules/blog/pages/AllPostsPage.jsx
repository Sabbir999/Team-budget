import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { blogAPI } from "../api/blogAPI";
import BlogFilters from "../components/BlogFilters";
import BlogPostCard from "../components/BlogPostCard";
import BlogShareModal from "../components/BlogShareModal";

const snapshotToArray = (snapshot) => {
  const data = snapshot.val();
  if (!data) return [];
  return Object.keys(data).map((key) => ({ ...data[key], id: data[key].id || key }));
};

export default function AllPostsPage() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sharingPost, setSharingPost] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    if (!currentUser?.uid) { setPosts([]); setLoading(false); return undefined; }
    const unsubscribe = blogAPI.getPosts(currentUser.uid, (snapshot) => { setPosts(snapshotToArray(snapshot)); setLoading(false); });
    return () => unsubscribe();
  }, [currentUser?.uid]);

  const filteredPosts = useMemo(() => {
    const term = search.trim().toLowerCase();
    let result = posts.filter((post) => {
      if (status !== "all" && post.status !== status) return false;
      if (!term) return true;
      return [post.title, post.excerpt, post.category, ...(post.tags || [])].filter(Boolean).some((value) => String(value).toLowerCase().includes(term));
    });
    if (sort === "newest") result = result.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    if (sort === "oldest") result = result.sort((a, b) => (a.updatedAt || 0) - (b.updatedAt || 0));
    if (sort === "title") result = result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    return result;
  }, [posts, search, status, sort]);

  const handleDelete = async (post) => {
    if (!currentUser?.uid) return;
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    await blogAPI.deletePost(currentUser.uid, post.id);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h1 className="text-3xl font-bold text-gray-900">All Posts</h1><p className="mt-1 text-gray-600">Search, edit, share, and manage your blog posts.</p></div>
          <Link to="/blog/new" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"><Plus className="mr-2 h-5 w-5" /> New Post</Link>
        </div>
      </div>
      <BlogFilters search={search} setSearch={setSearch} status={status} setStatus={setStatus} sort={sort} setSort={setSort} />
      {loading ? <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center text-gray-500">Loading posts...</div> : filteredPosts.length === 0 ? <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center text-gray-500">No posts found.</div> : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filteredPosts.map((post) => <BlogPostCard key={post.id} post={post} onShare={setSharingPost} onDelete={handleDelete} />)}</div>}
      {sharingPost && <BlogShareModal post={sharingPost} onClose={() => setSharingPost(null)} />}
    </div>
  );
}
