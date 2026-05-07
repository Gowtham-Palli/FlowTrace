// import type { CSSProperties } from "react";

// type Props = {
//   checked: boolean;
//   onChange: (v: boolean) => void;
//   accent: string;
//   id?: string;
//   "aria-label"?: string;
// };

// /** ~60×32 pill toggle with accent active state */
// export function PillSwitch({ checked, onChange, accent, id, "aria-label": ariaLabel }: Props) {
//   const style: CSSProperties & { "--accent"?: string } = {
//     backgroundColor: checked ? accent : "#E5E5E5",
//     "--accent": accent,
//   };

//   return (
//     <button
//       id={id}
//       type="button"
//       role="switch"
//       aria-checked={checked}
//       aria-label={ariaLabel}
//       onClick={() => onChange(!checked)}
//       className="relative h-8 w-[60px] shrink-0 rounded-full transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF9F0]"
//       style={style}
//     >
//       <span
//         className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-200 ease-out ${
//           checked ? "right-1" : "left-1"
//         }`}
//       />
//     </button>
//   );
// }


import type { CSSProperties } from "react";
import { motion } from "framer-motion";

type Props = {
  checked: boolean;
  onChange: (v: boolean) => void;
  accent: string;
  id?: string;
  "aria-label"?: string;
};

/**
 * Futuristic glassmorphism toggle switch
 * - neon glow
 * - smooth spring motion
 * - dark UI optimized
 */
export function PillSwitch({
  checked,
  onChange,
  accent,
  id,
  "aria-label": ariaLabel,
}: Props) {
  const style: CSSProperties & {
    "--accent"?: string;
  } = {
    "--accent": accent,
  };

  return (
    <motion.button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      whileTap={{
        scale: 0.96,
      }}
      className={`
        group relative
        h-9 w-[68px]
        shrink-0
        overflow-hidden
        rounded-full
        border
        transition-all duration-300
        focus-visible:outline-none
        ${
          checked
            ? "border-white/10"
            : "border-white/5"
        }
      `}
      style={{
        ...style,
        background: checked
          ? `linear-gradient(135deg, ${accent}, ${accent}CC)`
          : "rgba(255,255,255,0.06)",
        boxShadow: checked
          ? `0 0 30px ${accent}35`
          : "none",
      }}
    >
      {/* background glow */}
      <div
        className={`
          absolute inset-0 transition-opacity duration-300
          ${
            checked
              ? "opacity-100"
              : "opacity-0"
          }
        `}
      >
        <div
          className="
            absolute inset-0
            blur-xl
          "
          style={{
            background: accent,
            opacity: 0.25,
          }}
        />
      </div>

      {/* inner overlay */}
      <div
        className="
          absolute inset-[1px]
          rounded-full
          bg-black/10
          backdrop-blur-xl
        "
      />

      {/* moving knob */}
      <motion.span
        layout
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        className={`
          absolute top-1
          flex h-7 w-7
          items-center justify-center
          rounded-full
          border border-white/10
          bg-white
          shadow-[0_4px_20px_rgba(0,0,0,0.35)]
        `}
        animate={{
          left: checked
            ? "calc(100% - 32px)"
            : "4px",
        }}
      >
        {/* inner dot */}
        <div
          className="
            h-2.5 w-2.5 rounded-full
            transition-all duration-300
          "
          style={{
            background: checked
              ? accent
              : "#94A3B8",
            boxShadow: checked
              ? `0 0 12px ${accent}`
              : "none",
          }}
        />
      </motion.span>

      {/* ON label */}
      <div
        className={`
          absolute left-3 top-1/2
          -translate-y-1/2
          text-[10px]
          font-bold
          tracking-[0.2em]
          text-white/70
          transition-opacity duration-300
          ${
            checked
              ? "opacity-0"
              : "opacity-100"
          }
        `}
      >
        OFF
      </div>

      {/* OFF label */}
      <div
        className={`
          absolute right-3 top-1/2
          -translate-y-1/2
          text-[10px]
          font-bold
          tracking-[0.2em]
          text-white
          transition-opacity duration-300
          ${
            checked
              ? "opacity-100"
              : "opacity-0"
          }
        `}
      >
        ON
      </div>
    </motion.button>
  );
}