import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'ember-coffee.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  initSchema(db);
  seedProducts(db);

  return db;
}

function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      origin TEXT NOT NULL,
      price REAL NOT NULL,
      roast_level TEXT NOT NULL,
      tasting_notes TEXT NOT NULL,
      image_url TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT NOT NULL UNIQUE,
      contact_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      postal_code TEXT NOT NULL,
      country TEXT NOT NULL DEFAULT 'Deutschland',
      subtotal REAL NOT NULL,
      shipping REAL NOT NULL,
      total REAL NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS order_line_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      grind TEXT NOT NULL DEFAULT 'whole-bean',
      unit_price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    );
  `);
}

function seedProducts(db: Database.Database): void {
  const count = db.prepare('SELECT COUNT(*) as count FROM products').get() as {
    count: number;
  };

  if (count.count > 0) return;

  const insert = db.prepare(`
    INSERT INTO products (name, slug, origin, price, roast_level, tasting_notes, image_url, description)
    VALUES (@name, @slug, @origin, @price, @roast_level, @tasting_notes, @image_url, @description)
  `);

  const products = [
    {
      name: 'Ethiopia Yirgacheffe',
      slug: 'ethiopia-yirgacheffe',
      origin: 'Yirgacheffe, Ethiopia',
      price: 18.5,
      roast_level: 'Light',
      tasting_notes: 'Jasmine, bergamot, stone fruit',
      image_url:
        'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80&auto=format&fit=crop',
      description:
        'Grown in the highlands of Yirgacheffe at elevations between 1,750 and 2,200 metres, this washed Ethiopian coffee delivers a brilliantly clean cup. Expect a tea-like body with soaring floral aromatics and a bright, citrus finish that lingers long after the last sip.',
    },
    {
      name: 'Colombia Huila',
      slug: 'colombia-huila',
      origin: 'Huila, Colombia',
      price: 16.0,
      roast_level: 'Medium',
      tasting_notes: 'Caramel, red apple, cocoa nib',
      image_url:
        'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=800&q=80&auto=format&fit=crop',
      description:
        'Sourced from smallholder producers in the volcanic soils of Huila, this Colombian lot is sun-dried on raised beds and meticulously sorted. The cup is balanced and sweet with the crisp acidity of a fresh red apple, rounded out by buttery caramel and a whisper of cocoa.',
    },
    {
      name: 'Guatemala Antigua',
      slug: 'guatemala-antigua',
      origin: 'Antigua, Guatemala',
      price: 17.0,
      roast_level: 'Medium',
      tasting_notes: 'Dark chocolate, orange peel, almond',
      image_url:
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80&auto=format&fit=crop',
      description:
        'Antigua\'s mineral-rich volcanic soil and cool nights produce a coffee of remarkable depth. This fully washed Bourbon and Caturra lot offers a velvety body with deep dark chocolate notes, brightened by candied orange peel and a gentle almond finish.',
    },
    {
      name: 'Brazil Cerrado',
      slug: 'brazil-cerrado',
      origin: 'Cerrado Mineiro, Brazil',
      price: 14.5,
      roast_level: 'Medium-Dark',
      tasting_notes: 'Hazelnut, milk chocolate, brown sugar',
      image_url:
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=800&q=80&auto=format&fit=crop',
      description:
        'From the vast Cerrado savannah, this natural-processed Brazilian coffee is sun-dried on expansive patios. Low in acidity and heavy in body, it\'s our go-to for espresso — creamy, nutty, and reminiscent of melted milk chocolate stirred with brown sugar.',
    },
    {
      name: 'Sumatra Mandheling',
      slug: 'sumatra-mandheling',
      origin: 'Lintong, Sumatra',
      price: 19.0,
      roast_level: 'Dark',
      tasting_notes: 'Cedar, molasses, black pepper',
      image_url:
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80&auto=format&fit=crop',
      description:
        'Processed using the unique Indonesian wet-hull method, this Mandheling is bold, earthy, and unapologetically full-bodied. The cup opens with aromatic cedar and sweet molasses before a surprising black-pepper spice cuts through — a favourite for those who take their coffee dark.',
    },
    {
      name: 'Kenya Nyeri AA',
      slug: 'kenya-nyeri-aa',
      origin: 'Nyeri, Kenya',
      price: 22.0,
      roast_level: 'Light-Medium',
      tasting_notes: 'Blackcurrant, grapefruit, brown sugar',
      image_url:
        'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=800&q=80&auto=format&fit=crop',
      description:
        'AA is the largest screen size in Kenya, and this Nyeri lot lives up to its grade. Grown by members of a cooperative wet mill on the slopes of Mount Kenya, it bursts with the bold, juicy acidity of ripe blackcurrant and pink grapefruit, balanced by a lingering brown-sugar sweetness.',
    },
  ];

  const insertMany = db.transaction(() => {
    for (const p of products) {
      insert.run(p);
    }
  });

  insertMany();
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}
