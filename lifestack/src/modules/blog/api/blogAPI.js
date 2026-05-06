import {
  ref,
  set,
  get,
  update,
  remove,
  push,
  onValue,
  off,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";

import { db } from "../../../firebase-config";
import { DB_PATHS } from "../../../services/paths";

const BLOG_KEY = DB_PATHS.BLOG || "blogPosts";
const now = () => Date.now();

const getPostsPath = (userId) => `${DB_PATHS.USERS}/${userId}/${BLOG_KEY}`;

const getPostPath = (userId, postId) =>
  `${getPostsPath(userId)}/${postId}`;

const listenToRef = (pathRef, callback, errorMessage) => {
  const unsubscribe = onValue(
    pathRef,
    callback,
    (error) => console.error(errorMessage, error)
  );

  return () => off(pathRef, "value", unsubscribe);
};

const slugify = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const createShareId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const normalizeTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizePost = (postData = {}) => {
  const title = postData.title?.trim() || "";
  const status = postData.status || "draft";
  const visibility = postData.visibility || "private";
  const slug = slugify(postData.slug || title);

  return {
    title,
    slug,
    excerpt: postData.excerpt?.trim() || "",
    content: postData.content || "",
    coverImageUrl: postData.coverImageUrl?.trim() || "",
    coverColor: postData.coverColor || "blue",
    category: postData.category || "Update",
    tags: normalizeTags(postData.tags),
    status,
    visibility,
    featured: Boolean(postData.featured),

    // Author info
    authorName: postData.authorName?.trim() || "",
    authorTitle: postData.authorTitle?.trim() || "",
    authorBio: postData.authorBio?.trim() || "",
    authorImageUrl: postData.authorImageUrl?.trim() || "",
  };
};

export const blogAPI = {
  createPost: async (userId, postData) => {
    const postId = push(ref(db, getPostsPath(userId))).key;
    const normalizedPost = normalizePost(postData);

    const postWithId = {
      ...normalizedPost,
      id: postId,
      shareId: createShareId(),
      createdBy: userId,
      createdAt: now(),
      updatedAt: now(),
      publishedAt: normalizedPost.status === "published" ? now() : null,
    };

    await set(ref(db, getPostPath(userId, postId)), postWithId);

    return postWithId;
  },

  getPosts: (userId, callback) =>
    listenToRef(
      ref(db, getPostsPath(userId)),
      callback,
      "Blog posts listener error:"
    ),

  getPost: (userId, postId) =>
    get(ref(db, getPostPath(userId, postId))),

  updatePost: async (userId, postId, updates) => {
    const postRef = ref(db, getPostPath(userId, postId));
    const snapshot = await get(postRef);
    const existingPost = snapshot.val() || {};

    const normalizedPost = normalizePost({
      ...existingPost,
      ...updates,
    });

    const nextPublishedAt =
      normalizedPost.status === "published"
        ? existingPost.publishedAt || now()
        : updates.publishedAt ?? existingPost.publishedAt ?? null;

    await update(postRef, {
      ...normalizedPost,
      shareId: existingPost.shareId || createShareId(),
      createdBy: existingPost.createdBy || userId,
      createdAt: existingPost.createdAt || now(),
      updatedAt: now(),
      publishedAt: nextPublishedAt,
    });

    return postId;
  },

  deletePost: async (userId, postId) => {
    await remove(ref(db, getPostPath(userId, postId)));

    return postId;
  },

  publishPost: async (userId, postId) => {
    await update(ref(db, getPostPath(userId, postId)), {
      status: "published",
      visibility: "public",
      publishedAt: now(),
      updatedAt: now(),
    });

    return postId;
  },

  unpublishPost: async (userId, postId) => {
    await update(ref(db, getPostPath(userId, postId)), {
      status: "draft",
      visibility: "private",
      updatedAt: now(),
    });

    return postId;
  },

  getSharedPostByShareId: (userId, shareId, callback) => {
    const postsQuery = query(
      ref(db, getPostsPath(userId)),
      orderByChild("shareId"),
      equalTo(shareId)
    );

    return listenToRef(
      postsQuery,
      callback,
      "Shared blog post listener error:"
    );
  },
};

export default blogAPI;