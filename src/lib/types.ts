export type Profile = {
  id: string; name: string; email: string; bio: string; state: string;
  avatarColor: string; coverColor: string;
  verified?: boolean; isAdmin?: boolean; provider?: string;
};
export type CommentItem = { id: string; authorId: string; text: string; createdAt: string };
export type Post = {
  id: string; authorId: string; groupId?: string; pageId?: string;
  text: string; imageUrl?: string; mediaUrl?: string; mediaKind?: "image" | "video"; createdAt: string;
  likes: string[]; shares: number; comments: CommentItem[];
};
export type Friendship = { id: string; fromId: string; toId: string; status: "pending" | "accepted" };
export type Follow = { followerId: string; followingId: string };
export type Group = { id: string; name: string; description: string; ownerId: string; members: string[] };
export type PageItem = { id: string; name: string; description: string; ownerId: string; followers: string[] };
export type Story = { id: string; authorId: string; text: string; createdAt: string; expiresAt: string };
export type ChatMessage = { id: string; senderId: string; text: string; createdAt: string };
export type Conversation = { id: string; participantIds: string[]; messages: ChatMessage[] };
export type NotificationItem = { id: string; userId: string; text: string; createdAt: string; read: boolean };
export type Listing = {
  id: string; sellerId: string; title: string; price: number; state: string;
  description: string; createdAt: string;
};
export type EventItem = {
  id: string; hostId: string; title: string; date: string; location: string;
  description: string; attendees: string[];
};
export type AppState = {
  profiles: Profile[]; posts: Post[]; friendships: Friendship[]; follows: Follow[];
  groups: Group[]; pages: PageItem[]; stories: Story[]; conversations: Conversation[];
  notifications: NotificationItem[]; listings: Listing[]; events: EventItem[];
};
