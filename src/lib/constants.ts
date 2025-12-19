export interface Ingredient {
    id: string;
    label: string;
    icon: string;
    color: string;
}

export const INGREDIENTS: Ingredient[] = [
    { id: "beef", label: "Beef Cubes", icon: "🥩", color: "#FF4500" },
    { id: "oil_veg", label: "Vegetable Oil", icon: "🫗", color: "#FFD700" },
    { id: "onion", label: "Chopped Onions", icon: "🧅", color: "#F8F9FA" },
    { id: "maggi", label: "Maggi Cubes", icon: "🧂", color: "#FFB800" },
    { id: "eggplant", label: "Garden Eggs", icon: "🍆", color: "#C19A6B" },
    { id: "fish", label: "Smoked Fish", icon: "🐟", color: "#0072C6" },
    { id: "pepper", label: "Chili Peppers", icon: "🌶️", color: "#FF4500" },
    { id: "peanut", label: "Peanut Paste", icon: "🥜", color: "#D2691E" },
    { id: "palm_oil", label: "Red Palm Oil", icon: "🏺", color: "#FF4500" },
    { id: "cassava", label: "Cassava Leaves", icon: "🌿", color: "#1EB53A" },
    { id: "water", label: "Pure Water", icon: "💧", color: "#00F3FF" },
];
