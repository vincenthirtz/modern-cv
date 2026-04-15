"use client";

import AnimatedText from "../AnimatedText";
import Story from "../Story";

const CODE = `<AnimatedText
  el="h2"
  text="Design, code, émotion."
  highlight="émotion"
  splitBy="word"
/>`;

const SOURCE = `export function AnimatedText({ text, stagger = 0.06, splitBy = "word" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const tokens = splitBy === "word" ? text.split(" ") : Array.from(text);

  return (
    <span ref={ref} aria-label={text}>
      {tokens.map((tok, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            whiteSpace: "pre",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
            filter: inView ? "blur(0)" : "blur(12px)",
            transition: \`opacity .5s \${i * stagger}s, transform .5s \${i * stagger}s,\` +
              \` filter .4s \${i * stagger}s\`,
          }}
        >
          {tok}
          {splitBy === "word" && i < tokens.length - 1 ? "\\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}`;

const CSS = `/* Chaque token est rendu inline-block,
   puis animé en opacity + translateY + blur,
   avec un delay calculé (index × stagger). */
.animated-word {
  display: inline-block;
  white-space: pre;
  opacity: 0;
  transform: translateY(24px);
  filter: blur(12px);
  transition:
    opacity 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
    transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
    filter 0.4s ease;
}

.animated-word.is-visible {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}`;

export default function AnimatedTextStory() {
  return (
    <Story
      name="AnimatedText"
      description="Apparition mot par mot avec flou et stagger, via IntersectionObserver."
      code={CODE}
      source={SOURCE}
      css={CSS}
    >
      <AnimatedText
        el="div"
        text="Design, code, émotion."
        highlight="émotion"
        splitBy="word"
        className="text-center font-serif text-3xl md:text-4xl"
      />
    </Story>
  );
}
