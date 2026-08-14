import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listProducts, listCategories } from "../api/api";
import { useStore } from "../context/StoreContext";
import ProductCard from "../components/ProductCard";

export default function ProductList() {
  const { subdomain } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get("category") || "";
  const searchTerm = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    listCategories(subdomain).then((data) => setCategories(data.categories));
  }, [subdomain]);

  useEffect(() => {
    setLoading(true);
    listProducts(subdomain, {
      category_id: categoryId || undefined,
      search: searchTerm || undefined,
      collection: sortBy,
      limit: 48,
    })
      .then((data) => setProducts(data.products))
      .finally(() => setLoading(false));
  }, [subdomain, categoryId, searchTerm, sortBy]);

  function clearFilters() {
    setSearchParams({});
  }

  return (
    <div className="product-list-page">
      <h1>{searchTerm ? `Search: "${searchTerm}"` : "Shop All"}</h1>

      <div className="product-list-toolbar">
        <div className="category-filter">
          <button className={!categoryId ? "active" : ""} onClick={() => setSearchParams(searchTerm ? { search: searchTerm } : {})}>
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              className={String(c.id) === categoryId ? "active" : ""}
              onClick={() => setSearchParams({ category: c.id })}
            >
              {c.name}
            </button>
          ))}
        </div>

        <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="bestsellers">Best Selling</option>
        </select>
      </div>

      {searchTerm && (
        <button className="clear-search-btn" onClick={clearFilters}>
          Clear search &times;
        </button>
      )}

      {loading ? (
        <p className="store-loading">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="store-empty">No products found.</p>
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
