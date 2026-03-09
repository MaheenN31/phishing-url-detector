import { useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell } from "recharts";
import "./App.css";

const RADIAN = Math.PI / 180;

function GaugeMeter({ score }) {
  const width = 300;
  const height = 180;
  const cx = width / 2;
  const cy = height - 20;
  const iR = 90;
  const oR = 120;

  const segments = [
    { value: 30, color: "#2ecc71" },
    { value: 30, color: "#f39c12" },
    { value: 40, color: "#e74c3c" },
  ];

  const needle = (value, cx, cy, iR, oR) => {
    const angle = 180 - (value / 100) * 180;
    const length = (iR + oR) / 2;
    const sin = Math.sin(-RADIAN * angle);
    const cos = Math.cos(-RADIAN * angle);
    const r = 6;
    const x0 = cx;
    const y0 = cy;
    const xba = x0 + r * sin;
    const yba = y0 - r * cos;
    const xbb = x0 - r * sin;
    const ybb = y0 + r * cos;
    const xp = x0 + length * cos;
    const yp = y0 + length * sin;

    return (
      <g>
        <circle cx={x0} cy={y0} r={r} fill="#fff" stroke="none" />
        <path
          d={`M${xba} ${yba} L${xbb} ${ybb} L${xp} ${yp} Z`}
          fill="#fff"
        />
      </g>
    );
  };

  return (
    <PieChart width={width} height={height}>
      <Pie
        dataKey="value"
        startAngle={180}
        endAngle={0}
        data={segments}
        cx={cx}
        cy={cy}
        innerRadius={iR}
        outerRadius={oR}
        stroke="none"
      >
        {segments.map((entry, index) => (
          <Cell key={index} fill={entry.color} />
        ))}
      </Pie>
      {needle(score, cx, cy, iR, oR)}
      <text x={cx} y={cy - 30} textAnchor="middle" fill="#4a90e2" fontSize={28} fontWeight="bold">
        {score}
      </text>
      <text x={cx} y={cy - 10} textAnchor="middle" fill="#4a90e2" fontSize={12}>
        / 100
      </text>
    </PieChart>
  );
}

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
            <div className="gauge-section">
              <GaugeMeter score={result.score} />
              <div
                className="risk-badge"
                style={{ backgroundColor: getRiskColor(result.risk) }}
              >
                {result.risk}
              </div>
            </div>

            {result.virusTotal && (
              <div className="vt-stats">
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