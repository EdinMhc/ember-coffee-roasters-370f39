import { getDb } from './db';
import type { Product, Order, OrderLineItem, ShippingInfo } from '@/types';

export function getAllProducts(): Product[] {
  const db = getDb();
  return db.prepare('SELECT * FROM products ORDER BY id').all() as Product[];
}

export function getProductBySlug(slug: string): Product | undefined {
  const db = getDb();
  return db
    .prepare('SELECT * FROM products WHERE slug = ?')
    .get(slug) as Product | undefined;
}

export function getProductById(id: number): Product | undefined {
  const db = getDb();
  return db
    .prepare('SELECT * FROM products WHERE id = ?')
    .get(id) as Product | undefined;
}

export interface CreateOrderInput {
  shipping: ShippingInfo;
  line_items: Omit<OrderLineItem, 'product_id'> & { product_id: number }[];
  subtotal: number;
  shipping_cost: number;
  total: number;
}

export function createOrder(input: CreateOrderInput): Order {
  const db = getDb();
  const orderNumber = generateOrderNumber();

  const insertOrder = db.prepare(`
    INSERT INTO orders (order_number, contact_name, email, phone, address, city, postal_code, country, subtotal, shipping, total)
    VALUES (@order_number, @contact_name, @email, @phone, @address, @city, @postal_code, @country, @subtotal, @shipping, @total)
  `);

  const insertLineItem = db.prepare(`
    INSERT INTO order_line_items (order_id, product_id, product_name, quantity, grind, unit_price)
    VALUES (@order_id, @product_id, @product_name, @quantity, @grind, @unit_price)
  `);

  const create = db.transaction(() => {
    const result = insertOrder.run({
      order_number: orderNumber,
      contact_name: input.shipping.name,
      email: input.shipping.email,
      phone: input.shipping.phone,
      address: input.shipping.address,
      city: input.shipping.city,
      postal_code: input.shipping.postal_code,
      country: input.shipping.country,
      subtotal: input.subtotal,
      shipping: input.shipping_cost,
      total: input.total,
    });

    const orderId = result.lastInsertRowid as number;

    for (const item of input.line_items) {
      insertLineItem.run({
        order_id: orderId,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        grind: item.grind,
        unit_price: item.unit_price,
      });
    }

    return orderId;
  });

  const orderId = create();

  const order = db
    .prepare('SELECT * FROM orders WHERE id = ?')
    .get(orderId) as Order;

  const lineItems = db
    .prepare('SELECT * FROM order_line_items WHERE order_id = ?')
    .all(orderId) as OrderLineItem[];

  return { ...order, line_items: lineItems };
}

function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const seq = Math.floor(Math.random() * 9000) + 1000;
  return `EMB-${year}-${seq}`;
}
