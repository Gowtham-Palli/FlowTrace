import { OSI_LAYERS } from "../data/layers";
import { ApplicationLayer } from "./ApplicationLayer";
import { PresentationLayer } from "./layers/PresentationLayer";
import { SessionLayer } from "./layers/SessionLayer";
import { TransportLayer } from "./layers/TransportLayer";
import { NetworkLayer } from "./layers/NetworkLayer";
import { DataLinkLayer } from "./layers/DataLinkLayer";
import { PhysicalLayer } from "./layers/PhysicalLayer";

export function LayerByIndex({ index }: { index: number }) {
  const layer = OSI_LAYERS[index];
  switch (layer.number) {
    case 7:
      return <ApplicationLayer />;
    case 6:
      return <PresentationLayer />;
    case 5:
      return <SessionLayer />;
    case 4:
      return <TransportLayer />;
    case 3:
      return <NetworkLayer />;
    case 2:
      return <DataLinkLayer />;
    case 1:
      return <PhysicalLayer />;
    default:
      return null;
  }
}
