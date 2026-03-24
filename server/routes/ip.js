const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  const { ip } = req.body;
  if (!ip) return res.status(400).json({ error: 'No IP address provided' });

  try {
    // Get geolocation info
    const geoResponse = await axios.get(`http://ip-api.com/json/${ip}`);
    const geo = geoResponse.data;

    // Check VirusTotal
    const apiKey = process.env.VIRUSTOTAL_API_KEY;
    const vtResponse = await axios.get(
      `https://www.virustotal.com/api/v3/ip_addresses/${ip}`,
      { headers: { 'x-apikey': apiKey } }
    );

    const stats = vtResponse.data.data.attributes.last_analysis_stats;
    const vtInfo = {
      malicious: stats.malicious || 0,
      suspicious: stats.suspicious || 0,
      harmless: stats.harmless || 0,
      undetected: stats.undetected || 0,
    };

    let score = 0;
    const reasons = [];

    if (vtInfo.malicious > 0) {
      score += vtInfo.malicious * 10;
      reasons.push(`${vtInfo.malicious} engines flagged this IP as malicious`);
    }
    if (vtInfo.suspicious > 0) {
      score += vtInfo.suspicious * 5;
      reasons.push(`${vtInfo.suspicious} engines flagged this IP as suspicious`);
    }

    const suspiciousCountries = ['RU', 'CN', 'KP', 'IR'];
    if (suspiciousCountries.includes(geo.countryCode)) {
      score += 20;
      reasons.push(`IP is hosted in a high-risk country: ${geo.country}`);
    }

    if (vtInfo.malicious === 0 && vtInfo.suspicious === 0) {
      reasons.push('✅ No engines flagged this IP as malicious');
    }

    score = Math.min(score, 100);
    let risk;
    if (score <= 30) risk = 'Low Risk';
    else if (score <= 60) risk = 'Medium Risk';
    else risk = 'High Risk';

    res.json({ ip, score, risk, reasons, geo, virusTotal: vtInfo });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to analyze IP address' });
  }
});

module.exports = router;