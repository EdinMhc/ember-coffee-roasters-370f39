import { getAllProducts } from '@/lib/products';
import { CoffeeCard } from '@/components/CoffeeCard';

export default function ShopPage() {
  const products = getAllProducts();

  return (
    <>
      <div className="shop-header">
        <div className="container">
          <p className="section-label">Our Collection</p>
          <h1>Single-Origin Coffees</h1>
          <p>
            Six origins, each roasted to bring out what makes it remarkable.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="shop-grid">
          {products.map((product) => (
            <CoffeeCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
