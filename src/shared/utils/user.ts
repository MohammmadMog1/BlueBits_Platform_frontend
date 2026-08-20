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

/** يبني رابط الصورة، ويرجع null إذا كانت default → نعرض Initials بدلها */
export function getProfileImageUrl(image?: string): string | null {
  if (!image || image === "default.jpg") return null;
  if (image.startsWith("http")) return image;
  const apiOrigin = new URL(import.meta.env.VITE_API_URL).origin;
  return `${apiOrigin}/uploads/${image}`;
}
