import type { FullSimulatorState } from "../store/simulatorStore";

const KB = 1024;
const MB = KB * 1024;

function encryptionOverhead(enc: FullSimulatorState["presentation"]["encryption"]): number {
  if (enc === "none") return 0;
  if (enc === "aes128") return 12;
  return 15;
}

function encryptionCpuPercent(enc: FullSimulatorState["presentation"]["encryption"]): number {
  if (enc === "none") return 5;
  if (enc === "aes128") return 38;
  return 52;
}

function encodingFactor(enc: FullSimulatorState["presentation"]["encoding"]): number {
  if (enc === "ascii") return 1;
  if (enc === "utf8") return 1.02;
  return 1.85;
}

/** Payload bytes after compression (ratio = % bytes removed). */
export function compressedSizeBytes(original: number, compressionRatioPercent: number): number {
  const r = Math.min(90, Math.max(0, compressionRatioPercent)) / 100;
  return Math.max(1, Math.round(original * (1 - r)));
}

export function computePipelineMetrics(s: FullSimulatorState) {
  const app = s.application;
  const pres = s.presentation;
  const sess = s.session;
  const tr = s.transport;
  const net = s.network;
  const dl = s.dataLink;
  const ph = s.physical;

  const originalPayload = app.dataSizeBytes;
  const afterCompress = compressedSizeBytes(originalPayload, pres.compressionRatioPercent);
  const encPct = encryptionOverhead(pres.encryption);
  const afterEncrypt = Math.round(
    afterCompress * (1 + encPct / 100) * encodingFactor(pres.encoding)
  );

  const l7ProcessingMs =
    2 +
    (app.requestCadenceRps / 1000) * 8 +
    (app.dataType === "smtp" ? 1.2 : app.dataType === "ftp" ? 0.9 : 0) +
    (app.secureTransport ? 0.8 : 0);

  const l6ProcessingMs =
    0.5 +
    encryptionCpuPercent(pres.encryption) * 0.08 +
    pres.compressionRatioPercent * 0.02 +
    (pres.encoding === "utf16" ? 0.4 : 0);

  const l5ProcessingMs =
    0.6 + Math.log10(sess.checkpointIntervalBytes / KB) * 0.5 + (sess.duplex ? 0.2 : -0.1);

  const l7to5Ms = l7ProcessingMs + l6ProcessingMs + l5ProcessingMs;

  const effLoss =
    tr.protocol === "tcp"
      ? Math.min(30, tr.packetLossPercent) / 100
      : Math.min(70, tr.packetLossPercent) / 100;

  const baseRtt = tr.latencyMs;
  const congestionBoost = Date.now() < tr.congestionSpikeUntil ? 1.65 : 1;
  const tcpRetransmitFactor = tr.protocol === "tcp" ? 1 + effLoss * 3.2 : 1;
  const l4Ms = baseRtt * congestionBoost * tcpRetransmitFactor + (tr.protocol === "tcp" ? 8 : 2);

  const hopDelayMs =
    net.routingProtocol === "ospf" ? 4.2 : net.routingProtocol === "bgp" ? 7.5 : 5.0;
  const l3Ms = net.hopCount * hopDelayMs * (1 + (1500 - net.mtu) / 4000);

  const mediumLatency =
    ph.medium === "fiber"
      ? ph.distanceM * 0.005
      : ph.medium === "wifi6"
        ? ph.distanceM * 0.02 +
          (ph.interference === "severe" ? 6 : ph.interference === "mild" ? 2 : 0)
        : ph.distanceM * 0.01;

  const snrPenalty = ph.snrDb < 10 ? 3 : ph.snrDb < 20 ? 1.2 : 0;
  const l2l1Ms =
    mediumLatency +
    snrPenalty +
    (ph.repeaterCount > 0 ? ph.repeaterCount * 0.15 : 0) +
    dl.berPercent * 0.35;

  const totalLatencyMs = l7to5Ms + l4Ms + l3Ms + l2l1Ms;

  const mtuEff = Math.min(net.mtu, 1500);
  const segments = Math.max(1, Math.ceil(afterEncrypt / mtuEff));

  const theoreticalMbps =
    ((afterEncrypt * app.requestCadenceRps) / MB) * 8 * 0.001;

  const windowLimited =
    tr.protocol === "tcp"
      ? ((tr.windowSizeBytes * 8) / Math.max(1, baseRtt)) / 1000
      : theoreticalMbps;

  const lossUdpFactor = tr.protocol === "udp" ? Math.max(0.05, 1 - effLoss) : 1;

  const rawThroughputMbps = Math.min(theoreticalMbps, windowLimited) * lossUdpFactor;

  const compressionBenefit = originalPayload > 0 ? afterCompress / originalPayload : 1;
  const goodputMbps = rawThroughputMbps * compressionBenefit * (1 - effLoss * 0.4);

  const overheadRatio =
    theoreticalMbps > 0
      ? Math.min(0.95, 1 - goodputMbps / Math.max(0.01, theoreticalMbps))
      : 0;

  const packetsSent = Math.round(segments * app.requestCadenceRps * 0.25 + 120);
  const deliveryRatio =
    tr.protocol === "tcp" ? Math.max(0.5, 1 - effLoss * 0.8) : Math.max(0.05, 1 - effLoss);
  const packetsReceived = Math.round(packetsSent * deliveryRatio);
  const retransmissions =
    tr.protocol === "tcp" ? Math.round(packetsSent * effLoss * 2.1 + effLoss * 40) : 0;

  const framesCorrupted = Math.round(
    packetsSent * (dl.berPercent / 100) * 1.5 + dl.berPercent * 2
  );
  const bitErrors = Math.round(
    framesCorrupted * (mtuEff * 8) * 0.02 + (ph.interference === "severe" ? 40 : 15)
  );

  const fragmentationCount = Math.max(0, segments - 1);

  return {
    totalLatencyMs,
    breakdown: {
      l7to5Ms,
      l4Ms,
      l3Ms,
      l2l1Ms,
      l7ProcessingMs,
      l6ProcessingMs,
      l5ProcessingMs,
    },
    throughputMbps: rawThroughputMbps,
    goodputMbps,
    overheadRatio,
    packetsSent,
    packetsReceived,
    deliveryRatio,
    retransmissions,
    framesCorrupted,
    bitErrors,
    afterEncrypt,
    segments,
    originalPayload,
    afterCompress,
    encryptionCpuPercent: encryptionCpuPercent(pres.encryption),
    fragmentationCount,
  };
}

export function buildPacketCaptureLines(
  s: FullSimulatorState,
  metrics: ReturnType<typeof computePipelineMetrics>
): string[] {
  const app = s.application;
  const lines: string[] = [];
  const ts = () => new Date().toISOString().split("T")[1].slice(0, 12);

  lines.push(
    `${ts()} [L7] ${app.dataType.toUpperCase()} payload=${metrics.originalPayload}B rps=${app.requestCadenceRps} tls=${app.secureTransport}`
  );
  lines.push(
    `${ts()} [L6] enc=${s.presentation.encryption} compress=${s.presentation.compressionRatioPercent}% enc=${s.presentation.encoding} wire~=${metrics.afterEncrypt}B`
  );
  lines.push(
    `${ts()} [L5] timeout=${s.session.sessionTimeoutSec}s checkpoint=${(s.session.checkpointIntervalBytes / KB).toFixed(0)}KB duplex=${s.session.duplex ? "full" : "half"}`
  );
  lines.push(
    `${ts()} [L4] ${s.transport.protocol.toUpperCase()} loss=${s.transport.packetLossPercent}% rtt=${s.transport.latencyMs}ms win=${(s.transport.windowSizeBytes / KB).toFixed(0)}KB`
  );
  lines.push(
    `${ts()} [L3] hops=${s.network.hopCount} ${s.network.routingProtocol.toUpperCase()} mtu=${s.network.mtu} ttl=${s.network.ttlStart}`
  );
  lines.push(
    `${ts()} [L2] ${s.dataLink.macProtocol} ber=${s.dataLink.berPercent}% csma=${s.dataLink.csmaCd ? "on" : "off"}`
  );
  lines.push(
    `${ts()} [L1] ${s.physical.medium} ${s.physical.signalDbm}dBm snr=${s.physical.snrDb}dB dist=${s.physical.distanceM}m rep=${s.physical.repeaterCount}`
  );
  return lines;
}
