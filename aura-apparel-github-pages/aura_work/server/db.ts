import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  Product,
  Category,
  Order,
  Customer,
  Coupon,
  Review,
  StoreSettings,
  DeliverySettings,
  PaymentSettings,
  HomepageCMS,
  AdminUser,
  AnalyticsSummary,
  OrderStatus,
  PaymentStatus,
} from '../src/types/index.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'aura_apparel_db.json');

export interface DatabaseSchema {
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  coupons: Coupon[];
  reviews: Review[];
  storeSettings: StoreSettings;
  deliverySettings: DeliverySettings;
  paymentSettings: PaymentSettings;
  homepageCms: HomepageCMS;
  adminUsers: (AdminUser & { passwordHash: string })[];
  orderCounter: number;
}

// In-memory cache synced to disk
let db: DatabaseSchema;

export function getDatabase(): DatabaseSchema {
  if (!db) {
    initDatabase();
  }
  return db;
}

export function saveDatabase(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (error) {
    console.error('Error saving database to disk:', error);
  }
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function initDatabase(): void {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(data);
      console.log(`Loaded Aura Apparel database from disk. (${db.products.length} products, ${db.orders.length} orders)`);
      return;
    }
  } catch (err) {
    console.warn('Could not read existing database file, re-seeding:', err);
  }

  console.log('Seeding initial Aura Apparel database...');
  db = generateSeedData();
  saveDatabase();
}

function generateSeedData(): DatabaseSchema {
  const now = new Date().toISOString();

  const storeSettings: StoreSettings = {
    brandName: 'Aura Apparel',
    businessType: 'Fashion / Clothing Retail',
    tagline: 'Premium Export Apparel. Unexpected Prices.',
    phone: '+92 314 0855 651',
    whatsapp: '+92 314 0855 651',
    email: 'contact@auraapparel.pk',
    mapsUrl: 'https://maps.app.goo.gl/6SozQkfxZtNGyNcr5',
    locations: [
      {
        id: 'loc-zakki',
        name: 'Aura Apparel - Zakki Plaza',
        address: 'Shop 14/15, Zakki Plaza, I-8 Markaz, Islamabad',
        phone: '+92 314 0855 651',
        mapsUrl: 'https://maps.app.goo.gl/6SozQkfxZtNGyNcr5',
        isMain: true,
      },
      {
        id: 'loc-plaza2000',
        name: 'Aura Apparel - Plaza 2000',
        address: 'Shop 20, Plaza 2000, I-8 Markaz, Islamabad',
        phone: '+92 314 0855 651',
        mapsUrl: 'https://maps.app.goo.gl/6SozQkfxZtNGyNcr5',
        isMain: false,
      },
    ],
    hours: {
      weekdays: '11:30 AM - 11:00 PM',
      friday: '02:30 PM - 11:30 PM',
      weekends: '11:30 AM - 11:30 PM',
      notes: 'Open 7 days a week in I-8 Markaz, Islamabad. Managed via Admin Panel.',
    },
    socialLinks: {
      instagram: 'https://instagram.com/auraapparelpk',
      facebook: 'https://facebook.com/auraapparelpk',
      tiktok: 'https://tiktok.com/@auraapparelpk',
    },
    announcementBar: {
      enabled: true,
      text: 'Export Leftovers & Overstock Drops · Limited Stock No-Restock Model · Free Shipping over Rs. 3,500 Across Pakistan',
      link: '/shop',
    },
  };

  const deliverySettings: DeliverySettings = {
    standardFee: 250,
    freeShippingThreshold: 3500,
    estimatedDaysLocal: '1-2 Business Days (Islamabad & Rawalpindi)',
    estimatedDaysNational: '3-5 Business Days (Nationwide Pakistan)',
    zones: [
      { id: 'isb_rwp', name: 'Islamabad & Rawalpindi', rate: 200, estimatedDays: '1-2 Days' },
      { id: 'lahore', name: 'Lahore', rate: 250, estimatedDays: '2-3 Days' },
      { id: 'karachi', name: 'Karachi', rate: 300, estimatedDays: '3-4 Days' },
      { id: 'peshawar', name: 'Peshawar', rate: 250, estimatedDays: '2-3 Days' },
      { id: 'faisalabad', name: 'Faisalabad & Multan', rate: 250, estimatedDays: '2-4 Days' },
      { id: 'other', name: 'Other Cities / Rest of Pakistan', rate: 300, estimatedDays: '3-5 Days' },
    ],
  };

  const paymentSettings: PaymentSettings = {
    codEnabled: true,
    codInstructions: 'Pay cash to the courier representative when the parcel arrives at your doorstep.',
    bankTransferEnabled: true,
    bankDetails: {
      bankName: 'Meezan Bank Limited',
      accountTitle: 'AURA APPAREL RETAIL',
      accountNumber: '02010108920194',
      iban: 'PK45MEZN0002010108920194',
      branch: 'I-8 Markaz Branch, Islamabad',
      instructions: 'Transfer the exact order total via Online Banking, Raast ID, or ATM. Send the payment receipt screenshot with your Order ID on WhatsApp to +92 314 0855 651 for instant dispatch confirmation.',
    },
    manualPaymentEnabled: true,
    manualPaymentInstructions: 'Direct JazzCash / EasyPaisa / In-Store Pickup at Shop 14/15 Zakki Plaza, I-8 Markaz, Islamabad.',
  };

  const homepageCms: HomepageCMS = {
    heroHeadline: 'Premium Apparel. Unexpected Prices.',
    heroSubheadline: 'Discover export-quality fashion, limited pieces, and factory overstock at prices far below traditional retail. Visit our twin stores in I-8 Markaz, Islamabad or shop online nationwide.',
    heroImage: '/src/assets/images/hero_fashion_campaign_1790699788342.jpg',
    primaryCtaText: 'Shop Collection',
    secondaryCtaText: 'Explore New Arrivals',
    promoBanner: {
      active: true,
      title: 'Limited Export Overstock Shipment Just Unloaded',
      subtitle: 'Over 60+ European & North American surplus articles arrived at I-8 Markaz stores. Strict no-restock policy.',
      buttonText: 'View Limited Stock',
      link: '/limited-stock',
    },
    featureCards: [
      {
        title: 'Premium Export Apparel',
        description: 'Authentic international grade-A surplus, production overruns, and order cancellations tailored from world-class fabrics.',
      },
      {
        title: 'Limited Stock / No-Restock',
        description: 'Every article is curated in limited quantities. Once a style or size is sold out, it is permanently gone.',
      },
      {
        title: 'Regular Weekly Drops',
        description: 'New overseas export shipments arriving weekly at our retail shops in Zakki Plaza and Plaza 2000, I-8 Markaz.',
      },
      {
        title: 'Sensible Honest Pricing',
        description: 'Enjoy 50% to 70% off standard international brand retail prices with verified textile density and stitching.',
      },
    ],
  };

  const categories: Category[] = [
    { id: 'cat-men', name: "Men's Collection", slug: 'men', description: 'Export overstock shirts, tees, bottoms, and outerwear for men.', displayOrder: 1 },
    { id: 'cat-women', name: "Women's Collection", slug: 'women', description: 'Curated export apparel, knitwear, trousers, and outerwear for women.', displayOrder: 2 },
    { id: 'cat-jackets', name: 'Jackets & Outerwear', slug: 'jackets', description: 'Structured chore jackets, bombers, windbreakers, and overshirts.', displayOrder: 3 },
    { id: 'cat-shirts', name: 'Casual & Oxford Shirts', slug: 'shirts', description: 'High-thread count cotton button-downs and relaxed resort shirts.', displayOrder: 4 },
    { id: 'cat-tshirts', name: 'Heavyweight T-Shirts', slug: 't-shirts', description: '240-280 GSM heavyweight combed cotton drops.', displayOrder: 5 },
    { id: 'cat-hoodies', name: 'Hoodies & Sweatshirts', slug: 'hoodies', description: 'Fleece-lined winter essentials and French terry pullovers.', displayOrder: 6 },
    { id: 'cat-pants', name: 'Trousers & Chinos', slug: 'pants', description: 'Tailored relaxed trousers, pleated chinos, and cargo pants.', displayOrder: 7 },
    { id: 'cat-denim', name: 'Denim & Jeans', slug: 'denim', description: 'Selvedge weave, straight leg, and tapered export denim.', displayOrder: 8 },
  ];

  const products: Product[] = [
    {
      id: 'prod-001',
      name: 'Structured Canvas Chore Jacket',
      sku: 'AUR-JKT-001',
      slug: 'structured-canvas-chore-jacket',
      description: 'Engineered from 100% heavy cotton duck canvas with reinforced triple-needle stitching and matte horn buttons. Sourced from a high-end Scandinavian export surplus order. Features four utility patch pockets and internal chest compartment.',
      categoryId: 'cat-jackets',
      categoryName: 'Jackets & Outerwear',
      gender: 'Men',
      price: 5450,
      salePrice: 4650,
      costPrice: 2800,
      stock: 4,
      lowStockThreshold: 5,
      sizes: ['M', 'L', 'XL'],
      colors: [
        { name: 'Washed Olive', hex: '#5B6652' },
        { name: 'Oatmeal Khaki', hex: '#C2B8A3' },
      ],
      images: [
        '/src/assets/images/mens_collection_showcase_1790699804267.jpg',
        '/src/assets/images/export_overstock_flatlay_1790699838766.jpg',
      ],
      tags: ['Heavyweight', 'Chore Jacket', 'Export Leftover', 'Bestseller'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      isLimitedStock: true,
      isSale: true,
      details: {
        fabric: '100% Heavyweight Cotton Canvas (380 GSM)',
        fit: 'Boxy Relaxed Fit',
        care: 'Machine wash cold inside out, line dry',
        origin: 'Export Surplus (Northern Europe Order)',
        exportBatchInfo: 'Batch #SK-881 / 18 pcs allocated to I-8 Markaz',
      },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'prod-002',
      name: 'Minimalist Belted Wool-Blend Trench',
      sku: 'AUR-WMN-TRN-02',
      slug: 'minimalist-belted-wool-blend-trench',
      description: 'An architectural double-breasted coat crafted from a premium dense wool-viscose blend. Features storm flap detailing, detachable fabric belt, deep welt pockets, and smooth satin lining. Extremely limited pieces.',
      categoryId: 'cat-women',
      categoryName: "Women's Collection",
      gender: 'Women',
      price: 7850,
      salePrice: 6490,
      costPrice: 3900,
      stock: 2, // low stock test
      lowStockThreshold: 4,
      sizes: ['S', 'M', 'L'],
      colors: [
        { name: 'Camel Sand', hex: '#D2B48C' },
        { name: 'Midnight Charcoal', hex: '#2C302E' },
      ],
      images: [
        '/src/assets/images/womens_collection_showcase_1790699815876.jpg',
        '/src/assets/images/hero_fashion_campaign_1790699788342.jpg',
      ],
      tags: ['Overcoat', 'Trench', 'Wool Blend', 'Limited Edition'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      isLimitedStock: true,
      isSale: true,
      details: {
        fabric: '65% Wool, 35% Viscose with cupro lining',
        fit: 'Slightly Oversized Tailored Silhouette',
        care: 'Dry clean recommended',
        origin: 'High-street London Export Overstock',
        exportBatchInfo: 'Only 6 pieces imported in batch #LON-90',
      },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'prod-003',
      name: 'Heavyweight Boxy Crewneck Tee (260 GSM)',
      sku: 'AUR-TEE-BOX-03',
      slug: 'heavyweight-boxy-crewneck-tee',
      description: 'Crafted from combed ring-spun Turkish cotton at 260 GSM. Features a tight 1.2-inch ribbed collar that retains shape through dozens of washes, dropped shoulders, and a clean boxy drape. Zero transparency.',
      categoryId: 'cat-tshirts',
      categoryName: 'Heavyweight T-Shirts',
      gender: 'Unisex',
      price: 1950,
      salePrice: 1650,
      costPrice: 900,
      stock: 14,
      lowStockThreshold: 5,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: [
        { name: 'Vintage Chalk White', hex: '#F4F1EA' },
        { name: 'Faded Black', hex: '#1E1E1E' },
        { name: 'Muted Sage', hex: '#7D8471' },
      ],
      images: [
        '/src/assets/images/export_overstock_flatlay_1790699838766.jpg',
        '/src/assets/images/mens_collection_showcase_1790699804267.jpg',
      ],
      tags: ['Heavyweight', 'Boxy Tee', 'Everyday Essential', 'Export Quality'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      isLimitedStock: false,
      isSale: true,
      details: {
        fabric: '100% Combed Cotton Single Jersey (260 GSM)',
        fit: 'Modern Boxy Cut with Dropped Shoulders',
        care: 'Cold wash, tumble dry low or air dry',
        origin: 'American Streetwear Brand Overstock',
        exportBatchInfo: 'Standard export overrun surplus',
      },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'prod-004',
      name: 'Relaxed Japanese Selvedge Cotton Oxford',
      sku: 'AUR-SHT-OXF-04',
      slug: 'relaxed-japanese-selvedge-cotton-oxford',
      description: 'Cut from substantial 180 GSM pinpoint Oxford cloth with mother-of-pearl buttons and a soft unlined button-down collar. Washed for immediate broken-in softness without stiff chemical finishing.',
      categoryId: 'cat-shirts',
      categoryName: 'Casual & Oxford Shirts',
      gender: 'Men',
      price: 3650,
      salePrice: 2950,
      costPrice: 1600,
      stock: 8,
      lowStockThreshold: 4,
      sizes: ['M', 'L', 'XL'],
      colors: [
        { name: 'Sky Stripe', hex: '#B0C4DE' },
        { name: 'Crisp Ecru', hex: '#FAF0E6' },
      ],
      images: [
        '/src/assets/images/mens_collection_showcase_1790699804267.jpg',
        '/src/assets/images/store_boutique_interior_1790699826704.jpg',
      ],
      tags: ['Oxford Shirt', '100% Cotton', 'Office & Casual', 'Export Surplus'],
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      isLimitedStock: false,
      isSale: true,
      details: {
        fabric: '100% Long-Staple Cotton Pinpoint Oxford',
        fit: 'Relaxed Classic Fit',
        care: 'Warm wash, medium iron',
        origin: 'Japanese Retailer Export Leftover',
        exportBatchInfo: 'Batch #JP-229 / I-8 Markaz stock',
      },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'prod-005',
      name: 'Pleated Wide-Leg Wool-Touch Trousers',
      sku: 'AUR-PNT-PLT-05',
      slug: 'pleated-wide-leg-wool-touch-trousers',
      description: 'Single reverse front pleats with a fluid wide straight leg. Features elasticized rear waist inserts for comfort, deep slash pockets, and double back jetted pockets. Drapes cleanly over boots and sneakers.',
      categoryId: 'cat-pants',
      categoryName: 'Trousers & Chinos',
      gender: 'Unisex',
      price: 4200,
      salePrice: 3450,
      costPrice: 1900,
      stock: 3, // low stock test
      lowStockThreshold: 5,
      sizes: ['30', '32', '34', '36'],
      colors: [
        { name: 'Espresso Brown', hex: '#4A3728' },
        { name: 'Slate Gray', hex: '#4F5D75' },
      ],
      images: [
        '/src/assets/images/mens_collection_showcase_1790699804267.jpg',
        '/src/assets/images/womens_collection_showcase_1790699815876.jpg',
      ],
      tags: ['Pleated Trousers', 'Tailored Pants', 'Limited Stock'],
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      isLimitedStock: true,
      isSale: true,
      details: {
        fabric: 'Polyester-Rayon-Spandex blend with brushed wool handfeel',
        fit: 'High-Rise Wide Leg with Slight Break',
        care: 'Gentle wash 30C, hang to dry',
        origin: 'Italian Department Store Overstock',
        exportBatchInfo: 'Limited run of 12 trousers',
      },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'prod-006',
      name: 'Heavy French Terry Hooded Pullover (420 GSM)',
      sku: 'AUR-HD-FT-06',
      slug: 'heavy-french-terry-hooded-pullover',
      description: 'Substantial 420 GSM unbrushed loopback French terry hoody with double-layered crossover hood (no drawstrings for clean aesthetic) and ribbed side gussets for natural freedom of movement.',
      categoryId: 'cat-hoodies',
      categoryName: 'Hoodies & Sweatshirts',
      gender: 'Men',
      price: 4800,
      salePrice: 3950,
      costPrice: 2200,
      stock: 1, // urgently low stock!
      lowStockThreshold: 3,
      sizes: ['M', 'L'],
      colors: [
        { name: 'Washed Ash Grey', hex: '#9E9E9E' },
        { name: 'Pitch Black', hex: '#111111' },
      ],
      images: [
        '/src/assets/images/export_overstock_flatlay_1790699838766.jpg',
        '/src/assets/images/mens_collection_showcase_1790699804267.jpg',
      ],
      tags: ['Heavyweight Hoody', 'Loopback Terry', 'Only 1 Left'],
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      isLimitedStock: true,
      isSale: true,
      details: {
        fabric: '100% Organic Cotton French Terry (420 GSM)',
        fit: 'Oversized Boxy Silhouette',
        care: 'Cold water wash, flat dry to maintain loopback texture',
        origin: 'Canadian Streetwear Brand Surplus',
        exportBatchInfo: 'Only 1 unit remaining in Zakki Plaza showroom',
      },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'prod-007',
      name: 'Raw Indigo Straight-Cut Selvedge Denim',
      sku: 'AUR-DNM-SLV-07',
      slug: 'raw-indigo-straight-cut-selvedge-denim',
      description: '13.5 oz unwashed red-line selvedge denim milled on vintage shuttle looms. Features branded copper hardware, chain-stitched hem, and hidden back pocket rivets. Will develop unique personal fade patterns with wear.',
      categoryId: 'cat-denim',
      categoryName: 'Denim & Jeans',
      gender: 'Men',
      price: 5200,
      salePrice: 4250,
      costPrice: 2400,
      stock: 6,
      lowStockThreshold: 4,
      sizes: ['30x32', '32x32', '34x32', '36x32'],
      colors: [
        { name: 'Raw Deep Indigo', hex: '#1A2A3A' },
      ],
      images: [
        '/src/assets/images/export_overstock_flatlay_1790699838766.jpg',
        '/src/assets/images/hero_fashion_campaign_1790699788342.jpg',
      ],
      tags: ['Selvedge Denim', '13.5oz', 'Raw Indigo', 'Collector Piece'],
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      isLimitedStock: true,
      isSale: false,
      details: {
        fabric: '100% Selvedge Cotton Denim (13.5 oz)',
        fit: 'Classic Mid-Rise Straight Leg',
        care: 'Wear for 6 months before first wash, then cold soak inside-out',
        origin: 'American Heritage Export Overstock',
        exportBatchInfo: 'Imported in direct container consignment',
      },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'prod-008',
      name: 'Oversized Heavy Knit Turtleneck Sweater',
      sku: 'AUR-WMN-KNT-08',
      slug: 'oversized-heavy-knit-turtleneck-sweater',
      description: 'Chunky fisherman ribbed knit sweater featuring an exaggerated drop shoulder, folded turtleneck collar, and split side seams. Extremely warm yet breathable yarn for chilly winter evenings in Islamabad.',
      categoryId: 'cat-women',
      categoryName: "Women's Collection",
      gender: 'Women',
      price: 4950,
      salePrice: 3850,
      costPrice: 2100,
      stock: 5,
      lowStockThreshold: 4,
      sizes: ['S', 'M', 'L'],
      colors: [
        { name: 'Oatmeal Heather', hex: '#E0D8C3' },
        { name: 'Forest Moss', hex: '#3B4D3C' },
      ],
      images: [
        '/src/assets/images/womens_collection_showcase_1790699815876.jpg',
        '/src/assets/images/store_boutique_interior_1790699826704.jpg',
      ],
      tags: ['Knitwear', 'Turtleneck', 'Winter Essential', 'Export Surplus'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      isLimitedStock: false,
      isSale: true,
      details: {
        fabric: '70% Recycled Cotton, 30% Merino Blend',
        fit: 'Relaxed Slouchy Fit',
        care: 'Hand wash cold, dry flat only',
        origin: 'European Boutique Cancellation Order',
        exportBatchInfo: 'Purchased directly from factory leftover auction',
      },
      createdAt: now,
      updatedAt: now,
    },
  ];

  const customers: Customer[] = [
    {
      id: 'cust-001',
      name: 'Zaryab Khan',
      phone: '+92 300 5544123',
      email: 'zaryab.khan@gmail.com',
      city: 'Islamabad',
      province: 'Islamabad Capital Territory',
      address: 'House 42, Street 18, Sector F-8/3',
      postalCode: '44000',
      totalOrders: 3,
      totalSpent: 16500,
      lastOrderDate: '2026-09-22T14:30:00Z',
      isRegistered: true,
      notes: 'VIP customer. Frequently shops in I-8 Markaz Zakki Plaza store.',
      createdAt: '2026-06-10T10:00:00Z',
      updatedAt: '2026-09-22T14:30:00Z',
    },
    {
      id: 'cust-002',
      name: 'Ayesha Malik',
      phone: '+92 333 8765432',
      email: 'ayesha.malik@outlook.com',
      city: 'Rawalpindi',
      province: 'Punjab',
      address: 'Villa 12, Phase 4, Bahria Town',
      postalCode: '46000',
      totalOrders: 2,
      totalSpent: 10440,
      lastOrderDate: '2026-09-25T11:15:00Z',
      isRegistered: true,
      notes: 'Loves wool trench coats and winter knit drops.',
      createdAt: '2026-08-01T15:20:00Z',
      updatedAt: '2026-09-25T11:15:00Z',
    },
    {
      id: 'cust-003',
      name: 'Bilal Tariq',
      phone: '+92 321 9988776',
      email: 'bilal.tariq99@gmail.com',
      city: 'Lahore',
      province: 'Punjab',
      address: 'House 184-Y, Commercial Area, DHA Phase 3',
      postalCode: '54000',
      totalOrders: 1,
      totalSpent: 4850,
      lastOrderDate: '2026-09-28T09:00:00Z',
      isRegistered: false,
      notes: 'Prefers Bank Transfer with Meezan Raast payment.',
      createdAt: '2026-09-28T09:00:00Z',
      updatedAt: '2026-09-28T09:00:00Z',
    },
  ];

  const orders: Order[] = [
    {
      id: 'AURA-1001',
      customerId: 'cust-001',
      customerName: 'Zaryab Khan',
      customerPhone: '+92 300 5544123',
      customerEmail: 'zaryab.khan@gmail.com',
      shippingAddress: {
        fullName: 'Zaryab Khan',
        phone: '+92 300 5544123',
        email: 'zaryab.khan@gmail.com',
        address: 'House 42, Street 18, Sector F-8/3',
        city: 'Islamabad',
        province: 'Islamabad Capital Territory',
        postalCode: '44000',
        notes: 'Call before arriving at security gate.',
      },
      items: [
        {
          productId: 'prod-001',
          productName: 'Structured Canvas Chore Jacket',
          sku: 'AUR-JKT-001',
          image: '/src/assets/images/mens_collection_showcase_1790699804267.jpg',
          size: 'L',
          colorName: 'Washed Olive',
          colorHex: '#5B6652',
          quantity: 1,
          price: 4650,
          total: 4650,
        },
        {
          productId: 'prod-003',
          productName: 'Heavyweight Boxy Crewneck Tee (260 GSM)',
          sku: 'AUR-TEE-BOX-03',
          image: '/src/assets/images/export_overstock_flatlay_1790699838766.jpg',
          size: 'L',
          colorName: 'Vintage Chalk White',
          colorHex: '#F4F1EA',
          quantity: 2,
          price: 1650,
          total: 3300,
        },
      ],
      subtotal: 7950,
      discount: 0,
      deliveryFee: 0, // above threshold
      grandTotal: 7950,
      paymentMethod: 'cod',
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
      trackingNumber: 'TCS-90812234',
      customerNotes: 'Deliver between 3 PM and 6 PM.',
      adminNotes: 'Delivered successfully via TCS Express.',
      statusHistory: [
        { status: 'Pending', timestamp: '2026-09-20T10:00:00Z', note: 'Order placed by customer via Cash on Delivery' },
        { status: 'Confirmed', timestamp: '2026-09-20T11:30:00Z', note: 'Customer confirmed phone call verification' },
        { status: 'Processing', timestamp: '2026-09-20T14:00:00Z', note: 'Dispatched from I-8 Markaz Zakki Plaza store' },
        { status: 'Shipped', timestamp: '2026-09-21T09:00:00Z', note: 'TCS courier tracking #TCS-90812234 generated' },
        { status: 'Delivered', timestamp: '2026-09-22T14:30:00Z', note: 'Courier marked cash collected and delivered' },
      ],
      createdAt: '2026-09-20T10:00:00Z',
      updatedAt: '2026-09-22T14:30:00Z',
    },
    {
      id: 'AURA-1002',
      customerId: 'cust-002',
      customerName: 'Ayesha Malik',
      customerPhone: '+92 333 8765432',
      customerEmail: 'ayesha.malik@outlook.com',
      shippingAddress: {
        fullName: 'Ayesha Malik',
        phone: '+92 333 8765432',
        email: 'ayesha.malik@outlook.com',
        address: 'Villa 12, Phase 4, Bahria Town',
        city: 'Rawalpindi',
        province: 'Punjab',
        postalCode: '46000',
      },
      items: [
        {
          productId: 'prod-002',
          productName: 'Minimalist Belted Wool-Blend Trench',
          sku: 'AUR-WMN-TRN-02',
          image: '/src/assets/images/womens_collection_showcase_1790699815876.jpg',
          size: 'M',
          colorName: 'Camel Sand',
          colorHex: '#D2B48C',
          quantity: 1,
          price: 6490,
          total: 6490,
        },
      ],
      subtotal: 6490,
      discount: 500,
      couponCode: 'AURA500',
      deliveryFee: 0,
      grandTotal: 5990,
      paymentMethod: 'bank_transfer',
      paymentStatus: 'Paid',
      orderStatus: 'Processing',
      trackingNumber: 'LEO-773199',
      customerNotes: 'Paid via Meezan Raast, screenshot sent on WhatsApp.',
      adminNotes: 'Bank receipt verified by Accounts team.',
      statusHistory: [
        { status: 'Pending', timestamp: '2026-09-24T16:00:00Z', note: 'Order created via Bank Transfer' },
        { status: 'Confirmed', timestamp: '2026-09-24T17:10:00Z', note: 'WhatsApp payment confirmation verified' },
        { status: 'Processing', timestamp: '2026-09-25T11:15:00Z', note: 'Packed at I-8 Markaz showroom' },
      ],
      createdAt: '2026-09-24T16:00:00Z',
      updatedAt: '2026-09-25T11:15:00Z',
    },
    {
      id: 'AURA-1003',
      customerId: 'cust-003',
      customerName: 'Bilal Tariq',
      customerPhone: '+92 321 9988776',
      customerEmail: 'bilal.tariq99@gmail.com',
      shippingAddress: {
        fullName: 'Bilal Tariq',
        phone: '+92 321 9988776',
        email: 'bilal.tariq99@gmail.com',
        address: 'House 184-Y, Commercial Area, DHA Phase 3',
        city: 'Lahore',
        province: 'Punjab',
        postalCode: '54000',
      },
      items: [
        {
          productId: 'prod-006',
          productName: 'Heavy French Terry Hooded Pullover (420 GSM)',
          sku: 'AUR-HD-FT-06',
          image: '/src/assets/images/export_overstock_flatlay_1790699838766.jpg',
          size: 'L',
          colorName: 'Washed Ash Grey',
          colorHex: '#9E9E9E',
          quantity: 1,
          price: 3950,
          total: 3950,
        },
      ],
      subtotal: 3950,
      discount: 0,
      deliveryFee: 0,
      grandTotal: 3950,
      paymentMethod: 'cod',
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      customerNotes: 'Please dispatch before weekend.',
      adminNotes: 'Verification call pending.',
      statusHistory: [
        { status: 'Pending', timestamp: '2026-09-28T09:00:00Z', note: 'Order placed by customer via Cash on Delivery' },
      ],
      createdAt: '2026-09-28T09:00:00Z',
      updatedAt: '2026-09-28T09:00:00Z',
    },
  ];

  const coupons: Coupon[] = [
    {
      id: 'coup-001',
      code: 'AURA500',
      discountType: 'fixed',
      discountValue: 500,
      minOrderAmount: 3000,
      maxDiscount: 500,
      expiryDate: '2026-12-31',
      usageLimit: 200,
      usageCount: 14,
      isActive: true,
      createdAt: now,
    },
    {
      id: 'coup-002',
      code: 'FIRST10',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 2000,
      maxDiscount: 1000,
      expiryDate: '2026-12-31',
      usageLimit: 500,
      usageCount: 38,
      isActive: true,
      createdAt: now,
    },
  ];

  const reviews: Review[] = [
    {
      id: 'rev-001',
      productId: 'prod-001',
      productName: 'Structured Canvas Chore Jacket',
      customerName: 'Hamza Farooq',
      customerEmail: 'hamza.f@gmail.com',
      rating: 5,
      title: 'Legitimate export quality. Unbelievable price.',
      comment: 'I visited their Zakki Plaza store in I-8 Markaz after seeing this online. The canvas fabric is extremely heavy and stiff in a good way, identical to 200 Euro Scandinavian work jackets. Highly recommended!',
      isApproved: true,
      isFeatured: true,
      createdAt: '2026-09-18T12:00:00Z',
    },
    {
      id: 'rev-002',
      productId: 'prod-003',
      productName: 'Heavyweight Boxy Crewneck Tee (260 GSM)',
      customerName: 'Daniyal Sheikh',
      customerEmail: 'daniyal.s@yahoo.com',
      rating: 5,
      title: 'The best heavyweight collar in Pakistan',
      comment: 'Most local tees have loose collars after 2 washes. This 260 GSM export piece has a thick collar that stays flat. Will buy more colors before they run out.',
      isApproved: true,
      isFeatured: true,
      createdAt: '2026-09-21T16:45:00Z',
    },
    {
      id: 'rev-003',
      productId: 'prod-002',
      productName: 'Minimalist Belted Wool-Blend Trench',
      customerName: 'Sanam Qureshi',
      customerEmail: 'sanam.q@gmail.com',
      rating: 5,
      title: 'Elegant drape, luxury lining',
      comment: 'Ordered online for delivery to Lahore. Received within 3 days in pristine packaging. The camel color and tailoring look straight out of an editorial lookbook.',
      isApproved: true,
      isFeatured: true,
      createdAt: '2026-09-26T18:10:00Z',
    },
  ];

  const adminUsers = [
    {
      id: 'adm-001',
      name: 'Aura Store Owner',
      email: 'admin@auraapparel.pk',
      passwordHash: hashPassword('auraadmin2026'),
      role: 'super_admin' as const,
      createdAt: now,
    },
  ];

  return {
    products,
    categories,
    orders,
    customers,
    coupons,
    reviews,
    storeSettings,
    deliverySettings,
    paymentSettings,
    homepageCms,
    adminUsers,
    orderCounter: 1003,
  };
}

// -------------------------------------------------------------
// HELPER LOGIC FOR CUSTOMERS AND ORDERS (MANDATORY REQUIREMENT)
// -------------------------------------------------------------

export function findOrCreateCustomer(shippingInfo: {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  notes?: string;
}): Customer {
  const database = getDatabase();
  const normalizedEmail = shippingInfo.email.trim().toLowerCase();
  const normalizedPhone = shippingInfo.phone.replace(/[\s\-\(\)]/g, '');

  let customer = database.customers.find(
    (c) =>
      c.email.trim().toLowerCase() === normalizedEmail ||
      c.phone.replace(/[\s\-\(\)]/g, '') === normalizedPhone
  );

  const now = new Date().toISOString();

  if (customer) {
    // Update existing profile details
    customer.name = shippingInfo.fullName || customer.name;
    customer.address = shippingInfo.address || customer.address;
    customer.city = shippingInfo.city || customer.city;
    customer.province = shippingInfo.province || customer.province;
    if (shippingInfo.postalCode) customer.postalCode = shippingInfo.postalCode;
    customer.updatedAt = now;
  } else {
    // Create new customer profile
    customer = {
      id: `cust-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: shippingInfo.fullName,
      phone: shippingInfo.phone,
      email: shippingInfo.email,
      address: shippingInfo.address,
      city: shippingInfo.city,
      province: shippingInfo.province,
      postalCode: shippingInfo.postalCode || '',
      totalOrders: 0,
      totalSpent: 0,
      isRegistered: false,
      notes: shippingInfo.notes ? `Customer note: ${shippingInfo.notes}` : '',
      createdAt: now,
      updatedAt: now,
    };
    database.customers.unshift(customer);
  }

  saveDatabase();
  return customer;
}

export function createOrder(orderData: {
  customerInfo: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    province: string;
    postalCode?: string;
    notes?: string;
  };
  items: Array<{
    productId: string;
    size: string;
    color: { name: string; hex: string };
    quantity: number;
  }>;
  paymentMethod: 'cod' | 'bank_transfer' | 'manual';
  couponCode?: string;
}): Order {
  const database = getDatabase();

  // 1. Save or link Customer
  const customer = findOrCreateCustomer(orderData.customerInfo);

  // 2. Validate products and calculate totals
  let subtotal = 0;
  const orderItems: Order['items'] = [];

  for (const item of orderData.items) {
    const product = database.products.find((p) => p.id === item.productId);
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for "${product.name}". Remaining stock: ${product.stock}`);
    }

    const price = product.salePrice ?? product.price;
    const itemTotal = price * item.quantity;
    subtotal += itemTotal;

    // Decrement stock immediately (Mandatory Requirement)
    product.stock = Math.max(0, product.stock - item.quantity);
    if (product.stock <= product.lowStockThreshold) {
      product.isLimitedStock = true;
    }
    product.updatedAt = new Date().toISOString();

    orderItems.push({
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      image: product.images[0] || '',
      size: item.size,
      colorName: item.color.name,
      colorHex: item.color.hex,
      quantity: item.quantity,
      price: price,
      total: itemTotal,
    });
  }

  // 3. Discount calculation
  let discount = 0;
  if (orderData.couponCode) {
    const coupon = database.coupons.find(
      (c) => c.code.toUpperCase() === orderData.couponCode?.toUpperCase() && c.isActive
    );
    if (coupon && subtotal >= coupon.minOrderAmount) {
      if (coupon.discountType === 'percentage') {
        discount = Math.round((subtotal * coupon.discountValue) / 100);
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.discountValue;
      }
      coupon.usageCount += 1;
    }
  }

  // 4. Delivery calculation based on zones
  const isFreeDelivery = subtotal >= database.deliverySettings.freeShippingThreshold;
  let deliveryFee = isFreeDelivery ? 0 : database.deliverySettings.standardFee;

  const matchedZone = database.deliverySettings.zones.find(
    (z) => z.name.toLowerCase().includes(orderData.customerInfo.city.toLowerCase())
  );
  if (matchedZone && !isFreeDelivery) {
    deliveryFee = matchedZone.rate;
  }

  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

  // 5. Generate Order
  database.orderCounter += 1;
  const orderId = `AURA-${database.orderCounter}`;
  const now = new Date().toISOString();

  const newOrder: Order = {
    id: orderId,
    customerId: customer.id,
    customerName: orderData.customerInfo.fullName,
    customerPhone: orderData.customerInfo.phone,
    customerEmail: orderData.customerInfo.email,
    shippingAddress: {
      fullName: orderData.customerInfo.fullName,
      phone: orderData.customerInfo.phone,
      email: orderData.customerInfo.email,
      address: orderData.customerInfo.address,
      city: orderData.customerInfo.city,
      province: orderData.customerInfo.province,
      postalCode: orderData.customerInfo.postalCode,
      notes: orderData.customerInfo.notes,
    },
    items: orderItems,
    subtotal,
    discount,
    couponCode: orderData.couponCode,
    deliveryFee,
    grandTotal,
    paymentMethod: orderData.paymentMethod,
    paymentStatus: 'Pending',
    orderStatus: 'Pending',
    customerNotes: orderData.customerInfo.notes,
    statusHistory: [
      {
        status: 'Pending',
        timestamp: now,
        note: `Order placed online via ${orderData.paymentMethod.toUpperCase()}`,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  database.orders.unshift(newOrder);

  // 6. Update Customer metrics (Mandatory Requirement)
  customer.totalOrders += 1;
  customer.totalSpent += grandTotal;
  customer.lastOrderDate = now;
  customer.updatedAt = now;

  saveDatabase();
  return newOrder;
}

export function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  note?: string,
  trackingNumber?: string
): Order {
  const database = getDatabase();
  const order = database.orders.find((o) => o.id === orderId);
  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }

  const now = new Date().toISOString();
  order.orderStatus = newStatus;
  order.updatedAt = now;
  if (trackingNumber !== undefined) {
    order.trackingNumber = trackingNumber;
  }

  order.statusHistory.push({
    status: newStatus,
    timestamp: now,
    note: note || `Order status updated to ${newStatus}`,
  });

  saveDatabase();
  return order;
}

export function updatePaymentStatus(orderId: string, status: PaymentStatus): Order {
  const database = getDatabase();
  const order = database.orders.find((o) => o.id === orderId);
  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }
  order.paymentStatus = status;
  order.updatedAt = new Date().toISOString();
  saveDatabase();
  return order;
}

export function getAnalyticsSummary(): AnalyticsSummary {
  const database = getDatabase();
  const orders = database.orders;

  const totalSales = orders
    .filter((o) => o.orderStatus !== 'Cancelled' && o.orderStatus !== 'Returned')
    .reduce((sum, o) => sum + o.grandTotal, 0);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending').length;
  const completedOrders = orders.filter((o) => o.orderStatus === 'Delivered').length;

  const totalCustomers = database.customers.length;
  const totalProducts = database.products.length;
  const lowStockProducts = database.products.filter(
    (p) => p.stock > 0 && p.stock <= p.lowStockThreshold
  ).length;
  const outOfStockProducts = database.products.filter((p) => p.stock === 0).length;

  const todayStr = new Date().toISOString().slice(0, 10);
  const todaySales = orders
    .filter(
      (o) =>
        o.createdAt.startsWith(todayStr) &&
        o.orderStatus !== 'Cancelled' &&
        o.orderStatus !== 'Returned'
    )
    .reduce((sum, o) => sum + o.grandTotal, 0);

  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const monthlySales = orders
    .filter(
      (o) =>
        o.createdAt.startsWith(currentMonthStr) &&
        o.orderStatus !== 'Cancelled' &&
        o.orderStatus !== 'Returned'
    )
    .reduce((sum, o) => sum + o.grandTotal, 0);

  const validOrdersCount = orders.filter((o) => o.orderStatus !== 'Cancelled').length;
  const averageOrderValue = validOrdersCount > 0 ? Math.round(totalSales / validOrdersCount) : 0;

  // Group sales by day (last 7 days)
  const salesByDayMap = new Map<string, { sales: number; orders: number }>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().slice(0, 10);
    salesByDayMap.set(dateKey, { sales: 0, orders: 0 });
  }

  for (const o of orders) {
    if (o.orderStatus === 'Cancelled') continue;
    const dateKey = o.createdAt.slice(0, 10);
    if (salesByDayMap.has(dateKey)) {
      const current = salesByDayMap.get(dateKey)!;
      current.sales += o.grandTotal;
      current.orders += 1;
    }
  }

  const salesByDay = Array.from(salesByDayMap.entries()).map(([date, data]) => ({
    date,
    sales: data.sales,
    orders: data.orders,
  }));

  // Top products calculation
  const productSalesMap = new Map<string, { name: string; count: number; revenue: number; image: string }>();
  for (const o of orders) {
    if (o.orderStatus === 'Cancelled') continue;
    for (const item of o.items) {
      const existing = productSalesMap.get(item.productId) || {
        name: item.productName,
        count: 0,
        revenue: 0,
        image: item.image,
      };
      existing.count += item.quantity;
      existing.revenue += item.total;
      productSalesMap.set(item.productId, existing);
    }
  }

  const topProducts = Array.from(productSalesMap.entries())
    .map(([id, val]) => ({
      id,
      name: val.name,
      salesCount: val.count,
      revenue: val.revenue,
      image: val.image,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Category distribution
  const catMap = new Map<string, { count: number; revenue: number }>();
  for (const p of database.products) {
    const cat = database.categories.find((c) => c.id === p.categoryId)?.name || 'General';
    const existing = catMap.get(cat) || { count: 0, revenue: 0 };
    existing.count += 1;
    catMap.set(cat, existing);
  }

  const categoryDistribution = Array.from(catMap.entries()).map(([name, data]) => ({
    name,
    count: data.count,
    revenue: data.revenue,
  }));

  return {
    totalSales,
    totalOrders,
    pendingOrders,
    completedOrders,
    totalCustomers,
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
    todaySales,
    monthlySales,
    averageOrderValue,
    salesByDay,
    topProducts,
    categoryDistribution,
  };
}
