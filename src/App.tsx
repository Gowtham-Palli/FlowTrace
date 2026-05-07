import { CompareLayersPanel } from "./components/CompareLayersPanel";
import { CumulativeEffectSidebar } from "./components/CumulativeEffectSidebar";
import { GlobalToolbar } from "./components/GlobalToolbar";
import { LayerByIndex } from "./components/LayerByIndex";
import { LayerNavFooter } from "./components/ds/LayerNavFooter";
import { Navigation } from "./components/Navigation";
import { PacketCapturePanel } from "./components/PacketCapturePanel";
import { OSI_LAYERS } from "./data/layers";
import { useSimulatorStore } from "./store/simulatorStore";

export default function App() {
  const currentLayerIndex = useSimulatorStore((s) => s.currentLayerIndex);
  const compareMode = useSimulatorStore((s) => s.compareMode);
  const layer = OSI_LAYERS[currentLayerIndex];

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <GlobalToolbar />
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 px-4 py-6 md:px-6 lg:flex-row lg:gap-8 lg:px-8 xl:py-8">
        <main className="flex min-w-0 flex-1 flex-col">
          {compareMode ? (
            <CompareLayersPanel />
          ) : (
            <>
              <p className="mb-5 text-[15px] leading-relaxed text-[#666]">
                <span className="font-semibold text-[#333]">{layer.name} layer</span>
                <span className="text-[#888]"> · </span>
                {layer.shortDescription}
              </p>
              <div className="flex-1">
                <LayerByIndex index={currentLayerIndex} />
              </div>
            </>
          )}
        </main>
        <CumulativeEffectSidebar />
      </div>
      {!compareMode ? <LayerNavFooter /> : null}
      <PacketCapturePanel />
    </div>
  );
}
