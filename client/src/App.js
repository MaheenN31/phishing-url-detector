import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeUrl = async () => {
    if (!url) return setError("Please enter a URL.");
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post("http://localhost:5000/analyze", { url });
      setResult(response.data);
    } catch (err) {
      setError("Failed to connect to the server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    if (risk === "High Risk") return "#e74c3c";
    if (risk === "Medium Risk") return "#f39c12";
    return "#2ecc71";
  };

  return (
    <div className="app">
      <div className="container">
        <h1>🔍 Phishing URL Detector</h1>
        <p className="subtitle">Analyze any URL for phishing indicators</p>

        <div className="input-section">
          <input
            type="text"
            placeholder="Enter a URL e.g. https://paypal-login-security.ru"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyzeUrl()}
          />
          <button onClick={analyzeUrl} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {result && (
          <div className="result-card">
            <div className="score-section">
              <div
                className="score-circle"
                style={{ borderColor: getRiskColor(result.risk) }}
              >
                <span className="score-number">{result.score}</span>
                <span className="score-label">/ 100</span>
              </div>
              <div
                className="risk-badge"
                style={{ backgroundColor: getRiskColor(result.risk) }}
              >
                {result.risk}
              </div>
            </div>

            <div className="url-analyzed">
              <strong>Analyzed:</strong> {result.url}
            </div>

            <div className="reasons-section">
              <h3>⚠️ Detected Indicators</h3>
              {result.reasons.length === 0 ? (
                <p className="no-issues">✅ No suspicious indicators found.</p>
              ) : (
                <ul>
                  {result.reasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;