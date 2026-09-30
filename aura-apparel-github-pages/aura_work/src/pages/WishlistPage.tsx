import React from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { ProductCard } from '../components/ui/ProductCard.tsx';
import { Heart, ArrowRight } from 'lucide-react';

interface WishlistPageProps {
  onNavigateToShop: () => void;
  onSelectProduct: (slugOrId: string) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  onNavigateToShop,
  onSelectProduct,
}) => {
  const { wishlist } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-neutral-200 pb-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Saved Articles
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
            My Wishlist ({wishlist.length})
          </h1>
        </div>
        <button
          onClick={onNavigateToShop}
          className="text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:text-neutral-600 flex items-center gap-1.5"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white p-16 rounded border border-neutral-200 text-center space-y-4">
          <Heart className="w-12 h-12 text-neutral-300 mx-auto" />
          <h2 className="font-display text-xl font-bold text-neutral-800">Your Wishlist is Empty</h2>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Save limited export pieces, Scandinavian jackets, and knitwear to review later or order before lots run out.
          </p>
          <button
            onClick={onNavigateToShop}
            className="px-6 py-2.5 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
