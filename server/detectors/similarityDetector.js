const KNOWN_DOMAINS = [
    'google.com', 'paypal.com', 'amazon.com', 'facebook.com',
    'apple.com', 'microsoft.com', 'netflix.com', 'instagram.com',
    'twitter.com', 'linkedin.com', 'bank ofamerica.com', 'chase.com'
  ];
  
  function levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b[i - 1] === a[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }
  
  function extractDomain(url) {
    try {
      const { hostname } = new URL(url);
      return hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  }
  
  function similarityDetector(url) {
    const domain = extractDomain(url);
    const matches = [];
  
    for (const known of KNOWN_DOMAINS) {
      const distance = levenshtein(domain, known);
      if (distance > 0 && distance <= 4) {
        matches.push({ domain: known, distance });
      }
    }
  
    return matches;
  }
  
  module.exports = similarityDetector;