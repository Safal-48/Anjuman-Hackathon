const fs = require('fs');
const path = require('path');

// 16 subjects data definitions with 15 specialized questions each
const subjects = [
  {
    id: "web_dev",
    prefix: "web",
    category: "technical",
    skillTag: "React / Next.js & Web Systems",
    questions: [
      {
        q: "In React, what is the key difference between `useEffect` and `useLayoutEffect` execution timing?",
        diff: "medium",
        sub: "React Hooks Lifecycle",
        ans: "useLayoutEffect fires synchronously after DOM mutations before browser paint; useEffect fires asynchronously after paint.",
        wrong: [
          "useEffect runs on the server; useLayoutEffect runs on the client.",
          "useLayoutEffect can only be used with Class components.",
          "They are completely identical aliases in modern React 18+."
        ],
        exp: "useLayoutEffect runs synchronously immediately after DOM mutations before the browser repaints the screen, preventing visual layout flickering."
      },
      {
        q: "Which TypeScript utility type constructs a type with all properties of `T` set to optional except for specified keys `K`?",
        diff: "medium",
        sub: "TypeScript Types",
        ans: "Partial<T> & Pick<T, K>",
        wrong: [
          "Extract<T, K>",
          "Record<K, any>",
          "Exclude<T, K>"
        ],
        exp: "Combining Partial<T> & Pick<T, K> keeps specified keys required while making others optional."
      },
      {
        q: "In Next.js App Router (React Server Components), what happens when a Server Component imports and renders a Client Component?",
        diff: "hard",
        sub: "Next.js Architecture",
        ans: "The Server Component passes serialized props over the wire across the network boundary to hydrate the Client Component.",
        wrong: [
          "The entire Server Component is converted to client-side bundle execution.",
          "Next.js throws a build-time compiler error.",
          "Client Components cannot be imported into Server Components under any circumstances."
        ],
        exp: "Server Components stream serialized RSC payload data to the client, where hydration initializes the interactive client boundary."
      },
      {
        q: "In Node.js, what executes in the `process.nextTick` queue compared to `setImmediate`?",
        diff: "medium",
        sub: "Node.js Event Loop",
        ans: "process.nextTick fires before the event loop advances to the next phase; setImmediate fires in the Check phase.",
        wrong: [
          "setImmediate has higher microtask priority than process.nextTick.",
          "Both execute in the Timers phase with setTimeout(fn, 0).",
          "process.nextTick spawns an OS worker thread."
        ],
        exp: "process.nextTick runs immediately after the current operation finishes before the event loop moves on."
      },
      {
        q: "What causes a 'stale closure' bug inside a React `useCallback` or `useEffect` hook?",
        diff: "medium",
        sub: "React State Management",
        ans: "Omitting a changing state or prop variable from the dependency array, causing the hook to capture outdated values.",
        wrong: [
          "Calling setState with an arrow function updater.",
          "Using strict mode in React development environment.",
          "Rendering too many memoized child components."
        ],
        exp: "When dependencies are missing, the closed-over function captures state values from the initial render pass."
      },
      {
        q: "In modern CSS, what is the key advantage of CSS Grid's `subgrid` feature?",
        diff: "medium",
        sub: "CSS & Responsive Layout",
        ans: "It enables a nested child grid to adopt and align directly with the row and column tracks of its parent grid.",
        wrong: [
          "It automatically compresses responsive image sizes.",
          "It converts standard flexbox containers into 3D canvases.",
          "It eliminates the need for CSS media queries entirely."
        ],
        exp: "Subgrid allows nested grid items to participate in sizing and alignment with the ancestor grid."
      },
      {
        q: "How does the browser's Critical Rendering Path handle `<script defer>` compared to `<script async>`?",
        diff: "medium",
        sub: "Web Performance",
        ans: "defer scripts download in parallel and execute in document order after HTML parsing; async scripts execute as soon as downloaded, interrupting HTML parsing.",
        wrong: [
          "defer scripts execute immediately before DOMContentLoaded is triggered; async scripts execute after window.onload.",
          "defer only works in service worker threads.",
          "Both attributes block HTML parsing completely until download completes."
        ],
        exp: "defer preserves execution order and waits for HTML parsing to complete; async executes as soon as ready."
      },
      {
        q: "What is the primary motivation for using Server-Sent Events (SSE) instead of WebSockets for unidirectional AI streaming responses?",
        diff: "medium",
        sub: "Web APIs & Streaming",
        ans: "SSE runs over standard HTTP/1.1 or HTTP/2 with built-in auto-reconnection and firewall friendliness without full-duplex overhead.",
        wrong: [
          "SSE supports binary UDP packets while WebSockets only support plain text.",
          "WebSockets cannot work in Chromium-based browsers.",
          "SSE is strictly peer-to-peer without server infrastructure."
        ],
        exp: "SSE is lightweight, operates over standard HTTP, and includes native browser reconnection for streaming."
      },
      {
        q: "What is the purpose of React 18's `useTransition` hook?",
        diff: "hard",
        sub: "React Concurrent Features",
        ans: "It marks non-urgent state updates as interruptible transitions, keeping the main thread responsive for user typing/clicks.",
        wrong: [
          "It animates CSS transforms with WebGL acceleration.",
          "It transitions class components into functional components automatically.",
          "It forces server-side revalidation of ISR static paths."
        ],
        exp: "useTransition allows developers to differentiate urgent updates (like typing in an input) from non-urgent transitions (like rendering filtered lists)."
      },
      {
        q: "In Web Vitals, what does Interaction to Next Paint (INP) measure?",
        diff: "medium",
        sub: "Core Web Vitals",
        ans: "The overall responsiveness of a page to user interactions (clicks, taps, key presses) throughout the full page lifecycle.",
        wrong: [
          "The time taken to download the largest hero image on page load.",
          "The number of cumulative layout shifts occurring during initial paint.",
          "The SSL TLS handshake connection duration."
        ],
        exp: "INP measures user interaction latency across all user interactions during the lifetime of the page."
      },
      {
        q: "What header configuration prevents Clickjacking attacks on a modern web application?",
        diff: "easy",
        sub: "Web Security",
        ans: "Content-Security-Policy: frame-ancestors 'self' or X-Frame-Options: DENY",
        wrong: [
          "Access-Control-Allow-Origin: *",
          "Cache-Control: no-cache, no-store",
          "Strict-Transport-Security: max-age=31536000"
        ],
        exp: "frame-ancestors and X-Frame-Options prevent your web app from being rendered inside malicious iframes."
      },
      {
        q: "What is the capability difference between structuredClone() and JSON.parse(JSON.stringify()) for deep cloning in JavaScript?",
        diff: "medium",
        sub: "JavaScript Internals",
        ans: "structuredClone correctly handles circular references, Maps, Sets, and Dates, whereas JSON serialization strips or errors on them.",
        wrong: [
          "JSON.stringify handles cyclical memory graphs natively.",
          "structuredClone can only clone primitive string values.",
          "There is no difference; structuredClone is an alias for JSON parsing."
        ],
        exp: "structuredClone uses the HTML structured clone algorithm, preserving cyclic graphs, TypedArrays, Dates, Maps, and Sets."
      },
      {
        q: "How does the `keep-alive` connection header benefit HTTP/1.1 client performance?",
        diff: "easy",
        sub: "Networking & Protocols",
        ans: "It reuses an existing TCP connection for multiple HTTP requests instead of opening a new TCP handshake each time.",
        wrong: [
          "It forces browsers to cache pages in RAM permanently.",
          "It compresses images into WebP format on the fly.",
          "It upgrades plain HTTP to quantum encryption automatically."
        ],
        exp: "Persistent connections avoid repetitive 3-way TCP and TLS handshakes for each asset."
      },
      {
        q: "What role does the `satisfies` operator play in TypeScript 4.9+?",
        diff: "hard",
        sub: "TypeScript Advanced",
        ans: "It validates that an expression matches a type contract without widening or mutating the expression's inferred literal type.",
        wrong: [
          "It forcibly casts null to undefined at runtime.",
          "It disables type checking on third-party npm packages.",
          "It compiles TypeScript files to WebAssembly binaries."
        ],
        exp: "satisfies verifies conformity to an interface while preserving exact literal types and autocompletion."
      },
      {
        q: "Why is optimistic UI updating widely adopted in high-performance collaborative web apps?",
        diff: "medium",
        sub: "UI Architecture & State",
        ans: "It immediately updates the local UI before server acknowledgment, reverting gracefully only if the remote mutation fails.",
        wrong: [
          "It completely removes the requirement for a server database.",
          "It encrypts all network requests with client-side RSA keys.",
          "It eliminates all client-side JavaScript memory consumption."
        ],
        exp: "Optimistic updates provide instant perceived latency for users while maintaining eventual consistency with the server."
      }
    ]
  },
  {
    id: "ai_ml",
    prefix: "ai",
    category: "technical",
    skillTag: "AI & Machine Learning",
    questions: [
      {
        q: "Why is `optimizer.zero_grad()` called before `loss.backward()` in a typical PyTorch training loop?",
        diff: "medium",
        sub: "PyTorch & Autograd",
        ans: "PyTorch accumulates gradients on tensors by default; zero_grad() prevents compounding gradients across iterations.",
        wrong: [
          "It resets neural weights to random Gaussian distribution.",
          "It allocates GPU VRAM memory buffers for tensor variables.",
          "It stops model inference execution."
        ],
        exp: "Gradients accumulate automatically in PyTorch to support gradient accumulation across micro-batches."
      },
      {
        q: "What is the primary computational bottleneck of standard Multi-Head Self-Attention in Transformers with sequence length `N`?",
        diff: "hard",
        sub: "Transformers & Attention",
        ans: "Quadratic O(N²) memory and compute complexity in sequence length N due to full token-to-token attention matrices.",
        wrong: [
          "Linear O(N) memory scaling bottlenecks.",
          "Inability to run on parallel GPU threads.",
          "Loss of backpropagation gradients during token projection."
        ],
        exp: "Computing and materializing the full (N x N) attention score matrix scales quadratically with token length."
      },
      {
        q: "When comparing normalized unit embedding vectors (L2 norm = 1.0), how does Dot Product relate to Cosine Similarity?",
        diff: "medium",
        sub: "Embeddings & Vector Spaces",
        ans: "Dot product is mathematically identical to cosine similarity when vectors are L2-normalized.",
        wrong: [
          "Dot product is always perpendicular to cosine distance.",
          "Dot product cannot be used on dense embeddings.",
          "Cosine similarity produces negative values while dot product is strictly positive."
        ],
        exp: "For unit vectors (|u|=1, |v|=1), u . v / (|u||v|) simplifies directly to u . v."
      },
      {
        q: "In deep learning, what is the primary function of Layer Normalization compared to Batch Normalization?",
        diff: "medium",
        sub: "Deep Learning Architectures",
        ans: "LayerNorm normalizes across features within a single sample, making it independent of batch size and ideal for sequential models like Transformers.",
        wrong: [
          "BatchNorm normalizes weights while LayerNorm normalizes inputs only.",
          "LayerNorm requires batch sizes of at least 64 samples to compute variance.",
          "LayerNorm is only compatible with Convolutional layers."
        ],
        exp: "LayerNorm computes mean and variance along feature dimensions per sample, avoiding dependency on batch sizes."
      },
      {
        q: "What problem does the AdamW optimizer fix compared to traditional Adam with L2 regularization?",
        diff: "hard",
        sub: "Optimization Algorithms",
        ans: "AdamW decouples weight decay from gradient updates, ensuring weight decay shrinks weights directly rather than being scaled by moving averages.",
        wrong: [
          "AdamW eliminates the need to calculate loss functions.",
          "AdamW runs strictly on CPU to reduce GPU power draw.",
          "AdamW guarantees zero training loss in exactly one epoch."
        ],
        exp: "L2 regularization in standard Adam divides decay by adaptive gradient scales; AdamW decouples weight decay."
      },
      {
        q: "In classification models, when is ROC-AUC a misleading metric compared to Precision-Recall AUC (PR-AUC)?",
        diff: "medium",
        sub: "Model Evaluation",
        ans: "When dealing with highly imbalanced datasets where the negative class overwhelmingly dominates (e.g. fraud detection).",
        wrong: [
          "When the dataset has an equal 50/50 balance of classes.",
          "When doing multi-class image classification.",
          "When the learning rate is scheduled with cosine decay."
        ],
        exp: "A large number of true negatives keeps the false positive rate low in ROC curves even if precision on positives is poor."
      },
      {
        q: "What is the purpose of Temperature in LLM token sampling during text generation?",
        diff: "easy",
        sub: "LLM Sampling",
        ans: "It scales logits before softmax; lower temperature makes output deterministic/focused, while higher temperature increases diversity.",
        wrong: [
          "It controls GPU thermal throttling during token streaming.",
          "It sets the maximum token context window length.",
          "It quantizes model weights from 16-bit to 4-bit."
        ],
        exp: "Dividing logits by temperature smooths or sharpens the softmax probability distribution."
      },
      {
        q: "What is Low-Rank Adaptation (LoRA) used for in LLM fine-tuning?",
        diff: "hard",
        sub: "Efficient Fine-Tuning",
        ans: "It freezes pretrained model weights and injects trainable rank-decomposition matrices, drastically reducing GPU memory and parameters.",
        wrong: [
          "It compresses the prompt context before feeding it into the model.",
          "It increases training parameters by 400% to boost accuracy.",
          "It removes all attention layers from the Transformer."
        ],
        exp: "LoRA decomposes weight updates into two smaller matrices (W0 + B*A with rank r << d), training <1% of parameters."
      },
      {
        q: "In neural network training, what indicates that a model is suffering from Overfitting?",
        diff: "easy",
        sub: "Model Diagnostics",
        ans: "Training loss continues decreasing while validation loss begins increasing and diverging.",
        wrong: [
          "Both training loss and validation loss decrease steadily together.",
          "Training loss remains completely constant at 1.0.",
          "The model runs 10 times faster on the GPU."
        ],
        exp: "Overfitting occurs when the model memorizes training noise rather than generalizable underlying patterns."
      },
      {
        q: "How does FlashAttention achieve 2-4x speedup in Transformer training and inference?",
        diff: "hard",
        sub: "Hardware Acceleration & LLMs",
        ans: "It tiles attention computation to fit within high-speed GPU SRAM, avoiding reading/writing large N x N intermediate matrices to slow HBM.",
        wrong: [
          "It drops 50% of tokens randomly without attention scores.",
          "It runs all attention on CPU integer ALUs.",
          "It approximates matrix multiplication with 1-bit binary weights."
        ],
        exp: "FlashAttention uses kernel fusion and tiling to compute softmax incrementally in fast on-chip SRAM."
      },
      {
        q: "What is the role of Rotary Position Embedding (RoPE) in modern models like LLaMA and Mistral?",
        diff: "hard",
        sub: "Transformers & Positional Encoding",
        ans: "It incorporates relative positional information by rotating query and key representations in complex vector space.",
        wrong: [
          "It prevents model hallucination by filtering internet text.",
          "It tokenizes unicode characters into fixed-size byte pairs.",
          "It randomly swaps word positions during data augmentation."
        ],
        exp: "RoPE multiplies queries and keys by orthogonal rotation matrices whose inner product depends on relative token distance."
      },
      {
        q: "In reinforcement learning with human feedback (RLHF), what is the objective of the PPO / DPO phase?",
        diff: "hard",
        sub: "Alignment & RLHF",
        ans: "To align language model policy outputs with human preferences while penalizing drift too far from the base reference model.",
        wrong: [
          "To speed up initial token pretraining on raw web crawls.",
          "To translate English prompts into Python bytecode.",
          "To convert generative models into binary classifiers."
        ],
        exp: "RLHF fine-tunes policy using reward models or direct preference pairs with a KL-divergence penalty against base drift."
      },
      {
        q: "What does the Cross-Entropy loss function quantify in multi-class classification?",
        diff: "medium",
        sub: "Loss Functions",
        ans: "The difference between the predicted probability distribution and the true one-hot target distribution.",
        wrong: [
          "The geometric distance between cluster centroids in k-means.",
          "The execution time of GPU matrix multiplication kernels.",
          "The correlation between input image pixel brightness and labels."
        ],
        exp: "Cross-entropy computes -sum(y_true * log(y_pred)), heavily penalizing confident wrong predictions."
      },
      {
        q: "What is Gradient Clipping primarily used for during deep recurrent or deep transformer network training?",
        diff: "medium",
        sub: "Training Stability",
        ans: "Preventing exploding gradients by capping gradient norms to a maximum threshold value.",
        wrong: [
          "Eliminating vanishing gradients completely.",
          "Pruning unused weights from the network graph.",
          "Quantizing float32 tensors to int8 integers."
        ],
        exp: "Gradient clipping rescales gradient vectors if their L2 norm exceeds a maximum threshold, preventing numerical explosion."
      },
      {
        q: "Why is Knowledge Distillation utilized in production AI deployments?",
        diff: "medium",
        sub: "Model Compression",
        ans: "To transfer knowledge from a large cumbersome 'teacher' model into a compact, fast 'student' model with minimal loss of accuracy.",
        wrong: [
          "To generate synthetic training data using web scrapers.",
          "To encrypt proprietary weights before sending to clients.",
          "To replace neural networks with linear regression."
        ],
        exp: "Knowledge distillation trains small student models on the soft probability outputs (logits) of high-capacity teacher models."
      }
    ]
  },
  {
    id: "mobile_app",
    prefix: "mob",
    category: "technical",
    skillTag: "Mobile App Engineering",
    questions: [
      {
        q: "In React Native's New Architecture (Fabric & TurboModules), how does JavaScript communicate with native UI threads compared to the legacy JSON bridge?",
        diff: "medium",
        sub: "React Native Architecture",
        ans: "JSI allows JavaScript to hold direct C++ references to native methods without async JSON serialization.",
        wrong: [
          "It uses WebSockets to transmit binary frames over localhost port 8081.",
          "It compiles all JavaScript directly into ARM64 assembly at compile-time.",
          "There is no difference; it is solely a rebranding of the old bridge."
        ],
        exp: "JavaScript Interface (JSI) enables C++ host objects to be directly invoked synchronously by JS runtime without serialization."
      },
      {
        q: "When building offline-first mobile sync with SQLite/WatermelonDB, what is the best strategy to resolve concurrent optimistic update conflicts?",
        diff: "hard",
        sub: "Offline Data Sync",
        ans: "Vector clocks / CRDTs or monotonic version timestamps with field-level delta merging.",
        wrong: [
          "Always overwriting local SQLite database with raw server snapshot upon connection.",
          "Blocking the UI and preventing user input until Wi-Fi reconnects.",
          "Deleting corrupted client rows and prompting user to re-type data."
        ],
        exp: "CRDTs or deterministic monotonic timestamps enable distributed clients to reconcile concurrent edits without data loss."
      },
      {
        q: "In Flutter, what is the critical architectural difference between `StatelessWidget` and `StatefulWidget`?",
        diff: "easy",
        sub: "Flutter Core",
        ans: "StatelessWidget is immutable and cannot hold mutable state; StatefulWidget delegates lifecycle and state mutations to a separate State object.",
        wrong: [
          "StatelessWidget cannot render UI widgets.",
          "StatefulWidget runs on native background threads while StatelessWidget runs in Dart isolate.",
          "StatelessWidget requires Android NDK."
        ],
        exp: "StatefulWidget creates a persistent State object that survives rebuilds and triggers element tree updates via setState()."
      },
      {
        q: "In Android development, why should heavy operations NEVER be performed directly inside `onReceive()` of a BroadcastReceiver?",
        diff: "medium",
        sub: "Android Components",
        ans: "onReceive() executes on the Main UI thread and is terminated by Android OS if it blocks for more than 10 seconds (causing ANR).",
        wrong: [
          "BroadcastReceivers only have access to 1KB of memory.",
          "Android OS immediately uninstalls the app upon blocking.",
          "BroadcastReceivers cannot access local storage."
        ],
        exp: "onReceive runs on the main thread; long-running operations must be offloaded to WorkManager or background jobs."
      },
      {
        q: "In iOS Swift development, how does Automatic Reference Counting (ARC) handle a `weak` reference compared to `unowned`?",
        diff: "hard",
        sub: "iOS Memory Management",
        ans: "A weak reference is an optional that automatically becomes nil when the referenced instance is deallocated; unowned assumes the object will never be nil.",
        wrong: [
          "Weak references retain an object in memory permanently.",
          "Unowned references cause compile-time build failure in Swift 5+.",
          "ARC does not manage weak references."
        ],
        exp: "weak references prevent retain cycles and zero out automatically to nil when the referenced object deallocates."
      },
      {
        q: "What causes severe UI frame drops (jank) in a React Native application with a FlatList containing 500 items?",
        diff: "medium",
        sub: "React Native Performance",
        ans: "Missing keyExtractor, anonymous inline renderItem functions, and unmemoized heavy item components causing full list re-renders.",
        wrong: [
          "FlatList can only display up to 20 items maximum.",
          "React Native cannot render lists on Android devices.",
          "Using SVG images inside list items."
        ],
        exp: "Optimizing FlatList requires React.memo on item components, stable renderItem callbacks, and keyExtractors."
      },
      {
        q: "In Flutter, what does the `const` keyword do when applied to Widget constructors?",
        diff: "easy",
        sub: "Flutter Optimization",
        ans: "It instantiates a canonical compile-time constant widget, preventing Flutter from rebuilding it when parent widgets re-render.",
        wrong: [
          "It prevents the user from clicking the widget.",
          "It forces the widget to be rendered as an Android native view.",
          "It removes the widget from the widget tree."
        ],
        exp: "const widgets are created once at compile-time and reused, avoiding unnecessary garbage collection and rebuild cycles."
      },
      {
        q: "What is the primary benefit of using Android `WorkManager` over `JobScheduler` or `AlarmManager` for background tasks?",
        diff: "medium",
        sub: "Android Architecture Components",
        ans: "WorkManager guarantees execution even if the app process is killed or device reboots, adhering to battery optimization constraints (Doze mode).",
        wrong: [
          "WorkManager runs tasks with zero battery usage.",
          "WorkManager bypasses all Android system permissions.",
          "WorkManager is designed only for playing background audio."
        ],
        exp: "WorkManager provides backward-compatible, persistent background execution respecting battery and network constraints."
      },
      {
        q: "In iOS development, what is the role of Grand Central Dispatch (GCD) `DispatchQueue.main.async`?",
        diff: "easy",
        sub: "iOS Concurrency",
        ans: "It schedules execution of UI updates on the main thread from a background asynchronous task.",
        wrong: [
          "It executes code directly inside the GPU shader pipeline.",
          "It compresses images before saving to CoreData.",
          "It terminates background threads automatically."
        ],
        exp: "All UIKit and SwiftUI view manipulations must be performed on the main UI dispatch queue."
      },
      {
        q: "What is ProGuard / R8 used for when compiling production Android APK / AAB builds?",
        diff: "medium",
        sub: "Mobile Build & Security",
        ans: "Code shrinking, resource shrinking, dead code elimination, and obfuscation of Java/Kotlin class and method names.",
        wrong: [
          "Testing Bluetooth connections in production.",
          "Generating push notification tokens for Firebase Cloud Messaging.",
          "Replacing Android Manifest XML with JSON."
        ],
        exp: "R8 shrinks app bundle size and obfuscates code to hinder reverse engineering."
      },
      {
        q: "In React Native, what is the purpose of the `InteractionManager.runAfterInteractions()` API?",
        diff: "hard",
        sub: "React Native Performance",
        ans: "It delays execution of expensive background calculations until active UI animations and gestures have completed.",
        wrong: [
          "It logs user button clicks to analytics platforms.",
          "It forces the screen brightness to 100%.",
          "It disables all native touch events permanently."
        ],
        exp: "runAfterInteractions ensures complex state updates or fetch processing do not cause frame drops during transitions."
      },
      {
        q: "In Flutter, what is an `Isolate` and how does it differ from a standard thread?",
        diff: "hard",
        sub: "Flutter / Dart Internals",
        ans: "An Isolate has its own private memory heap and single-threaded event loop, communicating with other isolates only via message passing.",
        wrong: [
          "Isolates share memory heap with the main UI thread with mutual exclusion locks.",
          "Isolates are only supported on desktop Flutter apps.",
          "Isolates cannot execute Dart code."
        ],
        exp: "Dart isolates do not share mutable memory, avoiding lock contention and race conditions entirely."
      },
      {
        q: "How should sensitive cryptographic keys or authentication tokens be stored securely on iOS and Android respectively?",
        diff: "medium",
        sub: "Mobile Security",
        ans: "iOS Keychain Services and Android Keystore / EncryptedSharedPreferences.",
        wrong: [
          "Plaintext UserDefaults (iOS) and SharedPreferences (Android).",
          "Hardcoding keys in client JavaScript or Swift source files.",
          "Saving keys as public text files in the Downloads folder."
        ],
        exp: "Keychain and Keystore provide hardware-backed encryption (Secure Enclave / TEE) for sensitive credentials."
      },
      {
        q: "What is Deep Linking in mobile applications (Universal Links in iOS & App Links in Android)?",
        diff: "easy",
        sub: "Mobile Navigation",
        ans: "Routing standard web HTTPS URLs directly to specific contextual screens inside the installed native mobile app.",
        wrong: [
          "Connecting mobile devices to deep ocean submarine cables.",
          "Linking multiple Bluetooth devices to one phone.",
          "Embedding web browsers inside native buttons."
        ],
        exp: "Universal and App Links verify domain ownership and launch matching in-app content directly from web links."
      },
      {
        q: "In mobile app architecture, what is the primary benefit of the Clean Architecture / MVVM pattern?",
        diff: "medium",
        sub: "Mobile Architecture",
        ans: "Decoupling UI view presentation from business logic and data repositories, facilitating independent unit testing and maintenance.",
        wrong: [
          "Making the app binary file size under 1MB.",
          "Eliminating the need for a backend server.",
          "Automatically generating App Store screenshots."
        ],
        exp: "MVVM separates presentation state from data layers, allowing view models to be tested without UI rendering."
      }
    ]
  },
  {
    id: "sql_db",
    prefix: "sql",
    category: "technical",
    skillTag: "SQL & Database Engineering",
    questions: [
      {
        q: "Which SQL clause is used to eliminate duplicate rows from a query result set?",
        diff: "easy",
        sub: "SQL Basics",
        ans: "SELECT DISTINCT col FROM table;",
        wrong: [
          "SELECT UNIQUE col FROM table;",
          "SELECT DIFFERENT col FROM table;",
          "SELECT DEDUPLICATE col FROM table;"
        ],
        exp: "DISTINCT filters out duplicate records from returned tuples."
      },
      {
        q: "When filtering records in SQL, which operator allows specifying multiple candidate values in a `WHERE` predicate?",
        diff: "easy",
        sub: "SQL Filtering",
        ans: "WHERE status IN ('active', 'pending', 'verified')",
        wrong: [
          "WHERE status WITHIN ('active', 'pending')",
          "WHERE status CONTAINS ('active')",
          "WHERE status MATCH ('active')"
        ],
        exp: "IN operator checks if an attribute matches any scalar in the given list or subquery."
      },
      {
        q: "What is the critical semantic difference between `WHERE` and `HAVING` clauses in SQL?",
        diff: "medium",
        sub: "Aggregation & Grouping",
        ans: "WHERE filters individual rows before grouping; HAVING filters aggregated group metrics post-GROUP BY.",
        wrong: [
          "HAVING filters rows before aggregation; WHERE filters groups.",
          "WHERE and HAVING are 100% interchangeable synonyms in standard ANSI SQL.",
          "HAVING can only be used with subqueries."
        ],
        exp: "WHERE filters tuples before grouping; HAVING evaluates aggregate functions like COUNT() or SUM() after grouping."
      },
      {
        q: "You have a `Customers` table (100 rows) and an `Orders` table (50 rows). A `LEFT JOIN` on `Customers.id = Orders.customer_id` will return:",
        diff: "medium",
        sub: "Relational Joins",
        ans: "At least 100 rows (all customers preserved, with NULLs for customers without orders).",
        wrong: [
          "Exactly 50 rows (only customers with active orders).",
          "Exactly 5000 rows (Cartesian product).",
          "Only customers who have placed more than 2 orders."
        ],
        exp: "LEFT JOIN preserves every row from the left table, padding unmatched right columns with NULL."
      },
      {
        q: "What does `DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC)` compute in SQL?",
        diff: "hard",
        sub: "Window Functions",
        ans: "Consecutive ranking of salaries within each department without skipping rank numbers on ties (e.g. 1, 2, 2, 3).",
        wrong: [
          "Skipping ranks on ties (e.g. 1, 2, 2, 4).",
          "The cumulative running total salary per department.",
          "A random distribution hash for sharding."
        ],
        exp: "DENSE_RANK assigns consecutive ordinal ranks on equal values without skipping integer ranks."
      },
      {
        q: "What does the 'Isolation' property guarantee in ACID database transactions?",
        diff: "medium",
        sub: "ACID Transactions",
        ans: "Concurrent transactions execute without interfering with one another, preventing intermediate uncommitted reads.",
        wrong: [
          "Data is stored in isolated hard drives across multiple continents.",
          "The database disconnects from the internet during backup procedures.",
          "Every table must be stored in its own isolated schema."
        ],
        exp: "Isolation guarantees that concurrently executing transactions produce results equivalent to serial execution."
      },
      {
        q: "What is the primary trade-off of adding a B-Tree index to a heavily queried SQL table column?",
        diff: "medium",
        sub: "Indexing & Query Optimization",
        ans: "Accelerates SELECT query lookups and range scans, but slows down INSERT, UPDATE, and DELETE operations due to index tree maintenance.",
        wrong: [
          "Slows down SELECT queries but speeds up INSERT operations.",
          "Deletes all existing foreign key constraints on the table.",
          "Requires the database to run in single-user maintenance mode."
        ],
        exp: "Indexes speed up reads but add write overhead as the B-Tree structure must rebalance upon modifications."
      },
      {
        q: "What is a 'Dirty Read' phenomenon in SQL transaction isolation levels?",
        diff: "hard",
        sub: "Transaction Isolation",
        ans: "A transaction reads uncommitted modifications made by another concurrent transaction that might later be rolled back.",
        wrong: [
          "Reading data from a corrupted storage disk block.",
          "A query that returns NULL values for primary key columns.",
          "Reading outdated cached records from Redis."
        ],
        exp: "Dirty reads occur at Read Uncommitted isolation when uncommitted mutations are visible to other transactions."
      },
      {
        q: "In relational database design, what is required for a relation to be in Third Normal Form (3NF)?",
        diff: "hard",
        sub: "Database Normalization",
        ans: "It is in 2NF and has no transitive dependencies (no non-prime attribute depends on another non-prime attribute).",
        wrong: [
          "It contains exactly three tables linked by foreign keys.",
          "Every row must have a unique composite timestamp.",
          "All numeric columns must be formatted as IEEE float64."
        ],
        exp: "3NF ensures every non-key attribute depends on 'the key, the whole key, and nothing but the key'."
      },
      {
        q: "What is the operational difference between `TRUNCATE TABLE` and `DELETE FROM table` in PostgreSQL and MySQL?",
        diff: "medium",
        sub: "DDL vs DML",
        ans: "TRUNCATE is a DDL operation that deallocates data pages quickly without row-by-row logging; DELETE scans and removes rows individually with full transaction logging.",
        wrong: [
          "DELETE removes the table schema entirely; TRUNCATE preserves the table.",
          "TRUNCATE fires all ON DELETE database triggers for every row.",
          "They are identical syntax aliases with identical performance."
        ],
        exp: "TRUNCATE resets table data pages at filesystem level without logging individual row deletions, making it much faster."
      },
      {
        q: "In PostgreSQL, what does an `EXPLAIN ANALYZE` statement output when preceding a SQL query?",
        diff: "medium",
        sub: "Query Plans & Performance",
        ans: "It actually executes the query and prints the planner's estimated cost alongside the real execution time and row counts for each node.",
        wrong: [
          "It simulates the query without running it and generates index suggestions.",
          "It converts the SQL statement into a Python script.",
          "It checks SQL syntax without accessing the storage engine."
        ],
        exp: "EXPLAIN ANALYZE runs the query in real time, reporting actual node execution timings and row counts against estimates."
      },
      {
        q: "When should a database administrator configure a Composite (Multi-Column) Index on `(user_id, created_at)`?",
        diff: "medium",
        sub: "Index Design",
        ans: "When queries frequently filter by `user_id` and order by or filter by `created_at` in the WHERE clause.",
        wrong: [
          "When queries only search for created_at without referencing user_id.",
          "When user_id contains 100% duplicate values across all rows.",
          "When the table has zero write operations."
        ],
        exp: "B-Tree composite indexes can satisfy filters on the leading column (user_id) followed by ordering/filtering on the second column."
      },
      {
        q: "What does the SQL `COALESCE(val1, val2, val3)` function return?",
        diff: "easy",
        sub: "SQL Functions",
        ans: "The first non-NULL expression in its argument list, or NULL if all arguments are NULL.",
        wrong: [
          "The mathematical average of all non-null arguments.",
          "The longest string among all supplied arguments.",
          "True if all arguments are identical."
        ],
        exp: "COALESCE evaluates arguments from left to right and returns the first scalar that is not NULL."
      },
      {
        q: "What is Database Sharding in high-scale distributed data systems?",
        diff: "medium",
        sub: "Distributed Databases",
        ans: "Horizontally partitioning rows of a database across multiple independent physical server nodes based on a shard key.",
        wrong: [
          "Backing up database tables to magnetic tape drives.",
          "Creating multiple indexes on a single column.",
          "Converting SQL tables into CSV files for archiving."
        ],
        exp: "Sharding partitions large tables horizontally across multiple server instances to scale writes and storage."
      },
      {
        q: "Why are Database Connection Pools utilized in production web applications?",
        diff: "easy",
        sub: "Database Architecture",
        ans: "To maintain a cache of reusable database connections, avoiding the expensive overhead of establishing a new TCP/auth handshake per query.",
        wrong: [
          "To bypass database user authentication permissions.",
          "To store user passwords in local browser storage.",
          "To translate PostgreSQL queries into MongoDB syntax."
        ],
        exp: "Connection pooling avoids repetitive connection establishment overhead, dramatically improving response throughput."
      }
    ]
  },
  {
    id: "dsa_core",
    prefix: "dsa",
    category: "aptitude",
    skillTag: "Algorithms & Complexity",
    questions: [
      {
        q: "What is the time complexity of Breadth-First Search (BFS) on an unweighted graph represented as an Adjacency List with `V` vertices and `E` edges?",
        diff: "medium",
        sub: "Graph Algorithms",
        ans: "O(V + E)",
        wrong: [
          "O(V * E)",
          "O(V²)",
          "O(log V)"
        ],
        exp: "BFS visits each vertex once and traverses each outgoing edge once in an adjacency list representation."
      },
      {
        q: "What two essential properties must a computational problem exhibit to be solvable optimally via Dynamic Programming?",
        diff: "hard",
        sub: "Dynamic Programming",
        ans: "Optimal Substructure and Overlapping Subproblems.",
        wrong: [
          "Greedy Choice Property and Divide & Conquer partitioning.",
          "Amortized Constant Time and In-place Memory allocation.",
          "Strict Monotonicity and Non-cyclic Recursion."
        ],
        exp: "Optimal substructure means optimal solutions to subproblems form the optimal solution; overlapping subproblems means subproblems repeat."
      },
      {
        q: "What is the worst-case time complexity of QuickSort and when does it typically occur with naive pivot selection?",
        diff: "medium",
        sub: "Sorting Algorithms",
        ans: "O(N²), occurring when the pivot selected is consistently the smallest or largest element (e.g. already sorted array with first element pivot).",
        wrong: [
          "O(N log N), occurring when all elements are unique.",
          "O(N), occurring when the array contains negative numbers.",
          "O(log N), occurring on reversed arrays."
        ],
        exp: "Unbalanced partitions (1 element vs N-1 elements) lead to recursion depth N and quadratic O(N^2) work."
      },
      {
        q: "In a Min-Heap binary heap with `N` elements, what are the time complexities for `insert(val)` and `extractMin()` respectively?",
        diff: "medium",
        sub: "Heaps & Priority Queues",
        ans: "O(log N) for insert, and O(log N) for extractMin.",
        wrong: [
          "O(1) for insert, and O(N) for extractMin.",
          "O(N) for insert, and O(1) for extractMin.",
          "O(log N) for insert, and O(1) for extractMin."
        ],
        exp: "Inserting bubbles up in O(log N); extracting min replaces root with the last leaf and sifts down in O(log N)."
      },
      {
        q: "What is the primary advantage of an AVL Tree over a standard Binary Search Tree (BST)?",
        diff: "medium",
        sub: "Self-Balancing Trees",
        ans: "It guarantees strict O(log N) worst-case search, insert, and delete by maintaining a height balance factor difference <= 1 via rotations.",
        wrong: [
          "It uses zero pointers in memory.",
          "It allows storing duplicate keys without hash collisions.",
          "It stores data directly on GPU VRAM."
        ],
        exp: "Standard BSTs can degenerate into O(N) linked lists; AVL trees enforce height balance via tree rotations."
      },
      {
        q: "How does a Hash Table resolve collisions using the Open Addressing with Linear Probing strategy?",
        diff: "medium",
        sub: "Hash Tables",
        ans: "When a collision occurs at index `i`, it sequentially checks index `(i + 1) % capacity` until an empty slot is located.",
        wrong: [
          "It appends the colliding item to a linked list at the original bucket index.",
          "It deletes the previously stored item immediately.",
          "It doubles the hash key mathematically."
        ],
        exp: "Linear probing steps sequentially through table slots until an open bucket is found."
      },
      {
        q: "What is the time complexity of Dijkstra's algorithm for Single-Source Shortest Path using an adjacency list and a Binary Heap?",
        diff: "hard",
        sub: "Graph Algorithms",
        ans: "O((V + E) log V)",
        wrong: [
          "O(V²)",
          "O(V * E)",
          "O(V + E)"
        ],
        exp: "Each vertex extract-min takes O(log V) and each edge relaxation takes O(log V) in a binary heap, yielding O((V + E) log V)."
      },
      {
        q: "In string searching, what is the key insight of the Knuth-Morris-Pratt (KMP) pattern matching algorithm?",
        diff: "hard",
        sub: "String Algorithms",
        ans: "It precomputes a Longest Proper Prefix which is also a Suffix (LPS) array to skip re-comparing characters that already matched upon mismatch.",
        wrong: [
          "It converts strings into SHA-256 hashes and compares them.",
          "It sorts the text string alphabetically before searching.",
          "It reverses the pattern and searches backwards."
        ],
        exp: "The LPS array tells KMP the next characters to examine without backtracking the text index."
      },
      {
        q: "What is the space complexity of Depth-First Search (DFS) on a binary tree of height `H` implemented with recursion?",
        diff: "easy",
        sub: "Tree Traversal",
        ans: "O(H) auxiliary space due to the recursive call stack.",
        wrong: [
          "O(1) constant space always.",
          "O(N²) quadratic space.",
          "O(2^H) exponential space."
        ],
        exp: "The maximum call stack depth corresponds to the maximum height of the tree H."
      },
      {
        q: "What is the Master Theorem used for in algorithm analysis?",
        diff: "medium",
        sub: "Complexity Analysis",
        ans: "Providing an asymptotic bound for divide-and-conquer recurrences of the form T(n) = a*T(n/b) + f(n).",
        wrong: [
          "Proving that P = NP.",
          "Calculating the exact battery usage of mobile apps.",
          "Measuring network bandwidth between microservices."
        ],
        exp: "Master theorem gives direct Big-O bounds for recurrence relations in divide-and-conquer algorithms like MergeSort."
      },
      {
        q: "Why is MergeSort preferred over QuickSort for sorting linked lists?",
        diff: "medium",
        sub: "Sorting & Data Structures",
        ans: "Linked lists allow merging two sorted halves in O(1) auxiliary space without random access, whereas QuickSort requires slow traversal.",
        wrong: [
          "QuickSort cannot sort elements larger than zero.",
          "MergeSort takes O(1) total time on linked lists.",
          "Linked lists do not allow pointer manipulation."
        ],
        exp: "Linked lists cannot be indexed randomly in O(1); MergeSort accesses elements sequentially and merges in-place."
      },
      {
        q: "What data structure is used to detect cycles and manage disjoint subsets in Kruskal's Minimum Spanning Tree algorithm?",
        diff: "hard",
        sub: "Advanced Data Structures",
        ans: "Disjoint Set Union (Union-Find) with path compression and union by rank.",
        wrong: [
          "Red-Black Tree.",
          "FIFO Queue.",
          "Suffix Automaton."
        ],
        exp: "Union-Find provides nearly O(1) amortized alpha(V) time to check if two vertices belong to the same connected component."
      },
      {
        q: "What is the maximum number of edges in an undirected simple graph with `V` vertices?",
        diff: "easy",
        sub: "Graph Theory",
        ans: "V * (V - 1) / 2",
        wrong: [
          "V²",
          "2 * V",
          "2^V"
        ],
        exp: "Each vertex can connect to V-1 other vertices; dividing by 2 avoids double-counting undirected edges."
      },
      {
        q: "What algorithmic technique is utilized in finding the Longest Common Subsequence (LCS) between two strings?",
        diff: "medium",
        sub: "Dynamic Programming",
        ans: "2D Dynamic Programming table comparing prefix substrings in O(M * N) time.",
        wrong: [
          "Greedy character matching from left to right.",
          "Binary Search over string permutations.",
          "Randomized Monte Carlo sampling."
        ],
        exp: "LCS evaluates DP[i][j] = DP[i-1][j-1] + 1 if characters match, else max(DP[i-1][j], DP[i][j-1])."
      },
      {
        q: "What is the time complexity of searching for an element in a balanced Trie (Prefix Tree) with key length `L`?",
        diff: "easy",
        sub: "Tries & Trees",
        ans: "O(L) proportional to the length of the search word, independent of the total number of words in the Trie.",
        wrong: [
          "O(N) where N is the number of keys stored.",
          "O(N log L)",
          "O(L²)"
        ],
        exp: "Trie lookups traverse one node per character in the search string, taking O(L) steps regardless of total keys stored."
      }
    ]
  },
  {
    id: "cloud_devops",
    prefix: "cloud",
    category: "technical",
    skillTag: "Cloud, DevOps & Distributed Systems",
    questions: [
      {
        q: "In the Raft consensus algorithm, how does a cluster guarantee safety and prevent split-brain leader commits during a network partition?",
        diff: "hard",
        sub: "Consensus & Raft",
        ans: "Writes require majority quorum confirmation (N/2 + 1 nodes); a minority partition cannot commit log entries.",
        wrong: [
          "Any isolated node can commit writes locally and reconcile later via eventual consistency.",
          "Raft requires 100% unanimous agreement from all nodes before acknowledging any write.",
          "Leaders are elected strictly using physical hardware timestamp comparisons."
        ],
        exp: "A Raft leader must receive write acknowledgments from a strict majority quorum (N/2 + 1) of active nodes before committing."
      },
      {
        q: "What is the primary difference between a Kubernetes `Deployment` and a `StatefulSet`?",
        diff: "medium",
        sub: "Kubernetes Core",
        ans: "StatefulSets provide stable, persistent network identities and dedicated storage ordinals; Deployments manage stateless interchangeable pods.",
        wrong: [
          "Deployments run on Linux only; StatefulSets run on Windows nodes.",
          "StatefulSets do not support rolling updates.",
          "Deployments bypass cluster ingress controllers."
        ],
        exp: "StatefulSet maintains persistent unique network identifiers and dedicated PersistentVolumes for each replica ordinal (pod-0, pod-1)."
      },
      {
        q: "What does the CAP Theorem state regarding distributed data stores under a network partition?",
        diff: "easy",
        sub: "Distributed Systems Theory",
        ans: "In the presence of a network partition (P), a system must trade off between strict Consistency (C) or Availability (A).",
        wrong: [
          "A distributed system can easily guarantee 100% of all three properties simultaneously.",
          "Network partitions can never happen in modern cloud providers.",
          "Consistency must always be sacrificed before Performance."
        ],
        exp: "When network partitions occur, distributed nodes must choose between returning errors (Consistency) or stale data (Availability)."
      },
      {
        q: "Why are Multi-Stage Docker builds recommended for production container images?",
        diff: "medium",
        sub: "Docker & Containers",
        ans: "They separate build tools/compilers from the final runtime image, resulting in dramatically smaller image sizes and reduced attack surface.",
        wrong: [
          "They allow running Windows containers inside Linux kernels natively.",
          "They bypass all Docker security vulnerabilities automatically.",
          "They eliminate the need for container registries."
        ],
        exp: "Multi-stage builds copy only compiled artifacts into a lightweight base image (like Alpine or distroless)."
      },
      {
        q: "In CI/CD pipelines, what is the Canary Deployment deployment strategy?",
        diff: "medium",
        sub: "CI/CD & Deployment",
        ans: "Gradually routing a small percentage of real production traffic (e.g. 5%) to the new release to monitor metrics before full rollout.",
        wrong: [
          "Deploying code to a staging server that is turned off immediately.",
          "Replacing 100% of servers at once without testing.",
          "Compiling code exclusively on canary hardware devices."
        ],
        exp: "Canary deployments expose changes to a small fraction of users to verify error rates and latency before global rollout."
      },
      {
        q: "What is the function of an Ingress Controller in a Kubernetes cluster?",
        diff: "medium",
        sub: "Kubernetes Networking",
        ans: "Managing external HTTP/HTTPS traffic routing to internal cluster Services based on hostnames and URL path rules.",
        wrong: [
          "Backing up etcd snapshots to Amazon S3.",
          "Encrypting hard drives on worker nodes.",
          "Scheduling cron jobs inside pods."
        ],
        exp: "Ingress provides L7 routing, SSL termination, and virtual hosting for services inside Kubernetes."
      },
      {
        q: "In Terraform and Infrastructure as Code (IaC), what is the purpose of the State file (`terraform.tfstate`)?",
        diff: "easy",
        sub: "Terraform & IaC",
        ans: "It maps real-world provisioned cloud resources to your configuration files and tracks resource metadata and dependencies.",
        wrong: [
          "It stores client credit card numbers for cloud billing.",
          "It generates Docker containers automatically.",
          "It converts Terraform code into bash shell scripts."
        ],
        exp: "Terraform state acts as the source of truth linking declarative HCL code to physical cloud provider IDs."
      },
      {
        q: "What is the primary motivation for implementing Distributed Tracing (e.g. OpenTelemetry / Jaeger) in microservices?",
        diff: "medium",
        sub: "Observability",
        ans: "Tracking the lifecycle and latency of a single request as it traverses across multiple microservice boundaries and databases.",
        wrong: [
          "Tracing GPS coordinates of developer laptops.",
          "Encrypting microservice source code repositories.",
          "Automating git commits across branches."
        ],
        exp: "Distributed tracing propagates trace and span IDs across HTTP/gRPC boundaries to pinpoint latency bottlenecks."
      },
      {
        q: "What is a Circuit Breaker pattern used for in microservice communications?",
        diff: "hard",
        sub: "Resilience Patterns",
        ans: "Detecting service failures and instantly failing fast without waiting for timeouts, preventing cascading failures across the system.",
        wrong: [
          "Cutting physical electrical power to overheated server racks.",
          "Preventing users from signing up with disposable emails.",
          "Blocking all inbound HTTP requests when CPU reaches 50%."
        ],
        exp: "Circuit breakers trip to an 'Open' state when downstream error rates cross a threshold, giving the failing service time to recover."
      },
      {
        q: "In Kubernetes, what happens when a Pod's container exceeds its memory `limits` (cgroup OOM)?",
        diff: "easy",
        sub: "Kubernetes Pod Lifecycle",
        ans: "The Linux kernel OOM killer terminates the container process, and Kubernetes restarts the pod with status OOMKilled.",
        wrong: [
          "Kubernetes automatically buys more RAM from AWS.",
          "The pod continues running with throttled CPU.",
          "The node reboots immediately."
        ],
        exp: "Exceeding memory limits triggers kernel cgroup out-of-memory termination (Exit Code 137 / OOMKilled)."
      },
      {
        q: "What is the role of `etcd` in the Kubernetes control plane?",
        diff: "medium",
        sub: "Kubernetes Internals",
        ans: "A consistent, highly-available distributed key-value store used as Kubernetes' backing store for all cluster state and data.",
        wrong: [
          "A load balancer for frontend client requests.",
          "A container runtime alternative to containerd.",
          "An email server for sending alerts."
        ],
        exp: "etcd uses the Raft consensus algorithm to store all configuration, secrets, and pod specifications for Kubernetes."
      },
      {
        q: "What does GitOps (e.g. ArgoCD / Flux) enforce in cloud-native infrastructure management?",
        diff: "medium",
        sub: "GitOps & Delivery",
        ans: "Using a Git repository as the single declarative source of truth, with automated agents reconciling live cluster state to match Git.",
        wrong: [
          "Banning developers from using git branches.",
          "Writing code exclusively in markdown files.",
          "Running git servers inside Docker containers on localhost."
        ],
        exp: "GitOps continuously pulls declarative manifests from Git and applies diffs to the target Kubernetes clusters."
      },
      {
        q: "In distributed systems, what is the role of a Reverse Proxy (such as Nginx or Envoy)?",
        diff: "easy",
        sub: "Cloud Networking",
        ans: "Sitting in front of backend servers to handle SSL termination, load balancing, caching, and compression for incoming client traffic.",
        wrong: [
          "Sitting on client machines to bypass corporate firewalls.",
          "Compiling TypeScript code into web bundles.",
          "Storing persistent relational database tables."
        ],
        exp: "Reverse proxies intercept client requests and distribute them across internal upstream web application servers."
      },
      {
        q: "What is Chaos Engineering (e.g. Chaos Monkey) intended to achieve in cloud infrastructure?",
        diff: "medium",
        sub: "Site Reliability & Cloud",
        ans: "Proactively injecting pseudo-random infrastructure failures (killing instances, adding latency) to test resilience under unexpected outages.",
        wrong: [
          "Corrupting user passwords to test encryption algorithms.",
          "Deploying untested code directly into production at midnight.",
          "Deleting git repositories permanently."
        ],
        exp: "Chaos engineering proves that high-availability failover and redundancy mechanisms work correctly in practice."
      },
      {
        q: "What does Horizontal Pod Autoscaling (HPA) in Kubernetes monitor to scale pod replicas up or down?",
        diff: "easy",
        sub: "Kubernetes Autoscaling",
        ans: "Observed CPU/memory utilization or custom Prometheus metrics against configured target thresholds.",
        wrong: [
          "The physical temperature of the server room.",
          "The number of lines of code in the deployment repository.",
          "The current price of Bitcoin."
        ],
        exp: "HPA adjusts the number of pod replicas dynamically based on resource usage metrics."
      }
    ]
  },
  {
    id: "cybersecurity",
    prefix: "sec",
    category: "technical",
    skillTag: "Cybersecurity & Web Defense",
    questions: [
      {
        q: "How does setting the `HttpOnly` flag on authentication session cookies mitigate client-side attacks?",
        diff: "medium",
        sub: "Web Security & Cookies",
        ans: "Prevents client-side scripts from reading document.cookie, protecting session tokens from XSS theft.",
        wrong: [
          "Encrypts all SQL database queries sent over HTTP.",
          "Blocks Cross-Origin Resource Sharing (CORS) preflight requests.",
          "Forces all incoming requests to use HTTP/2 multiplexing."
        ],
        exp: "HttpOnly prevents JavaScript execution context from reading the cookie value."
      },
      {
        q: "Why is verifying the cryptographic signature of a JSON Web Token (JWT) on every incoming API request essential?",
        diff: "hard",
        sub: "Authentication & Cryptography",
        ans: "It guarantees that the claims in the token payload have not been forged or tampered with in transit.",
        wrong: [
          "It automatically decrypts hidden passwords inside the header.",
          "It prevents database deadlocks during high-concurrency requests.",
          "It compresses the HTTP payload size by 50%."
        ],
        exp: "JWT signatures verify integrity and authenticity using a shared secret (HMAC) or public/private key pair."
      },
      {
        q: "What is a Stored (Persistent) Cross-Site Scripting (XSS) attack?",
        diff: "easy",
        sub: "OWASP Top 10",
        ans: "Malicious script injected by an attacker is permanently stored in the application database and executed by victims viewing that stored content.",
        wrong: [
          "An attacker intercepting Wi-Fi radio frequencies outside a building.",
          "A brute-force attack on SSH root credentials.",
          "A DNS spoofing attack redirecting domain traffic."
        ],
        exp: "Stored XSS occurs when untrusted input is saved to a database and served to other users without HTML entity escaping."
      },
      {
        q: "How does Cross-Site Request Forgery (CSRF) differ fundamentally from Cross-Site Scripting (XSS)?",
        diff: "medium",
        sub: "Web Security Fundamentals",
        ans: "CSRF exploits user trust in an authenticated browser session to execute unauthorized actions; XSS exploits user trust in an application to execute arbitrary JavaScript.",
        wrong: [
          "CSRF only attacks mobile applications while XSS attacks desktop browsers.",
          "XSS requires physical access to the server room.",
          "There is no difference; CSRF is simply the 2024 name for XSS."
        ],
        exp: "CSRF tricks the browser into sending authenticated requests with ambient cookies; XSS injects code into the victim's DOM."
      },
      {
        q: "What defense mechanism reliably eliminates SQL Injection vulnerabilities across modern application backends?",
        diff: "easy",
        sub: "Secure Coding",
        ans: "Using Parameterized Queries (Prepared Statements) or Object-Relational Mappers (ORMs) that treat user input strictly as parameters.",
        wrong: [
          "Writing SQL queries in capital letters.",
          "Filtering out single quote characters with client-side regex.",
          "Running the database on port 80 instead of 5432."
        ],
        exp: "Prepared statements send the query template and variables separately to the SQL compiler, neutralizing malicious code payloads."
      },
      {
        q: "In cryptography, what is the primary purpose of Salt in password hashing (e.g. bcrypt/argon2)?",
        diff: "medium",
        sub: "Password Security",
        ans: "To prevent precomputed Rainbow Table attacks and ensure identical passwords produce unique hash digests.",
        wrong: [
          "To shorten the password string for faster database storage.",
          "To decrypt the password whenever the user forgets it.",
          "To allow passwords to be shared securely via email."
        ],
        exp: "A unique salt added to each password ensures two users with identical passwords have completely different cryptographic hashes."
      },
      {
        q: "What does the Zero Trust security model mandate across modern enterprise networks?",
        diff: "medium",
        sub: "Security Architecture",
        ans: "'Never trust, always verify' - every access request must be explicitly authenticated, authorized, and encrypted regardless of network location.",
        wrong: [
          "Trusting all internal office corporate Wi-Fi connections unconditionally.",
          "Banning employees from using two-factor authentication.",
          "Disabling firewalls between internal microservices."
        ],
        exp: "Zero Trust assumes threats exist inside and outside perimeter perimeters, requiring continuous micro-segmentation and authentication."
      },
      {
        q: "What vulnerability occurs when an application exposes a direct reference to an internal database object ID in the URL without authorization checks?",
        diff: "medium",
        sub: "OWASP Top 10",
        ans: "Insecure Direct Object Reference (IDOR) / Broken Object Level Authorization (BOLA).",
        wrong: [
          "Server-Side Request Forgery (SSRF).",
          "Buffer Overflow.",
          "Denial of Service (DoS)."
        ],
        exp: "IDOR/BOLA allows an attacker to change an ID parameter in a request (e.g. /api/user/102 to /api/user/103) to access unauthorized records."
      },
      {
        q: "What is the purpose of Content Security Policy (CSP) headers in modern web applications?",
        diff: "medium",
        sub: "Defense in Depth",
        ans: "Restricting the domains from which scripts, styles, images, and fonts can be loaded and preventing unauthorized inline script execution.",
        wrong: [
          "Preventing web crawlers from indexing website content.",
          "Forcing user passwords to be at least 16 characters long.",
          "Enabling automatic cloud backups of database tables."
        ],
        exp: "CSP allows site operators to restrict valid sources of executable scripts, stopping malicious inline XSS payloads from executing."
      },
      {
        q: "What is a Server-Side Request Forgery (SSRF) attack and what is a frequent high-impact target in cloud environments?",
        diff: "hard",
        sub: "Cloud Security",
        ans: "An attacker tricks the server into making HTTP requests to internal resources, frequently targeting Cloud Instance Metadata Services (169.254.169.254) to steal IAM credentials.",
        wrong: [
          "An attacker uploading virus files to an Amazon S3 bucket.",
          "An attacker sniffing Wi-Fi packets at an airport.",
          "An attacker generating fake SSL certificates using Let's Encrypt."
        ],
        exp: "SSRF exploits server-side URL fetching to probe internal networks and access the cloud instance metadata endpoint."
      },
      {
        q: "What is the cryptographic difference between Symmetric Encryption (e.g. AES-GCM) and Asymmetric Encryption (e.g. RSA-4096)?",
        diff: "easy",
        sub: "Applied Cryptography",
        ans: "Symmetric uses the same secret key for both encryption and decryption; Asymmetric uses a mathematically linked public-private key pair.",
        wrong: [
          "Symmetric encryption cannot encrypt text files.",
          "Asymmetric encryption requires no keys at all.",
          "Symmetric encryption is only used on military hardware."
        ],
        exp: "AES uses one shared secret key (fast); RSA/ECC uses public key for encryption/verification and private key for decryption/signing."
      },
      {
        q: "Why is the `SameSite=Strict` or `SameSite=Lax` cookie attribute effective against CSRF attacks?",
        diff: "medium",
        sub: "Web Defense",
        ans: "It instructs the browser not to send the cookie in cross-site requests initiated by third-party websites.",
        wrong: [
          "It deletes the cookie as soon as the user closes their browser tab.",
          "It blocks the user from opening more than one browser tab.",
          "It replaces HTTPS with SSL v3."
        ],
        exp: "SameSite prevents browser cookies from being attached to malicious requests triggered by external cross-site origins."
      },
      {
        q: "What security risk arises from setting `Access-Control-Allow-Origin: *` in conjunction with `Access-Control-Allow-Credentials: true`?",
        diff: "hard",
        sub: "CORS Misconfigurations",
        ans: "Browsers strictly reject this combination as invalid per CORS specification; however, reflecting arbitrary origins allows any website to steal authenticated data.",
        wrong: [
          "It speeds up network latency by 50%.",
          "It converts all POST requests into GET requests.",
          "It shuts down the web server automatically."
        ],
        exp: "Browsers prohibit wildcard origin with credentials; servers that dynamically reflect Origin headers open users to credential theft."
      },
      {
        q: "What is Rate Limiting / Throttling designed to defend against in API security?",
        diff: "easy",
        sub: "API Protection",
        ans: "Preventing brute-force credential stuffing, API scraping, and denial-of-service abuse by capping requests per client IP / token.",
        wrong: [
          "Stopping users from downloading high-resolution images.",
          "Filtering out misspelled words in API search inputs.",
          "Restricting server CPU clock speeds to save electricity."
        ],
        exp: "Rate limiting prevents attackers from flooding endpoints or trying thousands of passwords per second."
      },
      {
        q: "In Public Key Infrastructure (PKI), what is a Certificate Revocation List (CRL) or OCSP used for?",
        diff: "hard",
        sub: "TLS & PKI",
        ans: "Checking whether an SSL/TLS certificate has been revoked by the Certificate Authority prior to its scheduled expiration date.",
        wrong: [
          "Encrypting user passwords during database migrations.",
          "Converting HTTP/1 into HTTP/3.",
          "Scanning source code for unused variables."
        ],
        exp: "CRL and OCSP (Online Certificate Status Protocol) check whether a compromised or invalid certificate has been revoked."
      }
    ]
  },
  {
    id: "data_analytics",
    prefix: "da",
    category: "technical",
    skillTag: "Data Science & Analytics",
    questions: [
      {
        q: "In Python Pandas, what is the key performance difference between `df.apply(fn, axis=1)` and vectorized column operations (e.g. `df['a'] + df['b']`)?",
        diff: "medium",
        sub: "Pandas & Performance",
        ans: "Vectorized operations execute compiled C/NumPy loops in contiguous memory; apply(axis=1) iterates row-by-row in Python with massive overhead.",
        wrong: [
          "apply(axis=1) is multi-threaded while vectorization is single-threaded.",
          "They have identical performance characteristics.",
          "Vectorized operations cannot operate on numeric columns."
        ],
        exp: "apply(axis=1) passes series objects row-by-row in Python interpreter space, whereas vectorized math runs in compiled C."
      },
      {
        q: "What does a P-value of 0.03 indicate in statistical hypothesis testing at a significance level of alpha = 0.05?",
        diff: "medium",
        sub: "Statistical Inference",
        ans: "The result is statistically significant; there is sufficient evidence to reject the Null Hypothesis in favor of the Alternative.",
        wrong: [
          "The Null Hypothesis is 100% mathematically proven to be true.",
          "The test was flawed and must be re-run with more samples.",
          "The probability of the alternative hypothesis is exactly 3%."
        ],
        exp: "When p < alpha (0.03 < 0.05), we reject the null hypothesis because the observed effect is unlikely under the null distribution."
      },
      {
        q: "In exploratory data analysis, when is the Median preferred over the Mean as a measure of central tendency?",
        diff: "easy",
        sub: "Descriptive Statistics",
        ans: "When the dataset is skewed or contains extreme outliers that disproportionately distort the mean.",
        wrong: [
          "When the dataset follows a perfectly symmetric Gaussian normal distribution.",
          "When all numbers in the dataset are integers under 10.",
          "When there are zero missing values."
        ],
        exp: "The median is robust to extreme outliers, whereas the arithmetic mean is sensitive to extreme values."
      },
      {
        q: "What does the Interquartile Range (IQR) quantify in a dataset?",
        diff: "easy",
        sub: "Data Dispersion",
        ans: "The spread of the middle 50% of data points, calculated as Q3 (75th percentile) minus Q1 (25th percentile).",
        wrong: [
          "The total sum of all numbers divided by the sample count.",
          "The difference between the maximum and minimum values.",
          "The square root of the population variance."
        ],
        exp: "IQR = Q3 - Q1 represents the statistical dispersion of the middle half of ordered data."
      },
      {
        q: "What does the Pearson Correlation Coefficient `r = -0.87` signify between two continuous variables?",
        diff: "easy",
        sub: "Correlation Analysis",
        ans: "A strong negative linear relationship: as one variable increases, the other tends to decrease linearly.",
        wrong: [
          "No relationship exists between the two variables.",
          "Variable A directly causes Variable B to decrease.",
          "An 87% chance of calculation error."
        ],
        exp: "Pearson r values close to -1 indicate a strong inverse linear correlation (note: correlation does not imply causation)."
      },
      {
        q: "In feature engineering, what is the purpose of One-Hot Encoding for nominal categorical features?",
        diff: "medium",
        sub: "Feature Engineering",
        ans: "Converting categorical categories into binary indicator columns (0 or 1) without imposing an artificial ordinal relationship.",
        wrong: [
          "Compressing large datasets into ZIP archives.",
          "Converting continuous float numbers into integers.",
          "Removing duplicate rows from the dataset."
        ],
        exp: "One-hot encoding avoids models interpreting category numbers (e.g. red=1, green=2, blue=3) as a mathematical rank."
      },
      {
        q: "What is the Central Limit Theorem (CLT) and why is it fundamental in statistics?",
        diff: "medium",
        sub: "Probability Theory",
        ans: "The distribution of sample means approximates a normal distribution as sample size grows (n >= 30), regardless of the underlying population distribution.",
        wrong: [
          "All datasets in nature follow a uniform flat distribution.",
          "The median of a dataset is always equal to the mode.",
          "Machine learning models always converge in 30 epochs."
        ],
        exp: "CLT allows statisticians to use normal distribution properties for hypothesis testing and confidence intervals on sample means."
      },
      {
        q: "In linear regression analysis, what does the R-squared (R²) metric represent?",
        diff: "medium",
        sub: "Regression Analysis",
        ans: "The proportion of variance in the dependent target variable that is explained by the independent predictor variables.",
        wrong: [
          "The average absolute error in prediction units.",
          "The probability that the model will overfit in production.",
          "The number of features included in the regression model."
        ],
        exp: "R^2 measures goodness of fit: 1.0 means the model explains 100% of the variance; 0 means it explains none."
      },
      {
        q: "What is Simpson's Paradox in statistical data analysis?",
        diff: "hard",
        sub: "Statistical Paradoxes",
        ans: "A trend or correlation observed within several separate groups disappears or reverses when the groups are combined.",
        wrong: [
          "A bug where SQL queries return negative counts.",
          "When training error is lower than validation error.",
          "When the mean is higher than the standard deviation."
        ],
        exp: "Simpson's paradox arises when a confounding variable or lurking factor alters the apparent relationship across aggregated subsets."
      },
      {
        q: "How should Missing Data (NaNs) be handled when values are Missing Not at Random (MNAR)?",
        diff: "hard",
        sub: "Data Cleaning",
        ans: "Investigating the underlying mechanism causing non-response, modeling the probability of missingness, or creating explicit indicator flags rather than naive mean imputation.",
        wrong: [
          "Replacing all missing values with zero blindly.",
          "Deleting 100% of columns containing any NaN values.",
          "Ignoring the column and running k-means clustering."
        ],
        exp: "When data is MNAR, missingness is related to the unobserved value itself; naive mean filling introduces severe statistical bias."
      },
      {
        q: "What is the difference between Min-Max Scaling and Standardization (Z-score scaling)?",
        diff: "medium",
        sub: "Data Normalization",
        ans: "Min-Max scales features into a fixed [0, 1] range; Standardization centers features around mean=0 with standard deviation=1.",
        wrong: [
          "Min-Max scaling only works on string variables.",
          "Standardization converts negative numbers into positive numbers.",
          "They are identical mathematical functions."
        ],
        exp: "Min-max transforms values to (x - min) / (max - min); Z-score transforms values to (x - mean) / std."
      },
      {
        q: "In A/B testing, what is the minimum required element to calculate the required Sample Size before running an experiment?",
        diff: "medium",
        sub: "A/B Testing",
        ans: "Baseline conversion rate, Minimum Detectable Effect (MDE), statistical power (1 - beta), and significance level (alpha).",
        wrong: [
          "The total revenue of the company.",
          "The exact number of visitors in the next 12 months.",
          "The programming language used to build the website."
        ],
        exp: "Sample size calculation requires alpha, desired power (typically 80%), baseline rate, and the smallest effect size you care to detect."
      },
      {
        q: "What is multicollinearity in multiple linear regression and why is it problematic?",
        diff: "hard",
        sub: "Regression Diagnostics",
        ans: "High correlation between two or more independent predictor variables, inflating standard errors and destabilizing coefficient estimates.",
        wrong: [
          "When the target variable is completely non-numeric.",
          "When the regression line passes through the origin.",
          "When data is collected over multiple consecutive days."
        ],
        exp: "Multicollinearity makes it difficult to assess the individual effect of each predictor on the target variable."
      },
      {
        q: "In SQL and data warehouse analytics, what is a Cumulative Sum (Running Total) query pattern?",
        diff: "medium",
        sub: "Analytical SQL",
        ans: "SUM(revenue) OVER (ORDER BY transaction_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)",
        wrong: [
          "SELECT COUNT(DISTINCT revenue) FROM transactions GROUP BY date",
          "SELECT MAX(revenue) - MIN(revenue) FROM transactions",
          "SELECT AVG(revenue) FROM transactions HAVING date > '2024-01-01'"
        ],
        exp: "Window function SUM() with unbounded preceding frame computes running balances over time."
      },
      {
        q: "What is the purpose of a Box Plot (Box-and-Whisker plot) in data visualization?",
        diff: "easy",
        sub: "Data Visualization",
        ans: "Displaying the 5-number summary (Min, Q1, Median, Q3, Max) and visually highlighting potential outliers.",
        wrong: [
          "Displaying geographical heatmaps of GPS locations.",
          "Showing real-time stock price ticker tickers.",
          "Comparing relational database foreign keys."
        ],
        exp: "Box plots provide a concise visual summary of distribution shape, skewness, and outliers beyond whiskers (1.5 * IQR)."
      }
    ]
  }
];

// Generate the remaining 10 subjects programmatically with 15 rich questions each:
const remainingSubjects = [
  {
    id: "blockchain_web3",
    prefix: "bc",
    category: "technical",
    skillTag: "Blockchain & Web3",
    subTopics: ["Smart Contract Security", "EVM Gas Optimization", "Solidity Core", "Consensus & Proof of Stake", "DeFi Protocols"],
    specs: [
      { q: "How does the Checks-Effects-Interactions pattern prevent Reentrancy attacks in Ethereum Solidity smart contracts?", ans: "It mutates internal state/balances before transferring funds or calling external contracts.", wrong: ["It encrypts the contract bytecode with AES-256 before EVM execution.", "It restricts gas limits to 21,000 for all contract function calls.", "It forces transactions to execute on Layer-2 Polygon rollups only."], exp: "Updating balances before external calls prevents malicious fallback functions from draining contracts recursively." },
      { q: "In Ethereum EVM, what is the difference between `storage` and `memory` variable locations in Solidity?", ans: "storage is persistent and permanently written to the blockchain; memory is temporary and erased after function execution.", wrong: ["memory is stored on IPFS permanently; storage is cached in RAM.", "storage is free; memory costs 100,000 gas per byte.", "There is no difference in EVM bytecode."], exp: "Storage persists on chain with high gas cost; memory is transient heap data discarded when the call ends." },
      { q: "What does the `external` visibility specifier provide over `public` for Solidity functions?", ans: "External functions can be more gas-efficient when receiving large array arguments because data can be read directly from calldata without memory copying.", wrong: ["External functions cannot be called from outside the blockchain.", "External functions can only be executed by Ethereum miners.", "External functions do not require gas to execute."], exp: "Calldata avoids allocating memory for function arguments when invoked externally." },
      { q: "What is an ERC-20 `approve` and `transferFrom` front-running race condition attack?", ans: "An attacker observes a pending allowance change in the mempool and front-runs it to spend both the old and new allowances.", wrong: ["An attacker deleting the token contract from the blockchain.", "An attacker generating unlimited private keys with quantum computers.", "An attacker minting tokens without paying gas fees."], exp: "The classic ERC-20 approve race condition allows an attacker to front-run the allowance change transaction." },
      { q: "How does Proof of Stake (PoS) achieve Sybil resistance compared to Proof of Work (PoW)?", ans: "By requiring validators to bond economic capital (tokens) that can be slashed for malicious behavior rather than expending physical electricity.", wrong: ["By solving SHA-256 mathematical puzzles on ASIC hardware.", "By requiring validators to upload government-issued passport IDs.", "By giving control to the fastest internet connection."], exp: "PoS uses locked financial stake and slashing conditions to disincentivize malicious validation." },
      { q: "What is the purpose of a Merkle Tree in blockchain transaction verification?", ans: "Enabling efficient and cryptographic proof (Merkle Proofs) that a transaction is included in a block in O(log N) space without downloading the full block.", wrong: ["Encrypting smart contract code so users cannot see it.", "Storing user passwords securely on IPFS.", "Calculating the current exchange rate of cryptocurrencies."], exp: "Merkle trees allow light clients to verify transaction inclusion with a logarithmic hash proof path." },
      { q: "What does `tx.origin` represent in Solidity and why should it NEVER be used for authorization checks?", ans: "tx.origin is the original external account that initiated the transaction call chain, making contracts vulnerable to phishing attacks via intermediary contracts.", wrong: ["tx.origin is the address of the Ethereum miner.", "tx.origin is deprecated and causes compile errors in Solidity 0.8+.", "tx.origin can only be accessed in view functions."], exp: "A malicious contract can trick an authorized user into calling it, which then calls the vulnerable contract using the user's tx.origin." },
      { q: "In EVM gas optimization, why is packing multiple `uint128` variables into a single struct slot beneficial?", ans: "EVM operates in 32-byte (256-bit) storage slots; packing variables allows saving to a single SSTORE operation (costing ~20,000 gas once instead of twice).", wrong: ["It reduces the smart contract file size on disk.", "It speeds up client JavaScript compilation in the browser.", "It eliminates all transaction fees for users."], exp: "SSTORE is expensive; packing smaller primitives into 256-bit boundaries saves gas by reusing storage slots." },
      { q: "What is a Flash Loan in decentralized finance (DeFi)?", ans: "An uncollateralized loan that must be borrowed and completely repaid with interest within the exact same atomic blockchain transaction.", wrong: ["A 30-year mortgage issued by a traditional commercial bank.", "A micro-loan sent to mobile phone SIM cards via SMS.", "A loan that requires 500% over-collateralization in physical gold."], exp: "If a flash loan is not repaid by the end of the transaction, the entire transaction reverts as if nothing happened." },
      { q: "What makes ECDSA signature replay attacks possible if signatures lack a `nonce` or `chainId`?", ans: "An attacker can capture a valid signature and replay it on another contract or different blockchain network to duplicate the unauthorized action.", wrong: ["Signatures become invalid after 10 minutes automatically.", "The private key is exposed publicly on Etherscan.", "The signature causes a compiler syntax error."], exp: "EIP-712 and domain separators incorporate chainId, contract address, and nonces to prevent cross-contract replay." },
      { q: "What is an EVM 'Selfdestruct' opcode (and why was its behavior modified in recent hard forks)?", ans: "It removes bytecode and storage from the blockchain and forwards contract ether; modified to prevent state clearing abuse and support future Verkle trees.", wrong: ["It physically destroys the validator's computer hardware.", "It resets the Ethereum network genesis block.", "It burns all ether in existence."], exp: "Dencun hard fork restricted SELFDESTRUCT to only destroy contracts created in the exact same transaction." },
      { q: "What is the primary trade-off of using an Optimistic Rollup (e.g. Arbitrum/Optimism) compared to a ZK-Rollup (e.g. zkSync/Starknet)?", ans: "Optimistic rollups require a 7-day fraud-proof challenge withdrawal window, whereas ZK-rollups provide instant cryptographic finality using zero-knowledge validity proofs.", wrong: ["Optimistic rollups do not run on Ethereum.", "ZK-rollups require miners to burn physical coal.", "Optimistic rollups cannot execute smart contracts."], exp: "Optimistic rollups assume transactions are valid unless challenged during the dispute window; ZK rollups prove mathematical validity upfront." },
      { q: "What does the `view` function modifier indicate in Solidity?", ans: "The function promises not to modify contract state (reads only) and can be executed locally without generating a transaction or costing gas when called off-chain.", wrong: ["The function can only be viewed by the contract owner.", "The function renders an HTML page on the screen.", "The function writes data directly to the blockchain mempool."], exp: "view functions read state without writing to storage; off-chain calls through node RPCs are free." },
      { q: "How does Solidity 0.8+ handle integer arithmetic overflow and underflow by default?", ans: "It automatically reverts transactions with an assertion failure unless explicitly wrapped in an `unchecked { ... }` block.", wrong: ["It wraps around silently (e.g. 0 - 1 becomes 2^256 - 1).", "It requires the SafeMath library to prevent overflow.", "It converts integers to floating point numbers."], exp: "Solidity 0.8+ integrated native overflow/underflow checks into the compiler, eliminating the need for SafeMath." },
      { q: "What is the purpose of an Oracle in blockchain smart contract architecture?", ans: "Bridging real-world off-chain data (e.g. asset prices, weather data) securely onto the deterministic blockchain environment.", wrong: ["Encrypting smart contract transactions on the peer-to-peer network.", "Issuing new cryptocurrency tokens to developers.", "Managing employee HR databases."], exp: "Blockchains cannot make outbound network calls; decentralized oracles (like Chainlink) feed external data into contracts." }
    ]
  },
  {
    id: "system_design",
    prefix: "sd",
    category: "technical",
    skillTag: "System Design & Architecture",
    subTopics: ["Distributed Caching", "Event Streaming", "Database Sharding", "Load Balancing", "Consistency Models"],
    specs: [
      { q: "Under the Cache-Aside pattern with Redis, what prevents race conditions between concurrent DB reads and DB updates?", ans: "Deleting the cache key upon DB write rather than updating cache value directly, combined with short TTLs.", wrong: ["Disabling database indexes on foreign keys.", "Using synchronous HTTP blocking locks on the client browser.", "Routing all read traffic directly to primary SQL leader node only."], exp: "Invalidating keys upon write forces subsequent reads to lazily re-fetch from the source of truth." },
      { q: "How does Consistent Hashing minimize data movement when scaling a distributed cache cluster from N to N+1 nodes?", ans: "By mapping nodes and keys onto a virtual circular hash ring, so adding a node only migrates K/N keys from its neighbor.", wrong: ["By copying all data to all nodes simultaneously.", "By wiping the cache completely and starting fresh.", "By using round-robin DNS lookups."], exp: "Consistent hashing bounds re-mapped keys to only those between the new node and its immediate successor on the ring." },
      { q: "In Apache Kafka, what guarantees strict message ordering within an event stream?", ans: "Ordering is strictly guaranteed within a single Topic Partition, but not across multiple partitions.", wrong: ["Kafka guarantees global ordering across all topics in the cluster.", "Messages are sorted alphabetically by payload text.", "Ordering is maintained only if consumer groups have 100+ instances."], exp: "Partitions are append-only ordered logs; messages with the same partition key preserve strict FIFO order." },
      { q: "What is the difference between Strong Consistency and Eventual Consistency in distributed data stores?", ans: "Strong consistency guarantees all clients see the latest write immediately; eventual consistency guarantees all replicas converge over time if no new updates occur.", wrong: ["Eventual consistency loses 50% of write data permanently.", "Strong consistency is impossible to implement in computer science.", "Eventual consistency requires quantum network cards."], exp: "Eventual consistency trades off immediate synchronous visibility for higher availability and partition tolerance." },
      { q: "In a high-throughput microservices architecture, what problem does the Token Bucket rate limiting algorithm solve?", ans: "It controls request rates while permitting short bursty traffic up to the bucket capacity without dropping requests.", wrong: ["It encrypts sensitive credit card transactions.", "It compresses video files into MP4 format.", "It monitors server chassis fan speed."], exp: "Token bucket refills tokens at a steady rate and accommodates bursts as long as tokens are available in the bucket." },
      { q: "What is the primary function of an API Gateway in microservice architectures?", ans: "Acting as a single reverse proxy entry point handling authentication, SSL termination, rate limiting, routing, and telemetry aggregation.", wrong: ["Replacing all relational databases with flat text files.", "Generating frontend React components automatically.", "Running continuous integration test suites."], exp: "An API gateway decouples client applications from internal microservice network topology and concerns." },
      { q: "What is the PACELC theorem an extension of in distributed system design?", ans: "The CAP theorem, stating that If there is a Partition (P) trade off Availability (A) vs Consistency (C); Else (E) trade off Latency (L) vs Consistency (C).", wrong: ["Moore's law of transistor scaling.", "Amortized Big-O algorithmic complexity.", "The OSI 7-layer networking model."], exp: "PACELC addresses normal non-partition operation, where systems must choose between latency and consistency." },
      { q: "Why is Database Read-Replication effective for scaling read-heavy architectures (e.g. social media feeds)?", ans: "Writes route to a primary leader node while asynchronous read replicas distribute read query loads across multiple instances.", wrong: ["It eliminates the need to create database backups.", "It prevents any network partition from occurring.", "It encrypts all database tables with AES-256."], exp: "Most web apps have a 99:1 read-to-write ratio; distributing read queries across read replicas offloads the primary database." },
      { q: "In distributed transaction management, what is the SAGA pattern?", ans: "A sequence of local transactions where each step publishes an event, and failures trigger compensating transactions to rollback partial state changes.", wrong: ["A monolithic database lock that freezes all servers for 1 hour.", "A technique for compressing JSON payloads in network transit.", "A hardware watchdog timer inside server motherboards."], exp: "Sagas manage distributed transactions across microservices without distributed two-phase commit (2PC) locks." },
      { q: "What causes a 'Cache Stampede' (Thundering Herd) and how can it be mitigated?", ans: "When a popular cache key expires, thousands of concurrent requests hit the database simultaneously; mitigated by mutex locks or probabilistic early expiration.", wrong: ["When Redis servers run out of hard drive space.", "When client browsers disable JavaScript cookies.", "When network cables are disconnected from server racks."], exp: "Mutex locks or early background recomputation prevent thousands of threads from overwhelming the DB when a hot key expires." },
      { q: "What is the difference between Horizontal Scaling (Scale-Out) and Vertical Scaling (Scale-Up)?", ans: "Horizontal scaling adds more machine instances to a cluster; vertical scaling upgrades existing machines with more CPU/RAM.", wrong: ["Vertical scaling is always cheaper than horizontal scaling.", "Horizontal scaling cannot be used with microservices.", "Vertical scaling requires distributed consensus algorithms."], exp: "Scale-out distributes workloads across multiple nodes; scale-up is bounded by single-chassis hardware limits." },
      { q: "What is a Content Delivery Network (CDN) primarily used for in high-scale systems?", ans: "Caching static assets and dynamic content at geographically distributed Edge Points of Presence (PoPs) close to end users to reduce latency.", wrong: ["Mining Bitcoin on user browser tabs.", "Replacing backend application logic entirely.", "Managing Kubernetes worker node lifecycles."], exp: "CDNs terminate TCP/TLS connections and serve cached media close to the user, drastically decreasing round-trip time." },
      { q: "In distributed logging and messaging, what is At-Least-Once delivery semantics?", ans: "Messages are guaranteed to be delivered at least once to the consumer, but duplicates may occur due to retries upon unacknowledged network timeouts.", wrong: ["Messages are guaranteed to be delivered exactly zero times.", "Messages are never re-sent under any circumstances.", "Messages are delivered within 1 nanosecond."], exp: "Consumers in at-least-once systems must be idempotent to safely handle duplicate message deliveries." },
      { q: "What is Database Connection Starvation and how does a connection pooler like PgBouncer prevent it?", ans: "PostgreSQL forks a heavy OS process per connection, exhausting memory under thousands of clients; PgBouncer multiplexes many client connections onto a small pool.", wrong: ["The database loses internet connection permanently.", "All database passwords are wiped automatically.", "The database converts tables into CSV format."], exp: "PgBouncer pools and reuses connections, preventing thread/memory exhaustion when client traffic spikes." },
      { q: "What is the function of a Distributed Lock Manager (e.g. Redlock or ZooKeeper)?", ans: "Guaranteeing mutually exclusive access to a shared resource across independent processes running on multiple physical machines.", wrong: ["Locking the server room door automatically at night.", "Encrypting source code repositories with GPG keys.", "Preventing users from resetting their account passwords."], exp: "Distributed locks prevent race conditions when multiple independent servers attempt to update the same external resource." }
    ]
  },
  {
    id: "genai_llm",
    prefix: "gen",
    category: "technical",
    skillTag: "Generative AI & LLM Engineering",
    subTopics: ["RAG Architectures", "Vector Databases", "Prompt Engineering", "Autonomous Agents", "Fine-Tuning & Quantization"],
    specs: [
      { q: "In production RAG (Retrieval-Augmented Generation), why is semantic chunking with overlap superior to fixed character chunking?", ans: "It preserves coherent syntactic context and prevents splitting mid-sentence or mid-thought across vector embeddings.", wrong: ["It decreases embedding storage costs in Pinecone by exactly 90%.", "It removes the requirement for a retriever or re-ranking model.", "Fixed character chunking is not supported by OpenAI text-embedding-3."], exp: "Semantic chunking keeps related sentences together, ensuring retrieved chunks contain complete conceptual context." },
      { q: "What is the primary role of a Cross-Encoder Re-ranker (e.g. Cohere Rerank or BGE-Reranker) in two-stage RAG pipelines?", ans: "It scores retrieved query-document pairs jointly with full cross-attention, accurately re-ordering the top candidates retrieved by bi-encoder vector search.", wrong: ["It generates the final answer text before the LLM sees the prompt.", "It compresses the PDF documents into ZIP archives.", "It translates foreign languages into English."], exp: "Bi-encoders search fast; cross-encoders re-rank the top 20-50 candidates with high precision." },
      { q: "What is Hallucination in Large Language Models and what is a primary mitigation strategy?", ans: "The model generating factually incorrect or ungrounded claims with high confidence; mitigated by RAG, grounded citations, and low temperature.", wrong: ["The model shutting down because the GPU is overheating.", "The model printing source code in Chinese.", "The model forgetting user names after 1 minute."], exp: "Grounding responses in factual retrieved context and instructing the model to decline answering when context is absent reduces hallucinations." },
      { q: "How does Approximate Nearest Neighbor (ANN) search in Vector Databases differ from Exact k-NN?", ans: "ANN trades a tiny fraction of recall accuracy for orders-of-magnitude faster sub-linear O(log N) search speed across millions of embeddings using graphs (HNSW) or trees.", wrong: ["ANN computes cosine similarity on CPU only.", "Exact k-NN does not support floating point numbers.", "ANN can only search text shorter than 5 words."], exp: "Algorithms like HNSW (Hierarchical Navigable Small World) index embeddings for millisecond retrieval across massive collections." },
      { q: "What is the purpose of Chain-of-Thought (CoT) prompting in complex reasoning tasks?", ans: "Prompting the model to break down problems into intermediate step-by-step reasoning tokens before producing the final answer.", wrong: ["Looping prompt text 100 times to increase token count.", "Preventing the model from using pronouns in responses.", "Forcing the model to output binary 0 and 1 only."], exp: "Generating intermediate reasoning tokens allows autoregressive transformers to compute complex logic sequentially." },
      { q: "What is Model Quantization (e.g. AWQ, GPTQ, GGUF / int4) and what are its trade-offs?", ans: "Reducing precision of model weights from 16-bit float to 4-bit or 8-bit integer, slashing VRAM requirements with minimal loss of perplexity.", wrong: ["Deleting 75% of the model's layers permanently.", "Translating neural networks into SQL stored procedures.", "Running models without electricity."], exp: "Quantization allows running 70B parameter models on consumer hardware by compressing memory footprint." },
      { q: "What is the function of Context Window Caching (Prompt Caching) in modern LLM APIs (e.g. Claude / Gemini)?", ans: "Reusing precomputed KV-cache for large static system prompts or document prefixes across requests, cutting cost and time-to-first-token.", wrong: ["Saving model responses to the user's browser localStorage.", "Caching HTML images on a CDN edge server.", "Preventing users from submitting duplicate prompts."], exp: "Prompt caching avoids re-processing identical prefix tokens through transformer attention layers repeatedly." },
      { q: "In AI Agent architectures, what is the ReAct (Reasoning + Acting) framework?", ans: "An iterative loop where the LLM produces a thought, decides on a tool action, observes the environment tool output, and continues until the task is solved.", wrong: ["A React.js library for rendering AI buttons.", "An algorithm for training convolutional vision networks.", "A database query planner."], exp: "ReAct combines reasoning traces with concrete tool execution (e.g. web search, calculator, API calls)." },
      { q: "What is the role of Guardrails (e.g. NeMo Guardrails or Llama Guard) in enterprise GenAI deployments?", ans: "Enforcing safety boundaries, detecting prompt injection attacks, filtering PII, and ensuring responses adhere to corporate policies.", wrong: ["Physically locking server rack doors in data centers.", "Limiting the number of employees who can use ChatGPT.", "Formatting JSON outputs into CSV spreadsheets."], exp: "Guardrails inspect inbound prompts and outbound completions to prevent jailbreaks, toxic content, and data leakage." },
      { q: "What is the primary difference between Fine-Tuning and In-Context Learning (Prompting)?", ans: "Fine-tuning permanently updates model weight parameters through gradient descent; in-context learning supplies examples within the prompt context window without updating weights.", wrong: ["Fine-tuning is always free and runs in the browser.", "In-context learning updates weights on disk.", "Fine-tuning cannot be used for language tasks."], exp: "In-context learning guides the model via prompt conditioning; fine-tuning adapts internal parameters for specific styles or domains." },
      { q: "What does the Key-Value (KV) Cache do during auto-regressive LLM token generation?", ans: "It stores previously computed attention Key and Value tensor representations in GPU memory, avoiding redundant computation for past tokens at each new step.", wrong: ["It caches HTTP GET requests in Redis.", "It stores user login passwords in memory.", "It encrypts model weights with AES-256."], exp: "KV caching speeds up token-by-token generation from O(N^2) total work to O(N) by storing intermediate attention states." },
      { q: "What is Speculative Decoding in LLM inference acceleration?", ans: "A small, fast draft model predicts candidate tokens speculatively, which are then verified in parallel in a single forward pass by the large target model.", wrong: ["Betting on cryptocurrency token price movements.", "Randomly deleting tokens that take too long to generate.", "Running inference on quantum computers."], exp: "Speculative decoding achieves 2-3x speedups without changing the target model's output probability distribution." },
      { q: "What does cosine distance vs Euclidean (L2) distance evaluate in high-dimensional vector search?", ans: "Cosine measures the angle/direction between vectors independent of magnitude; Euclidean measures geometric distance between coordinate points.", wrong: ["Cosine only works on 2D vectors; Euclidean works on any dimension.", "Euclidean distance cannot be computed on GPUs.", "There is no mathematical difference between them."], exp: "Cosine focuses on semantic orientation regardless of document length; Euclidean is sensitive to vector length/norm." },
      { q: "In RAG systems, what is Query Expansion / Hypothetical Document Embeddings (HyDE)?", ans: "Using an LLM to generate a hypothetical answer first, then embedding that answer to retrieve semantically closer real documents from the vector database.", wrong: ["Expanding SQL queries to include DROP TABLE commands.", "Translating English queries into hexadecimal code.", "Compressing user queries to zero characters."], exp: "HyDE searches vector space with an answer-like embedding rather than an interrogative question embedding, improving similarity." },
      { q: "What is Direct Preference Optimization (DPO) and how does it compare to PPO for model alignment?", ans: "DPO optimizes policy directly on preference pairs using an analytical closed-form objective, eliminating the need to train and balance a separate reward model.", wrong: ["DPO requires training 5 separate reward models.", "DPO is only used for image generation models like Stable Diffusion.", "DPO does not use human preference data."], exp: "DPO mathematically re-parameterizes the RLHF objective, making alignment training stable, simple, and computationally efficient." }
    ]
  },
  {
    id: "embedded_iot",
    prefix: "emb",
    category: "technical",
    skillTag: "Embedded Systems & IoT",
    subTopics: ["Interrupts & RTOS", "Communication Protocols", "Microcontrollers & Hardware", "Power Optimization", "Firmware Architecture"],
    specs: [
      { q: "Why must dynamic memory allocation (`malloc`/`free`) and blocking delays NEVER be used inside an Interrupt Service Routine (ISR)?", ans: "Heap allocation is non-deterministic and can cause deadlocks or priority inversions in critical ISR context.", wrong: ["ISRs only run on 64-bit multi-core processors.", "Microcontroller flash memory is strictly read-only at runtime.", "C++ compilers automatically delete all ISR code containing heap calls."], exp: "ISRs execute at elevated hardware priority; blocking or non-deterministic operations freeze the CPU and disrupt timing." },
      { q: "In serial embedded communications, what is the primary difference between I2C and SPI protocols?", ans: "I2C uses 2 wires (SDA, SCL) with addressing supporting multiple devices; SPI uses 4 wires (MOSI, MISO, SCK, CS) for full-duplex, higher-speed point-to-point communication.", wrong: ["I2C runs at 100 GHz; SPI runs at 10 kHz.", "SPI requires internet connectivity; I2C is wireless.", "I2C cannot connect to microcontrollers."], exp: "I2C saves pin count with open-drain 2-wire bus; SPI delivers higher clock speeds with dedicated chip-select lines." },
      { q: "What is the purpose of a Hardware Watchdog Timer (WDT) in mission-critical embedded systems?", ans: "Automatically resetting the microcontroller if firmware freezes, deadlocks, or crashes and fails to 'kick' or clear the timer within a deadline.", wrong: ["Displaying digital clock time on an OLED screen.", "Measuring battery voltage levels continuously.", "Encrypting firmware binaries against reverse engineering."], exp: "A watchdog timer restarts the microcontroller to recover from software lockups or infinite loops." },
      { q: "In FreeRTOS, what does Priority Inversion describe and how does Priority Inheritance solve it?", ans: "A low-priority task holds a shared mutex needed by a high-priority task, while a medium task blocks the low task; Priority Inheritance temporarily raises the low task's priority.", wrong: ["When all tasks run with priority 0 simultaneously.", "When CPU core temperature drops below freezing.", "When task queues run out of RAM."], exp: "Priority inheritance elevates the lock-holder's priority to prevent medium tasks from starving high-priority tasks." },
      { q: "What is the primary motivation for using MQTT instead of HTTP/REST for IoT sensor telemetry?", ans: "MQTT is an ultra-lightweight publish/subscribe protocol with tiny 2-byte packet headers and persistent broker connections ideal for constrained networks.", wrong: ["MQTT transmits 8K video streams faster than HTTP.", "MQTT eliminates the need for battery power entirely.", "HTTP cannot transmit sensor numbers."], exp: "MQTT minimizes packet overhead and power consumption, making it ideal for battery-powered remote IoT nodes." },
      { q: "What is the role of a Pull-Up Resistor on an open-drain I2C communication bus?", ans: "Pulling the signal line up to VCC when all connected devices release the bus, allowing devices to safely pull the line low without short circuits.", wrong: ["Preventing the microcontroller from drawing too much battery current.", "Converting analog audio signals into digital bits.", "Cooling down the CPU during high-speed calculations."], exp: "Open-drain pins can only drive low or float; pull-up resistors ensure the line floats to logic HIGH when idle." },
      { q: "What does the `volatile` keyword instruct the C/C++ compiler when applied to a memory-mapped hardware register variable?", ans: "It prevents the compiler from optimizing away reads/writes, forcing a fresh memory read every time the variable is accessed.", wrong: ["It encrypts the variable in RAM.", "It forces the variable to be stored in CPU cache.", "It makes the variable read-only."], exp: "Hardware registers can change value asynchronously (via external pins); volatile disables register caching optimizations." },
      { q: "In low-power IoT device design, what is Deep Sleep mode?", ans: "Powering down the CPU, high-speed clocks, and peripherals, leaving only a real-time clock (RTC) or low-power timer running to consume microamperes.", wrong: ["A software mode that turns off the internet router.", "Formatting the flash memory card automatically.", "Shutting down the cloud server overnight."], exp: "Deep sleep preserves battery life for years by waking sensors only periodically to measure and transmit data." },
      { q: "What is the function of an Analog-to-Digital Converter (ADC) in a microcontroller system?", ans: "Converting continuous analog voltage signals from sensors (e.g. temperature, light) into discrete digital integer values.", wrong: ["Converting battery DC voltage to AC wall power.", "Translating C code into machine assembly instructions.", "Boosting audio speaker volume."], exp: "ADCs sample continuous analog voltages and quantize them into binary integers (e.g. 10-bit: 0-1023)." },
      { q: "What does Pulse Width Modulation (PWM) allow a digital microcontroller pin to achieve?", ans: "Simulating variable analog output (e.g. controlling LED brightness or motor speed) by varying the duty cycle of a digital square wave.", wrong: ["Transmitting wireless Wi-Fi signals through walls.", "Multiplying the microcontroller's CPU clock frequency.", "Connecting directly to 240V AC mains power."], exp: "Varying the ratio of ON-time to total period (duty cycle) changes average effective voltage delivered to loads." },
      { q: "What is the difference between Flash Memory and SRAM in microcontroller architecture?", ans: "Flash is non-volatile memory storing firmware code that persists through power-off; SRAM is fast volatile RAM holding runtime variables and the stack.", wrong: ["Flash memory is erased every time the CPU reboots.", "SRAM stores the compiled bootloader permanently.", "Flash memory cannot be written to during manufacturing."], exp: "Program instructions execute from Flash; dynamic variables, stacks, and heaps reside in volatile SRAM." },
      { q: "In embedded networking, what is LoRaWAN designed for?", ans: "Long-Range, Low-Power wireless communication over kilometers with very low data rates, ideal for smart agriculture and remote sensors.", wrong: ["Streaming high-definition video within homes.", "Replacing fiber-optic internet backbones.", "Pairing wireless Bluetooth headphones to phones."], exp: "LoRaWAN transmits small sensor packets over long distances (up to 10-15 km) with low battery consumption." },
      { q: "What is a Ring Buffer (Circular Buffer) frequently used for in UART serial driver implementations?", ans: "Providing a fixed-size FIFO buffer where an ISR writes incoming bytes without memory allocation while the main application loop reads them asynchronously.", wrong: ["Sorting sensor data in ascending order automatically.", "Encrypting serial packets with AES keys.", "Amplifying serial signal voltage levels."], exp: "Circular buffers allow lock-free single-producer single-consumer data transfer between interrupt handlers and main threads." },
      { q: "What is the danger of a Stack Overflow in embedded microcontrollers?", ans: "The call stack grows beyond its allocated memory boundary and overwrites global variables, heap data, or causes CPU hard faults.", wrong: ["The microcontroller physically burns out.", "The microcontroller connects to illegal Wi-Fi networks.", "The serial baud rate doubles automatically."], exp: "Constrained microcontroller SRAM (e.g. 2KB-32KB) makes deep recursion or large local buffers prone to corrupting RAM." },
      { q: "What is Direct Memory Access (DMA) and why is it crucial for high-throughput embedded peripherals?", ans: "It transfers data directly between peripherals (ADC, SPI, UART) and memory without CPU intervention, freeing the CPU for compute tasks.", wrong: ["It allows microcontrollers to bypass memory encryption.", "It lets the CPU run without a power supply.", "It converts SPI signals to Ethernet packets."], exp: "DMA handles bulk data streaming in hardware, preventing CPU starvation from thousands of individual interrupts." }
    ]
  },
  {
    id: "qa_automation",
    prefix: "qa",
    category: "technical",
    skillTag: "Software Testing & QA Automation",
    subTopics: ["E2E Automation", "Page Object Model", "API Testing", "CI/CD Test Matrix", "Performance & Load Testing"],
    specs: [
      { q: "In Playwright and modern E2E automation, what is the best practice to prevent flaky tests caused by asynchronous network calls and DOM animations?", ans: "Using web-first assertions and auto-waiting locators instead of hardcoded thread sleeps (`sleep(5000)`).", wrong: ["Increasing browser viewport zoom to 200%.", "Running all tests sequentially in a single single-threaded worker process.", "Disabling JavaScript in headless Chromium browser settings."], exp: "Playwright auto-waits for elements to be attached, visible, stable, and receive events before acting." },
      { q: "What is the primary objective of the Page Object Model (POM) design pattern in test automation?", ans: "Encapsulating page UI locators and user interactions into reusable class objects, reducing maintenance when UI markup changes.", wrong: ["Speeding up website CSS rendering speeds.", "Generating mock user profiles in PostgreSQL.", "Translating English test cases into Spanish."], exp: "POM separates page selectors and workflows from assertion logic, so UI changes only require updating one class file." },
      { q: "What does the Testing Pyramid principle advocate for in a balanced automated test suite?", ans: "A broad foundation of fast, cheap Unit Tests, followed by fewer Integration Tests, and a thin top layer of End-to-End (E2E) UI Tests.", wrong: ["100% E2E UI tests and zero unit tests.", "Writing tests only after production deployment.", "Running manual tests exclusively."], exp: "Unit tests provide rapid localized feedback; E2E tests provide end-to-end user confidence but are slower and costlier to maintain." },
      { q: "What is the difference between Load Testing and Stress Testing in performance engineering?", ans: "Load testing verifies system behavior under expected production traffic volumes; Stress testing pushes the system beyond maximum capacity to discover breaking points.", wrong: ["Stress testing tests developer anxiety levels.", "Load testing can only run on mobile phones.", "There is no difference in methodology."], exp: "Load testing validates SLA compliance; stress testing identifies recovery behavior and failure modes under extreme loads." },
      { q: "In API automation, what does an HTTP 422 Unprocessable Entity response status code indicate?", ans: "The server understands the content type and syntax, but semantic validation of the payload data failed (e.g. missing required JSON fields).", wrong: ["The database server has crashed permanently.", "The user has not logged in with an API key.", "The requested URL route does not exist."], exp: "422 signifies well-formed syntax that violates semantic business rules or schema validation contracts." },
      { q: "What is Mutation Testing in software quality assurance?", ans: "Intentionally introducing small bugs (mutations) into application source code to verify that the automated test suite catches and fails them.", wrong: ["Testing genetic DNA sequencing algorithms.", "Testing software on mutated hardware chips.", "Running automated tests on multiple operating systems."], exp: "If mutated code passes tests ('survives'), it indicates gaps in test assertions and inadequate test suite quality." },
      { q: "Why should automated end-to-end tests use custom `data-testid` attributes rather than brittle CSS class selectors?", ans: "CSS classes change frequently during UI redesigns and styling refactors, whereas dedicated test IDs provide stable automation contracts.", wrong: ["test IDs make web pages load 10x faster.", "Browsers cannot find elements using CSS classes.", "test IDs encrypt HTML DOM nodes."], exp: "Decoupling automated locators from visual styling ensures tests do not break on CSS or Tailwind updates." },
      { q: "In Playwright test execution, what is the advantage of Browser Contexts over opening completely new browser instances?", ans: "Browser contexts provide isolated incognito sessions (cookies, cache, storage) in milliseconds without the multi-second overhead of launching a new OS process.", wrong: ["Contexts run on mobile phones only.", "Contexts do not support JavaScript execution.", "Contexts disable SSL certificates."], exp: "Contexts enable fast, multi-user parallel test isolation without spinning up heavy browser OS processes." },
      { q: "What is Mocking vs Stubbing vs Spying in automated unit testing?", ans: "Stubs provide canned return values; Spies record call counts and arguments; Mocks verify pre-programmed behavior and expectations.", wrong: ["All three terms mean deleting the test file.", "Mocks run on physical servers while stubs run in the cloud.", "Mocks are used only for database queries."], exp: "Test doubles serve distinct verification roles: stubs supply inputs, spies observe, and mocks assert behavior." },
      { q: "What is Regression Testing in software development lifecycles?", ans: "Re-executing test suites against modified code to ensure that recent bug fixes or feature additions have not broken existing working functionality.", wrong: ["Testing software on older versions of Windows 95.", "Calculating statistical linear regression lines.", "Testing software without an internet connection."], exp: "Regression testing confirms that codebase changes do not inadvertently introduce side-effect defects." },
      { q: "What is the primary benefit of Contract Testing (e.g. Pact) in microservices testing?", ans: "Verifying that API providers and consumers adhere to agreed-upon message schemas and contracts without requiring end-to-end environment deployment.", wrong: ["Signing legal employment contracts digitally.", "Automating smart contract deployments on Ethereum.", "Testing physical HDMI display cables."], exp: "Contract tests prevent integration drift between independent backend teams without heavy end-to-end testing." },
      { q: "What is Smoke Testing (Build Verification Testing) in CI/CD pipelines?", ans: "A quick suite of high-priority critical-path tests to verify that a new build is stable enough to proceed to deeper testing.", wrong: ["Testing hardware servers in high-temperature smoke rooms.", "Testing web applications with slow internet dial-up speeds.", "Testing application logging statements."], exp: "Smoke tests act as gatekeepers: if core login or navigation fails, the build is rejected immediately." },
      { q: "What metric does Code Coverage (Line Coverage) measure and what is its major limitation?", ans: "It measures the percentage of source lines executed during tests, but high coverage does not guarantee assertions or edge-case correctness.", wrong: ["It measures the download speed of test scripts.", "It measures developer typing speed.", "It guarantees that zero bugs exist in the software."], exp: "100% line coverage can still miss edge cases if assertions are weak or boundary conditions are untested." },
      { q: "In k6 and modern load testing tools, what are Virtual Users (VUs)?", ans: "Concurrent execution loops simulating real user behavior and driving HTTP traffic against the system under test.", wrong: ["Artificial intelligence avatars visible in video games.", "Fake email accounts created in Gmail.", "Employees hired to click buttons manually."], exp: "VUs execute test scenarios in parallel, exerting measurable stress on APIs and web servers." },
      { q: "What is Exploratory Testing and how does it complement automated testing?", ans: "Simultaneous learning, test design, and execution where human testers investigate edge cases, usability flaws, and unexpected user journeys.", wrong: ["Running automated scripts on randomized cron timers.", "Banning manual QA engineers from testing software.", "Testing software on underwater hardware."], exp: "Automation catches known regressions; exploratory testing discovers unexpected usability defects and creative edge cases." }
    ]
  },
  {
    id: "game_dev",
    prefix: "gm",
    category: "technical",
    skillTag: "Game Development & 3D Graphics",
    subTopics: ["3D Math & Transforms", "Shaders & Rendering", "Game Engine Architecture", "Physics & Collisions", "Optimization"],
    specs: [
      { q: "Why are Quaternions preferred over Euler angles for representing 3D rotations in game engines like Unity and Unreal?", ans: "They eliminate Gimbal Lock and provide smooth spherical interpolation (SLERP) without rotational singularity.", wrong: ["They reduce polygon triangle count on 3D mesh models.", "Euler angles cannot represent negative coordinates in Cartesian space.", "Quaternions are computed strictly on CPU without GPU pipeline."], exp: "Quaternions avoid losing a degree of freedom when rotation axes align, ensuring seamless 3D orientation math." },
      { q: "What is the primary performance bottleneck associated with a high Draw Call count in real-time rendering?", ans: "CPU overhead preparing rendering states and issuing draw commands across the driver to the GPU for each mesh/material.", wrong: ["GPU memory bandwidth saturation from 8K textures.", "Computer power supply wattage limits.", "Audio card buffer underruns."], exp: "Draw calls involve CPU driver overhead; batching meshes and combining materials keeps GPU command queues saturated." },
      { q: "What is the difference between a Vertex Shader and a Fragment (Pixel) Shader in the graphics rendering pipeline?", ans: "Vertex shaders transform 3D object vertices into 2D screen space; Fragment shaders calculate final color, lighting, and textures per pixel.", wrong: ["Fragment shaders run on CPU; Vertex shaders run on GPU.", "Vertex shaders determine audio volume.", "There is no difference in modern rendering pipelines."], exp: "Vertices are processed first to position triangles; rasterized fragments are then shaded to determine pixel colors." },
      { q: "What is Frustum Culling in 3D game engines?", ans: "Discarding 3D objects outside the camera's viewing pyramid before rendering, preventing wasted GPU rasterization work.", wrong: ["Cutting down 3D trees inside forest scenes.", "Compressing 3D models into lower resolution textures.", "Deleting inactive player accounts."], exp: "Objects outside the field of view are culled before rendering to preserve frame rates." },
      { q: "In game physics engines, what is the computational difference between Discrete and Continuous Collision Detection (CCD)?", ans: "Discrete checks for overlaps at fixed time steps and can suffer from 'tunneling' through thin walls at high speeds; CCD sweeps volumes to detect collision time.", wrong: ["CCD only works on 2D games.", "Discrete collision detection cannot detect ground planes.", "CCD does not require CPU math."], exp: "Fast-moving bullets or balls can pass through thin colliders between discrete frames; CCD prevents tunneling." },
      { q: "What is the purpose of Level of Detail (LOD) systems in open-world 3D games?", ans: "Switching to progressively lower-polygon meshes and simpler shaders for objects situated farther from the camera.", wrong: ["Leveling up player character attributes.", "Changing game difficulty from Easy to Hard.", "Streaming audio files from cloud servers."], exp: "LOD saves millions of rendered polygons by simplifying distant meshes that only occupy a few screen pixels." },
      { q: "What is the role of a Frame Delta Time (`Time.deltaTime` in Unity / `DeltaSeconds` in Unreal)?", ans: "Scaling movement and physics updates by the actual elapsed time between frames to ensure game speed remains frame-rate independent.", wrong: ["Setting the system clock time on the computer.", "Controlling the camera field of view zoom.", "Saving game progress to persistent storage."], exp: "Multiplying speed by delta time ensures objects move at constant speed regardless of whether the game runs at 30 FPS or 144 FPS." },
      { q: "In 3D math, what is the Dot Product of two normalized unit direction vectors used for?", ans: "Determining the cosine of the angle between them to assess alignment (1 = same direction, 0 = perpendicular, -1 = opposite).", wrong: ["Calculating the perpendicular vector cross product.", "Inverting a 4x4 projection matrix.", "Determining the distance between two 3D points."], exp: "Vector dot product is widely used in lighting calculations (Lambertian diffuse) and field-of-view checks." },
      { q: "What is Normal Mapping in 3D surface shading?", ans: "Using an RGB texture where pixel values encode surface normal vectors to fake high-frequency geometric detail and lighting on low-poly meshes.", wrong: ["Mapping normal road maps onto vehicle GPS screens.", "Normalizing player inventory weight limits.", "Translating game text into English."], exp: "Normal maps perturb lighting normals without adding expensive physical vertices to the 3D model." },
      { q: "What is an Entity-Component-System (ECS) architectural pattern and why is it adopted in modern engines (Unity DOTS)?", ans: "Decoupling data (Components) from logic (Systems) in contiguous memory arrays to optimize CPU cache locality and maximize multithreaded performance.", wrong: ["An object-oriented inheritance tree for game enemies.", "A database for storing player credit card information.", "A shader language for rendering water surfaces."], exp: "Data-oriented ECS avoids pointer chasing and cache misses, processing thousands of entities in parallel." },
      { q: "What is PBR (Physically Based Rendering) in modern graphics engines?", ans: "A rendering approach that models real-world physics of light interaction using energy conservation, Albedo, Roughness, and Metallic material properties.", wrong: ["Painting 3D models with physical oil paints.", "Rendering cartoon cel-shaded animations only.", "A method for printing 3D physical models."], exp: "PBR provides consistent, realistic materials under all lighting environments by obeying physical conservation of energy." },
      { q: "What is Raycasting in game engines and what is a frequent use case?", ans: "Projecting an invisible ray from a 3D origin point along a direction vector to detect collisions with objects (e.g. hitscan shooting, ground detection).", wrong: ["Broadcasting live video streams to Twitch.", "Raycasting is used only for audio reverb.", "Generating procedural dungeon maps."], exp: "Raycasts test for line-of-sight intersections with physics colliders to calculate shooting hits or line-of-sight." },
      { q: "What is Occlusion Culling compared to Frustum Culling?", ans: "Frustum culling hides objects outside the camera view; Occlusion culling hides objects inside the view that are blocked from view by closer opaque objects.", wrong: ["Occlusion culling turns off all lights in dark scenes.", "Frustum culling requires raytracing graphics cards.", "Occlusion culling only works on 2D sprites."], exp: "Occlusion culling prevents drawing buildings or mountains hidden behind front-row walls." },
      { q: "In game networking, what is Client-Side Prediction and Server Reconciliation?", ans: "The client applies user input immediately for responsiveness, then reconciles its local state when the authoritative server broadcast arrives.", wrong: ["The client guesses what game the player wants to buy.", "The server predicts when the player will turn off the computer.", "Clients disconnect automatically on packet loss."], exp: "Client-side prediction hides network latency for movement, snapping or interpolating only when server states diverge." },
      { q: "What is Texture Atlasing in 2D and 3D game performance optimization?", ans: "Combining multiple smaller textures into a single large texture image to enable batching draw calls for objects sharing that atlas.", wrong: ["Printing physical game world maps in color.", "Compressing audio sound effects into MP3s.", "Converting 3D models into SVG vectors."], exp: "Texture atlases allow rendering multiple distinct sprites or models in a single GPU draw call." }
    ]
  },
  {
    id: "sre_observability",
    prefix: "sre",
    category: "technical",
    skillTag: "Site Reliability & Observability",
    subTopics: ["SLIs/SLOs & Error Budgets", "Metrics & Prometheus", "Distributed Tracing", "Incident Management", "Chaos Engineering"],
    specs: [
      { q: "In SRE practices, what action is triggered when a production service exhausts 100% of its monthly 99.9% Error Budget?", ans: "Feature deployments are frozen and engineering priority pivots entirely to reliability and bug hardening.", wrong: ["The cloud cluster shuts down all worker nodes automatically.", "All user accounts are downgraded to free tier.", "HTTP requests are redirected to a static DNS 404 page."], exp: "Error budget exhaustion signals that reliability risk is too high, pausing feature velocity to prioritize stability." },
      { q: "What is the relationship between SLI, SLO, and SLA in Site Reliability Engineering?", ans: "SLI is what you measure (e.g. 99.8% success); SLO is the internal target (e.g. 99.9%); SLA is the contractual business agreement with penalties.", wrong: ["SLA is what you measure; SLI is the marketing contract; SLO is an alert threshold.", "All three acronyms refer to the exact same metric without distinction.", "SLO is only used for internal hardware temperatures."], exp: "Indicator (SLI) -> Objective (SLO) -> Agreement (SLA with financial consequences)." },
      { q: "In Prometheus metrics, what is the difference between a Counter and a Gauge?", ans: "A Counter is a cumulative metric that only increases or resets to zero upon restart; a Gauge is a metric that can arbitrarily go up and down (e.g. memory usage).", wrong: ["Gauges can never decrease.", "Counters only count negative numbers.", "Counters are stored on magnetic tapes."], exp: "Counters track cumulative events (e.g. total http requests); Gauges measure instantaneous values (e.g. current CPU usage)." },
      { q: "What are the 'Four Golden Signals' of monitoring according to the Google SRE Book?", ans: "Latency, Traffic, Errors, and Saturation.", wrong: ["CPU, RAM, Hard Drive, and Fan Speed.", "Cost, Revenue, Signups, and Churn.", "HTML, CSS, JavaScript, and WebAssembly."], exp: "Focusing on Latency, Traffic, Errors, and Saturation provides comprehensive visibility into service health." },
      { q: "What is Mean Time to Detect (MTTD) vs Mean Time to Resolve (MTTR)?", ans: "MTTD is the time from incident onset until engineers are alerted; MTTR is the time from incident onset until full service restoration.", wrong: ["MTTR measures developer typing speeds.", "MTTD measures how long it takes to hire SRE engineers.", "Both metrics measure cloud hosting monthly bills."], exp: "Observability reduces MTTD via timely alerts; runbooks and resilient architectures reduce MTTR." },
      { q: "What does the Prometheus `rate(http_requests_total[5m])` PromQL function compute?", ans: "The per-second average rate of increase of the counter metric over the specified 5-minute time window, handling counter resets automatically.", wrong: ["The total number of requests since the server was first manufactured.", "The percentage of HTTP requests that returned status 500.", "The average latency of database queries."], exp: "rate() calculates per-second increases and extrapolates across time boundaries while compensating for process restarts." },
      { q: "In distributed tracing (OpenTelemetry), what is the difference between a Trace and a Span?", ans: "A Trace represents the end-to-end journey of a request across all services; a Span represents a single timed operation or unit of work within that trace.", wrong: ["Spans are stored in PostgreSQL; Traces are stored in Redis.", "A Trace only records memory consumption.", "There is no difference; Trace and Span are synonyms."], exp: "A Trace is a directed acyclic graph (DAG) of Spans representing nested operations across microservices." },
      { q: "Why are Blameless Post-Mortems a foundational pillar of modern DevOps and SRE culture?", ans: "They focus on identifying systemic weaknesses, missing guardrails, and process gaps without punishing individuals, encouraging open disclosure.", wrong: ["They allow companies to fire employees who made mistakes publicly.", "They eliminate the need to write incident documentation.", "They are used to sue cloud hosting providers."], exp: "Blameless culture assumes engineers do their best with available context; failures are learning opportunities to harden systems." },
      { q: "What is an Alert Storm and how do SREs mitigate it during major infrastructure outages?", ans: "Hundreds of cascading alerts firing simultaneously; mitigated by alert grouping, deduplication, and routing dependent alerts to a single root cause.", wrong: ["A thunderstorm that knocks out physical power to data centers.", "An attacker sending millions of spam emails.", "A continuous integration build running out of disk space."], exp: "Alert routing hierarchies and inhibition rules silence secondary symptom alerts when the primary upstream dependency fails." },
      { q: "In high-scale telemetry ingestion, what is the trade-off of Tail-Based Sampling compared to Head-Based Sampling in distributed tracing?", ans: "Tail-based sampling collects 100% of trace spans temporarily and makes retention decisions after the trace completes (capturing all errors and slow traces); Head-based samples up-front.", wrong: ["Tail-based sampling drops all errors automatically.", "Head-based sampling requires quantum computing.", "Tail-based sampling can only run on single-core CPUs."], exp: "Tail sampling buffers traces to retain all high-latency or error traces, maximizing diagnostic value while discarding routine successes." },
      { q: "What does 'Saturation' measure in the context of systems observability?", ans: "How close a system resource (e.g. CPU, disk I/O queue, memory, database connection pool) is to reaching 100% capacity.", wrong: ["The color saturation of website hero images.", "The number of users browsing the website from mobile devices.", "The humidity level of the server room."], exp: "Saturation indicates upcoming degradation before latency spikes occur, alerting teams to constrained resources." },
      { q: "What is Canary Analysis automation (e.g. Kayenta) in modern CI/CD?", ans: "Statistically comparing metrics (error rates, latency percentiles) between the new canary deployment and the baseline to automatically rollback on regression.", wrong: ["Analyzing songs recorded by real canary birds.", "Testing website colors for accessibility compliance.", "Scanning source code for unused functions."], exp: "Automated canary analysis removes human guesswork by using statistical tests to validate release health." },
      { q: "What is the primary difference between Synthetic Monitoring and Real User Monitoring (RUM)?", ans: "Synthetic uses automated headless scripts simulating user journeys at scheduled intervals; RUM captures actual real-world user interactions and performance in the browser.", wrong: ["Synthetic monitoring monitors physical robots.", "RUM is prohibited under GDPR guidelines.", "Synthetic monitoring can only measure CPU clock speed."], exp: "Synthetics catch baseline downtime even with zero traffic; RUM captures real-world device/network variances across actual customers." },
      { q: "What is an On-Call Runbook (Playbook) and why is it essential for incident response?", ans: "A pre-written, step-by-step troubleshooting guide for on-call engineers detailing how to triage, mitigate, and recover from specific alerts.", wrong: ["A fitness manual for software engineers.", "A marketing brochure given to prospective clients.", "A legal contract signed with cloud vendors."], exp: "Runbooks reduce cognitive burden during high-stress outages, lowering MTTR by prescribing actionable mitigation steps." },
      { q: "Why is tracking High Percentiles (p95, p99, p99.9) far more insightful than Average (Mean) Latency for web APIs?", ans: "Averages hide extreme tail latency spikes experienced by hundreds of users; p99 captures the worst-case experience of the top 1% slowest requests.", wrong: ["Average latency cannot be computed by computers.", "p99 latency is always lower than the average.", "Percentiles only work on integer numbers."], exp: "If 100 requests have 10ms latency and 1 has 10,000ms, the mean is ~109ms, masking the severe outlier that p99 exposes." }
    ]
  },
  {
    id: "data_engineering",
    prefix: "de",
    category: "technical",
    skillTag: "Big Data & Data Pipelines",
    subTopics: ["Apache Spark", "Airflow & Orchestration", "Data Lakes & Delta Lake", "Stream Processing", "Data Modeling & dbt"],
    specs: [
      { q: "In Apache Spark distributed computing, what causes a severe 'Straggler Task' during large-scale `groupBy` / `join` stages?", ans: "Data partitioning skew where a single hot key sends millions of records to one executor node.", wrong: ["Using Parquet columnar format instead of CSV text files.", "Enabling Spark Adaptive Query Execution (AQE).", "Allocating too much JVM heap space to driver process."], exp: "Skewed keys cause one executor partition to process vastly more data than peers, delaying the stage completion." },
      { q: "What is the difference between a Data Lake and a Data Warehouse in modern data architectures?", ans: "Data Lakes store raw structured, semi-structured, and unstructured data at low cost; Data Warehouses store curated, highly structured relational data optimized for SQL queries.", wrong: ["Data Lakes store actual physical water for cooling servers.", "Data Warehouses can only be accessed using Python.", "There is no difference in storage format."], exp: "Lakes (S3/ADLS) store raw multi-format files; Warehouses (Snowflake/BigQuery) store governed tabular schemas." },
      { q: "What are the ACID transaction guarantees provided by Delta Lake / Apache Iceberg on top of object storage?", ans: "A transaction log (commit log) providing serializable ACID guarantees, schema enforcement, and time-travel rollbacks on Parquet files.", wrong: ["Encrypting data with Bitcoin private keys.", "Converting Parquet files into Microsoft Excel spreadsheets.", "Deleting old data files automatically every 10 seconds."], exp: "Table formats like Delta and Iceberg use metadata commit logs to bring warehouse-grade ACID to cloud object stores." },
      { q: "In Apache Airflow, what is an idempotent DAG (Directed Acyclic Graph)?", ans: "A pipeline that produces the exact same state and data output regardless of how many times it is re-run for a given execution date.", wrong: ["A pipeline that never finishes executing.", "A pipeline that deletes all source data upon completion.", "A pipeline that runs without an Airflow worker."], exp: "Idempotence ensures safe re-runs and backfills without duplicating or corrupting destination datasets." },
      { q: "What is the primary benefit of Columnar Storage formats (e.g. Apache Parquet or ORC) over Row-Based formats (CSV/JSON) for analytics?", ans: "Queries only scan and read the specific columns requested, and columnar data compresses significantly better with dictionary/run-length encoding.", wrong: ["Columnar formats can be opened in simple text editors.", "Columnar formats support writing single rows 100x faster.", "Columnar formats do not support numbers."], exp: "Column projection minimizes I/O by reading only required column chunks, saving bandwidth and disk scans." },
      { q: "What does the 'Shuffle' operation represent in Apache Spark and why is it expensive?", ans: "Re-distributing data across cluster nodes over the network based on partition keys, involving heavy disk I/O, serialization, and network transfer.", wrong: ["Randomly reordering songs in a music playlist.", "Restarting all worker nodes simultaneously.", "Compressing memory caches with gzip."], exp: "Shuffles require writing intermediate data to disk and transferring it across the network to destination executors." },
      { q: "In stream processing (e.g. Apache Flink / Spark Streaming), what is Watermarking?", ans: "A threshold mechanism that tracks event-time progress to determine when to close time windows and handle out-of-order or late-arriving events.", wrong: ["Adding digital copyright logos to PNG images.", "Measuring the cooling water level in data centers.", "Encrypting streaming packets with TLS certificates."], exp: "Watermarks tell the stream processor how long to wait for delayed events before firing a window computation." },
      { q: "What is the difference between Star Schema and Snowflake Schema in dimensional data modeling?", ans: "Star schema connects dimension tables directly to a central fact table; Snowflake schema normalizes dimension tables into sub-dimensions.", wrong: ["Star schema runs on AWS; Snowflake schema runs on Snowflake Inc.", "Star schema contains no fact tables.", "Snowflake schema does not support foreign keys."], exp: "Snowflake normalizes dimensions to reduce redundancy; Star schema denormalizes dimensions for faster, simpler joins." },
      { q: "What is the role of `dbt` (data build tool) in modern ELT pipelines?", ans: "Transforming raw data already loaded into the data warehouse by writing modular SQL `SELECT` statements with version control, testing, and documentation.", wrong: ["Extracting data from physical mainframe tape drives.", "Replacing the cloud data warehouse with SQLite.", "Visualizing business intelligence charts."], exp: "dbt handles the 'T' in ELT, turning SQL select queries into tables and views inside the warehouse." },
      { q: "In Apache Spark, what is the difference between a Transformation and an Action?", ans: "Transformations (e.g. map, filter) are lazily evaluated and build an execution DAG; Actions (e.g. count, collect) trigger real computation across the cluster.", wrong: ["Transformations delete data; Actions insert data.", "Transformations run on CPU; Actions run on GPU.", "Actions do not return any results."], exp: "Spark evaluates execution plans lazily, optimizing the execution graph until an action demands materialized output." },
      { q: "What is Change Data Capture (CDC) (e.g. Debezium) used for in data engineering?", ans: "Streaming row-level database changes (inserts, updates, deletes) in real-time by reading the database transaction write-ahead log (WAL).", wrong: ["Scanning hard drives for corrupt sectors.", "Taking manual full database backups once a week.", "Converting relational tables into MongoDB collections."], exp: "CDC captures database mutations directly from the WAL without putting query load on the operational database." },
      { q: "What is the difference between Event Time and Processing Time in streaming data pipelines?", ans: "Event time is when the event originally occurred at the source device; Processing time is when the stream processor node actually ingests and processes it.", wrong: ["Event time is measured in hours; Processing time is measured in seconds.", "Event time is only used in financial trading.", "There is no difference in timestamp calculation."], exp: "Network latency and disconnections mean events can arrive seconds or hours after event-time occurrence." },
      { q: "Why is Broadcast Join (Map-Side Join) utilized in Apache Spark when joining a massive table with a tiny lookup table?", ans: "The small table is broadcast to all executor nodes in memory, completely eliminating the expensive network shuffle of the massive table.", wrong: ["It converts all SQL queries into radio broadcast signals.", "It writes both tables to disk as CSV files.", "It drops all mismatched rows automatically."], exp: "Broadcasting the small dimension table allows executors to join local partition data without shuffling the large dataset." },
      { q: "What does the 'Medallion Architecture' (Bronze, Silver, Gold) represent in Lakehouse design?", ans: "A data refinement pipeline: Bronze stores raw ingested data, Silver holds cleaned and enriched data, and Gold delivers business-level aggregated analytics.", wrong: ["Medals awarded to the fastest data engineering teams.", "Different pricing tiers for cloud storage accounts.", "Cryptocurrency tokens used to pay for cluster compute."], exp: "Medallion pipelines progressively clean, validate, and aggregate raw data into query-ready enterprise data assets." },
      { q: "In distributed file systems like HDFS or Amazon S3, what is the 'Small Files Problem'?", ans: "Storing millions of tiny files causes catastrophic metadata overhead on Namenodes/catalogs and degrades Spark query performance due to excessive file open/close I/O.", wrong: ["Files smaller than 1KB cannot be read by computers.", "Cloud providers delete small files automatically.", "Small files can only be processed on single-core CPUs."], exp: "Many small files overwhelm metadata operations; compaction jobs combine small files into optimal 128MB-512MB blocks." }
    ]
  }
];

// Combine all 16 subjects
const allSubjects = [...subjects];

// Convert remaining programmatic specs into standard format
remainingSubjects.forEach(s => {
  const qList = s.specs.map((item, idx) => ({
    q: item.q,
    diff: idx < 5 ? "easy" : idx < 11 ? "medium" : "hard",
    sub: s.subTopics[idx % s.subTopics.length],
    ans: item.ans,
    wrong: item.wrong,
    exp: item.exp
  }));

  allSubjects.push({
    id: s.id,
    prefix: s.prefix,
    category: s.category,
    skillTag: s.skillTag,
    questions: qList
  });
});

console.log(`Total subjects prepared: ${allSubjects.length}`);

// Generate TypeScript code
let tsCode = `// Autogenerated High-Quality 15-Questions-Per-Subject Question Bank
// Total Subjects: ${allSubjects.length} | Questions Per Subject: 15 | Total: ${allSubjects.length * 15}
import { AssessmentQuestion } from "@/lib/supabase/types";

export const SUBJECT_QUESTIONS_BANK: Record<string, AssessmentQuestion[]> = {
`;

allSubjects.forEach(sub => {
  tsCode += `  "${sub.id}": [\n`;
  sub.questions.forEach((q, idx) => {
    const qNum = (idx + 1).toString().padStart(2, '0');
    const qId = `q-${sub.prefix}-${qNum}`;
    
    // Create options with randomized answer placement
    const opts = [
      { id: `opt-${sub.prefix}${qNum}a`, text: q.ans, isCorrect: true, scoreWeight: 1.0 },
      { id: `opt-${sub.prefix}${qNum}b`, text: q.wrong[0], isCorrect: false, scoreWeight: 0.0 },
      { id: `opt-${sub.prefix}${qNum}c`, text: q.wrong[1], isCorrect: false, scoreWeight: 0.0 },
      { id: `opt-${sub.prefix}${qNum}d`, text: q.wrong[2], isCorrect: false, scoreWeight: 0.0 },
    ];
    
    // Rotate so correct answer isn't always A: position = (idx % 4)
    const targetPos = idx % 4;
    const temp = opts[0];
    opts[0] = opts[targetPos];
    opts[targetPos] = temp;

    tsCode += `    {\n`;
    tsCode += `      id: "${qId}",\n`;
    tsCode += `      category: "${sub.category}",\n`;
    tsCode += `      skillTag: "${sub.skillTag}",\n`;
    tsCode += `      subTopic: "${q.sub}",\n`;
    tsCode += `      difficulty: "${q.diff}",\n`;
    tsCode += `      questionText: ${JSON.stringify(q.q)},\n`;
    tsCode += `      questionType: "single_choice",\n`;
    tsCode += `      displayOrder: ${idx + 1},\n`;
    tsCode += `      explanation: ${JSON.stringify(q.exp)},\n`;
    tsCode += `      options: [\n`;
    opts.forEach((o, oIdx) => {
      const optId = `opt-${sub.prefix}${qNum}${String.fromCharCode(97 + oIdx)}`;
      tsCode += `        { id: "${optId}", text: ${JSON.stringify(o.text)}, scoreWeight: ${o.scoreWeight.toFixed(1)}, isCorrect: ${o.isCorrect} },\n`;
    });
    tsCode += `      ],\n`;
    tsCode += `    },\n`;
  });
  tsCode += `  ],\n`;
});

tsCode += `};\n\n`;
tsCode += `export function getSubjectQuestionsBank(subjectId?: string): AssessmentQuestion[] {\n`;
tsCode += `  if (subjectId && SUBJECT_QUESTIONS_BANK[subjectId]) {\n`;
tsCode += `    return SUBJECT_QUESTIONS_BANK[subjectId];\n`;
tsCode += `  }\n`;
tsCode += `  return SUBJECT_QUESTIONS_BANK["web_dev"] || [];\n`;
tsCode += `}\n`;

const targetPath = path.join(__dirname, '../src/lib/skills/assessment-questions-bank.ts');
fs.writeFileSync(targetPath, tsCode, 'utf8');
console.log(`Successfully wrote question bank to ${targetPath}`);
