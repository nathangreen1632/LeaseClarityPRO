# 📄 <span style="color: white;">LeaseClarity</span><span style="color: #ef4444;">PRO</span>

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


![Frontend Tech Stack](https://skillicons.dev/icons?i=webstorm,react,ts,vite,tailwind,html,css,firebase,git,github,&theme=dark)
<br>
![Backend Tech Stack](https://skillicons.dev/icons?i=nodejs,express,postgres,sequelize,ai,ts,npm,postman,regex,&theme=dark)
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
│   ├── src/
│   │     ├── routes/
│   │     ├── controllers/
│   │     ├── services/
│   │     ├── utils/
│   │     └── config/
│   └── .env
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
  JWT_SECRET=your_jwt_secret
  OPENAI_API_KEY=your_openai_key
  OPENSTATES_API_KEY=your_openstates_key
  TWILIO_ACCOUNT_SID=your_twilio_sid
  TWILIO_AUTH_TOKEN=your_twilio_token
  RECAPTCHA_SECRET=your_recaptcha_secret
  RESEND_API_KEY=your_resend_key
  FROM_EMAIL=your_from_email_account
```

### 3. Install packages
```bash
  root/ npm install
  root/ npm run build
  root/ npm run dev - run Dev mode
  root/ npm run start - run Production mode
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
| Exportable Tenant Reports (PDF)  | 🔜 Upcoming |
| Full Tenant Dashboard            | 🔜 Upcoming |
| Legal Clause Detection           | 🔜 Upcoming |
| AI-Powered Lease Negotiation     | 🔜 Upcoming |
| Community Forum                  | 🔜 Upcoming |
| Tenant Education Resources       | 🔜 Upcoming |
| AI-Powered Lease Recommendations | 🔜 Upcoming |
| Integration with Local Laws      | 🔜 Upcoming |


---

## 👨‍💻 Author

**Nathan Green**  
Founder, One Guy Productions
- [Website](https://www.oneguyproductions.com)
- [Facebook](https://www.facebook.com/profile.php?id=61577146233520)
- [Discord](https://discord.com/channels/1308749969821274203/1308749969821274206)
- [Email](mailto:leaseclaritypro@gmail.com)

## Other Projects
- [CVitaePRO](https://www.cvitaepro.com)
- [CareerGistPRO](https://www.careergistpro.com)
- [PyDataPRO](http://www.pydatapro.com)

---

## 📄 License

Licensure isn't permitted without prior written consent.

© 2025 One Guy Productions
