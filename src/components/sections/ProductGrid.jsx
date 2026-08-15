// ============================================================
// PRODUCT GRID / CAROUSEL
// ============================================================
// Two layouts sharing one component:
//   layout: 'grid'     - the original static grid
//   layout: 'carousel' - a horizontally-scrolling row with a
//                        trailing "View More" card, exactly how
//                        Fabrilife shows each category's products
//                        on the homepage (e.g. "Designer Polo",
//                        "Kurti, Tunic & Tops", "Panjabi" rows).
// Optionally scoped to one category via settings.category_id, so
// a template can compose one row per category like Fabrilife does.
// ============================================================

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";
import { listProducts } from "../../api/api";
import { useStore } from "../../context/StoreContext";

export default function ProductGrid({ settings }) {
  const { subdomain, basePath } = useStore();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    listProducts(subdomain, {
      collection: settings.collection,
      limit: settings.limit,
      category_id: settings.category_id || undefined,
    }).then((data) => setProducts(data.products));
  }, [subdomain, settings.collection, settings.limit, settings.category_id]);

  if (products.length === 0) return null;

  const viewMoreLink = settings.category_id
    ? `${basePath}/products?category=${settings.category_id}`
    : `${basePath}/products`;

  if (settings.layout === "carousel") {
    return (
      <section className="section-product-carousel">
        <div className="product-carousel-header">
          <h2>{settings.heading}</h2>
          <Link to={viewMoreLink} className="view-more-link">View All &rarr;</Link>
        </div>
        <div className="product-carousel-row">
          {products.map((p) => (
            <div className="product-carousel-item" key={p.id}>
              <ProductCard product={p} />
            </div>
          ))}
          <Link to={viewMoreLink} className="product-carousel-viewmore">
            <span>View More</span>
            <span className="view-more-arrow">&rarr;</span>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section-product-grid">
      <h2>{settings.heading}</h2>
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
