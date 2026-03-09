require('dotenv').config();
const axios = require('axios');

async function virusTotalDetector(url) {
  try {
    const apiKey = process.env.VIRUSTOTAL_API_KEY;

    // Submit URL for analysis
    const submitResponse = await axios.post(
      'https://www.virustotal.com/api/v3/urls',
      new URLSearchParams({ url }),
      {
        headers: {
          'x-apikey': apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const analysisId = submitResponse.data.data.id;

    // Wait a moment for analysis to complete
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Fetch analysis results
    const resultResponse = await axios.get(
      `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
      {
        headers: { 'x-apikey': apiKey },
      }
    );

    const stats = resultResponse.data.data.attributes.stats;

    return {
      malicious: stats.malicious || 0,
      suspicious: stats.suspicious || 0,
      harmless: stats.harmless || 0,
      undetected: stats.undetected || 0,
    };
  } catch (error) {
    console.error('VirusTotal API error:', error.message);
    return null;
  }
}

module.exports = virusTotalDetector;