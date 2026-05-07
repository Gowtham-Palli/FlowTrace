// /** White floating tooltip for Recharts — matches design system */
// export function ChartTooltipContent(props: {
//   active?: boolean;
//   payload?: ReadonlyArray<{ name?: string; value?: number | string; color?: string; dataKey?: string }>;
//   label?: string | number;
// }) {
//   const { active, payload } = props;
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="rounded-xl border border-[#EEE] bg-white px-3 py-2 text-[16px] shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-opacity duration-300">
//       {payload.map((p, i) => (
//         <div key={i} className="font-medium tabular-nums text-[#1A1A1A]">
//           {(p.name ?? p.dataKey ?? "Value") + ": "}
//           {p.value}
//         </div>
//       ))}
//     </div>
//   );
// }


import { motion, AnimatePresence } from "framer-motion";

/**
 * Futuristic glassmorphism chart tooltip
 * Designed for Recharts
 */
export function ChartTooltipContent(props: {
  active?: boolean;

  payload?: ReadonlyArray<{
    name?: string;
    value?: number | string;
    color?: string;
    dataKey?: string;
  }>;

  label?: string | number;
}) {
  const { active, payload } = props;

  if (!active || !payload?.length) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
          y: 8,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: 6,
          scale: 0.96,
        }}
        transition={{
          duration: 0.18,
          ease: "easeOut",
        }}
        className="
          relative overflow-hidden
          rounded-2xl
          border border-white/10
          bg-[#07111F]/95
          p-4
          backdrop-blur-2xl
          shadow-[0_20px_60px_rgba(0,0,0,0.45)]
        "
      >
        {/* ambient glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-10 top-0 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />
        </div>

        {/* top label */}
        <div
          className="
            relative z-10
            mb-3
            border-b border-white/10
            pb-3
          "
        >
          <div
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.35em]
              text-white/40
            "
          >
            LIVE METRIC
          </div>

          <div
            className="
              mt-1
              text-sm
              font-semibold
              text-white
            "
          >
            Real-Time Data Point
          </div>
        </div>

        {/* values */}
        <div className="relative z-10 flex flex-col gap-3">
          {payload.map((p, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                x: -4,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: i * 0.03,
              }}
              className="
                flex items-center justify-between gap-5
                rounded-xl
                border border-white/5
                bg-white/[0.03]
                px-3 py-2.5
              "
            >
              {/* LEFT */}
              <div className="flex items-center gap-3">
                {/* indicator */}
                <div
                  className="
                    h-3 w-3 rounded-full
                    shadow-[0_0_12px_rgba(255,255,255,0.2)]
                  "
                  style={{
                    background:
                      p.color ||
                      "#22D3EE",
                  }}
                />

                <span
                  className="
                    text-[13px]
                    font-medium
                    tracking-wide
                    text-white/65
                  "
                >
                  {p.name ??
                    p.dataKey ??
                    "Value"}
                </span>
              </div>

              {/* VALUE */}
              <span
                className="
                  text-right
                  font-mono
                  text-[15px]
                  font-black
                  tracking-[-0.5px]
                  text-white
                "
              >
                {p.value}
              </span>
            </motion.div>
          ))}
        </div>

        {/* bottom line */}
        <div
          className="
            relative z-10
            mt-4
            flex items-center gap-2
            text-[11px]
            text-cyan-300/55
          "
        >
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />

          Live simulation telemetry
        </div>
      </motion.div>
    </AnimatePresence>
  );
}