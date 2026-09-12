import { forwardRef } from "react";
import { motion } from "framer-motion";

const VARIANTS = {
  // Accent / CTA: Terracotta Orange #D9534F
  primary:
    "bg-chili text-white hover:bg-[#c9433f] active:bg-[#b53531] border border-transparent shadow-sm hover:shadow-md",
  terracotta:
    "bg-[#D9534F] text-white hover:bg-[#c9433f] active:bg-[#b53531] border border-transparent shadow-sm hover:shadow-md",
  // Accent / CTA: Warm Amber #E67E22
  amber:
    "bg-[#E67E22] text-white hover:bg-[#d35400] active:bg-[#ba4a00] border border-transparent shadow-sm hover:shadow-md",
  "warm-amber":
    "bg-[#E67E22] text-white hover:bg-[#d35400] active:bg-[#ba4a00] border border-transparent shadow-sm hover:shadow-md",
  // Dark Blue & Grey Brown accents
  secondary:
    "bg-transparent text-ink border border-ink/80 hover:bg-ink hover:text-white shadow-sm hover:shadow-md",
  turmeric:
    "bg-turmeric text-white hover:bg-turmeric-dark border border-transparent shadow-sm hover:shadow-md",
  ghost:
    "bg-transparent text-ink hover:bg-paper-dim border border-transparent",
};

const SIZES = {
  sm: "text-sm px-3.5 py-1.5",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-7 py-3.5",
};

const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    className = "",
    disabled = false,
    icon: Icon,
    iconPosition = "left",
    fullWidth = false,
    ...props
  },
  ref
) {
  return (
    <motion.button
      ref={ref}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.96 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`
        inline-flex items-center justify-center gap-2 font-sans font-semibold
        transition-colors duration-200 rounded-xl
        disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer
        ${fullWidth ? "w-full" : ""}
        ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size]} ${className}
      `}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon size={18} strokeWidth={2} />}
      {children}
      {Icon && iconPosition === "right" && <Icon size={18} strokeWidth={2} />}
    </motion.button>
  );
});

export default Button;
