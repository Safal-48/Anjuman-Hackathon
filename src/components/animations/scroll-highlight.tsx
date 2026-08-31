"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type FontStyle = React.CSSProperties;
export type SplitBy = "characters" | "words";
export type ScrollPosition =
  | "top top"
  | "top center"
  | "top bottom"
  | "top 80%"
  | "top 70%"
  | "top 60%"
  | "center top"
  | "center center"
  | "center bottom"
  | "bottom top"
  | "bottom center"
  | "bottom bottom"
  | string;

export interface ScrollHighlightProps {
  className?: string;
  containerClassName?: string;
  text?: string;
  font?: FontStyle;
  dimColor?: string;
  highlightColor?: string;
  splitBy?: SplitBy;
  scrollStart?: ScrollPosition;
  scrollEnd?: ScrollPosition;
  scrub?: boolean | number;
  style?: React.CSSProperties;
}

const CHAR_STAGGER = 0.03;
const WORD_STAGGER = 0.08;

export default function ScrollHighlight({
  className,
  containerClassName,
  text = "Bridging the gap between what students learn, and what industry needs. Turning skills into opportunities, and potential into careers.",
  font = {
    fontFamily: "var(--font-sans), Inter, system-ui, sans-serif",
    fontSize: "clamp(1.75rem, 4vw, 3.25rem)",
    fontWeight: 700,
    letterSpacing: "-0.03em",
    lineHeight: "1.25em",
    textAlign: "center",
  },
  dimColor = "rgba(255, 255, 255, 0.18)",
  highlightColor = "#FFFFFF",
  splitBy = "words",
  scrollStart = "top 75%",
  scrollEnd = "bottom 40%",
  scrub = 0.8,
  style,
}: ScrollHighlightProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const words = text.trim().split(/\s+/).filter(Boolean);
  const chars = Array.from(text);
  const stagger = splitBy === "characters" ? CHAR_STAGGER : WORD_STAGGER;

  useEffect(() => {
    const paragraph = containerRef.current;
    if (!paragraph || typeof window === "undefined") return;

    const targets = paragraph.querySelectorAll(
      splitBy === "characters" ? ".char" : ".word"
    );

    const ctx = gsap.context(() => {
      gsap.set(targets, {
        color: dimColor,
        opacity: 0.35,
      });

      gsap.to(targets, {
        color: highlightColor,
        opacity: 1,
        stagger,
        ease: "none",
        scrollTrigger: {
          trigger: paragraph,
          start: scrollStart,
          end: scrollEnd,
          scrub: scrub === true ? 1 : scrub,
        },
      });
    }, paragraph);

    return () => ctx.revert();
  }, [
    text,
    dimColor,
    highlightColor,
    splitBy,
    stagger,
    scrollStart,
    scrollEnd,
    scrub,
  ]);

  return (
    <div
      ref={wrapperRef}
      className={cn("w-full py-16 md:py-24 flex items-center justify-center relative", containerClassName)}
      style={style}
    >
      <p
        ref={containerRef}
        className={cn("max-w-5xl mx-auto px-4 leading-tight font-bold select-none", className)}
        style={{
          margin: 0,
          display: "inline-block",
          whiteSpace: "pre-wrap",
          color: dimColor,
          ...font,
        }}
      >
        {splitBy === "characters"
          ? chars.map((char, index) => (
              <span
                key={`${char}-${index}`}
                className="char transition-colors duration-100 inline-block"
                style={{
                  color: dimColor,
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))
          : words.map((word, index) => (
              <React.Fragment key={`${word}-${index}`}>
                <span
                  className="word transition-colors duration-100 inline-block"
                  style={{
                    color: dimColor,
                  }}
                >
                  {word}
                </span>
                {index < words.length - 1 ? " " : null}
              </React.Fragment>
            ))}
      </p>
    </div>
  );
}

export { ScrollHighlight };
