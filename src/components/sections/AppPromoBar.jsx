export default function AppPromoBar({ settings }) {
  return (
    <section className="section-app-promo-bar">
      <span>{settings.heading || "GET 5% OFF ON APP"}</span>
      <div className="app-promo-badges">
        {settings.playstore_url && (
          <a href={settings.playstore_url} target="_blank" rel="noopener noreferrer" className="app-badge">
            &#9654; Google Play
          </a>
        )}
        {settings.appstore_url && (
          <a href={settings.appstore_url} target="_blank" rel="noopener noreferrer" className="app-badge">
            &#63743; App Store
          </a>
        )}
      </div>
    </section>
  );
}
