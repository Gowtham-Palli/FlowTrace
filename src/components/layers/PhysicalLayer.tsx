import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
  ZAxis,
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

const L = 1;
const t = getLayerDesign(L);

export function PhysicalLayer() {
  const application = useSimulatorStore((s) => s.application);
  const presentation = useSimulatorStore((s) => s.presentation);
  const session = useSimulatorStore((s) => s.session);
  const transport = useSimulatorStore((s) => s.transport);
  const network = useSimulatorStore((s) => s.network);
  const dataLink = useSimulatorStore((s) => s.dataLink);
  const physical = useSimulatorStore((s) => s.physical);

  const setMedium = useSimulatorStore((s) => s.setPhysicalMedium);
  const setSig = useSimulatorStore((s) => s.setPhysicalSignal);
  const setSnr = useSimulatorStore((s) => s.setPhysicalSnr);
  const setIf = useSimulatorStore((s) => s.setPhysicalInterference);
  const setDist = useSimulatorStore((s) => s.setPhysicalDistance);
  const addRep = useSimulatorStore((s) => s.addRepeater);
  const reset = useSimulatorStore((s) => s.resetPhysicalLayer);

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

  const [scatter, setScatter] = useState<{ snr: number; ber: number }[]>([]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setScatter((s) =>
        [
          ...s,
          {
            snr: physical.snrDb + (Math.random() - 0.5) * 4,
            ber: Math.max(0, dataLink.berPercent + Math.random() * 0.5),
          },
        ].slice(-40)
      );
    }, 1200);
    return () => window.clearInterval(id);
  }, [physical.snrDb, dataLink.berPercent]);

  const attenuation = useMemo(() => {
    const lossPer100 =
      physical.medium === "fiber" ? 0.2 : physical.medium === "wifi6" ? 3 : 1.2;
    return (
      (physical.distanceM / 100) * lossPer100 +
      (physical.repeaterCount > 0 ? -physical.repeaterCount * 2 : 0)
    );
  }, [physical.medium, physical.distanceM, physical.repeaterCount]);

  const lineAtt = useMemo(
    () =>
      [0, 0.25, 0.5, 0.75, 1].map((x) => ({
        d: Math.round(x * physical.distanceM),
        db: Number((x * attenuation + (1 - physical.snrDb / 30) * 2).toFixed(2)),
      })),
    [physical.distanceM, attenuation, physical.snrDb]
  );

  const flipIndex = 4;

  return (
    <motion.div
      className="layer-page-enter flex flex-col gap-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <LayerCard layer={L}>
        <h2 className="text-[clamp(28px,4vw,36px)] font-bold tracking-[-0.5px] text-[#1A1A1A]">
          Physical Layer
        </h2>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-[#666]">
          Real-world: fiber spans data centers and undersea cables; copper Cat6 serves desks; Wi‑Fi 6
          fights interference for airtime.
        </p>
      </LayerCard>

      <DownstreamAlerts />

      <LayerCard layer={L} className="relative overflow-hidden">
        <SectionTitle className="mb-4">Oscilloscope (symbol view)</SectionTitle>
        <svg viewBox="0 0 400 120" className="h-32 w-full" style={{ color: t.accent }}>
          <path
            d="M0 60 Q 40 20 80 60 T 160 60 T 240 40 T 320 60 T 400 55"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M0 90 L400 90" stroke="#F0F0F0" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
        <p className="mt-3 text-[13px] text-[#888]">
          Stylized waveform — higher SNR produces cleaner transitions between symbols.
        </p>
      </LayerCard>

      <div className="grid gap-5 lg:grid-cols-[3fr_2fr] lg:gap-8">
        <LayerCard layer={L}>
          <SectionTitle className="mb-5">Metrics</SectionTitle>
          <div className="flex flex-col gap-5">
            <SelectField
              layer={L}
              label="Medium"
              tooltip="Fiber reaches tens of km with low loss; Cat6 is rated to ~100 m; Wi‑Fi 6 shares 2.4/5 GHz with interference sources."
              value={physical.medium}
              onChange={(e) => setMedium(e.target.value as typeof physical.medium)}
            >
              <option value="copper">Copper Cat6</option>
              <option value="fiber">Fiber Optic</option>
              <option value="wifi6">Wi-Fi 6</option>
            </SelectField>

            <SliderField
              layer={L}
              label="Signal strength"
              tooltip="Receive power in dBm; closer to 0 dBm is hotter signal; values near −90 dBm are marginal."
              valueDisplay={`${physical.signalDbm} dBm`}
              min={-30}
              max={10}
              value={physical.signalDbm}
              onChange={(e) => setSig(Number(e.target.value))}
            />

            <SliderField
              layer={L}
              label="Signal-to-noise ratio"
              tooltip="SNR below 10 dB is poor; above 20 dB is excellent—Wi‑Fi often degrades when SNR dips below ~15 dB."
              valueDisplay={`${physical.snrDb} dB`}
              min={0}
              max={30}
              value={physical.snrDb}
              onChange={(e) => setSnr(Number(e.target.value))}
            />

            <SelectField
              layer={L}
              label="Interference"
              tooltip="Microwaves and neighboring APs raise interference—more retransmissions at L2 and perceived jitter at L4."
              value={physical.interference}
              onChange={(e) => setIf(e.target.value as typeof physical.interference)}
            >
              <option value="none">None</option>
              <option value="mild">Mild</option>
              <option value="severe">Severe</option>
            </SelectField>

            <SliderField
              layer={L}
              label="Distance"
              tooltip="Attenuation grows with distance—repeaters regenerate signals on long copper or fiber spans."
              valueDisplay={`${physical.distanceM} m`}
              min={1}
              max={500}
              value={physical.distanceM}
              onChange={(e) => setDist(Number(e.target.value))}
            />

            <div className="flex flex-wrap gap-3">
              <PillButton variant="primary" accent={t.accent} accentHover={t.accentHover} onClick={() => addRep()}>
                Add Repeater ({physical.repeaterCount})
              </PillButton>
              <PillButton variant="secondary" accent={t.accent} accentHover={t.accentHover} onClick={() => reset()}>
                Reset to Defaults
              </PillButton>
            </div>
          </div>
        </LayerCard>

        <LayerCard layer={L}>
          <SectionTitle className="mb-4">Process visual</SectionTitle>
          <div className="flex flex-wrap gap-1 text-[16px] font-mono font-semibold text-[#333]">
            {[1, 0, 1, 1, 0, 0, 1, 0].map((b, i) => (
              <motion.span
                key={i}
                animate={{
                  color: i === flipIndex && metrics.bitErrors > 20 ? "#FFB300" : "#B5456B",
                }}
              >
                {i === flipIndex && metrics.bitErrors > 20 ? (b === 1 ? 0 : 1) : b}{" "}
              </motion.span>
            ))}
          </div>
          <p className="mt-4 text-[14px] text-[#888]">
            → [
            {physical.medium === "fiber"
              ? "Fiber"
              : physical.medium === "wifi6"
                ? "Wi-Fi 6"
                : "Copper"}
            ] →
          </p>
          <p className="mt-2 text-[14px] font-medium text-[#B5456B]">
            With noise: bit flip at position {flipIndex + 1} when L1 stress is high (illustrative).
          </p>
        </LayerCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <LayerCard layer={L}>
          <DelayedTooltip
            content="Higher SNR generally lowers BER—scatter points wander as you drag SNR or BER sliders."
            delayMs={500}
          >
            <SectionTitle className="mb-4 cursor-default">Bit Error Rate vs SNR</SectionTitle>
          </DelayedTooltip>
          <div className="min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height={220}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="4 4" stroke="#F0F0F0" />
                <XAxis
                  type="number"
                  dataKey="snr"
                  name="SNR"
                  tick={{ fill: "#888888", fontSize: 14 }}
                />
                <YAxis
                  type="number"
                  dataKey="ber"
                  name="BER"
                  tick={{ fill: "#888888", fontSize: 14 }}
                />
                <ZAxis range={[40, 140]} />
                <Scatter data={scatter} fill={t.chart} />
                <RTooltip content={<ChartTooltipContent />} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </LayerCard>

        <LayerCard layer={L}>
          <DelayedTooltip
            content="Illustrative loss budget vs distance—fiber stays flatter; copper and Wi‑Fi climb faster without repeaters."
            delayMs={500}
          >
            <SectionTitle className="mb-4 cursor-default">Signal attenuation over distance</SectionTitle>
          </DelayedTooltip>
          <div className="min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={lineAtt}>
                <CartesianGrid strokeDasharray="4 4" stroke="#F0F0F0" />
                <XAxis dataKey="d" tick={{ fill: "#888888", fontSize: 14 }} />
                <YAxis tick={{ fill: "#888888", fontSize: 14 }} />
                <Line
                  type="monotone"
                  dataKey="db"
                  stroke={t.chart}
                  strokeWidth={2}
                  dot={{ fill: t.chart }}
                  animationDuration={300}
                />
                <RTooltip content={<ChartTooltipContent />} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </LayerCard>
      </div>
    </motion.div>
  );
}
