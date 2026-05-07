// import { OSI_LAYERS } from "../data/layers";
// import { useSimulatorStore } from "../store/simulatorStore";
// import { LayerByIndex } from "./LayerByIndex";

// export function CompareLayersPanel() {
//   const compareMode = useSimulatorStore((s) => s.compareMode);
//   const left = useSimulatorStore((s) => s.compareLeftIndex);
//   const right = useSimulatorStore((s) => s.compareRightIndex);
//   const setLeft = useSimulatorStore((s) => s.setCompareLeftIndex);
//   const setRight = useSimulatorStore((s) => s.setCompareRightIndex);

//   if (!compareMode) return null;

//   const layerLeft = OSI_LAYERS[left];
//   const layerRight = OSI_LAYERS[right];

//   return (
//     <div className="overflow-hidden rounded-[24px] border border-[#F0E6D2] bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)]">
//       <div className="mb-8 flex flex-wrap items-end gap-6">
//         <label className="flex flex-col gap-2 text-[16px] font-medium text-[#666]">
//           Layer A
//           <select
//             value={left}
//             onChange={(e) => setLeft(Number(e.target.value))}
//             className="h-12 min-w-[200px] appearance-none rounded-xl border border-[#E0E0E0] bg-white px-4 pr-10 text-[18px] text-[#1A1A1A] shadow-sm focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#6B3FA0] focus-visible:ring-offset-2"
//           >
//             {OSI_LAYERS.map((l, i) => (
//               <option key={l.number} value={i}>
//                 L{l.number} — {l.name}
//               </option>
//             ))}
//           </select>
//         </label>
//         <label className="flex flex-col gap-2 text-[16px] font-medium text-[#666]">
//           Layer B
//           <select
//             value={right}
//             onChange={(e) => setRight(Number(e.target.value))}
//             className="h-12 min-w-[200px] appearance-none rounded-xl border border-[#E0E0E0] bg-white px-4 pr-10 text-[18px] text-[#1A1A1A] shadow-sm focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#6B3FA0] focus-visible:ring-offset-2"
//           >
//             {OSI_LAYERS.map((l, i) => (
//               <option key={l.number} value={i}>
//                 L{l.number} — {l.name}
//               </option>
//             ))}
//           </select>
//         </label>
//         <p className="max-w-md text-[15px] leading-relaxed text-[#666]">
//           Same global simulation state—side-by-side views for comparing responsibilities and visuals.
//         </p>
//       </div>
//       <div className="grid max-h-[75vh] gap-6 overflow-auto lg:grid-cols-2">
//         <div className="min-h-0 overflow-auto rounded-[24px] border border-[#F0F0F0] bg-[#FFF9F0] p-4">
//           <p className="mb-4 text-[14px] font-semibold text-[#6B3FA0]">
//             L{layerLeft.number} — {layerLeft.name}
//           </p>
//           <LayerByIndex index={left} />
//         </div>
//         <div className="min-h-0 overflow-auto rounded-[24px] border border-[#F0F0F0] bg-[#FFF9F0] p-4">
//           <p className="mb-4 text-[14px] font-semibold text-[#6B3FA0]">
//             L{layerRight.number} — {layerRight.name}
//           </p>
//           <LayerByIndex index={right} />
//         </div>
//       </div>
//     </div>
//   );
// }



import { motion } from "framer-motion";
import { OSI_LAYERS } from "../data/layers";
import { useSimulatorStore } from "../store/simulatorStore";
import { LayerByIndex } from "./LayerByIndex";

export function CompareLayersPanel() {
  const compareMode = useSimulatorStore((s) => s.compareMode);
  const left = useSimulatorStore((s) => s.compareLeftIndex);
  const right = useSimulatorStore((s) => s.compareRightIndex);
  const setLeft = useSimulatorStore((s) => s.setCompareLeftIndex);
  const setRight = useSimulatorStore((s) => s.setCompareRightIndex);

  if (!compareMode) return null;

  const layerLeft = OSI_LAYERS[left];
  const layerRight = OSI_LAYERS[right];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="
        relative overflow-hidden
        rounded-[40px]
        border border-white/10
        bg-[#07111F]
        p-6 md:p-8
        shadow-[0_20px_80px_rgba(0,0,0,0.45)]
      "
    >
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* HEADER */}
        <div className="mb-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
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
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.3em]
                  text-white/50
                "
              >
                LAYER COMPARISON MODE
              </span>
            </div>

            <h2
              className="
                mt-6
                text-[clamp(34px,5vw,58px)]
                font-black
                leading-none
                tracking-[-2px]
                text-white
              "
            >
              Compare OSI Layers
            </h2>

            <p
              className="
                mt-5
                max-w-2xl
                text-[15px]
                leading-relaxed
                text-white/55
              "
            >
              Analyze multiple OSI layers side-by-side
              using the same live simulation state to
              better understand responsibilities,
              protocols, transformations, and network flow.
            </p>
          </div>

          {/* status */}
          <div
            className="
              flex items-center gap-3
              rounded-3xl
              border border-emerald-400/10
              bg-emerald-400/10
              px-5 py-4
              backdrop-blur-xl
            "
          >
            <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />

            <div>
              <div className="text-xs tracking-[0.25em] text-emerald-300/70">
                STATUS
              </div>

              <div className="mt-1 text-sm font-semibold text-emerald-300">
                Live Comparison Active
              </div>
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div
          className="
            mb-8
            grid gap-5
            rounded-[32px]
            border border-white/10
            bg-white/[0.04]
            p-5
            backdrop-blur-2xl
            lg:grid-cols-[1fr_1fr_1.2fr]
          "
        >
          {/* LEFT */}
          <div
            className="
              rounded-2xl
              border border-white/10
              bg-black/20
              p-5
            "
          >
            <div className="mb-3 text-xs tracking-[0.25em] text-cyan-300/60">
              LAYER A
            </div>

            <select
              value={left}
              onChange={(e) => setLeft(Number(e.target.value))}
              className="
                h-14
                w-full
                rounded-2xl
                border border-white/10
                bg-[#0B1727]
                px-4
                text-[16px]
                font-semibold
                text-white
                outline-none
                transition-all
                focus:border-cyan-400/40
                focus:ring-4
                focus:ring-cyan-400/10
              "
            >
              {OSI_LAYERS.map((l, i) => (
                <option
                  key={l.number}
                  value={i}
                  className="bg-[#0B1727]"
                >
                  L{l.number} — {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* RIGHT */}
          <div
            className="
              rounded-2xl
              border border-white/10
              bg-black/20
              p-5
            "
          >
            <div className="mb-3 text-xs tracking-[0.25em] text-violet-300/60">
              LAYER B
            </div>

            <select
              value={right}
              onChange={(e) => setRight(Number(e.target.value))}
              className="
                h-14
                w-full
                rounded-2xl
                border border-white/10
                bg-[#0B1727]
                px-4
                text-[16px]
                font-semibold
                text-white
                outline-none
                transition-all
                focus:border-violet-400/40
                focus:ring-4
                focus:ring-violet-400/10
              "
            >
              {OSI_LAYERS.map((l, i) => (
                <option
                  key={l.number}
                  value={i}
                  className="bg-[#0B1727]"
                >
                  L{l.number} — {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* INFO */}
          <div
            className="
              flex items-center
              rounded-2xl
              border border-white/10
              bg-gradient-to-br
              from-cyan-500/10
              to-violet-500/10
              p-5
            "
          >
            <p
              className="
                text-[14px]
                leading-relaxed
                text-white/65
              "
            >
              Both panels operate on the same global
              simulation state, enabling accurate
              real-time comparison of encapsulation,
              routing, framing, transport behavior,
              and protocol interaction.
            </p>
          </div>
        </div>

        {/* PANELS */}
        <div className="grid gap-8 xl:grid-cols-2">
          {/* LEFT PANEL */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="
              relative overflow-hidden
              rounded-[34px]
              border border-cyan-400/10
              bg-[#081222]
              p-5
              shadow-[0_14px_50px_rgba(0,0,0,0.4)]
            "
          >
            {/* glow */}
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative z-10">
              {/* top */}
              <div
                className="
                  mb-5 flex items-center justify-between
                  border-b border-white/10
                  pb-5
                "
              >
                <div>
                  <div className="text-xs tracking-[0.25em] text-cyan-300/60">
                    PANEL A
                  </div>

                  <h3 className="mt-2 text-2xl font-bold text-white">
                    L{layerLeft.number} — {layerLeft.name}
                  </h3>
                </div>

                <div
                  className="
                    rounded-full
                    bg-cyan-400/10
                    px-4 py-2
                    text-xs
                    font-semibold
                    tracking-wide
                    text-cyan-300
                  "
                >
                  ACTIVE
                </div>
              </div>

              <div className="max-h-[75vh] overflow-auto pr-1 custom-scrollbar">
                <LayerByIndex index={left} />
              </div>
            </div>
          </motion.div>

          {/* RIGHT PANEL */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="
              relative overflow-hidden
              rounded-[34px]
              border border-violet-400/10
              bg-[#081222]
              p-5
              shadow-[0_14px_50px_rgba(0,0,0,0.4)]
            "
          >
            {/* glow */}
            <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-violet-400/10 blur-3xl" />

            <div className="relative z-10">
              {/* top */}
              <div
                className="
                  mb-5 flex items-center justify-between
                  border-b border-white/10
                  pb-5
                "
              >
                <div>
                  <div className="text-xs tracking-[0.25em] text-violet-300/60">
                    PANEL B
                  </div>

                  <h3 className="mt-2 text-2xl font-bold text-white">
                    L{layerRight.number} — {layerRight.name}
                  </h3>
                </div>

                <div
                  className="
                    rounded-full
                    bg-violet-400/10
                    px-4 py-2
                    text-xs
                    font-semibold
                    tracking-wide
                    text-violet-300
                  "
                >
                  ACTIVE
                </div>
              </div>

              <div className="max-h-[75vh] overflow-auto pr-1 custom-scrollbar">
                <LayerByIndex index={right} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}