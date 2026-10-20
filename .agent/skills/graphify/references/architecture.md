# Aanur Textile — Codebase Architecture Reference

This reference documents the structural design, module interactions, and data contracts of the **Aanur Textile** eCommerce application (MERN Stack: MongoDB Atlas, Express, React 19, Node.js + Resend).

---

## 1. Directory Layout & Module Roles

```text
aanur-textile/
├── index.html                 # HTML shell mounting Vite and React
├── vite.config.js             # Vite configuration with Express middleware plugin
├── package.json               # Project manifest, scripts, and dependencies
├── .env                       # Environment configuration (MONGODB_URI, RESEND_API_KEY)
├── src/
│   ├── main.jsx               # React 19 bootstrap and DOM root mounting
│   ├── App.jsx                # Core single-file application shell, router, and UI components
│   ├── styles.css             # High-end bespoke typography, layout, and responsive CSS
│   └── data.js                # Fallback bedsheet catalog, categories, and store metadata
├── server/
│   ├── app.js                 # Express application & REST routes (/api/status, /api/products, /api/orders, /api/enquiries)
│   ├── api.js                 # API route dispatcher adapter
│   ├── db.js                  # MongoDB Atlas connection manager (Mongoose)
│   ├── email.js               # Resend transactional email generator and dispatcher
│   ├── server.js              # Standalone Node.js server launcher
│   └── models/
│       ├── Product.js         # Mongoose schema for bedsheets & variants
│       ├── Order.js           # Mongoose schema for customer orders & items
│       └── Enquiry.js         # Mongoose schema for contact messages
├── scripts/
│   ├── seed-mongo.js          # Database seed script for MongoDB Atlas
│   ├── check-mongo.js         # MongoDB Atlas connectivity & document count verification
│   ├── test-api.js            # Express API test runner
│   └── test-email.js          # Resend email notification test runner
├── resend-mcp/                # Resend Model Context Protocol server (TypeScript submodule)
├── graphify-out/              # Compiled Graphify knowledge graph outputs
└── .agents/                   # Antigravity agent configuration, rules, and skills
```

---

## 2. Component Hierarchy in `src/App.jsx`

All UI views and interactive states are managed within `src/App.jsx`:

| Component | Responsibility | Triggers / Events |
|---|---|---|
| `App` | Root container, handles `window.history` pushState routing, cart, wishlist, and toast state | `navigate()`, `setCart()`, `setWishlist()` |
| `Icon` | Inline SVG renderer for standard interface icons | Vector rendering |
| `SectionTitle` | Reusable section header with eyebrow, title, and subtitle text | UI presentation |
| `ProductCard` | Product display tile showing badge, price, quick-view, and wishlist buttons | `onAdd()`, `onWish()`, `onQuick()` |
| `ProductGrid` | Responsive grid wrapper rendering collections of `ProductCard` | Product catalog layouts |
| `Home` | Landing page featuring hero, category carousel, featured products, and factory story | Navigates to catalog or product |
| `FilterOptions` | Category, material, size, and price filter bar | Modifies active filter state |
| `Catalog` | Full product collection view with sorting, search, and filtering | Filters products |
| `ProductDetail` | Single-item showcase with size selection, color swatches, and GSAP image zoom | Adds item to cart with selected options |
| `QuickView` | Modal overlay for fast inspection of product details without navigating | Modal preview |
| `CartPage` | Line-item manager with quantity steppers, subtotal calculations, and secret coupon inputs | Navigates to `/checkout` |
| `Checkout` | Multi-step shipping and payment form; posts orders to `/api/orders` | Dispatches POST to `/api/orders` |
| `WishlistPage` | Saved favorites view with instant "Move to Bag" capability | Manipulates wishlist |
| `AuthPage` / `AccountPage` | Mock authentication and customer profile views | User authentication demo |
| `OrdersPage` / `OrderDetail` | Customer order history and order tracking views | Order status tracking |
| `AboutPage` | Brand narrative and textile heritage of Nathakadaiyur, Tamil Nadu | Information page |
| `ContactPage` | Customer support contact form posting to `/api/enquiries` | Dispatches POST to `/api/enquiries` |
| `FaqPage` | Accordion answering common bedsheet care and shipping questions | FAQ display |
| `Footer` | Site footer with quick links, newsletter signup, and contact info | Navigation footer |

---

## 3. Server API Routes (`server/app.js`)

Integrated into Vite via `expressPlugin()` in `vite.config.js`:

### `GET /api/status`
- **Purpose:** Verifies connection to MongoDB Atlas and checks if Resend API key is present.
- **Output:**
  ```json
  {
    "configured": true,
    "stack": "MERN",
    "database": "aanur_textile",
    "counts": { "products": 10, "orders": 3, "enquiries": 1 },
    "resendConfigured": true
  }
  ```
- **Fallback:** If `MONGODB_URI` is unconfigured, returns `{ "configured": false, "stack": "MERN", "message": "..." }`.

### `GET /api/products`
- **Purpose:** Fetches all active products from MongoDB Atlas `products` collection via `Product.find()`.
- **Fallback:** If database is unconfigured or empty, transparently falls back to `src/data.js` static products.

### `POST /api/orders`
- **Payload:** Customer info, shipping address, line items (`items` array), total amount.
- **Actions:**
  1. Inserts document into MongoDB `orders` collection with a unique `order_ref` (e.g. `AANUR-123456`).
  2. Calls `sendOrderEmail(order)` from `server/email.js` to dispatch an HTML confirmation email.
  3. Returns `{ "success": true, "orderRef": "...", "emailSent": true/false }`.

### `POST /api/enquiries`
- **Payload:** `name`, `email`, `topic`, `message`.
- **Actions:**
  1. Inserts into `enquiries` collection in MongoDB Atlas.
  2. Returns `{ "success": true, "id": "..." }`.

---

## 4. MongoDB Atlas Mongoose Schemas (`server/models/`)

### Products Collection (`server/models/Product.js`)
- `id`: String (unique identifier)
- `name`: String
- `category`: String
- `price`: Number
- `originalPrice`: Number
- `badge`: String
- `material`: String
- `sizes`: [String]
- `colors`: [String]
- `colorNames`: [String]
- `image`: String
- `images`: [String]
- `variants`: Array
- `description`: String

### Orders Collection (`server/models/Order.js`)
- `order_ref`: String (unique)
- `first_name`: String
- `last_name`: String
- `email`: String
- `phone`: String
- `street`: String
- `city`: String
- `postal_code`: String
- `total_amount`: Number
- `delivery_status`: String
- `payment_method`: String
- `items`: Array
- `createdAt`: Date

### Enquiries Collection (`server/models/Enquiry.js`)
- `name`: String
- `email`: String
- `topic`: String
- `message`: String
- `status`: String
- `createdAt`: Date
