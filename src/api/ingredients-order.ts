import { apiRequest } from "./api-request";

export interface IngredientsOrderPayload {
    ingredients: string[];
}

export interface IngredientsOrderResponse {
    success: boolean;
    name: string;
    order: {
        number: number;
    };
}

export async function createIngredientsOrder(
    ingredients: IngredientsOrderPayload["ingredients"]
): Promise<IngredientsOrderResponse> {
    const res = await apiRequest<IngredientsOrderResponse>("/orders", {
        method: "POST",
        body: JSON.stringify({ ingredients }),
    });

    if (!res.success) {
        throw new Error("Failed to create ingredients order");
    }

    return res;
}
