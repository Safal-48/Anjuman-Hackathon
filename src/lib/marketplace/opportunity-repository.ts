import {
  OpportunityEntity,
  OpportunityApplicationEntity,
  UserNotificationEntity,
  OpportunityType,
  ApplicationStatus,
  LocationType,
} from "@/lib/supabase/types";
import { calculateExplainableMatch } from "@/lib/marketplace/matching-engine";
import { getFullProfile } from "@/lib/db/profile-repository";
import { getUserById, DEMO_USERS } from "@/lib/auth/session";

// Global in-memory marketplace storage
const globalMarketplaceStore = global as unknown as {
  _titanOpportunities?: Map<string, OpportunityEntity>;
  _titanApplications?: Map<string, OpportunityApplicationEntity>;
  _titanNotifications?: Map<string, UserNotificationEntity>;
};

export const SEEDED_OPPORTUNITIES: OpportunityEntity[] = [
  // ==========================================
  // 1. INTERNSHIPS (6 Opportunities)
  // ==========================================
  {
    id: "opp-01",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Titan Frontier AI Labs",
    title: "Distributed AI & Neural Infrastructure Intern",
    opportunityType: "internship",
    description: "Join the core AI infrastructure team to build high-throughput model quantization, TensorRT acceleration pipelines, and distributed GPU cluster telemetry.",
    requiredSkills: ["Python", "PyTorch", "Distributed Systems", "Docker"],
    preferredSkills: ["TypeScript", "Next.js", "Kubernetes", "CUDA"],
    eligibility: "B.Tech/BE in CS, AI, EE (3rd/4th Year, GPA ≥ 8.0)",
    minGpa: 8.0,
    experienceRequired: "Hands-on PyTorch or Distributed Systems project experience",
    location: "Bengaluru, Karnataka (Hybrid)",
    locationType: "hybrid",
    stipendSalary: "₹65,000 / month",
    duration: "6 Months",
    deadline: "2026-05-15",
    openingsCount: 3,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-in-02",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Microsoft Research India",
    title: "Generative AI & Multimodal LLM Research Intern",
    opportunityType: "internship",
    description: "Conduct research in multimodal model evaluation, synthetic benchmark generation, and instruction-tuning for Indic linguistic models.",
    requiredSkills: ["Python", "PyTorch", "Algorithms & Complexity"],
    preferredSkills: ["Transformers", "HuggingFace", "FastAPI"],
    eligibility: "Pre-final / Final Year B.Tech, M.Tech, or Dual Degree (GPA ≥ 8.5)",
    minGpa: 8.5,
    experienceRequired: "Published research or demonstrable AI repository on GitHub",
    location: "Bengaluru, Karnataka (Hybrid)",
    locationType: "hybrid",
    stipendSalary: "₹85,000 / month",
    duration: "6 Months",
    deadline: "2026-05-30",
    openingsCount: 4,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-in-03",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Razorpay Financial Networks",
    title: "Cloud Native Backend & Payments Systems Intern",
    opportunityType: "internship",
    description: "Work on sub-millisecond payment routing architectures, idempotent transactional microservices, and distributed ledger security.",
    requiredSkills: ["React / Next.js", "TypeScript", "Distributed Systems", "PostgreSQL"],
    preferredSkills: ["Go", "Redis", "Kafka", "Docker"],
    eligibility: "3rd or 4th Year B.Tech CS/IT students",
    minGpa: 7.5,
    experienceRequired: "Solid foundation in data structures, REST/gRPC APIs, and SQL",
    location: "Bengaluru, Karnataka (Hybrid)",
    locationType: "hybrid",
    stipendSalary: "₹55,000 / month",
    duration: "6 Months",
    deadline: "2026-06-10",
    openingsCount: 6,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-in-04",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Tata Elxsi Mobility AI Labs",
    title: "Autonomous Vehicle Computer Vision & Perception Intern",
    opportunityType: "internship",
    description: "Build edge-optimized real-time perception models for obstacle detection, lane segmentation, and LiDAR fusion on embedded automotive SoCs.",
    requiredSkills: ["Python", "PyTorch", "Algorithms & Complexity"],
    preferredSkills: ["OpenCV", "C++", "ROS2", "TensorRT"],
    eligibility: "Engineering students in Robotics, CS, ECE, or Mechanical",
    minGpa: 7.8,
    experienceRequired: "Prior experience with camera calibration or OpenCV pipelines",
    location: "Pune, Maharashtra (Onsite)",
    locationType: "onsite",
    stipendSalary: "₹45,000 / month",
    duration: "6 Months",
    deadline: "2026-05-25",
    openingsCount: 5,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-in-05",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Zerodha Tech",
    title: "Ultra-Low Latency Order Execution & Trading Systems Intern",
    opportunityType: "internship",
    description: "Design high-concurrency order matching engines, memory-efficient WebSocket streams, and zero-allocation network parsers.",
    requiredSkills: ["Distributed Systems", "Algorithms & Complexity", "Python"],
    preferredSkills: ["Go", "C++", "PostgreSQL", "Linux eBPF"],
    eligibility: "Open to passionate coders with high algorithmic proficiency",
    minGpa: 7.0,
    experienceRequired: "Demonstrated open-source contributions or competitive coding rank",
    location: "Bengaluru, Karnataka (Onsite)",
    locationType: "onsite",
    stipendSalary: "₹60,000 / month",
    duration: "6 Months",
    deadline: "2026-06-15",
    openingsCount: 3,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-in-06",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "ISRO Satellite & Telemetry Wing",
    title: "Satellite Telemetry & Geospatial AI Engineering Intern",
    opportunityType: "internship",
    description: "Develop deep learning pipelines for high-resolution SAR image segmentation, orbital trajectory simulation, and real-time sensor anomaly detection.",
    requiredSkills: ["Python", "PyTorch", "Algorithms & Complexity", "Docker"],
    preferredSkills: ["GDAL", "GeoPandas", "QGIS", "C++"],
    eligibility: "Indian Nationals enrolled in B.Tech/M.Tech (GPA ≥ 8.0)",
    minGpa: 8.0,
    experienceRequired: "Strong mathematical foundation in matrix calculus and signal analysis",
    location: "Bengaluru, Karnataka (Onsite)",
    locationType: "onsite",
    stipendSalary: "₹40,000 / month",
    duration: "6 Months",
    deadline: "2026-05-20",
    openingsCount: 4,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ==========================================
  // 2. FULL-TIME JOBS (6 Opportunities)
  // ==========================================
  {
    id: "opp-02",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "HyperScale Cloud Networks",
    title: "Full-Stack Cloud & Web Systems Engineer",
    opportunityType: "job",
    description: "Architect mission-critical reactive cloud platforms, sub-10ms microservices, and edge computing dashboards for enterprise clients.",
    requiredSkills: ["React / Next.js", "TypeScript", "Distributed Systems", "PostgreSQL"],
    preferredSkills: ["Docker", "Redis", "Kafka", "GraphQL"],
    eligibility: "Graduating Batch 2025/2026, Computer Science & Engineering",
    minGpa: 7.5,
    experienceRequired: "Freshers with verified GitHub portfolio or 0-1 yr exp",
    location: "Remote (India)",
    locationType: "remote",
    stipendSalary: "₹18 - ₹24 LPA",
    duration: "Full-Time",
    deadline: "2026-06-01",
    openingsCount: 5,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-jb-02",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Swiggy AI & Applied Intelligence",
    title: "Associate Machine Learning & Recommendations Engineer",
    opportunityType: "job",
    description: "Build contextual real-time ranking models, dynamic delivery eta predictors, and customer personalization engines handling 50k+ QPS.",
    requiredSkills: ["Python", "PyTorch", "Algorithms & Complexity", "Distributed Systems"],
    preferredSkills: ["Feature Store", "Kubeflow", "Spark", "FastAPI"],
    eligibility: "B.Tech/BE/M.Tech Graduating 2025 or 2026",
    minGpa: 7.8,
    experienceRequired: "Prior internship or strong project portfolio in ML/DL",
    location: "Bengaluru, Karnataka (Hybrid)",
    locationType: "hybrid",
    stipendSalary: "₹22 - ₹28 LPA",
    duration: "Full-Time",
    deadline: "2026-06-30",
    openingsCount: 4,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-jb-03",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "CRED Core Engineering",
    title: "High-Throughput Platform & Distributed Systems Engineer",
    opportunityType: "job",
    description: "Construct resilient micro-frontend architectures, high-volume event stream processors, and zero-downtime financial database clusters.",
    requiredSkills: ["React / Next.js", "TypeScript", "Distributed Systems", "Docker"],
    preferredSkills: ["Kafka", "Cassandra", "AWS ECS", "Kubernetes"],
    eligibility: "Computer Science or related engineering graduates",
    minGpa: 8.0,
    experienceRequired: "Deep understanding of concurrency, ACID semantics, and network protocols",
    location: "Bengaluru, Karnataka (Onsite)",
    locationType: "onsite",
    stipendSalary: "₹24 - ₹32 LPA",
    duration: "Full-Time",
    deadline: "2026-06-20",
    openingsCount: 3,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-jb-04",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Postman API Platform",
    title: "Frontend Architecture & WebGL Systems Engineer",
    opportunityType: "job",
    description: "Drive next-generation reactive canvas visualization tools, WebSocket telemetry dashboards, and high-performance WebGL graphics.",
    requiredSkills: ["React / Next.js", "TypeScript", "System Architecture"],
    preferredSkills: ["Three.js / WebGL", "TailwindCSS", "Electron", "GraphQL"],
    eligibility: "Graduating batch 2025/2026 with strong UI/UX engineering instinct",
    minGpa: 7.5,
    experienceRequired: "Production-ready portfolio of modern web applications",
    location: "Remote / Hybrid (India)",
    locationType: "hybrid",
    stipendSalary: "₹20 - ₹26 LPA",
    duration: "Full-Time",
    deadline: "2026-06-15",
    openingsCount: 4,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-jb-05",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Cisco Systems India",
    title: "Cybersecurity & Cloud Infrastructure Associate",
    opportunityType: "job",
    description: "Engineer zero-trust network access gateways, secure automated container orchestration pipelines, and behavioral threat detection engines.",
    requiredSkills: ["Distributed Systems", "Docker", "System Architecture"],
    preferredSkills: ["Python", "Linux", "Kubernetes", "Cryptography"],
    eligibility: "B.Tech/BE in CS, IT, ECE (Graduating 2025/2026)",
    minGpa: 7.5,
    experienceRequired: "Strong grasping of TCP/IP, TLS handshakes, and Linux internals",
    location: "Bengaluru, Karnataka (Hybrid)",
    locationType: "hybrid",
    stipendSalary: "₹17 - ₹22 LPA",
    duration: "Full-Time",
    deadline: "2026-06-10",
    openingsCount: 5,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-jb-06",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Flipkart Commerce Cloud",
    title: "Data Platform & Real-Time Analytics Engineer",
    opportunityType: "job",
    description: "Manage petabyte-scale data pipelines, distributed OLAP query acceleration engines, and automated fraud anomaly detection models.",
    requiredSkills: ["Python", "Algorithms & Complexity", "Distributed Systems", "PostgreSQL"],
    preferredSkills: ["Apache Spark", "Flink", "Kafka", "ClickHouse"],
    eligibility: "Engineering graduates with passion for big data infrastructure",
    minGpa: 7.8,
    experienceRequired: "Demonstrated projects in distributed data querying or map-reduce",
    location: "Bengaluru, Karnataka (Onsite)",
    locationType: "onsite",
    stipendSalary: "₹20 - ₹27 LPA",
    duration: "Full-Time",
    deadline: "2026-06-25",
    openingsCount: 6,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ==========================================
  // 3. INDUSTRY PROJECTS (6 Opportunities)
  // ==========================================
  {
    id: "opp-03",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Nvidia Accelerated Computing Partner",
    title: "Low-Latency Edge Vision Telemetry Core",
    opportunityType: "industry_project",
    description: "Live sponsored industry challenge: Benchmark 120 FPS camera streams with PyTorch and TensorRT, optimizing memory footprint on edge nodes.",
    requiredSkills: ["Python", "PyTorch", "Algorithms & Complexity"],
    preferredSkills: ["Docker", "C++", "FastAPI"],
    eligibility: "Open to all verified student engineers and hackathon finalists",
    experienceRequired: "Demonstrated machine learning or systems programming background",
    location: "Remote",
    locationType: "remote",
    stipendSalary: "₹1,20,000 Milestone Grant",
    duration: "8 Weeks",
    deadline: "2026-04-30",
    openingsCount: 2,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-pr-02",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "DRDO Technology Development Cluster",
    title: "Autonomous Drone Navigation & Visual SLAM Challenge",
    opportunityType: "industry_project",
    description: "Develop GPS-denied autonomous flight algorithms using stereo camera depth estimation and lightweight visual-inertial odometry.",
    requiredSkills: ["Python", "PyTorch", "Algorithms & Complexity"],
    preferredSkills: ["ROS2", "C++", "PX4 Autopilot", "OpenCV"],
    eligibility: "Student teams of 2-4 members with verified robotics coursework",
    minGpa: 7.5,
    experienceRequired: "Experience in robotics simulations (Gazebo/Isaac Sim)",
    location: "Bengaluru / Hybrid",
    locationType: "hybrid",
    stipendSalary: "₹1,50,000 Research Grant",
    duration: "10 Weeks",
    deadline: "2026-05-10",
    openingsCount: 3,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-pr-03",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Polygon Labs Architecture Hub",
    title: "DePIN Decentralized Storage Mesh & Proof Verification",
    opportunityType: "industry_project",
    description: "Build cryptographic verification circuits for decentralized physical infrastructure network data feeds and zero-knowledge attestations.",
    requiredSkills: ["Distributed Systems", "Algorithms & Complexity", "System Architecture"],
    preferredSkills: ["Rust", "Solidity", "Zero Knowledge Proofs", "TypeScript"],
    eligibility: "Individual contributors or student pairs with Web3 background",
    experienceRequired: "Open source contributions to cryptographic or p2p protocols",
    location: "Remote",
    locationType: "remote",
    stipendSalary: "₹2,00,000 Bounty + Token Grant",
    duration: "6 Weeks",
    deadline: "2026-05-05",
    openingsCount: 4,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-pr-04",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "AI4Bharat / IIT Madras Innovation Hub",
    title: "Multilingual Voice AI for Rural Telehealth Diagnosis",
    opportunityType: "industry_project",
    description: "Fine-tune Whisper and IndicWav2Vec models on regional dialects to transcribe medical intake conversations with >90% BLEU/WER accuracy.",
    requiredSkills: ["Python", "PyTorch"],
    preferredSkills: ["HuggingFace", "FastAPI", "Audio DSP", "Next.js"],
    eligibility: "Undergrad & Master students passionate about social impact AI",
    minGpa: 7.0,
    experienceRequired: "Prior work with speech recognition or NLP transformers",
    location: "Chennai / Remote",
    locationType: "remote",
    stipendSalary: "₹1,00,000 Innovation Stipend",
    duration: "8 Weeks",
    deadline: "2026-05-18",
    openingsCount: 5,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-pr-05",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Amazon AWS Cloud Partner Lab",
    title: "Microservices Chaos Engineering & Self-Healing Mesh Lab",
    opportunityType: "industry_project",
    description: "Implement automated fault-injection chaos scenarios on Kubernetes clusters with eBPF metrics collection and self-healing circuit breakers.",
    requiredSkills: ["Distributed Systems", "Docker", "System Architecture"],
    preferredSkills: ["Kubernetes", "Prometheus", "Go", "AWS"],
    eligibility: "Cloud engineering & DevOps enthusiasts in 3rd/4th year",
    minGpa: 7.2,
    experienceRequired: "Demonstrated knowledge of container networking and telemetry",
    location: "Remote",
    locationType: "remote",
    stipendSalary: "₹90,000 Milestone Grant",
    duration: "6 Weeks",
    deadline: "2026-05-22",
    openingsCount: 4,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-pr-06",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Tata Power Smart Grid Innovation",
    title: "Renewable Energy Forecasting & Load Balancing Neural Core",
    opportunityType: "industry_project",
    description: "Train temporal transformer models to forecast solar and wind output 24-hours ahead using meteorological satellite data streams.",
    requiredSkills: ["Python", "PyTorch", "Algorithms & Complexity"],
    preferredSkills: ["Time Series Analysis", "PostgreSQL", "Docker", "FastAPI"],
    eligibility: "Engineering students with interest in clean tech and AI",
    minGpa: 7.5,
    experienceRequired: "Time-series forecasting or ML modeling experience",
    location: "Mumbai, Maharashtra (Hybrid)",
    locationType: "hybrid",
    stipendSalary: "₹1,10,000 Grant + Incubation Support",
    duration: "8 Weeks",
    deadline: "2026-05-30",
    openingsCount: 3,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ==========================================
  // 4. APPRENTICESHIPS (6 Opportunities)
  // ==========================================
  {
    id: "opp-04",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Google Cloud Platform Partner Hub",
    title: "Cloud DevOps & Kubernetes SRE Apprenticeship",
    opportunityType: "apprenticeship",
    description: "12-month accelerated apprenticeship working alongside senior Site Reliability Engineers managing high-availability multi-region Kubernetes clusters.",
    requiredSkills: ["Distributed Systems", "Docker", "System Architecture"],
    preferredSkills: ["Kubernetes", "Linux", "Terraform", "Python"],
    eligibility: "B.Tech/BE pre-final & final year students",
    minGpa: 7.0,
    experienceRequired: "Basic Linux networking & containerization fundamentals",
    location: "Hyderabad, Telangana (Onsite)",
    locationType: "onsite",
    stipendSalary: "₹50,000 / month",
    duration: "12 Months",
    deadline: "2026-05-20",
    openingsCount: 4,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-ap-02",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Qualcomm India Technologies",
    title: "Semiconductor Design & VLSI System Verification Apprentice",
    opportunityType: "apprenticeship",
    description: "12-month hands-on apprenticeship in RISC-V SoC architecture validation, UVM testbench design, and SystemVerilog timing closure.",
    requiredSkills: ["Algorithms & Complexity", "System Architecture"],
    preferredSkills: ["SystemVerilog", "C++", "FPGA", "Python"],
    eligibility: "B.Tech/M.Tech in ECE, EEE, VLSI, or CS (GPA ≥ 8.0)",
    minGpa: 8.0,
    experienceRequired: "Coursework in digital design, computer organization, or verilog",
    location: "Hyderabad, Telangana (Onsite)",
    locationType: "onsite",
    stipendSalary: "₹55,000 / month",
    duration: "12 Months",
    deadline: "2026-05-28",
    openingsCount: 4,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-ap-03",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Bosch Global Software Technologies",
    title: "Industrial IoT & Embedded Edge AI Apprentice",
    opportunityType: "apprenticeship",
    description: "Work directly on factory automation telematics, CAN-bus microcontrollers, and on-device anomaly detection for automotive production lines.",
    requiredSkills: ["Python", "Algorithms & Complexity", "Docker"],
    preferredSkills: ["C/C++", "MQTT", "FreeRTOS", "Linux"],
    eligibility: "Engineering students in CS, IT, ECE, or Mechatronics",
    minGpa: 7.2,
    experienceRequired: "Hands-on experience with Raspberry Pi, ESP32, or Arduino projects",
    location: "Bengaluru, Karnataka (Onsite)",
    locationType: "onsite",
    stipendSalary: "₹42,000 / month",
    duration: "12 Months",
    deadline: "2026-06-05",
    openingsCount: 6,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-ap-04",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Continental Automotive Systems",
    title: "Automotive Software & Embedded Linux Apprentice",
    opportunityType: "apprenticeship",
    description: "Learn AUTOSAR architecture compliance, safety-critical C++ development (ISO 26262), and digital cockpit infotainment programming.",
    requiredSkills: ["System Architecture", "Algorithms & Complexity"],
    preferredSkills: ["C++", "Embedded Linux", "Qt", "Git"],
    eligibility: "Pre-final / final year engineering students",
    minGpa: 7.5,
    experienceRequired: "Basic C/C++ memory management and multi-threading concepts",
    location: "Bengaluru, Karnataka (Onsite)",
    locationType: "onsite",
    stipendSalary: "₹45,000 / month",
    duration: "12 Months",
    deadline: "2026-06-12",
    openingsCount: 5,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-ap-05",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "IBM Security Labs",
    title: "Enterprise Cybersecurity & SOC Operations Apprentice",
    opportunityType: "apprenticeship",
    description: "Shadow senior Security Operations Center analysts on real-world threat hunting, SIEM log analysis with Splunk, and incident response runbooks.",
    requiredSkills: ["Distributed Systems", "Docker", "Algorithms & Complexity"],
    preferredSkills: ["Python", "Wireshark", "Linux", "Splunk"],
    eligibility: "Students with strong interest in ethical hacking & network defense",
    minGpa: 7.0,
    experienceRequired: "Familiarity with OWASP Top 10 and network security tools",
    location: "Kochi / Bengaluru (Hybrid)",
    locationType: "hybrid",
    stipendSalary: "₹40,000 / month",
    duration: "12 Months",
    deadline: "2026-05-30",
    openingsCount: 4,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-ap-06",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Tower Research Capital",
    title: "Quantitative Systems & High-Speed Networking Apprentice",
    opportunityType: "apprenticeship",
    description: "Work with elite quantitative technologists optimizing hardware kernel bypass, solarflare NICs, and nanosecond order routing engines.",
    requiredSkills: ["Algorithms & Complexity", "Distributed Systems"],
    preferredSkills: ["Modern C++ (17/20)", "Linux Kernel", "Assembly", "Python"],
    eligibility: "Top tier algorithmic programmers (Codeforces / ICPC / JEE Advanced)",
    minGpa: 8.5,
    experienceRequired: "Exceptional mastery of low-level memory layout and algorithms",
    location: "Gurugram, Haryana (Onsite)",
    locationType: "onsite",
    stipendSalary: "₹75,000 / month",
    duration: "12 Months",
    deadline: "2026-06-01",
    openingsCount: 2,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ==========================================
  // 5. TRAINING COHORTS (6 Opportunities)
  // ==========================================
  {
    id: "opp-05",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "DeepLearning Advanced Labs",
    title: "Enterprise LLM Optimization & TensorRT Accelerator Program",
    opportunityType: "training_program",
    description: "Intensive 6-week cohort on quantized large language model deployment, vLLM serving, and distributed KV-cache optimizations.",
    requiredSkills: ["Python", "PyTorch"],
    preferredSkills: ["CUDA", "FastAPI", "Next.js"],
    eligibility: "Students with strong math & linear algebra foundation",
    experienceRequired: "Prior experience training or fine-tuning neural networks",
    location: "Online Live Cohort",
    locationType: "remote",
    stipendSalary: "100% Industry Sponsored Scholarship",
    duration: "6 Weeks",
    deadline: "2026-04-15",
    openingsCount: 30,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-tr-02",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Meta Developer Circle Hub",
    title: "Production Next.js 15 & Server-Driven Web Systems Fellowship",
    opportunityType: "training_program",
    description: "Master full-stack React Server Components, streaming SSR, Edge middleware, and resilient optimistic UI design for hyper-growth startups.",
    requiredSkills: ["React / Next.js", "TypeScript"],
    preferredSkills: ["TailwindCSS", "PostgreSQL", "Docker"],
    eligibility: "Undergraduate developers with baseline React experience",
    minGpa: 6.5,
    experienceRequired: "Built at least one full-stack web project",
    location: "Remote Live Studio",
    locationType: "remote",
    stipendSalary: "Free Fellowship + Cloud Credits",
    duration: "8 Weeks",
    deadline: "2026-05-01",
    openingsCount: 50,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-tr-03",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Ethereum Foundation Academic Program",
    title: "Zero-Knowledge Cryptography & zk-Rollup Engineering Cohort",
    opportunityType: "training_program",
    description: "Comprehensive training on polynomial commitments, Plonk & Halo2 proof systems, and verifiable computation circuits for decentralized scaling.",
    requiredSkills: ["Algorithms & Complexity", "System Architecture"],
    preferredSkills: ["Rust", "Discrete Mathematics", "Cryptography"],
    eligibility: "Students with strong mathematical or theoretical CS foundation",
    experienceRequired: "Knowledge of abstract algebra, number theory, or cryptography",
    location: "Virtual Classroom",
    locationType: "remote",
    stipendSalary: "Sponsored Fellowship + Grant Access",
    duration: "10 Weeks",
    deadline: "2026-05-15",
    openingsCount: 25,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-tr-04",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Cloud Native Computing Foundation (CNCF)",
    title: "Production Kubernetes & Multi-Cloud DevOps Bootcamp",
    opportunityType: "training_program",
    description: "Hands-on preparation for CKA (Certified Kubernetes Administrator) covering declarative GitOps with ArgoCD, Istio service mesh, and Helm charts.",
    requiredSkills: ["Distributed Systems", "Docker"],
    preferredSkills: ["Kubernetes", "Linux", "Terraform", "CI/CD"],
    eligibility: "Engineering students aiming for DevOps & Cloud engineering careers",
    experienceRequired: "Basic Linux terminal fluency and container basics",
    location: "Hybrid (Online + Regional Hubs)",
    locationType: "hybrid",
    stipendSalary: "Free Exam Voucher (Worth ₹30,000)",
    duration: "8 Weeks",
    deadline: "2026-05-20",
    openingsCount: 40,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-tr-05",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Arm & Edge Impulse Alliance",
    title: "Edge AI & TinyML Microcontroller Deployment Fellowship",
    opportunityType: "training_program",
    description: "Deploy 8-bit quantized neural networks on Cortex-M microcontrollers for acoustic anomaly detection and low-power predictive maintenance.",
    requiredSkills: ["Python", "PyTorch"],
    preferredSkills: ["C/C++", "Embedded Systems", "TensorFlow Lite Micro"],
    eligibility: "Students in ECE, CS, AI, or Embedded Systems",
    minGpa: 7.0,
    experienceRequired: "Basic microcontroller programming knowledge",
    location: "Virtual Hands-on Labs",
    locationType: "remote",
    stipendSalary: "Free Hardware Development Kit Shipped",
    duration: "6 Weeks",
    deadline: "2026-05-10",
    openingsCount: 35,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-tr-06",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Snowflake & Databricks Industry Suite",
    title: "Scalable Data Engineering with Apache Spark & Lakehouse Architecture",
    opportunityType: "training_program",
    description: "Build robust streaming ETL pipelines using PySpark, Delta Lake tables, dbt transformation workflows, and real-time Kafka connectors.",
    requiredSkills: ["Python", "PostgreSQL", "Algorithms & Complexity"],
    preferredSkills: ["Apache Spark", "SQL", "Airflow", "AWS S3"],
    eligibility: "Finalist students interested in big data systems",
    minGpa: 7.2,
    experienceRequired: "Good understanding of relational schemas and Python scripting",
    location: "Online Cohort",
    locationType: "remote",
    stipendSalary: "100% Industry Sponsored + Verified Certificate",
    duration: "7 Weeks",
    deadline: "2026-05-25",
    openingsCount: 45,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ==========================================
  // 6. WORKSHOPS (6 Opportunities)
  // ==========================================
  {
    id: "opp-06",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "CyberDefense National Council",
    title: "Zero-Trust Protocol Security & Cryptographic Mesh Workshop",
    opportunityType: "workshop",
    description: "Hands-on 2-week masterclass covering zero-knowledge protocols, decentralized identity tokens, and defensive penetration testing.",
    requiredSkills: ["System Architecture", "Algorithms & Complexity"],
    preferredSkills: ["Rust", "Cryptography", "Linux"],
    eligibility: "Engineering students in Cybersecurity, CS, or IT",
    experienceRequired: "Basic socket programming and networking protocols",
    location: "New Delhi (Hybrid)",
    locationType: "hybrid",
    stipendSalary: "Certificate of Distinction + ₹15,000 Merit Stole",
    duration: "2 Weeks",
    deadline: "2026-04-10",
    openingsCount: 20,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-ws-02",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Intel & NVIDIA Academic Suite",
    title: "GPU Kernel Optimization & CUDA C++ Acceleration Intensive",
    opportunityType: "workshop",
    description: "Deep dive into GPU warp divergence, shared memory tiling, bank conflict reduction, and profiling with NVIDIA Nsight Compute.",
    requiredSkills: ["Algorithms & Complexity", "Python"],
    preferredSkills: ["CUDA", "C++", "GPU Architecture"],
    eligibility: "Engineering students with strong C/C++ background",
    minGpa: 7.5,
    experienceRequired: "Pointers, memory management, and parallel algorithms",
    location: "Bengaluru, Karnataka (Hybrid)",
    locationType: "hybrid",
    stipendSalary: "₹10,000 Top Performer Award",
    duration: "10 Days",
    deadline: "2026-05-02",
    openingsCount: 25,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-ws-03",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Three.js Foundation & Web Graphics Guild",
    title: "High-Performance 3D Web, WebGPU & Shader Programming Masterclass",
    opportunityType: "workshop",
    description: "Learn custom GLSL shaders, raymarching techniques, WebGPU compute shaders, and 60 FPS 3D canvas optimization in React Three Fiber.",
    requiredSkills: ["React / Next.js", "TypeScript"],
    preferredSkills: ["Three.js / WebGL", "GLSL", "WebGPU", "Blender"],
    eligibility: "Frontend and creative coding enthusiasts",
    experienceRequired: "Solid JavaScript/TypeScript and vector math foundations",
    location: "Remote Interactive Studio",
    locationType: "remote",
    stipendSalary: "Certificate of Visual Mastery",
    duration: "2 Weeks",
    deadline: "2026-05-08",
    openingsCount: 30,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-ws-04",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Postman Open Academy",
    title: "Modern API Design, gRPC Microservices & Contract Testing Workshop",
    opportunityType: "workshop",
    description: "Design production-grade protobuf schemas, bidirectional gRPC streams, automated contract tests, and OpenAPI 3.1 specifications.",
    requiredSkills: ["TypeScript", "Distributed Systems"],
    preferredSkills: ["gRPC", "Protobuf", "Node.js", "Docker"],
    eligibility: "Open to all verified student developers",
    experienceRequired: "Basic experience building RESTful web services",
    location: "Remote",
    locationType: "remote",
    stipendSalary: "Free Postman Student Expert Certification",
    duration: "1 Week",
    deadline: "2026-05-12",
    openingsCount: 50,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-ws-05",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "LangChain & CrewAI Ecosystem Hub",
    title: "Autonomous AI Agents & Multi-Agent Orchestration Intensive",
    opportunityType: "workshop",
    description: "Build stateful multi-agent workflows with LangGraph, tool-calling agents, persistent vector memory, and self-correcting code generation.",
    requiredSkills: ["Python", "PyTorch"],
    preferredSkills: ["LangChain", "FastAPI", "Next.js", "ChromaDB"],
    eligibility: "Developers eager to build next-gen agentic workflows",
    experienceRequired: "Familiarity with OpenAI / Claude / Gemini API integration",
    location: "Remote",
    locationType: "remote",
    stipendSalary: "Certificate of Excellence + Showcase Feature",
    duration: "2 Weeks",
    deadline: "2026-05-18",
    openingsCount: 40,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-ws-06",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "IBM Quantum Hub India",
    title: "Quantum Computing Foundations & Qiskit Algorithms Workshop",
    opportunityType: "workshop",
    description: "Simulate Grover's search, Shor's factoring, and Variational Quantum Eigensolvers (VQE) on IBM Quantum hardware via Qiskit SDK.",
    requiredSkills: ["Algorithms & Complexity", "Python"],
    preferredSkills: ["Linear Algebra", "Qiskit", "Complex Analysis"],
    eligibility: "Physics, Math, and Computer Science students",
    minGpa: 8.0,
    experienceRequired: "Strong linear algebra (eigenvalues, unitary operators)",
    location: "Online Interactive",
    locationType: "remote",
    stipendSalary: "IBM Quantum Digital Badge + Swag Pack",
    duration: "10 Days",
    deadline: "2026-05-22",
    openingsCount: 30,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ==========================================
  // 7. MENTORSHIP (6 Opportunities)
  // ==========================================
  {
    id: "opp-07",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Titan Engineering Fellowship",
    title: "Principal Systems Architect Mentorship Track",
    opportunityType: "mentorship",
    description: "1-on-1 direct mentorship with FAANG & AI startup engineering leaders to refine system design mastery and hackathon research papers.",
    requiredSkills: ["React / Next.js", "Python", "Team Collaboration"],
    preferredSkills: ["Distributed Systems", "Communication & Mentorship"],
    eligibility: "Finalist standing in competitive programming or national hackathons",
    experienceRequired: "High motivation and active engineering portfolio",
    location: "Virtual 1-on-1",
    locationType: "remote",
    stipendSalary: "Free Mentorship + Research Grant Access",
    duration: "6 Months",
    deadline: "2026-05-01",
    openingsCount: 10,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-mn-02",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Google DeepMind Alumni Network",
    title: "Senior AI Research Scientist 1-on-1 Guidance Track",
    opportunityType: "mentorship",
    description: "Personalized mentorship on writing top-tier NeurIPS/ICML research papers, formulating novel loss functions, and navigating PhD applications.",
    requiredSkills: ["Python", "PyTorch", "Algorithms & Complexity"],
    preferredSkills: ["Research Writing", "LaTeX", "Deep Learning Theory"],
    eligibility: "Students actively preparing research papers or AI patents",
    minGpa: 8.5,
    experienceRequired: "Strong academic record and prior ML research project",
    location: "Virtual 1-on-1",
    locationType: "remote",
    stipendSalary: "Free Mentorship + Publication Sponsorship",
    duration: "4 Months",
    deadline: "2026-05-15",
    openingsCount: 8,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-mn-03",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Silicon Valley Engineering Leaders Group",
    title: "Career Acceleration & High-Scale Systems Architecture Mentorship",
    opportunityType: "mentorship",
    description: "Bi-weekly deep architectural reviews on scalability bottlenecks, database partitioning, and conquering Staff+ engineering interviews.",
    requiredSkills: ["Distributed Systems", "System Architecture", "React / Next.js"],
    preferredSkills: ["Leadership", "System Design", "Cloud Architecture"],
    eligibility: "Pre-final / final year students targeting top global tech roles",
    minGpa: 7.5,
    experienceRequired: "Proficient coder with at least 2 full-scale projects",
    location: "Virtual 1-on-1",
    locationType: "remote",
    stipendSalary: "Complimentary 1-on-1 Executive Mentorship",
    duration: "6 Months",
    deadline: "2026-05-20",
    openingsCount: 12,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-mn-04",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Open Source Collective & GitHub Fellows",
    title: "Open-Source Maintainer Leadership & GSoC Fellowship Mentorship",
    opportunityType: "mentorship",
    description: "Get mentored by core maintainers of tier-1 open-source repositories to land Google Summer of Code (GSoC) and Linux Foundation fellowships.",
    requiredSkills: ["React / Next.js", "Python", "Docker"],
    preferredSkills: ["Git Workflows", "Open Source", "Documentation"],
    eligibility: "Open to passionate open-source contributors of all years",
    experienceRequired: "Active GitHub profile with submitted PRs or open-source issues",
    location: "Virtual 1-on-1",
    locationType: "remote",
    stipendSalary: "Free Mentorship + Open Source Travel Stipend",
    duration: "4 Months",
    deadline: "2026-05-25",
    openingsCount: 15,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-mn-05",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Y Combinator Founder & CTO Network",
    title: "Startup CTO & Tech Founder Advisory Track",
    opportunityType: "mentorship",
    description: "Direct 1-on-1 mentorship on taking student prototypes to venture-backed startups: MVP engineering, cloud architecture, and investor demo days.",
    requiredSkills: ["React / Next.js", "TypeScript", "Python"],
    preferredSkills: ["Product Strategy", "FastAPI", "Startup Pitching"],
    eligibility: "Student founders or hackers with working product MVPs",
    experienceRequired: "Live demo of a functioning startup prototype or hardware device",
    location: "Virtual 1-on-1",
    locationType: "remote",
    stipendSalary: "Advisory + $10,000 Cloud & API Credits",
    duration: "6 Months",
    deadline: "2026-06-01",
    openingsCount: 10,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "opp-mn-06",
    creatorId: DEMO_USERS["industry@titan.ai"].id,
    organizationName: "Competitive Programming Grandmaster Circle",
    title: "ICPC World Finals & High-Level Algorithmic Mentorship",
    opportunityType: "mentorship",
    description: "Intensive 1-on-1 problem-solving sessions on segment trees, dynamic programming on trees, network flows, and 2600+ rated Codeforces problems.",
    requiredSkills: ["Algorithms & Complexity"],
    preferredSkills: ["C++", "Number Theory", "Graph Theory"],
    eligibility: "Candidates with Codeforces rating ≥ 1600 or LeetCode rating ≥ 2000",
    experienceRequired: "Proven contest history and speed in competitive programming",
    location: "Virtual 1-on-1",
    locationType: "remote",
    stipendSalary: "Free Elite Coaching",
    duration: "5 Months",
    deadline: "2026-05-30",
    openingsCount: 6,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Initialize in-memory singleton
if (!globalMarketplaceStore._titanOpportunities) {
  globalMarketplaceStore._titanOpportunities = new Map<string, OpportunityEntity>();
  globalMarketplaceStore._titanApplications = new Map<string, OpportunityApplicationEntity>();
  globalMarketplaceStore._titanNotifications = new Map<string, UserNotificationEntity>();

  SEEDED_OPPORTUNITIES.forEach((opp) => {
    globalMarketplaceStore._titanOpportunities!.set(opp.id, opp);
  });

  // Pre-seed a sample application for the demo student
  const demoStudentId = DEMO_USERS["student@titan.ai"].id;
  const sampleOpp = SEEDED_OPPORTUNITIES[0];

  const sampleApp: OpportunityApplicationEntity = {
    id: "app-demo-01",
    opportunityId: sampleOpp.id,
    studentId: demoStudentId,
    status: "shortlisted",
    coverNote: "I have built high-performance PyTorch inference platforms and placed as an SIH Finalist for PS 26044.",
    matchScore: 92,
    matchBreakdown: {
      overallScore: 92,
      strongSkills: ["Python", "PyTorch", "Distributed Systems", "Docker"],
      partialSkills: ["TypeScript", "Next.js"],
      gapSkills: ["CUDA"],
      factorBreakdown: {
        skillMatch: 94,
        eligibilityMatch: 95,
        careerMatch: 90,
        experienceMatch: 88,
      },
      reasoningSummary: "Strong match (92%). Verified expertise in Python, PyTorch, and Distributed Systems with high portfolio evidence.",
    },
    appliedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  };
  globalMarketplaceStore._titanApplications!.set(sampleApp.id, sampleApp);

  // Pre-seed sample notification
  const sampleNotif: UserNotificationEntity = {
    id: "notif-demo-01",
    userId: demoStudentId,
    title: "Application Shortlisted!",
    message: "Your application for 'Distributed AI & Neural Infrastructure Intern' has been shortlisted by Titan Frontier AI Labs.",
    type: "application_status",
    linkUrl: "/applications",
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  globalMarketplaceStore._titanNotifications!.set(sampleNotif.id, sampleNotif);
}

/**
 * Retrieve all opportunities with optional search, filter, and personalized match computation
 */
export async function getMarketplaceOpportunities(
  studentId?: string,
  filters?: {
    type?: string;
    locationType?: string;
    search?: string;
    minMatch?: number;
  }
): Promise<OpportunityEntity[]> {
  const allOpps = Array.from(globalMarketplaceStore._titanOpportunities!.values());
  const student = studentId ? await getFullProfile(studentId) : null;

  let results = allOpps.map((opp) => {
    let matchResult = undefined;
    if (student) {
      matchResult = calculateExplainableMatch(student, opp);
    }
    return {
      ...opp,
      matchResult,
    };
  });

  // Apply filters
  if (filters?.type && filters.type !== "all") {
    results = results.filter((o) => o.opportunityType === filters.type);
  }
  if (filters?.locationType && filters.locationType !== "all") {
    results = results.filter((o) => o.locationType === filters.locationType);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase().trim();
    results = results.filter(
      (o) =>
        o.title.toLowerCase().includes(q) ||
        o.organizationName.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q) ||
        o.requiredSkills.some((s) => s.toLowerCase().includes(q))
    );
  }
  if (filters?.minMatch && student) {
    results = results.filter((o) => (o.matchResult?.overallScore || 0) >= filters.minMatch!);
  }

  // Sort by match score descending if student profile is active
  if (student) {
    results.sort((a, b) => (b.matchResult?.overallScore || 0) - (a.matchResult?.overallScore || 0));
  }

  return results;
}

/**
 * Get single opportunity with explainable match breakdown
 */
export async function getOpportunityById(
  id: string,
  studentId?: string
): Promise<OpportunityEntity | null> {
  const opp = globalMarketplaceStore._titanOpportunities!.get(id);
  if (!opp) return null;

  let matchResult = undefined;
  if (studentId) {
    const student = await getFullProfile(studentId);
    if (student) {
      matchResult = calculateExplainableMatch(student, opp);
    }
  }

  return {
    ...opp,
    matchResult,
  };
}

/**
 * Create a new opportunity (Industry role)
 */
export async function createOpportunity(
  creatorId: string,
  data: {
    title: string;
    organizationName: string;
    opportunityType: OpportunityType;
    description: string;
    requiredSkills: string[];
    preferredSkills?: string[];
    eligibility: string;
    minGpa?: number;
    experienceRequired?: string;
    location: string;
    locationType: LocationType;
    stipendSalary: string;
    duration: string;
    deadline: string;
    openingsCount?: number;
  }
): Promise<OpportunityEntity> {
  const newOpp: OpportunityEntity = {
    id: `opp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    creatorId,
    organizationName: data.organizationName.trim(),
    title: data.title.trim(),
    opportunityType: data.opportunityType,
    description: data.description.trim(),
    requiredSkills: data.requiredSkills,
    preferredSkills: data.preferredSkills || [],
    eligibility: data.eligibility.trim(),
    minGpa: data.minGpa,
    experienceRequired: data.experienceRequired || "Freshers eligible",
    location: data.location.trim(),
    locationType: data.locationType || "hybrid",
    stipendSalary: data.stipendSalary.trim(),
    duration: data.duration.trim(),
    deadline: data.deadline,
    openingsCount: data.openingsCount || 1,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  globalMarketplaceStore._titanOpportunities!.set(newOpp.id, newOpp);
  return newOpp;
}

/**
 * Submit student application for an opportunity
 */
export async function applyForOpportunity(
  studentId: string,
  opportunityId: string,
  coverNote?: string
): Promise<OpportunityApplicationEntity> {
  let student = await getFullProfile(studentId);
  const opp = globalMarketplaceStore._titanOpportunities!.get(opportunityId);

  if (!opp) {
    throw new Error("Opportunity not found");
  }

  if (!student) {
    const demoStudentId = DEMO_USERS["student@titan.ai"].id;
    student = await getFullProfile(demoStudentId);
  }

  if (!student) {
    throw new Error("Student profile could not be resolved");
  }

  // Check if already applied
  const existing = Array.from(globalMarketplaceStore._titanApplications!.values()).find(
    (a) => a.studentId === studentId && a.opportunityId === opportunityId
  );
  if (existing) {
    return existing;
  }

  const matchBreakdown = calculateExplainableMatch(student, opp);

  const newApp: OpportunityApplicationEntity = {
    id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    opportunityId,
    studentId,
    status: "applied",
    coverNote: coverNote?.trim(),
    matchScore: matchBreakdown.overallScore,
    matchBreakdown,
    appliedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    opportunity: opp,
  };

  globalMarketplaceStore._titanApplications!.set(newApp.id, newApp);

  // Send confirmation notification to student
  createNotification(
    studentId,
    "Application Submitted Successfully",
    `Your application for '${opp.title}' at ${opp.organizationName} has been submitted with a ${matchBreakdown.overallScore}% compatibility rating.`,
    "application_status",
    "/applications"
  );

  return newApp;
}

/**
 * Get applications for a student
 */
export async function getStudentApplications(
  studentId: string
): Promise<OpportunityApplicationEntity[]> {
  let apps = Array.from(globalMarketplaceStore._titanApplications!.values()).filter(
    (a) => a.studentId === studentId
  );

  if (apps.length === 0) {
    apps = Array.from(globalMarketplaceStore._titanApplications!.values());
  }

  return apps.map((a) => ({
    ...a,
    opportunity: globalMarketplaceStore._titanOpportunities!.get(a.opportunityId),
  }));
}

/**
 * Get candidate applications for recruiter's opportunities
 */
export async function getRecruiterApplications(
  recruiterId: string
): Promise<OpportunityApplicationEntity[]> {
  const recruiterOpps = Array.from(globalMarketplaceStore._titanOpportunities!.values()).filter(
    (o) => o.creatorId === recruiterId
  );
  const oppIds = new Set(recruiterOpps.map((o) => o.id));

  const apps = Array.from(globalMarketplaceStore._titanApplications!.values()).filter((a) =>
    oppIds.has(a.opportunityId)
  );

  return Promise.all(
    apps.map(async (a) => {
      const student = await getFullProfile(a.studentId);
      return {
        ...a,
        opportunity: globalMarketplaceStore._titanOpportunities!.get(a.opportunityId),
        studentName: student?.fullName,
        studentEmail: student?.email,
        studentInstitution: student?.studentProfile?.institution,
      };
    })
  );
}

/**
 * Update candidate application status (Recruiter Action)
 */
export async function updateApplicationStatus(
  applicationId: string,
  newStatus: ApplicationStatus,
  recruiterId: string
): Promise<OpportunityApplicationEntity | null> {
  const app = globalMarketplaceStore._titanApplications!.get(applicationId);
  if (!app) return null;

  const opp = globalMarketplaceStore._titanOpportunities!.get(app.opportunityId);
  if (!opp) return null;

  app.status = newStatus;
  app.updatedAt = new Date().toISOString();
  globalMarketplaceStore._titanApplications!.set(applicationId, app);

  // Dispatch real-time notification to the student!
  const statusTitles: Record<ApplicationStatus, string> = {
    applied: "Application Received",
    under_review: "Application Under Review",
    shortlisted: "🎉 Congratulations! You have been Shortlisted",
    interview: "📅 Interview Scheduled",
    selected: "🏆 Offer Extended! You are Selected",
    rejected: "Application Status Update",
  };

  createNotification(
    app.studentId,
    statusTitles[newStatus] || "Application Status Update",
    `Your application for '${opp.title}' at ${opp.organizationName} is now: ${newStatus.toUpperCase().replace("_", " ")}.`,
    "application_status",
    "/applications"
  );

  return app;
}

/**
 * Create a user notification
 */
export function createNotification(
  userId: string,
  title: string,
  message: string,
  type: UserNotificationEntity["type"] = "application_status",
  linkUrl: string = "/applications"
): UserNotificationEntity {
  const notif: UserNotificationEntity = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId,
    title,
    message,
    type,
    linkUrl,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  globalMarketplaceStore._titanNotifications!.set(notif.id, notif);
  return notif;
}

/**
 * Fetch notifications for user
 */
export async function getUserNotifications(userId: string): Promise<UserNotificationEntity[]> {
  const notifs = Array.from(globalMarketplaceStore._titanNotifications!.values())
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return notifs;
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(
  userId: string,
  notificationId: string
): Promise<boolean> {
  const notif = globalMarketplaceStore._titanNotifications!.get(notificationId);
  if (!notif || notif.userId !== userId) return false;

  notif.isRead = true;
  return true;
}
