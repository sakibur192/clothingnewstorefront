import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPage } from "../api/api";
import { useStore } from "../context/StoreContext";
import SectionRenderer from "../components/SectionRenderer";

// Renders any published custom page (about, contact, etc.) by slug.
export default function DynamicPage() {
  const { subdomain } = useStore();
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setPage(null);
    getPage(subdomain, slug)
      .then((data) => setPage(data.page))
      .catch((err) => setError(err.message));
  }, [subdomain, slug]);

  if (error) return <p className="store-error">{error}</p>;
  if (!page) return <p className="store-loading">Loading...</p>;

  return (
    <div className="dynamic-page">
      <h1>{page.title}</h1>
      <SectionRenderer sections={page.sections} />
    </div>
  );
}
