import { useState } from "react";
import UrlScanner from "./components/UrlScanner";
import EmailAnalyzer from "./components/EmailAnalyzer";
import "./App.css";
import IpChecker from "./components/IpChecker";

const tabs = [
  { id: "url", label: "🔗 URL Scanner" },
  { id: "email", label: "📧 Email Analyzer" },
  { id: "ip", label: "🌐 IP Checker" },
  { id: "hash", label: "📁 File Hash" },
  { id: "whois", label: "🕵️ WHOIS Lookup" },
];

function App() {
  const [activeTab, setActiveTab] = useState("url");

  const renderTool = () => {
    switch (activeTab) {
      case "url": return <UrlScanner />;
      case "email": return <EmailAnalyzer />;
      case "ip": return <IpChecker />;
      default: return <p className="coming-soon">🚧 Coming soon...</p>;
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>🛡️ CyberShield</h1>
        <p className="subtitle">Your all-in-one cybersecurity analysis toolkit</p>

        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {renderTool()}
        </div>
      </div>
    </div>
  );
}

export default App;