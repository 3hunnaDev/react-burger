export type IngredientType = "bun" | "main" | "sauce";

export interface BurgerIngredientType {
    _id: string;
    name: string;
    type: IngredientType;
    proteins: number;
    fat: number;
    carbohydrates: number;
    calories: number;
    price: number;
    image: string;
    image_mobile: string;
    image_large: string;
    __v: number;
}

export type TabLabel = "Булки" | "Соусы" | "Начинки";

export interface BurgerIngredientsProps {
    groupedData: BurgerIngredientGroup[];
    getCounterById: (_id: BurgerIngredientType["_id"]) => number;
    onIngredientSelect: (_id: BurgerIngredientType["_id"]) => void;
}

export interface BurgerIngredientsListProps {
    groupedData: BurgerIngredientGroup[];
    activeTab: TabLabel;
    getCounterById: (_id: BurgerIngredientType["_id"]) => number;
    onIngredientSelect: (_id: BurgerIngredientType["_id"]) => void;
}

export interface BurgerIngredientsTabsProps {
    activeTab: TabLabel;
    onTabChange: (tab: TabLabel) => void;
}

export interface BurgerIngredientGroup {
    name: TabLabel;
    type: IngredientType;
    items: BurgerIngredientType[];
}

export interface BurgerIngredientItemProps {
    ingredient: BurgerIngredientType;
    counter?: number;
    onSelect: (_id: BurgerIngredientType["_id"]) => void;
}

export interface DraggedIngredient {
    ingredient: BurgerIngredientType;
}

export interface BurgerIngredientDictionaryItem {
    _id: BurgerIngredientType["_id"];
    selected: string[];
}

export type BurgerIngredientDictionary = Record<
    BurgerIngredientType["_id"],
    BurgerIngredientDictionaryItem
>;

export interface ConstructorSelectedIngredient {
    uid: string;
    ingredient: BurgerIngredientType;
}

export interface BurgerConstructorProps {
    bun: BurgerIngredientType | null;
    items: ConstructorSelectedIngredient[];
    totalPrice: number;
    onOrder: () => void;
    removeItem: (ingredientId: BurgerIngredientType["_id"], uid: string) => void;
    onDropIngredient: (ingredient: BurgerIngredientType) => void;
}


export interface OrderDetailsProps {
    orderNumber: number;
    onClose: () => void;
}

export interface IngredientDetailsProps {
    ingredient: BurgerIngredientType;
    onClose: () => void;
}
