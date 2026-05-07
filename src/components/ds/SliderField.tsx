// import type { CSSProperties, InputHTMLAttributes, ReactNode } from "react";
// import { getLayerDesign } from "../../lib/layerDesign";
// import { DelayedTooltip } from "../DelayedTooltip";

// type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
//   layer: number;
//   label: ReactNode;
//   tooltip: ReactNode;
//   valueDisplay: string;
// };

// export function SliderField({
//   layer,
//   label,
//   tooltip,
//   valueDisplay,
//   className = "",
//   id,
//   min,
//   max,
//   value,
//   ...rest
// }: Props) {
//   const t = getLayerDesign(layer);
//   const inputId = id ?? `slider-${layer}`;
//   const mn = Number(min ?? 0);
//   const mx = Number(max ?? 100);
//   const v = Number(value ?? 0);
//   const fillPct = mx === mn ? 0 : ((v - mn) / (mx - mn)) * 100;

//   const rangeStyle: CSSProperties & Record<string, string | number> = {
//     "--accent": t.accent,
//     "--fill-pct": `${fillPct}%`,
//   };

//   return (
//     <div className={`flex flex-col gap-[10px] ${className}`}>
//       <div className="flex flex-wrap items-start justify-between gap-3">
//         <DelayedTooltip content={tooltip} delayMs={500}>
//           <label
//             htmlFor={inputId}
//             className="cursor-help border-b border-dotted border-[#CCC] text-[18px] font-medium leading-snug text-[#333]"
//           >
//             {label}
//           </label>
//         </DelayedTooltip>
//         <span
//           className="shrink-0 text-[20px] font-bold tabular-nums"
//           style={{ color: t.accent }}
//           aria-live="polite"
//         >
//           {valueDisplay}
//         </span>
//       </div>
//       <input
//         id={inputId}
//         type="range"
//         min={min}
//         max={max}
//         value={value}
//         className="ds-range h-1.5 w-full cursor-pointer"
//         style={rangeStyle}
//         {...rest}
//       />
//     </div>
//   );
// }



import type {
  CSSProperties,
  InputHTMLAttributes,
  ReactNode,
} from "react";

import { motion } from "framer-motion";

import { getLayerDesign } from "../../lib/layerDesign";
import { DelayedTooltip } from "../DelayedTooltip";

type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  layer: number;
  label: ReactNode;
  tooltip: ReactNode;
  valueDisplay: string;
};

/**
 * Futuristic Slider Field
 * - glassmorphism
 * - neon accent
 * - dark UI optimized
 * - better visibility
 */
export function SliderField({
  layer,
  label,
  tooltip,
  valueDisplay,
  className = "",
  id,
  min,
  max,
  value,
  ...rest
}: Props) {
  const t = getLayerDesign(layer);

  const inputId =
    id ?? `slider-${layer}`;

  const mn = Number(min ?? 0);

  const mx = Number(max ?? 100);

  const v = Number(value ?? 0);

  const fillPct =
    mx === mn
      ? 0
      : ((v - mn) / (mx - mn)) * 100;

  const rangeStyle: CSSProperties &
    Record<string, string | number> =
    {
      "--accent": t.accent,
      "--fill-pct": `${fillPct}%`,
    };

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
        duration: 0.22,
      }}
      className={`
        flex flex-col gap-4
        ${className}
      `}
    >
      {/* HEADER */}
      <div
        className="
          flex flex-wrap items-start justify-between gap-4
        "
      >
        {/* LABEL */}
        <DelayedTooltip
          content={tooltip}
          delayMs={500}
        >
          <label
            htmlFor={inputId}
            className="
              group inline-flex cursor-help
              items-center gap-3
            "
          >
            {/* accent dot */}
            <div
              className="
                relative flex h-3 w-3
                items-center justify-center
              "
            >
              <div
                className="absolute h-3 w-3 rounded-full blur-sm opacity-40"
                style={{
                  background: t.accent,
                }}
              />

              <div
                className="relative h-2.5 w-2.5 rounded-full"
                style={{
                  background: t.accent,
                }}
              />
            </div>

            {/* label text */}
            <span
              className="
                border-b border-dotted border-white/15
                text-[15px]
                font-semibold
                tracking-wide
                text-white/80
                transition-colors duration-200
                group-hover:text-white
              "
            >
              {label}
            </span>
          </label>
        </DelayedTooltip>

        {/* VALUE DISPLAY */}
        <motion.div
          key={valueDisplay}
          initial={{
            scale: 0.96,
            opacity: 0.7,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            duration: 0.18,
          }}
          className="
            shrink-0
            rounded-2xl
            border border-white/10
            bg-white/[0.04]
            px-4 py-2
            backdrop-blur-xl
          "
          style={{
            boxShadow: `0 0 25px ${t.accent}15`,
          }}
        >
          <span
            className="
              font-mono
              text-[18px]
              font-black
              tracking-[-0.5px]
            "
            style={{
              color: t.accent,
            }}
            aria-live="polite"
          >
            {valueDisplay}
          </span>
        </motion.div>
      </div>

      {/* SLIDER CONTAINER */}
      <div
        className="
          relative flex items-center
        "
      >
        {/* glow */}
        <div
          className="
            pointer-events-none absolute inset-0
            rounded-full blur-xl
            opacity-20
          "
          style={{
            background: t.accent,
          }}
        />

        {/* track */}
        <div
          className="
            absolute h-[10px] w-full
            overflow-hidden rounded-full
            bg-white/[0.06]
            backdrop-blur-xl
          "
        >
          {/* fill */}
          <motion.div
            className="
              absolute left-0 top-0 h-full
              rounded-full
            "
            animate={{
              width: `${fillPct}%`,
            }}
            transition={{
              duration: 0.15,
            }}
            style={{
              background: `linear-gradient(90deg, ${t.accent}, ${t.chart})`,
              boxShadow: `0 0 25px ${t.accent}60`,
            }}
          >
            {/* shine */}
            <div
              className="
                absolute inset-0 opacity-40
              "
              style={{
                background:
                  "linear-gradient(to right, rgba(255,255,255,0.3), transparent)",
              }}
            />
          </motion.div>
        </div>

        {/* range input */}
        <input
          id={inputId}
          type="range"
          min={min}
          max={max}
          value={value}
          className="
            relative z-10
            h-[28px] w-full
            cursor-pointer
            appearance-none
            bg-transparent

            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:w-6
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:border
            [&::-webkit-slider-thumb]:border-white/10
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:shadow-[0_4px_20px_rgba(0,0,0,0.35)]
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:duration-200
            hover:[&::-webkit-slider-thumb]:scale-110

            [&::-moz-range-thumb]:h-6
            [&::-moz-range-thumb]:w-6
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:border
            [&::-moz-range-thumb]:border-white/10
            [&::-moz-range-thumb]:bg-white
          "
          style={rangeStyle}
          {...rest}
        />

        {/* thumb glow */}
        <div
          className="
            pointer-events-none absolute top-1/2
            h-8 w-8
            -translate-y-1/2
            rounded-full blur-xl
          "
          style={{
            left: `calc(${fillPct}% - 16px)`,
            background: t.accent,
            opacity: 0.35,
          }}
        />
      </div>

      {/* SCALE */}
      <div
        className="
          flex justify-between
          px-1
          text-[11px]
          font-medium
          tracking-wide
          text-white/35
        "
      >
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </motion.div>
  );
}