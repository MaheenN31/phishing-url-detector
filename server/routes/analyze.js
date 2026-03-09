const express = require('express');
const router = express.Router();
const keywordDetector = require('../detectors/keywordDetector');
const similarityDetector = require('../detectors/similarityDetector');
const structureDetector = require('../detectors/structureDetector');
const virusTotalDetector = require('../detectors/virusTotalDetector');
const { computeScore } = require('../scoring');

router.post('/', async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: 'No URL provided' });

  const keywords = keywordDetector(url);
  const similarity = similarityDetector(url);
  const structure = structureDetector(url);
  const virusTotal = await virusTotalDetector(url);

  const { score, risk, reasons } = computeScore(keywords, similarity, structure, virusTotal);

  res.json({ url, score, risk, reasons, virusTotal });
});

module.exports = router;