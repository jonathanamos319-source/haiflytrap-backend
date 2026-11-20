import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/db';
import { ApiResponse } from '../types';
import { deleteFromCloudinary } from '../middleware/uploadImage';
import { getJsonCache, setJsonCache, invalidateProductCache } from '../config/redis';

const COLUMN_MAP: Record<string, string> = {
  name: 'name',
  description: 'description',
  price: 'price',
  originalPrice: 'original_price',
  original_price: 'original_price',
  priceLabel: 'price_label',
  price_label: 'price_label',
  originalPriceLabel: 'original_price_label',
  original_price_label: 'original_price_label',
  image: 'image',
  images: 'images',
  cloudinary_public_id: 'cloudinary_public_id',
  category: 'category',
  rating: 'rating',
  reviews: 'reviews',
  badge: 'badge',
  inStock: 'in_stock',
  in_stock: 'in_stock',
  isLimited: 'is_limited',
  is_limited: 'is_limited',
  manualOutOfStock: 'manual_out_of_stock',
  manual_out_of_stock: 'manual_out_of_stock',
  features: 'features',
  specifications: 'specifications',
  minQuantity: 'min_quantity',
  min_quantity: 'min_quantity',
  hasIndoorOutdoorVariants: 'has_indoor_outdoor_variants',
  has_indoor_outdoor_variants: 'has_indoor_outdoor_variants',
  indoorPrice: 'indoor_price',
  indoor_price: 'indoor_price',
  outdoorPrice: 'outdoor_price',
  outdoor_price: 'outdoor_price',
  freeDelivery: 'free_delivery',
  free_delivery: 'free_delivery',
};

function formatProduct(row: any) {
  if (!row) return row;
  const priceNum = Number(row.price) || 0;
  const origPriceNum = row.original_price != null ? Number(row.original_price) : undefined;
  let features = row.features;
  if (typeof features === 'string') {
    try { features = JSON.parse(features); } catch { }
  }
  let specifications = row.specifications;
  if (typeof specifications === 'string') {
    try { specifications = JSON.parse(specifications); } catch { }
  }
  let images = row.images;
  if (typeof images === 'string') {
    try { images = JSON.parse(images); } catch { }
  }

  return {
    id: String(row.id),
    name: row.name,
    description: row.description || '',
    price: priceNum,
    originalPrice: origPriceNum,
    priceLabel: `₦${priceNum.toLocaleString()}`,
    originalPriceLabel: origPriceNum ? `₦${origPriceNum.toLocaleString()}` : undefined,
    image: row.image,
    images: images || [],
    category: row.category,
    rating: Number(row.rating || 5),
    reviews: Number(row.reviews || 0),
    badge: row.badge || undefined,
    inStock: row.in_stock ?? true,
    isLimited: Boolean(row.is_limited),
    manualOutOfStock: Boolean(row.manual_out_of_stock),
    minQuantity: row.min_quantity != null ? Number(row.min_quantity) : 1,
    hasIndoorOutdoorVariants: Boolean(row.has_indoor_outdoor_variants),
    indoorPrice: row.indoor_price != null ? Number(row.indoor_price) : undefined,
    outdoorPrice: row.outdoor_price != null ? Number(row.outdoor_price) : undefined,
    freeDelivery: Boolean(row.free_delivery),
    features: features || [],
    specifications: specifications || {},
    createdAt: row.created_at,
  };
}

export const getProducts = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { category } = req.query;
    const catKey = typeof category === 'string' && category.trim() ? category.trim() : 'all';
    const cacheKey = `cache:products:${catKey}`;

    // Try Redis cache first (sub-5ms response)
    const cached = await getJsonCache<any[]>(cacheKey);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      res.status(200).json({ success: true, data: cached });
      return;
    }

    let sql = 'SELECT * FROM products ORDER BY created_at DESC';
    const params: any[] = [];

    if (category && category !== 'all' && category !== 'All') {
      sql = 'SELECT * FROM products WHERE category = $1 ORDER BY created_at DESC';
      params.push(category);
    }

    const result = await pool.query(sql, params);
    const data = result.rows.map(formatProduct);

    // Save in Redis cache for subsequent visitors (1 hour TTL)
    setJsonCache(cacheKey, data, 3600).catch(() => {});

    res.setHeader('X-Cache', 'MISS');
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Internal Error (getProducts):', err);
    next(err);
  }
};

export const getProductById = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    if (!result.rows[0]) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    res.status(200).json({ success: true, data: formatProduct(result.rows[0]) });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const productData = req.body;

    const mappedCols: Record<string, any> = {};
    for (const [key, val] of Object.entries(productData)) {
      const col = COLUMN_MAP[key];
      if (col) {
        mappedCols[col] = val;
      }
    }

    if (mappedCols.price !== undefined) {
      mappedCols.price = Number(mappedCols.price);
      mappedCols.price_label = `₦${mappedCols.price.toLocaleString()}`;
    }

    const keys = Object.keys(mappedCols);
    if (keys.length === 0) {
      res.status(400).json({ success: false, error: 'No valid product fields provided' });
      return;
    }

    const values = keys.map(k => mappedCols[k]);
    const cols = keys.join(', ');
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

    const result = await pool.query(
      `INSERT INTO products (${cols}) VALUES (${placeholders}) RETURNING *`,
      values
    );

    await invalidateProductCache();
    res.status(201).json({ success: true, data: formatProduct(result.rows[0]) });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const mappedCols: Record<string, any> = {};
    for (const [key, val] of Object.entries(updates)) {
      const col = COLUMN_MAP[key];
      if (col) {
        mappedCols[col] = val;
      }
    }

    if (mappedCols.price !== undefined) {
      mappedCols.price = Number(mappedCols.price);
      mappedCols.price_label = `₦${mappedCols.price.toLocaleString()}`;
    }

    const keys = Object.keys(mappedCols);
    if (keys.length === 0) {
      res.status(400).json({ success: false, error: 'No valid update fields provided' });
      return;
    }

    // Check if product exists in database
    const existing = await pool.query('SELECT id FROM products WHERE id = $1', [id]);

    let row: any;
    if (existing.rows.length === 0) {
      // Product was a default in-memory product: UPSERT into database!
      const insertCols = ['id', ...keys];
      const insertValues = [id, ...keys.map(k => mappedCols[k])];
      const cols = insertCols.join(', ');
      const placeholders = insertCols.map((_, i) => `$${i + 1}`).join(', ');

      const insertResult = await pool.query(
        `INSERT INTO products (${cols}) VALUES (${placeholders}) RETURNING *`,
        insertValues
      );
      row = insertResult.rows[0];
    } else {
      // Product exists: update it
      const values = keys.map(k => mappedCols[k]);
      const setClauses = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');

      const updateResult = await pool.query(
        `UPDATE products SET ${setClauses} WHERE id = $${keys.length + 1} RETURNING *`,
        [...values, id]
      );
      row = updateResult.rows[0];
    }

    if (!row) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    await invalidateProductCache();
    res.status(200).json({ success: true, data: formatProduct(row) });
  } catch (err) {
    console.error('updateProduct error:', err);
    next(err);
  }
};

export const deleteProduct = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { id } = req.params;

    const fetchResult = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    const product = fetchResult.rows[0];

    if (!product) {
      await invalidateProductCache();
      res.status(200).json({ success: true, message: 'Product already deleted or not found' });
      return;
    }

    if (product.cloudinary_public_id) {
      await deleteFromCloudinary(product.cloudinary_public_id).catch(() => {});
    }

    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    await invalidateProductCache();
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};
