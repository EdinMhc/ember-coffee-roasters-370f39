import Link from 'next/link';
import { getAllProducts } from '@/lib/products';
import { CoffeeCard } from '@/components/CoffeeCard';

export default function HomePage() {
  const products = getAllProducts();
  // Feature the first, third, and last product for variety
  const featured = [products[0], products[2], products[5]];

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-tagline">
            Roasted in small batches. Shipped within 48 hours.
          </h1>
          <p className="hero-sub">
            Every bean we source is a direct relationship with growers who care
            as much about quality as we do. No shortcuts, no compromises — just
            exceptional coffee, delivered fresh to your door.
          </p>
          <Link href="/shop" className="btn btn-primary">
            Browse Our Coffees
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="page-section">
        <div className="container">
          <p className="section-label">This Month&rsquo;s Highlights</p>
          <h2 className="section-title">Featured Coffees</h2>
          <div className="featured-grid">
            {featured.map((product) => (
              <CoffeeCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Our Roast */}
      <section className="roast-section page-section">
        <div className="container">
          <div className="roast-grid">
            <div className="roast-text">
              <p className="section-label">Our Process</p>
              <h2>
                Every batch is roasted by hand on our vintage 15-kilo
                Probat.
              </h2>
              <p>
                We roast four days a week in our Hamburg roastery, working in
                small lots so every bean gets the attention it deserves. Our
                head roaster, Mira, has spent over a decade dialling in profiles
                that honour each origin&rsquo;s character — from the bright,
                tea-like delicacy of a washed Yirgacheffe to the deep, earthy
                intensity of a Sumatran Mandheling.
              </p>
              <p>
                Within 48 hours of roasting, your coffee is in a
                compostable kraft bag and on its way to you. Peak freshness
                isn&rsquo;t a promise — it&rsquo;s a process.
              </p>
              <div className="roast-stats">
                <div className="roast-stat">
                  <div className="roast-stat-number">4&times;</div>
                  <div className="roast-stat-label">Roast Days / Week</div>
                </div>
                <div className="roast-stat">
                  <div className="roast-stat-number">15 kg</div>
                  <div className="roast-stat-label">Batch Size</div>
                </div>
                <div className="roast-stat">
                  <div className="roast-stat-number">48 h</div>
                  <div className="roast-stat-label">To Your Door</div>
                </div>
              </div>
            </div>
            <div className="about-story-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=600&q=80&auto=format&fit=crop"
                alt="Hands sorting green coffee beans at Ember roastery"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="page-section" style={{ textAlign: 'center' }}>
        <div className="container">
          <p className="section-label">Ready to taste the difference?</p>
          <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
            Explore all six origins
          </h2>
          <Link href="/shop" className="btn btn-primary">
            View Full Collection
          </Link>
        </div>
      </section>
    </>
  );
}
