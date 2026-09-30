const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string) {
  if (!path || path.startsWith("http") || path.startsWith(base + "/")) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
