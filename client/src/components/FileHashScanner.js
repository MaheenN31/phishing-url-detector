import { useState } from "react";
import axios from "axios";

const getRiskColor = (risk) => {
  if (risk === "High Risk") return "#e74c3c";
  if (risk === "Medium Risk") return "#f39c12";
  return "#2ecc71";
};

function FileHashScanner() {
  const [hash, setHash] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!hash) return setError("Please enter a file hash.");
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post("http://localhost:5000/hash", { hash });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to analyze hash.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="tool-description">
        Enter a file's MD5, SHA1, or SHA256 hash to check if it's known malware.
      </p>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter MD5, SHA1 or SHA256 hash..."
          value={hash}
          onChange={(e) => setHash(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && analyze()}
        />
        <button onClick={analyze} disabled={loading}>
          {loading ? "Scanning..." : "Scan Hash"}
        </button>
      </div>

      <p style={{ fontSize: "0.8rem", color: "#666", marginTop: "-10px", marginBottom: "16px" }}>
        💡 You can get a file's hash by right-clicking it in Windows and using a tool like 7-Zip or CertUtil
      </p>

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

          {result.fileInfo && (
            <div className="info-grid" style={{ marginBottom: "20px" }}>
              <div className="info-item">
                <label>File Name</label>
                <span>{result.fileInfo.name}</span>
              </div>
              <div className="info-item">
                <label>File Type</label>
                <span>{result.fileInfo.type}</span>
              </div>
              <div className="info-item">
                <label>File Size</label>
                <span>{result.fileInfo.size}</span>
              </div>
              <div className="info-item">
                <label>MD5</label>
                <span style={{ fontSize: "0.75rem" }}>{result.fileInfo.md5}</span>
              </div>
              <div className="info-item">
                <label>SHA1</label>
                <span style={{ fontSize: "0.75rem" }}>{result.fileInfo.sha1}</span>
              </div>
              <div className="info-item">
                <label>SHA256</label>
                <span style={{ fontSize: "0.75rem" }}>{result.fileInfo.sha256}</span>
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
            <h3>⚠️ Scan Results</h3>
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

export default FileHashScanner;