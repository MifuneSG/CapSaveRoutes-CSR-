
import { useState, useEffect } from "react";
import {
  AlertCircle,
  Star,
  Flag,
  Target,
  CircleArrowOutUpRight,
  Zap,
  ArrowRightFromLine
} from "lucide-react";
import './main.css';

// Constants
const TITAN_BRIDGE_SYSTEMS = ["0SHT-A", "Y-2ANO", "XWY-YM"];
const DEFAULT_SOURCE_SYSTEM = "UALX-3";

const MOCK_SYSTEMS = [
  "Jita", "Amarr", "Dodixie", "Rens", "Hek", "1DQ1-A", "UALX-3", "Catch",
  "Providence", "Syndicate", "Venal", "Deklein", "Pure Blind", "Fountain"
];

const MOCK_API_RESPONSE = {
  "route": [
    { "system": "UALX-3", "action": "Start", "details": "Starting system", "region": "Catch" },
    { "system": "3L3N-X", "action": "Stargate", "details": "Standard jump", "region": "Catch" },
    { "system": "Q-S7ZD", "action": "Stargate", "details": "Standard jump", "region": "Catch" },
    { "system": "U-QVWD", "action": "Ansiblex", "details": "Jump Gate to 0SHT-A", "region": "Stain" },
    { "system": "0SHT-A", "action": "Titan", "details": "Bridge to Y-2ANO", "region": "Stain" },
    { "system": "Y-2ANO", "action": "Stargate", "details": "Standard jump", "region": "Esoteria" },
    { "system": "FWST-8", "action": "Stargate", "details": "Standard jump", "region": "Delve" },
    { "system": "1DQ1-A", "action": "Arrive", "details": "Destination reached", "region": "Delve" }
  ],
  "jumpRanges": {
    "isInSuperRange": false,
    "isInCapitalRange": true,
    "isInBlopsRange": true,
    "isInIndustrialRange": true
  }
};

export default function EVERoutePlanner() {
  const [sourceSystem, setSourceSystem] = useState(DEFAULT_SOURCE_SYSTEM);
  const [destSystem, setDestSystem] = useState("");
  const [searchSource, setSearchSource] = useState(DEFAULT_SOURCE_SYSTEM);
  const [searchDest, setSearchDest] = useState("");
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredSourceSystems, setFilteredSourceSystems] = useState([]);
  const [filteredDestSystems, setFilteredDestSystems] = useState([]);

  useEffect(() => {
    if (searchSource) {
      setFilteredSourceSystems(
        MOCK_SYSTEMS.filter(sys =>
          sys.toLowerCase().includes(searchSource.toLowerCase())
        ).slice(0, 5)
      );
    } else {
      setFilteredSourceSystems([]);
    }
  }, [searchSource]);

  useEffect(() => {
    if (searchDest) {
      setFilteredDestSystems(
        MOCK_SYSTEMS.filter(sys =>
          sys.toLowerCase().includes(searchDest.toLowerCase())
        ).slice(0, 5)
      );
    } else {
      setFilteredDestSystems([]);
    }
  }, [searchDest]);

  const calculateRoute = () => {
    if (!sourceSystem || !destSystem) {
      setError("Please select both source and destination systems");
      return;
    }

    setLoading(true);
    setError(null);

    setTimeout(() => {
      setRoute(MOCK_API_RESPONSE.route);
      setLoading(false);
    }, 1500);
  };

  const renderActionIcon = (action) => {
    switch (action) {
      case "Stargate":
        return <ArrowRightFromLine className="icon" color="#60a5fa" />;
      case "Titan":
        return <CircleArrowOutUpRight className="icon" color="#c084fc" />;
      case "Ansiblex":
        return <Zap className="icon" color="#facc15" />;
      case "Start":
        return <Flag className="icon" color="#4ade80" />;
      case "Arrive":
        return <Target className="icon" color="#4ade80" />;
      default:
        return <Star className="icon" color="#9ca3af" />;
    }
  };

  return (
    <div className="route-planner">
      <h1>CAP SAVE ROUTES (CSR)</h1>
      <p style={{ textAlign: 'center', color: '#9ca3af' }}>Helping you save captials</p>

      <div className="system-input">
        <label>Source System</label>
        <input
          type="text"
          value={searchSource}
          onChange={(e) => setSearchSource(e.target.value)}
          placeholder="Type to search systems..."
        />
        {filteredSourceSystems.map(sys => (
          <div key={sys} onClick={() => { setSourceSystem(sys); setSearchSource(sys); setFilteredSourceSystems([]); }}>
            {sys}
          </div>
        ))}
      </div>

      <div className="system-input">
        <label>Destination System</label>
        <input
          type="text"
          value={searchDest}
          onChange={(e) => setSearchDest(e.target.value)}
          placeholder="Type to search systems..."
        />
        {filteredDestSystems.map(sys => (
          <div key={sys} onClick={() => { setDestSystem(sys); setSearchDest(sys); setFilteredDestSystems([]); }}>
            {sys}
          </div>
        ))}
      </div>

      <button onClick={calculateRoute} disabled={loading}>
        {loading ? "Calculating..." : "Find Route"}
      </button>

      {error && (
        <div style={{ color: '#f87171', marginTop: '10px' }}>
          <AlertCircle style={{ marginRight: '6px' }} />
          {error}
        </div>
      )}

      {(sourceSystem && destSystem) && (
        <div className="status-container">
          <div className={`status-box ${MOCK_API_RESPONSE.jumpRanges.isInSuperRange ? "in-range" : "out-of-range"}`}>
            <div>Supercarrier</div>
            <div>{MOCK_API_RESPONSE.jumpRanges.isInSuperRange ? "In Range" : "Out of Range"}</div>
          </div>
          <div className={`status-box ${MOCK_API_RESPONSE.jumpRanges.isInCapitalRange ? "in-range" : "out-of-range"}`}>
            <div>Capital Ships</div>
            <div>{MOCK_API_RESPONSE.jumpRanges.isInCapitalRange ? "In Range" : "Out of Range"}</div>
          </div>
          <div className={`status-box ${MOCK_API_RESPONSE.jumpRanges.isInBlopsRange ? "in-range" : "out-of-range"}`}>
            <div>Black Ops</div>
            <div>{MOCK_API_RESPONSE.jumpRanges.isInBlopsRange ? "In Range" : "Out of Range"}</div>
          </div>
          <div className={`status-box ${MOCK_API_RESPONSE.jumpRanges.isInIndustrialRange ? "in-range" : "out-of-range"}`}>
            <div>Jump Freighter</div>
            <div>{MOCK_API_RESPONSE.jumpRanges.isInIndustrialRange ? "In Range" : "Out of Range"}</div>
          </div>
        </div>
      )}

      {route && (
        <>
          <h2>Route: {sourceSystem} → {destSystem}</h2>
          {route.map((step, idx) => (
            <div key={idx} className="route-step">
              {renderActionIcon(step.action)}
              <div>
                <strong>{step.system}</strong> — {step.details}
                <div style={{ fontSize: '0.8em', color: '#94a3b8' }}>{step.region}</div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
