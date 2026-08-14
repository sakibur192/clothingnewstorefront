import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";

export default function HeroSlider({ settings }) {
  const { basePath } = useStore();
  const slides = settings.slides && settings.slides.length > 0 ? settings.slides : [settings];
  const [index, setIndex] = useState(0);
  const autoplaySeconds = settings.autoplay_seconds || 5;

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => setIndex((i) => (i + 1) % slides.length), autoplaySeconds * 1000);
    return () => clearInterval(interval);
  }, [slides.length, autoplaySeconds]);

  const slide = slides[index] || {};
  const link = slide.button_link?.startsWith("/products") ? `${basePath}/products` : slide.button_link;

  return (
    <section className="section-hero-slider">
      <div
        className="hero-slide"
        style={{
          background: slide.image_url ? `url(${slide.image_url}) center/cover no-repeat` : slide.background_color,
          color: slide.text_color,
        }}
      >
        {slide.image_url && <div className="hero-slide-overlay" />}
        <div className="hero-slide-content">
          <h1>{slide.heading}</h1>
          {slide.subheading && <p>{slide.subheading}</p>}
          {slide.button_text && (
            <Link to={link || `${basePath}/products`} className="hero-button">
              {slide.button_text}
            </Link>
          )}
        </div>
      </div>

      {slides.length > 1 && (
        <div className="hero-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={i === index ? "hero-dot active" : "hero-dot"}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
