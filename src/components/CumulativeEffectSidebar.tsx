// import { useMemo } from "react";
// import { computePipelineMetrics } from "../lib/pipelineMetrics";
// import { useSimulatorStore } from "../store/simulatorStore";
// import { DelayedTooltip } from "./DelayedTooltip";

// export function CumulativeEffectSidebar() {
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

//   const m = useMemo(() => computePipelineMetrics(full), [full]);

//   const recvPct =
//     m.packetsSent > 0 ? (100 * m.packetsReceived) / m.packetsSent : 0;

//   return (
//     <aside className="flex h-min w-[300px] max-w-full shrink-0 flex-col gap-5 border-l-4 border-[#F0E6D2] bg-white p-6 shadow-card">
//       <DelayedTooltip
//         content="Holistic view combining Application through Physical sliders—numbers are illustrative but react live to every KPI."
//         delayMs={500}
//       >
//         <h2 className="cursor-default text-[20px] font-bold leading-tight text-[#333]">
//           End-to-End Statistics
//         </h2>
//       </DelayedTooltip>

//       <div className="space-y-4 text-[16px]">
//         <div>
//           <DelayedTooltip
//             content="Sum of processing estimates L7–L5, transport RTT effects, per-hop routing, and physical/link delays."
//             delayMs={500}
//           >
//             <p className="mb-2 cursor-default font-medium text-[#666]">Total Latency</p>
//           </DelayedTooltip>
//           <p className="text-[24px] font-bold leading-none text-[#C97D2E]">
//             {m.totalLatencyMs.toFixed(1)} ms
//           </p>
//           <ul className="mt-3 space-y-2 border-l border-[#F0F0F0] pl-3 text-[14px] leading-snug text-[#666]">
//             <li>L7–L5 processing: {m.breakdown.l7to5Ms.toFixed(1)} ms</li>
//             <li>L4 ({transport.protocol.toUpperCase()} delay): {m.breakdown.l4Ms.toFixed(1)} ms</li>
//             <li>L3 (routing): {m.breakdown.l3Ms.toFixed(1)} ms</li>
//             <li>L2–L1 (physical): {m.breakdown.l2l1Ms.toFixed(1)} ms</li>
//           </ul>
//         </div>

//         <Sep />

//         <Row
//           label="Throughput"
//           value={`${m.throughputMbps.toFixed(1)} Mbps`}
//           tip="Raw rate after compression and transport window modeling."
//         />
//         <Row
//           label="Goodput (useful data)"
//           value={`${m.goodputMbps.toFixed(1)} Mbps`}
//           tip="Approximates application-useful throughput after loss and overhead."
//         />
//         <Row
//           label="Overhead ratio"
//           value={`${(m.overheadRatio * 100).toFixed(1)}%`}
//           tip="Share of capacity consumed by headers, retransmits, and inefficiency vs theoretical line rate."
//         />

//         <Sep />

//         <Row
//           label="Packets sent"
//           value={`${m.packetsSent}`}
//           tip="Illustrative segment count scaled by MTU and request rate."
//         />
//         <Row
//           label="Packets received"
//           value={`${m.packetsReceived} (${recvPct.toFixed(1)}%)`}
//           tip="TCP inflates successful delivery vs UDP raw survival rate."
//         />
//         <Row
//           label="Retransmissions (TCP)"
//           value={`${m.retransmissions}`}
//           tip="Grows with loss × in-flight segments when TCP is selected."
//         />
//         <Row
//           label="Frames corrupted (L2)"
//           value={`${m.framesCorrupted}`}
//           tip="Scales with BER and frame size—CRC drops these before upper layers see them."
//         />
//         <Row
//           label="Bit errors (L1)"
//           value={`${m.bitErrors}`}
//           tip="Synthetic bit flips influenced by SNR, interference, and distance."
//         />
//       </div>
//     </aside>
//   );
// }

// function Sep() {
//   return <div className="h-px w-full bg-[#F0F0F0]" />;
// }

// function Row({
//   label,
//   value,
//   tip,
// }: {
//   label: string;
//   value: string;
//   tip: string;
// }) {
//   return (
//     <div className="flex flex-col gap-1">
//       <div className="flex justify-between gap-3">
//         <DelayedTooltip content={tip} delayMs={500}>
//           <span className="cursor-help border-b border-dotted border-[#CCC] font-medium text-[#666]">
//             {label}
//           </span>
//         </DelayedTooltip>
//         <span className="text-right text-[24px] font-bold tabular-nums text-[#6B3FA0]">
//           {value}
//         </span>
//       </div>
//     </div>
//   );
// }



import { useMemo } from "react";
import { motion } from "framer-motion";
import { computePipelineMetrics } from "../lib/pipelineMetrics";
import { useSimulatorStore } from "../store/simulatorStore";
import { DelayedTooltip } from "./DelayedTooltip";

export function CumulativeEffectSidebar() {
  const application = useSimulatorStore((s) => s.application);
  const presentation = useSimulatorStore((s) => s.presentation);
  const session = useSimulatorStore((s) => s.session);
  const transport = useSimulatorStore((s) => s.transport);
  const network = useSimulatorStore((s) => s.network);
  const dataLink = useSimulatorStore((s) => s.dataLink);
  const physical = useSimulatorStore((s) => s.physical);

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

  const m = useMemo(
    () => computePipelineMetrics(full),
    [full]
  );

  const recvPct =
    m.packetsSent > 0
      ? (100 * m.packetsReceived) /
        m.packetsSent
      : 0;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      className="
        relative overflow-hidden
        flex h-min w-[360px] max-w-full shrink-0 flex-col
        rounded-[36px]
        border border-white/10
        bg-[#07111F]
        p-6
        shadow-[0_20px_80px_rgba(0,0,0,0.45)]
      "
    >
      {/* background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* HEADER */}
        <div className="mb-8">
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
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />

            <span
              className="
                text-[11px]
                font-bold
                uppercase
                tracking-[0.3em]
                text-white/50
              "
            >
              LIVE TELEMETRY
            </span>
          </div>

          <DelayedTooltip
            content="Aggregated end-to-end network simulation metrics across all OSI layers."
            delayMs={500}
          >
            <h2
              className="
                mt-6
                cursor-default
                text-[34px]
                font-black
                leading-none
                tracking-[-1px]
                text-white
              "
            >
              End-to-End
              <br />
              Statistics
            </h2>
          </DelayedTooltip>

          <p
            className="
              mt-5
              text-[14px]
              leading-relaxed
              text-white/55
            "
          >
            Real-time simulation metrics generated
            from the interaction between Application,
            Transport, Network, Data Link, and
            Physical layer configurations.
          </p>
        </div>

        {/* LATENCY CARD */}
        <motion.div
          whileHover={{ y: -3 }}
          className="
            relative overflow-hidden
            rounded-[30px]
            border border-orange-400/10
            bg-gradient-to-br
            from-orange-500/10
            to-orange-400/5
            p-6
            backdrop-blur-2xl
          "
        >
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-orange-400/10 blur-3xl" />

          <div className="relative z-10">
            <DelayedTooltip
              content="Combined delay introduced by all layers and physical transmission."
              delayMs={500}
            >
              <div className="cursor-default">
                <div className="text-xs tracking-[0.3em] text-orange-300/60">
                  TOTAL LATENCY
                </div>

                <div
                  className="
                    mt-4
                    text-[44px]
                    font-black
                    leading-none
                    tracking-[-2px]
                    text-orange-300
                  "
                >
                  {m.totalLatencyMs.toFixed(1)}
                  <span className="ml-2 text-[18px] font-semibold">
                    ms
                  </span>
                </div>
              </div>
            </DelayedTooltip>

            {/* breakdown */}
            <div className="mt-6 space-y-3">
              <BreakdownRow
                label="L7–L5 Processing"
                value={`${m.breakdown.l7to5Ms.toFixed(1)} ms`}
              />

              <BreakdownRow
                label={`L4 ${transport.protocol.toUpperCase()} Delay`}
                value={`${m.breakdown.l4Ms.toFixed(1)} ms`}
              />

              <BreakdownRow
                label="L3 Routing"
                value={`${m.breakdown.l3Ms.toFixed(1)} ms`}
              />

              <BreakdownRow
                label="L2–L1 Physical"
                value={`${m.breakdown.l2l1Ms.toFixed(1)} ms`}
              />
            </div>
          </div>
        </motion.div>

        {/* METRICS */}
        <div className="mt-7 space-y-5">
          <MetricCard
            title="Throughput"
            value={`${m.throughputMbps.toFixed(6)} Mbps`}
            color="cyan"
            tip="Raw network throughput after compression and transport optimization."
          />

          <MetricCard
            title="Goodput"
            value={`${m.goodputMbps.toFixed(6)} Mbps`}
            color="emerald"
            tip="Actual useful application-level throughput."
          />

          <MetricCard
            title="Overhead Ratio"
            value={`${(
              m.overheadRatio * 100
            ).toFixed(1)}%`}
            color="violet"
            tip="Percentage of bandwidth consumed by protocol overhead and retransmissions."
          />
        </div>

        {/* PACKETS */}
        <div
          className="
            mt-8
            rounded-[30px]
            border border-white/10
            bg-white/[0.04]
            p-5
            backdrop-blur-xl
          "
        >
          <div className="mb-5">
            <div className="text-xs tracking-[0.3em] text-white/40">
              NETWORK EVENTS
            </div>

            <h3 className="mt-2 text-2xl font-bold text-white">
              Packet Analytics
            </h3>
          </div>

          <div className="space-y-5">
            <StatRow
              label="Packets Sent"
              value={`${m.packetsSent}`}
              tip="Estimated transmitted packet count."
            />

            <StatRow
              label="Packets Received"
              value={`${m.packetsReceived} (${recvPct.toFixed(1)}%)`}
              tip="Successfully delivered packets."
            />

            <StatRow
              label="Retransmissions"
              value={`${m.retransmissions}`}
              tip="TCP retransmissions caused by loss."
            />

            <StatRow
              label="Frames Corrupted"
              value={`${m.framesCorrupted}`}
              tip="CRC-detected frame corruption at Data Link layer."
            />

            <StatRow
              label="Bit Errors"
              value={`${m.bitErrors}`}
              tip="Synthetic physical layer bit flips."
            />
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

/* -------------------------------- */
/* COMPONENTS */
/* -------------------------------- */

function MetricCard({
  title,
  value,
  tip,
  color,
}: {
  title: string;
  value: string;
  tip: string;
  color: "cyan" | "emerald" | "violet";
}) {
  const styles = {
    cyan:
      "border-cyan-400/10 bg-cyan-400/5 text-cyan-300",
    emerald:
      "border-emerald-400/10 bg-emerald-400/5 text-emerald-300",
    violet:
      "border-violet-400/10 bg-violet-400/5 text-violet-300",
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`
        rounded-[28px]
        border
        p-5
        backdrop-blur-xl
        ${styles[color]}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs tracking-[0.25em] opacity-60">
            {title.toUpperCase()}
          </div>

          <div
            className="
              mt-3
              text-[30px]
              font-black
              leading-none
              tracking-[-1px]
            "
          >
            {value}
          </div>
        </div>

        <DelayedTooltip
          content={tip}
          delayMs={500}
        >
          <div
            className="
              flex h-8 w-8 cursor-help items-center justify-center
              rounded-full
              border border-white/10
              bg-white/5
              text-sm
              text-white/50
            "
          >
            ?
          </div>
        </DelayedTooltip>
      </div>
    </motion.div>
  );
}

function BreakdownRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        flex items-center justify-between gap-4
        rounded-2xl
        border border-white/5
        bg-black/10
        px-4 py-3
      "
    >
      <span className="text-sm text-white/60">
        {label}
      </span>

      <span className="font-bold text-white">
        {value}
      </span>
    </div>
  );
}

function StatRow({
  label,
  value,
  tip,
}: {
  label: string;
  value: string;
  tip: string;
}) {
  return (
    <div
      className="
        flex items-center justify-between gap-4
        rounded-2xl
        border border-white/5
        bg-black/10
        px-4 py-4
      "
    >
      <div className="flex items-center gap-2">
        <DelayedTooltip
          content={tip}
          delayMs={500}
        >
          <span
            className="
              cursor-help
              border-b border-dotted border-white/20
              text-sm
              text-white/60
            "
          >
            {label}
          </span>
        </DelayedTooltip>
      </div>

      <span
        className="
          text-right
          text-[20px]
          font-black
          tracking-[-0.5px]
          text-white
        "
      >
        {value}
      </span>
    </div>
  );
}