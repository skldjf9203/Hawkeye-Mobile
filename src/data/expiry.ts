export const CATEGORIES = ["Nimko", "Nuts", "Munchese", "Others"];

export interface SKU {
  code: string;
  name: string;
  category: string;
}

export const SKU_MASTER: SKU[] = [
  { code: "NMK-001", name: "Spicy Nimko 100g", category: "Nimko" },
  { code: "NMK-002", name: "Mix Nimko 200g", category: "Nimko" },
  { code: "NUT-001", name: "Roasted Almonds", category: "Nuts" },
  { code: "NUT-002", name: "Salted Cashews", category: "Nuts" },
  { code: "MUN-001", name: "Cheese Puffs", category: "Munchese" },
  { code: "MUN-002", name: "Onion Rings", category: "Munchese" },
  { code: "OTH-001", name: "Generic Snack", category: "Others" },
];

export const CHANNELS = ["Retail", "Whole Sales", "LMT", "Institution"];
export const CITIES = ["Lahore", "Karachi", "Islamabad", "Faisalabad", "Multan"];
