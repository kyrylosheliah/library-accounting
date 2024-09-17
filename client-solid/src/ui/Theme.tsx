// Theme globals
export const themeg = {
  radius: "rounded-lg",
  radiusTop: "rounded-t-lg",
  radiusBottom: "rounded-b-lg",
  radiusLeft: "rounded-l-lg",
  radiusRight: "rounded-r-lg",
  radiusTop_first: "first:rounded-t-lg",
  radiusBottom_last: "last:rounded-b-lg",
  radiusLeft_first: "first:rounded-l-lg",
  radiusRight_last: "last:rounded-r-lg",
  shadow:
    "shadow-[0_0_0.25rem_0.125rem_#e5e5e5] dark:shadow-[0_0_0.25rem_0.125rem_#262626]",
};

// Theme palettes
export const themep = {
  default: {
    text: "text-black dark:text-white",
    text_hover: "hover:text-black hover:dark:text-white",
    text_placeholder:
      "placeholder:text-neutral-400 placeholder:dark:text-neutral-600",
    bg: "bg-white dark:bg-black",
    bg_hover: "hover:bg-neutral-200 dark:hover:bg-neutral-800",
    border: "border-neutral-800 dark:border-neutral-200",
    border_hover: "hover:border-black dark:hover:border-white",
  },
  fade: {
    bg: "bg-neutral-100 dark:bg-neutral-900",
    bg_hover: "hover:bg-neutral-200 dark:hover:bg-neutral-800",
  },
  fill: {
    text: "text-white dark:text-black",
    bg: "bg-black dark:bg-white",
    bg_hover: "hover:bg-neutral-800 hover:dark:bg-neutral-200",
    border: "border-black dark:border-white",
    border_hover: "hover:border-neutral-800 dark:hover:border-neutral-200",
  },
  dim: {
    text: "text-neutral-500",
    text_placeholder:
      "placeholder:text-neutral-400 dark:placeholder:text-neutral-600",
    bg: "bg-neutral-300 dark:bg-neutral-700",
    border: "border-neutral-300 dark:border-neutral-700",
    border_hover: "hover:border-neutral-500 dark:hover:border-neutral-500",
  },
  gray: {
    text: "text-neutral-500",
    text_placeholder: "placeholder:text-neutral-500",
    bg: "bg-neutral-500",
    border: "border-neutral-500",
    border_hover: "hover:border-neutral-500",
  },
  white: {
    text: "text-white",
    bg: "bg-white",
    bg_hover: "hover:bg-neutral-200",
  },
  light: {
    text: "text-blue-500 dark:text-amber-500",
    bg: "bg-blue-600/10 dark:bg-amber-600/20",
    bg_hover: "hover:bg-blue-600/20 dark:hover:bg-amber-600/30",
    border: "border-blue-600/40 dark:border-amber-600/40",
    border_hover: "hover:border-blue-600/70 dark:hover:border-amber-600/70",
  },
  color: {
    text: "text-blue-600 dark:text-amber-600",
    text_hover: "hover:text-blue-600 hover:dark:text-amber-600",
    bg: "bg-blue-600 dark:bg-amber-600",
    bg_hover: "hover:bg-blue-700 dark:hover:bg-amber-700",
    border: "border-blue-600 dark:border-amber-600",
    border_hover: "hover:border-blue-700 dark:hover:border-amber-700",
  },
  gradient: {
    text: "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500 dark:from-amber-600 dark:to-amber-500",
    bg: "bg-gradient-to-br from-blue-600 to-blue-400 dark:from-amber-700 dark:to-amber-500",
  },
  valid: {
    text: "text-green-600",
    text_hover: "hover:text-green-600 dark:hover:text-green-600",
    text_placeholder:
      "placeholder:text-green-600/30 dark:placeholder:text-green-600/40",
    bg: "bg-green-600/10 dark:bg-green-600/20",
    bg_hover: "hover:bg-green-600/20 dark:hover:bg-green-600/30",
    border: "border-green-600/50 dark:border-green-600/50",
    border_hover: "hover:border-green-600 dark:hover:border-green-600",
    border_fill: "border-green-600 dark:border-green-600",
    border_hover_fill: "border-green-700 dark:border-green-700",
    text_placeholder_fill: "placeholder:text-white/30",
    bg_fill: "bg-green-600",
    bg_hover_fill: "hover:bg-green-700",
  },
  invalid: {
    text: "text-red-600",
    text_hover: "hover:text-red-600 dark:hover:text-red-600",
    text_placeholder:
      "placeholder:text-red-600/30 dark:placeholder:text-red-600/40",
    bg: "bg-red-600/10 dark:bg-red-600/20",
    bg_hover: "hover:bg-red-600/20 dark:hover:bg-red-600/30",
    border: "border-red-600/50 dark:border-red-600/50",
    border_hover: "hover:border-red-600 dark:hover:border-red-600",
    border_fill: "border-red-600 dark:border-red-600",
    border_hover_fill: "border-red-700 dark:border-red-700",
    text_placeholder_fill: "placeholder:text-white/30",
    bg_fill: "bg-red-600",
    bg_hover_fill: "hover:bg-red-700",
  },
};
