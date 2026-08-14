import { Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";

export default function Hero({ settings }) {
  const { basePath } = useStore();
  const link = settings.button_link?.startsWith("/products") ? `${basePath}/products` : settings.button_link;

  return (
    <section
      className="section-hero"
      style={{ background: settings.background_color, color: settings.text_color }}
    >
      <h1>{settings.heading}</h1>
      {settings.subheading && <p>{settings.subheading}</p>}
      {settings.button_text && (
        <Link to={link || `${basePath}/products`} className="hero-button">
          {settings.button_text}
        </Link>
      )}
    </section>
  );
}
