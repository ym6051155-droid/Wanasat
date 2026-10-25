import type { AppState } from "./types";

const now = Date.now();
const h = (n: number) => new Date(now - n * 3600_000).toISOString();
// Stories expire 24h after creation: demo stories are 2–5h old, so they are live.
export const seedState: AppState = {
  profiles: [
    { id: "u0", name: "إدارة ونسات", email: "admin@wansat.sd", bio: "حساب إدارة المنصة: توثيق الحسابات ومتابعة المحتوى.", state: "الخرطوم", avatarColor: "#0a5e5d", coverColor: "#0a5e5d", verified: true, isAdmin: true },
    { id: "u1", name: "محمد", email: "demo@wansat.sd", bio: "زول ونسة ساكت، بحب الخرطوم وناسها.", state: "الخرطوم", avatarColor: "#0e7c7b", coverColor: "#0a5e5d" },
    { id: "u2", name: "مريم أحمد", email: "mariam@wansat.sd", bio: "من مدني، بحب الشاي والقصص.", state: "ولاية الجزيرة", avatarColor: "#b45309", coverColor: "#e8a317" },
    { id: "u3", name: "عمر خالد", email: "omar@wansat.sd", bio: "بورتسودان والبحر الأحمر.", state: "البحر الأحمر", avatarColor: "#1d4ed8", coverColor: "#0e7c7b" },
    { id: "u4", name: "سارة علي", email: "sara@wansat.sd", bio: "من الأبيض، شغالة في التعليم.", state: "شمال كردفان", avatarColor: "#be185d", coverColor: "#be185d" },
    { id: "u5", name: "خالد إدريس", email: "khalid@wansat.sd", bio: "كسلا، جبال التاكا.", state: "كسلا", avatarColor: "#15803d", coverColor: "#15803d" },
  ],
  posts: [
    { id: "p1", authorId: "u2", text: "صباح الخير يا ناس ونسات! كباية شاي بي لبن مع نسيم الصباح في مدني ما بتتعوض.", createdAt: h(1), likes: ["u1", "u3"], shares: 2, comments: [{ id: "c1", authorId: "u3", text: "صباح النور، والله كلامك صاح!", createdAt: h(1) }] },
    { id: "p2", authorId: "u3", text: "البحر الليلة هادي والجو جميل في بورتسودان. منو ماشي الكورنيش الليلة؟", createdAt: h(3), likes: ["u2"], shares: 0, comments: [] },
    { id: "p3", authorId: "u4", text: "الخريف في الأبيض حاجة تانية، المطر والخضرة واللمة مع الأهل.", createdAt: h(6), likes: ["u1", "u2", "u5"], shares: 1, comments: [{ id: "c2", authorId: "u1", text: "يا سلام، ربنا يديم اللمة.", createdAt: h(5) }] },
    { id: "p4", authorId: "u5", text: "سوق كسلا الليلة عامر، والفواكه طازة. البجي كسلا لازم يجرب القهوة الجبنة.", createdAt: h(10), likes: [], shares: 0, comments: [] },
  ],
  friendships: [
    { id: "f1", fromId: "u2", toId: "u1", status: "accepted" },
    { id: "f2", fromId: "u3", toId: "u1", status: "accepted" },
    { id: "f3", fromId: "u4", toId: "u1", status: "pending" },
  ],
  follows: [
    { followerId: "u1", followingId: "u2" },
    { followerId: "u2", followingId: "u1" },
  ],
  groups: [
    { id: "g1", name: "سوق أمدرمان", description: "بيع وشراء وونسة أهل أمدرمان.", ownerId: "u2", members: ["u1", "u2", "u3"] },
    { id: "g2", name: "عشاق الكرة السودانية", description: "أخبار وونسة الكورة المحلية.", ownerId: "u3", members: ["u3", "u5"] },
  ],
  pages: [
    { id: "pg1", name: "مطبخ سوداني", description: "عصيدة، قراصة، ملاحات ووصفات سودانية.", ownerId: "u4", followers: ["u1", "u2"] },
    { id: "pg2", name: "سياحة في السودان", description: "آثار، جبال، وبحر — السودان أجمل مما تتخيل.", ownerId: "u5", followers: ["u1"] },
  ],
  stories: [
    { id: "s1", authorId: "u2", text: "شاي الصباح ☕", createdAt: h(2), expiresAt: new Date(now + 22 * 3600_000).toISOString() },
    { id: "s2", authorId: "u3", text: "البحر الأحمر 🌊", createdAt: h(4), expiresAt: new Date(now + 20 * 3600_000).toISOString() },
    { id: "s3", authorId: "u4", text: "مطر الأبيض 🌧️", createdAt: h(5), expiresAt: new Date(now + 19 * 3600_000).toISOString() },
  ],
  conversations: [
    { id: "cv1", participantIds: ["u1", "u2"], messages: [
      { id: "m1", senderId: "u2", text: "أهلاً يا محمد، كيف الونسة؟", createdAt: h(2) },
      { id: "m2", senderId: "u1", text: "تمام الحمد لله، إنت كيف؟", createdAt: h(1) },
    ] },
  ],
  notifications: [
    { id: "n1", userId: "u1", text: "سارة علي أرسلت ليك طلب صداقة.", createdAt: h(2), read: false },
    { id: "n2", userId: "u1", text: "عمر خالد علّق على منشورك.", createdAt: h(4), read: false },
    { id: "n3", userId: "u1", text: "مريم أحمد أعجبت بمنشورك.", createdAt: h(8), read: true },
  ],
  listings: [
    { id: "l1", sellerId: "u3", title: "تلفون مستعمل بحالة ممتازة", price: 250000, state: "البحر الأحمر", description: "تلفون نظيف، معاهو شاحن وجراب.", createdAt: h(7) },
    { id: "l2", sellerId: "u2", title: "عسل نحل أصلي", price: 45000, state: "ولاية الجزيرة", description: "عسل بلدي أصلي من مدني.", createdAt: h(12) },
  ],
  events: [
    { id: "e1", hostId: "u2", title: "ليلة ثقافية سودانية", date: new Date(now + 3 * 86400_000).toISOString().slice(0, 10), location: "مدني", description: "غناء وشعر وونسة سودانية.", attendees: ["u1", "u2"] },
    { id: "e2", hostId: "u5", title: "رحلة جبال التاكا", date: new Date(now + 10 * 86400_000).toISOString().slice(0, 10), location: "كسلا", description: "رحلة جماعية لجبال التاكا.", attendees: ["u5"] },
  ],
};
