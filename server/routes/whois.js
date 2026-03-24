const express = require('express');
const router = express.Router();
const whois = require('whois-json');

router.post('/', async (req, res) => {
  const { domain } = req.body;
  if (!domain) return res.status(400).json({ error: 'No domain provided' });

  // Strip protocol if user pastes a full URL
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');

  try {
    const data = await whois(cleanDomain);

    const info = {
      domainName: data.domainName || cleanDomain,
      registrar: data.registrar || 'Unknown',
      createdDate: data.creationDate || data.created || 'Unknown',
      expiryDate: data.registrarRegistrationExpirationDate || data.expires || 'Unknown',
      updatedDate: data.updatedDate || data.modified || 'Unknown',
      nameServers: data.nameServer || 'Unknown',
      status: data.domainStatus || 'Unknown',
      registrantCountry: data.registrantCountry || 'Unknown',
    };

    // Risk analysis
    let score = 0;
    const reasons = [];

    // Check domain age
    if (info.createdDate && info.createdDate !== 'Unknown') {
      const created = new Date(info.createdDate);
      const now = new Date();
      const ageInDays = (now - created) / (1000 * 60 * 60 * 24);

      if (ageInDays < 30) {
        score += 40;
        reasons.push(`⚠️ Domain is very new — registered only ${Math.floor(ageInDays)} days ago`);
      } else if (ageInDays < 180) {
        score += 20;
        reasons.push(`Domain is relatively new — registered ${Math.floor(ageInDays)} days ago`);
      } else {
        reasons.push(`✅ Domain has been registered for ${Math.floor(ageInDays / 365)} year(s)`);
      }
    }

    // Check suspicious TLDs
    const suspiciousTLDs = ['.ru', '.xyz', '.tk', '.ml', '.ga', '.cf'];
    if (suspiciousTLDs.some(tld => cleanDomain.endsWith(tld))) {
      score += 20;
      reasons.push('Domain uses a suspicious top-level domain');
    }

    // Check for privacy protected registrar
    if (info.registrar && info.registrar.toLowerCase().includes('privacy')) {
      score += 10;
      reasons.push('Registrant information is privacy protected');
    }

    score = Math.min(score, 100);
    let risk;
    if (score <= 30) risk = 'Low Risk';
    else if (score <= 60) risk = 'Medium Risk';
    else risk = 'High Risk';

    res.json({ domain: cleanDomain, score, risk, reasons, info });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to perform WHOIS lookup. The domain may not exist.' });
  }
});

module.exports = router;