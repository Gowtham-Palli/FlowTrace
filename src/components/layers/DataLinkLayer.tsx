import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
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
import { SectionTitle } from "../ds/SectionTitle";
import { SelectField } from "../ds/SelectField";
import { SliderField } from "../ds/SliderField";
import { DelayedTooltip } from "../DelayedTooltip";
import { DownstreamAlerts } from "../DownstreamAlerts";

const L = 2;
const t = getLayerDesign(L);

export function DataLinkLayer() {
  const application = useSimulatorStore((s) => s.application);
  const presentation = useSimulatorStore((s) => s.presentation);
  const session = useSimulatorStore((s) => s.session);
  const transport = useSimulatorStore((s) => s.transport);
  const network = useSimulatorStore((s) => s.network);
  const dataLink = useSimulatorStore((s) => s.dataLink);
  const physical = useSimulatorStore((s) => s.physical);
  const crcPulse = useSimulatorStore((s) => s.dataLink.crcFailurePulse);

  const setBer = useSimulatorStore((s) => s.setDataLinkBer);
  const setMac = useSimulatorStore((s) => s.setDataLinkMac);
  const setCsma = useSimulatorStore((s) => s.setDataLinkCsma);
  const injectBit = useSimulatorStore((s) => s.injectBitError);
  const reset = useSimulatorStore((s) => s.resetDataLinkLayer);

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

  const [ferSeries, setFerSeries] = useState<{ t: number; fer: number }[]>([]);
  const [crcFails, setCrcFails] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setFerSeries((s) =>
        [
          ...s,
          {
            t: Date.now(),
            fer: Math.min(
              100,
              dataLink.berPercent * 8 + Math.random() * (metrics.framesCorrupted % 7)
            ),
          },
        ].slice(-50)
      );
    }, 1100);
    return () => window.clearInterval(id);
  }, [dataLink.berPercent, metrics.framesCorrupted]);

  useEffect(() => {
    if (crcPulse > 0) setCrcFails((c) => c + 1);
  }, [crcPulse]);

  const crcOk = crcFails % 2 === 0;

  return (
    <motion.div
      className="layer-page-enter flex flex-col gap-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <LayerCard layer={L}>
        <h2 className="text-[clamp(28px,4vw,36px)] font-bold tracking-[-0.5px] text-[#1A1A1A]">
          Data Link Layer
        </h2>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-[#666]">
          Real-world: Ethernet frames carry MAC addresses on LANs; Wi‑Fi adds retries; CRC catches
          corrupted frames before they reach the IP stack.
        </p>
      </LayerCard>

      <DownstreamAlerts />

      <LayerCard layer={L}>
        <SectionTitle className="mb-4">MAC frame</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {["Preamble", "Dest MAC", "Src MAC", "Type", "Payload", "CRC"].map((f) => (
            <div
              key={f}
              className="rounded-[12px] border border-[#FFE8C4] bg-[#FFF9F0] px-3 py-2 text-[14px] font-semibold text-[#C16E1A]"
            >
              [{f}]
            </div>
          ))}
        </div>
      </LayerCard>

      <div className="grid gap-5 lg:grid-cols-[3fr_2fr] lg:gap-8">
        <LayerCard layer={L}>
          <SectionTitle className="mb-5">Metrics</SectionTitle>
          <div className="flex flex-col gap-5">
            <SliderField
              layer={L}
              label="Error rate (BER)"
              tooltip="BER models random bit flips; at ~1% many frames need discarding—CRC catches them before upper layers waste CPU."
              valueDisplay={`${dataLink.berPercent}%`}
              min={0}
              max={10}
              step={0.1}
              value={dataLink.berPercent}
              onChange={(e) => setBer(Number(e.target.value))}
            />

            <SelectField
              layer={L}
              label="MAC protocol"
              tooltip="Ethernet dominates wired LANs; Wi‑Fi uses CSMA/CA; Token Ring is historical but illustrates deterministic token passing."
              value={dataLink.macProtocol}
              onChange={(e) => setMac(e.target.value as typeof dataLink.macProtocol)}
            >
              <option value="ethernet">Ethernet</option>
              <option value="wifi">Wi-Fi</option>
              <option value="tokenring">Token Ring</option>
            </SelectField>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-[#F0F0F0] bg-[#FDF8F0] px-4 py-3">
              <DelayedTooltip
                content="CSMA/CD listens before transmitting on shared Ethernet; modern switched LANs rarely collide but still honor frame timing."
                delayMs={500}
              >
                <div className="cursor-help border-b border-dotted border-[#CCC] text-[18px] font-medium text-[#333]">
                  Collision detection (CSMA/CD)
                </div>
              </DelayedTooltip>
              <button
                type="button"
                role="switch"
                aria-checked={dataLink.csmaCd}
                onClick={() => setCsma(!dataLink.csmaCd)}
                className={`relative h-8 w-[60px] shrink-0 rounded-full transition-colors duration-200 ${
                  dataLink.csmaCd ? "" : "bg-[#E5E5E5]"
                }`}
                style={{ backgroundColor: dataLink.csmaCd ? t.accent : undefined }}
              >
                <span
                  className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-200 ${
                    dataLink.csmaCd ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <PillButton variant="primary" accent="#B5456B" accentHover="#963a57" onClick={() => injectBit()}>
                Inject Single Bit Error
              </PillButton>
              <PillButton variant="secondary" accent={t.accent} accentHover={t.accentHover} onClick={() => reset()}>
                Reset to Defaults
              </PillButton>
            </div>
          </div>
        </LayerCard>

        <LayerCard layer={L}>
          <SectionTitle className="mb-4">Process visual</SectionTitle>
          <div className="space-y-3 font-mono text-[14px] leading-relaxed text-[#4A4A4A]">
            <p>Dest: AA:BB:CC:DD:EE:FF</p>
            <p>Source: 00:11:22:33:44:55</p>
            <p>
              CRC: 0x3F2A{" "}
              <motion.span
                key={crcFails}
                animate={{ opacity: [0.6, 1] }}
                className={crcOk ? "font-semibold text-[#5A8C1A]" : "font-semibold text-[#B5456B]"}
              >
                {crcOk ? "(✅ Valid)" : "(❌ Corrupt)"}
              </motion.span>
            </p>
          </div>
        </LayerCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <LayerCard layer={L}>
          <DelayedTooltip
            content="Illustrative frame error rate derived from BER—spikes when interference or bad cabling raises bit errors."
            delayMs={500}
          >
            <SectionTitle className="mb-4 cursor-default">Frame Error Rate</SectionTitle>
          </DelayedTooltip>
          <div className="min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={ferSeries}>
                <CartesianGrid strokeDasharray="4 4" stroke="#F0F0F0" />
                <XAxis dataKey="t" hide />
                <YAxis domain={[0, 100]} tick={{ fill: "#888888", fontSize: 14 }} />
                <Line
                  type="monotone"
                  dataKey="fer"
                  stroke={t.chart}
                  strokeWidth={2}
                  dot={false}
                  animationDuration={300}
                />
                <RTooltip content={<ChartTooltipContent />} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </LayerCard>

        <LayerCard layer={L}>
          <DelayedTooltip
            content="Counts synthetic CRC failures when you inject bit errors—mirrors FCS rejects on real NICs."
            delayMs={500}
          >
            <SectionTitle className="mb-4 cursor-default">CRC failure count</SectionTitle>
          </DelayedTooltip>
          <div className="flex flex-col items-center gap-2 py-10">
            <span
              className={`text-[48px] font-bold tabular-nums ${
                crcFails > 4 ? "animate-pulse text-[#B5456B]" : "text-[#C16E1A]"
              }`}
            >
              {crcFails}
            </span>
            <span className="text-[15px] text-[#888]">failures (session)</span>
          </div>
        </LayerCard>
      </div>
    </motion.div>
  );
}
