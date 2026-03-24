import { useState } from "react";
import axios from "axios";

const getRiskColor = (risk) => {
  if (risk === "High Risk") return "#e74c3c";
  if (risk === "Medium Risk") return "#f39c12";
  return "#2ecc71";
};

function EmailAnalyzer() {
  const [emailText, setEmailText] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!emailText) return setError("Please paste the email content.");
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post("http://localhost:5000/email", {
        emailText,
        senderEmail,
      });
      setResult(response.data);
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="tool-description">
        Paste a suspicious email's content to analyze it for phishing indicators.
      </p>

      <div style={{ marginBottom: "12px" }}>
        <input
          type="text"
          placeholder="Sender email address e.g. support@paypa1.ru (optional)"
          value={senderEmail}
          onChange={(e) => setSenderEmail(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <textarea
          rows={8}
          placeholder="Paste the full email content here..."
          value={emailText}
          onChange={(e) => setEmailText(e.target.value)}
          style={{ width: "100%", resize: "vertical" }}
        />
      </div>

      <button onClick={analyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Email"}
      </button>

      {error && <p className="error" style={{ marginTop: "12px" }}>{error}</p>}

      {result && (
        <div className="result-card">
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: getRiskColor(result.risk) }}>
              {result.score}<span style={{ fontSize: "1rem", color: "#aaa" }}>/100</span>
            </div>
            <div className="risk-badge" style={{ backgroundColor: getRiskColor(result.risk) }}>
              {result.risk}
            </div>
          </div>

          {result.urlsFound && result.urlsFound.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <h3 style={{ marginBottom: "8px", fontSize: "0.95rem" }}>🔗 URLs Found in Email</h3>
              <div className="tag-list">
                {result.urlsFound.map((url, i) => (
                  <span key={i} className="tag">{url}</span>
                ))}
              </div>
            </div>
          )}

          <div className="reasons-section">
            <h3>⚠️ Detected Indicators</h3>
            {result.reasons.length === 0 ? (
              <p className="no-issues">✅ No phishing indicators found.</p>
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
  );
}

export default EmailAnalyzer;