import Link from 'next/link';

interface ConfirmationPageProps {
  searchParams: { order?: string };
}

export default function ConfirmationPage({
  searchParams,
}: ConfirmationPageProps) {
  const orderNumber = searchParams.order || 'EMB-0000-0000';

  return (
    <div className="cart-page">
      <div className="container">
        <div className="confirmation">
          <div className="confirmation-icon">&#10003;</div>
          <h1>Order Confirmed</h1>
          <p className="confirmation-number">{orderNumber}</p>
          <p>
            Thank you for your order. We&rsquo;ll roast your coffee fresh and
            have it on its way to you within 48 hours. You&rsquo;ll receive a
            confirmation email shortly with all the details.
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-cream-dim)' }}>
            If you have any questions, reach out to us at{' '}
            <a
              href="mailto:hello@embercoffee.de"
              style={{ color: 'var(--color-amber)' }}
            >
              hello@embercoffee.de
            </a>
            .
          </p>
          <Link href="/shop" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
