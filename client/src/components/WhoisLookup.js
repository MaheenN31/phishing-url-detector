import { useState } from "react";
import axios from "axios";

const getRiskColor = (risk) => {
  if (risk === "High Risk") return "#e74c3c";
  if (risk === "Medium Risk") return "#f39c12";
  return "#2ecc71";
};

function WhoisLookup() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!domain) return setError("Please enter a domain.");
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post("http://localhost:5000/whois", { domain });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to perform WHOIS lookup.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === 'Unknown') return 'Unknown';
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div>
      <p className="tool-description">
        Look up domain registration details and check if a domain was recently created.
      </p>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter domain e.g. google.com or https://google.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && analyze()}
        />
        <button onClick={analyze} disabled={loading}>
          {loading ? "Looking up..." : "Lookup"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

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

          <div className="info-grid" style={{ marginBottom: "20px" }}>
            <div className="info-item">
              <label>Domain</label>
              <span>{result.info.domainName}</span>
            </div>
            <div className="info-item">
              <label>Registrar</label>
              <span>{result.info.registrar}</span>
            </div>
            <div className="info-item">
              <label>Created</label>
              <span>{formatDate(result.info.createdDate)}</span>
            </div>
            <div className="info-item">
              <label>Expires</label>
              <span>{formatDate(result.info.expiryDate)}</span>
            </div>
            <div className="info-item">
              <label>Last Updated</label>
              <span>{formatDate(result.info.updatedDate)}</span>
            </div>
            <div className="info-item">
              <label>Registrant Country</label>
              <span>{result.info.registrantCountry}</span>
            </div>
          </div>

          <div className="reasons-section">
            <h3>⚠️ Risk Analysis</h3>
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
  );
}

export default WhoisLookup;