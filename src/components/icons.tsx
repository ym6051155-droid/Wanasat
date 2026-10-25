// أيقونات SVG أصلية لونسات — خطوط نظيفة بلون واحد، بدون إيموجي.
type P = { size?: number; className?: string };

function Svg({ size = 24, className, children, filled }: P & { children: React.ReactNode; filled?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={filled ? 0 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const HomeIcon = (p: P) => (
  <Svg {...p}><path d="M3 11.5 12 3.5l9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></Svg>
);
export const FriendsIcon = (p: P) => (
  <Svg {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5" /><circle cx="17.5" cy="9" r="2.5" /><path d="M16.5 15.3c2.6.3 4.4 1.8 5 4.7" /></Svg>
);
export const GroupsIcon = (p: P) => (
  <Svg {...p}><circle cx="7.5" cy="8" r="3" /><circle cx="16.5" cy="8" r="3" /><path d="M2 20c.7-3 2.8-4.5 5.5-4.5S12.3 17 13 20" /><path d="M11 15.5c2.7 0 4.8 1.5 5.5 4.5" /></Svg>
);
export const MarketplaceIcon = (p: P) => (
  <Svg {...p}><path d="M4 8h16l-1.2 12a1 1 0 0 1-1 1H6.2a1 1 0 0 1-1-1z" /><path d="M8.5 10V6.5a3.5 3.5 0 0 1 7 0V10" /></Svg>
);
export const MessagesIcon = (p: P) => (
  <Svg {...p}><path d="M21 12a8 8 0 0 1-8 8H4l2-3.5A8 8 0 1 1 21 12z" /><path d="M8 11h8M8 8.5h5" strokeWidth={1.8} /></Svg>
);
export const MoreIcon = (p: P) => (
  <Svg {...p} filled><circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" /></Svg>
);
export const BellIcon = (p: P) => (
  <Svg {...p}><path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6" /><path d="M10 20a2.2 2.2 0 0 0 4 0" /></Svg>
);
export const HeartIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <Svg {...p} filled={filled}><path d="M12 20.5C6 16.5 3 13.3 3 9.8 3 7.2 5 5.5 7.3 5.5c1.4 0 2.8.8 3.7 2 .4.6 1 .9 1 .9s.6-.3 1-.9c.9-1.2 2.3-2 3.7-2C19 5.5 21 7.2 21 9.8c0 3.5-3 6.7-9 10.7z" /></Svg>
);
export const CommentIcon = (p: P) => (
  <Svg {...p}><path d="M21 12a8 8 0 0 1-8 8H4l2-3.5A8 8 0 1 1 21 12z" /></Svg>
);
export const ShareIcon = (p: P) => (
  <Svg {...p}><path d="M12 15V3.5M12 3.5 8 7.5M12 3.5l4 4" /><path d="M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" /></Svg>
);
export const PagesIcon = (p: P) => (
  <Svg {...p}><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h6" strokeWidth={1.8} /></Svg>
);
export const EventsIcon = (p: P) => (
  <Svg {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></Svg>
);
export const ProfileIcon = (p: P) => (
  <Svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 20c1-3.5 4-5 8-5s7 1.5 8 5" /></Svg>
);
export const EyeIcon = (p: P) => (
  <Svg {...p}><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></Svg>
);
export const EyeOffIcon = (p: P) => (
  <Svg {...p}><path d="M2.5 12S6 5.5 12 5.5c2.2 0 4.2 1 5.8 2.5M17.5 17.5C15.8 18.3 14 18.5 12 18.5 6 18.5 2.5 12 2.5 12c.7-1.3 1.7-2.6 3-3.7" /><path d="M3 3l18 18" /></Svg>
);
export const GoogleIcon = ({ size = 22 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <text x="12" y="16.5" textAnchor="middle" fontSize="12" fontWeight="800" fill="currentColor" fontFamily="system-ui, sans-serif">G</text>
  </svg>
);
export const VerifiedBadge = ({ size = 18 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-label="حساب موثّق" role="img">
    <circle cx="12" cy="12" r="10" fill="#0e7c7b" />
    <path d="M8 12.5l2.5 2.5L16.5 9" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const ReelsIcon = (p: P) => (
  <Svg {...p}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M10 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" /></Svg>
);
