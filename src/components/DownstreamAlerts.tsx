// import { computeDownstreamWarnings } from "../store/simulatorStore";
// import { useSimulatorStore } from "../store/simulatorStore";
// import { DelayedTooltip } from "./DelayedTooltip";

// type Props = {
//   /** If set, only show warnings targeting this OSI layer number */
//   filterLayer?: number;
// };

// export function DownstreamAlerts({ filterLayer }: Props) {
//   const application = useSimulatorStore((s) => s.application);
//   const all = computeDownstreamWarnings(application);
//   const warnings = filterLayer
//     ? all.filter((w) => w.targetLayer === filterLayer)
//     : all;

//   if (warnings.length === 0) return null;

//   return (
//     <div className="rounded-[20px] border border-[#FFE0B2] bg-[#FFF4E0] px-5 py-4 text-[16px] leading-relaxed text-[#5C4A21] shadow-sm">
//       <div className="mb-2 flex items-center gap-2 text-[18px] font-semibold text-[#8B6914]">
//         <span aria-hidden className="text-[#C97D2E]">
//           ●
//         </span>
//         <DelayedTooltip
//           content="Layer 7 choices propagate down the stack. These hints preview pressure on transport, network, link, and physical layers once you configure them."
//           delayMs={500}
//         >
//           <span className="cursor-default">Downstream impact from Application layer</span>
//         </DelayedTooltip>
//       </div>
//       <ul className="list-inside list-disc space-y-2 text-[#4A4A4A]">
//         {warnings.map((w) => (
//           <li key={w.message}>
//             <span className="font-semibold text-[#C97D2E]">L{w.targetLayer}: </span>
//             {w.message}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }


import { motion, AnimatePresence } from "framer-motion";

import { computeDownstreamWarnings } from "../store/simulatorStore";
import { useSimulatorStore } from "../store/simulatorStore";
import { DelayedTooltip } from "./DelayedTooltip";

type Props = {
  /** Show warnings for specific OSI layer */
  filterLayer?: number;
};

export function DownstreamAlerts({
  filterLayer,
}: Props) {
  const application = useSimulatorStore(
    (s) => s.application
  );

  const all =
    computeDownstreamWarnings(application);

  const warnings = filterLayer
    ? all.filter(
        (w) =>
          w.targetLayer === filterLayer
      )
    : all;

  if (warnings.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
          y: 14,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: 10,
        }}
        transition={{
          duration: 0.3,
        }}
        className="
          relative overflow-hidden
          rounded-[34px]
          border border-orange-400/10
          bg-[#07111F]
          p-6
          shadow-[0_20px_70px_rgba(0,0,0,0.45)]
        "
      >
        {/* ambient glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-0 h-60 w-60 rounded-full bg-orange-400/10 blur-3xl" />

          <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full bg-red-500/10 blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* HEADER */}
          <div
            className="
              flex flex-wrap items-start gap-4
              border-b border-white/10
              pb-5
            "
          >
            {/* icon */}
            <div
              className="
                relative flex h-14 w-14 shrink-0
                items-center justify-center
                rounded-2xl
                border border-orange-400/10
                bg-orange-400/10
                backdrop-blur-xl
              "
            >
              {/* pulse */}
              <div className="absolute h-3 w-3 rounded-full bg-orange-400 animate-ping opacity-50" />

              <div className="relative h-3 w-3 rounded-full bg-orange-300" />
            </div>

            {/* title */}
            <div className="flex-1">
              <div
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.3em]
                  text-orange-300/60
                "
              >
                DOWNSTREAM ANALYSIS
              </div>

              <DelayedTooltip
                content="Application-layer decisions create cascading effects across Transport, Network, Data Link, and Physical layers."
                delayMs={500}
              >
                <h3
                  className="
                    mt-2
                    cursor-default
                    text-[28px]
                    font-black
                    leading-none
                    tracking-[-1px]
                    text-white
                  "
                >
                  Network Impact Alerts
                </h3>
              </DelayedTooltip>

              <p
                className="
                  mt-3
                  max-w-2xl
                  text-[14px]
                  leading-relaxed
                  text-white/55
                "
              >
                Real-time warnings generated from
                current simulation parameters and
                protocol behavior.
              </p>
            </div>
          </div>

          {/* ALERT LIST */}
          <div className="mt-6 flex flex-col gap-4">
            {warnings.map((w, i) => (
              <motion.div
                key={w.message}
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: i * 0.05,
                }}
                whileHover={{
                  y: -2,
                }}
                className="
                  group relative overflow-hidden
                  rounded-[26px]
                  border border-white/10
                  bg-white/[0.04]
                  p-5
                  backdrop-blur-xl
                  transition-all
                "
              >
                {/* hover glow */}
                <div
                  className="
                    absolute inset-0 opacity-0
                    transition-opacity duration-300
                    group-hover:opacity-100
                    bg-gradient-to-r
                    from-orange-400/5
                    via-transparent
                    to-red-400/5
                  "
                />

                <div className="relative z-10 flex items-start gap-4">
                  {/* layer badge */}
                  <div
                    className="
                      flex h-12 w-12 shrink-0
                      items-center justify-center
                      rounded-2xl
                      border border-orange-400/10
                      bg-orange-400/10
                      text-sm
                      font-black
                      text-orange-300
                    "
                  >
                    L{w.targetLayer}
                  </div>

                  {/* content */}
                  <div className="flex-1">
                    <div
                      className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-[0.25em]
                        text-white/35
                      "
                    >
                      Impact Detected
                    </div>

                    <p
                      className="
                        mt-2
                        text-[15px]
                        leading-relaxed
                        text-white/80
                      "
                    >
                      {w.message}
                    </p>
                  </div>

                  {/* severity indicator */}
                  <div
                    className="
                      mt-1 h-2.5 w-2.5 shrink-0
                      rounded-full
                      bg-orange-400
                    "
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* FOOTER */}
          <div
            className="
              mt-7
              rounded-2xl
              border border-cyan-400/10
              bg-cyan-400/5
              px-5 py-4
              backdrop-blur-xl
            "
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300" />

              <p
                className="
                  text-[14px]
                  leading-relaxed
                  text-cyan-100/75
                "
              >
                These alerts dynamically adapt as
                transport protocols, packet sizes,
                throughput, error rates, and physical
                characteristics change throughout the
                simulation.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}