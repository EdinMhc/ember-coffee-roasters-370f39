'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import type { Product, CartItem } from '@/types';

interface AddToCartFormProps {
  product: Product;
}

export function AddToCartForm({ product }: AddToCartFormProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [grind, setGrind] = useState<CartItem['grind']>('whole-bean');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const grindOptions: { value: CartItem['grind']; label: string }[] = [
    { value: 'whole-bean', label: 'Whole Bean' },
    { value: 'filter', label: 'Filter' },
    { value: 'espresso', label: 'Espresso' },
  ];

  const handleAdd = () => {
    addItem(product, quantity, grind);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, quantity, grind);
    router.push('/cart');
  };

  return (
    <>
      {/* Grind selector */}
      <div className="selector-group">
        <span className="selector-label">Grind</span>
        <div className="selector-options">
          {grindOptions.map((opt) => (
            <button
              key={opt.value}
              className={`selector-option${grind === opt.value ? ' selected' : ''}`}
              onClick={() => setGrind(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div className="selector-group">
        <span className="selector-label">Quantity</span>
        <div className="quantity-control">
          <button
            className="quantity-btn"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            aria-label="Decrease quantity"
          >
            &minus;
          </button>
          <span className="quantity-value">{quantity}</span>
          <button
            className="quantity-btn"
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
        <button className="btn btn-primary" onClick={handleAdd}>
          {added ? 'Added!' : 'Add to Cart'} &mdash; &euro;
          {(product.price * quantity).toFixed(2)}
        </button>
        <button className="btn btn-secondary" onClick={handleBuyNow}>
          Buy Now
        </button>
      </div>
    </>
  );
}
