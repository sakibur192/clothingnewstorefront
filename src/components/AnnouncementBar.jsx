// ============================================================
// ANNOUNCEMENT BAR
// ============================================================

import { useStore } from "../context/StoreContext";

export default function AnnouncementBar() {
  const { store } = useStore();
  const settings = store?.settings;

  if (!settings?.announcement_enabled || !settings?.announcement_text) return null;

  return <div className="announcement-bar">{settings.announcement_text}</div>;
}
