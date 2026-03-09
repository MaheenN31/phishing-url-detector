function computeScore(keywords, similarities, structureFlags, virusTotal) {
  let score = 0;
  const reasons = [];

  // Keyword scoring
  for (const keyword of keywords) {
    score += 20;
    reasons.push(`Suspicious keyword detected: "${keyword}"`);
  }

  // Similarity scoring
  for (const match of similarities) {
    score += 40;
    reasons.push(`Domain may be impersonating: ${match.domain} (edit distance: ${match.distance})`);
  }

  // Structure scoring
  for (const flag of structureFlags) {
    score += 15;
    reasons.push(flag);
  }

  // VirusTotal scoring
  if (virusTotal) {
    if (virusTotal.malicious > 0) {
      score += virusTotal.malicious * 10;
      reasons.push(`VirusTotal: ${virusTotal.malicious} engines flagged this URL as malicious`);
    }
    if (virusTotal.suspicious > 0) {
      score += virusTotal.suspicious * 5;
      reasons.push(`VirusTotal: ${virusTotal.suspicious} engines flagged this URL as suspicious`);
    }
    if (virusTotal.malicious === 0 && virusTotal.suspicious === 0) {
      reasons.push(`VirusTotal: No engines flagged this URL ✅`);
    }
  } else {
    reasons.push('VirusTotal: Could not retrieve results');
  }

  // Cap score at 100
  score = Math.min(score, 100);

  // Determine risk level
  let risk;
  if (score <= 30) risk = 'Low Risk';
  else if (score <= 60) risk = 'Medium Risk';
  else risk = 'High Risk';

  return { score, risk, reasons };
}

module.exports = { computeScore };