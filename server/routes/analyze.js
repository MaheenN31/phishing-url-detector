const express = require('express');
const router = express.Router();
const keywordDetector = require('../detectors/keywordDetector');
const similarityDetector = require('../detectors/similarityDetector');
const structureDetector = require('../detectors/structureDetector');
const { computeScore } = require('../scoring');

router.post('/', (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: 'No URL provided' });

  const keywords = keywordDetector(url);
  const similarity = similarityDetector(url);
  const structure = structureDetector(url);

  const { score, risk, reasons } = computeScore(keywords, similarity, structure);

  res.json({ url, score, risk, reasons });
});

module.exports = router;