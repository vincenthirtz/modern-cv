"use client";

import { useEffect, useState } from "react";

const CLOCK_INTERVAL_MS = 30_000;

export default function FooterClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    function tick() {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Paris",
      }).format(now);
      setTime(formatted);
    }
    tick();
    const id = setInterval(tick, CLOCK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <time
      dateTime={new Date().toISOString()}
      className="font-mono text-[10px] text-[var(--color-accent)]"
    >
      — {time}
    </time>
  );
}
