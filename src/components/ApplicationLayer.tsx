import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  type ApplicationDataType,
  logBytesFromSliderPosition,
  sliderPositionFromBytes,
  useSimulatorStore,
} from "../store/simulatorStore";
import { getLayerDesign } from "../lib/layerDesign";
import { ChartTooltipContent } from "./ds/ChartTooltipContent";
import { LayerCard } from "./ds/LayerCard";
import { PillButton } from "./ds/PillButton";
import { PillSwitch } from "./ds/PillSwitch";
import { SectionTitle } from "./ds/SectionTitle";
import { SelectField } from "./ds/SelectField";
import { SliderField } from "./ds/SliderField";
import { DelayedTooltip } from "./DelayedTooltip";
import { DownstreamAlerts } from "./DownstreamAlerts";

const LAYER = 7;
const t = getLayerDesign(LAYER);

const MIN_B = 1024;
const MAX_B = 10 * 1024 * 1024;

function formatBytes(n: number): string {
  if (n >= 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(2)} MB`;
  if (n >= 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${n} B`;
}

function buildProtocolPreview(
  dataType: ApplicationDataType,
  dataSizeBytes: number,
  rps: number,
  secureTransport: boolean
): string {
  const sizeKb = (dataSizeBytes / 1024).toFixed(1);
  if (dataType === "http") {
    const scheme = secureTransport ? "https" : "http";
    const portLine = secureTransport
      ? "Implicit TLS: port 443 (HTTPS)"
      : "Cleartext: port 80 (HTTP)";
    return [
      `GET /index.html HTTP/1.1`,
      "Host: example.com",
      "User-Agent: Simulator/1.0",
      `X-Sim-Endpoint: ${scheme}://example.com/index.html (${portLine})`,
      `Content-Length: ${dataSizeBytes}`,
      `X-Sim-RPS: ${rps}`,
      "",
      "<!-- response body omitted -->",
    ].join("\n");
  }
  if (dataType === "smtp") {
    const tls = secureTransport ? "STARTTLS (submission often on 587)" : "Plain SMTP port 25";
    return [
      "EHLO mail.example.com",
      `X-Security: ${tls}`,
      "MAIL FROM:<sender@example.com>",
      `RCPT TO:<recipient@example.com> size=${sizeKb}KB`,
      "DATA",
      `Subject: Message (${sizeKb} KB payload)`,
      `X-Rate: ${rps} msgs/s simulated`,
      ".",
      "QUIT",
    ].join("\n");
  }
  const ftpTls = secureTransport ? "AUTH TLS + PROT P (FTPS)" : "Cleartext FTP port 21";
  return [
    "USER anonymous",
    "PASS guest@",
    `X-Security: ${ftpTls}`,
    `TYPE I`,
    `SIZE large-file.bin ${dataSizeBytes}`,
    `PASV`,
    `RETR /pub/sample-${rps}rps.bin`,
    "QUIT",
  ].join("\n");
}

function mockClientTitle(dataType: ApplicationDataType): string {
  if (dataType === "http") return "Simulator Browser";
  if (dataType === "smtp") return "Simulator Mail Client";
  return "Simulator FTP Client";
}

export function ApplicationLayer() {
  const application = useSimulatorStore((s) => s.application);
  const setDataType = useSimulatorStore((s) => s.setApplicationDataType);
  const setDataSizeBytes = useSimulatorStore((s) => s.setApplicationDataSizeBytes);
  const setRps = useSimulatorStore((s) => s.setApplicationRequestCadenceRps);
  const setSecure = useSimulatorStore((s) => s.setApplicationSecureTransport);
  const resetApplicationLayer = useSimulatorStore((s) => s.resetApplicationLayer);
  const generateSample = useSimulatorStore((s) => s.generateSampleApplicationData);

  const sliderPct = sliderPositionFromBytes(application.dataSizeBytes, MIN_B, MAX_B);

  const [series, setSeries] = useState<{ t: string; bytes: number }[]>(() => []);

  const bumpSeries = useCallback(() => {
    setSeries((prev) => {
      const base = application.dataSizeBytes;
      const jitter = 0.92 + Math.random() * 0.16;
      const cadenceFactor =
        1 + Math.sin(Date.now() / 800) * (application.requestCadenceRps / 4000);
      const nextVal = Math.round(base * jitter * cadenceFactor);
      const label = new Date().toLocaleTimeString(undefined, {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const row = { t: label, bytes: Math.max(MIN_B, Math.min(MAX_B, nextVal)) };
      return [...prev, row].slice(-40);
    });
  }, [application.dataSizeBytes, application.requestCadenceRps]);

  useEffect(() => {
    bumpSeries();
  }, [application.dataSizeBytes, application.requestCadenceRps, application.dataType, bumpSeries]);

  useEffect(() => {
    const id = window.setInterval(bumpSeries, 900);
    return () => window.clearInterval(id);
  }, [bumpSeries]);

  const preview = useMemo(
    () =>
      buildProtocolPreview(
        application.dataType,
        application.dataSizeBytes,
        application.requestCadenceRps,
        application.secureTransport
      ),
    [
      application.dataType,
      application.dataSizeBytes,
      application.requestCadenceRps,
      application.secureTransport,
    ]
  );

  const clientTint =
    application.dataType === "http"
      ? "border-[#E8D5F5] bg-[#FAF7FC]"
      : application.dataType === "smtp"
        ? "border-[#D5E8F5] bg-[#F5FAFD]"
        : "border-[#D5F5E8] bg-[#F5FCFA]";

  return (
    // <motion.div
    //   className="layer-page-enter flex flex-col gap-5"
    //   initial={{ opacity: 0, y: 10 }}
    //   animate={{ opacity: 1, y: 0 }}
    //   transition={{ duration: 0.2 }}
    // >
    //   <LayerCard layer={LAYER}>
    //     <h2 className="text-[clamp(28px,4vw,36px)] font-bold tracking-[-0.5px] text-[#1A1A1A]">
    //       Application Layer
    //     </h2>
    //     <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-[#666]">
    //       Presents data to users and passes requests into the stack. Protocol choice, payload size,
    //       and request rate set expectations for every layer below—encryption, segmentation, routing,
    //       framing, and physical signaling.
    //     </p>
    //   </LayerCard>

    //   <DownstreamAlerts />

    //   <div className="grid gap-5 lg:grid-cols-[3fr_2fr] lg:gap-8">
    //     <LayerCard layer={LAYER}>
    //       <SectionTitle className="mb-5">Metrics</SectionTitle>
    //       <div className="flex flex-col gap-5">
    //         <SelectField
    //           layer={LAYER}
    //           label="Data type"
    //           tooltip="HTTP carries web pages and APIs (often ports 80/443). SMTP delivers email (typically port 25/587). FTP moves files (ports 21 + data channels)."
    //           value={application.dataType}
    //           onChange={(e) => setDataType(e.target.value as ApplicationDataType)}
    //         >
    //           <option value="http">HTTP Web Request</option>
    //           <option value="smtp">Email SMTP</option>
    //           <option value="ftp">FTP File Transfer</option>
    //         </SelectField>

    //         <div className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-[#F0F0F0] bg-[#FDF8F0] px-4 py-3">
    //           <DelayedTooltip
    //             content="When enabled, models TLS overhead (HTTPS on 443, SMTPS on 465/587, FTPS). Cleartext HTTP uses port 80—fine on trusted LANs, risky on the open Internet."
    //             delayMs={500}
    //           >
    //             <span className="cursor-help border-b border-dotted border-[#CCC] text-[18px] font-medium text-[#333]">
    //               Secure transport (TLS)
    //             </span>
    //           </DelayedTooltip>
    //           <PillSwitch
    //             checked={application.secureTransport}
    //             onChange={setSecure}
    //             accent={t.accent}
    //             aria-label="Toggle secure transport TLS"
    //           />
    //         </div>

    //         <SliderField
    //           layer={LAYER}
    //           label="Data size (log scale)"
    //           tooltip="Data Size: HTTP requests average 2–5 KB; image uploads can be MBs. Bulk FTP puts sustained load on lower layers."
    //           valueDisplay={formatBytes(application.dataSizeBytes)}
    //           min={0}
    //           max={100}
    //           step={0.5}
    //           value={sliderPct}
    //           onChange={(e) => {
    //             const v = logBytesFromSliderPosition(Number(e.target.value), MIN_B, MAX_B);
    //             setDataSizeBytes(v);
    //           }}
    //         />

    //         <SliderField
    //           layer={LAYER}
    //           label="Request cadence"
    //           tooltip="Requests per second stress session setup, TCP connections, and NIC throughput. Example: busy APIs often exceed hundreds of rps behind load balancers."
    //           valueDisplay={`${application.requestCadenceRps} req/s`}
    //           min={1}
    //           max={1000}
    //           value={application.requestCadenceRps}
    //           onChange={(e) => setRps(Number(e.target.value))}
    //         />

    //         <div className="flex flex-wrap gap-3 pt-1">
    //           <PillButton
    //             variant="secondary"
    //             accent={t.accent}
    //             accentHover={t.accentHover}
    //             onClick={() => resetApplicationLayer()}
    //           >
    //             Reset to Defaults
    //           </PillButton>
    //           <DelayedTooltip
    //             content="Loads a realistic profile: HTTP page loads ~42 KB at ~120 rps—similar to a busy API gateway scenario."
    //             delayMs={500}
    //           >
    //             <span className="inline-flex">
    //               <PillButton
    //                 variant="primary"
    //                 accent={t.accent}
    //                 accentHover={t.accentHover}
    //                 onClick={() => generateSample()}
    //               >
    //                 Generate Sample Data
    //               </PillButton>
    //             </span>
    //           </DelayedTooltip>
    //         </div>
    //       </div>
    //     </LayerCard>

    //     <LayerCard layer={LAYER} className={`border ${clientTint}`}>
    //       <div className="flex items-center gap-2 border-b border-[#EEE] pb-4">
    //         <span className="h-3 w-3 rounded-full bg-[#FF6B6B]" />
    //         <span className="h-3 w-3 rounded-full bg-[#FFD166]" />
    //         <span className="h-3 w-3 rounded-full bg-[#06D6A0]" />
    //         <span className="ml-2 truncate text-[15px] font-medium text-[#666]">
    //           {mockClientTitle(application.dataType)}
    //         </span>
    //       </div>
    //       <div className="mt-5 flex flex-col gap-4">
    //         <label className="text-[14px] font-semibold uppercase tracking-wide text-[#888]">
    //           User input
    //         </label>
    //         <textarea
    //           readOnly
    //           className="min-h-[88px] resize-none rounded-xl border border-[#E5E5E5] bg-white p-4 font-mono text-[14px] leading-relaxed text-[#333] shadow-inner"
    //           value={
    //             application.dataType === "http"
    //               ? `GET https://example.com/search?q=osi+layers (${application.requestCadenceRps} parallel tabs)`
    //               : application.dataType === "smtp"
    //                 ? `To: team@example.com\nSubject: Weekly report (${formatBytes(application.dataSizeBytes)} attachment queued)`
    //                 : `get /downloads/archive.tar (${formatBytes(application.dataSizeBytes)})`
    //           }
    //         />
    //         <div className="rounded-xl border border-[#E8E8E8] bg-[#FAFAFA] p-4 font-mono text-[13px] leading-relaxed text-[#1F8A6B]">
    //           <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#888]">
    //             Process visual — wire preview
    //           </div>
    //           <pre className="whitespace-pre-wrap break-all">{preview}</pre>
    //         </div>
    //       </div>
    //     </LayerCard>
    //   </div>

    //   <LayerCard layer={LAYER}>
    //     <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
    //       <SectionTitle>Application Payload Size Over Time</SectionTitle>
    //       <span className="text-[14px] text-[#888]">Live simulation (~0.9s updates)</span>
    //     </div>
    //     <DelayedTooltip
    //       className="block w-full"
    //       content={
    //         <span>
    //           The line tracks simulated application payload size over time; sliders move the baseline
    //           up or down. Example: HTTP uses port 80; HTTPS uses port 443 for encrypted web traffic.
    //         </span>
    //       }
    //       delayMs={500}
    //     >
    //       <div className="min-h-[200px] w-full cursor-crosshair">
    //         <ResponsiveContainer width="100%" height={220}>
    //           <LineChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
    //             <CartesianGrid strokeDasharray="4 4" stroke="#F0F0F0" />
    //             <XAxis dataKey="t" tick={{ fill: "#888888", fontSize: 14 }} hide />
    //             <YAxis
    //               tickFormatter={(v) => formatBytes(Number(v))}
    //               tick={{ fill: "#888888", fontSize: 14 }}
    //               width={80}
    //             />
    //             <RechartsTooltip content={<ChartTooltipContent />} />
    //             <Line
    //               type="monotone"
    //               dataKey="bytes"
    //               stroke={t.chart}
    //               strokeWidth={2}
    //               dot={false}
    //               isAnimationActive
    //               animationDuration={300}
    //               activeDot={{ r: 4, fill: t.chart }}
    //             />
    //           </LineChart>
    //         </ResponsiveContainer>
    //       </div>
    //     </DelayedTooltip>
    //   </LayerCard>
    // </motion.div>

    <motion.div
  className="min-h-screen w-full space-y-8 pb-10"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.35 }}
>
  {/* HERO */}
  <div
    className="
      relative overflow-hidden rounded-[40px]
      border border-white/10
      bg-[#07111F]
      p-8 md:p-10
      shadow-[0_20px_80px_rgba(0,0,0,0.45)]
    "
  >
    {/* background effects */}
    <div
      className="absolute -left-24 top-0 h-72 w-72 rounded-full blur-3xl opacity-20"
      style={{ background: t.accent }}
    />

    <div className="relative z-10">
      <div className="flex flex-wrap items-center gap-3">
        <div
          className="h-3 w-3 rounded-full animate-pulse"
          style={{ background: t.accent }}
        />

        <span
          className="
            rounded-full
            border border-white/10
            bg-white/5
            px-4 py-2
            text-[11px]
            font-bold
            tracking-[0.25em]
            text-white/60
            backdrop-blur-xl
          "
        >
          APPLICATION LAYER
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <h1
            className="
              text-[clamp(42px,6vw,74px)]
              font-black
              leading-none
              tracking-[-3px]
              text-white
            "
          >
            Network Traffic
            <br />
            Control Center
          </h1>

          <p
            className="
              mt-6
              max-w-2xl
              text-[16px]
              leading-relaxed
              text-white/60
            "
          >
            Simulate real-world application traffic,
            secure communication, payload transfer,
            and downstream network behavior with
            live protocol visualization.
          </p>
        </div>

        <div
          className="
            rounded-3xl
            border border-white/10
            bg-white/5
            px-6 py-5
            backdrop-blur-xl
          "
        >
          <div className="text-xs uppercase tracking-[0.25em] text-white/40">
            Current Protocol
          </div>

          <div className="mt-2 text-2xl font-bold text-white">
            {application.dataType.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* ALERTS */}
  <DownstreamAlerts />

  {/* MAIN */}
  <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
    {/* CONTROLS */}
    <div
      className="
        rounded-[36px]
        border border-white/10
        bg-[#081222]
        p-7
        shadow-[0_16px_60px_rgba(0,0,0,0.45)]
      "
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="text-xs tracking-[0.3em] text-white/40">
            SYSTEM SETTINGS
          </div>

          <h3 className="mt-2 text-2xl font-bold text-white">
            Traffic Controls
          </h3>
        </div>

        <div
          className="
            rounded-full
            border border-white/10
            bg-emerald-400/10
            px-4 py-2
            text-xs
            font-semibold
            tracking-wide
            text-emerald-300
          "
        >
          LIVE
        </div>
      </div>

      <div className="space-y-7">
        <SelectField
          layer={LAYER}
          label="Protocol Type"
          tooltip="Choose the application protocol."
          value={application.dataType}
          onChange={(e) =>
            setDataType(
              e.target.value as ApplicationDataType
            )
          }
        >
          <option value="http">
            HTTP Web Request
          </option>

          <option value="smtp">
            Email SMTP
          </option>

          <option value="ftp">
            FTP File Transfer
          </option>
        </SelectField>

        {/* TLS PANEL */}
        <div
          className="
            rounded-3xl
            border border-white/10
            bg-white/[0.04]
            p-5
            backdrop-blur-2xl
          "
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs tracking-[0.2em] text-white/40">
                ENCRYPTION
              </div>

              <div className="mt-2 text-lg font-semibold text-white">
                TLS Secure Transport
              </div>

              <p className="mt-1 text-sm text-white/50">
                Adds encryption overhead and secure
                communication modeling.
              </p>
            </div>

            <PillSwitch
              checked={application.secureTransport}
              onChange={setSecure}
              accent={t.accent}
              aria-label="Toggle TLS"
            />
          </div>
        </div>

        {/* SLIDERS */}
        <SliderField
          layer={LAYER}
          label="Payload Size"
          tooltip="Controls payload transfer size."
          valueDisplay={formatBytes(
            application.dataSizeBytes
          )}
          min={0}
          max={100}
          step={0.5}
          value={sliderPct}
          onChange={(e) => {
            const v =
              logBytesFromSliderPosition(
                Number(e.target.value),
                MIN_B,
                MAX_B
              );

            setDataSizeBytes(v);
          }}
        />

        <SliderField
          layer={LAYER}
          label="Traffic Rate"
          tooltip="Requests generated per second."
          valueDisplay={`${application.requestCadenceRps} req/s`}
          min={1}
          max={1000}
          value={application.requestCadenceRps}
          onChange={(e) =>
            setRps(Number(e.target.value))
          }
        />

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-4 pt-4">
          <PillButton
            variant="secondary"
            accent={t.accent}
            accentHover={t.accentHover}
            onClick={() =>
              resetApplicationLayer()
            }
          >
            Reset
          </PillButton>

          <PillButton
            variant="primary"
            accent={t.accent}
            accentHover={t.accentHover}
            onClick={() =>
              generateSample()
            }
          >
            Generate Sample
          </PillButton>
        </div>
      </div>
    </div>

    {/* PREVIEW */}
    <div
      className="
        rounded-[36px]
        border border-white/10
        bg-[#050B16]
        p-7
        shadow-[0_16px_60px_rgba(0,0,0,0.5)]
      "
    >
      {/* fake browser */}
      <div
        className="
          flex items-center gap-2
          border-b border-white/10
          pb-5
        "
      >
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-yellow-400" />
        <span className="h-3 w-3 rounded-full bg-green-400" />

        <div className="ml-4 text-sm font-medium text-white/50">
          {mockClientTitle(application.dataType)}
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* request preview */}
        <div>
          <div className="mb-3 text-xs tracking-[0.25em] text-white/40">
            GENERATED REQUEST
          </div>

          <textarea
            readOnly
            className="
              min-h-[140px]
              w-full
              resize-none
              rounded-3xl
              border border-white/10
              bg-white/[0.03]
              p-5
              font-mono
              text-[14px]
              leading-relaxed
              text-white
              outline-none
            "
            value={
              application.dataType === "http"
                ? `GET https://example.com/search?q=osi+layers (${application.requestCadenceRps} tabs)`
                : application.dataType ===
                    "smtp"
                  ? `To: team@example.com\nSubject: Weekly report (${formatBytes(application.dataSizeBytes)} attachment queued)`
                  : `get /downloads/archive.tar (${formatBytes(application.dataSizeBytes)})`
            }
          />
        </div>

        {/* terminal */}
        <div
          className="
            overflow-hidden rounded-3xl
            border border-cyan-400/10
            bg-black
          "
        >
          <div
            className="
              border-b border-white/10
              px-5 py-3
              text-xs
              font-bold
              tracking-[0.3em]
              text-cyan-300/70
            "
          >
            LIVE PACKET STREAM
          </div>

          <div className="relative p-5">
            <div className="absolute inset-0 opacity-10">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
                  backgroundSize: "100% 24px",
                }}
              />
            </div>

            <pre
              className="
                relative whitespace-pre-wrap break-all
                font-mono
                text-[13px]
                leading-relaxed
                text-emerald-300
              "
            >
              {preview}
            </pre>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* CHART */}
  <div
    className="
      rounded-[40px]
      border border-white/10
      bg-[#07111F]
      p-8
      shadow-[0_16px_70px_rgba(0,0,0,0.45)]
    "
  >
    <div className="mb-8 flex items-center justify-between">
      <div>
        <div className="text-xs tracking-[0.25em] text-white/40">
          REAL-TIME ANALYTICS
        </div>

        <h3 className="mt-2 text-3xl font-bold text-white">
          Payload Monitoring
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
        STREAMING
      </div>
    </div>

    <div
      className="
        rounded-[32px]
        border border-white/10
        bg-black/20
        p-5
      "
    >
      <ResponsiveContainer
        width="100%"
        height={280}
      >
        <LineChart
          data={series}
          margin={{
            top: 8,
            right: 8,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#1F2937"
          />

          <XAxis
            dataKey="t"
            hide
            tick={{
              fill: "#9CA3AF",
            }}
          />

          <YAxis
            tickFormatter={(v) =>
              formatBytes(Number(v))
            }
            tick={{
              fill: "#9CA3AF",
            }}
            width={80}
          />

          <RechartsTooltip
            content={
              <ChartTooltipContent />
            }
          />

          <Line
            type="monotone"
            dataKey="bytes"
            stroke={t.chart}
            strokeWidth={3}
            dot={false}
            isAnimationActive
            animationDuration={300}
            activeDot={{
              r: 5,
              fill: t.chart,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
</motion.div>
  );
}
