import type { SelectHTMLAttributes } from "react";
import { getLayerDesign } from "../../lib/layerDesign";
import { DelayedTooltip } from "../DelayedTooltip";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  layer: number;
  label: React.ReactNode;
  tooltip: React.ReactNode;
};

export function SelectField({ layer, label, tooltip, id, className = "", children, ...rest }: Props) {
  const t = getLayerDesign(layer);
  const sid = id ?? `select-${layer}`;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <DelayedTooltip content={tooltip} delayMs={500}>
        <label
          htmlFor={sid}
          className="cursor-help border-b border-dotted border-[#CCC] text-[18px] font-medium text-[#333]"
        >
          {label}
        </label>
      </DelayedTooltip>
      <div className="relative">
        <select
          id={sid}
          className="h-12 w-full appearance-none rounded-xl border border-[#E0E0E0] bg-white px-4 pr-10 text-[18px] text-[#1A1A1A] shadow-sm transition focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-offset-2"
          style={{ "--tw-ring-color": t.accent } as React.CSSProperties}
          {...rest}
        >
          {children}
        </select>
        <span
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#888]"
          aria-hidden
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}
