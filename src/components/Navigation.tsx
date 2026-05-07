// import { OSI_LAYERS } from "../data/layers";
// import { LAYER_GRADIENT } from "../lib/layerDesign";
// import { DelayedTooltip } from "./DelayedTooltip";
// import { useSimulatorStore } from "../store/simulatorStore";

// export function Navigation() {
//   const currentLayerIndex = useSimulatorStore((s) => s.currentLayerIndex);

//   const layer = OSI_LAYERS[currentLayerIndex];
//   const total = OSI_LAYERS.length;
//   const progress = ((currentLayerIndex + 1) / total) * 100;

//   return (
//     <header className="border-b border-[#F0E6D2] bg-white shadow-card">
//       <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-5 md:px-6 lg:px-8">
//         <DelayedTooltip
//           content="Move between OSI layers from Application (7) down to Physical (1). Each layer’s settings influence the rest of the stack."
//           delayMs={500}
//         >
//           <div className="cursor-default">
//             <h1 className="text-[20px] font-semibold leading-tight text-[#444]">
//               OSI 7-Layer Simulator
//             </h1>
//             <p className="mt-1 text-[20px] font-semibold leading-snug text-[#444]">
//               Layer {layer.number} of {total} — {layer.name} Layer
//             </p>
//           </div>
//         </DelayedTooltip>

//         <DelayedTooltip
//           content="Progress through all seven OSI layers. Layer 7 is closest to the user; Layer 1 is the physical medium."
//           delayMs={500}
//         >
//           <div className="cursor-default">
//             <div className="mb-2 flex justify-between text-[14px] text-[#888]">
//               <span>
//                 {currentLayerIndex + 1}/{total}
//               </span>
//               <span>{Math.round(progress)}%</span>
//             </div>
//             <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
//               <div
//                 className="h-full rounded-full transition-[width] duration-300 ease-out"
//                 style={{
//                   width: `${progress}%`,
//                   background: LAYER_GRADIENT,
//                 }}
//               />
//             </div>
//           </div>
//         </DelayedTooltip>
//       </div>
//     </header>
//   );
// }


import { motion } from "framer-motion";

import { OSI_LAYERS } from "../data/layers";
import { DelayedTooltip } from "./DelayedTooltip";
import { useSimulatorStore } from "../store/simulatorStore";

export function Navigation() {
  const currentLayerIndex =
    useSimulatorStore(
      (s) => s.currentLayerIndex
    );

  const layer =
    OSI_LAYERS[currentLayerIndex];

  const total = OSI_LAYERS.length;

  const progress =
    ((currentLayerIndex + 1) / total) *
    100;

  return (
    <header
      className="
        top-0 z-50
        border-b border-white/10
        bg-[#050B16]/80
        backdrop-blur-2xl
        shadow-[0_12px_40px_rgba(0,0,0,0.45)]
      "
    >
      <div
        className="
          relative mx-auto
          max-w-[1400px]
          overflow-hidden
          px-4 py-4
          md:px-6 lg:px-8
        "
      >
        {/* ambient glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div
            className="
              flex flex-col gap-5
              xl:flex-row xl:items-center xl:justify-between
            "
          >
            {/* LEFT */}
            <DelayedTooltip
              content="Navigate through all seven OSI layers from Application to Physical."
              delayMs={500}
            >
              <div className="cursor-default">
                {/* badge */}
                <div
                  className="
                    inline-flex items-center gap-3
                    rounded-full
                    border border-white/10
                    bg-white/[0.04]
                    px-4 py-2
                    backdrop-blur-xl
                  "
                >
                  <div className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />

                  <span
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.35em]
                      text-white/50
                    "
                  >
                    FlowTrace
                  </span>
                </div>

                {/* heading */}
                <h1
                  className="
                    mt-4
                    text-[clamp(28px,4vw,52px)]
                    font-black
                    leading-none
                    tracking-[-2px]
                    text-white
                  "
                >
                  {layer.name}
                </h1>

                {/* sub */}
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span
                    className="
                      rounded-2xl
                      border border-cyan-400/10
                      bg-cyan-400/10
                      px-4 py-2
                      text-sm
                      font-bold
                      tracking-wide
                      text-cyan-300
                    "
                  >
                    Layer {layer.number}
                  </span>

                  <span
                    className="
                      text-[14px]
                      font-medium
                      text-white/45
                    "
                  >
                    {currentLayerIndex + 1} of{" "}
                    {total} layers
                  </span>
                </div>
              </div>
            </DelayedTooltip>

            {/* RIGHT STATUS */}
            <div
              className="
                flex flex-wrap items-center gap-3
              "
            >
              <StatusCard
                label="CURRENT"
                value={`L${layer.number}`}
                accent="cyan"
              />

              <StatusCard
                label="STACK"
                value={`${total}`}
                accent="violet"
              />

              <StatusCard
                label="PROGRESS"
                value={`${Math.round(progress)}%`}
                accent="emerald"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------- */
/* STATUS CARD */
/* -------------------------------- */

function StatusCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent:
    | "cyan"
    | "violet"
    | "emerald";
}) {
  const styles = {
    cyan:
      "border-cyan-400/10 bg-cyan-400/10 text-cyan-300",

    violet:
      "border-violet-400/10 bg-violet-400/10 text-violet-300",

    emerald:
      "border-emerald-400/10 bg-emerald-400/10 text-emerald-300",
  };

  return (
    <motion.div
      whileHover={{
        y: -2,
      }}
      className={`
        rounded-[22px]
        border
        px-4 py-3
        backdrop-blur-xl
        ${styles[accent]}
      `}
    >
      <div
        className="
          text-[10px]
          font-bold
          uppercase
          tracking-[0.3em]
          opacity-60
        "
      >
        {label}
      </div>

      <div
        className="
          mt-2
          text-[24px]
          font-black
          leading-none
          tracking-[-1px]
        "
      >
        {value}
      </div>
    </motion.div>
  );
}