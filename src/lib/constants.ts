export const SITE_CONFIG = {
  name: "TECH-TITAN",
  shortName: "Titan",
  tagline: "Next-Generation Intelligence & Systems Architecture",
  description:
    "Enterprise-grade AI ecosystem and telemetry command center built for SIH 2026 Problem Statement 26044.",
  sih: {
    year: "2026",
    problemStatementId: "26044",
    category: "Software / AI & Emerging Technologies",
    teamName: "TECH-TITAN",
  },
  links: {
    github: "https://github.com",
    docs: "/docs",
    status: "/api/health",
  },
  navItems: [
    { label: "Overview", href: "#overview" },
    { label: "Architecture", href: "#architecture" },
    { label: "Design System", href: "#design-system" },
    { label: "Ecosystem 3D", href: "#ecosystem-3d" },
    { label: "System Health", href: "#health" },
  ],
} as const;

export const SYSTEM_STATUS = {
  ONLINE: "online",
  DEGRADED: "degraded",
  MAINTENANCE: "maintenance",
  OFFLINE: "offline",
} as const;

export type SystemStatusType = (typeof SYSTEM_STATUS)[keyof typeof SYSTEM_STATUS];
