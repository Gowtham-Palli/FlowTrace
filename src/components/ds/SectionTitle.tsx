// import type { ReactNode } from "react";

// export function SectionTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
//   return (
//     <h3
//       className={`text-[22px] font-semibold leading-tight tracking-[-0.3px] text-[#1A1A1A] ${className}`}
//     >
//       {children}
//     </h3>
//   );
// }


import type { ReactNode } from "react";
import { motion } from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;

  /** optional accent glow */
  accent?: string;

  /** subtle glow effect */
  glow?: boolean;
};

/**
 * Futuristic section title
 * - optimized for dark UI
 * - better readability
 * - optional accent glow
 */
export function SectionTitle({
  children,
  className = "",
  accent = "#22D3EE",
  glow = false,
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 6,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
      className={`
        relative inline-flex flex-col
        ${className}
      `}
    >
      {/* label */}
      <div
        className="
          mb-2
          flex items-center gap-3
        "
      >
        {/* glowing dot */}
        <div
          className="
            relative flex h-3 w-3
            items-center justify-center
          "
        >
          <div
            className="absolute h-3 w-3 rounded-full opacity-40 blur-sm"
            style={{
              background: accent,
            }}
          />

          <div
            className="relative h-2.5 w-2.5 rounded-full"
            style={{
              background: accent,
            }}
          />
        </div>

        {/* top label */}
        <span
          className="
            text-[10px]
            font-bold
            uppercase
            tracking-[0.35em]
            text-white/40
          "
        >
          SECTION
        </span>
      </div>

      {/* main title */}
      <h3
        className="
          relative
          text-[28px]
          font-black
          leading-none
          tracking-[-1px]
          text-white
        "
        style={{
          textShadow: glow
            ? `0 0 24px ${accent}25`
            : "none",
        }}
      >
        {children}
      </h3>

      {/* underline */}
      <motion.div
        initial={{
          width: 0,
        }}
        animate={{
          width: "72px",
        }}
        transition={{
          duration: 0.35,
          delay: 0.1,
        }}
        className="
          mt-4
          h-[3px]
          rounded-full
        "
        style={{
          background: `linear-gradient(90deg, ${accent}, transparent)`,
        }}
      />
    </motion.div>
  );
}