import { Router, Request, Response } from 'express';
import {
  getDatabase,
  saveDatabase,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  getAnalyticsSummary,
  hashPassword,
} from './db.ts';
import { Product, Category, Coupon, Review, StoreSettings, DeliverySettings, PaymentSettings, HomepageCMS } from '../src/types/index.ts';

export const apiRouter = Router();

// ===================================================
// PUBLIC BOOTSTRAP INITIALIZATION
// ===================================================
apiRouter.get('/init', (req: Request, res: Response) => {
  const db = getDatabase();
  res.json({
    storeSettings: db.storeSettings,
    deliverySettings: db.deliverySettings,
    paymentSettings: db.paymentSettings,
    homepageCms: db.homepageCms,
    categories: db.categories,
    featuredProducts: db.products.filter((p) => p.isFeatured),
    newArrivals: db.products.filter((p) => p.isNewArrival),
    limitedStock: db.products.filter((p) => p.isLimitedStock || p.stock <= p.lowStockThreshold),
    deals: db.products.filter((p) => p.isSale),
    reviews: db.reviews.filter((r) => r.isApproved),
  });
});

// ===================================================
// PRODUCTS
// ===================================================
apiRouter.get('/products', (req: Request, res: Response) => {
  const db = getDatabase();
  let list = [...db.products];

  const { category, gender, search, sort, isLimited, isSale, isNew } = req.query;

  if (category && category !== 'all') {
    list = list.filter((p) => p.categoryId === category || p.categoryName?.toLowerCase() === (category as string).toLowerCase());
  }

  if (gender && gender !== 'all') {
    list = list.filter((p) => p.gender.toLowerCase() === (gender as string).toLowerCase() || p.gender === 'Unisex');
  }

  if (isLimited === 'true') {
    list = list.filter((p) => p.isLimitedStock || p.stock <= p.lowStockThreshold);
  }

  if (isSale === 'true') {
    list = list.filter((p) => p.isSale || (p.salePrice && p.salePrice < p.price));
  }

  if (isNew === 'true') {
    list = list.filter((p) => p.isNewArrival);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Sort
  if (sort === 'price-low') {
    list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
  } else if (sort === 'price-high') {
    list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
  } else if (sort === 'newest') {
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sort === 'popular') {
    list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
  }

  res.json({ products: list, total: list.length });
});

apiRouter.get('/products/:idOrSlug', (req: Request, res: Response) => {
  const db = getDatabase();
  const idOrSlug = req.params.idOrSlug;
  const product = db.products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  const related = db.products
    .filter((p) => p.id !== product.id && (p.categoryId === product.categoryId || p.gender === product.gender))
    .slice(0, 4);

  const reviews = db.reviews.filter((r) => r.productId === product.id && r.isApproved);

  res.json({ product, related, reviews });
});

apiRouter.post('/products', (req: Request, res: Response) => {
  const db = getDatabase();
  const body = req.body;
  const now = new Date().toISOString();

  const id = `prod-${Date.now()}`;
  const slug = (body.name || 'product')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const newProduct: Product = {
    id,
    name: body.name || 'Untitled Garment',
    sku: body.sku || `AUR-${Math.floor(1000 + Math.random() * 9000)}`,
    slug,
    description: body.description || '',
    categoryId: body.categoryId || db.categories[0]?.id || '',
    categoryName: db.categories.find((c) => c.id === body.categoryId)?.name || 'General',
    gender: body.gender || 'Unisex',
    price: Number(body.price) || 0,
    salePrice: body.salePrice ? Number(body.salePrice) : undefined,
    costPrice: body.costPrice ? Number(body.costPrice) : undefined,
    stock: Number(body.stock) || 0,
    lowStockThreshold: Number(body.lowStockThreshold) || 3,
    sizes: Array.isArray(body.sizes) ? body.sizes : ['M', 'L'],
    colors: Array.isArray(body.colors) && body.colors.length > 0 ? body.colors : [{ name: 'Default', hex: '#111111' }],
    images: Array.isArray(body.images) && body.images.length > 0 ? body.images : ['/src/assets/images/export_overstock_flatlay_1790699838766.jpg'],
    tags: Array.isArray(body.tags) ? body.tags : ['Export Overstock'],
    isFeatured: Boolean(body.isFeatured),
    isNewArrival: Boolean(body.isNewArrival),
    isBestSeller: Boolean(body.isBestSeller),
    isLimitedStock: Boolean(body.isLimitedStock) || Number(body.stock) <= Number(body.lowStockThreshold || 3),
    isSale: Boolean(body.isSale),
    details: body.details || {
      fabric: '100% Export Grade Cotton',
      fit: 'Standard Fit',
      care: 'Machine wash cold',
      origin: 'International Retail Overstock',
      exportBatchInfo: 'I-8 Markaz Retail Lot',
    },
    createdAt: now,
    updatedAt: now,
  };

  db.products.unshift(newProduct);
  saveDatabase();
  res.status(201).json(newProduct);
});

apiRouter.put('/products/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  const existing = db.products[index];
  const body = req.body;
  const now = new Date().toISOString();

  const updated: Product = {
    ...existing,
    ...body,
    price: Number(body.price ?? existing.price),
    salePrice: body.salePrice !== undefined ? (body.salePrice ? Number(body.salePrice) : undefined) : existing.salePrice,
    costPrice: body.costPrice !== undefined ? (body.costPrice ? Number(body.costPrice) : undefined) : existing.costPrice,
    stock: Number(body.stock ?? existing.stock),
    lowStockThreshold: Number(body.lowStockThreshold ?? existing.lowStockThreshold),
    categoryName: db.categories.find((c) => c.id === (body.categoryId || existing.categoryId))?.name || existing.categoryName,
    updatedAt: now,
  };

  if (updated.stock <= updated.lowStockThreshold) {
    updated.isLimitedStock = true;
  }

  db.products[index] = updated;
  saveDatabase();
  res.json(updated);
});

apiRouter.post('/products/:id/duplicate', (req: Request, res: Response) => {
  const db = getDatabase();
  const original = db.products.find((p) => p.id === req.params.id);
  if (!original) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  const now = new Date().toISOString();
  const id = `prod-${Date.now()}`;
  const copy: Product = {
    ...original,
    id,
    sku: `${original.sku}-COPY`,
    name: `${original.name} (Copy)`,
    slug: `${original.slug}-copy-${Math.floor(Math.random() * 1000)}`,
    createdAt: now,
    updatedAt: now,
  };

  db.products.unshift(copy);
  saveDatabase();
  res.status(201).json(copy);
});

apiRouter.delete('/products/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  const removed = db.products.splice(index, 1)[0];
  saveDatabase();
  res.json({ success: true, removed });
});

// ===================================================
// CATEGORIES
// ===================================================
apiRouter.get('/categories', (req: Request, res: Response) => {
  const db = getDatabase();
  res.json(db.categories);
});

apiRouter.post('/categories', (req: Request, res: Response) => {
  const db = getDatabase();
  const body = req.body;
  const id = `cat-${Date.now()}`;
  const slug = (body.name || 'category').toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const newCat: Category = {
    id,
    name: body.name || 'New Category',
    slug,
    description: body.description || '',
    image: body.image || '/src/assets/images/export_overstock_flatlay_1790699838766.jpg',
    displayOrder: Number(body.displayOrder) || db.categories.length + 1,
  };

  db.categories.push(newCat);
  saveDatabase();
  res.status(201).json(newCat);
});

apiRouter.put('/categories/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const cat = db.categories.find((c) => c.id === req.params.id);
  if (!cat) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }
  Object.assign(cat, req.body);
  saveDatabase();
  res.json(cat);
});

apiRouter.delete('/categories/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const index = db.categories.findIndex((c) => c.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }
  db.categories.splice(index, 1);
  saveDatabase();
  res.json({ success: true });
});

// ===================================================
// ORDERS (MANDATORY REQUIREMENT)
// ===================================================
apiRouter.get('/orders', (req: Request, res: Response) => {
  const db = getDatabase();
  const { status, paymentStatus, search, customerId } = req.query;
  let list = [...db.orders];

  if (customerId && typeof customerId === 'string') {
    list = list.filter((o) => o.customerId === customerId);
  }

  if (status && status !== 'all') {
    list = list.filter((o) => o.orderStatus === status);
  }

  if (paymentStatus && paymentStatus !== 'all') {
    list = list.filter((o) => o.paymentStatus === paymentStatus);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
    );
  }

  res.json({ orders: list, total: list.length });
});

apiRouter.get('/orders/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  const customer = db.customers.find((c) => c.id === order.customerId);
  res.json({ order, customer });
});

apiRouter.post('/orders', (req: Request, res: Response) => {
  try {
    const { customerInfo, items, paymentMethod, couponCode } = req.body;
    if (!customerInfo || !customerInfo.fullName || !customerInfo.phone || !customerInfo.address || !customerInfo.city) {
      res.status(400).json({ error: 'Missing required customer delivery information.' });
      return;
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Cart is empty. Please select products to order.' });
      return;
    }

    const order = createOrder({
      customerInfo,
      items,
      paymentMethod: paymentMethod || 'cod',
      couponCode,
    });

    res.status(201).json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to place order' });
  }
});

apiRouter.patch('/orders/:id/status', (req: Request, res: Response) => {
  try {
    const { status, note, trackingNumber } = req.body;
    const order = updateOrderStatus(req.params.id, status, note, trackingNumber);
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.patch('/orders/:id/payment', (req: Request, res: Response) => {
  try {
    const { paymentStatus } = req.body;
    const order = updatePaymentStatus(req.params.id, paymentStatus);
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

apiRouter.patch('/orders/:id/notes', (req: Request, res: Response) => {
  const db = getDatabase();
  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  if (req.body.adminNotes !== undefined) {
    order.adminNotes = req.body.adminNotes;
  }
  if (req.body.trackingNumber !== undefined) {
    order.trackingNumber = req.body.trackingNumber;
  }
  order.updatedAt = new Date().toISOString();
  saveDatabase();
  res.json(order);
});

// ===================================================
// CUSTOMERS (MANDATORY DEDICATED TABLE)
// ===================================================
apiRouter.get('/customers', (req: Request, res: Response) => {
  const db = getDatabase();
  const { search } = req.query;
  let list = [...db.customers];

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.city && c.city.toLowerCase().includes(q))
    );
  }

  res.json({ customers: list, total: list.length });
});

apiRouter.get('/customers/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const customer = db.customers.find((c) => c.id === req.params.id);
  if (!customer) {
    res.status(404).json({ error: 'Customer not found' });
    return;
  }
  // Retrieve complete linked order history
  const customerOrders = db.orders.filter((o) => o.customerId === customer.id);
  res.json({ customer, orders: customerOrders });
});

apiRouter.patch('/customers/:id/notes', (req: Request, res: Response) => {
  const db = getDatabase();
  const customer = db.customers.find((c) => c.id === req.params.id);
  if (!customer) {
    res.status(404).json({ error: 'Customer not found' });
    return;
  }
  customer.notes = req.body.notes || '';
  customer.updatedAt = new Date().toISOString();
  saveDatabase();
  res.json(customer);
});

// ===================================================
// INVENTORY
// ===================================================
apiRouter.get('/inventory', (req: Request, res: Response) => {
  const db = getDatabase();
  const list = db.products.map((p) => {
    let status = 'In Stock';
    if (p.stock === 0) {
      status = 'Out of Stock';
    } else if (p.stock <= p.lowStockThreshold) {
      status = 'Low Stock';
    }
    return {
      id: p.id,
      name: p.name,
      sku: p.sku,
      stock: p.stock,
      lowStockThreshold: p.lowStockThreshold,
      categoryName: p.categoryName || 'General',
      price: p.price,
      salePrice: p.salePrice,
      status,
      image: p.images[0] || '',
    };
  });
  res.json(list);
});

apiRouter.patch('/inventory/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const product = db.products.find((p) => p.id === req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  if (req.body.stock !== undefined) {
    product.stock = Math.max(0, Number(req.body.stock));
  }
  if (req.body.lowStockThreshold !== undefined) {
    product.lowStockThreshold = Math.max(1, Number(req.body.lowStockThreshold));
  }

  product.isLimitedStock = product.stock <= product.lowStockThreshold;
  product.updatedAt = new Date().toISOString();
  saveDatabase();
  res.json(product);
});

// ===================================================
// COUPONS
// ===================================================
apiRouter.get('/coupons', (req: Request, res: Response) => {
  const db = getDatabase();
  res.json(db.coupons);
});

apiRouter.post('/coupons', (req: Request, res: Response) => {
  const db = getDatabase();
  const body = req.body;
  const newCoupon: Coupon = {
    id: `coup-${Date.now()}`,
    code: (body.code || 'COUPON').toUpperCase().trim(),
    discountType: body.discountType === 'percentage' ? 'percentage' : 'fixed',
    discountValue: Number(body.discountValue) || 0,
    minOrderAmount: Number(body.minOrderAmount) || 0,
    maxDiscount: body.maxDiscount ? Number(body.maxDiscount) : undefined,
    expiryDate: body.expiryDate,
    usageLimit: body.usageLimit ? Number(body.usageLimit) : undefined,
    usageCount: 0,
    isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    createdAt: new Date().toISOString(),
  };

  db.coupons.unshift(newCoupon);
  saveDatabase();
  res.status(201).json(newCoupon);
});

apiRouter.put('/coupons/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const coupon = db.coupons.find((c) => c.id === req.params.id);
  if (!coupon) {
    res.status(404).json({ error: 'Coupon not found' });
    return;
  }
  Object.assign(coupon, req.body);
  if (req.body.code) coupon.code = req.body.code.toUpperCase().trim();
  saveDatabase();
  res.json(coupon);
});

apiRouter.delete('/coupons/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const idx = db.coupons.findIndex((c) => c.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Coupon not found' });
    return;
  }
  db.coupons.splice(idx, 1);
  saveDatabase();
  res.json({ success: true });
});

apiRouter.post('/coupons/validate', (req: Request, res: Response) => {
  const db = getDatabase();
  const { code, subtotal } = req.body;
  if (!code) {
    res.status(400).json({ error: 'Please enter a coupon code' });
    return;
  }

  const coupon = db.coupons.find(
    (c) => c.code.toUpperCase() === code.toUpperCase().trim() && c.isActive
  );

  if (!coupon) {
    res.status(400).json({ error: 'Invalid or inactive coupon code' });
    return;
  }

  if (coupon.expiryDate && new Date(coupon.expiryDate).getTime() < Date.now()) {
    res.status(400).json({ error: 'This coupon code has expired' });
    return;
  }

  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    res.status(400).json({ error: 'Coupon code usage limit has been reached' });
    return;
  }

  if (subtotal < coupon.minOrderAmount) {
    res.status(400).json({
      error: `Minimum order amount for this coupon is Rs. ${coupon.minOrderAmount.toLocaleString()}`,
    });
    return;
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((subtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  res.json({
    valid: true,
    code: coupon.code,
    discount,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
  });
});

// ===================================================
// REVIEWS
// ===================================================
apiRouter.get('/reviews', (req: Request, res: Response) => {
  const db = getDatabase();
  const { all } = req.query;
  if (all === 'true') {
    res.json(db.reviews);
  } else {
    res.json(db.reviews.filter((r) => r.isApproved));
  }
});

apiRouter.post('/reviews', (req: Request, res: Response) => {
  const db = getDatabase();
  const { productId, customerName, customerEmail, rating, title, comment } = req.body;
  if (!customerName || !rating || !comment) {
    res.status(400).json({ error: 'Missing required review fields' });
    return;
  }
  const product = db.products.find((p) => p.id === productId);
  const newReview: Review = {
    id: `rev-${Date.now()}`,
    productId: productId || 'general',
    productName: product?.name || 'Aura Apparel Retail',
    customerName,
    customerEmail: customerEmail || '',
    rating: Math.min(5, Math.max(1, Number(rating))),
    title: title || 'Store Review',
    comment,
    isApproved: true, // auto approve or admin moderate
    isFeatured: false,
    createdAt: new Date().toISOString(),
  };

  db.reviews.unshift(newReview);
  saveDatabase();
  res.status(201).json(newReview);
});

apiRouter.patch('/reviews/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const review = db.reviews.find((r) => r.id === req.params.id);
  if (!review) {
    res.status(404).json({ error: 'Review not found' });
    return;
  }
  if (req.body.isApproved !== undefined) review.isApproved = Boolean(req.body.isApproved);
  if (req.body.isFeatured !== undefined) review.isFeatured = Boolean(req.body.isFeatured);
  saveDatabase();
  res.json(review);
});

apiRouter.delete('/reviews/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const idx = db.reviews.findIndex((r) => r.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Review not found' });
    return;
  }
  db.reviews.splice(idx, 1);
  saveDatabase();
  res.json({ success: true });
});

// ===================================================
// STORE SETTINGS, DELIVERY, PAYMENT, CMS
// ===================================================
apiRouter.get('/store-settings', (req: Request, res: Response) => {
  const db = getDatabase();
  res.json(db.storeSettings);
});

apiRouter.put('/store-settings', (req: Request, res: Response) => {
  const db = getDatabase();
  db.storeSettings = { ...db.storeSettings, ...req.body };
  saveDatabase();
  res.json(db.storeSettings);
});

apiRouter.get('/delivery-settings', (req: Request, res: Response) => {
  const db = getDatabase();
  res.json(db.deliverySettings);
});

apiRouter.put('/delivery-settings', (req: Request, res: Response) => {
  const db = getDatabase();
  db.deliverySettings = { ...db.deliverySettings, ...req.body };
  saveDatabase();
  res.json(db.deliverySettings);
});

apiRouter.get('/payment-settings', (req: Request, res: Response) => {
  const db = getDatabase();
  res.json(db.paymentSettings);
});

apiRouter.put('/payment-settings', (req: Request, res: Response) => {
  const db = getDatabase();
  db.paymentSettings = { ...db.paymentSettings, ...req.body };
  saveDatabase();
  res.json(db.paymentSettings);
});

apiRouter.get('/cms', (req: Request, res: Response) => {
  const db = getDatabase();
  res.json(db.homepageCms);
});

apiRouter.put('/cms', (req: Request, res: Response) => {
  const db = getDatabase();
  db.homepageCms = { ...db.homepageCms, ...req.body };
  saveDatabase();
  res.json(db.homepageCms);
});

// ===================================================
// ANALYTICS
// ===================================================
apiRouter.get('/analytics', (req: Request, res: Response) => {
  const summary = getAnalyticsSummary();
  res.json(summary);
});

// ===================================================
// AUTHENTICATION (ADMIN & CUSTOMER)
// ===================================================
apiRouter.post('/auth/admin/login', (req: Request, res: Response) => {
  const db = getDatabase();
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password required' });
    return;
  }

  const hash = hashPassword(password);
  const admin = db.adminUsers.find(
    (a) => a.email.toLowerCase() === email.toLowerCase().trim() && a.passwordHash === hash
  );

  if (!admin) {
    res.status(401).json({ error: 'Invalid admin credentials' });
    return;
  }

  // Create simulated secure token
  const token = `adm_tok_${admin.id}_${Date.now()}`;
  res.json({
    token,
    user: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
});

apiRouter.post('/auth/admin/change-password', (req: Request, res: Response) => {
  const db = getDatabase();
  const { adminId, currentPassword, newPassword } = req.body;
  const admin = db.adminUsers.find((a) => a.id === adminId);
  if (!admin) {
    res.status(404).json({ error: 'Admin user not found' });
    return;
  }
  if (admin.passwordHash !== hashPassword(currentPassword)) {
    res.status(400).json({ error: 'Current password incorrect' });
    return;
  }
  admin.passwordHash = hashPassword(newPassword);
  saveDatabase();
  res.json({ success: true, message: 'Password updated successfully' });
});

apiRouter.post('/auth/customer/lookup-orders', (req: Request, res: Response) => {
  const db = getDatabase();
  const { emailOrPhone } = req.body;
  if (!emailOrPhone) {
    res.status(400).json({ error: 'Please provide phone number or email address' });
    return;
  }
  const clean = emailOrPhone.trim().toLowerCase();
  const orders = db.orders.filter(
    (o) =>
      o.customerEmail.toLowerCase() === clean ||
      o.customerPhone.replace(/[\s\-\(\)]/g, '') === clean.replace(/[\s\-\(\)]/g, '')
  );
  res.json({ orders });
});
