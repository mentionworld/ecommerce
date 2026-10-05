export function getApiBaseUrl(): string {
    const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
    const vercelUrl = process.env.VERCEL_URL?.trim();
    const configuredBaseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();
    const baseUrl =
        configuredApiUrl ||
        (vercelUrl ? `https://${vercelUrl}` : undefined) ||
        configuredBaseUrl ||
        "http://localhost:3000";
    const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");

    try {
        new URL(normalizedBaseUrl);
    } catch {
        throw new Error(
            "Invalid API base URL. Set NEXT_PUBLIC_API_URL or NEXT_PUBLIC_BASE_URL to a complete URL such as https://example.vercel.app."
        );
    }

    return normalizedBaseUrl;
}
