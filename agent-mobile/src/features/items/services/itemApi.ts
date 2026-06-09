import { Item } from "../../types";

const MOCK_ITEMS: Item[] = [
  {
    id: "i1",
    name: "Premium Chicken Feed",
    description: "High-protein feed for layers, 50kg bag",
    price: 2850.0,
    stock: 142,
    category: "Poultry",
    image: undefined,
  },
  {
    id: "i2",
    name: "Vitamin Premix",
    description: "Essential vitamin supplement for livestock",
    price: 450.0,
    stock: 89,
    category: "Supplements",
    image: undefined,
  },
  {
    id: "i3",
    name: "Dewormer Solution",
    description: "Broad-spectrum dewormer for cattle",
    price: 320.0,
    stock: 67,
    category: "Medicine",
    image: undefined,
  },
  {
    id: "i4",
    name: "Fish Meal Pellets",
    description: "Nutritious pellets for aquaculture, 25kg",
    price: 1950.0,
    stock: 45,
    category: "Aquaculture",
    image: undefined,
  },
  {
    id: "i5",
    name: "Corn Gluten Feed",
    description: "Animal feed ingredient, high energy",
    price: 1200.0,
    stock: 230,
    category: "Feed",
    image: undefined,
  },
  {
    id: "i6",
    name: "Pig Grower Mix",
    description: "Complete grower feed for pigs 40-70kg",
    price: 2100.0,
    stock: 38,
    category: "Swine",
    image: undefined,
  },
  {
    id: "i7",
    name: "Electrolyte Powder",
    description: "Stress relief electrolyte for poultry",
    price: 180.0,
    stock: 156,
    category: "Supplements",
    image: undefined,
  },
  {
    id: "i8",
    name: "Calcium Supplement",
    description: "Calcium carbonate for eggshell quality",
    price: 220.0,
    stock: 95,
    category: "Supplements",
    image: undefined,
  },
  {
    id: "i9",
    name: "Goat Mineral Block",
    description: "Trace mineral salt block for goats",
    price: 150.0,
    stock: 200,
    category: "Livestock",
    image: undefined,
  },
  {
    id: "i10",
    name: "Antibiotic Ointment",
    description: "Topical wound treatment for livestock",
    price: 280.0,
    stock: 12,
    category: "Medicine",
    image: undefined,
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const itemApi = {
  async getAll(): Promise<Item[]> {
    await delay(500);
    return [...MOCK_ITEMS];
  },

  async getById(id: string): Promise<Item | undefined> {
    await delay(300);
    return MOCK_ITEMS.find((i) => i.id === id);
  },

  async search(query: string): Promise<Item[]> {
    await delay(400);
    const lower = query.toLowerCase();
    return MOCK_ITEMS.filter(
      (i) =>
        i.name.toLowerCase().includes(lower) ||
        i.category.toLowerCase().includes(lower) ||
        i.description.toLowerCase().includes(lower)
    );
  },
};
