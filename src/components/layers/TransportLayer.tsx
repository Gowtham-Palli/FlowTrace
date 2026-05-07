import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { computePipelineMetrics } from "../../lib/pipelineMetrics";
import { getLayerDesign } from "../../lib/layerDesign";
import { useSimulatorStore } from "../../store/simulatorStore";
import { ChartTooltipContent } from "../ds/ChartTooltipContent";
import { LayerCard } from "../ds/LayerCard";
import { PillButton } from "../ds/PillButton";
import { PillSwitch } from "../ds/PillSwitch";
import { SectionTitle } from "../ds/SectionTitle";
import { SliderField } from "../ds/SliderField";
import { DelayedTooltip } from "../DelayedTooltip";
import { DownstreamAlerts } from "../DownstreamAlerts";

const L = 4;
const t = getLayerDesign(L);

type CellState = "ok" | "lost" | "wait" | "rtx";

const COLORS: Record<CellState, string> = {
  ok: "bg-[#5A8C1A]",
  lost: "bg-[#E85D75]",
  wait: "bg-[#FFD166]",
  rtx: "bg-[#4AA8D8]",
};

export function TransportLayer() {
  const application = useSimulatorStore((s) => s.application);
  const presentation = useSimulatorStore((s) => s.presentation);
  const session = useSimulatorStore((s) => s.session);
  const transport = useSimulatorStore((s) => s.transport);
  const network = useSimulatorStore((s) => s.network);
  const dataLink = useSimulatorStore((s) => s.dataLink);
  const physical = useSimulatorStore((s) => s.physical);

  const setProto = useSimulatorStore((s) => s.setTransportProtocol);
  const setLoss = useSimulatorStore((s) => s.setTransportPacketLoss);
  const setLat = useSimulatorStore((s) => s.setTransportLatency);
  const setWin = useSimulatorStore((s) => s.setTransportWindow);
  const setOo = useSimulatorStore((s) => s.setTransportOutOfOrderUdp);
  const congest = useSimulatorStore((s) => s.simulateCongestion);
  const reset = useSimulatorStore((s) => s.resetTransportLayer);

  const metrics = useMemo(
    () =>
      computePipelineMetrics({
        application,
        presentation,
        session,
        transport,
        network,
        dataLink,
        physical,
      }),
    [application, presentation, session, transport, network, dataLink, physical]
  );

  const [grid, setGrid] = useState<CellState[]>(() =>
    Array.from({ length: 64 }, () => "ok")
  );
  const [throughputSeries, setThroughputSeries] = useState<{ t: number; v: number }[]>([]);
  const [rtxSeries, setRtxSeries] = useState<{ t: number; r: number }[]>([]);

  const loss = transport.packetLossPercent / 100;
  const deliveredPct = Math.round(metrics.deliveryRatio * 1000) / 10;

  useEffect(() => {
    const id = window.setInterval(() => {
      setGrid(() => {
        const next: CellState[] = [];
        for (let i = 0; i < 64; i++) {
          const r = Math.random();
          if (transport.protocol === "tcp") {
            if (r < loss * 0.9) next.push("lost");
            else if (r < loss * 0.9 + 0.06) next.push("wait");
            else if (r < loss + 0.08) next.push("rtx");
            else next.push("ok");
          } else {
            if (r < loss) next.push("lost");
            else if (transport.outOfOrderUdp && r < loss + 0.12) next.push("wait");
            else next.push("ok");
          }
        }
        return next;
      });
      const v = Math.max(0.1, metrics.throughputMbps * (0.85 + Math.random() * 0.3));
      const rtx =
        transport.protocol === "tcp"
          ? Math.min(100, loss * 80 + Math.random() * 12)
          : 0;
      setThroughputSeries((s) => [...s, { t: Date.now(), v }].slice(-45));
      setRtxSeries((s) => [...s, { t: Date.now(), r: rtx }].slice(-45));
    }, 900);
    return () => window.clearInterval(id);
  }, [loss, metrics.throughputMbps, transport.protocol, transport.outOfOrderUdp]);

  const pieData = [
    { name: "Delivered", value: deliveredPct },
    { name: "Lost/Dropped", value: Math.max(0, 100 - deliveredPct) },
  ];

  const pieColors = ["#5A8C1A", "#B5456B"];

  const [seqTick, setSeqTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setSeqTick((x) => (x + 1) % 24), 700);
    return () => window.clearInterval(id);
  }, []);

  const checksumOk = transport.packetLossPercent < 12 || transport.protocol === "tcp";

  return (
    <motion.div
      className="layer-page-enter flex flex-col gap-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <LayerCard layer={L}>
        <h2 className="text-[clamp(28px,4vw,36px)] font-bold tracking-[-0.5px] text-[#1A1A1A]">
          Transport Layer
        </h2>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-[#666]">
          Real-world: TCP backs your web and email with retries; UDP carries Zoom and DNS where a
          late packet is worse than a missing one.
        </p>
      </LayerCard>

      <DownstreamAlerts />

      <LayerCard layer={L}>
        <DelayedTooltip
          content="Each tile is a cartoon segment: green delivered, red lost, yellow queued, blue retransmitted (TCP recovery)."
          delayMs={500}
        >
          <SectionTitle className="mb-5 cursor-default">Segment grid (8×8)</SectionTitle>
        </DelayedTooltip>
        <div className="mx-auto grid max-w-md grid-cols-8 gap-1">
          {grid.map((c, i) => (
            <motion.div
              key={i}
              layout
              className={`aspect-square rounded-sm ${COLORS[c]}`}
              animate={{ opacity: [0.85, 1] }}
              transition={{ duration: 0.4 }}
            />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-[13px] text-[#888]">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#5A8C1A]" /> success
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#E85D75]" /> lost
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#FFD166]" /> waiting
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#4AA8D8]" /> retransmit
          </span>
        </div>
      </LayerCard>

      <div className="grid gap-5 lg:grid-cols-[3fr_2fr] lg:gap-8">
        <LayerCard layer={L}>
          <SectionTitle className="mb-5">Metrics</SectionTitle>
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3 rounded-[20px] border border-[#F0F0F0] bg-[#FDF8F0] px-4 py-3">
              <DelayedTooltip
                content="TCP provides reliability with ACKs and retransmits; UDP is fire-and-forget—ideal for live media tolerating loss."
                delayMs={500}
              >
                <span className="cursor-help border-b border-dotted border-[#CCC] text-[18px] font-medium text-[#333]">
                  Protocol
                </span>
              </DelayedTooltip>
              {/* <div className="flex flex-wrap gap-2">
                <PillButton
                  variant={transport.protocol === "tcp" ? "primary" : "secondary"}
                  accent={t.accent}
                  accentHover={t.accentHover}
                  onClick={() => setProto("tcp")}
                  className="!h-10 !min-h-0 !px-4 !text-[16px]"
                >
                  TCP Reliable
                </PillButton>
                <PillButton
                  variant={transport.protocol === "udp" ? "primary" : "secondary"}
                  accent={t.accent}
                  accentHover={t.accentHover}
                  onClick={() => setProto("udp")}
                  className="!h-10 !min-h-0 !px-4 !text-[16px]"
                >
                  UDP Fast
                </PillButton>
              </div> */}

              <div className="flex flex-wrap gap-3">
  <PillButton
    variant={
      transport.protocol === "tcp"
        ? "primary"
        : "secondary"
    }
    accent={t.accent}
    accentHover={t.accentHover}
    onClick={() => setProto("tcp")}
    className={`
      !h-11
      !min-h-0
      !rounded-2xl
      !px-5
      !text-[15px]
      !font-bold
      ${
        transport.protocol !== "tcp"
          ? "!bg-[#E5E7EB] !text-black !border !border-[#D1D5DB]"
          : ""
      }
    `}
  >
    TCP Reliable
  </PillButton>

  <PillButton
    variant={
      transport.protocol === "udp"
        ? "primary"
        : "secondary"
    }
    accent={t.accent}
    accentHover={t.accentHover}
    onClick={() => setProto("udp")}
    className={`
      !h-11
      !min-h-0
      !rounded-2xl
      !px-5
      !text-[15px]
      !font-bold
      ${
        transport.protocol !== "udp"
          ? "!bg-[#E5E7EB] !text-black !border !border-[#D1D5DB]"
          : ""
      }
    `}
  >
    UDP Fast
  </PillButton>
</div>
            </div>

            <SliderField
              layer={L}
              label="Packet loss %"
              tooltip="Packet loss 10% means ~1 in 10 segments fail; TCP conceals loss with retransmits, UDP exposes gaps to the app."
              valueDisplay={`${transport.packetLossPercent}%`}
              min={0}
              max={transport.protocol === "tcp" ? 30 : 70}
              value={transport.packetLossPercent}
              onChange={(e) => setLoss(Number(e.target.value))}
            />

            <SliderField
              layer={L}
              label="Latency (RTT)"
              tooltip="Round-trip delay impacts throughput with TCP: higher RTT means waiting longer for ACKs before sending more data."
              valueDisplay={`${transport.latencyMs} ms`}
              min={0}
              max={500}
              value={transport.latencyMs}
              onChange={(e) => setLat(Number(e.target.value))}
            />

            {transport.protocol === "tcp" ? (
              <SliderField
                layer={L}
                label="Window size"
                tooltip="Window size limits bytes in flight before ACK; a 1 MB window lets TCP pipeline many segments on high-BDP links."
                valueDisplay={`${(transport.windowSizeBytes / 1024).toFixed(0)} KB`}
                min={64 * 1024}
                max={1024 * 1024}
                step={8192}
                value={transport.windowSizeBytes}
                onChange={(e) => setWin(Number(e.target.value))}
              />
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-[#F0F0F0] bg-[#FDF8F0] px-4 py-3">
                <DelayedTooltip
                  content="When enabled, UDP datagrams may arrive out of order—applications must reorder if they care."
                  delayMs={500}
                >
                  <div className="cursor-help border-b border-dotted border-[#CCC] text-[18px] font-medium text-[#333]">
                    Out-of-order delivery
                  </div>
                </DelayedTooltip>
                <PillSwitch
                  checked={transport.outOfOrderUdp}
                  onChange={setOo}
                  accent={t.accent}
                  aria-label="UDP out-of-order delivery"
                />
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <PillButton variant="primary" accent="#C97D2E" accentHover="#a96825" onClick={() => congest()}>
                Simulate Network Congestion
              </PillButton>
              <PillButton variant="secondary" accent={t.accent} accentHover={t.accentHover} onClick={() => reset()}>
                Reset to Defaults
              </PillButton>
            </div>
          </div>
        </LayerCard>

        <LayerCard layer={L}>
          <SectionTitle className="mb-4">Process visual</SectionTitle>
          <div className="space-y-4 font-mono text-[14px] leading-relaxed text-[#4A4A4A] sm:text-[15px]">
            <p>
              <span className="font-semibold" style={{ color: t.accent }}>
                Source Port:
              </span>{" "}
              54321 <span className="text-[#AAA]">→</span>{" "}
              <span className="font-semibold" style={{ color: t.accent }}>
                Destination Port:
              </span>{" "}
              {application.dataType === "http" ? "80/443" : "21/25"}
            </p>
            <p className="flex flex-wrap items-center gap-2">
              <span className="font-semibold" style={{ color: t.accent }}>
                Sequence:
              </span>
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.span
                  key={i}
                  animate={{
                    opacity: (seqTick + i) % 4 === 0 ? 1 : 0.55,
                    scale: (seqTick + i) % 6 === 0 ? 1.05 : 1,
                  }}
                  className="rounded-lg border border-[#EEE] bg-[#FAFAFA] px-2 py-1 text-[12px]"
                >
                  SEQ {(1000 + i * 140 + seqTick * 17) % 9000}
                </motion.span>
              ))}
            </p>
            <p>
              <span className="font-semibold" style={{ color: t.accent }}>
                Checksum:
              </span>{" "}
              {checksumOk ? "✅ Valid" : "❌ Corrupted"}
            </p>
          </div>
        </LayerCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <LayerCard layer={L} className="lg:col-span-2">
          <DelayedTooltip
            content="Illustrative throughput driven by window, RTT, and loss model—drag latency or loss to see the area shrink."
            delayMs={500}
          >
            <SectionTitle className="mb-4 cursor-default">Throughput vs Time</SectionTitle>
          </DelayedTooltip>
          <div className="min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={throughputSeries}>
                <CartesianGrid strokeDasharray="4 4" stroke="#F0F0F0" />
                <XAxis dataKey="t" hide />
                <YAxis tick={{ fill: "#888888", fontSize: 14 }} />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={t.chart}
                  fill={`${t.chart}33`}
                  strokeWidth={2}
                  animationDuration={300}
                />
                <RTooltip content={<ChartTooltipContent />} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </LayerCard>

        <LayerCard layer={L}>
          <DelayedTooltip
            content="Share of segments delivered vs missing—UDP shows raw loss; TCP elevates delivered via retries."
            delayMs={500}
          >
            <SectionTitle className="mb-4 cursor-default">Packet Delivery Ratio</SectionTitle>
          </DelayedTooltip>
          <div className="min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={78}
                  animationDuration={300}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={pieColors[i]} />
                  ))}
                </Pie>
                <RTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </LayerCard>

        {transport.protocol === "tcp" ? (
          <LayerCard layer={L} className="lg:col-span-3">
            <DelayedTooltip
              content="Higher values mean more retransmissions—common when Wi‑Fi loss spikes or congestion collapses the window."
              delayMs={500}
            >
              <SectionTitle className="mb-4 cursor-default">Retransmission Rate (TCP)</SectionTitle>
            </DelayedTooltip>
            <div className="min-h-[200px] w-full">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={rtxSeries}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#F0F0F0" />
                  <XAxis dataKey="t" hide />
                  <YAxis domain={[0, 100]} tick={{ fill: "#888888", fontSize: 14 }} />
                  <Line
                    type="monotone"
                    dataKey="r"
                    stroke="#C97D2E"
                    strokeWidth={2}
                    dot={false}
                    animationDuration={300}
                  />
                  <RTooltip content={<ChartTooltipContent />} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </LayerCard>
        ) : null}
      </div>
    </motion.div>
  );
}
