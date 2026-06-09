"use client";

import { useEffect, useState } from "react";

/** Date de lancement de l'OW Women's Cup — 18 septembre 2026, minuit (CEST, UTC+2). */
const LAUNCH_DATE = new Date("2026-09-18T00:00:00+02:00");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Renvoie le temps restant jusqu'à `target`, borné à zéro. */
function getTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const UNITS: { key: keyof TimeLeft; label: string; pad: boolean }[] = [
  { key: "days", label: "jours", pad: false },
  { key: "hours", label: "h", pad: true },
  { key: "minutes", label: "min", pad: true },
  { key: "seconds", label: "s", pad: true },
];

/**
 * Compte à rebours live vers le lancement de l'OW Women's Cup.
 *
 * - Évite tout mismatch d'hydratation : rien de dépendant du temps n'est rendu
 *   tant que le composant n'est pas monté côté client.
 * - Le décompte qui s'égrène est `aria-hidden` (mise à jour par seconde =
 *   bruit pour un lecteur d'écran) ; une ligne `sr-only` porte l'info utile.
 * - S'arrête net à l'échéance et bascule sur un état « lancé ».
 */
export default function AssociationCountdown() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(LAUNCH_DATE));

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft(LAUNCH_DATE));

    const id = setInterval(() => {
      const next = getTimeLeft(LAUNCH_DATE);
      setTimeLeft(next);
      if (next.days + next.hours + next.minutes + next.seconds === 0) {
        clearInterval(id);
      }
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const isLaunched =
    mounted &&
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  if (isLaunched) {
    return (
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[var(--color-accent)]">
        C&apos;est lancé · OW Women&apos;s Cup 2026
      </p>
    );
  }

  return (
    <div>
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[var(--fg-dim)]">
        Lancement · 18 septembre 2026
      </p>

      {/* Info accessible, non bruyante (le décompte visuel est aria-hidden). */}
      <p className="sr-only">
        Lancement de l&apos;OW Women&apos;s Cup le 18 septembre 2026.
        {mounted ? ` Il reste ${timeLeft.days} jours.` : ""}
      </p>

      <div className="mt-4 flex items-center gap-3 sm:gap-4" aria-hidden>
        {UNITS.map((unit, i) => (
          <div key={unit.key} className="flex items-center gap-3 sm:gap-4">
            <div className="flex flex-col items-center">
              <span className="assoc-gradient-text font-serif text-3xl leading-none tabular-nums sm:text-4xl">
                {mounted
                  ? unit.pad
                    ? String(timeLeft[unit.key]).padStart(2, "0")
                    : timeLeft[unit.key]
                  : "—"}
              </span>
              <span className="mt-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-[var(--fg-dim)]">
                {unit.label}
              </span>
            </div>
            {i < UNITS.length - 1 && (
              <span className="font-serif text-2xl leading-none text-[var(--fg-dim)] sm:text-3xl">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
