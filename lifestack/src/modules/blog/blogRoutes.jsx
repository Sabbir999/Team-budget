import React from "react";
import { BookOpen, FileText, Plus } from "lucide-react";
import BlogDashboard from "./pages/BlogDashboard";
import AllPostsPage from "./pages/AllPostsPage";
import BlogEditorPage from "./pages/BlogEditorPage";
import BlogPostDetailPage from "./pages/BlogPostDetailPage";

export const blogRoutes = [
  { name: "Blog Dashboard", path: "blog", href: "/blog", icon: BookOpen, element: <BlogDashboard /> },
  { name: "All Posts", path: "blog/posts", href: "/blog/posts", icon: FileText, element: <AllPostsPage /> },
  { name: "New Post", path: "blog/new", href: "/blog/new", icon: Plus, element: <BlogEditorPage /> },
  { name: "Post Detail", path: "blog/posts/:postId", href: null, icon: FileText, element: <BlogPostDetailPage /> },
  { name: "Edit Post", path: "blog/posts/:postId/edit", href: null, icon: FileText, element: <BlogEditorPage /> },
];
