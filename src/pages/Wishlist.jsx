import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useWishlist } from "../context/WishlistContext";
import { getProduct } from "../api/api";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const { subdomain, basePath } = useStore();
  const wishlist = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wishlist || wishlist.items.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all(wishlist.items.map((item) => getProduct(subdomain, item.product_id).then((d) => d.product).catch(() => null)))
      .then((results) => setProducts(results.filter(Boolean)))
      .finally(() => setLoading(false));
  }, [subdomain, wishlist?.items]);

  return (
    <div className="product-list-page">
      <h1>Your Wishlist</h1>
      {loading ? (
        <p className="store-loading">Loading...</p>
      ) : products.length === 0 ? (
        <div className="store-empty">
          Nothing saved yet. <Link to={`${basePath}/products`}>Browse products</Link> and tap the heart icon to save items here.
        </div>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
