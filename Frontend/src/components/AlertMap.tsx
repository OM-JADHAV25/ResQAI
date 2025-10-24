import React, { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { 
  AlertTriangle, Navigation, Package, ListChecks, Clock, 
  Filter, RefreshCw, Search, ZoomIn, Users, Ambulance,
  Satellite, BarChart3, Download, Shield, Activity
} from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix for Leaflet default markers
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Type Definitions
type AlertPlan = {
  evacuation_routes?: string[];
  resources_needed?: string[];
  instructions?: string[];
  severity: string;
  timestamp: string;
  alert_type: string;
  priority_score?: number;
  estimated_affected?: number;
  response_time?: number;
  ai_analysis?: string[];
  required_teams?: string[];
};

type AlertData = {
  alert: {
    type: string;
    location: string;
    description: string;
    severity: string;
    contactName?: string;
    contactNumber?: string;
    isAnonymous: boolean;
    imageUrl?: string;
  };
  plan: AlertPlan;
  id: string;
};

// Mock geocoding service
const mockGeocoding = (location: string): [number, number] => {
  const locations: { [key: string]: [number, number] } = {
    "delhi": [28.6139, 77.209],
    "mumbai": [19.0760, 72.8777],
    "chennai": [13.0827, 80.2707],
    "kolkata": [22.5726, 88.3639],
    "bangalore": [12.9716, 77.5946],
    "hyderabad": [17.3850, 78.4867],
    "pune": [18.5204, 73.8567],
    "ahmedabad": [23.0225, 72.5714]
  };

  const normalizedLoc = location.toLowerCase();
  for (const [key, coords] of Object.entries(locations)) {
    if (normalizedLoc.includes(key)) {
      return coords;
    }
  }

  return [20.5937 + (Math.random() - 0.5) * 10, 78.9629 + (Math.random() - 0.5) * 10];
};

// Enhanced Popup Component
const EnhancedAlertPopup: React.FC<{ alert: AlertData; color: string }> = ({ alert, color }) => {
  const map = useMap();
  
  const handleZoomToLocation = () => {
    const [lat, lng] = mockGeocoding(alert.alert.location);
    map.setView([lat, lng], 13);
  };

  const getDisasterIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      earthquake: "🌋",
      flood: "🌊",
      fire: "🔥",
      landslide: "🏔️",
      cyclone: "🌀",
      accident: "🚗",
      medical: "🏥",
      terrorist: "🎯",
      industrial: "🏭"
    };
    return icons[type] || "⚠️";
  };

  return (
    <div className="premium-popup-content w-80 max-w-xs">
      {/* Header with Gradient */}
      <div 
        className="p-4 text-white rounded-t-xl"
        style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)` }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getDisasterIcon(alert.alert.type)}</div>
            <div>
              <h3 className="font-bold text-lg capitalize">{alert.alert.type}</h3>
              <p className="text-white/80 text-sm">
                {alert.alert.location}
              </p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm bg-white/20">
            {alert.plan.severity}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 bg-white">
        {/* Description */}
        <div>
          <p className="text-slate-700 leading-relaxed text-sm">
            {alert.alert.description}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <Users className="w-4 h-4 text-blue-600 mx-auto mb-1" />
            <div className="text-sm font-bold text-blue-700">
              {alert.plan.estimated_affected || 0}
            </div>
            <div className="text-xs text-blue-600">Affected</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <Ambulance className="w-4 h-4 text-green-600 mx-auto mb-1" />
            <div className="text-sm font-bold text-green-700">
              {alert.plan.response_time || 0}m
            </div>
            <div className="text-xs text-green-600">ETA</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <AlertTriangle className="w-4 h-4 text-orange-600 mx-auto mb-1" />
            <div className="text-sm font-bold text-orange-700">
              {alert.plan.priority_score || 0}/10
            </div>
            <div className="text-xs text-orange-600">Priority</div>
          </div>
        </div>

        {/* Action Sections */}
        <div className="space-y-3">
          {alert.plan.evacuation_routes && alert.plan.evacuation_routes.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-3 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-800">Evacuation Routes</span>
              </div>
              <div className="space-y-1">
                {alert.plan.evacuation_routes.slice(0, 2).map((route: string, i: number) => (
                  <div key={i} className="text-xs text-blue-700 flex items-center gap-2">
                    <span className="text-blue-500">→</span>
                    {route}
                  </div>
                ))}
              </div>
            </div>
          )}

          {alert.plan.instructions && alert.plan.instructions.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <ListChecks className="w-4 h-4 text-green-600" />
                <span className="text-sm font-bold text-green-800">Immediate Actions</span>
              </div>
              <ol className="space-y-1">
                {alert.plan.instructions.slice(0, 3).map((instruction: string, i: number) => (
                  <li key={i} className="text-xs text-green-700 flex items-start gap-2">
                    <span className="font-bold text-green-600">{i + 1}.</span>
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <div className="flex items-center gap-2 text-slate-500">
            <Clock className="w-3 h-3" />
            <span className="text-xs">{new Date(alert.plan.timestamp).toLocaleString()}</span>
          </div>
          <button
            onClick={handleZoomToLocation}
            className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-xs font-semibold hover:shadow-lg transition-all"
          >
            <ZoomIn className="w-3 h-3" />
            Zoom
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const AlertMap = () => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Enhanced mock data
  const demoAlerts: AlertData[] = [
    {
      id: "1",
      alert: {
        type: "earthquake",
        location: "Delhi Central District",
        description: "Major earthquake measuring 6.8 on Richter scale. Multiple buildings collapsed in city center. People trapped under rubble. Immediate rescue needed.",
        severity: "Critical",
        contactName: "Raj Sharma",
        contactNumber: "+91 98765 43210",
        isAnonymous: false,
        imageUrl: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=200&fit=crop"
      },
      plan: {
        severity: "Critical",
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        alert_type: "earthquake",
        priority_score: 9,
        estimated_affected: 15000,
        response_time: 8,
        evacuation_routes: ["NH48 to Gurgaon", "Metro Line Yellow", "Emergency air corridor"],
        resources_needed: ["Search & Rescue Teams", "Medical Supplies", "Temporary Shelter", "Food & Water"],
        instructions: ["Evacuate unstable buildings", "Set up emergency shelters", "Coordinate with NDRF", "Activate field hospitals"],
        required_teams: ["NDRF", "Medical", "Fire Department", "Police"],
        ai_analysis: ["Structural damage detected in 50+ buildings", "High probability of aftershocks", "Priority: Urban search and rescue"]
      }
    },
    {
      id: "2",
      alert: {
        type: "flood",
        location: "Mumbai Coastal Area",
        description: "Heavy monsoon rains causing severe flooding in low-lying areas. Water levels rising rapidly. Several families stranded.",
        severity: "High",
        contactName: "",
        contactNumber: "",
        isAnonymous: true,
        imageUrl: "https://images.unsplash.com/photo-1599423307810-4d2f2b9b6c94?w=400&h=200&fit=crop"
      },
      plan: {
        severity: "High",
        timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
        alert_type: "flood",
        priority_score: 7,
        estimated_affected: 8000,
        response_time: 15,
        evacuation_routes: ["Western Express Highway", "Eastern Freeway", "Boat rescue operations"],
        resources_needed: ["Boats", "Life Jackets", "Medical Teams", "Dry Food Packets"],
        instructions: ["Move to higher ground", "Avoid walking in floodwaters", "Use designated shelters", "Stay tuned for updates"],
        required_teams: ["Coast Guard", "Medical", "Disaster Response"],
        ai_analysis: ["Water levels rising 2cm/hour", "12 areas completely submerged", "Priority: Evacuation and relief"]
      }
    },
    {
      id: "3", 
      alert: {
        type: "fire",
        location: "Bangalore Tech Park",
        description: "Major fire outbreak in commercial building. Thick smoke visible from 5km away. Employees evacuated but some missing.",
        severity: "High",
        contactName: "Priya Patel",
        contactNumber: "+91 87654 32109",
        isAnonymous: false,
        imageUrl: "https://images.unsplash.com/photo-1566910641215-6633b6c77d2a?w=400&h=200&fit=crop"
      },
      plan: {
        severity: "High", 
        timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
        alert_type: "fire",
        priority_score: 8,
        estimated_affected: 500,
        response_time: 12,
        resources_needed: ["Fire Trucks", "Helicopters", "Fire Retardant", "Masks", "Ambulances"],
        instructions: ["Evacuate immediately", "Close all windows", "Wear protective masks", "Follow evacuation routes"],
        required_teams: ["Fire Department", "Medical", "Police"],
        ai_analysis: ["Fire spreading rapidly due to wind", "Chemical storage in building", "Priority: Fire containment and medical"]
      }
    }
  ];

  const disasterTypes = ["All", "earthquake", "flood", "fire", "landslide", "cyclone", "accident", "medical", "terrorist", "industrial"];

  const fetchAlerts = useCallback(async () => {
    try {
      setTimeout(() => {
        setAlerts(demoAlerts);
        setIsLoading(false);
        setIsRefreshing(false);
      }, 1000);
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
      setAlerts(demoAlerts);
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchAlerts();
  };

  const getColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical": return "#dc2626";
      case "high": return "#ef4444";
      case "medium": return "#f97316";
      case "low": return "#22c55e";
      default: return "#3b82f6";
    }
  };

  const getRadius = (severity: string, priority?: number) => {
    const baseRadius = {
      critical: 18,
      high: 14,
      medium: 10,
      low: 6
    }[severity.toLowerCase()] || 10;
    
    return priority ? baseRadius * (priority / 10) : baseRadius;
  };

  // Calculate statistics
  const severityCounts = {
    Critical: alerts.filter(a => a.plan.severity === "Critical").length,
    High: alerts.filter(a => a.plan.severity === "High").length,
    Medium: alerts.filter(a => a.plan.severity === "Medium").length,
    Low: alerts.filter(a => a.plan.severity === "Low").length,
  };

  // Filter alerts
  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = filterSeverity === "All" || alert.plan.severity === filterSeverity;
    const matchesType = filterType === "All" || alert.alert.type === filterType;
    const matchesSearch = searchQuery === "" || 
      alert.alert.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.alert.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSeverity && matchesType && matchesSearch;
  });

  const totalAffected = filteredAlerts.reduce((sum, alert) => sum + (alert.plan.estimated_affected || 0), 0);

  return (
    <div className="relative h-full w-full bg-white rounded-2xl overflow-hidden">
      {/* Control Panel - Fixed Positioning */}
      <div className="absolute top-4 right-4 z-[1000] space-y-3 w-72">
        {/* Search & Filter Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <Search className="w-4 h-4 text-white" />
            </div>
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 placeholder-slate-500 text-sm"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-2">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="p-2 rounded-lg text-xs font-semibold border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-700"
            >
              <option value="All">All Severity</option>
              <option value="Critical">🔴 Critical</option>
              <option value="High">🟠 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-2 rounded-lg text-xs font-semibold border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-700"
            >
              {disasterTypes.map(type => (
                <option key={type} value={type}>
                  {type === "All" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-xs font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl shadow-lg p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-200" />
              <span className="text-sm font-semibold text-blue-100">LIVE ALERTS</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-200">Live</span>
            </div>
          </div>
          
          <div className="text-center mb-3">
            <div className="text-2xl font-bold">{filteredAlerts.length}</div>
            <div className="text-xs text-blue-200">Active Incidents</div>
          </div>

          <div className="grid grid-cols-4 gap-1">
            <div className="text-center">
              <div className="text-sm font-bold text-red-200">{severityCounts.Critical}</div>
              <div className="text-[10px] text-red-300">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-orange-200">{severityCounts.High}</div>
              <div className="text-[10px] text-orange-300">High</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-yellow-200">{severityCounts.Medium}</div>
              <div className="text-[10px] text-yellow-300">Medium</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-green-200">{severityCounts.Low}</div>
              <div className="text-[10px] text-green-300">Low</div>
            </div>
          </div>
        </div>

        {/* Response Teams */}
        <div className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-xl shadow-lg p-3 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-emerald-200" />
            <span className="text-sm font-semibold text-emerald-100">RESPONSE TEAMS</span>
          </div>
          <div className="space-y-1">
            {[
              { name: "NDRF", count: 12 },
              { name: "Medical", count: 8 },
              { name: "Fire Dept", count: 15 }
            ].map(team => (
              <div key={team.name} className="flex justify-between items-center">
                <span className="text-xs text-emerald-200">{team.name}</span>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold">{team.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/90 z-[1000] flex items-center justify-center rounded-2xl">
          <div className="text-center">
            <div className="relative mb-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <Satellite className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-slate-700 font-semibold text-sm">Loading Emergency Map</p>
          </div>
        </div>
      )}

      {/* Map Container - Fixed for ResQAI Layout */}
      <div className="h-full w-full">
        <MapContainer
          center={[28.6139, 77.209]}
          zoom={5}
          className="h-full w-full rounded-2xl"
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Alert Markers */}
          {filteredAlerts.map((alert) => {
            const [lat, lng] = mockGeocoding(alert.alert.location);
            const color = getColor(alert.plan.severity);
            const radius = getRadius(alert.plan.severity, alert.plan.priority_score);
            
            return (
              <CircleMarker
                key={alert.id}
                center={[lat, lng]}
                radius={radius}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.7,
                  weight: 2,
                  opacity: 0.9,
                }}
              >
                <Popup className="rounded-xl">
                  <EnhancedAlertPopup alert={alert} color={color} />
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-[1000]">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-slate-700">LIVE</span>
              </div>
              <div className="text-sm text-slate-600">
                <span className="font-semibold">{filteredAlerts.length}</span> active •{" "}
                <span className="font-semibold">{totalAffected.toLocaleString()}</span> affected
              </div>
            </div>
            <div className="text-sm text-slate-600">
              Updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertMap;