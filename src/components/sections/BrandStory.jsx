export default function BrandStory({ settings }) {
  return (
    <section className="section-brand-story">
      <h2>{settings.heading}</h2>
      {settings.tagline && <p className="brand-story-tagline">{settings.tagline}</p>}
      <p className="brand-story-body">{settings.body_text}</p>
    </section>
  );
}
