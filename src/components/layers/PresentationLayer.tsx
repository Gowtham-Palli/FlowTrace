import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { compressedSizeBytes, computePipelineMetrics } from "../../lib/pipelineMetrics";
import { getLayerDesign } from "../../lib/layerDesign";
import { useSimulatorStore } from "../../store/simulatorStore";
import { DelayedTooltip } from "../DelayedTooltip";
import { DownstreamAlerts } from "../DownstreamAlerts";
import { LayerCard } from "../ds/LayerCard";
import { PillButton } from "../ds/PillButton";
import { SectionTitle } from "../ds/SectionTitle";
import { SelectField } from "../ds/SelectField";
import { SliderField } from "../ds/SliderField";

const L = 6;
const t = getLayerDesign(L);

function encPreview(enc: string): string {
  if (enc === "none") return "CUFD…";
  return "3F2A9C…";
}

export function PresentationLayer() {
  const application = useSimulatorStore((s) => s.application);
  const presentation = useSimulatorStore((s) => s.presentation);
  const session = useSimulatorStore((s) => s.session);
  const transport = useSimulatorStore((s) => s.transport);
  const network = useSimulatorStore((s) => s.network);
  const dataLink = useSimulatorStore((s) => s.dataLink);
  const physical = useSimulatorStore((s) => s.physical);
  const setEnc = useSimulatorStore((s) => s.setPresentationEncryption);
  const setComp = useSimulatorStore((s) => s.setPresentationCompression);
  const setEncStr = useSimulatorStore((s) => s.setPresentationEncoding);
  const setHex = useSimulatorStore((s) => s.setPresentationShowHexDump);
  const reset = useSimulatorStore((s) => s.resetPresentationLayer);

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

  const barData = useMemo(
    () => [
      { name: "Original", bytes: application.dataSizeBytes },
      {
        name: "After compression",
        bytes: compressedSizeBytes(
          application.dataSizeBytes,
          presentation.compressionRatioPercent
        ),
      },
    ],
    [application.dataSizeBytes, presentation.compressionRatioPercent]
  );

  const gaugeData = useMemo(
    () => [{ name: "cpu", value: metrics.encryptionCpuPercent, fill: t.chart }],
    [metrics.encryptionCpuPercent]
  );

  const plainText = "Hello World";
  const hexPlain = useMemo(() => {
    const te = new TextEncoder();
    return Array.from(te.encode(plainText))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(" ");
  }, []);

  return (
    <motion.div
      className="layer-page-enter flex flex-col gap-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <LayerCard layer={L}>
        <h2 className="text-[clamp(28px,4vw,36px)] font-bold tracking-[-0.5px] text-[#1A1A1A]">
          Presentation Layer
        </h2>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-[#666]">
          Real-world: TLS encrypts your banking session; gzip shrinks JSON APIs; UTF-8 lets browsers
          exchange emoji with servers worldwide.
        </p>
      </LayerCard>

      <DownstreamAlerts />

      <div className="grid gap-5 lg:grid-cols-3">
        {[
          { title: "Plaintext", body: plainText },
          { title: "Encrypted", body: encPreview(presentation.encryption) },
          { title: "Compressed (conceptual)", body: "[Binary stream]" },
        ].map((p) => (
          <LayerCard key={p.title} layer={L}>
            <h3 className="mb-3 text-[18px] font-semibold tracking-tight text-[#1E6F9F]">
              {p.title}
            </h3>
            <AnimatePresence mode="wait">
              <motion.pre
                key={p.body}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="min-h-[4rem] whitespace-pre-wrap font-mono text-[16px] text-[#4A4A4A]"
              >
                {p.body}
              </motion.pre>
            </AnimatePresence>
          </LayerCard>
        ))}
      </div>

      <LayerCard layer={L}>
        <p className="mb-3 text-[14px] font-semibold uppercase tracking-wide text-[#888]">
          Process visual
        </p>
        <div className="flex flex-wrap items-center gap-2 font-mono text-[16px] text-[#333]">
          <span>Hello World</span>
          <span className="text-[#1E6F9F]">→ [Encrypt] →</span>
          <span className="font-semibold text-[#C97D2E]">{encPreview(presentation.encryption)}</span>
          <span className="text-[#1E6F9F]">→ [Compress] →</span>
          <span className="text-[#B5456B]">[Binary]</span>
        </div>
      </LayerCard>

      <div className="grid gap-5 lg:grid-cols-2">
        <LayerCard layer={L}>
          <SectionTitle className="mb-5">Metrics</SectionTitle>
          <div className="flex flex-col gap-5">
            <SelectField
              layer={L}
              label="Encryption"
              tooltip="AES-256 is military-grade encryption; adds roughly 10–15% size overhead vs plaintext blocks in this simulator."
              value={presentation.encryption}
              onChange={(e) => setEnc(e.target.value as typeof presentation.encryption)}
            >
              <option value="none">None</option>
              <option value="aes128">AES-128</option>
              <option value="aes256">AES-256</option>
            </SelectField>

            <SliderField
              layer={L}
              label="Compression ratio"
              tooltip="Compression ratio 90% means 1 MB becomes ~100 KB; text compresses well, images often don’t (already compressed)."
              valueDisplay={`${presentation.compressionRatioPercent}%`}
              min={0}
              max={90}
              value={presentation.compressionRatioPercent}
              onChange={(e) => setComp(Number(e.target.value))}
            />

            <SelectField
              layer={L}
              label="Character encoding"
              tooltip="ASCII is English-centric; UTF-8 is the web default; UTF-16 doubles many Western characters on the wire."
              value={presentation.encoding}
              onChange={(e) => setEncStr(e.target.value as typeof presentation.encoding)}
            >
              <option value="ascii">ASCII</option>
              <option value="utf8">UTF-8</option>
              <option value="utf16">UTF-16</option>
            </SelectField>

            <div className="flex flex-wrap gap-3">
              <PillButton variant="primary" accent={t.accent} accentHover={t.accentHover} onClick={() => setHex(!presentation.showHexDump)}>
                Show Hex Dump
              </PillButton>
              <PillButton variant="secondary" accent={t.accent} accentHover={t.accentHover} onClick={() => reset()}>
                Reset to Defaults
              </PillButton>
            </div>
          </div>
        </LayerCard>

        <div className="flex flex-col gap-5">
          <LayerCard layer={L}>
            <DelayedTooltip
              content="Compares original application payload vs size after compression. Zero compression leaves both bars equal."
              delayMs={500}
            >
              <SectionTitle className="mb-4 cursor-default">Data Size Reduction</SectionTitle>
            </DelayedTooltip>
            <div className="min-h-[200px] w-full">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#F0F0F0" />
                  <XAxis dataKey="name" tick={{ fill: "#888888", fontSize: 14 }} />
                  <YAxis tick={{ fill: "#888888", fontSize: 14 }} />
                  <Bar dataKey="bytes" fill={t.chart} radius={[8, 8, 0, 0]} animationDuration={300} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </LayerCard>

          <LayerCard layer={L}>
            <DelayedTooltip
              content="Illustrative CPU cost for encrypting streams; AES-256 is heavier than AES-128 but still fast on modern CPUs."
              delayMs={500}
            >
              <SectionTitle className="mb-4 cursor-default">Encryption CPU Overhead</SectionTitle>
            </DelayedTooltip>
            <div className="relative mx-auto h-44 w-44">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="58%"
                  outerRadius="100%"
                  barSize={14}
                  data={gaugeData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar
                    dataKey="value"
                    cornerRadius={6}
                    background={{ fill: "#F0F0F0" }}
                    animationDuration={300}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="text-[28px] font-bold" style={{ color: t.accent }}>
                  {metrics.encryptionCpuPercent}%
                </span>
              </div>
            </div>
          </LayerCard>
        </div>
      </div>

      {presentation.showHexDump ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden"
        >
          <LayerCard layer={L}>
            <SectionTitle className="mb-3">Raw bytes (UTF-8)</SectionTitle>
            <pre className="break-all font-mono text-[15px] leading-relaxed text-[#1E6F9F]">
              {hexPlain}
            </pre>
          </LayerCard>
        </motion.div>
      ) : null}
    </motion.div>
  );
}
