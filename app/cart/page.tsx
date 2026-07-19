'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/CartProvider';
import type { CartItem } from '@/types';

const GRIND_LABELS: Record<CartItem['grind'], string> = {
  'whole-bean': 'Whole Bean',
  filter: 'Filter',
  espresso: 'Espresso',
};

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, shipping, total, itemCount } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <h2>Your cart is empty</h2>
            <p>
              Looks like you haven&rsquo;t added any coffee yet. Browse our
              collection and find your next favourite roast.
            </p>
            <Link href="/shop" className="btn btn-primary">
              Browse Coffees
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Your Cart ({itemCount})</h1>

        <div className="cart-layout">
          {/* Line items */}
          <div className="cart-items">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.grind}`}
                className="cart-item"
              >
                <div className="cart-item-image">
                  <Image
                    src={item.product.image_url}
                    alt={item.product.name}
                    width={80}
                    height={80}
                  />
                </div>

                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.product.name}</h3>
                  <p className="cart-item-meta">
                    {GRIND_LABELS[item.grind]} &middot; {item.product.roast_level}{' '}
                    roast
                  </p>
                </div>

                <div className="cart-item-actions">
                  <div className="quantity-control">
                    <button
                      className="quantity-btn"
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.grind,
                          item.quantity - 1
                        )
                      }
                      aria-label="Decrease quantity"
                    >
                      &minus;
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.grind,
                          item.quantity + 1
                        )
                      }
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <span className="cart-item-price">
                    &euro;{(item.product.price * item.quantity).toFixed(2)}
                  </span>

                  <button
                    className="btn btn-danger"
                    onClick={() => removeItem(item.product.id, item.grind)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>&euro;{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>
                {shipping === 0 ? (
                  <span className="free">Free</span>
                ) : (
                  <>&euro;{shipping.toFixed(2)}</>
                )}
              </span>
            </div>
            {shipping > 0 && (
              <div className="summary-row" style={{ fontSize: '0.78rem' }}>
                <span></span>
                <span>Free over &euro;40.00</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Total</span>
              <span>&euro;{total.toFixed(2)}</span>
            </div>

            <Link href="/checkout" className="btn btn-primary btn-full">
              Proceed to Checkout
            </Link>

            <Link
              href="/shop"
              className="btn btn-ghost btn-full"
              style={{ marginTop: '0.75rem' }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
