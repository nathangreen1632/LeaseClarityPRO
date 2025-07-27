# 📄 LeaseClarityPRO

![Status](https://img.shields.io/badge/status-in--production-brightgreen)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)
![Tech Stack](https://img.shields.io/badge/stack-React%2FNode%2FPostgreSQL-purple)
![Last Updated](https://img.shields.io/badge/updated-July_2025-blue)

### ⚖️ Empowering renters with AI-driven lease analysis and legal transparency.

---

![LeaseClarityPRO Banner](https://www.leaseclaritypro.com/leaseclaritypro-banner.png)

## 🌐 Live Site

🔗 [https://www.leaseclaritypro.com](https://www.leaseclaritypro.com)

---

## ✨ Features

### 🧾 Lease Summary Generator
- Extracts and summarizes:
    - Rent, dates, deposits, pets, vehicles, insurance, late fees, and more.
    - Outputs structured JSON for use across chatbot and analyzer tools.

### 🧠 Tenant Rights Analyzer
- Detects legally questionable clauses using OpenAI
- Categorizes issues by topic (e.g., deposits, evictions)
- Fetches active legislation via OpenStates API
- Links to HUD resources by state

### 💬 Lease Chatbot Assistant ("Gherin")
- Answers questions about the currently loaded lease
- Remembers chat history while modal is open
- Auto-resets when a new lease is selected
- Persists messages across modal toggles

### 🧪 Legal Clause Detection
- Identifies red flags in lease language
- Tags severity levels and source clauses
- Uses prompt-tuned logic to reduce hallucinations

### 📂 Multi-Lease Manager
- Upload, view, and analyze multiple leases per user
- Dynamic lease dropdown with chatbot and summary sync
- Full tenant dashboard coming soon

### 🔐 OTP-Based Password Reset
- Send OTP via email (Resend API)
- Secure hashing, 5-minute expiry, rate-limited
- Includes password strength indicator and CAPTCHA validation

### 🔓 Session Management
- JWT with idle timeout detection
- Full-screen re-auth modal after inactivity
- Modal countdown with locked buttons at 0:02

---

## 🧱 Tech Stack

| Layer       | Technologies                                 |
|-------------|----------------------------------------------|
| Frontend    | React, Vite, Zustand, TailwindCSS, Lucide    |
| Backend     | Node.js, Express, PostgreSQL, Sequelize      |
| AI Services | OpenAI (GPT-4o, GPT-4o-mini), OpenStates API |
| Auth/Email  | JWT, Resend, reCAPTCHA v3                    |
| Hosting     | Render.com (Client + Server), PostgreSQL     |

---

## 📁 Project Structure

```
LeaseClarityPRO/
├── Client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── types/
│   │   └── utils/
│   └── public/
│       └── leaseclaritypro.png
├── Server/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── utils/
│   └── config/
```

---

## 🛠️ Setup Guide

### 1. Clone and install
```bash
  git clone https://github.com/your-username/LeaseClarityPRO.git
  cd LeaseClarityPRO
```

### 2. Environment Configuration

**Server/.env**
```
PORT=3001
DATABASE_URL=postgres://user:password@host:port/dbname
OPENAI_API_KEY=your_openai_key
RESEND_API_KEY=your_resend_key
RECAPTCHA_SECRET=your_recaptcha_secret
JWT_SECRET=your_jwt_secret
```

**Client/.env**
```
VITE_API_URL=http://localhost:3001/api
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

### 3. Install packages
```bash
cd Server && npm install
cd ../Client && npm install
```

### 4. Start in dev mode
```bash
# Server
npm run dev

# Client
npm run dev
```

---

## 🧪 Testing & QA

- Manual test coverage includes:
    - Lease upload and analysis
    - Rights analyzer feedback
    - OTP reset and modal timeouts
- Future roadmap includes:
    - Vitest (frontend)
    - Jest (backend unit tests)

---

## 🛤 Roadmap

| Feature                          | Status     |
|----------------------------------|------------|
| Lease Summary & Analyzer         | ✅ Complete |
| OpenAI Chatbot                   | ✅ Complete |
| Multi-Lease Switching            | ✅ Complete |
| OTP Email Reset Flow             | ✅ Complete |
| Inactivity Countdown Modal       | ✅ Complete |
| Role-based Admin + Spanish       | 🔜 Upcoming |
| Exportable Tenant Reports (PDF)  | 🔜 Upcoming |
| Chatbot Abuse Prevention Filters | 🔜 Upcoming |

---

## 👨‍💻 Author

**Nathan Green**  
Founder, One Guy Productions
- [GitHub](https://github.com/nathangreen1632)
- [CVitaePRO](https://www.cvitaepro.com)
- [CareerGistPRO](https://www.careergistpro.com)
- [PyDataPRO](http://www.pydatapro.com)

---

## 📄 License

Licensure isn't permitted without prior written consent.

© 2025 One Guy Productions
