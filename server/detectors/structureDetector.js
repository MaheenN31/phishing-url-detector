function structureDetector(url) {
    const flags = [];
  
    // Check URL length
    if (url.length > 75) flags.push('URL length is unusually long');
  
    // Check number of dots (subdomains)
    const dots = (url.match(/\./g) || []).length;
    if (dots > 3) flags.push('Too many subdomains detected');
  
    // Check for suspicious characters
    if (url.includes('@')) flags.push('Suspicious "@" character in URL');
    if (url.includes('-')) flags.push('Hyphen detected in domain');
  
    // Check for multiple hyphens
    const hyphens = (url.match(/-/g) || []).length;
    if (hyphens > 2) flags.push('Multiple hyphens detected');
  
    // Check for suspicious TLDs
    const suspiciousTLDs = ['.ru', '.xyz', '.tk', '.ml', '.ga', '.cf'];
    for (const tld of suspiciousTLDs) {
      if (url.toLowerCase().endsWith(tld)) {
        flags.push(`Suspicious top-level domain: ${tld}`);
      }
    }
  
    // Check for IP address instead of domain
    const ipPattern = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
    if (ipPattern.test(url)) flags.push('IP address used instead of domain name');
  
    return flags;
  }
  
  module.exports = structureDetector;