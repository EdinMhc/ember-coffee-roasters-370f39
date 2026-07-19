import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';

interface CoffeeCardProps {
  product: Product;
}

export function CoffeeCard({ product }: CoffeeCardProps) {
  const notes = product.tasting_notes.split(',').slice(0, 2).join(', ');

  return (
    <Link href={`/shop/${product.slug}`} className="coffee-card">
      <div className="coffee-card-image">
        <Image
          src={product.image_url}
          alt={product.name}
          width={600}
          height={450}
          sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
        />
      </div>
      <div className="coffee-card-body">
        <p className="coffee-card-origin">{product.origin}</p>
        <h3 className="coffee-card-name">{product.name}</h3>
        <p className="coffee-card-notes">{notes}</p>
        <div className="coffee-card-footer">
          <span className="coffee-card-price">
            &euro;{product.price.toFixed(2)}
          </span>
          <span className="coffee-card-roast">{product.roast_level} roast</span>
        </div>
      </div>
    </Link>
  );
}
