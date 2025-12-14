/**
 * 🌸 Product Data Type Definition
 * @typedef {Object} Product
 * @property {string} id - Unique identifier
 * @property {string} name - Product name
 * @property {string} category - Category ID
 * @property {number} price - Current price
 * @property {number} [oldPrice] - Original price (for discount display)
 * @property {number} rating - Product rating (0-5)
 * @property {string} image - Image URL
 * @property {string} badge - Badge text (e.g., "Hot", "New")
 * @property {string} description - Short description
 * @property {number} [stock] - Available stock count
 */

/**
 * 🌸 Lovely Boutique — Product Data
 * ---------------------------------
 * Sample mock product data for display in the shop grid.
 *
 * @type {Product[]}
 */
export const PRODUCTS = [
  {
    id: "p1",
    name: "Silky Matte Lipstick 💄",
    category: "makeup",
    price: 9.99,
    oldPrice: 12.99, // 🏷️ Discounted
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop",
    badge: "Hot",
    description:
      "A soft, beautiful matte lipstick in light pink, adding a charming touch to your lovely look 💋",
    stock: 15,
  },
  {
    id: "p2",
    name: "Floral Summer Dress 👗",
    category: "clothing",
    price: 29.5,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1520975918318-3e1c3b219b1d?w=600&auto=format&fit=crop",
    badge: "New",
    description:
      "A stylish and beautiful summer dress, comfortable and perfect for everyday elegance 🌸",
    stock: 50,
  },
  {
    id: "p3",
    name: "Elegant Pearl Earrings 💍",
    category: "accessories",
    price: 15.99,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1585386959984-a4155223168a?w=600&auto=format&fit=crop",
    badge: "Best Seller",
    description:
      "Beautiful jewelry that adds a touch of elegance and luxury to your outfit 💖",
    stock: 3, // ⚠️ Low Stock
  },
  {
    id: "p4",
    name: "Gentle Rose Skincare Set 🧴",
    category: "skincare",
    price: 42.0,
    oldPrice: 55.0, // 🏷️ Discounted
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1615397349754-6f1a3a81e1f1?w=600&auto=format&fit=crop",
    badge: "Popular",
    description:
      "A rose-infused skincare set that adds moisture and leaves your skin soft and glowing. 🌷",
    stock: 20,
  },
  {
    id: "p5",
    name: "Sweet Blossom Perfume 🌺",
    category: "perfume",
    price: 35.0,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1585386959984-cd8b9c37b0f4?w=600&auto=format&fit=crop",
    badge: "Limited",
    description:
      "A soft, floral rose scent, perfect for women who love a gentle and feminine touch ✨",
    stock: 0, // ❌ Out of Stock
  },
  {
    id: "p6",
    name: "Rose Glow Blush Palette 💕",
    category: "makeup",
    price: 12.99,
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1600180758890-6a9e3b1ce3c5?w=600&auto=format&fit=crop",
    badge: "Trending",
    description:
      "A soft pink blush with beautiful color, easy to apply for a fresh, daily glow. 💖",
    stock: 25,
  },
  {
    id: "p7",
    name: "Luxury Hair Serum 💆‍♀️",
    category: "haircare",
    price: 22.5,
    oldPrice: 28.0, // 🏷️ Discounted
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1586953208448-8f0db8cf4f74?w=600&auto=format&fit=crop",
    badge: "New Arrival",
    description:
      "A hair serum that makes your hair soft and shiny, with a beautiful floral scent. 🌺",
    stock: 12,
  },
  {
    id: "p8",
    name: "Classic Handbag 👜",
    category: "accessories",
    price: 48.0,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1618354691465-9aa3c72e8d4d?w=600&auto=format&fit=crop",
    badge: "Featured",
    description:
      "A classic handbag with great aesthetics, suitable for every occasion. 💼",
    stock: 4, // ⚠️ Low Stock
  },
];