import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/products';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { shipping, items, subtotal, shipping_cost, total } = body;

    // Basic validation
    if (!shipping || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: shipping and items.' },
        { status: 400 }
      );
    }

    const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'postal_code', 'country'];
    for (const field of requiredFields) {
      if (!shipping[field] || !String(shipping[field]).trim()) {
        return NextResponse.json(
          { error: `Shipping field "${field}" is required.` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shipping.email)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      );
    }

    // Validate each line item
    for (const item of items) {
      if (!item.product_id || !item.quantity || !item.grind || !item.unit_price) {
        return NextResponse.json(
          { error: 'Each line item must have product_id, quantity, grind, and unit_price.' },
          { status: 400 }
        );
      }
      if (typeof item.quantity !== 'number' || item.quantity < 1) {
        return NextResponse.json(
          { error: 'Item quantity must be a positive number.' },
          { status: 400 }
        );
      }
      if (!['whole-bean', 'filter', 'espresso'].includes(item.grind)) {
        return NextResponse.json(
          { error: 'Invalid grind type.' },
          { status: 400 }
        );
      }
    }

    const order = createOrder({
      shipping,
      line_items: items,
      subtotal,
      shipping_cost,
      total,
    });

    return NextResponse.json(
      {
        order_number: order.order_number,
        id: order.id,
        total: order.total,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Failed to create order:', err);
    return NextResponse.json(
      { error: 'Failed to create order. Please try again.' },
      { status: 500 }
    );
  }
}
