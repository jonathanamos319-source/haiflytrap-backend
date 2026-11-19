const { pool } = require('../dist/config/db');

const PRODUCTS = [
  {
    id: 'bk-spray-001',
    name: 'Broadkiller Surface Spray',
    category: 'organic-sprays',
    price: 3000,
    original_price: 3500,
    image: '/images/Broadkillersurefacespray.png',
    description: 'Premium odourless botanical insecticide safe for families and pets. Highly effective against flies, mosquitoes, and crawling insects.',
    rating: 5.0,
    reviews: 120,
    in_stock: true,
  },
  {
    id: 'hai-trap-001',
    name: 'Hai Fly Trap',
    category: 'mosquito-traps',
    price: 8500,
    original_price: 10000,
    image: '/images/TRAPIMG1.png',
    description: "The world's first commercially viable housefly trap. Eco-friendly and highly effective for both indoor and outdoor use.",
    rating: 5.0,
    reviews: 230,
    in_stock: true,
  },
  {
    id: 'carton-bulk-001',
    name: 'Carton',
    category: 'accessories',
    price: 100000,
    original_price: 120000,
    image: '/images/a carton.png',
    description: 'Bulk carton pack for distributors and large facilities. Includes 6 units of Broadkiller Surface Spray.',
    rating: 4.8,
    reviews: 45,
    in_stock: true,
  },
  {
    id: 'bk-30ml-001',
    name: 'Broadkiller Pocket Spray (30ML)',
    category: 'organic-sprays',
    price: 250,
    original_price: 350,
    min_quantity: 10,
    image: 'https://res.cloudinary.com/decnpcsss/image/upload/v1778172698/Dajosh-9.jpg_bewxxx.jpg',
    description: 'Travel-sized 30ML pocket spray. Perfect for on-the-go protection against houseflies and mosquitoes. Highly effective botanical formula in a compact size.',
    rating: 4.9,
    reviews: 85,
    in_stock: true,
    features: JSON.stringify(['Travel Friendly', 'Pocket Sized', 'Minimum Order: 10 units']),
  },
  {
    id: 'bk-100ml-001',
    name: 'Broadkiller Spray (100ML)',
    category: 'organic-sprays',
    price: 800,
    original_price: 1000,
    min_quantity: 3,
    image: 'https://res.cloudinary.com/decnpcsss/image/upload/v1778172697/Dajosh-7.jpg_j16wad.jpg',
    description: 'Standard 100ML spray bottle. High-potency botanical formulation for effective fly control in homes and offices.',
    rating: 4.8,
    reviews: 120,
    in_stock: true,
    features: JSON.stringify(['Standard Size', 'Easy Grip', 'Minimum Order: 3 units']),
  },
];

async function seed() {
  try {
    for (const p of PRODUCTS) {
      const priceLabel = `₦${Number(p.price).toLocaleString()}`;
      const originalPriceLabel = p.original_price ? `₦${Number(p.original_price).toLocaleString()}` : null;

      await pool.query(
        `INSERT INTO products (
          id, name, category, price, original_price, price_label, original_price_label,
          image, description, rating, reviews, in_stock, min_quantity, features
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          category = EXCLUDED.category,
          image = EXCLUDED.image,
          description = EXCLUDED.description;`,
        [
          p.id, p.name, p.category, p.price, p.original_price, priceLabel, originalPriceLabel,
          p.image, p.description, p.rating, p.reviews, p.in_stock, p.min_quantity || 1, p.features || null
        ]
      );
      console.log(`✓ Product synced: ${p.name} (${p.id})`);
    }

    console.log('SUCCESS: All products seeded and synchronized in PostgreSQL!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
