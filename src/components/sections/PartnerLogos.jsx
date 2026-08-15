export default function PartnerLogos({ settings }) {
  const logos = settings.logos || [];

  return (
    <section className="section-partner-logos">
      <h2>{settings.heading || "Work with us Today"}</h2>
      {settings.subtext && <p className="section-subheading">{settings.subtext}</p>}
      {logos.length > 0 && (
        <div className="partner-logos-row">
          {logos.map((url, i) => (
            <div className="partner-logo-tile" key={i}>
              <img src={url} alt="" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
