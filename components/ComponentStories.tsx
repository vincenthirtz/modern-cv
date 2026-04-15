import AnimatedTextStory from "./component-stories/AnimatedTextStory";
import CounterStory from "./component-stories/CounterStory";
import MagneticButtonStory from "./component-stories/MagneticButtonStory";
import MarqueeStory from "./component-stories/MarqueeStory";
import TiltCardStory from "./component-stories/TiltCardStory";
import ThemeAccentStory from "./component-stories/ThemeAccentStory";

/**
 * Storybook des composants phares du site.
 * Chaque story vit dans son propre fichier sous component-stories/ ;
 * ce composant ne fait qu'orchestrer le layout.
 */
export default function ComponentStories() {
  return (
    <section>
      <div className="mb-8 flex items-center gap-3">
        <span className="block h-[1px] w-10 bg-[var(--border-strong)]" />
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
          Composants · Storybook
        </span>
      </div>
      <p className="mb-8 max-w-2xl text-[var(--fg-muted)]">
        Les briques d&apos;interaction phares du site, isolées et jouables. Chaque composant gère
        lui-même l&apos;accessibilité et respecte{" "}
        <code className="font-mono text-[0.75rem] text-[var(--color-accent)]">
          prefers-reduced-motion
        </code>
        .
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MagneticButtonStory />
        <TiltCardStory />
        <AnimatedTextStory />
        <CounterStory />
        <MarqueeStory />
        <ThemeAccentStory />
      </div>
    </section>
  );
}
