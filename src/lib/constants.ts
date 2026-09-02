export const SITE_CONFIG = {
  name: "Skillora",
  shortName: "Skillora",
  tagline: "Learn Smart. Improve Continuously. Own Your Future.",
  description:
    "Autonomous AI Personalized Learning Ecosystem & Continuous Skill Intelligence Platform. Learn smart, improve continuously, and own your future.",
  sih: {
    year: "2026",
    problemStatementId: "26044",
    category: "Software / AI & Emerging Technologies",
    teamName: "TechNova",
  },
  contact: {
    email: "skilloraedu26@gmail.com",
    phone: "+91 93228 33495",
    phoneRaw: "+919322833495",
    instagram: "https://www.instagram.com/skilloraedu26?igsi=MTVpdmk1cHQ0bHl3bQ==",
    instagramHandle: "@skilloraedu26",
    whatsapp: "https://wa.me/919322833495",
  },
  links: {
    github: "https://github.com/Safal-48/Anjuman-Hackathon",
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
