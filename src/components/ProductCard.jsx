import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { resolveImageUrl } from "../api/api";

function isNewProduct(createdAt) {
  if (!createdAt) return false;
  const days = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return days <= 14;
}

export default function ProductCard({ product }) {
  const { basePath } = useStore();
  const navigate = useNavigate();
  const wishlist = useWishlist();
  const cart = useCart();

  const firstVariant = product.variants?.[0];
  const price = firstVariant ? Number(firstVariant.sale_price || firstVariant.regular_price) : 0;
  const regularPrice = firstVariant ? Number(firstVariant.regular_price) : 0;
  const onSale = firstVariant?.sale_price && Number(firstVariant.sale_price) < regularPrice;
  const discountPercent = onSale ? Math.round(((regularPrice - price) / regularPrice) * 100) : 0;
  const isNew = isNewProduct(product.created_at);
  const wishlisted = wishlist?.isWishlisted(product.id);

  function handleWishlistClick(e) {
    e.preventDefault();
    e.stopPropagation();
    wishlist?.toggleWishlist(product);
  }

  function handleQuickAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    if (firstVariant) {
      cart?.addItem(firstVariant, product, 1);
      navigate(`${basePath}/cart`);
    }
  }

  return (
    <Link to={`${basePath}/products/${product.id}`} className="product-card">
      <div className="product-card-image">
        {firstVariant?.image_url ? (
          <img src={resolveImageUrl(firstVariant.image_url)} alt={product.name} />
        ) : (
          <div className="product-card-placeholder">{product.name.slice(0, 1)}</div>
        )}

        <div className="product-card-badges">
          {isNew && <span className="badge-new">NEW</span>}
          {onSale && <span className="badge-sale">-{discountPercent}%</span>}
        </div>

        <button
          className={wishlisted ? "wishlist-heart active" : "wishlist-heart"}
          onClick={handleWishlistClick}
          aria-label="Add to wishlist"
          type="button"
        >
          {wishlisted ? "♥" : "♡"}
        </button>

        <button className="quick-add-btn" onClick={handleQuickAdd} type="button">
          + Quick Add
        </button>
      </div>
      <div className="product-card-info">
        <div className="product-card-name">{product.name}</div>
        <div className="product-card-price">
          ৳{price}
          {onSale && <span className="product-card-old-price">৳{regularPrice}</span>}
        </div>
      </div>
    </Link>
  );
}
