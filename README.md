# LeaseClarityPRO

> **The AI-powered lease insight tool for renters.**
> Instantly extract, review, and understand your rental agreement.

---

## 🚀 What is LeaseClarityPRO?

LeaseClarityPRO is a digital lease summarizer and analyzer designed to empower renters and tenants. By leveraging AI and automation, LeaseClarityPRO makes it simple to upload your lease, extract key terms, and understand your rights — all in seconds.

* **Built for renters, tenants, and anyone who needs to review a residential lease.**
* **Helps you save time, reduce confusion, and avoid legal pitfalls.**

---

## 💡 What Does LeaseClarityPRO Do?

* **Upload & Parse:**
  Upload any PDF lease agreement and let LeaseClarityPRO parse and extract important details.

* **AI-Powered Summary:**
  Instantly receive a clear, human-friendly summary of your lease, including critical terms such as rent, deposit, notice period, renewal terms, and more.

* **Digital Key Term Extraction:**
  Highlights and explains essential clauses, deadlines, and requirements.

* **Legal Compliance Check:**
  Automatically flags missing or suspicious terms that may violate local regulations.

* **Secure & Private:**
  All documents are processed securely and never shared.

* **Easy-to-Read Dashboard:**
  Clean, modern dashboard for tracking, reviewing, and organizing all your uploaded leases.

---

## ✨ Features

* **AI Lease Parsing:**
  Automated extraction of lease start/end dates, rent amounts, deposits, renewal options, and penalties.

* **Field Normalization:**
  All monetary values and dates are formatted for clarity, with currency indicators.

* **Raw Summary & Extra Fields:**
  See a raw field-by-field summary, including any “extra” fields found in your lease.

* **Lease Management:**
  Track, rename, and delete your uploaded leases.

* **User Authentication:**
  Secure registration and login system.

* **Mobile-First Design:**
  Responsive UI powered by TailwindCSS v4.

* **Developer-Friendly:**
  Modern PERN stack (PostgreSQL, Express, React, Node.js), clean TypeScript code, strict typing.

---

## 🛠️ Project Structure

```
/Client
  - React + Vite frontend
  - TailwindCSS 4, Zustand for state
/Server
  - Express backend
  - Sequelize ORM, JWT authentication
  - PostgreSQL database
```

---

## 🌱 Planned / Upcoming Features

* **Digital Lease Signing**
  Native e-signature support for signing leases online.

* **Automated Renewal Reminders**
  Get notified before your lease expires or requires notice.

* **Tenant Rights Analyzer**
  Local/state-specific legal compliance analysis and tips.

* **AI-Powered Q\&A**
  Ask questions about your lease and get instant AI-driven answers.

* **Document Comparison**
  Compare multiple leases or amendments side by side.

* **Integrated Legal Resources**
  Links to local legal help, tenant unions, and dispute resolution.

* **Multi-language Support**
  Summarize leases in multiple languages.

* **OpenAI-Powered Suggestions**
  Receive negotiation tips, missing term alerts, and risk highlights.

---

## 📦 Tech Stack

* **Frontend:** React (Vite), TailwindCSS, Zustand
* **Backend:** Node.js, Express, Sequelize ORM
* **Database:** PostgreSQL
* **Authentication:** JWT, Bcrypt
* **AI:** OpenAI API integration (for lease summary and analysis)
* **PDF Parsing:** PDF.js

---

## 👀 Who Is It For?

* **Renters & Tenants:** Anyone signing or renewing a lease who wants clarity and peace of mind.
* **Property Managers:** Looking for easy digital record-keeping.
* **Legal Aid Organizations:** Rapid intake and review of client lease documents.

---

## 🏗️ How to Run Locally

1. **Clone this repo**
2. **Install dependencies** in `/Client` and `/Server`
3. **Configure your `.env` files** with database and OpenAI credentials
4. **Start the backend:**

   ```
   cd Server
   npm run dev
   ```
5. **Start the frontend:**

   ```
   cd Client
   npm run dev
   ```
6. Visit [http://localhost:5173](http://localhost:5173)

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙌 Contributing

PRs and suggestions are welcome! Please open an issue or submit a pull request.

---

**LeaseClarityPRO** — *Making leases clear, fair, and renter-friendly, one upload at a time.*

---
