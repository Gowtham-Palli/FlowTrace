// import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
// import { motion } from "framer-motion";

// type Variant = "primary" | "secondary" | "danger";

// type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
//   variant?: Variant;
//   accent: string;
//   accentHover: string;
//   children: ReactNode;
// };

// export function PillButton({
//   variant = "primary",
//   accent,
//   accentHover,
//   children,
//   className = "",
//   disabled,
//   ...rest
// }: Props) {
//   const base =
//     "inline-flex h-12 min-h-[48px] items-center justify-center rounded-full px-6 text-[18px] font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF9F0] disabled:cursor-not-allowed disabled:opacity-40";

//   if (variant === "danger") {
//     return (
//       <motion.button
//         type="button"
//         whileHover={{ scale: disabled ? 1 : 1.02 }}
//         whileTap={{ scale: disabled ? 1 : 0.98 }}
//         disabled={disabled}
//         className={`${base} border-2 border-rose-300 bg-white text-rose-600 hover:bg-rose-50 ${className}`}
//         {...(rest as any)}
//       >
//         {children}
//       </motion.button>
//     );
//   }

//   if (variant === "secondary") {
//     return (
//       <motion.button
//         type="button"
//         whileHover={{ scale: disabled ? 1 : 1.02 }}
//         whileTap={{ scale: disabled ? 1 : 0.98 }}
//         disabled={disabled}
//         className={`${base} border-2 bg-white hover:brightness-[0.99] ${className}`}
//         style={
//           {
//             borderColor: accent,
//             color: accent,
//             "--tw-ring-color": accent,
//           } as CSSProperties
//         }
//         {...(rest as any)}
//       >
//         {children}
//       </motion.button>
//     );
//   }

//   return (
//     <motion.button
//       type="button"
//       whileHover={{ scale: disabled ? 1 : 1.02 }}
//       whileTap={{ scale: disabled ? 1 : 0.98 }}
//       disabled={disabled}
//       className={`${base} text-white shadow-sm ${className}`}
//       style={{ backgroundColor: accent }}
//       onMouseEnter={(e) => {
//         if (!disabled) (e.currentTarget as HTMLButtonElement).style.backgroundColor = accentHover;
//       }}
//       onMouseLeave={(e) => {
//         if (!disabled) (e.currentTarget as HTMLButtonElement).style.backgroundColor = accent;
//       }}
//       {...(rest as any)}
//     />
//   );
// }


import type {
  ButtonHTMLAttributes,
  CSSProperties,
  ReactNode,
} from "react";

import { motion } from "framer-motion";

type Variant =
  | "primary"
  | "secondary"
  | "danger";

type Props =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    accent: string;
    accentHover: string;
    children: ReactNode;
  };

export function PillButton({
  variant = "primary",
  accent,
  accentHover,
  children,
  className = "",
  disabled,
  ...rest
}: Props) {
  const base = `
    group relative overflow-hidden
    inline-flex h-12 min-h-[48px]
    items-center justify-center
    rounded-2xl
    px-6
    text-[15px]
    font-bold
    tracking-wide
    backdrop-blur-xl
    transition-all duration-300
    focus-visible:outline-none
    disabled:cursor-not-allowed
    disabled:opacity-60
  `;

  /* -------------------------------- */
  /* DANGER */
  /* -------------------------------- */

  if (variant === "danger") {
    return (
      <motion.button
        type="button"
        whileHover={
          disabled
            ? {}
            : {
                y: -2,
                scale: 1.02,
              }
        }
        whileTap={
          disabled
            ? {}
            : {
                scale: 0.98,
              }
        }
        disabled={disabled}
        className={`
          ${base}
          border border-red-400/15
          ${
            disabled
              ? "bg-white/70 text-black"
              : "bg-red-500/10 text-red-300"
          }
          hover:border-red-400/30
          hover:bg-red-500/15
          hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]
          ${className}
        `}
        {...(rest as any)}
      >
        {/* glow */}
        {!disabled && (
          <div
            className="
              absolute inset-0 opacity-0
              transition-opacity duration-300
              group-hover:opacity-100
              bg-gradient-to-r
              from-red-500/5
              via-transparent
              to-red-500/5
            "
          />
        )}

        <span className="relative z-10">
          {children}
        </span>
      </motion.button>
    );
  }

  /* -------------------------------- */
  /* SECONDARY */
  /* -------------------------------- */

  if (variant === "secondary") {
    return (
      <motion.button
        type="button"
        whileHover={
          disabled
            ? {}
            : {
                y: -2,
                scale: 1.02,
              }
        }
        whileTap={
          disabled
            ? {}
            : {
                scale: 0.98,
              }
        }
        disabled={disabled}
        className={`
          ${base}
          border border-white/10
          ${
            disabled
              ? "bg-white/70 text-black"
              : "bg-white/[0.03]"
          }
          hover:bg-white/[0.06]
          hover:border-white/20
          ${className}
        `}
        style={
          {
            color: disabled
              ? "#000"
              : accent,
            "--tw-ring-color":
              accent,
          } as CSSProperties
        }
        {...(rest as any)}
      >
        {/* hover glow */}
        {!disabled && (
          <>
            <div
              className="
                absolute inset-0 opacity-0
                transition-opacity duration-300
                group-hover:opacity-100
              "
              style={{
                background: `linear-gradient(90deg, ${accent}10, transparent, ${accent}10)`,
              }}
            />

            {/* border glow */}
            <div
              className="
                absolute inset-0 rounded-2xl
                opacity-0 transition-opacity duration-300
                group-hover:opacity-100
              "
              style={{
                boxShadow: `0 0 25px ${accent}20`,
              }}
            />
          </>
        )}

        <span className="relative z-10">
          {children}
        </span>
      </motion.button>
    );
  }

  /* -------------------------------- */
  /* PRIMARY */
  /* -------------------------------- */

  return (
    <motion.button
      type="button"
      whileHover={
        disabled
          ? {}
          : {
              y: -2,
              scale: 1.02,
            }
      }
      whileTap={
        disabled
          ? {}
          : {
              scale: 0.98,
            }
      }
      disabled={disabled}
      className={`
        ${base}
        ${
          disabled
            ? "bg-white/70 text-black"
            : "text-white"
        }
        shadow-[0_0_40px_rgba(255,255,255,0.05)]
        ${className}
      `}
      style={
        disabled
          ? {}
          : {
              background: `linear-gradient(135deg, ${accent}, ${accentHover})`,
            }
      }
      {...(rest as any)}
    >
      {/* animated glow */}
      {!disabled && (
        <>
          <div
            className="
              absolute inset-0 opacity-0
              transition-opacity duration-300
              group-hover:opacity-100
            "
          >
            <div
              className="
                absolute -left-1/2 top-0
                h-full w-1/2
                rotate-12
                bg-gradient-to-r
                from-transparent
                via-white/[0.14]
                to-transparent
                blur-xl
              "
            />
          </div>

          {/* outer glow */}
          <div
            className="
              absolute inset-0 rounded-2xl
              opacity-0 transition-opacity duration-300
              group-hover:opacity-100
            "
            style={{
              boxShadow: `0 0 40px ${accent}40`,
            }}
          />
        </>
      )}

      <span className="relative z-10">
        {children}
      </span>
    </motion.button>
  );
}