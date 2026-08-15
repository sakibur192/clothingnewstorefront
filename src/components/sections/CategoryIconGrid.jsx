// ============================================================
// CATEGORY ICON GRID ("Find Your Things")
// ============================================================
// Fabrilife's big homepage grid of small category tiles - pulls
// the business's real categories automatically. Each tile is a
// letter-avatar (since categories don't have their own photo yet)
// plus the category name, matching the tile-grid feel even
// without custom imagery per category.
// ============================================================

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCategories } from "../../api/api";
import { useStore } from "../../context/StoreContext";

export default function CategoryIconGrid({ settings }) {
  const { subdomain, basePath } = useStore();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    listCategories(subdomain).then((data) => setCategories(data.categories));
  }, [subdomain]);

  if (categories.length === 0) return null;

  return (
    <section className="section-category-icon-grid">
      <h2>{settings.heading || "Find Your Things"}</h2>
      {settings.subheading && <p className="section-subheading">{settings.subheading}</p>}
      <div className="category-icon-row">
        <Link to={`${basePath}/products`} className="category-icon-tile new-arrival-tile">
          <span className="category-icon-avatar">&#10024;</span>
          <span>New Arrival</span>
        </Link>
        {categories.map((c) => (
          <Link key={c.id} to={`${basePath}/products?category=${c.id}`} className="category-icon-tile">
            <span className="category-icon-avatar">{c.name.slice(0, 1)}</span>
            <span>{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
