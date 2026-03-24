# CyberShield — Cybersecurity Analysis Toolkit

A full-stack cybersecurity tool that helps users analyze URLs, emails, IP addresses, file hashes, and domains for potential threats and phishing indicators.

---

## Features

### URL Scanner
- Analyzes URLs for phishing indicators
- Detects suspicious keywords (login, verify, secure, etc.)
- Domain similarity detection using **Levenshtein Distance** to catch impersonation attempts
- URL structure analysis (length, subdomains, special characters, suspicious TLDs)
- **VirusTotal API** integration — checks against 70+ antivirus engines
- Animated risk gauge meter with score out of 100

### Email Analyzer
- Paste any suspicious email to detect phishing indicators
- Detects urgency language, credential requests, and phishing keywords
- Sender domain verification — checks if sender matches claimed brand
- Trusted domain whitelist to reduce false positives for legitimate emails
- Identifies brand impersonation (PayPal, Amazon, Google, Microsoft)

### IP Address Checker
- Checks any IP address against VirusTotal's threat database
- Returns geolocation data — country, city, ISP, organisation, timezone
- Flags IPs hosted in high-risk countries
- Displays full VirusTotal engine breakdown

### File Hash Scanner
- Accepts MD5, SHA1, and SHA256 hashes
- Checks against VirusTotal's malware database
- Returns full file details — name, type, size, all hash formats
- Shows exact number of antivirus engines that flagged the file

### WHOIS Lookup
- Returns full domain registration details
- Flags newly registered domains (common in phishing attacks)
- Shows registrar, creation date, expiry date, and registrant country
- Detects suspicious TLDs and privacy-protected registrations

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Recharts, Axios |
| Backend | Node.js, Express |
| Security API | VirusTotal API v3 |
| Geolocation | ip-api.com |
| Domain Info | whois-json |

---

## Getting Started

### Prerequisites
- Node.js installed
- A free [VirusTotal API key](https://www.virustotal.com)

### Installation

1. Clone the repository
```bash
git clone https://github.com/MaheenN31/phishing-url-detector.git
cd phishing-url-detector
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Create a `.env` file in the `server` folder
```
VIRUSTOTAL_API_KEY=your_api_key_here
```

4. Install frontend dependencies
```bash
cd ../client
npm install
```

### Running the App

Start the backend (from the `server` folder):
```bash
node server.js
```

Start the frontend (from the `client` folder):
```bash
npm start
```

The app will open at `http://localhost:3000`

---

## Test Cases

| Tool | Test Input | Expected Result |
|---|---|---|
| URL Scanner | `https://paypal-login-security.ru` | High/Medium Risk |
| URL Scanner | `https://google.com` | Low Risk |
| Email Analyzer | Email with "verify your account immediately" | High Risk |
| IP Checker | `8.8.8.8` | Low Risk, Google LLC |
| File Hash | `44d88612fea8a8f36de82e1278abb02f` | High Risk, 66 engines |
| WHOIS | `google.com` | Low Risk, registered 1997 |

---

## Architecture
```
phishing-url-detector/
├── client/                  # React frontend
│   └── src/
│       ├── components/
│       │   ├── UrlScanner.js
│       │   ├── EmailAnalyzer.js
│       │   ├── IpChecker.js
│       │   ├── FileHashScanner.js
│       │   └── WhoisLookup.js
│       ├── App.js
│       └── App.css
└── server/                  # Node.js backend
    ├── detectors/
    │   ├── keywordDetector.js
    │   ├── similarityDetector.js
    │   ├── structureDetector.js
    │   └── virusTotalDetector.js
    ├── routes/
    │   ├── analyze.js
    │   ├── email.js
    │   ├── ip.js
    │   ├── hash.js
    │   └── whois.js
    └── server.js
```

---

## Security Notes

- API keys are stored in `.env` and never committed to GitHub
- All analysis is performed server-side
- VirusTotal free tier has rate limits of 4 requests/minute

---

## Author

**MaheenN31** — [GitHub](https://github.com/MaheenN31)