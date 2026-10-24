export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "الآن";
  if (m < 60) return `قبل ${m} دقيقة`;
  const h = Math.floor(m / 60);
  if (h < 24) return `قبل ${h} ساعة`;
  const d = Math.floor(h / 24);
  return `قبل ${d} يوم`;
}
export function initials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("");
}
