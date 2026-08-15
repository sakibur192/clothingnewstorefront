// ============================================================
// COUPON STRIP ("Collect Voucher" cards)
// ============================================================
// The Daraz-style row of collectible discount vouchers. Pulls
// real, currently-active shop coupons and shows them as tap-to-
// copy cards - no fake numbers, whatever the business actually
// has configured in Coupons is what shows here.
// ============================================================

import { useEffect, useState } from "react";
import { getActiveCoupons } from "../../api/api";
import { useStore } from "../../context/StoreContext";

function describeCoupon(c) {
  if (c.discount_type === "percentage") return `${c.discount_value}% OFF`;
  if (c.discount_type === "fixed") return `৳${c.discount_value} OFF`;
  if (c.discount_type === "free_shipping") return "FREE SHIPPING";
  return "";
}

export default function CouponStrip({ settings }) {
  const { subdomain } = useStore();
  const [coupons, setCoupons] = useState([]);
  const [copiedCode, setCopiedCode] = useState("");

  useEffect(() => {
    getActiveCoupons(subdomain).then((data) => setCoupons(data.coupons)).catch(() => {});
  }, [subdomain]);

  if (coupons.length === 0) return null;

  function handleCopy(code) {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 1500);
  }

  return (
    <section className="section-coupon-strip">
      <h2>{settings.heading || "Collect Vouchers"}</h2>
      <div className="coupon-strip-row">
        {coupons.map((c) => (
          <button key={c.code} className="coupon-card" onClick={() => handleCopy(c.code)} type="button">
            <span className="coupon-card-value">{describeCoupon(c)}</span>
            {Number(c.min_purchase_amount) > 0 && (
              <span className="coupon-card-condition">Min. spend ৳{c.min_purchase_amount}</span>
            )}
            <span className="coupon-card-code">
              {copiedCode === c.code ? "Copied!" : c.code}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
