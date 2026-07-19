import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductBySlug, getAllProducts } from '@/lib/products';
import { AddToCartForm } from './AddToCartForm';

interface ProductPageProps {
  params: { id: string };
}

export function generateStaticParams() {
  const products = getAllProducts();
  return products.map((p) => ({ id: p.slug }));
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="product-detail">
      <div className="container">
        <Link href="/shop" className="back-link">
          &larr; Back to Shop
        </Link>
        <div className="product-detail-grid">
          <div className="product-detail-image">
            <Image
              src={product.image_url}
              alt={product.name}
              width={800}
              height={800}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="product-detail-info">
            <p className="product-detail-origin">{product.origin}</p>
            <h1 className="product-detail-name">{product.name}</h1>
            <p className="product-detail-price">
              &euro;{product.price.toFixed(2)}
            </p>

            <div className="product-detail-badges">
              <span className="badge">{product.roast_level} roast</span>
              {product.tasting_notes.split(',').map((note) => (
                <span key={note.trim()} className="badge">
                  {note.trim()}
                </span>
              ))}
            </div>

            <p className="product-detail-description">
              {product.description}
            </p>

            <AddToCartForm product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
