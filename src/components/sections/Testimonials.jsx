// Static placeholder content in Phase 3 - a testimonials manager
// (owner-submitted reviews) is a good later-phase addition.
const SAMPLE_TESTIMONIALS = [
  { name: "Nusrat J.", quote: "Great quality and fast delivery. Will order again!" },
  { name: "Rafiq A.", quote: "The fabric feels premium, exactly as shown in photos." },
  { name: "Farhana K.", quote: "Customer service was very helpful with my exchange." },
];

export default function Testimonials({ settings }) {
  return (
    <section className="section-testimonials">
      <h2>{settings.heading}</h2>
      <div className="testimonial-grid">
        {SAMPLE_TESTIMONIALS.map((t, i) => (
          <div key={i} className="testimonial-card">
            <p>"{t.quote}"</p>
            <strong>— {t.name}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
