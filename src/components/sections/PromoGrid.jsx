import { Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";

export default function PromoGrid({ settings }) {
  const { basePath } = useStore();
  const banners = settings.banners || [];

  if (banners.length === 0) return null;

  return (
    <section className="section-promo-grid" style={{ gridTemplateColumns: `repeat(${banners.length}, 1fr)` }}>
      {banners.map((b, i) => {
        const link = b.button_link?.startsWith("/products") ? `${basePath}/products` : (b.button_link || `${basePath}/products`);
        return (
          <Link
            to={link}
            key={i}
            className="promo-banner"
            style={{
              background: b.image_url ? `url(${b.image_url}) center/cover no-repeat` : b.background_color,
              color: b.text_color,
            }}
          >
            {b.image_url && <div className="promo-banner-overlay" />}
            <div className="promo-banner-content">
              <h3>{b.heading}</h3>
              {b.subheading && <p>{b.subheading}</p>}
            </div>
          </Link>
        );
      })}
    </section>
  );
}
