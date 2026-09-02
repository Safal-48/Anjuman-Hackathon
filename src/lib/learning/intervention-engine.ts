import { TargetedIntervention } from "./intervention-types";

export const SQL_JOIN_INTERVENTION: TargetedIntervention = {
  id: "intervention-sql-join",
  topic: "SQL JOIN Remediation",
  skillDomain: "SQL & Relational Databases",
  estimatedDuration: "15 minutes",
  targetDeficit: "Current: 42% ➔ Target: 75% (+33% Gain)",
  
  // 1. Concept Explanation
  conceptExplanation: {
    title: "Relational Set Coupling: INNER vs LEFT vs FULL JOIN",
    summary: "A SQL JOIN combines tuples from two tables based on a shared foreign key predicate without creating a Cartesian product.",
    coreRules: [
      "INNER JOIN: Retains only rows that exist in BOTH tables (Strict intersection).",
      "LEFT JOIN: Retains ALL rows from the Left table, populating NULLs for right table columns when no match exists.",
      "COALESCE(column, fallback): Critical guard to convert NULLs into 0 or default values in outer join metrics.",
      "Avoid nested subqueries where indexed joins reduce time complexity from O(N²) to O(N).",
    ],
    syntaxSnippet: `SELECT c.name, COUNT(o.id) AS total_orders, COALESCE(SUM(o.amount), 0) AS total_spent
FROM Customers c
LEFT JOIN Orders o ON c.id = o.customer_id
GROUP BY c.name;`,
  },

  // 2. Simple Real-world Example
  realWorldExample: {
    domain: "Zomato Food Delivery Orders",
    scenario: "We have 3 registered customers (Safal, Rahul, Priya), but only Safal and Rahul placed active orders.",
    tableA: {
      name: "Customers",
      schema: ["id", "name", "city"],
      sampleRows: [
        ["1", "Safal", "Varanasi"],
        ["2", "Rahul", "Delhi"],
        ["3", "Priya", "Mumbai"],
      ],
    },
    tableB: {
      name: "Orders",
      schema: ["order_id", "customer_id", "item_name", "amount"],
      sampleRows: [
        ["101", "1", "Paneer Tikka", "₹350"],
        ["102", "1", "Butter Naan", "₹120"],
        ["103", "2", "Biryani", "₹280"],
      ],
    },
    expectedOutputExplanation: "A LEFT JOIN preserves Priya (id: 3) with NULL for order_id and amount, whereas an INNER JOIN drops Priya completely.",
    codeSnippet: `SELECT Customers.name, Orders.item_name, Orders.amount
FROM Customers
LEFT JOIN Orders ON Customers.id = Orders.customer_id;`,
  },

  // 3-6. Guided Question & Adaptive Branching
  guidedQuestion: {
    id: "gq-1",
    title: "Guided Interactive Question: Preserving Inactive Customers",
    difficulty: "Intermediate",
    questionText: "Which SQL query correctly lists ALL registered customers and their order counts, ensuring customers with ZERO orders are displayed with count = 0 rather than being excluded?",
    codeSnippet: `-- Which query is semantically correct?`,
    options: [
      {
        id: "opt-1",
        text: "SELECT c.name, COUNT(o.id) FROM Customers c INNER JOIN Orders o ON c.id = o.customer_id GROUP BY c.name;",
        isCorrect: false,
        explanation: "Incorrect: INNER JOIN excludes customers with 0 orders because there is no matching foreign key in Orders.",
      },
      {
        id: "opt-2",
        text: "SELECT c.name, COUNT(o.id) FROM Customers c LEFT JOIN Orders o ON c.id = o.customer_id GROUP BY c.name;",
        isCorrect: true,
        explanation: "Correct! LEFT JOIN preserves all customers, and COUNT(o.id) yields 0 when order columns are NULL.",
      },
      {
        id: "opt-3",
        text: "SELECT c.name, COUNT(*) FROM Customers c, Orders o GROUP BY c.name;",
        isCorrect: false,
        explanation: "Incorrect: This generates an unconstrained Cartesian product (O(N*M)).",
      },
    ],
    hint: "Think about what happens to customers who never placed an order in the Orders table.",
    
    // Fallback if student repeatedly fails
    simplifiedFallbackExample: {
      analogyText: "Think of an Event Attendance List: The Left table is your entire Class Register (30 students). The Right table is the Event Check-in log (18 students). If you want to see everyone who came AND who was absent, you keep the whole Class Register (LEFT JOIN)!",
      simplifiedQuestionText: "If you have 10 registered students and 6 submitted an assignment, which join shows all 10 students with their submission status?",
      simplifiedOptions: [
        {
          id: "s-opt-1",
          text: "LEFT JOIN on student_id (Preserves all 10 students)",
          isCorrect: true,
          explanation: "Exactly! LEFT JOIN keeps the master student list intact.",
        },
        {
          id: "s-opt-2",
          text: "INNER JOIN on student_id (Shows only the 6 who submitted)",
          isCorrect: false,
          explanation: "INNER JOIN drops the 4 students who did not submit.",
        },
      ],
    },

    // Harder follow-up if student answers correctly
    harderFollowUpQuestion: {
      questionText: "Edge-Case Drill: You execute `SELECT c.name, COUNT(*) FROM Customers c LEFT JOIN Orders o ON c.id = o.customer_id GROUP BY c.name;` for an inactive customer with no orders. What does COUNT(*) return?",
      codeSnippet: `-- Notice COUNT(*) vs COUNT(o.id)`,
      options: [
        {
          id: "h-opt-1",
          text: "COUNT(*) returns 1 because the LEFT JOIN constructed a single row tuple containing NULLs!",
          isCorrect: true,
          explanation: "Mastery Insight! COUNT(*) counts rows in the grouped tuple (which is 1 row containing NULLs), whereas COUNT(o.id) evaluates NULL and correctly returns 0.",
        },
        {
          id: "h-opt-2",
          text: "COUNT(*) automatically returns 0.",
          isCorrect: false,
          explanation: "Common pitfall! COUNT(*) counts the row itself, not individual non-null column values.",
        },
      ],
    },
  },

  // 7. Mini Assessment
  miniAssessment: {
    title: "SQL JOIN 3-Question Diagnostic Check",
    passScorePercentage: 80,
    questions: [
      {
        id: "mq-1",
        questionText: "What join type returns rows only when there is a match in BOTH tables?",
        options: [
          { id: "m1a", text: "INNER JOIN", isCorrect: true, explanation: "Correct!" },
          { id: "m1b", text: "LEFT JOIN", isCorrect: false, explanation: "LEFT JOIN returns all left rows." },
          { id: "m1c", text: "CROSS JOIN", isCorrect: false, explanation: "Cross join returns Cartesian product." },
        ],
      },
      {
        id: "mq-2",
        questionText: "How do you replace NULL order values with 0 in an outer join aggregate?",
        options: [
          { id: "m2a", text: "COALESCE(amount, 0)", isCorrect: true, explanation: "COALESCE returns the first non-null argument." },
          { id: "m2b", text: "REPLACE(amount, 0)", isCorrect: false, explanation: "REPLACE is a string manipulation function." },
          { id: "m2c", text: "NULL_TO_ZERO(amount)", isCorrect: false, explanation: "Not a standard SQL ANSI function." },
        ],
      },
      {
        id: "mq-3",
        questionText: "When querying Users (100 rows) LEFT JOIN Orders (50 rows), what is the MINIMUM possible number of rows returned?",
        options: [
          { id: "m3a", text: "100 rows (All Users are guaranteed to be in the result)", isCorrect: true, explanation: "Correct! LEFT JOIN never drops rows from the left table." },
          { id: "m3b", text: "50 rows", isCorrect: false, explanation: "Incorrect." },
          { id: "m3c", text: "0 rows", isCorrect: false, explanation: "Incorrect." },
        ],
      },
    ],
  },
};

export async function getTargetedIntervention(topicId?: string): Promise<TargetedIntervention> {
  return SQL_JOIN_INTERVENTION;
}
