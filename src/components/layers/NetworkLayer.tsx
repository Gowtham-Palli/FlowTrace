import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from "recharts";
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

const L = 3;
const t = getLayerDesign(L);

export function NetworkLayer() {
  const application = useSimulatorStore((s) => s.application);
  const presentation = useSimulatorStore((s) => s.presentation);
  const session = useSimulatorStore((s) => s.session);
  const transport = useSimulatorStore((s) => s.transport);
  const network = useSimulatorStore((s) => s.network);
  const dataLink = useSimulatorStore((s) => s.dataLink);
  const physical = useSimulatorStore((s) => s.physical);

  const setHops = useSimulatorStore((s) => s.setNetworkHopCount);
  const setRoute = useSimulatorStore((s) => s.setNetworkRouting);
  const setMtu = useSimulatorStore((s) => s.setNetworkMtu);
  const setTtl = useSimulatorStore((s) => s.setNetworkTtl);
  const reset = useSimulatorStore((s) => s.resetNetworkLayer);

  const [traceOpen, setTraceOpen] = useState(false);

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

  const hopBars = useMemo(() => {
    const base =
      network.routingProtocol === "ospf" ? 10 : network.routingProtocol === "bgp" ? 15 : 12;
    return Array.from({ length: network.hopCount }, (_, i) => ({
      hop: `R${i + 1}`,
      ms: Math.round(base + i * 2 + (network.mtu < 1200 ? 4 : 0)),
    }));
  }, [network.hopCount, network.routingProtocol, network.mtu]);

  const ttlSteps = useMemo(() => {
    const hops = Math.min(network.hopCount, 8);
    return Array.from({ length: hops + 1 }, (_, i) => network.ttlStart - i);
  }, [network.hopCount, network.ttlStart]);

  return (
    <motion.div
      className="layer-page-enter flex flex-col gap-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <LayerCard layer={L}>
        <h2 className="text-[clamp(28px,4vw,36px)] font-bold tracking-[-0.5px] text-[#1A1A1A]">
          Network Layer
        </h2>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-[#666]">
          Real-world: your packet crosses ISP routers using BGP between continents; OSPF picks shortest
          paths inside an enterprise; TTL keeps stray packets from looping forever.
        </p>
      </LayerCard>

      <DownstreamAlerts />

      <LayerCard layer={L} className="overflow-x-auto">
        <SectionTitle className="mb-5">Topology</SectionTitle>
        <div className="flex min-w-[520px] items-center gap-2 text-[13px]">
          <motion.div
            layout
            className="rounded-[16px] border-2 px-4 py-3 font-mono font-semibold shadow-sm"
            style={{ borderColor: t.soft, backgroundColor: "#FFFBF8", color: t.accent }}
          >
            [PC]
          </motion.div>
          {Array.from({ length: Math.min(network.hopCount, 8) }).map((_, i) => (
            <div key={i} className="flex flex-1 items-center gap-2">
              <span className="text-[#CCC]">→</span>
              <div className="flex flex-col items-center">
                <span
                  className="rounded-[12px] border-2 px-3 py-2 font-mono font-semibold shadow-sm"
                  style={{ borderColor: t.soft, backgroundColor: "#FFFFFF", color: t.accent }}
                >
                  Router {String.fromCharCode(65 + i)}
                </span>
                <span className="mt-1 text-[12px] text-[#888]">
                  ~{hopBars[i]?.ms ?? 10}ms
                </span>
              </div>
            </div>
          ))}
          <span className="text-[#CCC]">→</span>
          <div
            className="rounded-[16px] border-2 px-4 py-3 font-mono font-semibold shadow-sm"
            style={{ borderColor: t.soft, backgroundColor: "#FFFBF8", color: t.accent }}
          >
            [Server]
          </div>
        </div>
      </LayerCard>

      <div className="grid gap-5 lg:grid-cols-[3fr_2fr] lg:gap-8">
        <LayerCard layer={L}>
          <SectionTitle className="mb-5">Metrics</SectionTitle>
          <div className="flex flex-col gap-5">
            <SliderField
              layer={L}
              label="Hop count"
              tooltip="More hops generally mean more queueing; traceroute shows each router along the path."
              valueDisplay={`${network.hopCount}`}
              min={1}
              max={15}
              value={network.hopCount}
              onChange={(e) => setHops(Number(e.target.value))}
            />

            <SelectField
              layer={L}
              label="Routing protocol"
              tooltip="OSPF automatically finds shortest paths inside an AS; BGP exchanges routes between providers; static routes are manual but predictable."
              value={network.routingProtocol}
              onChange={(e) => setRoute(e.target.value as typeof network.routingProtocol)}
            >
              <option value="static">Static</option>
              <option value="ospf">OSPF</option>
              <option value="bgp">BGP</option>
            </SelectField>

            <SliderField
              layer={L}
              label="MTU size"
              tooltip="MTU 1500 is standard Ethernet; smaller MTU yields more fragments and header overhead."
              valueDisplay={`${network.mtu} B`}
              min={500}
              max={1500}
              step={10}
              value={network.mtu}
              onChange={(e) => setMtu(Number(e.target.value))}
            />

            <SliderField
              layer={L}
              label="TTL start"
              tooltip="TTL prevents infinite loops: each router subtracts one; when it hits zero the packet is dropped."
              valueDisplay={`${network.ttlStart}`}
              min={16}
              max={255}
              value={network.ttlStart}
              onChange={(e) => setTtl(Number(e.target.value))}
            />

            <div className="flex flex-wrap gap-3">
              <PillButton variant="primary" accent={t.accent} accentHover={t.accentHover} onClick={() => setTraceOpen((v) => !v)}>
                Trace Route Simulation
              </PillButton>
              <PillButton variant="secondary" accent={t.accent} accentHover={t.accentHover} onClick={() => reset()}>
                Reset to Defaults
              </PillButton>
            </div>
          </div>
        </LayerCard>

        <LayerCard layer={L}>
          <SectionTitle className="mb-4">IP header (process visual)</SectionTitle>
          <pre className="whitespace-pre-wrap rounded-[16px] border border-[#F0F0F0] bg-[#FAFAFA] p-4 font-mono text-[13px] leading-relaxed text-[#333]">
            {`Source IP: 192.168.1.100
Dest IP: 8.8.8.8
TTL: ${ttlSteps.join(" → ")}
Checksum: 0x7A3F`}
          </pre>
        </LayerCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <LayerCard layer={L}>
          <DelayedTooltip
            content="Each bar is illustrative delay contributed by that hop—BGP paths often add extra AS hops vs OSPF shortcuts."
            delayMs={500}
          >
            <SectionTitle className="mb-4 cursor-default">End-to-End Routing Delay (per hop)</SectionTitle>
          </DelayedTooltip>
          <div className="min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={hopBars}>
                <CartesianGrid strokeDasharray="4 4" stroke="#F0F0F0" />
                <XAxis dataKey="hop" tick={{ fill: "#888888", fontSize: 14 }} />
                <YAxis tick={{ fill: "#888888", fontSize: 14 }} />
                <Bar dataKey="ms" fill={t.chart} radius={[8, 8, 0, 0]} animationDuration={300} />
                <RTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </LayerCard>

        <LayerCard layer={L}>
          <DelayedTooltip
            content="More fragments when payload exceeds MTU—watch this rise when you drag MTU down or send larger wire sizes from upper layers."
            delayMs={500}
          >
            <SectionTitle className="mb-4 cursor-default">Packet fragmentation count</SectionTitle>
          </DelayedTooltip>
          <div className="flex flex-col items-center justify-center gap-2 py-10">
            <motion.span
              key={metrics.fragmentationCount}
              initial={{ scale: 0.92, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-[48px] font-bold tabular-nums"
              style={{ color: t.accent }}
            >
              {metrics.fragmentationCount}
            </motion.span>
            <span className="text-[15px] text-[#888]">fragments (illustrative)</span>
          </div>
        </LayerCard>
      </div>

      {traceOpen ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <LayerCard layer={L}>
            <SectionTitle className="mb-4">Traceroute (simulated)</SectionTitle>
            <ul className="space-y-2 font-mono text-[14px] text-[#4A4A4A]">
              {hopBars.map((h, i) => (
                <li key={h.hop}>
                  {i + 1}. {h.hop} — {h.ms} ms
                </li>
              ))}
            </ul>
          </LayerCard>
        </motion.div>
      ) : null}
    </motion.div>
  );
}
