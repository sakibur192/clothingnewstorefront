import { useEffect, useState } from "react";

function getTimeParts(endTime) {
  const total = Math.max(0, new Date(endTime).getTime() - Date.now());
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);
  return { total, days, hours, minutes, seconds };
}

export default function CountdownTimer({ endTime }) {
  const [parts, setParts] = useState(() => getTimeParts(endTime));

  useEffect(() => {
    const interval = setInterval(() => setParts(getTimeParts(endTime)), 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  if (!endTime || parts.total <= 0) return null;

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="countdown-timer">
      {parts.days > 0 && (
        <div className="countdown-block">
          <span className="countdown-value">{parts.days}</span>
          <span className="countdown-label">Days</span>
        </div>
      )}
      <div className="countdown-block">
        <span className="countdown-value">{pad(parts.hours)}</span>
        <span className="countdown-label">Hrs</span>
      </div>
      <div className="countdown-block">
        <span className="countdown-value">{pad(parts.minutes)}</span>
        <span className="countdown-label">Min</span>
      </div>
      <div className="countdown-block">
        <span className="countdown-value">{pad(parts.seconds)}</span>
        <span className="countdown-label">Sec</span>
      </div>
    </div>
  );
}
