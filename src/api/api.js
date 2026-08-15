// ============================================================
// STOREFRONT API CLIENT
// ============================================================
// Every call is scoped to one subdomain (one business). No
// login, no token - this is the public customer-facing site.
// ============================================================

const BASE_URL = "http://ygk4so4wkoos80ww0w0ws484.76.13.223.236.sslip.io";

// Uploaded images are stored as relative URLs (e.g. /uploads/abc.png) -
// this makes them loadable from the storefront app, which runs on a
// different port/origin than the backend that serves them.
export function resolveImageUrl(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${BASE_URL}${url}`;
}

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

// ---------------- CUSTOMER ACCOUNT ----------------
function getCustomerToken(subdomain) {
  return localStorage.getItem(`customer_token_${subdomain}`);
}

async function customerRequest(subdomain, path, options = {}) {
  const token = getCustomerToken(subdomain);
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await response.json();
  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

export function customerRegister(subdomain, payload) {
  return post(`/public/${subdomain}/auth/register`, payload);
}

export function customerLogin(subdomain, payload) {
  return post(`/public/${subdomain}/auth/login`, payload);
}

export function getCustomerProfile(subdomain) {
  return customerRequest(subdomain, `/public/${subdomain}/auth/me`);
}

export function updateCustomerProfile(subdomain, payload) {
  return customerRequest(subdomain, `/public/${subdomain}/auth/me`, { method: "PUT", body: JSON.stringify(payload) });
}

export function getMyOrders(subdomain) {
  return customerRequest(subdomain, `/public/${subdomain}/my/orders`);
}

export function getMyOrderDetail(subdomain, orderId) {
  return customerRequest(subdomain, `/public/${subdomain}/my/orders/${orderId}`);
}

// checkout automatically attaches the customer's token if they're
// logged in (so the order links to their account), and works exactly
// the same as before if they're not (guest checkout, unchanged)
export async function checkout(subdomain, payload) {
  const token = getCustomerToken(subdomain);
  const response = await fetch(`${BASE_URL}/public/${subdomain}/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

export function getActiveCoupons(subdomain) {
  return request(`/public/${subdomain}/coupons/active`);
}
