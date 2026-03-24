import { useState } from "react";
import axios from "axios";

const getRiskColor = (risk) => {
  if (risk === "High Risk") return "#e74c3c";
  if (risk === "Medium Risk") return "#f39c12";
  return "#2ecc71";
};

function IpChecker() {
  const [ip, setIp] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!ip) return setError("Please enter an IP address.");
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post("http://localhost:5000/ip", { ip });
      setResult(response.data);
    } catch (err) {
      setError("Failed to analyze IP. Please check the address and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="tool-description">
        Check any IP address against VirusTotal and get geolocation information.
      </p>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter an IP address e.g. 8.8.8.8"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && analyze()}
        />
        <button onClick={analyze} disabled={loading}>
          {loading ? "Checking..." : "Check IP"}
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

          {result.geo && (
            <div className="info-grid" style={{ marginBottom: "20px" }}>
              <div className="info-item">
                <label>IP Address</label>
                <span>{result.ip}</span>
              </div>
              <div className="info-item">
                <label>Country</label>
                <span>{result.geo.country || "Unknown"}</span>
              </div>
              <div className="info-item">
                <label>City</label>
                <span>{result.geo.city || "Unknown"}</span>
              </div>
              <div className="info-item">
                <label>ISP</label>
                <span>{result.geo.isp || "Unknown"}</span>
              </div>
              <div className="info-item">
                <label>Organisation</label>
                <span>{result.geo.org || "Unknown"}</span>
              </div>
              <div className="info-item">
                <label>Timezone</label>
                <span>{result.geo.timezone || "Unknown"}</span>
              </div>
            </div>
          )}

          {result.virusTotal && (
            <div className="vt-stats" style={{ marginBottom: "20px" }}>
              <div className="vt-stat malicious">
                <span>{result.virusTotal.malicious}</span>
                <label>Malicious</label>
              </div>
              <div className="vt-stat suspicious">
                <span>{result.virusTotal.suspicious}</span>
                <label>Suspicious</label>
              </div>
              <div className="vt-stat harmless">
                <span>{result.virusTotal.harmless}</span>
                <label>Harmless</label>
              </div>
              <div className="vt-stat undetected">
                <span>{result.virusTotal.undetected}</span>
                <label>Undetected</label>
              </div>
            </div>
          )}

          <div className="reasons-section">
            <h3>⚠️ Analysis Results</h3>
            {result.reasons.length === 0 ? (
              <p className="no-issues">✅ No threats detected.</p>
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

export default IpChecker;