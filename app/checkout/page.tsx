'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import type { ShippingInfo } from '@/types';

const GRIND_LABELS: Record<string, string> = {
  'whole-bean': 'Whole Bean',
  filter: 'Filter',
  espresso: 'Espresso',
};

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shipping, total, clearCart } = useCart();

  const [form, setForm] = useState<ShippingInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'Deutschland',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <h2>Your cart is empty</h2>
            <p>Add some coffee before checking out.</p>
            <Link href="/shop" className="btn btn-primary">
              Browse Coffees
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (field: keyof ShippingInfo, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const e: FormErrors = {};

    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.email.trim()) {
      e.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Please enter a valid email address.';
    }
    if (!form.phone.trim()) e.phone = 'Phone number is required.';
    if (!form.address.trim()) e.address = 'Address is required.';
    if (!form.city.trim()) e.city = 'City is required.';
    if (!form.postal_code.trim()) e.postal_code = 'Postal code is required.';
    if (!form.country.trim()) e.country = 'Country is required.';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipping: form,
          items: items.map((i) => ({
            product_id: i.product.id,
            product_name: i.product.name,
            quantity: i.quantity,
            grind: i.grind,
            unit_price: i.product.price,
          })),
          subtotal,
          shipping_cost: shipping,
          total,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong.');
      }

      const order = await res.json();
      clearCart();
      router.push(`/checkout/confirmation?order=${order.order_number}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred.';
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        <div className="checkout-layout">
          {/* Form */}
          <form className="checkout-form" onSubmit={handleSubmit} noValidate>
            {submitError && (
              <div
                style={{
                  background: 'rgba(196,75,75,0.12)',
                  border: '1px solid var(--color-error)',
                  borderRadius: 'var(--radius)',
                  padding: '1rem',
                  color: 'var(--color-error)',
                  fontSize: '0.9rem',
                }}
              >
                {submitError}
              </div>
            )}

            {/* Contact */}
            <div className="form-section">
              <h2>Contact Information</h2>
              <div className="form-row">
                <FormField
                  label="Full Name"
                  value={form.name}
                  onChange={(v) => handleChange('name', v)}
                  error={errors.name}
                  required
                />
                <FormField
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(v) => handleChange('email', v)}
                  error={errors.email}
                  required
                />
                <FormField
                  label="Phone"
                  type="tel"
                  value={form.phone}
                  onChange={(v) => handleChange('phone', v)}
                  error={errors.phone}
                  required
                />
              </div>
            </div>

            {/* Shipping */}
            <div className="form-section">
              <h2>Shipping Address</h2>
              <div className="form-row">
                <FormField
                  label="Street Address"
                  className="full"
                  value={form.address}
                  onChange={(v) => handleChange('address', v)}
                  error={errors.address}
                  required
                />
                <FormField
                  label="City"
                  value={form.city}
                  onChange={(v) => handleChange('city', v)}
                  error={errors.city}
                  required
                />
                <FormField
                  label="Postal Code"
                  value={form.postal_code}
                  onChange={(v) => handleChange('postal_code', v)}
                  error={errors.postal_code}
                  required
                />
                <FormField
                  label="Country"
                  value={form.country}
                  onChange={(v) => handleChange('country', v)}
                  error={errors.country}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={submitting}
            >
              {submitting ? 'Placing order...' : 'Place Order'}
            </button>
          </form>

          {/* Order summary panel */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="order-summary-items">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.grind}`}
                  className="order-summary-item"
                >
                  <span>
                    {item.quantity}&times; {item.product.name} (
                    {GRIND_LABELS[item.grind]})
                  </span>
                  <span>
                    &euro;{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
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
            <div className="summary-row total">
              <span>Total</span>
              <span>&euro;{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  type = 'text',
  value,
  onChange,
  error,
  required,
  className,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={`form-field${className ? ' ' + className : ''}`}>
      <label>
        {label}
        {required && ' *'}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? 'error' : ''}
      />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
