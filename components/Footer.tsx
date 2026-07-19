import Link from 'next/link';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          Ember<span>.</span> Coffee Roasters
        </div>
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Ember Coffee Roasters. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
