export default function Banner({ settings }) {
  return (
    <section
      className="section-banner"
      style={{ background: settings.background_color, color: settings.text_color }}
    >
      <h2>{settings.heading}</h2>
      {settings.subheading && <p>{settings.subheading}</p>}
    </section>
  );
}
