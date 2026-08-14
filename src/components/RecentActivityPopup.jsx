// ============================================================
// RECENT ACTIVITY POPUP (social proof)
// ============================================================
// "Someone recently bought..." toast, cycling through real recent
// orders. No customer name/phone/address is ever shown - just the
// product, to build trust without leaking anyone's information.
// ============================================================

import { useEffect, useState } from "react";
import { useStore } from "../context/StoreContext";
import { getRecentActivity } from "../api/api";

function timeAgo(dateString) {
  const minutes = Math.floor((Date.now() - new Date(dateString).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function RecentActivityPopup() {
  const { subdomain } = useStore();
  const [activity, setActivity] = useState([]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!subdomain) return;
    getRecentActivity(subdomain).then((data) => setActivity(data.activity || [])).catch(() => {});
  }, [subdomain]);

  useEffect(() => {
    if (activity.length === 0) return;

    let cycle;
    const showNext = () => {
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
    };

    const initialDelay = setTimeout(() => {
      showNext();
      cycle = setInterval(() => {
        setIndex((i) => (i + 1) % activity.length);
        showNext();
      }, 9000);
    }, 3000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(cycle);
    };
  }, [activity]);

  if (activity.length === 0 || !visible) return null;
  const item = activity[index];

  return (
    <div className="recent-activity-popup">
      <div className="recent-activity-dot" />
      <div>
        <strong>Someone just bought</strong>
        <div>{item.product_name} {item.color && `(${item.color}${item.size ? ", " + item.size : ""})`}</div>
        <span className="muted" style={{ fontSize: 11 }}>{timeAgo(item.created_at)}</span>
      </div>
    </div>
  );
}
