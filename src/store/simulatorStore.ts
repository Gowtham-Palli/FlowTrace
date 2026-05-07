import { create } from "zustand";

export type ApplicationDataType = "http" | "smtp" | "ftp";

export type EncryptionMode = "none" | "aes128" | "aes256";
export type Encoding = "ascii" | "utf8" | "utf16";
export type RoutingProtocol = "static" | "ospf" | "bgp";
export type TransportProtocol = "tcp" | "udp";
export type MacProtocol = "ethernet" | "wifi" | "tokenring";
export type MediumType = "copper" | "fiber" | "wifi6";
export type InterferenceLevel = "none" | "mild" | "severe";

export type DownstreamWarning = {
  targetLayer: number;
  message: string;
};

const KB = 1024;
const MB = 1024 * KB;

export type ApplicationState = {
  dataType: ApplicationDataType;
  dataSizeBytes: number;
  requestCadenceRps: number;
  secureTransport: boolean;
};

export type PresentationState = {
  encryption: EncryptionMode;
  compressionRatioPercent: number;
  encoding: Encoding;
  showHexDump: boolean;
};

export type SessionState = {
  sessionTimeoutSec: number;
  checkpointIntervalBytes: number;
  duplex: boolean;
  /** Incremented when user injects a fault (for visuals). */
  faultPulse: number;
};

export type TransportState = {
  protocol: TransportProtocol;
  packetLossPercent: number;
  latencyMs: number;
  windowSizeBytes: number;
  outOfOrderUdp: boolean;
  congestionSpikeUntil: number;
};

export type NetworkState = {
  hopCount: number;
  routingProtocol: RoutingProtocol;
  mtu: number;
  ttlStart: number;
};

export type DataLinkState = {
  berPercent: number;
  macProtocol: MacProtocol;
  csmaCd: boolean;
  crcFailurePulse: number;
};

export type PhysicalState = {
  medium: MediumType;
  signalDbm: number;
  snrDb: number;
  interference: InterferenceLevel;
  distanceM: number;
  repeaterCount: number;
};

/** Snapshot passed to pipeline metrics */
export type FullSimulatorState = {
  application: ApplicationState;
  presentation: PresentationState;
  session: SessionState;
  transport: TransportState;
  network: NetworkState;
  dataLink: DataLinkState;
  physical: PhysicalState;
};

export const DEFAULT_APPLICATION: ApplicationState = {
  dataType: "http",
  dataSizeBytes: 8 * KB,
  requestCadenceRps: 50,
  secureTransport: true,
};

export const DEFAULT_PRESENTATION: PresentationState = {
  encryption: "aes256",
  compressionRatioPercent: 45,
  encoding: "utf8",
  showHexDump: false,
};

export const DEFAULT_SESSION: SessionState = {
  sessionTimeoutSec: 120,
  checkpointIntervalBytes: 512 * KB,
  duplex: true,
  faultPulse: 0,
};

export const DEFAULT_TRANSPORT: TransportState = {
  protocol: "tcp",
  packetLossPercent: 5,
  latencyMs: 50,
  windowSizeBytes: 256 * KB,
  outOfOrderUdp: false,
  congestionSpikeUntil: 0,
};

export const DEFAULT_NETWORK: NetworkState = {
  hopCount: 4,
  routingProtocol: "ospf",
  mtu: 1500,
  ttlStart: 64,
};

export const DEFAULT_DATALINK: DataLinkState = {
  berPercent: 0.5,
  macProtocol: "ethernet",
  csmaCd: true,
  crcFailurePulse: 0,
};

export const DEFAULT_PHYSICAL: PhysicalState = {
  medium: "copper",
  signalDbm: -45,
  snrDb: 25,
  interference: "none",
  distanceM: 50,
  repeaterCount: 0,
};

type SimulatorState = {
  currentLayerIndex: number;
  compareMode: boolean;
  compareLeftIndex: number;
  compareRightIndex: number;
  packetCaptureOpen: boolean;

  application: ApplicationState;
  presentation: PresentationState;
  session: SessionState;
  transport: TransportState;
  network: NetworkState;
  dataLink: DataLinkState;
  physical: PhysicalState;

  setCurrentLayerIndex: (i: number) => void;
  setCompareMode: (on: boolean) => void;
  setCompareLeftIndex: (i: number) => void;
  setCompareRightIndex: (i: number) => void;
  setPacketCaptureOpen: (on: boolean) => void;

  setApplicationDataType: (t: ApplicationDataType) => void;
  setApplicationDataSizeBytes: (b: number) => void;
  setApplicationRequestCadenceRps: (rps: number) => void;
  setApplicationSecureTransport: (on: boolean) => void;
  resetApplicationLayer: () => void;
  generateSampleApplicationData: () => void;

  setPresentationEncryption: (e: EncryptionMode) => void;
  setPresentationCompression: (pct: number) => void;
  setPresentationEncoding: (e: Encoding) => void;
  setPresentationShowHexDump: (on: boolean) => void;
  resetPresentationLayer: () => void;

  setSessionTimeout: (sec: number) => void;
  setCheckpointIntervalBytes: (b: number) => void;
  setSessionDuplex: (duplex: boolean) => void;
  resetSessionLayer: () => void;
  injectSessionFailure: () => void;

  setTransportProtocol: (p: TransportProtocol) => void;
  setTransportPacketLoss: (pct: number) => void;
  setTransportLatency: (ms: number) => void;
  setTransportWindow: (bytes: number) => void;
  setTransportOutOfOrderUdp: (on: boolean) => void;
  simulateCongestion: () => void;
  resetTransportLayer: () => void;

  setNetworkHopCount: (n: number) => void;
  setNetworkRouting: (r: RoutingProtocol) => void;
  setNetworkMtu: (mtu: number) => void;
  setNetworkTtl: (ttl: number) => void;
  resetNetworkLayer: () => void;

  setDataLinkBer: (pct: number) => void;
  setDataLinkMac: (m: MacProtocol) => void;
  setDataLinkCsma: (on: boolean) => void;
  resetDataLinkLayer: () => void;
  injectBitError: () => void;

  setPhysicalMedium: (m: MediumType) => void;
  setPhysicalSignal: (dbm: number) => void;
  setPhysicalSnr: (db: number) => void;
  setPhysicalInterference: (i: InterferenceLevel) => void;
  setPhysicalDistance: (m: number) => void;
  addRepeater: () => void;
  resetPhysicalLayer: () => void;

  resetAll: () => void;
  exportSessionJson: () => string;
};

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export const useSimulatorStore = create<SimulatorState>((set, get) => ({
  currentLayerIndex: 0,
  compareMode: false,
  compareLeftIndex: 0,
  compareRightIndex: 3,
  packetCaptureOpen: false,

  application: { ...DEFAULT_APPLICATION },
  presentation: { ...DEFAULT_PRESENTATION },
  session: { ...DEFAULT_SESSION },
  transport: { ...DEFAULT_TRANSPORT },
  network: { ...DEFAULT_NETWORK },
  dataLink: { ...DEFAULT_DATALINK },
  physical: { ...DEFAULT_PHYSICAL },

  setCurrentLayerIndex: (i) => set({ currentLayerIndex: clamp(i, 0, 6) }),
  setCompareMode: (compareMode) => set({ compareMode }),
  setCompareLeftIndex: (compareLeftIndex) =>
    set({ compareLeftIndex: clamp(compareLeftIndex, 0, 6) }),
  setCompareRightIndex: (compareRightIndex) =>
    set({ compareRightIndex: clamp(compareRightIndex, 0, 6) }),
  setPacketCaptureOpen: (packetCaptureOpen) => set({ packetCaptureOpen }),

  setApplicationDataType: (dataType) =>
    set((s) => ({ application: { ...s.application, dataType } })),
  setApplicationDataSizeBytes: (dataSizeBytes) =>
    set((s) => ({
      application: {
        ...s.application,
        dataSizeBytes: clamp(dataSizeBytes, KB, 10 * MB),
      },
    })),
  setApplicationRequestCadenceRps: (requestCadenceRps) =>
    set((s) => ({
      application: {
        ...s.application,
        requestCadenceRps: clamp(Math.round(requestCadenceRps), 1, 1000),
      },
    })),
  setApplicationSecureTransport: (secureTransport) =>
    set((s) => ({ application: { ...s.application, secureTransport } })),
  resetApplicationLayer: () => set({ application: { ...DEFAULT_APPLICATION } }),
  generateSampleApplicationData: () =>
    set({
      application: {
        ...DEFAULT_APPLICATION,
        dataSizeBytes: 42 * KB,
        requestCadenceRps: 120,
        secureTransport: true,
      },
    }),

  setPresentationEncryption: (encryption) =>
    set((s) => ({ presentation: { ...s.presentation, encryption } })),
  setPresentationCompression: (compressionRatioPercent) =>
    set((s) => ({
      presentation: {
        ...s.presentation,
        compressionRatioPercent: clamp(compressionRatioPercent, 0, 90),
      },
    })),
  setPresentationEncoding: (encoding) =>
    set((s) => ({ presentation: { ...s.presentation, encoding } })),
  setPresentationShowHexDump: (showHexDump) =>
    set((s) => ({ presentation: { ...s.presentation, showHexDump } })),
  resetPresentationLayer: () => set({ presentation: { ...DEFAULT_PRESENTATION } }),

  setSessionTimeout: (sessionTimeoutSec) =>
    set((s) => ({
      session: {
        ...s.session,
        sessionTimeoutSec: clamp(Math.round(sessionTimeoutSec), 10, 300),
      },
    })),
  setCheckpointIntervalBytes: (checkpointIntervalBytes) =>
    set((s) => ({
      session: {
        ...s.session,
        checkpointIntervalBytes: clamp(checkpointIntervalBytes, 100 * KB, 5 * MB),
      },
    })),
  setSessionDuplex: (duplex) => set((s) => ({ session: { ...s.session, duplex } })),
  resetSessionLayer: () => set({ session: { ...DEFAULT_SESSION } }),
  injectSessionFailure: () =>
    set((s) => ({
      session: { ...s.session, faultPulse: s.session.faultPulse + 1 },
    })),

  setTransportProtocol: (protocol) =>
    set((s) => ({
      transport: {
        ...s.transport,
        protocol,
        packetLossPercent:
          protocol === "tcp"
            ? clamp(s.transport.packetLossPercent, 0, 30)
            : clamp(s.transport.packetLossPercent, 0, 70),
      },
    })),
  setTransportPacketLoss: (packetLossPercent) =>
    set((s) => {
      const max = s.transport.protocol === "tcp" ? 30 : 70;
      return {
        transport: {
          ...s.transport,
          packetLossPercent: clamp(packetLossPercent, 0, max),
        },
      };
    }),
  setTransportLatency: (latencyMs) =>
    set((s) => ({
      transport: { ...s.transport, latencyMs: clamp(latencyMs, 0, 500) },
    })),
  setTransportWindow: (windowSizeBytes) =>
    set((s) => ({
      transport: {
        ...s.transport,
        windowSizeBytes: clamp(windowSizeBytes, 64 * KB, MB),
      },
    })),
  setTransportOutOfOrderUdp: (outOfOrderUdp) =>
    set((s) => ({ transport: { ...s.transport, outOfOrderUdp } })),
  simulateCongestion: () =>
    set((s) => ({
      transport: {
        ...s.transport,
        congestionSpikeUntil: Date.now() + 8000,
        latencyMs: clamp(s.transport.latencyMs + 85, 0, 500),
      },
    })),
  resetTransportLayer: () =>
    set({ transport: { ...DEFAULT_TRANSPORT } }),

  setNetworkHopCount: (hopCount) =>
    set((s) => ({
      network: { ...s.network, hopCount: clamp(Math.round(hopCount), 1, 15) },
    })),
  setNetworkRouting: (routingProtocol) =>
    set((s) => ({ network: { ...s.network, routingProtocol } })),
  setNetworkMtu: (mtu) =>
    set((s) => ({
      network: { ...s.network, mtu: clamp(Math.round(mtu), 500, 1500) },
    })),
  setNetworkTtl: (ttlStart) =>
    set((s) => ({
      network: { ...s.network, ttlStart: clamp(Math.round(ttlStart), 16, 255) },
    })),
  resetNetworkLayer: () => set({ network: { ...DEFAULT_NETWORK } }),

  setDataLinkBer: (berPercent) =>
    set((s) => ({
      dataLink: { ...s.dataLink, berPercent: clamp(berPercent, 0, 10) },
    })),
  setDataLinkMac: (macProtocol) =>
    set((s) => ({ dataLink: { ...s.dataLink, macProtocol } })),
  setDataLinkCsma: (csmaCd) =>
    set((s) => ({ dataLink: { ...s.dataLink, csmaCd } })),
  resetDataLinkLayer: () => set({ dataLink: { ...DEFAULT_DATALINK } }),
  injectBitError: () =>
    set((s) => ({
      dataLink: { ...s.dataLink, crcFailurePulse: s.dataLink.crcFailurePulse + 1 },
    })),

  setPhysicalMedium: (medium) =>
    set((s) => ({ physical: { ...s.physical, medium } })),
  setPhysicalSignal: (signalDbm) =>
    set((s) => ({
      physical: { ...s.physical, signalDbm: clamp(signalDbm, -30, 10) },
    })),
  setPhysicalSnr: (snrDb) =>
    set((s) => ({
      physical: { ...s.physical, snrDb: clamp(snrDb, 0, 30) },
    })),
  setPhysicalInterference: (interference) =>
    set((s) => ({ physical: { ...s.physical, interference } })),
  setPhysicalDistance: (distanceM) =>
    set((s) => ({
      physical: { ...s.physical, distanceM: clamp(distanceM, 1, 500) },
    })),
  addRepeater: () =>
    set((s) => ({
      physical: {
        ...s.physical,
        repeaterCount: Math.min(8, s.physical.repeaterCount + 1),
      },
    })),
  resetPhysicalLayer: () => set({ physical: { ...DEFAULT_PHYSICAL } }),

  resetAll: () =>
    set({
      application: { ...DEFAULT_APPLICATION },
      presentation: { ...DEFAULT_PRESENTATION },
      session: { ...DEFAULT_SESSION },
      transport: { ...DEFAULT_TRANSPORT },
      network: { ...DEFAULT_NETWORK },
      dataLink: { ...DEFAULT_DATALINK },
      physical: { ...DEFAULT_PHYSICAL },
      currentLayerIndex: 0,
      compareMode: false,
      packetCaptureOpen: false,
    }),

  exportSessionJson: () => {
    const st = get();
    const snapshot = {
      currentLayerIndex: st.currentLayerIndex,
      application: st.application,
      presentation: st.presentation,
      session: st.session,
      transport: { ...st.transport, congestionSpikeUntil: 0 },
      network: st.network,
      dataLink: st.dataLink,
      physical: st.physical,
    };
    return JSON.stringify(snapshot, null, 2);
  },
}));

/** Map slider position 0–100 to bytes [minB, maxB] logarithmically */
export function logBytesFromSliderPosition(position: number, minB: number, maxB: number): number {
  const t = Math.min(100, Math.max(0, position)) / 100;
  const logMin = Math.log(minB);
  const logMax = Math.log(maxB);
  return Math.round(Math.exp(logMin + t * (logMax - logMin)));
}

export function sliderPositionFromBytes(bytes: number, minB: number, maxB: number): number {
  const logMin = Math.log(minB);
  const logMax = Math.log(maxB);
  const logB = Math.log(bytes);
  const t = (logB - logMin) / (logMax - logMin);
  return Math.min(100, Math.max(0, t * 100));
}

/** Legacy helper — Application-only rough estimate */
export function computeCumulativeMetrics(app: ApplicationState) {
  const sizeKb = app.dataSizeBytes / KB;
  const typeLatencyBoost =
    app.dataType === "http" ? 1 : app.dataType === "smtp" ? 1.15 : 1.08;
  const tlsBoost = app.secureTransport ? 1.06 : 1;

  const estimatedLatencyMs =
    (8 + Math.log10(Math.max(1, sizeKb)) * 12 + (app.requestCadenceRps / 1000) * 45) *
    typeLatencyBoost *
    tlsBoost;

  const throughputMbps = ((app.dataSizeBytes * app.requestCadenceRps) / MB) * 8 * 0.001;

  const congestionScore = Math.min(
    100,
    (app.requestCadenceRps / 1000) * 40 + (sizeKb / 512) * 25
  );

  const reliabilityStress = Math.min(
    100,
    (app.requestCadenceRps / 25) * 3 + (sizeKb > 256 ? 20 : 0)
  );

  return {
    estimatedLatencyMs,
    throughputMbps,
    congestionScore,
    reliabilityStress,
  };
}

export function computeDownstreamWarnings(app: ApplicationState): DownstreamWarning[] {
  const out: DownstreamWarning[] = [];
  const sizeKb = app.dataSizeBytes / KB;

  if (sizeKb > 500) {
    out.push({
      targetLayer: 4,
      message:
        "Large application payloads may require many TCP segments and increase retransmission risk.",
    });
  }
  if (app.requestCadenceRps > 400) {
    out.push({
      targetLayer: 4,
      message:
        "High request rate increases transport-layer buffering and can trigger congestion control.",
    });
  }
  if (app.requestCadenceRps > 200 || sizeKb > 200) {
    out.push({
      targetLayer: 3,
      message:
        "Routing and queueing delay may rise when many large flows compete for path bandwidth.",
    });
  }
  if (sizeKb > 100) {
    out.push({
      targetLayer: 2,
      message:
        "Larger frames spend more time on the wire; switch buffers must absorb bursts.",
    });
  }
  if (app.requestCadenceRps > 600) {
    out.push({
      targetLayer: 1,
      message:
        "Sustained high symbol rate stresses physical encoding and may increase bit errors on marginal links.",
    });
  }

  return out;
}
