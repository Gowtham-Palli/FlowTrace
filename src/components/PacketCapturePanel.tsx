// import { useMemo } from "react";
// import { buildPacketCaptureLines, computePipelineMetrics } from "../lib/pipelineMetrics";
// import { useSimulatorStore } from "../store/simulatorStore";

// export function PacketCapturePanel() {
//   const open = useSimulatorStore((s) => s.packetCaptureOpen);
//   const setOpen = useSimulatorStore((s) => s.setPacketCaptureOpen);

//   const application = useSimulatorStore((s) => s.application);
//   const presentation = useSimulatorStore((s) => s.presentation);
//   const session = useSimulatorStore((s) => s.session);
//   const transport = useSimulatorStore((s) => s.transport);
//   const network = useSimulatorStore((s) => s.network);
//   const dataLink = useSimulatorStore((s) => s.dataLink);
//   const physical = useSimulatorStore((s) => s.physical);

//   const full = useMemo(
//     () => ({
//       application,
//       presentation,
//       session,
//       transport,
//       network,
//       dataLink,
//       physical,
//     }),
//     [application, presentation, session, transport, network, dataLink, physical]
//   );

//   const metrics = useMemo(() => computePipelineMetrics(full), [full]);
//   const lines = useMemo(() => buildPacketCaptureLines(full, metrics), [full, metrics]);

//   if (!open) return null;

//   return (
//     <div className="fixed inset-x-0 bottom-0 z-40 max-h-[38vh] border-t border-[#F0E6D2] bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
//       <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-2 border-b border-[#F0F0F0] px-4 py-3 md:px-8">
//         <span className="text-[14px] font-semibold uppercase tracking-wide text-[#1E6F9F]">
//           Simulated Wireshark
//         </span>
//         <button
//           type="button"
//           onClick={() => setOpen(false)}
//           className="inline-flex h-10 items-center justify-center rounded-full border border-[#E5E5E5] bg-white px-5 text-[16px] font-semibold text-[#444] transition hover:bg-[#FAFAFA]"
//         >
//           Close
//         </button>
//       </div>
//       <div className="mx-auto max-h-[calc(38vh-52px)] max-w-[1600px] overflow-auto px-4 py-3 font-mono text-[14px] leading-relaxed text-[#333] md:px-8">
//         {lines.map((ln, i) => (
//           <div key={`${i}-${ln.slice(0, 12)}`} className="border-b border-[#F5F5F5] py-1">
//             {ln}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }



import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  buildPacketCaptureLines,
  computePipelineMetrics,
} from "../lib/pipelineMetrics";

import { useSimulatorStore } from "../store/simulatorStore";

export function PacketCapturePanel() {
  const open = useSimulatorStore(
    (s) => s.packetCaptureOpen
  );

  const setOpen = useSimulatorStore(
    (s) => s.setPacketCaptureOpen
  );

  const application = useSimulatorStore(
    (s) => s.application
  );

  const presentation = useSimulatorStore(
    (s) => s.presentation
  );

  const session = useSimulatorStore(
    (s) => s.session
  );

  const transport = useSimulatorStore(
    (s) => s.transport
  );

  const network = useSimulatorStore(
    (s) => s.network
  );

  const dataLink = useSimulatorStore(
    (s) => s.dataLink
  );

  const physical = useSimulatorStore(
    (s) => s.physical
  );

  const full = useMemo(
    () => ({
      application,
      presentation,
      session,
      transport,
      network,
      dataLink,
      physical,
    }),
    [
      application,
      presentation,
      session,
      transport,
      network,
      dataLink,
      physical,
    ]
  );

  const metrics = useMemo(
    () =>
      computePipelineMetrics(full),
    [full]
  );

  const lines = useMemo(
    () =>
      buildPacketCaptureLines(
        full,
        metrics
      ),
    [full, metrics]
  );

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: 30,
        }}
        transition={{
          duration: 0.35,
          ease: "easeOut",
        }}
        className="
          fixed inset-x-0 bottom-0 z-50
          border-t border-cyan-400/10
          bg-[#050B16]/95
          backdrop-blur-2xl
          shadow-[0_-20px_80px_rgba(0,0,0,0.5)]
        "
      >
        {/* ambient glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1800px]">
          {/* HEADER */}
          <div
            className="
              flex flex-wrap items-center justify-between gap-4
              border-b border-white/10
              px-5 py-4
              md:px-8
            "
          >
            {/* LEFT */}
            <div className="flex items-center gap-4">
              {/* live icon */}
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
                <div className="absolute h-3 w-3 rounded-full bg-cyan-400 animate-ping opacity-50" />

                <div className="relative h-3 w-3 rounded-full bg-cyan-300" />
              </div>

              {/* title */}
              <div>
                <div
                  className="
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.35em]
                    text-cyan-300/60
                  "
                >
                  LIVE NETWORK ANALYZER
                </div>

                <h2
                  className="
                    mt-1
                    text-[28px]
                    font-black
                    leading-none
                    tracking-[-1px]
                    text-white
                  "
                >
                  Packet Capture
                </h2>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">
              {/* stats */}
              <div
                className="
                  hidden md:flex items-center gap-3
                  rounded-2xl
                  border border-white/10
                  bg-white/[0.04]
                  px-5 py-3
                  backdrop-blur-xl
                "
              >
                <div>
                  <div
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.25em]
                      text-white/35
                    "
                  >
                    PACKETS
                  </div>

                  <div
                    className="
                      mt-1
                      text-[18px]
                      font-black
                      text-white
                    "
                  >
                    {metrics.packetsSent}
                  </div>
                </div>

                <div className="h-8 w-px bg-white/10" />

                <div>
                  <div
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.25em]
                      text-white/35
                    "
                  >
                    PROTOCOL
                  </div>

                  <div
                    className="
                      mt-1
                      text-[18px]
                      font-black
                      text-cyan-300
                    "
                  >
                    {transport.protocol.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* close */}
              <motion.button
                type="button"
                whileHover={{
                  y: -2,
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={() =>
                  setOpen(false)
                }
                className="
                  rounded-2xl
                  border border-red-400/10
                  bg-red-500/10
                  px-5 py-3
                  text-sm
                  font-bold
                  tracking-wide
                  text-red-300
                  backdrop-blur-xl
                  transition-all
                  hover:border-red-400/25
                  hover:bg-red-500/15
                "
              >
                Close Capture
              </motion.button>
            </div>
          </div>

          {/* TERMINAL */}
          <div
            className="
              relative max-h-[42vh]
              overflow-auto
              px-5 py-4
              font-mono
              md:px-8
            "
          >
            {/* grid overlay */}
            <div
              className="
                pointer-events-none absolute inset-0 opacity-[0.04]
              "
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize:
                  "100% 28px",
              }}
            />

            {/* terminal lines */}
            <div className="relative z-10 flex flex-col">
              {lines.map((ln, i) => (
                <motion.div
                  key={`${i}-${ln.slice(
                    0,
                    12
                  )}`}
                  initial={{
                    opacity: 0,
                    x: -8,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: i * 0.015,
                  }}
                  whileHover={{
                    backgroundColor:
                      "rgba(255,255,255,0.03)",
                  }}
                  className="
                    group
                    flex items-start gap-5
                    border-b border-white/[0.04]
                    px-2 py-2.5
                    transition-all
                  "
                >
                  {/* line number */}
                  <div
                    className="
                      min-w-[50px]
                      text-right
                      text-[12px]
                      font-medium
                      text-white/25
                    "
                  >
                    {String(i + 1).padStart(
                      4,
                      "0"
                    )}
                  </div>

                  {/* status dot */}
                  <div className="mt-[7px] h-2 w-2 rounded-full bg-cyan-400 opacity-70 group-hover:opacity-100" />

                  {/* content */}
                  <div
                    className="
                      flex-1
                      whitespace-pre-wrap break-all
                      text-[13px]
                      leading-relaxed
                      text-emerald-300
                    "
                  >
                    {ln}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* FOOTER */}
          <div
            className="
              flex flex-wrap items-center justify-between gap-4
              border-t border-white/10
              px-5 py-3
              text-[12px]
              md:px-8
            "
          >
            <div className="flex items-center gap-3 text-white/40">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />

              <span>
                Live traffic stream active
              </span>
            </div>

            <div className="text-white/30">
              Simulated Wireshark •
              Real-time OSI packet inspection
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}