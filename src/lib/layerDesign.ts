/** Canva/Pinterest-style warm OSI layer tokens (accent + soft stripe + chart hex) */
export type LayerDesignToken = {
  soft: string;
  accent: string;
  accentHover: string;
  chart: string;
};

export const LAYER_DESIGN: Record<number, LayerDesignToken> = {
  7: { soft: "#E8D5F5", accent: "#6B3FA0", accentHover: "#5a3488", chart: "#6B3FA0" },
  6: { soft: "#D5E8F5", accent: "#1E6F9F", accentHover: "#185a82", chart: "#1E6F9F" },
  5: { soft: "#D5F5E8", accent: "#1F8A6B", accentHover: "#197056", chart: "#1F8A6B" },
  4: { soft: "#F5E8D5", accent: "#C97D2E", accentHover: "#a96825", chart: "#C97D2E" },
  3: { soft: "#F5D5E8", accent: "#B5456B", accentHover: "#963a57", chart: "#B5456B" },
  2: { soft: "#FFF0D5", accent: "#C16E1A", accentHover: "#a35d16", chart: "#C16E1A" },
  1: { soft: "#E8F5D5", accent: "#5A8C1A", accentHover: "#4a7515", chart: "#5A8C1A" },
};

export function getLayerDesign(layerNum: number): LayerDesignToken {
  return LAYER_DESIGN[layerNum] ?? LAYER_DESIGN[4];
}

/** Progress bar fill: 7-stop gradient matching layers */
export const LAYER_GRADIENT =
  "linear-gradient(90deg, #E8D5F5 0%, #D5E8F5 16%, #D5F5E8 33%, #F5E8D5 50%, #F5D5E8 66%, #FFF0D5 83%, #E8F5D5 100%)";
