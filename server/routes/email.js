const express = require('express');
const router = express.Router();

const TRUSTED_DOMAINS = [
  'amazon.com', 'google.com', 'microsoft.com', 'apple.com', 'paypal.com',
  'netflix.com', 'facebook.com', 'instagram.com', 'twitter.com', 'linkedin.com',
  'github.com', 'dropbox.com', 'spotify.com', 'uber.com', 'airbnb.com',
  'bankofamerica.com', 'chase.com', 'wellsfargo.com', 'citibank.com'
];

const PHISHING_KEYWORDS = [
  'urgent', 'verify', 'suspended', 'unusual activity', 'click here',
  'confirm your account', 'update your information', 'login immediately',
  'your account has been', 'limited access', 'validate', 'prize',
  'winner', 'congratulations', 'act now', 'expire', 'threat',
  'unauthorized', 'password', 'credit card', 'social security',
  'bank account', 'wire transfer', 'nigerian', 'inheritance'
];

const URL_PATTERN = /https?:\/\/[^\s]+/gi;

function isTrustedSender(senderEmail) {
  if (!senderEmail) return false;
  const domain = senderEmail.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  return TRUSTED_DOMAINS.some(trusted => domain === trusted || domain.endsWith('.' + trusted));
}

function analyzeEmail(emailText, senderEmail) {
  const reasons = [];
  let score = 0;
  const lowerText = emailText.toLowerCase();
  const trusted = isTrustedSender(senderEmail);

  // If sender is trusted, add a trust bonus and skip aggressive checks
  if (trusted) {
    reasons.push(`✅ Sender domain is from a trusted organization`);
    score -= 20; // trust bonus
  }

  // Check for phishing keywords (less aggressive if trusted sender)
  const foundKeywords = PHISHING_KEYWORDS.filter(kw => lowerText.includes(kw));
  for (const kw of foundKeywords) {
    // Trusted senders score less for keywords (legitimate emails can use these)
    score += trusted ? 5 : 15;
    if (!trusted) reasons.push(`Phishing keyword detected: "${kw}"`);
  }

  // Only flag keyword summary for trusted senders if many are found
  if (trusted && foundKeywords.length > 4) {
    reasons.push(`Unusually high number of sensitive keywords (${foundKeywords.length}) even for trusted sender`);
  }

  // Check sender email patterns (skip if trusted)
  if (senderEmail && !trusted) {
    const suspiciousTLDs = ['.ru', '.xyz', '.tk', '.ml', '.ga', '.cf'];
    const domain = senderEmail.split('@')[1]?.toLowerCase() || '';
    if (suspiciousTLDs.some(tld => domain.endsWith(tld))) {
      score += 30;
      reasons.push(`Sender uses suspicious domain: ${domain}`);
    }

    // Brand impersonation check
    const brands = ['amazon', 'paypal', 'google', 'microsoft', 'apple', 'netflix'];
    for (const brand of brands) {
      if (lowerText.includes(brand) && !domain.includes(brand + '.com')) {
        score += 25;
        reasons.push(`Email claims to be from ${brand} but sender domain does not match`);
      }
    }
  }

  // Check for URLs in email
  const urls = emailText.match(URL_PATTERN) || [];
  if (urls.length > 5) {
    score += trusted ? 5 : 15;
    reasons.push(`High number of URLs found: ${urls.length}`);
  }

  // Urgency check (less aggressive for trusted)
  const urgencyPhrases = ['immediately', 'within 24 hours', 'act now', 'expires today'];
  const foundUrgency = urgencyPhrases.filter(p => lowerText.includes(p));
  if (foundUrgency.length > 0 && !trusted) {
    score += 20;
    reasons.push('Urgency language detected — common phishing tactic');
  }

  // Personal info requests (always flag regardless of sender)
  const infoRequests = ['enter your password', 'provide your password', 'confirm your password', 'submit your ssn'];
  const foundRequests = infoRequests.filter(p => lowerText.includes(p));
  if (foundRequests.length > 0) {
    score += 30;
    reasons.push('⚠️ Email explicitly requests sensitive credentials — even trusted senders should not ask for this');
  }

  score = Math.max(0, Math.min(score, 100));

  let risk;
  if (score <= 30) risk = 'Low Risk';
  else if (score <= 60) risk = 'Medium Risk';
  else risk = 'High Risk';

  return { score, risk, reasons, urlsFound: urls, trusted };
}

router.post('/', (req, res) => {
  const { emailText, senderEmail } = req.body;
  if (!emailText) return res.status(400).json({ error: 'No email content provided' });

  const result = analyzeEmail(emailText, senderEmail);
  res.json(result);
});

module.exports = router;