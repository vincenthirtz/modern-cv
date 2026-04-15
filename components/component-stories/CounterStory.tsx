"use client";

import Counter from "../Counter";
import Story from "../Story";

const CODE = `<Counter to={128} suffix="+" duration={1600} />`;

const SOURCE = `export function Counter({ to, suffix = "+", duration = 1600 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!inView) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      // easeOutExpo
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setValue(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return <span ref={ref} className="tabular-nums">{value}{suffix}</span>;
}`;

const CSS = `/* Pas d'animation CSS — la valeur est incrémentée
   via requestAnimationFrame avec easeOutExpo.
   On force juste des chiffres à chasse fixe pour
   éviter que le layout ne tremble pendant le comptage. */
.counter {
  font-variant-numeric: tabular-nums;
}`;

export default function CounterStory() {
  return (
    <Story
      name="Counter"
      description="Compteur avec easing easeOutExpo, déclenché à la visibilité."
      code={CODE}
      source={SOURCE}
      css={CSS}
    >
      <div className="flex items-baseline justify-center gap-6 font-serif">
        <span className="text-6xl text-[var(--color-accent)]">
          <Counter to={128} suffix="+" />
        </span>
        <span className="text-6xl text-[var(--fg-muted)]">
          <Counter to={42} suffix="%" duration={1400} />
        </span>
      </div>
    </Story>
  );
}
