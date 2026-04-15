"use client";

import Marquee from "../Marquee";
import Story from "../Story";

const CODE = `<Marquee
  items={["Next.js", "React 19", "Tailwind v4", "MDX"]}
  speed={32}
/>`;

const SOURCE = `export function Marquee({ items, speed = 40 }) {
  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex w-max animate-marquee"
        style={{ animationDuration: \`\${speed}s\` }}
      >
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0" aria-hidden={dup === 1}>
            {items.map((item, i) => (
              <div key={i} className="flex items-center">
                <span className="font-serif text-3xl">{item}</span>
                <span className="mx-8 h-2 w-2 rounded-full bg-accent" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}`;

const CSS = `/* Le contenu est dupliqué dans le DOM, puis
   translaté de -50% : la boucle semble infinie. */
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee 40s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-marquee { animation: none; }
}`;

export default function MarqueeStory() {
  return (
    <Story
      name="Marquee"
      description="Bande défilante infinie, CSS pur, contenu dupliqué pour un loop invisible."
      code={CODE}
      source={SOURCE}
      css={CSS}
      minH="min-h-[140px]"
    >
      <div className="-mx-8">
        <Marquee
          items={["Next.js", "React 19", "Tailwind v4", "MDX", "TypeScript", "A11y"]}
          speed={32}
        />
      </div>
    </Story>
  );
}
