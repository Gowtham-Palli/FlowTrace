// import { motion } from "framer-motion";
// import { OSI_LAYERS } from "../../data/layers";
// import { getLayerDesign } from "../../lib/layerDesign";
// import { useSimulatorStore } from "../../store/simulatorStore";

// export function LayerNavFooter() {
//   const currentLayerIndex = useSimulatorStore((s) => s.currentLayerIndex);
//   const setCurrentLayerIndex = useSimulatorStore((s) => s.setCurrentLayerIndex);
//   const layerNum = OSI_LAYERS[currentLayerIndex].number;
//   const t = getLayerDesign(layerNum);
//   const total = OSI_LAYERS.length;

//   const canPrev = currentLayerIndex > 0;
//   const canNext = currentLayerIndex < total - 1;

//   return (
//     <motion.div
//       initial={false}
//       className="border-t border-[#F0E6D2] bg-white/90 px-4 py-5 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] backdrop-blur-sm"
//     >
//       <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-center gap-4">
//         <motion.button
//           type="button"
//           disabled={!canPrev}
//           whileHover={{ scale: canPrev ? 1.02 : 1 }}
//           whileTap={{ scale: canPrev ? 0.98 : 1 }}
//           onClick={() => setCurrentLayerIndex(currentLayerIndex - 1)}
//           className="inline-flex h-12 min-w-[120px] items-center justify-center rounded-full border-2 bg-white px-6 text-[20px] font-bold transition disabled:cursor-not-allowed disabled:opacity-40"
//           style={{ borderColor: t.accent, color: t.accent }}
//         >
//           Previous
//         </motion.button>
//         <motion.button
//           type="button"
//           disabled={!canNext}
//           whileHover={{ scale: canNext ? 1.02 : 1 }}
//           whileTap={{ scale: canNext ? 0.98 : 1 }}
//           onClick={() => setCurrentLayerIndex(currentLayerIndex + 1)}
//           className="inline-flex h-12 min-w-[120px] items-center justify-center rounded-full px-6 text-[20px] font-bold text-white shadow-md transition disabled:cursor-not-allowed disabled:opacity-40"
//           style={{ backgroundColor: t.accent }}
//           onMouseEnter={(e) => {
//             if (canNext) (e.currentTarget as HTMLButtonElement).style.backgroundColor = t.accentHover;
//           }}
//           onMouseLeave={(e) => {
//             if (canNext) (e.currentTarget as HTMLButtonElement).style.backgroundColor = t.accent;
//           }}
//         >
//           Next
//         </motion.button>
//       </div>
//     </motion.div>
//   );
// }


import { motion } from "framer-motion";

import { OSI_LAYERS } from "../../data/layers";
import { getLayerDesign } from "../../lib/layerDesign";
import { useSimulatorStore } from "../../store/simulatorStore";

export function LayerNavFooter() {
  const currentLayerIndex =
    useSimulatorStore(
      (s) => s.currentLayerIndex
    );

  const setCurrentLayerIndex =
    useSimulatorStore(
      (s) => s.setCurrentLayerIndex
    );

  const layerNum =
    OSI_LAYERS[currentLayerIndex].number;

  const t =
    getLayerDesign(layerNum);

  const total =
    OSI_LAYERS.length;

  const canPrev =
    currentLayerIndex > 0;

  const canNext =
    currentLayerIndex < total - 1;

  const currentLayer =
    OSI_LAYERS[currentLayerIndex];

  return (
    <motion.footer
      initial={false}
      className="
        sticky bottom-0 z-40
        border-t border-white/10
        bg-[#07111F]/85
        px-4 py-5
        backdrop-blur-2xl
        shadow-[0_-10px_50px_rgba(0,0,0,0.4)]
      "
    >
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute left-0 top-0
            h-64 w-64
            rounded-full
            blur-3xl
            opacity-[0.08]
          "
          style={{
            background: t.accent,
          }}
        />

        <div
          className="
            absolute right-0 top-0
            h-64 w-64
            rounded-full
            blur-3xl
            opacity-[0.05]
          "
          style={{
            background: t.chart,
          }}
        />
      </div>

      <div
        className="
          relative z-10
          mx-auto flex max-w-[1700px]
          flex-wrap items-center justify-between gap-5
        "
      >
        {/* LEFT STATUS */}
        <div
          className="
            flex items-center gap-5
          "
        >
          {/* layer badge */}
          <div
            className="
              flex h-14 w-14
              items-center justify-center
              rounded-2xl
              border border-white/10
              backdrop-blur-xl
              shadow-[0_0_30px_rgba(255,255,255,0.03)]
            "
            style={{
              background: `${t.accent}20`,
            }}
          >
            <span
              className="
                text-[22px]
                font-black
                tracking-[-1px]
              "
              style={{
                color: t.accent,
              }}
            >
              {currentLayer.number}
            </span>
          </div>

          {/* text */}
          <div>
            <div
              className="
                text-[11px]
                font-bold
                uppercase
                tracking-[0.35em]
                text-white/40
              "
            >
              CURRENT LAYER
            </div>

            <h3
              className="
                mt-1
                text-[24px]
                font-black
                leading-none
                tracking-[-1px]
                text-white
              "
            >
              {currentLayer.name}
            </h3>

            <div
              className="
                mt-2
                flex items-center gap-2
                text-sm
                text-white/50
              "
            >
              <span>
                Layer {currentLayer.number}
              </span>

              <div className="h-1 w-1 rounded-full bg-white/20" />

              <span>
                {currentLayerIndex + 1}/{total}
              </span>
            </div>
          </div>
        </div>

        {/* CENTER PROGRESS */}
        <div
          className="
            hidden flex-1 px-8 lg:block
          "
        >
          <div
            className="
              relative h-3 overflow-hidden
              rounded-full
              bg-black/30
            "
          >
            {/* background grid */}
            <div
              className="
                absolute inset-0 opacity-[0.08]
              "
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize:
                  "36px 100%",
              }}
            />

            {/* active progress */}
            <motion.div
              initial={false}
              animate={{
                width: `${
                  ((currentLayerIndex + 1) /
                    total) *
                  100
                }%`,
              }}
              transition={{
                duration: 0.35,
              }}
              className="
                relative h-full
                rounded-full
              "
              style={{
                background: `linear-gradient(90deg, ${t.accent}, ${t.chart})`,
              }}
            >
              {/* shine */}
              <div
                className="
                  absolute inset-0
                  opacity-40
                "
                style={{
                  background:
                    "linear-gradient(to right, rgba(255,255,255,0.25), transparent)",
                }}
              />
            </motion.div>
          </div>

          {/* labels */}
          <div
            className="
              mt-3
              flex justify-between
              text-[11px]
              font-medium
              tracking-wide
              text-white/35
            "
          >
            <span>
              APPLICATION
            </span>

            <span>
              PHYSICAL
            </span>
          </div>
        </div>

        {/* RIGHT BUTTONS */}
        <div
          className="
            flex items-center gap-4
          "
        >
          {/* PREVIOUS */}
          <motion.button
            type="button"
            disabled={!canPrev}
            whileHover={
              canPrev
                ? {
                    y: -2,
                    scale: 1.02,
                  }
                : {}
            }
            whileTap={
              canPrev
                ? {
                    scale: 0.98,
                  }
                : {}
            }
            onClick={() =>
              setCurrentLayerIndex(
                currentLayerIndex - 1
              )
            }
            className="
              group relative overflow-hidden
              rounded-2xl
              border border-white/10
              bg-white/[0.03]
              px-6 py-4
              text-[15px]
              font-bold
              tracking-wide
              text-white
              backdrop-blur-xl
              transition-all duration-300
              hover:border-white/20
              hover:bg-white/[0.06]
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            <div
              className="
                absolute inset-0 opacity-0
                transition-opacity duration-300
                group-hover:opacity-100
                bg-gradient-to-r
                from-white/[0.03]
                via-transparent
                to-white/[0.03]
              "
            />

            <span className="relative z-10">
              ← Previous
            </span>
          </motion.button>

          {/* NEXT */}
          <motion.button
            type="button"
            disabled={!canNext}
            whileHover={
              canNext
                ? {
                    y: -2,
                    scale: 1.02,
                  }
                : {}
            }
            whileTap={
              canNext
                ? {
                    scale: 0.98,
                  }
                : {}
            }
            onClick={() =>
              setCurrentLayerIndex(
                currentLayerIndex + 1
              )
            }
            className="
              group relative overflow-hidden
              rounded-2xl
              px-7 py-4
              text-[15px]
              font-bold
              tracking-wide
              text-white
              shadow-[0_0_40px_rgba(255,255,255,0.05)]
              transition-all duration-300
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
            style={{
              background: `linear-gradient(135deg, ${t.accent}, ${t.chart})`,
            }}
          >
            {/* shine */}
            <div
              className="
                absolute inset-0 opacity-0
                transition-opacity duration-300
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
                  via-white/[0.12]
                  to-transparent
                  blur-xl
                "
              />
            </div>

            <span className="relative z-10">
              Next →
            </span>
          </motion.button>
        </div>
      </div>
    </motion.footer>
  );
}