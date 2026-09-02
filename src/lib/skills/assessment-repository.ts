import {
  AssessmentQuestion,
  AssessmentSession,
  TargetRoleBenchmark,
  SkillIntelligenceReport,
  StudentSkillEntity,
} from "@/lib/supabase/types";
import { computeAssessmentScores, calculateExplainableGaps } from "@/lib/skills/scoring-engine";
import { getUserById, DEMO_USERS } from "@/lib/auth/session";

export interface AssessmentSubject {
  id: string;
  title: string;
  tagline: string;
  category: string;
  iconName: string;
  gradient: string;
  accentColor: string;
  skillsCovered: string[];
  questionCount: number;
  estimatedMinutes: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Adaptive";
  recommendedRoles: string[];
}

export const ASSESSMENT_SUBJECTS: AssessmentSubject[] = [
  {
    id: "web_dev",
    title: "Full-Stack Web Development",
    tagline: "React, Next.js, TypeScript, Node.js, Web APIs & State Architecture",
    category: "Software Engineering",
    iconName: "Globe",
    gradient: "from-cyan-500/20 to-blue-600/20",
    accentColor: "text-cyan-400",
    skillsCovered: ["React / Next.js", "TypeScript", "Node.js REST APIs", "DOM & Web Performance", "State Management"],
    questionCount: 10,
    estimatedMinutes: 15,
    difficulty: "Adaptive",
    recommendedRoles: ["Full-Stack Engineer", "Frontend Architect", "React Developer"],
  },
  {
    id: "ai_ml",
    title: "AI & Machine Learning",
    tagline: "Python, PyTorch, LLMs, Neural Networks, Loss Functions & Fine-Tuning",
    category: "Artificial Intelligence",
    iconName: "BrainCircuit",
    gradient: "from-violet-500/20 to-purple-600/20",
    accentColor: "text-violet-400",
    skillsCovered: ["Python & PyTorch", "LLM Orchestration", "Neural Networks", "Embeddings & Vectors", "Model Optimization"],
    questionCount: 10,
    estimatedMinutes: 15,
    difficulty: "Adaptive",
    recommendedRoles: ["AI Platform Engineer", "ML Engineer", "Data Scientist"],
  },
  {
    id: "sql_db",
    title: "SQL & Database Engineering",
    tagline: "Relational Queries, Joins, Indexing, Query Optimization & ACID Transactions",
    category: "Data Systems",
    iconName: "Database",
    gradient: "from-emerald-500/20 to-teal-600/20",
    accentColor: "text-emerald-400",
    skillsCovered: ["SQL Queries & Joins", "Aggregations & HAVING", "Index Optimization", "ACID & Transactions", "Window Functions"],
    questionCount: 10,
    estimatedMinutes: 15,
    difficulty: "Adaptive",
    recommendedRoles: ["Database Engineer", "Data Analyst", "Backend Engineer"],
  },
  {
    id: "dsa_core",
    title: "Data Structures & Algorithms",
    tagline: "Arrays, Graphs, Trees, Dynamic Programming, Complexity & Problem Solving",
    category: "Computer Science Core",
    iconName: "Binary",
    gradient: "from-amber-500/20 to-orange-600/20",
    accentColor: "text-amber-400",
    skillsCovered: ["Graph Traversal (BFS/DFS)", "Big-O Analysis", "Dynamic Programming", "Trees & Heaps", "Hash Tables"],
    questionCount: 10,
    estimatedMinutes: 15,
    difficulty: "Adaptive",
    recommendedRoles: ["Software Engineer", "Systems Engineer", "Product Engineer"],
  },
  {
    id: "cloud_devops",
    title: "Cloud, DevOps & Distributed Systems",
    tagline: "Docker, Kubernetes, CI/CD, Microservices, Consensus & Observability",
    category: "Cloud Infrastructure",
    iconName: "Server",
    gradient: "from-sky-500/20 to-indigo-600/20",
    accentColor: "text-sky-400",
    skillsCovered: ["Docker & Containers", "Kubernetes Pod Orchestration", "CI/CD Pipelines", "Raft Consensus", "Microservices"],
    questionCount: 10,
    estimatedMinutes: 15,
    difficulty: "Adaptive",
    recommendedRoles: ["DevOps Engineer", "Cloud Solutions Architect", "SRE"],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity & Web Defense",
    tagline: "OWASP Top 10, JWT Security, Cryptography, Network Hardening & Zero Trust",
    category: "Security",
    iconName: "ShieldAlert",
    gradient: "from-rose-500/20 to-pink-600/20",
    accentColor: "text-rose-400",
    skillsCovered: ["OWASP Top 10", "JWT & Auth Flaws", "SQL Injection / XSS", "Cryptography & TLS", "Zero Trust Access"],
    questionCount: 10,
    estimatedMinutes: 15,
    difficulty: "Adaptive",
    recommendedRoles: ["Security Engineer", "AppSec Specialist", "SOC Analyst"],
  },
  {
    id: "data_analytics",
    title: "Data Science & Analytics",
    tagline: "Python Pandas, NumPy, Exploratory Analysis, Statistics & Data Modeling",
    category: "Data Science",
    iconName: "BarChart3",
    gradient: "from-fuchsia-500/20 to-rose-600/20",
    accentColor: "text-fuchsia-400",
    skillsCovered: ["Pandas & DataFrames", "Statistical Distributions", "Feature Engineering", "Data Cleaning", "Data Visualization"],
    questionCount: 10,
    estimatedMinutes: 15,
    difficulty: "Adaptive",
    recommendedRoles: ["Data Scientist", "Business Intelligence Analyst", "Analytics Engineer"],
  },
  {
    id: "mobile_app",
    title: "Mobile App Engineering (iOS & Android)",
    tagline: "React Native, Flutter, Kotlin, Swift, Offline Caching & Mobile Architecture",
    category: "Mobile Systems",
    iconName: "Smartphone",
    gradient: "from-blue-500/20 to-cyan-600/20",
    accentColor: "text-blue-400",
    skillsCovered: ["React Native & Flutter", "Kotlin / Swift", "Mobile State Management", "Offline SQLite Sync", "App Performance"],
    questionCount: 10,
    estimatedMinutes: 15,
    difficulty: "Adaptive",
    recommendedRoles: ["Mobile Engineer", "React Native Developer", "iOS/Android Architect"],
  },
  {
    id: "blockchain_web3",
    title: "Blockchain & Smart Contract Security",
    tagline: "Solidity, Ethereum EVM, Smart Contract Auditing, Cryptography & Gas Optimization",
    category: "Web3 & Decentralized Systems",
    iconName: "Coins",
    gradient: "from-amber-500/20 to-yellow-600/20",
    accentColor: "text-amber-400",
    skillsCovered: ["Solidity & Smart Contracts", "EVM Gas Optimization", "Reentrancy & Security Audits", "Cryptographic Signatures", "DeFi Protocols"],
    questionCount: 10,
    estimatedMinutes: 15,
    difficulty: "Adaptive",
    recommendedRoles: ["Smart Contract Engineer", "Web3 Developer", "Blockchain Security Auditor"],
  },
  {
    id: "system_design",
    title: "System Design & High-Scalability Architecture",
    tagline: "Microservices, Redis Caching, Kafka Event Streaming, Sharding & CAP Theorem",
    category: "Distributed Architecture",
    iconName: "Cpu",
    gradient: "from-indigo-500/20 to-violet-600/20",
    accentColor: "text-indigo-400",
    skillsCovered: ["Microservices Design", "Distributed Caching (Redis)", "Event Streaming (Kafka)", "Database Sharding", "CAP & PACELC Theorem"],
    questionCount: 10,
    estimatedMinutes: 15,
    difficulty: "Adaptive",
    recommendedRoles: ["Principal Architect", "Senior Backend Engineer", "Distributed Systems Specialist"],
  },
  {
    id: "genai_llm",
    title: "Generative AI & LLM Systems Engineering",
    tagline: "LangChain, LlamaIndex, RAG Architectures, Vector DBs, Prompt Optimization & Agents",
    category: "Generative AI",
    iconName: "Bot",
    gradient: "from-emerald-500/20 to-green-600/20",
    accentColor: "text-emerald-400",
    skillsCovered: ["RAG Retrieval Architectures", "Vector DBs (Pinecone/pgvector)", "Prompt Engineering & Guardrails", "Autonomous AI Agents", "LLM Fine-Tuning"],
    questionCount: 10,
    estimatedMinutes: 15,
    difficulty: "Adaptive",
    recommendedRoles: ["GenAI Engineer", "LLM Application Architect", "AI Solutions Engineer"],
  },
  {
    id: "embedded_iot",
    title: "Embedded Systems, IoT & Edge Computing",
    tagline: "Embedded C/C++, ESP32/ARM, MQTT Protocols, FreeRTOS, Sensors & Edge AI",
    category: "Hardware & Edge Systems",
    iconName: "CircuitBoard",
    gradient: "from-teal-500/20 to-cyan-600/20",
    accentColor: "text-teal-400",
    skillsCovered: ["Embedded C / C++", "FreeRTOS & Concurrency", "MQTT / CoAP Protocols", "I2C / SPI Sensor Buses", "Edge AI Inference"],
    questionCount: 10,
    estimatedMinutes: 15,
    difficulty: "Adaptive",
    recommendedRoles: ["Embedded Firmware Engineer", "IoT Systems Architect", "Edge Device Developer"],
  },
  {
    id: "qa_automation",
    title: "Software Testing & QA Automation Engineering",
    tagline: "Playwright, Cypress, Selenium, CI/CD Test Suites, API Testing & Load Testing",
    category: "Quality Assurance",
    iconName: "CheckSquare",
    gradient: "from-lime-500/20 to-emerald-600/20",
    accentColor: "text-lime-400",
    skillsCovered: ["Playwright & Cypress E2E", "API Testing (Postman)", "CI/CD Automated Test Matrix", "Load Testing (k6/JMeter)", "Unit Testing (Jest)"],
    questionCount: 10,
    estimatedMinutes: 15,
    difficulty: "Adaptive",
    recommendedRoles: ["QA Automation Engineer", "SDET", "Performance Test Architect"],
  },
  {
    id: "game_dev",
    title: "Game Development & Real-Time 3D Graphics",
    tagline: "Unity, Unreal Engine, C#, HLSL Shaders, Physics Engines & 3D Math",
    category: "Interactive Graphics",
    iconName: "Gamepad2",
    gradient: "from-purple-500/20 to-pink-600/20",
    accentColor: "text-purple-400",
    skillsCovered: ["Unity / Unreal Engine", "C# & C++ Scripting", "3D Vectors & Quaternions", "HLSL / GLSL Shaders", "Physics Optimization"],
    questionCount: 10,
    estimatedMinutes: 15,
    difficulty: "Adaptive",
    recommendedRoles: ["Game Developer", "Graphics Programmer", "Unity/Unreal Technical Artist"],
  },
  {
    id: "sre_observability",
    title: "Site Reliability Engineering (SRE) & Observability",
    tagline: "Prometheus, Grafana, OpenTelemetry, Chaos Engineering, Incident Response & SLOs",
    category: "Reliability & Operations",
    iconName: "Activity",
    gradient: "from-orange-500/20 to-amber-600/20",
    accentColor: "text-orange-400",
    skillsCovered: ["SLIs, SLOs & Error Budgets", "Prometheus & Grafana Metrics", "Distributed Tracing (OTel)", "Chaos Engineering & Failover", "Incident Runbooks"],
    questionCount: 10,
    estimatedMinutes: 15,
    difficulty: "Adaptive",
    recommendedRoles: ["SRE", "Observability Engineer", "Infrastructure Operations Lead"],
  },
  {
    id: "data_engineering",
    title: "Big Data & Data Pipeline Engineering",
    tagline: "Apache Spark, Kafka, Airflow ETL, Snowflake, Delta Lake & dbt Modeling",
    category: "Data Platforms",
    iconName: "Workflow",
    gradient: "from-sky-500/20 to-blue-600/20",
    accentColor: "text-sky-400",
    skillsCovered: ["Apache Spark Compute", "Apache Airflow DAGs", "Data Lakes & Delta Lake", "Kafka Stream Processing", "Snowflake & dbt Modeling"],
    questionCount: 10,
    estimatedMinutes: 15,
    difficulty: "Adaptive",
    recommendedRoles: ["Data Engineer", "Data Platform Architect", "Big Data Specialist"],
  },
];

export const DEFAULT_TARGET_ROLES: TargetRoleBenchmark[] = [
  {
    id: "ai_systems_engineer",
    title: "AI Systems & LLM Platform Engineer",
    description: "Designs high-throughput distributed neural network architectures, TensorRT optimization pipelines, and scalable LLM orchestration.",
    requiredReadinessScore: 85,
    requiredSkills: [
      { skillName: "Python & PyTorch", category: "AI & Machine Learning", requiredScore: 90, weight: 1.5 },
      { skillName: "Distributed Systems", category: "Cloud & DevOps", requiredScore: 85, weight: 1.3 },
      { skillName: "SQL & Data Engineering", category: "Data Systems", requiredScore: 85, weight: 1.2 },
      { skillName: "React / Next.js", category: "Web Systems", requiredScore: 75, weight: 0.8 },
      { skillName: "Algorithms & Complexity", category: "Core Aptitude", requiredScore: 85, weight: 1.2 },
      { skillName: "System Architecture", category: "Technical Architecture", requiredScore: 90, weight: 1.4 },
      { skillName: "Problem Solving", category: "Cognitive Aptitude", requiredScore: 85, weight: 1.0 },
      { skillName: "Team Collaboration", category: "Soft Skills", requiredScore: 80, weight: 0.9 },
    ],
  },
  {
    id: "full_stack_architect",
    title: "Full-Stack Cloud Architect",
    description: "Architects end-to-end mission-critical SaaS applications, microservices, and reactive frontend experiences.",
    requiredReadinessScore: 82,
    requiredSkills: [
      { skillName: "React / Next.js", category: "Web Systems", requiredScore: 95, weight: 1.5 },
      { skillName: "TypeScript", category: "Web Systems", requiredScore: 90, weight: 1.4 },
      { skillName: "SQL & Data Engineering", category: "Data Systems", requiredScore: 88, weight: 1.3 },
      { skillName: "Distributed Systems", category: "Cloud & DevOps", requiredScore: 85, weight: 1.2 },
      { skillName: "System Architecture", category: "Technical Architecture", requiredScore: 88, weight: 1.3 },
      { skillName: "Algorithms & Complexity", category: "Core Aptitude", requiredScore: 80, weight: 1.0 },
      { skillName: "Team Collaboration", category: "Soft Skills", requiredScore: 85, weight: 1.0 },
    ],
  },
  {
    id: "data_analyst_engineer",
    title: "Data Analyst & Business Intelligence Engineer",
    description: "Specializes in relational database queries, data modeling, SQL analytics, and Power BI dashboards.",
    requiredReadinessScore: 80,
    requiredSkills: [
      { skillName: "SQL & Data Engineering", category: "Data Systems", requiredScore: 92, weight: 1.6 },
      { skillName: "Python & Data Structures", category: "Data Science", requiredScore: 85, weight: 1.3 },
      { skillName: "Statistics & Aptitude", category: "Core Aptitude", requiredScore: 85, weight: 1.2 },
      { skillName: "Problem Solving", category: "Cognitive Aptitude", requiredScore: 80, weight: 1.0 },
      { skillName: "Communication", category: "Soft Skills", requiredScore: 80, weight: 0.9 },
    ],
  },
];

export const DEFAULT_QUESTIONS: AssessmentQuestion[] = [
  // --------------------------------------------------------------------------
  // 1. FULL-STACK WEB DEVELOPMENT (web_dev)
  // --------------------------------------------------------------------------
  {
    id: "q-web-01",
    category: "technical",
    skillTag: "React / Next.js",
    subTopic: "React Hooks & State",
    difficulty: "medium",
    questionText: "In React, what is the key difference between `useEffect` and `useLayoutEffect` execution timing?",
    questionType: "single_choice",
    displayOrder: 1,
    explanation: "`useLayoutEffect` runs synchronously immediately after DOM mutations before the browser repaints the screen, preventing visual layout flickering.",
    options: [
      { id: "opt-w1a", text: "useLayoutEffect fires synchronously after DOM mutation before browser paint; useEffect fires asynchronously after paint.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-w1b", text: "useEffect runs on the server; useLayoutEffect runs on the client.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-w1c", text: "useLayoutEffect can only be used with Class components.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-w1d", text: "They are completely identical aliases in modern React 18+.", scoreWeight: 0.0, isCorrect: false },
    ],
  },
  {
    id: "q-web-02",
    category: "technical",
    skillTag: "TypeScript",
    subTopic: "Type Narrowing & Generics",
    difficulty: "medium",
    questionText: "Which TypeScript utility type constructs a type with all properties of `T` set to optional except for specified keys `K`?",
    questionType: "single_choice",
    displayOrder: 2,
    explanation: "Combining `Partial<T> & Pick<T, K>` or `Omit<Partial<T>, K> & Required<Pick<T, K>>` preserves required keys while making others optional.",
    options: [
      { id: "opt-w2a", text: "Partial<T> & Pick<T, K>", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-w2b", text: "Extract<T, K>", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-w2c", text: "Record<K, any>", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-w2d", text: "Exclude<T, K>", scoreWeight: 0.0, isCorrect: false },
    ],
  },
  {
    id: "q-web-03",
    category: "technical",
    skillTag: "React / Next.js",
    subTopic: "Next.js App Router Architecture",
    difficulty: "hard",
    questionText: "In Next.js App Router (React Server Components), what happens when a Server Component imports and renders a Client Component?",
    questionType: "single_choice",
    displayOrder: 3,
    explanation: "Server Components stream serialized RSC payload data to the client, where the Client Component hydration boundary initializes interactive state.",
    options: [
      { id: "opt-w3a", text: "The Server Component passes serialized props over the wire across the network boundary to hydrate the Client Component.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-w3b", text: "The entire Server Component is converted to client-side bundle execution.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-w3c", text: "Next.js throws a build-time compiler error.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-w3d", text: "Client Components cannot be imported into Server Components under any circumstances.", scoreWeight: 0.0, isCorrect: false },
    ],
  },
  {
    id: "q-web-04",
    category: "technical",
    skillTag: "Node.js REST APIs",
    subTopic: "Event Loop & Non-Blocking I/O",
    difficulty: "medium",
    questionText: "In Node.js, what executes in the `process.nextTick` queue compared to `setImmediate`?",
    questionType: "single_choice",
    displayOrder: 4,
    explanation: "`process.nextTick` executes immediately after the current operation finishes before the event loop advances to the next phase; `setImmediate` fires in the Check phase of the event loop.",
    options: [
      { id: "opt-w4a", text: "process.nextTick fires before the event loop advances to the next phase; setImmediate fires in the Check phase.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-w4b", text: "setImmediate has higher microtask priority than process.nextTick.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-w4c", text: "Both execute in the Timers phase with setTimeout(fn, 0).", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-w4d", text: "process.nextTick spawns an OS worker thread.", scoreWeight: 0.0, isCorrect: false },
    ],
  },

  // --------------------------------------------------------------------------
  // 2. AI & MACHINE LEARNING (ai_ml)
  // --------------------------------------------------------------------------
  {
    id: "q-ai-01",
    category: "technical",
    skillTag: "Python & PyTorch",
    subTopic: "Gradient Computation & Autograd",
    difficulty: "medium",
    questionText: "Why is `optimizer.zero_grad()` called before `loss.backward()` in a typical PyTorch training loop?",
    questionType: "single_choice",
    displayOrder: 5,
    explanation: "PyTorch accumulates gradients on `.backward()` calls by default (for multi-batch accumulation); calling `zero_grad()` clears old gradients before the new backward pass.",
    options: [
      { id: "opt-ai1a", text: "PyTorch accumulates gradients on tensors by default; zero_grad() prevents compounding gradients across iterations.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-ai1b", text: "It resets neural weights to random Gaussian distribution.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-ai1c", text: "It allocates GPU VRAM memory buffers for tensor variables.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-ai1d", text: "It stops model inference execution.", scoreWeight: 0.0, isCorrect: false },
    ],
  },
  {
    id: "q-ai-02",
    category: "technical",
    skillTag: "LLM Orchestration",
    subTopic: "Attention Mechanism & Transformers",
    difficulty: "hard",
    questionText: "What is the primary computational bottleneck of standard Multi-Head Self-Attention in Transformers with sequence length `N`?",
    questionType: "single_choice",
    displayOrder: 6,
    explanation: "Computing the full $(Q \times K^T)$ attention matrix requires $O(N^2)$ time and memory complexity with respect to input token length $N$.",
    options: [
      { id: "opt-ai2a", text: "Quadratic O(N²) memory and compute complexity in sequence length N due to full token-to-token attention matrices.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-ai2b", text: "Linear O(N) memory scaling bottlenecks.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-ai2c", text: "Inability to run on parallel GPU threads.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-ai2d", text: "Loss of backpropagation gradients during token projection.", scoreWeight: 0.0, isCorrect: false },
    ],
  },
  {
    id: "q-ai-03",
    category: "technical",
    skillTag: "Embeddings & Vectors",
    subTopic: "Cosine Similarity vs Dot Product",
    difficulty: "medium",
    questionText: "When comparing normalized unit embedding vectors (L2 norm = 1.0), how does Dot Product relate to Cosine Similarity?",
    questionType: "single_choice",
    displayOrder: 7,
    explanation: "For L2-normalized vectors ($\|u\| = 1, \|v\| = 1$), cosine similarity equals the dot product ($u \cdot v$), saving runtime division overhead in vector search.",
    options: [
      { id: "opt-ai3a", text: "Dot product is mathematically identical to cosine similarity when vectors are L2-normalized.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-ai3b", text: "Dot product is always perpendicular to cosine distance.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-ai3c", text: "Dot product cannot be used on dense embeddings.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-ai3d", text: "Cosine similarity produces negative values while dot product is strictly positive.", scoreWeight: 0.0, isCorrect: false },
    ],
  },

  // --------------------------------------------------------------------------
  // 3. SQL & DATABASE SYSTEMS (sql_db)
  // --------------------------------------------------------------------------
  {
    id: "q-sql-01",
    category: "technical",
    skillTag: "SQL & Relational Databases",
    subTopic: "Basics",
    difficulty: "easy",
    questionText: "Which SQL clause is used to eliminate duplicate rows from a query result set?",
    questionType: "single_choice",
    displayOrder: 8,
    explanation: "The `DISTINCT` keyword following `SELECT` removes duplicate records from the returned dataset.",
    options: [
      { id: "opt-s1a", text: "SELECT UNIQUE col FROM table;", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-s1b", text: "SELECT DISTINCT col FROM table;", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-s1c", text: "SELECT DIFFERENT col FROM table;", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-s1d", text: "SELECT DEDUPLICATE col FROM table;", scoreWeight: 0.0, isCorrect: false },
    ],
  },
  {
    id: "q-sql-02",
    category: "technical",
    skillTag: "SQL & Relational Databases",
    subTopic: "Filtering",
    difficulty: "easy",
    questionText: "When filtering records in SQL, which operator allows you to specify multiple discrete candidate values in a `WHERE` predicate?",
    questionType: "single_choice",
    displayOrder: 9,
    explanation: "The `IN` operator allows checking if a column value matches any value within a specified list or subquery.",
    options: [
      { id: "opt-s2a", text: "WHERE status IN ('active', 'pending', 'verified')", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-s2b", text: "WHERE status WITHIN ('active', 'pending')", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-s2c", text: "WHERE status CONTAINS ('active')", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-s2d", text: "WHERE status MATCH ('active')", scoreWeight: 0.0, isCorrect: false },
    ],
  },
  {
    id: "q-sql-03",
    category: "technical",
    skillTag: "SQL & Relational Databases",
    subTopic: "Aggregation",
    difficulty: "medium",
    questionText: "What is the critical semantic difference between `WHERE` and `HAVING` clauses in SQL?",
    questionType: "single_choice",
    displayOrder: 10,
    explanation: "`WHERE` filters individual rows before grouping occurs, while `HAVING` filters aggregated group records after `GROUP BY` calculation.",
    options: [
      { id: "opt-s3a", text: "WHERE filters rows before aggregation; HAVING filters aggregated group metrics post-GROUP BY.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-s3b", text: "HAVING filters rows before aggregation; WHERE filters groups.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-s3c", text: "WHERE and HAVING are 100% interchangeable synonyms in standard ANSI SQL.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-s3d", text: "HAVING can only be used with subqueries.", scoreWeight: 0.0, isCorrect: false },
    ],
  },
  {
    id: "q-sql-05",
    category: "technical",
    skillTag: "SQL & Relational Databases",
    subTopic: "JOINs",
    difficulty: "medium",
    questionText: "You have a `Customers` table (100 rows) and an `Orders` table (50 rows). A `LEFT JOIN` on `Customers.id = Orders.customer_id` will return:",
    questionType: "single_choice",
    displayOrder: 11,
    explanation: "A `LEFT JOIN` preserves all rows from the left table (`Customers`), populating matching order fields or `NULL` if a customer has zero orders.",
    options: [
      { id: "opt-s5a", text: "At least 100 rows (all customers preserved, with NULLs for customers without orders).", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-s5b", text: "Exactly 50 rows (only customers with active orders).", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-s5c", text: "Exactly 5000 rows (Cartesian product).", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-s5d", text: "Only customers who have placed more than 2 orders.", scoreWeight: 0.0, isCorrect: false },
    ],
  },
  {
    id: "q-sql-07",
    category: "technical",
    skillTag: "SQL & Relational Databases",
    subTopic: "Advanced SQL & Window Functions",
    difficulty: "hard",
    questionText: "What does `DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC)` compute in SQL?",
    questionType: "single_choice",
    displayOrder: 12,
    explanation: "`DENSE_RANK()` assigns ranks within each department partition by salary without skipping rank numbers when ties occur.",
    options: [
      { id: "opt-s7a", text: "Consecutive ranking of salaries within each department without skipping rank numbers on ties (e.g. 1, 2, 2, 3).", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-s7b", text: "Skipping ranks on ties (e.g. 1, 2, 2, 4).", scoreWeight: 0.2, isCorrect: false },
      { id: "opt-s7c", text: "The cumulative running total salary per department.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-s7d", text: "A random distribution hash for sharding.", scoreWeight: 0.0, isCorrect: false },
    ],
  },

  // --------------------------------------------------------------------------
  // 4. DATA STRUCTURES & ALGORITHMS (dsa_core)
  // --------------------------------------------------------------------------
  {
    id: "q-dsa-01",
    category: "aptitude",
    skillTag: "Algorithms & Complexity",
    subTopic: "Graph Theory",
    difficulty: "medium",
    questionText: "What is the time complexity of Breadth-First Search (BFS) on an unweighted graph represented as an Adjacency List with `V` vertices and `E` edges?",
    questionType: "single_choice",
    displayOrder: 13,
    explanation: "BFS visits each vertex once and traverses each edge once in an adjacency list representation, resulting in O(V + E) time.",
    options: [
      { id: "opt-a1a", text: "O(V + E)", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-a1b", text: "O(V * E)", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-a1c", text: "O(V²)", scoreWeight: 0.2, isCorrect: false },
      { id: "opt-a1d", text: "O(log V)", scoreWeight: 0.0, isCorrect: false },
    ],
  },
  {
    id: "q-dsa-02",
    category: "aptitude",
    skillTag: "Algorithms & Complexity",
    subTopic: "Dynamic Programming",
    difficulty: "hard",
    questionText: "What two essential properties must a computational problem exhibit to be solvable optimally via Dynamic Programming?",
    questionType: "single_choice",
    displayOrder: 14,
    explanation: "Dynamic Programming requires Optimal Substructure (optimal solution contains optimal solutions to subproblems) and Overlapping Subproblems (subproblems recur repeatedly).",
    options: [
      { id: "opt-dsa2a", text: "Optimal Substructure and Overlapping Subproblems.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-dsa2b", text: "Greedy Choice Property and Divide & Conquer partitioning.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-dsa2c", text: "Amortized Constant Time and In-place Memory allocation.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-dsa2d", text: "Strict Monotonicity and Non-cyclic Recursion.", scoreWeight: 0.0, isCorrect: false },
    ],
  },

  // --------------------------------------------------------------------------
  // 5. CLOUD, DEVOPS & DISTRIBUTED SYSTEMS (cloud_devops)
  // --------------------------------------------------------------------------
  {
    id: "q-dist-01",
    category: "technical",
    skillTag: "Distributed Systems",
    subTopic: "Consensus & Raft",
    difficulty: "hard",
    questionText: "In the Raft consensus algorithm, how does a cluster guarantee safety and prevent split-brain leader commits during a network partition?",
    questionType: "single_choice",
    displayOrder: 15,
    explanation: "A Raft leader must receive write acknowledgments from a strict majority quorum (`N/2 + 1`) of active nodes before committing a log entry.",
    options: [
      { id: "opt-d1a", text: "Writes require majority quorum confirmation (N/2 + 1 nodes); a minority partition cannot commit log entries.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-d1b", text: "Any isolated node can commit writes locally and reconcile later via eventual consistency.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-d1c", text: "Raft requires 100% unanimous agreement from all nodes before acknowledging any write.", scoreWeight: 0.1, isCorrect: false },
      { id: "opt-d1d", text: "Leaders are elected strictly using physical hardware timestamp comparisons.", scoreWeight: 0.0, isCorrect: false },
    ],
  },
  {
    id: "q-cloud-02",
    category: "technical",
    skillTag: "Docker & Kubernetes",
    subTopic: "Container Lifecycle",
    difficulty: "medium",
    questionText: "What is the primary difference between a Kubernetes `Deployment` and a `StatefulSet`?",
    questionType: "single_choice",
    displayOrder: 16,
    explanation: "`StatefulSet` maintains persistent unique network identifiers and dedicated PersistentVolumes for each replica ordinal (pod-0, pod-1), whereas `Deployment` pods are interchangeable and stateless.",
    options: [
      { id: "opt-c2a", text: "StatefulSets provide stable, persistent network identities and dedicated storage ordinals; Deployments manage stateless interchangeable pods.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-c2b", text: "Deployments run on Linux only; StatefulSets run on Windows nodes.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-c2c", text: "StatefulSets do not support rolling updates.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-c2d", text: "Deployments bypass cluster ingress controllers.", scoreWeight: 0.0, isCorrect: false },
    ],
  },

  // --------------------------------------------------------------------------
  // 6. CYBERSECURITY & WEB DEFENSE (cybersecurity)
  // --------------------------------------------------------------------------
  {
    id: "q-sec-01",
    category: "technical",
    skillTag: "OWASP & Web Security",
    subTopic: "Cross-Site Scripting (XSS)",
    difficulty: "medium",
    questionText: "How does setting the `HttpOnly` flag on authentication session cookies mitigate client-side attacks?",
    questionType: "single_choice",
    displayOrder: 17,
    explanation: "`HttpOnly` instructs the browser that the cookie cannot be accessed via client-side JavaScript (`document.cookie`), preventing theft via Cross-Site Scripting (XSS).",
    options: [
      { id: "opt-sec1a", text: "Prevents client-side scripts from reading document.cookie, protecting session tokens from XSS theft.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-sec1b", text: "Encrypts all SQL database queries sent over HTTP.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-sec1c", text: "Blocks Cross-Origin Resource Sharing (CORS) preflight requests.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-sec1d", text: "Forces all incoming requests to use HTTP/2 multiplexing.", scoreWeight: 0.0, isCorrect: false },
    ],
  },
  {
    id: "q-sec-02",
    category: "technical",
    skillTag: "Authentication & Cryptography",
    subTopic: "JWT Signature Verification",
    difficulty: "hard",
    questionText: "Why is verifying the cryptographic signature of a JSON Web Token (JWT) on every incoming API request essential?",
    questionType: "single_choice",
    displayOrder: 18,
    explanation: "Verifying the JWT signature ensures that the payload (user ID, roles, expiry) has not been tampered with or forged by an unauthorized party.",
    options: [
      { id: "opt-sec2a", text: "It guarantees that the claims in the token payload have not been forged or tampered with in transit.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-sec2b", text: "It automatically decrypts hidden passwords inside the header.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-sec2c", text: "It prevents database deadlocks during high-concurrency requests.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-sec2d", text: "It compresses the HTTP payload size by 50%.", scoreWeight: 0.0, isCorrect: false },
    ],
  },

  // --------------------------------------------------------------------------
  // 7. DATA SCIENCE & ANALYTICS (data_analytics)
  // --------------------------------------------------------------------------
  {
    id: "q-ds-01",
    category: "technical",
    skillTag: "Python & Data Science",
    subTopic: "Pandas & DataFrames",
    difficulty: "medium",
    questionText: "In Python Pandas, what is the key performance difference between `df.apply(fn, axis=1)` and vectorized column operations (e.g. `df['a'] + df['b']`)?",
    questionType: "single_choice",
    displayOrder: 19,
    explanation: "`apply(axis=1)` iterates row-by-row in pure Python space with high overhead, whereas vectorized operations run compiled C/SIMD instructions on contiguous memory.",
    options: [
      { id: "opt-ds1a", text: "Vectorized operations execute compiled C/NumPy loops in contiguous memory; apply(axis=1) iterates row-by-row in Python with massive overhead.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-ds1b", text: "apply(axis=1) is multi-threaded while vectorization is single-threaded.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-ds1c", text: "They have identical performance characteristics.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-ds1d", text: "Vectorized operations cannot operate on numeric columns.", scoreWeight: 0.0, isCorrect: false },
    ],
  },
  // --------------------------------------------------------------------------
  // 8. MOBILE APP ENGINEERING (mobile_app)
  // --------------------------------------------------------------------------
  {
    id: "q-mob-01",
    category: "technical",
    skillTag: "Mobile Engineering",
    subTopic: "React Native / Flutter State & Bridge",
    difficulty: "medium",
    questionText: "In React Native's New Architecture (Fabric & TurboModules), how does JavaScript communicate with native UI threads compared to the legacy JSON bridge?",
    questionType: "single_choice",
    displayOrder: 20,
    explanation: "JavaScript Interface (JSI) enables C++ host objects to be directly invoked synchronously by JS runtime without serializing JSON payloads across an asynchronous bridge.",
    options: [
      { id: "opt-mob1a", text: "JSI allows JavaScript to hold direct C++ references to native methods without async JSON serialization.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-mob1b", text: "It uses WebSockets to transmit binary frames over localhost port 8081.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-mob1c", text: "It compiles all JavaScript directly into ARM64 assembly at compile-time.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-mob1d", text: "There is no difference; it is solely a rebranding of the old bridge.", scoreWeight: 0.0, isCorrect: false },
    ],
  },
  {
    id: "q-mob-02",
    category: "technical",
    skillTag: "Mobile Engineering",
    subTopic: "Offline SQLite & State Sync",
    difficulty: "hard",
    questionText: "When building offline-first mobile sync with SQLite/WatermelonDB, what is the best strategy to resolve concurrent optimistic update conflicts?",
    questionType: "single_choice",
    displayOrder: 21,
    explanation: "Conflict-free Replicated Data Types (CRDTs) or Last-Write-Wins with monotonic Lamport timestamps and version vectors reliably reconcile distributed edits without data loss.",
    options: [
      { id: "opt-mob2a", text: "Vector clocks / CRDTs or monotonic version timestamps with field-level delta merging.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-mob2b", text: "Always overwriting local SQLite database with raw server snapshot upon connection.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-mob2c", text: "Blocking the UI and preventing user input until Wi-Fi reconnects.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-mob2d", text: "Deleting corrupted client rows and prompting user to re-type data.", scoreWeight: 0.0, isCorrect: false },
    ],
  },

  // --------------------------------------------------------------------------
  // 9. BLOCKCHAIN & SMART CONTRACT SECURITY (blockchain_web3)
  // --------------------------------------------------------------------------
  {
    id: "q-bc-01",
    category: "technical",
    skillTag: "Blockchain & Web3",
    subTopic: "Smart Contract Reentrancy Vulnerability",
    difficulty: "hard",
    questionText: "How does the Checks-Effects-Interactions pattern prevent Reentrancy attacks in Ethereum Solidity smart contracts?",
    questionType: "single_choice",
    displayOrder: 22,
    explanation: "Updating internal balances (Effects) before making external ether transfers (Interactions) prevents a malicious receiver contract's fallback from draining funds recursively.",
    options: [
      { id: "opt-bc1a", text: "It mutates internal state/balances before transferring funds or calling external contracts.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-bc1b", text: "It encrypts the contract bytecode with AES-256 before EVM execution.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-bc1c", text: "It restricts gas limits to 21,000 for all contract function calls.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-bc1d", text: "It forces transactions to execute on Layer-2 Polygon rollups only.", scoreWeight: 0.0, isCorrect: false },
    ],
  },

  // --------------------------------------------------------------------------
  // 10. SYSTEM DESIGN & HIGH-SCALABILITY ARCHITECTURE (system_design)
  // --------------------------------------------------------------------------
  {
    id: "q-sd-01",
    category: "technical",
    skillTag: "System Design",
    subTopic: "Distributed Caching & Cache-Aside Invalidation",
    difficulty: "hard",
    questionText: "Under the Cache-Aside pattern with Redis, what prevents race conditions between concurrent DB reads and DB updates?",
    questionType: "single_choice",
    displayOrder: 23,
    explanation: "Invalidating (deleting) the Redis cache key upon database update—rather than updating cache in-place—ensures fresh data is lazily re-populated without stale overwrites.",
    options: [
      { id: "opt-sd1a", text: "Deleting the cache key upon DB write rather than updating cache value directly, combined with short TTLs.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-sd1b", text: "Disabling database indexes on foreign keys.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-sd1c", text: "Using synchronous HTTP blocking locks on the client browser.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-sd1d", text: "Routing all read traffic directly to primary SQL leader node only.", scoreWeight: 0.0, isCorrect: false },
    ],
  },

  // --------------------------------------------------------------------------
  // 11. GENERATIVE AI & LLM SYSTEMS ENGINEERING (genai_llm)
  // --------------------------------------------------------------------------
  {
    id: "q-gen-01",
    category: "technical",
    skillTag: "Generative AI & LLM",
    subTopic: "RAG Chunking & Vector Cosine Similarity",
    difficulty: "medium",
    questionText: "In production RAG (Retrieval-Augmented Generation), why is semantic chunking with overlap superior to fixed character chunking?",
    questionType: "single_choice",
    displayOrder: 24,
    explanation: "Semantic chunking preserves complete conceptual boundaries and sentences while overlap ensures context is not truncated across embedding token windows.",
    options: [
      { id: "opt-gen1a", text: "It preserves coherent syntactic context and prevents splitting mid-sentence or mid-thought across vector embeddings.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-gen1b", text: "It decreases embedding storage costs in Pinecone by exactly 90%.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-gen1c", text: "It removes the requirement for a retriever or re-ranking model.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-gen1d", text: "Fixed character chunking is not supported by OpenAI text-embedding-3.", scoreWeight: 0.0, isCorrect: false },
    ],
  },

  // --------------------------------------------------------------------------
  // 12. EMBEDDED SYSTEMS & IOT (embedded_iot)
  // --------------------------------------------------------------------------
  {
    id: "q-emb-01",
    category: "technical",
    skillTag: "Embedded Systems & IoT",
    subTopic: "Interrupt Service Routines (ISR) & FreeRTOS",
    difficulty: "hard",
    questionText: "Why must dynamic memory allocation (`malloc`/`free`) and blocking delays NEVER be used inside an Interrupt Service Routine (ISR)?",
    questionType: "single_choice",
    displayOrder: 25,
    explanation: "ISRs execute at elevated hardware priority; blocking or non-deterministic heap operations cause deadlocks, priority inversions, and system lockups.",
    options: [
      { id: "opt-emb1a", text: "Heap allocation is non-deterministic and can cause deadlocks or priority inversions in critical ISR context.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-emb1b", text: "ISRs only run on 64-bit multi-core processors.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-emb1c", text: "Microcontroller flash memory is strictly read-only at runtime.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-emb1d", text: "C++ compilers automatically delete all ISR code containing heap calls.", scoreWeight: 0.0, isCorrect: false },
    ],
  },

  // --------------------------------------------------------------------------
  // 13. SOFTWARE TESTING & QA AUTOMATION (qa_automation)
  // --------------------------------------------------------------------------
  {
    id: "q-qa-01",
    category: "technical",
    skillTag: "QA Automation",
    subTopic: "Playwright / Cypress Flaky Test Mitigation",
    difficulty: "medium",
    questionText: "In Playwright and modern E2E automation, what is the best practice to prevent flaky tests caused by asynchronous network calls and DOM animations?",
    questionType: "single_choice",
    displayOrder: 26,
    explanation: "Auto-waiting locators and explicit API response assertions (`waitForResponse` / `expect(locator).toBeVisible()`) eliminate arbitrary hardcoded sleep timeouts.",
    options: [
      { id: "opt-qa1a", text: "Using web-first assertions and auto-waiting locators instead of hardcoded thread sleeps (`sleep(5000)`).", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-qa1b", text: "Increasing browser viewport zoom to 200%.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-qa1c", text: "Running all tests sequentially in a single single-threaded worker process.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-qa1d", text: "Disabling JavaScript in headless Chromium browser settings.", scoreWeight: 0.0, isCorrect: false },
    ],
  },

  // --------------------------------------------------------------------------
  // 14. GAME DEVELOPMENT & 3D GRAPHICS (game_dev)
  // --------------------------------------------------------------------------
  {
    id: "q-gm-01",
    category: "technical",
    skillTag: "Game Development",
    subTopic: "Quaternions & Gimbal Lock in 3D Math",
    difficulty: "hard",
    questionText: "Why are Quaternions preferred over Euler angles for representing 3D rotations in game engines like Unity and Unreal?",
    questionType: "single_choice",
    displayOrder: 27,
    explanation: "Quaternions avoid Gimbal Lock (loss of one rotational degree of freedom when axes align) and allow smooth Spherical Linear Interpolation (SLERP).",
    options: [
      { id: "opt-gm1a", text: "They eliminate Gimbal Lock and provide smooth spherical interpolation (SLERP) without rotational singularity.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-gm1b", text: "They reduce polygon triangle count on 3D mesh models.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-gm1c", text: "Euler angles cannot represent negative coordinates in Cartesian space.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-gm1d", text: "Quaternions are computed strictly on CPU without GPU pipeline.", scoreWeight: 0.0, isCorrect: false },
    ],
  },

  // --------------------------------------------------------------------------
  // 15. SITE RELIABILITY ENGINEERING & OBSERVABILITY (sre_observability)
  // --------------------------------------------------------------------------
  {
    id: "q-sre-01",
    category: "technical",
    skillTag: "Site Reliability & SRE",
    subTopic: "SLIs, SLOs & Error Budgets",
    difficulty: "medium",
    questionText: "In SRE practices, what action is triggered when a production service exhausts 100% of its monthly 99.9% Error Budget?",
    questionType: "single_choice",
    displayOrder: 28,
    explanation: "When an Error Budget is burned, feature releases are frozen and engineering effort is dedicated solely to stability, reliability, and bug fixes.",
    options: [
      { id: "opt-sre1a", text: "Feature deployments are frozen and engineering priority pivots entirely to reliability and bug hardening.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-sre1b", text: "The cloud cluster shuts down all worker nodes automatically.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-sre1c", text: "All user accounts are downgraded to free tier.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-sre1d", text: "HTTP requests are redirected to a static DNS 404 page.", scoreWeight: 0.0, isCorrect: false },
    ],
  },

  // --------------------------------------------------------------------------
  // 16. BIG DATA & DATA PIPELINE ENGINEERING (data_engineering)
  // --------------------------------------------------------------------------
  {
    id: "q-de-01",
    category: "technical",
    skillTag: "Data Engineering",
    subTopic: "Apache Spark Shuffle & Partition Skew",
    difficulty: "hard",
    questionText: "In Apache Spark distributed computing, what causes a severe 'Straggler Task' during large-scale `groupBy` / `join` stages?",
    questionType: "single_choice",
    displayOrder: 29,
    explanation: "Data skew causes one or few partition keys to hold a disproportionate percentage of records, overloading a single executor while others sit idle.",
    options: [
      { id: "opt-de1a", text: "Data partitioning skew where a single hot key sends millions of records to one executor node.", scoreWeight: 1.0, isCorrect: true },
      { id: "opt-de1b", text: "Using Parquet columnar format instead of CSV text files.", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-de1c", text: "Enabling Spark Adaptive Query Execution (AQE).", scoreWeight: 0.0, isCorrect: false },
      { id: "opt-de1d", text: "Allocating too much JVM heap space to driver process.", scoreWeight: 0.0, isCorrect: false },
    ],
  },
];

// Global in-memory storage for Assessment Questions, Sessions, and Reports
const globalAssessmentStore = global as unknown as {
  _titanQuestions?: AssessmentQuestion[];
  _titanSessions?: Map<string, AssessmentSession>;
  _titanReports?: Map<string, SkillIntelligenceReport>;
  _titanTargetRoles?: TargetRoleBenchmark[];
};

export async function getAllQuestions(category?: string, subjectId?: string): Promise<AssessmentQuestion[]> {
  if (!globalAssessmentStore._titanQuestions) {
    globalAssessmentStore._titanQuestions = [...DEFAULT_QUESTIONS];
  }

  let questions = globalAssessmentStore._titanQuestions;

  // Filter by Subject/Course if provided
  if (subjectId && subjectId !== "all") {
    switch (subjectId) {
      case "web_dev":
        questions = questions.filter((q) =>
          q.skillTag.includes("React") ||
          q.skillTag.includes("TypeScript") ||
          q.skillTag.includes("Node") ||
          q.skillTag.includes("Web")
        );
        break;
      case "ai_ml":
        questions = questions.filter((q) =>
          q.skillTag.includes("PyTorch") ||
          q.skillTag.includes("AI") ||
          q.skillTag.includes("LLM") ||
          q.skillTag.includes("Embeddings") ||
          q.skillTag.includes("Python")
        );
        break;
      case "sql_db":
        questions = questions.filter((q) =>
          q.skillTag.includes("SQL") ||
          q.skillTag.includes("Database")
        );
        break;
      case "dsa_core":
        questions = questions.filter((q) =>
          q.skillTag.includes("Algorithms") ||
          q.skillTag.includes("Complexity") ||
          q.category === "aptitude"
        );
        break;
      case "cloud_devops":
        questions = questions.filter((q) =>
          q.skillTag.includes("Distributed") ||
          q.skillTag.includes("Docker") ||
          q.skillTag.includes("Kubernetes") ||
          q.skillTag.includes("Cloud")
        );
        break;
      case "cybersecurity":
        questions = questions.filter((q) =>
          q.skillTag.includes("Security") ||
          q.skillTag.includes("OWASP") ||
          q.skillTag.includes("Auth")
        );
        break;
      case "data_analytics":
        questions = questions.filter((q) =>
          q.skillTag.includes("Data Science") ||
          q.skillTag.includes("Python") ||
          q.skillTag.includes("SQL")
        );
        break;
      case "mobile_app":
        questions = questions.filter((q) => q.skillTag.includes("Mobile"));
        break;
      case "blockchain_web3":
        questions = questions.filter((q) => q.skillTag.includes("Blockchain") || q.skillTag.includes("Web3"));
        break;
      case "system_design":
        questions = questions.filter((q) => q.skillTag.includes("System Design"));
        break;
      case "genai_llm":
        questions = questions.filter((q) => q.skillTag.includes("Generative AI") || q.skillTag.includes("LLM"));
        break;
      case "embedded_iot":
        questions = questions.filter((q) => q.skillTag.includes("Embedded"));
        break;
      case "qa_automation":
        questions = questions.filter((q) => q.skillTag.includes("QA Automation") || q.skillTag.includes("Testing"));
        break;
      case "game_dev":
        questions = questions.filter((q) => q.skillTag.includes("Game Development"));
        break;
      case "sre_observability":
        questions = questions.filter((q) => q.skillTag.includes("Site Reliability") || q.skillTag.includes("SRE"));
        break;
      case "data_engineering":
        questions = questions.filter((q) => q.skillTag.includes("Data Engineering") || q.skillTag.includes("Spark"));
        break;
      default:
        break;
    }
  }

  if (category && category !== "all") {
    questions = questions.filter((q) => q.category === category);
  }

  // Fallback: if subject filter yielded 0, return all
  return questions.length > 0 ? questions : globalAssessmentStore._titanQuestions;
}

export async function getAdaptiveDiagnosticQuestions(context?: {
  primaryLearningGoal?: string;
  subjectId?: string;
  skills?: string[];
  currentLevel?: string;
}): Promise<AssessmentQuestion[]> {
  const subjectId = context?.subjectId || (context?.primaryLearningGoal?.toLowerCase().includes("sql") ? "sql_db" : undefined);
  return getAllQuestions(undefined, subjectId);
}

export async function getTargetRoles(): Promise<TargetRoleBenchmark[]> {
  if (!globalAssessmentStore._titanTargetRoles) {
    globalAssessmentStore._titanTargetRoles = [...DEFAULT_TARGET_ROLES];
  }
  return globalAssessmentStore._titanTargetRoles;
}

export async function getTargetRoleById(id: string): Promise<TargetRoleBenchmark | null> {
  const roles = await getTargetRoles();
  return roles.find((r) => r.id === id) || roles[0] || null;
}

export async function getAssessmentSession(userId: string): Promise<AssessmentSession | null> {
  if (!globalAssessmentStore._titanSessions) {
    globalAssessmentStore._titanSessions = new Map();
  }
  return globalAssessmentStore._titanSessions.get(userId) || null;
}

export async function saveAssessmentAnswer(
  userId: string,
  questionId: string,
  optionId: string,
  currentQuestionIndex: number = 0
): Promise<AssessmentSession> {
  if (!globalAssessmentStore._titanSessions) {
    globalAssessmentStore._titanSessions = new Map();
  }

  const existing = globalAssessmentStore._titanSessions.get(userId) || {
    id: `sess-${Date.now()}`,
    userId,
    status: "in_progress",
    currentQuestionIndex: 0,
    responses: {},
    startedAt: new Date().toISOString(),
  };

  existing.responses[questionId] = optionId;
  existing.currentQuestionIndex = currentQuestionIndex;
  globalAssessmentStore._titanSessions.set(userId, existing);

  return existing;
}

export async function submitAssessmentSession(
  userId: string,
  targetRoleId?: string
): Promise<SkillIntelligenceReport> {
  const session = await getAssessmentSession(userId);
  const questions = await getAllQuestions();
  const responses = session?.responses || {};

  // Compute multi-vector scores & sub-topic granular mastery
  const computed = computeAssessmentScores(questions, responses);

  // Select target role
  const targetRole = targetRoleId
    ? (await getTargetRoleById(targetRoleId)) || DEFAULT_TARGET_ROLES[0]
    : DEFAULT_TARGET_ROLES[0];

  // Calculate explainable gaps
  const skillGaps = calculateExplainableGaps(computed.skillBreakdowns, targetRole);

  const report: SkillIntelligenceReport = {
    id: `rep-${Date.now()}`,
    userId,
    sessionId: session?.id,
    overallReadinessScore: computed.overallReadinessScore,
    technicalScore: computed.technicalScore,
    softSkillScore: computed.softSkillScore,
    aptitudeScore: computed.aptitudeScore,
    careerAlignmentScore: computed.careerAlignmentScore,
    skillBreakdowns: computed.skillBreakdowns,
    topicBreakdowns: computed.topicBreakdowns,
    diagnosticInsights: computed.diagnosticInsights,
    strongSkills: computed.strongSkills,
    weakSkills: computed.weakSkills,
    targetRole,
    skillGaps,
    evaluatedAt: new Date().toISOString(),
  };

  if (!globalAssessmentStore._titanReports) {
    globalAssessmentStore._titanReports = new Map();
  }
  globalAssessmentStore._titanReports.set(userId, report);

  if (session) {
    session.status = "completed";
    session.completedAt = new Date().toISOString();
    globalAssessmentStore._titanSessions?.set(userId, session);
  }

  return report;
}

export async function getLatestSkillReport(
  userId: string,
  targetRoleId?: string
): Promise<SkillIntelligenceReport | null> {
  if (!globalAssessmentStore._titanReports) {
    globalAssessmentStore._titanReports = new Map();
  }

  const report = globalAssessmentStore._titanReports.get(userId);
  if (report) return report;

  // Generate deterministic baseline report if none exists
  const questions = await getAllQuestions();
  const sampleResponses: Record<string, string> = {
    "q-sql-01": "opt-s1b",
    "q-sql-02": "opt-s2a",
    "q-sql-03": "opt-s3a",
    "q-sql-05": "opt-s5b",
    "q-sql-07": "opt-s7a",
    "q-web-01": "opt-w1a",
    "q-web-02": "opt-w2a",
    "q-ai-01": "opt-ai1a",
    "q-dsa-01": "opt-a1a",
  };

  const computed = computeAssessmentScores(questions, sampleResponses);
  const targetRole = targetRoleId
    ? (await getTargetRoleById(targetRoleId)) || DEFAULT_TARGET_ROLES[0]
    : DEFAULT_TARGET_ROLES[0];
  const skillGaps = calculateExplainableGaps(computed.skillBreakdowns, targetRole);

  const fallbackReport: SkillIntelligenceReport = {
    id: `rep-default-${userId}`,
    userId,
    overallReadinessScore: computed.overallReadinessScore,
    technicalScore: computed.technicalScore,
    softSkillScore: computed.softSkillScore,
    aptitudeScore: computed.aptitudeScore,
    careerAlignmentScore: computed.careerAlignmentScore,
    skillBreakdowns: computed.skillBreakdowns,
    topicBreakdowns: computed.topicBreakdowns,
    diagnosticInsights: computed.diagnosticInsights,
    strongSkills: computed.strongSkills,
    weakSkills: computed.weakSkills,
    targetRole,
    skillGaps,
    evaluatedAt: new Date().toISOString(),
  };

  globalAssessmentStore._titanReports.set(userId, fallbackReport);
  return fallbackReport;
}

// Backwards-Compatible API Aliases
export const getAssessmentQuestions = getAllQuestions;
export const getActiveSession = getAssessmentSession;
export const getSkillIntelligenceReport = getLatestSkillReport;

export async function startAssessmentSession(userId: string): Promise<AssessmentSession> {
  const existing = await getAssessmentSession(userId);
  if (existing && existing.status === "in_progress") return existing;
  
  const newSess: AssessmentSession = {
    id: `sess-${Date.now()}`,
    userId,
    status: "in_progress",
    currentQuestionIndex: 0,
    responses: {},
    startedAt: new Date().toISOString(),
  };

  if (!globalAssessmentStore._titanSessions) {
    globalAssessmentStore._titanSessions = new Map();
  }
  globalAssessmentStore._titanSessions.set(userId, newSess);
  return newSess;
}
