// ============================================================
// STOREFRONT API CLIENT
// ============================================================
// Every call is scoped to one subdomain (one business). No
// login, no token - this is the public customer-facing site.
// ============================================================

const BASE_URL = "http://ygk4so4wkoos80ww0w0ws484.76.13.223.236.sslip.io";

async function request(path) {
  const response = await fetch(`${BASE_URL}${path}`);
  const data = await response.json();
  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

async function post(path, body) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

export function getStoreInfo(subdomain) {
  return request(`/public/${subdomain}/store`);
}

export function getPage(subdomain, slug) {
  return request(`/public/${subdomain}/pages/${slug}`);
}

export function listProducts(subdomain, { collection, category_id, limit } = {}) {
  const params = new URLSearchParams();
  if (collection) params.set("collection", collection);
  if (category_id) params.set("category_id", category_id);
  if (limit) params.set("limit", limit);
  const query = params.toString() ? `?${params.toString()}` : "";
  return request(`/public/${subdomain}/products${query}`);
}

export function getProduct(subdomain, id) {
  return request(`/public/${subdomain}/products/${id}`);
}

export function listCategories(subdomain) {
  return request(`/public/${subdomain}/categories`);
}

export function checkout(subdomain, payload) {
  return post(`/public/${subdomain}/checkout`, payload);
}

export function resolveByHost(hostname) {
  return request(`/public/resolve?host=${encodeURIComponent(hostname)}`);
}

export function trackOrder(subdomain, payload) {
  return post(`/public/${subdomain}/track-order`, payload);
}

export function requestBackInStock(subdomain, payload) {
  return post(`/public/${subdomain}/back-in-stock`, payload);
}

export function getRecentActivity(subdomain) {
  return request(`/public/${subdomain}/recent-activity`);
}
