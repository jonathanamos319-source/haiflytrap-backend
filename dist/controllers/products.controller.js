"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const db_1 = require("../config/db");
const uploadImage_1 = require("../middleware/uploadImage");
const COLUMN_MAP = {
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
function formatProduct(row) {
    if (!row)
        return row;
    const priceNum = Number(row.price) || 0;
    const origPriceNum = row.original_price != null ? Number(row.original_price) : undefined;
    let features = row.features;
    if (typeof features === 'string') {
        try {
            features = JSON.parse(features);
        }
        catch { }
    }
    let specifications = row.specifications;
    if (typeof specifications === 'string') {
        try {
            specifications = JSON.parse(specifications);
        }
        catch { }
    }
    let images = row.images;
    if (typeof images === 'string') {
        try {
            images = JSON.parse(images);
        }
        catch { }
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
const getProducts = async (req, res, next) => {
    try {
        const { category } = req.query;
        let sql = 'SELECT * FROM products ORDER BY created_at DESC';
        const params = [];
        if (category && category !== 'all' && category !== 'All') {
            sql = 'SELECT * FROM products WHERE category = $1 ORDER BY created_at DESC';
            params.push(category);
        }
        const result = await db_1.pool.query(sql, params);
        res.status(200).json({ success: true, data: result.rows.map(formatProduct) });
    }
    catch (err) {
        console.error('Internal Error (getProducts):', err);
        next(err);
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await db_1.pool.query('SELECT * FROM products WHERE id = $1', [id]);
        if (!result.rows[0]) {
            res.status(404).json({ success: false, error: 'Product not found' });
            return;
        }
        res.status(200).json({ success: true, data: formatProduct(result.rows[0]) });
    }
    catch (err) {
        next(err);
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res, next) => {
    try {
        const productData = req.body;
        const mappedCols = {};
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
        const result = await db_1.pool.query(`INSERT INTO products (${cols}) VALUES (${placeholders}) RETURNING *`, values);
        res.status(201).json({ success: true, data: formatProduct(result.rows[0]) });
    }
    catch (err) {
        next(err);
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const mappedCols = {};
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
        const existing = await db_1.pool.query('SELECT id FROM products WHERE id = $1', [id]);
        let row;
        if (existing.rows.length === 0) {
            // Product was a default in-memory product: UPSERT into database!
            const insertCols = ['id', ...keys];
            const insertValues = [id, ...keys.map(k => mappedCols[k])];
            const cols = insertCols.join(', ');
            const placeholders = insertCols.map((_, i) => `$${i + 1}`).join(', ');
            const insertResult = await db_1.pool.query(`INSERT INTO products (${cols}) VALUES (${placeholders}) RETURNING *`, insertValues);
            row = insertResult.rows[0];
        }
        else {
            // Product exists: update it
            const values = keys.map(k => mappedCols[k]);
            const setClauses = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
            const updateResult = await db_1.pool.query(`UPDATE products SET ${setClauses} WHERE id = $${keys.length + 1} RETURNING *`, [...values, id]);
            row = updateResult.rows[0];
        }
        if (!row) {
            res.status(404).json({ success: false, error: 'Product not found' });
            return;
        }
        res.status(200).json({ success: true, data: formatProduct(row) });
    }
    catch (err) {
        console.error('updateProduct error:', err);
        next(err);
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const fetchResult = await db_1.pool.query('SELECT * FROM products WHERE id = $1', [id]);
        const product = fetchResult.rows[0];
        if (!product) {
            res.status(404).json({ success: false, error: 'Product not found' });
            return;
        }
        if (product.cloudinary_public_id) {
            await (0, uploadImage_1.deleteFromCloudinary)(product.cloudinary_public_id);
        }
        await db_1.pool.query('DELETE FROM products WHERE id = $1', [id]);
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=products.controller.js.map