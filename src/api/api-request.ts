const API_BASE_URL = "https://norma.education-services.ru/api";

function resolveUrl(endpoint: string): string {
    if (/^https?:\/\//i.test(endpoint)) {
        return endpoint;
    }

    const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${API_BASE_URL}${normalizedEndpoint}`;
}

export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = resolveUrl(endpoint);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options?.headers || {}),
            },
            signal: controller.signal,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Fetch error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        return data as T;

    } catch (unknownError) {
        if (unknownError instanceof Error && unknownError.name === "AbortError") {
            throw new Error("Request timed out or was aborted");
        }
        throw unknownError;
    } finally {
        clearTimeout(timeout);
    }
}
