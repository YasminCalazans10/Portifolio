// BlurText — adaptado do React Bits (https://reactbits.dev/text-animations/blur-text)
// Rodando em site estático: sem JSX e sem build, com React e Motion carregados via esm.sh.
// Aplica o efeito de texto desfocado -> nítido nos parágrafos com a classe .lead (PT e EN).

import React from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client?deps=react@18.3.1";
import { motion } from "https://esm.sh/motion@11.18.2/react?deps=react@18.3.1,react-dom@18.3.1";

const { useEffect, useRef, useState, createElement: h } = React;

const buildKeyframes = (from, steps) => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap((s) => Object.keys(s))]);
  const keyframes = {};
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])];
  });
  return keyframes;
};

function BlurText({
  text = "",
  delay = 120,
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  stepDuration = 0.35,
}) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const from =
    direction === "top"
      ? { filter: "blur(10px)", opacity: 0, y: -30 }
      : { filter: "blur(10px)", opacity: 0, y: 30 };

  const to = [
    { filter: "blur(5px)", opacity: 0.5, y: direction === "top" ? 5 : -5 },
    { filter: "blur(0px)", opacity: 1, y: 0 },
  ];

  const stepCount = to.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1)
  );
  const keyframes = buildKeyframes(from, to);

  return h(
    "span",
    {
      ref,
      style: { display: "flex", flexWrap: "wrap" },
    },
    elements.map((segment, index) =>
      h(
        motion.span,
        {
          key: index,
          initial: from,
          animate: inView ? keyframes : from,
          transition: { duration: totalDuration, times, delay: (index * delay) / 1000 },
          style: { display: "inline-block", willChange: "transform, filter, opacity" },
        },
        segment === " " ? "\u00A0" : segment,
        animateBy === "words" && index < elements.length - 1 ? "\u00A0" : null
      )
    )
  );
}

function mount(el) {
  if (el.dataset.blurText) return;
  const text = el.textContent.trim();
  if (!text) return;
  el.dataset.blurText = "1";
  el.setAttribute("aria-label", text); // leitores de tela leem o texto completo
  el.textContent = "";
  const holder = document.createElement("span");
  holder.setAttribute("aria-hidden", "true");
  holder.style.display = "block";
  el.appendChild(holder);
  createRoot(holder).render(h(BlurText, { text }));
}

function scan(root = document) {
  root.querySelectorAll(".lead:not([data-blur-text])").forEach(mount);
}

// Respeita quem prefere menos movimento
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  scan();
  // A versão em inglês é clonada do <template> pelo script.js, então observamos novos elementos
  new MutationObserver(() => scan()).observe(document.body, { childList: true, subtree: true });
}
