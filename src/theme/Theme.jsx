// import { useThemeStore } from "../stores/useThemeStore";

// export const useTheme = () => {
//   const isDark = useThemeStore((state) => state.isDarkMode);

//   const theme = {
//     bg: isDark ? "bg-slate-950" : "bg-slate-50",
//     text: isDark ? "text-white" : "text-slate-900",
//     textMuted: isDark ? "text-slate-400" : "text-slate-600",

//     navBg: isDark
//       ? "bg-slate-950/70 border-white/5"
//       : "bg-white/70 border-slate-200",

//     cardBg: isDark
//       ? "bg-white/5 border-white/5 hover:bg-white/10"
//       : "bg-white border-slate-200 shadow-sm hover:shadow-md",

//     bubbleOther: isDark
//       ? "bg-slate-800/80 border-white/10"
//       : "bg-white/80 border-slate-200 shadow-lg",

//     bubbleTextOther: isDark ? "text-white" : "text-slate-800",

//     footer: isDark
//       ? "bg-slate-950 border-white/5"
//       : "bg-slate-100 border-slate-200",

//     blobBlue: isDark ? "bg-blue-600/20" : "bg-blue-400/20",
//     blobPurple: isDark ? "bg-purple-600/20" : "bg-purple-400/20",

//     container: isDark
//       ? "bg-slate-900 border-white/10"
//       : "bg-white border-slate-200",
//     inputBg: isDark
//       ? "bg-slate-950 border-white/10 focus:border-cyan-500"
//       : "bg-slate-50 border-slate-200 focus:border-cyan-500",
//     inputIcon: isDark ? "text-slate-500" : "text-slate-400",
//     errorBg: isDark
//       ? "bg-red-500/10 text-red-400 border-red-500/20"
//       : "bg-red-50 text-red-600 border-red-200",
//   };

//   return theme;
// };

import { useThemeStore } from "../stores/useThemeStore";

export const useTheme = () => {
  const isDark = useThemeStore((state) => state.isDarkMode);

  const theme = {
    bg: isDark ? "bg-slate-950" : "bg-slate-50",
    text: isDark ? "text-slate-100" : "text-slate-900",
    textMuted: isDark ? "text-slate-400" : "text-slate-500",

    navBg: isDark
      ? "bg-slate-950/80 backdrop-blur-md border-b border-white/10"
      : "bg-white/80 backdrop-blur-md border-b border-slate-200",

    cardBg: isDark
      ? "bg-slate-900/50 border border-white/10 shadow-xl"
      : "bg-white border border-slate-200 shadow-sm",

    container: isDark
      ? "bg-slate-900 border border-white/10"
      : "bg-white border border-slate-200 shadow-sm",

    inputBg: isDark
      ? "bg-slate-950/50 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
      : "bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20",

    inputIcon: isDark ? "text-slate-500" : "text-slate-400",

    errorBg: isDark
      ? "bg-red-500/10 text-red-400 border border-red-500/20"
      : "bg-red-50 text-red-600 border border-red-200",

    successBg: isDark
      ? "bg-green-500/10 text-green-400 border border-green-500/20"
      : "bg-green-50 text-green-700 border border-green-200",

    successRing: isDark
      ? "ring-2 ring-green-500/50"
      : "ring-2 ring-green-500/30",

    blobBlue: isDark ? "bg-blue-600/20" : "bg-blue-400/20",
    blobPurple: isDark ? "bg-purple-600/20" : "bg-purple-400/20",

    footer: isDark
      ? "bg-slate-950 border-t border-white/5"
      : "bg-slate-50 border-t border-slate-200",
  };

  return theme;
};
