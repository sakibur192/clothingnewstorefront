import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProduct, requestBackInStock } from "../api/api";
import { useStore } from "../context/StoreContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function ProductDetail() {
  const { subdomain, basePath } = useStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const cart = useCart();
  const wishlist = useWishlist();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [added, setAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySubmitted, setNotifySubmitted] = useState(false);

  useEffect(() => {
    getProduct(subdomain, id)
      .then((data) => {
        setProduct(data.product);
        const firstInStock = data.product.variants.find((v) => v.stock_quantity > 0);
        if (firstInStock) {
          setSelectedColor(firstInStock.color || "");
          setSelectedSize(firstInStock.size || "");
        }
      })
      .catch((err) => setError(err.message));
  }, [subdomain, id]);

  if (error) return <p className="store-error">{error}</p>;
  if (!product) return <p className="store-loading">Loading...</p>;

  const colors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))];
  const sizes = [...new Set(product.variants.map((v) => v.size).filter(Boolean))];

  const matchedVariant = product.variants.find(
    (v) => (v.color || "") === selectedColor && (v.size || "") === selectedSize
  );

  const price = matchedVariant ? Number(matchedVariant.sale_price || matchedVariant.regular_price) : 0;
  const regularPrice = matchedVariant ? Number(matchedVariant.regular_price) : 0;
  const onSale = matchedVariant?.sale_price && Number(matchedVariant.sale_price) < regularPrice;
  const inStock = matchedVariant && matchedVariant.stock_quantity > 0;
  const wishlisted = wishlist?.isWishlisted(product.id);

  function handleAddToCart() {
    if (!matchedVariant) return;
    cart.addItem(matchedVariant, product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-image">
        {matchedVariant?.image_url ? (
          <img src={matchedVariant.image_url} alt={product.name} />
        ) : (
          <div className="product-card-placeholder large">{product.name.slice(0, 1)}</div>
        )}
      </div>

      <div className="product-detail-info">
        <Link to={`${basePath}/products`} className="breadcrumb-back">&larr; Back to Shop</Link>
        <h1>{product.name}</h1>
        {product.category_name && <p className="muted">{product.category_name}</p>}

        <div className="product-detail-price">
          ৳{price}
          {onSale && <span className="product-card-old-price">৳{regularPrice}</span>}
          {onSale && <span className="badge-sale-inline">-{Math.round(((regularPrice - price) / regularPrice) * 100)}%</span>}
        </div>

        {product.description && <p>{product.description}</p>}

        {(product.fabric || product.material || product.fit) && (
          <ul className="product-attributes">
            {product.fabric && <li>Fabric: {product.fabric}</li>}
            {product.material && <li>Material: {product.material}</li>}
            {product.fit && <li>Fit: {product.fit}</li>}
            {product.pattern && <li>Pattern: {product.pattern}</li>}
          </ul>
        )}

        {colors.length > 0 && (
          <div className="variant-selector">
            <label>Color</label>
            <div className="swatch-row">
              {colors.map((c) => (
                <button
                  key={c}
                  className={c === selectedColor ? "swatch active" : "swatch"}
                  onClick={() => setSelectedColor(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {sizes.length > 0 && (
          <div className="variant-selector">
            <div className="variant-selector-header">
              <label>Size</label>
              <button className="size-guide-link" onClick={() => setShowSizeGuide(true)} type="button">
                Size Guide
              </button>
            </div>
            <div className="swatch-row">
              {sizes.map((s) => (
                <button
                  key={s}
                  className={s === selectedSize ? "swatch active" : "swatch"}
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {!inStock && matchedVariant && (
          <div className="back-in-stock-box">
            <p className="store-error" style={{ padding: 0 }}>Out of stock for this combination</p>
            {notifySubmitted ? (
              <p className="muted">We'll email you when it's back!</p>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!notifyEmail.trim()) return;
                  try {
                    await requestBackInStock(subdomain, { variant_id: matchedVariant.id, email: notifyEmail.trim() });
                    setNotifySubmitted(true);
                  } catch (err) {
                    setError(err.message);
                  }
                }}
                style={{ display: "flex", gap: 8, marginTop: 8 }}
              >
                <input type="email" placeholder="Your email" value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} required style={{ flex: 1, padding: "8px 12px", border: "1px solid #ddd", borderRadius: 6 }} />
                <button type="submit" className="btn-notify">Notify Me</button>
              </form>
            )}
          </div>
        )}

        <div className="product-detail-actions">
          <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={!inStock}>
            {added ? "Added!" : "Add to Cart"}
          </button>
          <button className="buy-now-btn" onClick={() => { handleAddToCart(); navigate(`${basePath}/cart`); }} disabled={!inStock}>
            Buy Now
          </button>
          <button
            className={wishlisted ? "wishlist-btn active" : "wishlist-btn"}
            onClick={() => wishlist?.toggleWishlist(product)}
            type="button"
            aria-label="Add to wishlist"
          >
            {wishlisted ? "♥" : "♡"}
          </button>
        </div>

        <div className="product-trust-row">
          <span>🚚 Fast Delivery</span>
          <span>💵 Cash on Delivery</span>
          <span>↩️ 7-Day Return</span>
        </div>
      </div>

      {showSizeGuide && (
        <div className="modal-overlay" onClick={() => setShowSizeGuide(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowSizeGuide(false)}>&times;</button>
            <h3>Size Guide</h3>
            <table className="size-guide-table">
              <thead>
                <tr><th>Size</th><th>Chest (in)</th><th>Length (in)</th><th>Shoulder (in)</th></tr>
              </thead>
              <tbody>
                <tr><td>S</td><td>36</td><td>27</td><td>17</td></tr>
                <tr><td>M</td><td>38</td><td>28</td><td>17.5</td></tr>
                <tr><td>L</td><td>40</td><td>29</td><td>18</td></tr>
                <tr><td>XL</td><td>42</td><td>30</td><td>18.5</td></tr>
                <tr><td>XXL</td><td>44</td><td>31</td><td>19</td></tr>
              </tbody>
            </table>
            <p className="muted">Measurements are approximate and may vary slightly by style.</p>
          </div>
        </div>
      )}

      {inStock && (
        <div className="mobile-sticky-bar">
          <div className="mobile-sticky-price">৳{price}</div>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            {added ? "Added!" : "Add to Cart"}
          </button>
        </div>
      )}
    </div>
  );
}
