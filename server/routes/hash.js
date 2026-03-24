const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  const { hash } = req.body;
  if (!hash) return res.status(400).json({ error: 'No hash provided' });

  // Validate hash format (MD5, SHA1, SHA256)
  const md5Regex = /^[a-fA-F0-9]{32}$/;
  const sha1Regex = /^[a-fA-F0-9]{40}$/;
  const sha256Regex = /^[a-fA-F0-9]{64}$/;

  if (!md5Regex.test(hash) && !sha1Regex.test(hash) && !sha256Regex.test(hash)) {
    return res.status(400).json({ error: 'Invalid hash format. Please provide a valid MD5, SHA1, or SHA256 hash.' });
  }

  try {
    const apiKey = process.env.VIRUSTOTAL_API_KEY;
    const vtResponse = await axios.get(
      `https://www.virustotal.com/api/v3/files/${hash}`,
      { headers: { 'x-apikey': apiKey } }
    );

    const data = vtResponse.data.data.attributes;
    const stats = data.last_analysis_stats;

    const vtInfo = {
      malicious: stats.malicious || 0,
      suspicious: stats.suspicious || 0,
      harmless: stats.harmless || 0,
      undetected: stats.undetected || 0,
    };

    const fileInfo = {
      name: data.meaningful_name || 'Unknown',
      type: data.type_description || 'Unknown',
      size: data.size ? `${(data.size / 1024).toFixed(2)} KB` : 'Unknown',
      md5: data.md5 || 'N/A',
      sha1: data.sha1 || 'N/A',
      sha256: data.sha256 || 'N/A',
    };

    let score = 0;
    const reasons = [];

    if (vtInfo.malicious > 0) {
      score += Math.min(vtInfo.malicious * 8, 80);
      reasons.push(`${vtInfo.malicious} antivirus engines detected this file as malicious`);
    }
    if (vtInfo.suspicious > 0) {
      score += vtInfo.suspicious * 4;
      reasons.push(`${vtInfo.suspicious} engines flagged this file as suspicious`);
    }
    if (vtInfo.malicious === 0 && vtInfo.suspicious === 0) {
      reasons.push('✅ No antivirus engines flagged this file');
    }

    score = Math.min(score, 100);
    let risk;
    if (score <= 30) risk = 'Low Risk';
    else if (score <= 60) risk = 'Medium Risk';
    else risk = 'High Risk';

    res.json({ hash, score, risk, reasons, fileInfo, virusTotal: vtInfo });
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ error: 'Hash not found in VirusTotal database. This file may never have been scanned before.' });
    }
    console.error(err.message);
    res.status(500).json({ error: 'Failed to analyze hash' });
  }
});

module.exports = router;