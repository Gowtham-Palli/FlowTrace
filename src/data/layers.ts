export type LayerInfo = {
  number: number;
  name: string;
  shortDescription: string;
};

export const OSI_LAYERS: LayerInfo[] = [
  {
    number: 7,
    name: "Application",
    shortDescription:
      "Interfaces directly with user-facing programs—HTTP, SMTP, FTP, DNS—and formats data for the stack.",
  },
  {
    number: 6,
    name: "Presentation",
    shortDescription:
      "Encrypts, compresses, and translates data into a common format for the application layer.",
  },
  {
    number: 5,
    name: "Session",
    shortDescription:
      "Establishes, manages, and terminates sessions between applications.",
  },
  {
    number: 4,
    name: "Transport",
    shortDescription:
      "Provides end-to-end segment delivery, flow control, and reliability (TCP/UDP).",
  },
  {
    number: 3,
    name: "Network",
    shortDescription:
      "Routes packets across networks using logical addressing (IP).",
  },
  {
    number: 2,
    name: "Data Link",
    shortDescription:
      "Frames bits for the local link; handles MAC addressing and error detection.",
  },
  {
    number: 1,
    name: "Physical",
    shortDescription:
      "Transmits raw bits over cable, fiber, or wireless physical media.",
  },
];

export function getLayerByIndex(index: number): LayerInfo | undefined {
  return OSI_LAYERS[index];
}
