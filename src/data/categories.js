/**
 * 🌸 Category Data Type Definition
 * @typedef {Object} Category
 * @property {string} id - Unique identifier for the category
 * @property {string} label - Display name of the category
 * @property {string} emoji - Representative emoji
 * @property {string} description - Brief marketing description
 * @property {string} color - Tailwind CSS gradient classes
 */

/**
 * 🌸 Lovely Boutique — Product Categories Data
 * --------------------------------------------
 * This file contains all available product categories for the app.
 * Each category includes an id, label, emoji, and short description.
 *
 * @type {Category[]}
 */
export const CATEGORIES = [
  {
    id: "all",
    label: "All Products",
    emoji: "✨",
    description: "Browse the complete Lovely Boutique collection 💖",
    color: "from-pink-400 to-rose-400",
  },
  {
    id: "makeup",
    label: "Makeup",
    emoji: "💄",
    description: "Beauty essentials and cosmetics for the modern woman.",
    color: "from-pink-500 to-fuchsia-400",
  },
  {
    id: "clothing",
    label: "Clothing",
    emoji: "👗",
    description: "Trendy fashion pieces perfect for every occasion.",
    color: "from-rose-400 to-pink-500",
  },
  {
    id: "accessories",
    label: "Accessories",
    emoji: "💍",
    description: "Elegant jewelry and accessories to complete your look.",
    color: "from-fuchsia-400 to-rose-400",
  },
  {
    id: "skincare",
    label: "Skincare",
    emoji: "🧴",
    description: "Nourishing skincare for a radiant, healthy glow.",
    color: "from-pink-300 to-pink-500",
  },
  {
    id: "perfume",
    label: "Perfume",
    emoji: "🌷",
    description: "Soft, floral, and feminine fragrances you'll love.",
    color: "from-pink-400 to-fuchsia-500",
  },
  {
    id: "haircare",
    label: "Haircare",
    emoji: "💆‍♀️",
    description: "Products for silky, shiny, and beautiful hair.",
    color: "from-rose-300 to-fuchsia-400",
  },
];
