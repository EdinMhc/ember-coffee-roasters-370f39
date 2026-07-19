import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/products';

export async function GET() {
  try {
    const products = getAllProducts();
    return NextResponse.json(products);
  } catch (err) {
    console.error('Failed to fetch products:', err);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
