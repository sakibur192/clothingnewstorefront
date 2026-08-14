import { useEffect, useState } from "react";
import { getPage } from "../api/api";
import { useStore } from "../context/StoreContext";
import SectionRenderer from "../components/SectionRenderer";

export default function Home() {
  const { subdomain } = useStore();
  const [page, setPage] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getPage(subdomain, "home")
      .then((data) => setPage(data.page))
      .catch((err) => setError(err.message));
  }, [subdomain]);

  if (error) return <p className="store-error">{error}</p>;
  if (!page) return <p className="store-loading">Loading...</p>;

  return <SectionRenderer sections={page.sections} />;
}
