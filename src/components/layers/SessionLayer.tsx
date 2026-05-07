import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { logBytesFromSliderPosition, sliderPositionFromBytes, useSimulatorStore } from "../../store/simulatorStore";
import { ChartTooltipContent } from "../ds/ChartTooltipContent";
import { LayerCard } from "../ds/LayerCard";
import { PillButton } from "../ds/PillButton";
import { PillSwitch } from "../ds/PillSwitch";
import { SectionTitle } from "../ds/SectionTitle";
import { SliderField } from "../ds/SliderField";
import { DelayedTooltip } from "../DelayedTooltip";
import { DownstreamAlerts } from "../DownstreamAlerts";

const L = 5;
const t = getLayerDesign(L);

const CK_MIN = 100 * 1024;
const CK_MAX = 5 * 1024 * 1024;

export function SessionLayer() {
  const session = useSimulatorStore((s) => s.session);
  const faultPulse = useSimulatorStore((s) => s.session.faultPulse);
  const application = useSimulatorStore((s) => s.application);
  const presentation = useSimulatorStore((s) => s.presentation);
  const transport = useSimulatorStore((s) => s.transport);
  const network = useSimulatorStore((s) => s.network);
  const dataLink = useSimulatorStore((s) => s.dataLink);
  const physical = useSimulatorStore((s) => s.physical);

  const setTimeoutSec = useSimulatorStore((s) => s.setSessionTimeout);
  const setCk = useSimulatorStore((s) => s.setCheckpointIntervalBytes);
  const setDuplex = useSimulatorStore((s) => s.setSessionDuplex);
  const reset = useSimulatorStore((s) => s.resetSessionLayer);
  const injectFailure = useSimulatorStore((s) => s.injectSessionFailure);

  const [health, setHealth] = useState<{ t: number; kb: number }[]>([]);
  const [bytesTransferred, setBytesTransferred] = useState(0);
  const [recovered, setRecovered] = useState(false);
  const accKbRef = useRef(0);

  const ckSlider = sliderPositionFromBytes(session.checkpointIntervalBytes, CK_MIN, CK_MAX);

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

  useEffect(() => {
    const id = window.setInterval(() => {
      accKbRef.current += metrics.goodputMbps * 0.35 + Math.random() * 4;
      const kb = Math.round(accKbRef.current * 10) / 10;
      setHealth((h) => [...h, { t: Date.now(), kb }].slice(-40));
      setBytesTransferred((b) => {
        const next = b + Math.round(metrics.goodputMbps * 25 + Math.random() * 40);
        return next % (5 * 1024 * 1024);
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [metrics.goodputMbps]);

  useEffect(() => {
    if (faultPulse > 0) {
      setBytesTransferred((b) => Math.floor(b * 0.3));
      setRecovered(false);
    }
  }, [faultPulse]);

  const sessionId = useMemo(
    () =>
      `SESS-${(faultPulse + application.requestCadenceRps).toString(16).slice(0, 4).toUpperCase()}${Math.floor(session.sessionTimeoutSec / 10)}`,
    [faultPulse, application.requestCadenceRps, session.sessionTimeoutSec]
  );

  const checkpointLabel =
    Math.floor(bytesTransferred / session.checkpointIntervalBytes) *
    session.checkpointIntervalBytes;

  return (
    <motion.div
      className="layer-page-enter flex flex-col gap-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <LayerCard layer={L}>
        <h2 className="text-[clamp(28px,4vw,36px)] font-bold tracking-[-0.5px] text-[#1A1A1A]">
          Session Layer
        </h2>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-[#666]">
          Real-world: HTTPS cookies keep you logged in; FTP control connections stay open while files
          transfer; SSH multiplexes channels inside one session.
        </p>
      </LayerCard>

      <DownstreamAlerts />

      <LayerCard layer={L}>
        <SectionTitle className="mb-5">Session timeline</SectionTitle>
        <div className="relative flex flex-wrap items-center gap-3 text-[14px] sm:text-[15px]">
          {["Session Open", "Data Transfer", "Checkpoints", "Close"].map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-1 items-center gap-2"
            >
              <span
                className="rounded-full px-3 py-2 font-semibold shadow-sm ring-1 ring-[#D5F5E8]"
                style={{ backgroundColor: t.soft, color: t.accent }}
              >
                {step}
              </span>
              {i < 3 ? <span className="text-[#CCC]">→</span> : null}
            </motion.div>
          ))}
        </div>
      </LayerCard>

      <div className="grid gap-5 lg:grid-cols-[3fr_2fr] lg:gap-8">
        <LayerCard layer={L}>
          <SectionTitle className="mb-5">Metrics</SectionTitle>
          <div className="flex flex-col gap-5">
            <SliderField
              layer={L}
              label="Session timeout"
              tooltip="Session timeout: FTP control sessions often idle out after minutes; web apps refresh JWT cookies before expiry."
              valueDisplay={`${session.sessionTimeoutSec}s`}
              min={10}
              max={300}
              value={session.sessionTimeoutSec}
              onChange={(e) => setTimeoutSec(Number(e.target.value))}
            />

            <SliderField
              layer={L}
              label="Checkpoint interval"
              tooltip="Checkpoints help resume large downloads after interruption—similar to torrent piece maps or HTTP range retries."
              valueDisplay={`${(session.checkpointIntervalBytes / 1024).toFixed(0)} KB`}
              min={0}
              max={100}
              step={0.5}
              value={ckSlider}
              onChange={(e) =>
                setCk(logBytesFromSliderPosition(Number(e.target.value), CK_MIN, CK_MAX))
              }
            />

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-[#F0F0F0] bg-[#FDF8F0] px-4 py-3">
              <DelayedTooltip
                content="Simplex: one-way broadcast; Duplex: HTTP request/response on the same TCP connection."
                delayMs={500}
              >
                <div className="cursor-help border-b border-dotted border-[#CCC] text-[18px] font-medium text-black">
                  Dialog type (duplex)
                </div>
              </DelayedTooltip>
              <PillSwitch
                checked={session.duplex}
                onChange={setDuplex}
                accent={t.accent}
                aria-label="Toggle duplex two-way session"
              />
            </div>
            <p className="text-[15px] font-medium text-[#666]">
              {session.duplex ? "Duplex (two-way)" : "Simplex (one-way)"}
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <PillButton
                variant="primary"
                accent="#C97D2E"
                accentHover="#a96825"
                onClick={() => injectFailure()}
              >
                Inject Failure
              </PillButton>
              <PillButton
                variant="primary"
                accent={t.accent}
                accentHover={t.accentHover}
                onClick={() => {
                  setRecovered(true);
                  setBytesTransferred((b) => b + session.checkpointIntervalBytes * 0.1);
                }}
              >
                Simulate recovery
              </PillButton>
              <PillButton variant="secondary" accent={t.accent} accentHover={t.accentHover} onClick={() => reset()}>
                Reset to Defaults
              </PillButton>
            </div>
          </div>
        </LayerCard>

        <LayerCard layer={L}>
          <SectionTitle className="mb-4">Process visual</SectionTitle>
          <motion.div
            key={sessionId}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-3 font-mono text-[14px] leading-relaxed text-[#4A4A4A] sm:text-[15px]"
          >
            <p>
              <span className="font-semibold" style={{ color: t.accent }}>
                Session ID:
              </span>{" "}
              {sessionId} established
            </p>
            <p>
              <span className="font-semibold" style={{ color: t.accent }}>
                Checkpoint saved at
              </span>{" "}
              {Math.max(session.checkpointIntervalBytes, checkpointLabel)} B offset (simulated)
            </p>
            {recovered ? (
              <p className="font-semibold text-[#5A8C1A]">Recovered from last checkpoint ✓</p>
            ) : faultPulse > 0 ? (
              <p className="font-semibold text-[#C97D2E]">Connection degraded — use recovery to resume</p>
            ) : null}
          </motion.div>
        </LayerCard>
      </div>

      <LayerCard layer={L}>
        <DelayedTooltip
          content="Tracks illustrative KB transferred over time; spikes when application throughput rises."
          delayMs={500}
        >
          <SectionTitle className="mb-4 cursor-default">Live Session Health</SectionTitle>
        </DelayedTooltip>
        <div className="min-h-[200px] w-full">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={health}>
              <CartesianGrid strokeDasharray="4 4" stroke="#F0F0F0" />
              <XAxis dataKey="t" hide />
              <YAxis tick={{ fill: "#888888", fontSize: 14 }} />
              <Line
                type="monotone"
                dataKey="kb"
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
    </motion.div>
  );
}
