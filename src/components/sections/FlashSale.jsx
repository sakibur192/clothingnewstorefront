import { useEffect, useState } from "react";
import ProductCard from "../ProductCard";
import CountdownTimer from "../CountdownTimer";
import { listProducts } from "../../api/api";
import { useStore } from "../../context/StoreContext";

export default function FlashSale({ settings }) {
  const { subdomain } = useStore();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    listProducts(subdomain, { collection: settings.collection || "bestsellers", limit: settings.limit || 8 }).then(
      (data) => setProducts(data.products)
    );
  }, [subdomain, settings.collection, settings.limit]);

  if (products.length === 0) return null;

  return (
    <section className="section-flash-sale">
      <div className="flash-sale-header">
        <h2>{settings.heading || "Flash Sale"}</h2>
        {settings.end_time && <CountdownTimer endTime={settings.end_time} />}
      </div>
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
