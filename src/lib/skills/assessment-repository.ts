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
