import React, { useState } from "react";
import { AlertTriangle, Shield, Activity, MapPin, Zap, Bell } from "lucide-react";

// Import your existing components (you'll replace these)
import AlertForm from "./components/AlertForm";
import AlertMap from "./components/AlertMap";
import AnalyzeAlert from "./pages/AnalyzeAlert";

function App() {
  const [activeAlerts, setActiveAlerts] = useState(12);
  const [respondersActive, setRespondersActive] = useState(47);
  const [areasMonitored, setAreasMonitored] = useState(156);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Premium Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-red-500 to-orange-600 p-2.5 rounded-xl shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  ResQAI
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  AI-Powered Emergency Intelligence
                </p>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-700">
                System Active
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Dashboard */}
      <div className="container mx-auto px-6 py-6">

        <AnalyzeAlert />

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Powered by{" "}
            <span className="font-semibold text-slate-700">Gemini AI</span> ·
            Deployed on{" "}
            <span className="font-semibold text-slate-700">Google Cloud</span> ·
            Real-time Emergency Response Platform
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;