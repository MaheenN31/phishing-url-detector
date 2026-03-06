const SUSPICIOUS_KEYWORDS = [
    'login', 'verify', 'secure', 'account', 'update',
    'bank', 'signin', 'password', 'confirm', 'billing',
    'support', 'urgent', 'alert', 'recover', 'validate'
  ];
  
  function keywordDetector(url) {
    const lowerUrl = url.toLowerCase();
    const found = [];
  
    for (const keyword of SUSPICIOUS_KEYWORDS) {
      if (lowerUrl.includes(keyword)) {
        found.push(keyword);
      }
    }
  
    return found;
  }
  
  module.exports = keywordDetector;