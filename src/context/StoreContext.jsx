// ============================================================
// STORE CONTEXT
// ============================================================
// Two ways this gets its subdomain:
//   1) PATH MODE (dev/testing convenience): the subdomain comes
//      from the URL, e.g. /abc-fashion-123/products. basePath is
//      "/abc-fashion-123" so links stay within that prefix.
//   2) ROOT MODE (real custom domain / production): App.jsx
//      resolves the subdomain from the hostname BEFORE mounting
//      any routes, and passes it in as `forcedSubdomain`. basePath
//      is "" so links are clean root-relative URLs, e.g. /products
//      - exactly what you want when abcfashion.com IS the store.
//
// Either way, every component in the app should build links with
// `basePath` (not the subdomain directly) and make API calls with
// `subdomain` (not basePath) - see useStore() below.
// ============================================================

import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStoreInfo } from "../api/api";

const StoreContext = createContext(null);

export function StoreProvider({ children, forcedSubdomain }) {
  const params = useParams();
  const pathSubdomain = params.subdomain;

  const subdomain = forcedSubdomain || pathSubdomain;
  const basePath = forcedSubdomain ? "" : `/${pathSubdomain}`;

  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!subdomain) return;

    setLoading(true);
    getStoreInfo(subdomain)
      .then((data) => {
        setStore(data);
        const s = data.settings;
        if (s) {
          const root = document.documentElement;
          root.style.setProperty("--store-primary", s.primary_color);
          root.style.setProperty("--store-secondary", s.secondary_color);
          root.style.setProperty("--store-accent", s.accent_color);
          root.style.setProperty("--store-background", s.background_color);
          root.style.setProperty("--store-text", s.text_color);
          root.style.setProperty("--store-heading-font", s.heading_font);
          root.style.setProperty("--store-body-font", s.body_font);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [subdomain]);

  return (
    <StoreContext.Provider value={{ subdomain, basePath, store, loading, error }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
