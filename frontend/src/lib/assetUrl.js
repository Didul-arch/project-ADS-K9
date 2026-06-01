export function resolveAssetUrl(assetPath) {
  if (!assetPath) return "";

  if (
    assetPath.startsWith("http://") ||
    assetPath.startsWith("https://") ||
    assetPath.startsWith("data:") ||
    assetPath.startsWith("blob:")
  ) {
    return assetPath;
  }

  const apiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
  const storageBase = (import.meta.env.VITE_STORAGE_BASE_URL || "").replace(/\/$/, "");

  if (assetPath.startsWith("/storage/")) {
    return apiBase ? `${apiBase}${assetPath}` : assetPath;
  }

  const baseUrl = storageBase || apiBase;
  if (!baseUrl) return assetPath;

  if (assetPath.startsWith("/")) {
    return `${baseUrl}${assetPath}`;
  }

  return `${baseUrl}/${assetPath}`;
}