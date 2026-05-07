// import { motion } from "framer-motion";
// import { useSimulatorStore } from "../store/simulatorStore";

// export function GlobalToolbar() {
//   const compareMode = useSimulatorStore((s) => s.compareMode);
//   const setCompareMode = useSimulatorStore((s) => s.setCompareMode);
//   const packetCaptureOpen = useSimulatorStore((s) => s.packetCaptureOpen);
//   const setPacketCaptureOpen = useSimulatorStore((s) => s.setPacketCaptureOpen);
//   const resetAll = useSimulatorStore((s) => s.resetAll);
//   const exportSessionJson = useSimulatorStore((s) => s.exportSessionJson);

//   const downloadExport = () => {
//     const blob = new Blob([exportSessionJson()], { type: "application/json" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `osi-simulator-session-${Date.now()}.json`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="flex flex-wrap items-center gap-3 border-b border-[#F0E6D2] bg-[#FDF8F0] px-4 py-3 md:px-6">
//       <motion.button
//         type="button"
//         whileHover={{ scale: 1.02 }}
//         whileTap={{ scale: 0.98 }}
//         onClick={downloadExport}
//         className="inline-flex h-12 items-center justify-center rounded-full border-2 border-[#E0E0E0] bg-white px-6 text-[18px] font-bold text-[#6B3FA0] shadow-sm hover:border-[#6B3FA0]/40"
//       >
//         Export Session
//       </motion.button>
//       <motion.button
//         type="button"
//         whileHover={{ scale: 1.02 }}
//         whileTap={{ scale: 0.98 }}
//         onClick={() => setCompareMode(!compareMode)}
//         className={`inline-flex h-12 items-center justify-center rounded-full px-6 text-[18px] font-bold shadow-sm transition-colors ${
//           compareMode
//             ? "bg-[#6B3FA0] text-white"
//             : "border-2 border-[#E0E0E0] bg-white text-[#6B3FA0]"
//         }`}
//       >
//         Compare Layers
//       </motion.button>
//       <motion.button
//         type="button"
//         whileHover={{ scale: 1.02 }}
//         whileTap={{ scale: 0.98 }}
//         onClick={() => setPacketCaptureOpen(!packetCaptureOpen)}
//         className={`inline-flex h-12 items-center justify-center rounded-full px-6 text-[18px] font-bold shadow-sm ${
//           packetCaptureOpen
//             ? "bg-[#1E6F9F] text-white"
//             : "border-2 border-[#E0E0E0] bg-white text-[#1E6F9F]"
//         }`}
//       >
//         Live Packet Capture
//       </motion.button>
//       <motion.button
//         type="button"
//         whileHover={{ scale: 1.02 }}
//         whileTap={{ scale: 0.98 }}
//         onClick={() => {
//           if (window.confirm("Reset entire simulation to defaults?")) resetAll();
//         }}
//         className="inline-flex h-12 items-center justify-center rounded-full border-2 border-rose-300 bg-white px-6 text-[18px] font-bold text-rose-600 hover:bg-rose-50"
//       >
//         Reset All
//       </motion.button>
//     </div>
//   );
// }



import { motion } from "framer-motion";

import { useSimulatorStore } from "../store/simulatorStore";

export function GlobalToolbar() {
  const compareMode = useSimulatorStore(
    (s) => s.compareMode
  );

  const setCompareMode = useSimulatorStore(
    (s) => s.setCompareMode
  );

  const packetCaptureOpen =
    useSimulatorStore(
      (s) => s.packetCaptureOpen
    );

  const setPacketCaptureOpen =
    useSimulatorStore(
      (s) => s.setPacketCaptureOpen
    );

  const resetAll = useSimulatorStore(
    (s) => s.resetAll
  );

  const exportSessionJson =
    useSimulatorStore(
      (s) => s.exportSessionJson
    );

  const downloadExport = () => {
    const blob = new Blob(
      [exportSessionJson()],
      {
        type: "application/json",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download = `osi-simulator-session-${Date.now()}.json`;

    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="
        sticky top-0 z-50
        border-b border-white/10
        bg-[#07111F]/80
        px-4 py-4
        backdrop-blur-2xl
        shadow-[0_10px_50px_rgba(0,0,0,0.35)]
      "
    >
      <div
        className="
          mx-auto
          flex flex-wrap items-center gap-4
        "
      >
        {/* BRAND */}
        <div
          className="
            mr-auto
            flex items-center gap-4
          "
        >
          <div
            className="
              relative flex h-12 w-12
              items-center justify-center
              rounded-2xl
              border border-cyan-400/10
              bg-cyan-400/10
              backdrop-blur-xl
            "
          >
            {/* pulse */}
            <div className="absolute h-3 w-3 rounded-full bg-cyan-400 animate-ping opacity-50" />

            <div className="relative h-3 w-3 rounded-full bg-cyan-300" />
          </div>

          <div>
            <div
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.35em]
                text-cyan-300/60
              "
            >
              NETWORK SIMULATOR
            </div>

            <h1
              className="
                mt-1
                text-[22px]
                font-black
                leading-none
                tracking-[-1px]
                text-white
              "
            >
              Control Center
            </h1>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap items-center gap-3">
          {/* EXPORT */}
          <ToolbarButton
            label="Export Session"
            accent="cyan"
            active={false}
            onClick={downloadExport}
          />

          {/* COMPARE */}
          <ToolbarButton
            label="Compare Layers"
            accent="violet"
            active={compareMode}
            onClick={() =>
              setCompareMode(
                !compareMode
              )
            }
          />

          {/* PACKET */}
          <ToolbarButton
            label="Packet Capture"
            accent="emerald"
            active={packetCaptureOpen}
            onClick={() =>
              setPacketCaptureOpen(
                !packetCaptureOpen
              )
            }
          />

          {/* RESET */}
          <motion.button
            type="button"
            whileHover={{
              y: -2,
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            onClick={() => {
              if (
                window.confirm(
                  "Reset entire simulation to defaults?"
                )
              ) {
                resetAll();
              }
            }}
            className="
              relative overflow-hidden
              rounded-2xl
              border border-red-400/15
              bg-red-500/10
              px-6 py-4
              text-[15px]
              font-bold
              tracking-wide
              text-red-300
              backdrop-blur-xl
              transition-all
              hover:border-red-400/30
              hover:bg-red-500/15
              hover:shadow-[0_0_25px_rgba(239,68,68,0.15)]
            "
          >
            <span className="relative z-10">
              Reset All
            </span>

            <div
              className="
                absolute inset-0 opacity-0
                transition-opacity duration-300
                hover:opacity-100
                bg-gradient-to-r
                from-red-500/5
                via-transparent
                to-red-500/5
              "
            />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- */
/* BUTTON */
/* -------------------------------- */

function ToolbarButton({
  label,
  active,
  onClick,
  accent,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  accent:
    | "cyan"
    | "violet"
    | "emerald";
}) {
  const styles = {
    cyan: {
      active:
        "bg-cyan-400/15 border-cyan-400/30 text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.15)]",

      inactive:
        "bg-white/[0.03] border-white/10 text-cyan-200 hover:border-cyan-400/20 hover:bg-cyan-400/5",
    },

    violet: {
      active:
        "bg-violet-400/15 border-violet-400/30 text-violet-300 shadow-[0_0_30px_rgba(168,85,247,0.15)]",

      inactive:
        "bg-white/[0.03] border-white/10 text-violet-200 hover:border-violet-400/20 hover:bg-violet-400/5",
    },

    emerald: {
      active:
        "bg-emerald-400/15 border-emerald-400/30 text-emerald-300 shadow-[0_0_30px_rgba(52,211,153,0.15)]",

      inactive:
        "bg-white/[0.03] border-white/10 text-emerald-200 hover:border-emerald-400/20 hover:bg-emerald-400/5",
    },
  };

  return (
    <motion.button
      type="button"
      whileHover={{
        y: -2,
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.98,
      }}
      onClick={onClick}
      className={`
        relative overflow-hidden
        rounded-2xl
        border
        px-6 py-4
        text-[15px]
        font-bold
        tracking-wide
        backdrop-blur-xl
        transition-all duration-300
        ${
          active
            ? styles[accent].active
            : styles[accent].inactive
        }
      `}
    >
      {/* glow overlay */}
      <div
        className="
          absolute inset-0 opacity-0
          transition-opacity duration-300
          hover:opacity-100
          bg-gradient-to-r
          from-white/[0.03]
          via-transparent
          to-white/[0.03]
        "
      />

      <span className="relative z-10">
        {label}
      </span>

      {/* active pulse */}
      {active && (
        <div
          className="
            absolute right-3 top-3
            h-2.5 w-2.5
            rounded-full
            bg-current
            animate-pulse
          "
        />
      )}
    </motion.button>
  );
}