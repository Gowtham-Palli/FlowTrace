// import type { ReactNode } from "react";
// import { getLayerDesign } from "../../lib/layerDesign";

// type Props = {
//   layer: number;
//   children: ReactNode;
//   className?: string;
//   /** Inner padding — default 32px (tokens), tablet 24px */
//   contentClassName?: string;
// };

// /**
//  * White card: 24px radius, 32px padding, 6px accent stripe, soft lift on hover.
//  */
// export function LayerCard({
//   layer,
//   children,
//   className = "",
//   contentClassName = "p-8 max-md:p-6",
// }: Props) {
//   const t = getLayerDesign(layer);
//   return (
//     <div
//       className={`group overflow-hidden rounded-[24px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] focus-within:ring-[3px] focus-within:ring-offset-2 focus-within:ring-offset-[#FFF9F0] ${className}`}
//       style={
//         {
//           "--layer-accent": t.accent,
//           "--tw-ring-color": t.accent,
//         } as React.CSSProperties
//       }
//     >
//       <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: t.soft }} aria-hidden />
//       <div className={contentClassName}>{children}</div>
//     </div>
//   );
// }


import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { getLayerDesign } from "../../lib/layerDesign";

type Props = {
  layer: number;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

/**
 * Improved futuristic Layer Card
 * Better readability + softer overlays
 */
export function LayerCard({
  layer,
  children,
  className = "",
  contentClassName = "p-8 max-md:p-6",
}: Props) {
  const t = getLayerDesign(layer);

  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      transition={{
        duration: 0.22,
      }}
      className={`
        group relative overflow-hidden
        rounded-[34px]
        border border-white/10
        bg-[#0B1727]
        shadow-[0_20px_70px_rgba(0,0,0,0.45)]
        backdrop-blur-2xl
        transition-all duration-300
        ${className}
      `}
      style={
        {
          "--layer-accent": t.accent,
        } as React.CSSProperties
      }
    >
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* TOP GLOW */}
        <div
          className="
            absolute right-0 top-0
            h-64 w-64
            rounded-full
            blur-3xl
            opacity-[0.08]
            transition-opacity duration-300
            group-hover:opacity-[0.14]
          "
          style={{
            background: t.accent,
          }}
        />

        {/* BOTTOM GLOW */}
        <div
          className="
            absolute bottom-0 left-0
            h-56 w-56
            rounded-full
            blur-3xl
            opacity-[0.05]
          "
          style={{
            background: t.soft,
          }}
        />

        {/* GRID */}
        <div
          className="
            absolute inset-0 opacity-[0.02]
          "
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* DARK OVERLAY FOR TEXT CONTRAST */}
        <div className="absolute inset-0 bg-[#07111F]/35" />
      </div>

      {/* TOP ACCENT */}
      <div
        className="
          relative z-10
          h-[4px] w-full
        "
        style={{
          background: `linear-gradient(90deg, ${t.accent}, ${t.chart})`,
        }}
      />

      {/* INNER BORDER */}
      <div
        className="
          pointer-events-none absolute inset-0
          rounded-[34px]
          border border-white/[0.04]
        "
      />

      {/* CONTENT */}
      <div
        className={`
          relative z-20
          text-white
          [&_h1]:text-white
          [&_h1]:font-black
          [&_h2]:text-white
          [&_h2]:font-black
          [&_h3]:text-white
          [&_h3]:font-bold
          [&_p]:text-white/75
          [&_span]:text-white/80
          [&_label]:text-white/70
          [&_li]:text-white/75
          ${contentClassName}
        `}
      >
        {children}
      </div>

      {/* HOVER SHINE */}
      <div
        className="
          pointer-events-none absolute inset-0
          opacity-0 transition-opacity duration-500
          group-hover:opacity-100
        "
      >
        <div
          className="
            absolute -left-1/2 top-0
            h-full w-1/2
            rotate-12
            bg-gradient-to-r
            from-transparent
            via-white/[0.03]
            to-transparent
            blur-2xl
          "
        />
      </div>
    </motion.div>
  );
}