"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AppState, Profile } from "./types";
import { seedState } from "./seed";

type Accounts = Record<string, { id: string; password: string; provider?: string }>;
const STATE_KEY = "wansat_state_v1";
const USER_KEY = "wansat_user_v1";
const ACCOUNTS_KEY = "wansat_accounts_v1";
const seedAccounts: Accounts = {
  "admin@wansat.sd": { id: "u0", password: "admin" },
  "demo@wansat.sd": { id: "u1", password: "demo" },
  "mariam@wansat.sd": { id: "u2", password: "demo" },
  "omar@wansat.sd": { id: "u3", password: "demo" },
  "sara@wansat.sd": { id: "u4", password: "demo" },
  "khalid@wansat.sd": { id: "u5", password: "demo" },
};
const uid = (p: string) => `${p}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6)}`;

type Store = {
  state: AppState; current: Profile | null; loaded: boolean;
  login: (email: string, password: string) => string | null;
  signup: (name: string, email: string, password: string, stateName: string, bio: string) => string | null;
  logout: () => void;
  profileById: (id: string) => Profile | undefined;
  updateProfile: (name: string, bio: string, stateName: string, avatarColor: string) => string | null;
  changePassword: (newPassword: string) => string | null;
  resetPassword: (email: string, newPassword: string) => string | null;
  signInWithGoogle: () => void;
  toggleVerification: (profileId: string) => void;
  createPost: (text: string, groupId?: string, pageId?: string, media?: { url: string; kind: "image" | "video" }) => void;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  sharePost: (postId: string) => void;
  deletePost: (postId: string) => void;
  sendFriendRequest: (toId: string) => void;
  acceptFriend: (fid: string) => void; rejectFriend: (fid: string) => void;
  toggleFollow: (userId: string) => void;
  createGroup: (name: string, description: string) => string;
  joinGroup: (gid: string) => void; leaveGroup: (gid: string) => void;
  createPage: (name: string, description: string) => string;
  togglePageFollow: (pid: string) => void;
  addStory: (text: string, media?: { url: string; kind: "image" | "video" }) => void;
  startConversation: (otherId: string) => string;
  sendMessage: (convId: string, text: string, media?: { url: string; kind: "image" | "video" | "audio" }, replyToId?: string) => void;
  toggleReaction: (convId: string, messageId: string, emoji: string) => void;
  deleteMessageForMe: (convId: string, messageId: string) => void;
  deleteMessageForEveryone: (convId: string, messageId: string) => void;
  forwardMessage: (fromConvId: string, messageId: string, toConvId: string) => void;
  markConversationRead: (convId: string) => void;
  markConversationsDelivered: () => void;
  markNotificationsRead: () => void;
  createListing: (title: string, price: number, stateName: string, description: string, media?: { url: string; kind: "image" | "video" }) => string;
  createEvent: (title: string, date: string, location: string, description: string) => string;
  toggleRsvp: (eid: string) => void;
};

const Ctx = createContext<Store | null>(null);
export function useStore(): Store {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore outside provider");
  return v;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(seedState);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Accounts>(seedAccounts);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(STATE_KEY);
      if (s) {
        const saved = JSON.parse(s) as AppState;
        // Merge seed profiles missing from older saved state (e.g. the admin
        // profile added later) without touching the user's own saved data.
        const known = new Set(saved.profiles.map((p) => p.id));
        const mergedProfiles = [...saved.profiles, ...seedState.profiles.filter((p) => !known.has(p.id))];
        setState({ ...seedState, ...saved, profiles: mergedProfiles });
      }
      const u = localStorage.getItem(USER_KEY);
      if (u) setCurrentId(u);
      const a = localStorage.getItem(ACCOUNTS_KEY);
      if (a) setAccounts({ ...seedAccounts, ...JSON.parse(a) });
    } catch { /* keep seed */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
      if (currentId) localStorage.setItem(USER_KEY, currentId);
      else localStorage.removeItem(USER_KEY);
    } catch { /* storage full/blocked */ }
  }, [state, accounts, currentId, loaded]);

  const current = state.profiles.find((p) => p.id === currentId) ?? null;
  const profileById = (id: string) => state.profiles.find((p) => p.id === id);
  const notify = (userId: string, text: string) => setState((s) => ({
    ...s, notifications: [{ id: uid("n"), userId, text, createdAt: new Date().toISOString(), read: false }, ...s.notifications],
  }));

  const value: Store = useMemo(() => ({
    state, current, loaded,
    login: (email, password) => {
      const acc = accounts[email.trim().toLowerCase()];
      if (!acc || acc.password !== password) return "البريد أو كلمة السر ما صحيحة.";
      setCurrentId(acc.id); return null;
    },
    signup: (name, email, password, stateName, bio) => {
      const key = email.trim().toLowerCase();
      if (accounts[key]) return "الحساب ده موجود أصلاً، سجّل دخول.";
      if (password.length < 4) return "كلمة السر لازم تكون 4 أحرف على الأقل.";
      const id = uid("u");
      const colors = ["#0e7c7b", "#b45309", "#1d4ed8", "#be185d", "#15803d"];
      const profile: Profile = { id, name: name.trim(), email: key, bio: bio.trim(), state: stateName.trim() || "السودان", avatarColor: colors[state.profiles.length % colors.length], coverColor: "#0a5e5d" };
      setState((s) => ({ ...s, profiles: [...s.profiles, profile] }));
      setAccounts((a) => ({ ...a, [key]: { id, password } }));
      setCurrentId(id); return null;
    },
    logout: () => setCurrentId(null),
    profileById,
    updateProfile: (name, bio, stateName, avatarColor) => {
      if (!currentId) return "سجّل دخول أولاً.";
      if (!name.trim()) return "الاسم ما ممكن يكون فاضي.";
      setState((s) => ({ ...s, profiles: s.profiles.map((p) => p.id === currentId ? { ...p, name: name.trim(), bio: bio.trim(), state: stateName.trim() || p.state, avatarColor } : p) }));
      return null;
    },
    changePassword: (newPassword) => {
      if (!currentId) return "سجّل دخول أولاً.";
      if (newPassword.length < 4) return "كلمة السر لازم تكون 4 أحرف على الأقل.";
      const email = state.profiles.find((p) => p.id === currentId)?.email.toLowerCase();
      if (!email) return "الحساب ما موجود.";
      setAccounts((a) => ({ ...a, [email]: { ...(a[email] ?? { id: currentId }), password: newPassword } }));
      return null;
    },
    resetPassword: (email, newPassword) => {
      const key = email.trim().toLowerCase();
      const acc = accounts[key];
      if (!acc) return "الحساب ما موجود.";
      if (newPassword.length < 4) return "كلمة السر لازم تكون 4 أحرف على الأقل.";
      setAccounts((a) => ({ ...a, [key]: { ...acc, password: newPassword } }));
      return null;
    },
    signInWithGoogle: () => {
      // Demo mode: a clearly demo Google-linked local account. The login
      // page labels demo mode, and this profile is marked provider "google".
      const key = "google@wansat.sd";
      const existing = state.profiles.find((p) => p.email === key);
      if (existing) { setCurrentId(existing.id); return; }
      const id = "u_google";
      const profile: Profile = { id, name: "مستخدم قوقل (تجريبي)", email: key, bio: "حساب تجريبي مرتبط بقوقل.", state: "السودان", avatarColor: "#0e7c7b", coverColor: "#0a5e5d", provider: "google" };
      setState((s) => ({ ...s, profiles: [...s.profiles, profile] }));
      setAccounts((a) => ({ ...a, [key]: { id, password: "", provider: "google" } }));
      setCurrentId(id);
    },
    toggleVerification: (profileId) => {
      if (!current?.isAdmin) return;
      setState((s) => ({ ...s, profiles: s.profiles.map((p) => p.id === profileId ? { ...p, verified: !p.verified } : p) }));
    },
    createPost: (text, groupId, pageId, media) => {
      if (!currentId || (!text.trim() && !media)) return;
      setState((s) => ({ ...s, posts: [{ id: uid("p"), authorId: currentId, groupId, pageId, text: text.trim(), mediaUrl: media?.url, mediaKind: media?.kind, createdAt: new Date().toISOString(), likes: [], shares: 0, comments: [] }, ...s.posts] }));
    },
    toggleLike: (postId) => {
      if (!currentId) return;
      const post = state.posts.find((p) => p.id === postId);
      const wasLiked = post ? post.likes.includes(currentId) : false;
      setState((s) => ({ ...s, posts: s.posts.map((p) => {
        if (p.id !== postId) return p;
        const liked = p.likes.includes(currentId);
        const likes = liked ? p.likes.filter((x) => x !== currentId) : [...p.likes, currentId];
        return { ...p, likes };
      }) }));
      if (post && !wasLiked && post.authorId !== currentId) notify(post.authorId, `${current?.name ?? "زول"} أعجب بمنشورك.`);
    },
    addComment: (postId, text) => {
      if (!currentId || !text.trim()) return;
      setState((s) => ({ ...s, posts: s.posts.map((p) => p.id === postId ? { ...p, comments: [...p.comments, { id: uid("c"), authorId: currentId, text: text.trim(), createdAt: new Date().toISOString() }] } : p) }));
      const post = state.posts.find((p) => p.id === postId);
      if (post && post.authorId !== currentId) notify(post.authorId, `${current?.name ?? "زول"} علّق على منشورك.`);
    },
    sharePost: (postId) => {
      if (!currentId) return;
      const post = state.posts.find((p) => p.id === postId);
      if (!post) return;
      setState((s) => ({ ...s, posts: [
        { id: uid("p"), authorId: currentId, text: post.text, mediaUrl: post.mediaUrl, mediaKind: post.mediaKind, imageUrl: post.imageUrl, createdAt: new Date().toISOString(), likes: [], shares: 0, comments: [] },
        ...s.posts.map((p) => p.id === postId ? { ...p, shares: p.shares + 1 } : p),
      ] }));
    },
    deletePost: (postId) => setState((s) => ({ ...s, posts: s.posts.filter((p) => p.id !== postId) })),
    sendFriendRequest: (toId) => {
      if (!currentId) return;
      const exists = state.friendships.some((f) => (f.fromId === currentId && f.toId === toId) || (f.fromId === toId && f.toId === currentId));
      if (exists) return;
      const id = uid("f");
      setState((s) => ({ ...s, friendships: [...s.friendships, { id, fromId: currentId, toId, status: "pending" }] }));
      notify(toId, `${current?.name ?? "زول"} أرسل ليك طلب صداقة.`);
    },
    acceptFriend: (fid) => setState((s) => ({ ...s, friendships: s.friendships.map((f) => f.id === fid ? { ...f, status: "accepted" } : f) })),
    rejectFriend: (fid) => setState((s) => ({ ...s, friendships: s.friendships.filter((f) => f.id !== fid) })),
    toggleFollow: (userId) => {
      if (!currentId || userId === currentId) return;
      setState((s) => ({ ...s, follows: s.follows.some((f) => f.followerId === currentId && f.followingId === userId)
        ? s.follows.filter((f) => !(f.followerId === currentId && f.followingId === userId))
        : [...s.follows, { followerId: currentId, followingId: userId }] }));
    },
    createGroup: (name, description) => {
      const id = uid("g");
      if (currentId) setState((s) => ({ ...s, groups: [...s.groups, { id, name, description, ownerId: currentId, members: [currentId] }] }));
      return id;
    },
    joinGroup: (gid) => { if (currentId) setState((s) => ({ ...s, groups: s.groups.map((g) => g.id === gid && !g.members.includes(currentId) ? { ...g, members: [...g.members, currentId] } : g) })); },
    leaveGroup: (gid) => { if (currentId) setState((s) => ({ ...s, groups: s.groups.map((g) => g.id === gid ? { ...g, members: g.members.filter((m) => m !== currentId) } : g) })); },
    createPage: (name, description) => {
      const id = uid("pg");
      if (currentId) setState((s) => ({ ...s, pages: [...s.pages, { id, name, description, ownerId: currentId, followers: [currentId] }] }));
      return id;
    },
    togglePageFollow: (pid) => { if (currentId) setState((s) => ({ ...s, pages: s.pages.map((p) => p.id === pid ? { ...p, followers: p.followers.includes(currentId) ? p.followers.filter((x) => x !== currentId) : [...p.followers, currentId] } : p) })); },
    addStory: (text, media) => {
      if (!currentId || (!text.trim() && !media?.url)) return;
      const created = new Date();
      setState((s) => ({ ...s, stories: [{ id: uid("s"), authorId: currentId, text: text.trim(), mediaUrl: media?.url, mediaKind: media?.kind, createdAt: created.toISOString(), expiresAt: new Date(created.getTime() + 24 * 3600_000).toISOString() }, ...s.stories] }));
    },
    startConversation: (otherId) => {
      const existing = state.conversations.find((c) => c.participantIds.includes(otherId) && currentId && c.participantIds.includes(currentId));
      if (existing) return existing.id;
      const id = uid("cv");
      if (currentId) setState((s) => ({ ...s, conversations: [...s.conversations, { id, participantIds: [currentId, otherId], messages: [] }] }));
      return id;
    },
    sendMessage: (convId, text, media, replyToId) => {
      if (!currentId || (!text.trim() && !media?.url)) return;
      setState((s) => ({ ...s, conversations: s.conversations.map((c) => c.id === convId ? { ...c, messages: [...c.messages, { id: uid("m"), senderId: currentId, text: text.trim(), createdAt: new Date().toISOString(), mediaUrl: media?.url, mediaKind: media?.kind, replyToId }] } : c) }));
    },
    toggleReaction: (convId, messageId, emoji) => {
      if (!currentId) return;
      setState((s) => ({ ...s, conversations: s.conversations.map((c) => c.id === convId ? { ...c, messages: c.messages.map((m) => {
        if (m.id !== messageId) return m;
        const reactions = m.reactions ?? [];
        const mine = reactions.find((r) => r.userId === currentId && r.emoji === emoji);
        return { ...m, reactions: mine ? reactions.filter((r) => !(r.userId === currentId && r.emoji === emoji)) : [...reactions, { emoji, userId: currentId }] };
      }) } : c) }));
    },
    deleteMessageForMe: (convId, messageId) => {
      if (!currentId) return;
      setState((s) => ({ ...s, conversations: s.conversations.map((c) => c.id === convId ? { ...c, messages: c.messages.map((m) => m.id === messageId ? { ...m, hiddenFor: [...(m.hiddenFor ?? []), currentId] } : m) } : c) }));
    },
    deleteMessageForEveryone: (convId, messageId) => {
      setState((s) => ({ ...s, conversations: s.conversations.map((c) => c.id === convId ? { ...c, messages: c.messages.filter((m) => m.id !== messageId) } : c) }));
    },
    forwardMessage: (fromConvId, messageId, toConvId) => {
      if (!currentId || fromConvId === toConvId) return;
      const src = state.conversations.find((c) => c.id === fromConvId);
      const msg = src?.messages.find((m) => m.id === messageId);
      if (!msg) return;
      setState((s) => ({ ...s, conversations: s.conversations.map((c) => c.id === toConvId ? { ...c, messages: [...c.messages, { id: uid("m"), senderId: currentId, text: msg.text, createdAt: new Date().toISOString(), mediaUrl: msg.mediaUrl, mediaKind: msg.mediaKind, forwarded: true }] } : c) }));
    },
    markConversationRead: (convId) => {
      if (!currentId) return;
      setState((s) => ({ ...s, conversations: s.conversations.map((c) => c.id === convId ? { ...c, messages: c.messages.map((m) => m.senderId !== currentId && !m.read ? { ...m, delivered: true, read: true } : m) } : c) }));
    },
    markConversationsDelivered: () => {
      if (!currentId) return;
      setState((s) => ({ ...s, conversations: s.conversations.map((c) => c.participantIds.includes(currentId) ? { ...c, messages: c.messages.map((m) => m.senderId !== currentId && !m.delivered ? { ...m, delivered: true } : m) } : c) }));
    },
    markNotificationsRead: () => { if (currentId) setState((s) => ({ ...s, notifications: s.notifications.map((n) => n.userId === currentId ? { ...n, read: true } : n) })); },
    createListing: (title, price, stateName, description, media) => {
      const id = uid("l");
      if (currentId) setState((s) => ({ ...s, listings: [{ id, sellerId: currentId, title, price, state: stateName, description, mediaUrl: media?.url, mediaKind: media?.kind, createdAt: new Date().toISOString() }, ...s.listings] }));
      return id;
    },
    createEvent: (title, date, location, description) => {
      const id = uid("e");
      if (currentId) setState((s) => ({ ...s, events: [...s.events, { id, hostId: currentId, title, date, location, description, attendees: [currentId] }] }));
      return id;
    },
    toggleRsvp: (eid) => { if (currentId) setState((s) => ({ ...s, events: s.events.map((e) => e.id === eid ? { ...e, attendees: e.attendees.includes(currentId) ? e.attendees.filter((x) => x !== currentId) : [...e.attendees, currentId] } : e) })); },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [state, currentId, accounts, loaded]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
