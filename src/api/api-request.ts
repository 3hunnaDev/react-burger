export async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${url}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error fetch request: ${response.status} ${text}`);
    }

    return response.json() as Promise<T>;
}