export default function InstagramGallery({ settings }) {
  const images = settings.images || [];
  if (images.length === 0) return null;

  return (
    <section className="section-instagram-gallery">
      <h2>{settings.heading || "Shop The Look"}</h2>
      <div className="instagram-grid">
        {images.map((img, i) => {
          const url = typeof img === "string" ? img : img.image_url;
          return (
            <div className="instagram-tile" key={i}>
              {url ? <img src={url} alt="" /> : <div className="instagram-tile-placeholder" />}
            </div>
          );
        })}
      </div>
    </section>
  );
}
