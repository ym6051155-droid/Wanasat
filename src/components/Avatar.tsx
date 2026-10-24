import Link from "next/link";
import { initials } from "@/lib/format";
import type { Profile } from "@/lib/types";

export function Avatar({ profile, size = 40 }: { profile: Profile | undefined; size?: number }) {
  if (!profile) return <span className="rounded-full bg-gray-300 inline-block" style={{ width: size, height: size }} />;
  return (
    <Link href={`/profile/${profile.id}`} className="shrink-0" aria-label={profile.name}>
      <span className="rounded-full text-white font-bold flex items-center justify-center" style={{ width: size, height: size, background: profile.avatarColor, fontSize: size * 0.38 }}>
        {initials(profile.name)}
      </span>
    </Link>
  );
}
