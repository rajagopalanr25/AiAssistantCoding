# CodeArena AI – Private AI-Assisted Coding Interview Simulator

CodeArena AI is an enterprise-grade, dark-themed, interactive coding interview simulation platform. It bridges the gap between competitive programming platforms (LeetCode, HackerRank) and real-world developer workflows (Cursor, GitHub Copilot) by introducing **Strict AI Token Quotas**, **Multi-Language Sandboxed Execution**, and **Objective 10-Dimension AI Evaluations**.

---

## 🌟 Key Features

1. **Integrated Monaco Code Editor**
   - Syntax highlighting, auto-indentation, and code completion for **JavaScript, Python, Java, and C++**.
   - Line numbers, bracket pair colorization, customizable font sizing, code formatting (`Alt+Shift+F`), and keyboard shortcuts (`Ctrl+Enter` to Run, `Ctrl+Shift+Enter` to Submit).

2. **Real AI Token Budget Accounting & Quotas**
   - Configurable per-interview allowance (500, 1,000, 2,000, 3,000, 5,000, or Custom).
   - Real-time token accounting including prompt context and assistant completion.
   - Dynamic threshold alerts:
     - **75% Usage**: Warning banner.
     - **90% Usage**: Critical threshold warning.
     - **100% Usage**: AI queries disabled; candidate continues solving independently.
   - Chronological Token Ledger Modal detailing timestamp, query type, and token deductions.

3. **Curated Problem Catalog (12 Tier-1 Problems + Custom Studio)**
   - Two Sum, Valid Parentheses, Longest Substring Without Repeating Characters, Merge Intervals, Binary Search, Reverse Linked List, Detect Cycle in Linked List, Maximum Subarray, Kth Smallest Element, Coin Change, Number of Islands, LRU Cache.
   - Custom Problem Creator for authoring original problems, test cases, and starter templates.

4. **Multi-Language Sandboxed Code Execution**
   - Sub-second execution runners for JavaScript (Node.js) and Python (Python 3.10) with memory and execution timeouts.
   - Visible test cases, hidden edge cases, execution runtime (ms), memory tracking (KB), stdout log capturing, and input/output diffing.
   - Pluggable Judge0 API support for remote sandboxed execution of Java and C++.

5. **Cursor-Style AI Coding Assistant & 4 Assistance Modes**
   - **Strict Interview Mode**: Socratic questions only; refuses complete solutions.
   - **Limited Hints Ladder**: Progressive 4-tier hints (Conceptual Direction → Data Structure → Algorithmic Approach → Pseudocode).
   - **Standard AI Assistant**: Concept explanations, error debugging, and partial logic hints.
   - **Advanced AI Assistant**: Asymptotic trade-offs, cache locality, and alternative architectures.
   - **Interviewer Prompts**: Socratic technical questions on time complexity, edge cases, and scalability.

6. **Structured 10-Dimension Evaluation Matrix (/100)**
   - 10 distinct categories scored out of 10:
     1. Problem Understanding
     2. Algorithm Selection
     3. Code Correctness
     4. Time Complexity
     5. Space Complexity
     6. Code Quality & Modularity
     7. Edge-Case Handling
     8. Independent Problem Solving
     9. AI Utilization Efficiency
     10. Communication and Reasoning
   - Approach analysis (chosen vs optimal vs alternative), strengths, weaknesses, actionable recommendations, and a personalized weekly learning roadmap.

7. **Candidate Intelligence Dashboard & History**
   - 8 core metrics: Total Interviews, Average Score, Problems Solved, Average Tokens Used, Coding Accuracy, Average Speed, AI Dependency Index, and Progression Rate.
   - Interview audit trail with instant report access, replay timeline, and print/PDF export.

8. **Resume-Based Technical Interview Prep**
   - Paste resume text or work experience to extract competencies and generate tailored distributed systems, architecture, OOP, DBMS, and behavioral interview questions.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Monaco Editor (`@monaco-editor/react`), Lucide React, Framer Motion, Canvas Confetti.
- **Backend**: Node.js 24, Express.js, Socket.IO, JWT, BcryptJS, Axios.
- **Database**: Dual-Tier Architecture:
  - High-Performance Embedded JSON Document Store (Zero-friction local persistence).
  - Native MongoDB / MongoDB Atlas integration via Mongoose (when `MONGODB_URI` is provided).
- **AI Integration**: OpenAI API (GPT-4o / GPT-4o-mini) + Deterministic Offline Mentorship Fallback (clearly tagged `[Simulated AI - Demo Mode]`).

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18 or higher)
- Python 3.8+ (for Python execution sandbox)

### 2. Installation
```bash
# Clone the repository
cd d:\CodewithAI

# Install backend & frontend dependencies
npm run install:all
```

### 3. Environment Configuration
Create `backend/.env` (or review defaults):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=
JWT_SECRET=codearena_jwt_secret_super_secure_key_2026
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
JUDGE0_API_URL=
JUDGE0_API_KEY=
CLIENT_URL=http://localhost:5173
```

### 4. Build Frontend & Launch Private Server
```bash
# Build the production frontend bundle
npm run build:frontend

# Start the unified backend & static server
npm start
```

Open your browser at:
👉 **`http://localhost:5000`**

---

## 🔑 Default Demo Credentials

You can test immediately using the **One-Click Demo Candidate Login** or by entering:
- **Email**: `demo@codearena.ai`
- **Password**: `password123`

---

## 🧪 Automated End-to-End Test Suite

Run the automated integration verification suite covering all 10 core steps:
```bash
node backend/src/test-e2e.js
```

**Verification Steps Included:**
1. Health check & API readiness
2. JWT Authentication & credential validation
3. Problem catalog retrieval (12 Tier-1 problems)
4. Session initialization & token quota allocation
5. AI Assistant mentorship and live token balance deductions
6. Sandboxed code execution against sample test cases
7. Full submission verification against all hidden test cases
8. Structured 10-dimension assessment generation (/100) & learning roadmap
9. Candidate dashboard metrics synchronization
10. Session audit history recording

---

## 🔒 Security & Private Deployment Compliance

CodeArena AI is designed specifically for **private enterprise & candidate assessment environments**:
- **User Data Isolation**: Queries and interview workspaces enforce ownership checks (`req.user.userId === interview.userId`).
- **Encapsulated Secrets**: All API tokens, judge credentials, and keys reside on the backend and are never sent to the client.
- **Private Access Rule**: Default hosting binds strictly to private local/internal networking. No public sharing or search engine indexing is enabled without explicit administrative approval.

