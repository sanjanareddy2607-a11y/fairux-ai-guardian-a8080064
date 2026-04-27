**FairUX AI – Dark Pattern Detection Platform**

FairUX AI is an AI-powered platform that detects deceptive design practices (dark patterns) in websites and applications, helping organizations stay compliant with emerging regulations like the EU AI Act and India's DPDP Act.

---

 **Problem**

Modern digital platforms often use **dark patterns** such as:
- Hidden charges
- Fake urgency ("Only 1 left!")
- Difficult cancellation flows
- Misleading buttons and UI

These practices:
- Manipulate user decisions
- Reduce trust
- Can lead to heavy regulatory fines

Current solutions rely on **manual audits**, which are slow, expensive, and outdated.

---

 **Solution**

FairUX AI automates the detection of dark patterns using AI.

The platform:
1. Accepts a website/app input (or demo dataset)
2. Scans UI behavior and content
3. Detects potential dark patterns
4. Assigns a **risk score**
5. Generates **AI-powered compliance explanations**
6. Suggests actionable improvements

---

 **Key Features**

-  Dark Pattern Detection (UI + content analysis)
-  Risk Scoring System
-  AI-generated Compliance Reports (Gemini-powered)
-  Regulatory Mapping (EU AI Act, DPDP)
-  Demo Mode for instant evaluation
-  Clean and interactive dashboard

---
**How It Works**

1. User inputs a website or selects a demo case
2. System processes UI/content signals
3. Detection engine identifies suspicious patterns
4. AI generates:
   - Explanation of issue
   - Legal/compliance impact
   - Suggested fixes
5. Results are displayed in a visual dashboard

---
 **Tech Stack**

- Frontend: React + Tailwind CSS
- Backend Logic: AI-driven analysis
- AI Model: Google Gemini API
- Deployment: Vercel
- Data Handling: JSON / simulated datasets

 


##  Installation (Optional – for local setup)

```bash
git clone https://github.com/yourusername/fairux-ai-guardian.git
cd fairux-ai-guardian
npm install
npm run dev
