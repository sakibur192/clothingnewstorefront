import { useEffect, useState } from "react";
import ProductCard from "../ProductCard";
import { listProducts } from "../../api/api";
import { useStore } from "../../context/StoreContext";

export default function ProductGrid({ settings }) {
  const { subdomain } = useStore();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    listProducts(subdomain, { collection: settings.collection, limit: settings.limit }).then((data) =>
      setProducts(data.products)
    );
  }, [subdomain, settings.collection, settings.limit]);

  if (products.length === 0) return null;

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
