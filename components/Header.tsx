'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartProvider';
import { useState } from 'react';

export function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = (href: string) =>
    `header-nav-link${pathname === href ? ' active' : ''}`;

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="header-logo">
          Ember<span>.</span>
        </Link>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav className={`header-nav${menuOpen ? ' open' : ''}`}>
          <Link
            href="/shop"
            className={linkClass('/shop')}
            onClick={() => setMenuOpen(false)}
          >
            Shop
          </Link>
          <Link
            href="/about"
            className={linkClass('/about')}
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/cart"
            className={`cart-link${pathname === '/cart' ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Cart
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
