export type IngredientType = "bun" | "main" | "sauce";

export type TabLabel = "Булки" | "Соусы" | "Начинки";

export interface IngredientGroupConfig {
    type: IngredientType;
    label: TabLabel;
}

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

export interface BurgerIngredientsProps {
    groupedData: BurgerIngredientGroup[];
    getCounterById: (_id: BurgerIngredientType["_id"]) => number;
    tabLabels: readonly TabLabel[];
    labelToType: Record<TabLabel, IngredientType>;
    typeToLabel: Record<IngredientType, TabLabel>;
}

export interface BurgerIngredientsListProps {
    groupedData: BurgerIngredientGroup[];
    activeTab: TabLabel;
    getCounterById: (_id: BurgerIngredientType["_id"]) => number;
    onGroupInView: (label: TabLabel) => void;
    shouldScrollToActive: boolean;
    onScrollAligned: () => void;
    labelToType: Record<TabLabel, IngredientType>;
    typeToLabel: Record<IngredientType, TabLabel>;
}

export interface BurgerIngredientsTabsProps {
    activeTab: TabLabel;
    onTabChange: (tab: TabLabel) => void;
    tabLabels: readonly TabLabel[];
}

export interface BurgerIngredientGroup {
    name: TabLabel;
    type: IngredientType;
    items: BurgerIngredientType[];
}

export interface BurgerIngredientItemProps {
    ingredient: BurgerIngredientType;
    counter?: number;
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
    onOrder: () => void | Promise<void>;
    removeItem: (ingredientId: BurgerIngredientType["_id"], uid: string) => void;
    onDropIngredient: (ingredient: BurgerIngredientType) => void;
    moveItem: (fromIndex: number, toIndex: number) => void;
}


export interface OrderDetailsProps {
    orderNumber: number;
}

export interface IngredientDetailsProps {
    ingredient: BurgerIngredientType;
}
