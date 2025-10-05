export async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

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

    } catch (error: any) {
        if (error.name === "AbortError") {
            throw new Error("Request timed out or was aborted");
        }
        throw error;
    } finally {
        clearTimeout(timeout);
    }
}