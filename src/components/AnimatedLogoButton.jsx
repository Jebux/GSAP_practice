import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function AnimatedLogoButton() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    // Scope seguro (importantísimo en React) + cleanup automático
    const ctx = gsap.context(() => {
      const paths = gsap.utils.toArray(".js-draw-path");
      const button = document.querySelector(".js-button");
      const ring = document.querySelector(".js-ring");
      const iconGroup = document.querySelector(".js-icon");

      // --- 1) Draw on mount ---
      // Para "draw", configuramos dasharray/dashoffset según el largo real del path.
      paths.forEach((p) => {
        const length = p.getTotalLength();
        gsap.set(p, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 1,
        });
      });

      const intro = gsap.timeline({ defaults: { ease: "power2.out" } });

      intro
        .to(paths, {
          strokeDashoffset: 0,
          duration: 1.1,
          stagger: 0.08,
        })
        .fromTo(
          iconGroup,
          { scale: 0.98, opacity: 0.9 },
          { scale: 1, opacity: 1, duration: 0.35 },
          "-=0.35"
        );

      // --- 2) Hover timeline (reversible) ---
      const hoverTl = gsap.timeline({ paused: true, defaults: { ease: "power2.out", duration: 0.25 } });

      hoverTl
        .to(button, { scale: 1.02 }, 0)
        .to(ring, { opacity: 1 }, 0)
        .to(ring, { strokeDashoffset: 0, duration: 0.35 }, 0);

      // Prepara ring dash para animar el borde
      const ringLength = ring.getTotalLength();
      gsap.set(ring, {
        strokeDasharray: ringLength,
        strokeDashoffset: ringLength,
        opacity: 0,
      });

      const onEnter = () => hoverTl.play();
      const onLeave = () => hoverTl.reverse();

      button.addEventListener("mouseenter", onEnter);
      button.addEventListener("mouseleave", onLeave);

      // Cleanup manual de listeners
      return () => {
        button.removeEventListener("mouseenter", onEnter);
        button.removeEventListener("mouseleave", onLeave);
      };
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} style={{ display: "grid", placeItems: "center", padding: 24 }}>
      <button
        className="js-button"
        style={{
          border: "1px solid rgba(255,255,255,0.18)",
          background: "rgba(255,255,255,0.06)",
          borderRadius: 16,
          padding: "14px 18px",
          cursor: "pointer",
          transformOrigin: "center",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
        aria-label="Animated button"
      >
        <svg
          width="220"
          height="64"
          viewBox="0 0 220 64"
          role="img"
          aria-hidden="true"
          style={{ display: "block", overflow: "visible" }}
        >
          {/* Ring (animated border) */}
          <path
            className="js-ring"
            d="M16 8 H204 A8 8 0 0 1 212 16 V48 A8 8 0 0 1 204 56 H16 A8 8 0 0 1 8 48 V16 A8 8 0 0 1 16 8 Z"
            fill="none"
            stroke="rgba(211, 88, 88, 0.65)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Icon group */}
          <g className="js-icon" transform="translate(22, 14)">
            <path
              className="js-draw-path"
              d="M6 30 C6 14, 14 6, 28 6 C40 6, 48 13, 50 25"
              fill="none"
              stroke="rgba(255, 0, 0, 0.9)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              className="js-draw-path"
              d="M50 25 C52 37, 44 48, 30 50 C16 52, 7 44, 6 30"
              fill="none"
              stroke="rgba(142, 206, 99, 0.9)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              className="js-draw-path"
              d="M22 26 L30 34 L44 18"
              fill="none"
              stroke="rgba(71, 125, 224, 0.9)"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Label (no draw, just text) */}
          <text
            x="86"
            y="39"
            fill="rgba(153, 26, 26, 0.92)"
            fontSize="14"
            fontFamily="Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial"
            letterSpacing="0.4"
          >
            Dynamic Interface
          </text>
        </svg>
      </button>
    </div>
  );
}
