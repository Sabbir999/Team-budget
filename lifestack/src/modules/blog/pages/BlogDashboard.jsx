import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, BookOpen } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { blogAPI } from "../api/blogAPI";
import BlogStats from "../components/BlogStats";
import BlogPostCard from "../components/BlogPostCard";
import BlogShareModal from "../components/BlogShareModal";

const snapshotToArray = (snapshot) => {
  const data = snapshot.val();
  if (!data) return [];
  return Object.keys(data).map((key) => ({ ...data[key], id: data[key].id || key }));
};

export default function BlogDashboard() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sharingPost, setSharingPost] = useState(null);

  useEffect(() => {
    if (!currentUser?.uid) {
      setPosts([]);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    const unsubscribe = blogAPI.getPosts(currentUser.uid, (snapshot) => {
      setPosts(snapshotToArray(snapshot).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentUser?.uid]);

  const recentPosts = useMemo(() => posts.slice(0, 6), [posts]);

  const handleDelete = async (post) => {
    if (!currentUser?.uid) return;
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    await blogAPI.deletePost(currentUser.uid, post.id);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
            <p className="mt-1 text-gray-600">Manage your posts, updates, and shared content.</p>
          </div>
          <Link to="/blog/new" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700">
            <Plus className="mr-2 h-5 w-5" /> New Post
          </Link>
        </div>
      </div>
      <BlogStats posts={posts} />
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Recent Posts</h2>
          <Link to="/blog/posts" className="text-sm font-bold text-blue-600 hover:text-blue-700">View all</Link>
        </div>
        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center text-gray-500">Loading posts...</div>
        ) : recentPosts.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50"><BookOpen className="h-10 w-10 text-blue-500" /></div>
            <h3 className="text-2xl font-bold text-gray-900">No posts yet</h3>
            <p className="mx-auto mt-2 max-w-md text-gray-600">Create your first blog post, announcement, or update.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {recentPosts.map((post) => <BlogPostCard key={post.id} post={post} onShare={setSharingPost} onDelete={handleDelete} />)}
          </div>
        )}
      </section>
      {sharingPost && <BlogShareModal post={sharingPost} onClose={() => setSharingPost(null)} />}
    </div>
  );
}
