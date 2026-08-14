const DEFAULT_BADGES = [
  { icon: "🚚", title: "Fast Delivery", subtitle: "Nationwide shipping" },
  { icon: "💵", title: "Cash on Delivery", subtitle: "Pay when you receive" },
  { icon: "↩️", title: "Easy Returns", subtitle: "7-day return policy" },
  { icon: "✅", title: "Authentic Products", subtitle: "100% genuine quality" },
];

export default function TrustBadges({ settings }) {
  const badges = settings.badges && settings.badges.length > 0 ? settings.badges : DEFAULT_BADGES;

  return (
    <section className="section-trust-badges">
      {badges.map((b, i) => (
        <div className="trust-badge" key={i}>
          <span className="trust-badge-icon">{b.icon}</span>
          <div>
            <div className="trust-badge-title">{b.title}</div>
            <div className="trust-badge-subtitle">{b.subtitle}</div>
          </div>
        </div>
      ))}
    </section>
  );
}
