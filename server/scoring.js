function computeScore(keywords, similarities, structureFlags) {
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