import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCategories } from "../../api/api";
import { useStore } from "../../context/StoreContext";

export default function CategoryGrid({ settings }) {
  const { subdomain, basePath } = useStore();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    listCategories(subdomain).then((data) => setCategories(data.categories));
  }, [subdomain]);

  if (categories.length === 0) return null;

  return (
    <section className="section-category-grid">
      <h2>{settings.heading}</h2>
      <div className="category-grid" style={{ gridTemplateColumns: `repeat(${settings.columns || 4}, 1fr)` }}>
        {categories.map((c) => (
          <Link key={c.id} to={`${basePath}/products?category=${c.id}`} className="category-card">
            {c.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
