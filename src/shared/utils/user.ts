// src/shared/utils/user.ts
export function getUserInitials(name: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    USER: "Student",
    LECTURER: "Lecturer",
    BLUE: "Blue",
    ADMIN: "Admin",
    SUPER_ADMIN: "Super Admin",
  };
  return labels[role] ?? role;
}

/** يبني رابط الصورة، ويرجع null إذا كانت default → نعرض Initials بدلها */
export function getProfileImageUrl(image?: string): string | null {
  if (!image || image === "default.jpg") return null;
  if (image.startsWith("http")) return image;
  const apiOrigin = new URL(import.meta.env.VITE_API_URL).origin;
  return `${apiOrigin}/uploads/${image}`;
}

export function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}