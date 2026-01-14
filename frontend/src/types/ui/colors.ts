export const metricColors = {
    blue: {
        bg: "from-white to-slate-100",
        border: "border-slate-100",
        title: "text-slate-600",
        iconBg: "from-slate-100 to-slate-200",
        iconHover: "group-hover:from-slate-200 group-hover:to-slate-300",
        icon: "text-slate-500",
    },
    green: {
        bg: "from-white to-green-100",
        border: "border-green-100",
        title: "text-green-600",
        iconBg: "from-green-100 to-green-200",
        iconHover: "group-hover:from-green-200 group-hover:to-green-300",
        icon: "text-green-500",
    },
    red: {
        bg: "from-white to-red-100",
        border: "border-red-100",
        title: "text-red-600",
        iconBg: "from-red-100 to-red-200",
        iconHover: "group-hover:from-red-200 group-hover:to-red-300",
        icon: "text-red-500",
    },
} as const;

export type MetricColor = keyof typeof metricColors;
