export const products = [
  {
    id: 1,
    name: 'Wireless Noise-Cancelling Headphones',
    category: 'Electronics',
    price: 89.99,
    rating: 4.5,
    reviewCount: 1284,
    image: 'https://placehold.co/400x400?text=Headphones',
    description:
      'Over-ear wireless headphones with active noise cancellation, 30-hour battery life, and plush memory-foam ear cushions for all-day comfort.',
    stock: 24,
  },
  {
    id: 2,
    name: 'Stainless Steel Insulated Water Bottle',
    category: 'Home & Kitchen',
    price: 19.5,
    rating: 4.7,
    reviewCount: 3521,
    image: 'https://placehold.co/400x400?text=Water+Bottle',
    description:
      'Double-wall vacuum insulated bottle that keeps drinks cold for 24 hours or hot for 12 hours. Leak-proof lid and durable powder-coated finish.',
    stock: 152,
  },
  {
    id: 3,
    name: 'Mechanical Keyboard, RGB Backlit',
    category: 'Electronics',
    price: 54.99,
    rating: 4.3,
    reviewCount: 897,
    image: 'https://placehold.co/400x400?text=Keyboard',
    description:
      'Compact 87-key mechanical keyboard with hot-swappable switches, per-key RGB lighting, and a durable aluminum top plate.',
    stock: 41,
  },
  {
    id: 4,
    name: 'Yoga Mat with Carrying Strap',
    category: 'Sports & Outdoors',
    price: 24.99,
    rating: 4.6,
    reviewCount: 2210,
    image: 'https://placehold.co/400x400?text=Yoga+Mat',
    description:
      'Extra-thick 6mm non-slip yoga mat made from eco-friendly TPE material. Lightweight and easy to carry with the included strap.',
    stock: 78,
  },
  {
    id: 5,
    name: 'Ceramic Non-Stick Frying Pan, 10-inch',
    category: 'Home & Kitchen',
    price: 32.0,
    rating: 4.4,
    reviewCount: 654,
    image: 'https://placehold.co/400x400?text=Frying+Pan',
    description:
      'PTFE and PFOA-free ceramic non-stick coating for healthy cooking. Compatible with induction, gas, and electric stovetops.',
    stock: 63,
  },
  {
    id: 6,
    name: 'Bestselling Mystery Novel (Paperback)',
    category: 'Books',
    price: 12.99,
    rating: 4.8,
    reviewCount: 5432,
    image: 'https://placehold.co/400x400?text=Book',
    description:
      'A gripping page-turner that follows a small-town detective unraveling a decades-old disappearance. Winner of three literary awards.',
    stock: 210,
  },
  {
    id: 7,
    name: 'Adjustable Laptop Stand',
    category: 'Electronics',
    price: 27.99,
    rating: 4.5,
    reviewCount: 1103,
    image: 'https://placehold.co/400x400?text=Laptop+Stand',
    description:
      'Ergonomic aluminum laptop stand with adjustable height and angle. Improves posture and airflow for laptops up to 17 inches.',
    stock: 35,
  },
  {
    id: 8,
    name: "Men's Running Shoes",
    category: 'Clothing & Shoes',
    price: 64.99,
    rating: 4.2,
    reviewCount: 789,
    image: 'https://placehold.co/400x400?text=Running+Shoes',
    description:
      'Lightweight breathable mesh running shoes with responsive cushioning and a durable rubber outsole for daily training.',
    stock: 56,
  },
]

export function getProductById(id) {
  return products.find((p) => p.id === Number(id))
}
