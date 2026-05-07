// import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

// type DelayedTooltipProps = {
//   content: ReactNode;
//   children: ReactNode;
//   /** Delay before showing tooltip (ms). Default 500 */
//   delayMs?: number;
//   /** Root layout — default inline-flex for labels; use `block w-full` for block regions like charts */
//   className?: string;
// };

// /**
//  * Design system tooltip: 500ms delay, #1A1A1A surface, 15px text, max 260px, arrow pointer.
//  */
// export function DelayedTooltip({
//   content,
//   children,
//   delayMs = 500,
//   className = "inline-flex",
// }: DelayedTooltipProps) {
//   const [open, setOpen] = useState(false);
//   const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const clearTimer = useCallback(() => {
//     if (timerRef.current) {
//       clearTimeout(timerRef.current);
//       timerRef.current = null;
//     }
//   }, []);

//   const show = useCallback(() => {
//     clearTimer();
//     timerRef.current = setTimeout(() => setOpen(true), delayMs);
//   }, [clearTimer, delayMs]);

//   const hide = useCallback(() => {
//     clearTimer();
//     setOpen(false);
//   }, [clearTimer]);

//   useEffect(() => () => clearTimer(), [clearTimer]);

//   return (
//     <div
//       className={`relative ${className}`}
//       onMouseEnter={show}
//       onMouseLeave={hide}
//       onFocus={show}
//       onBlur={hide}
//     >
//       {children}
//       {open ? (
//         <div
//           role="tooltip"
//           className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 min-w-0 -translate-x-1/2"
//         >
//           <div className="relative max-w-[260px] rounded-xl bg-[#1A1A1A] px-4 py-2 text-left text-[15px] font-normal leading-snug text-white shadow-lg">
//             {content}
//             <div
//               className="absolute left-1/2 top-full -translate-x-1/2 border-[7px] border-transparent border-t-[#1A1A1A]"
//               aria-hidden
//             />
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }


import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { AnimatePresence, motion } from "framer-motion";

type DelayedTooltipProps = {
  content: ReactNode;
  children: ReactNode;

  /** Delay before showing tooltip */
  delayMs?: number;

  /** Wrapper layout */
  className?: string;
};

/**
 * Futuristic glassmorphism tooltip
 * - smooth motion
 * - neon glow
 * - floating effect
 * - adaptive dark UI
 */
export function DelayedTooltip({
  content,
  children,
  delayMs = 500,
  className = "inline-flex",
}: DelayedTooltipProps) {
  const [open, setOpen] = useState(false);

  const timerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const show = useCallback(() => {
    clearTimer();

    timerRef.current = setTimeout(() => {
      setOpen(true);
    }, delayMs);
  }, [clearTimer, delayMs]);

  const hide = useCallback(() => {
    clearTimer();
    setOpen(false);
  }, [clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}

      <AnimatePresence>
        {open && (
          <motion.div
            role="tooltip"
            initial={{
              opacity: 0,
              y: 10,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 6,
              scale: 0.96,
            }}
            transition={{
              duration: 0.18,
              ease: "easeOut",
            }}
            className="
              pointer-events-none
              absolute bottom-full left-1/2
              z-[999]
              mb-4
              min-w-0
              -translate-x-1/2
            "
          >
            {/* glow */}
            <div
              className="
                absolute inset-0
                rounded-2xl
                bg-cyan-400/10
                blur-2xl
              "
            />

            {/* tooltip */}
            <div
              className="
                relative overflow-hidden
                rounded-2xl
                border border-white/10
                bg-[#07111F]/95
                px-4 py-3
                backdrop-blur-2xl
                shadow-[0_20px_60px_rgba(0,0,0,0.45)]
              "
            >
              {/* gradient border effect */}
              <div
                className="
                  absolute inset-0 opacity-40
                  bg-gradient-to-br
                  from-cyan-400/10
                  via-transparent
                  to-violet-400/10
                "
              />

              {/* content */}
              <div
                className="
                  relative z-10
                  max-w-[280px]
                  text-left
                  text-[14px]
                  font-medium
                  leading-relaxed
                  tracking-[0.01em]
                  text-white/85
                "
              >
                {content}
              </div>

              {/* arrow */}
              <div
                className="
                  absolute left-1/2 top-full
                  h-4 w-4
                  -translate-x-1/2
                  -translate-y-2
                  rotate-45
                  border-r border-b border-white/10
                  bg-[#07111F]
                "
                aria-hidden
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}