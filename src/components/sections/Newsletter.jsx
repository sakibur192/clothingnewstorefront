import { useState } from "react";

export default function Newsletter({ settings }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // Phase 3 does not persist newsletter signups yet - this is a
    // good candidate for a later phase (e.g. tie into SMS/email marketing).
    setSubmitted(true);
  }

  return (
    <section className="section-newsletter">
      <h2>{settings.heading}</h2>
      {settings.subheading && <p>{settings.subheading}</p>}
      {submitted ? (
        <p>Thanks for subscribing!</p>
      ) : (
        <form onSubmit={handleSubmit} className="newsletter-form">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      )}
    </section>
  );
}
