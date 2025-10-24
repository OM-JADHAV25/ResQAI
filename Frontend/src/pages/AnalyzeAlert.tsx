import React, { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  MapPin, 
  Brain, 
  Shield, 
  Zap,
  ChevronRight,
  Sparkles,
  Navigation,
  Satellite,
  Radio,
  Users,
  Ambulance,
  Package,
  ListChecks,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import AlertForm from "../components/AlertForm";
import AlertMap from "../components/AlertMap";

// Mock function to simulate backend API call
const simulateBackendAPI = async (alertData: any) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Simulate AI analysis response
  return {
    success: true,
    data: {
      alert_type: alertData.type,
      location: alertData.location,
      description: alertData.description,
      severity: alertData.severity,
      plan: {
        evacuation_routes: [
          "Primary: NH24 to Ghaziabad",
          "Secondary: Metro Blue Line",
          "Emergency: Boat evacuation points at Rajghat"
        ],
        resources_needed: [
          "Rescue Boats",
          "Life Jackets",
          "Medical Teams", 
          "Temporary Shelter",
          "Food & Water Supply"
        ],
        instructions: [
          "Evacuate low-lying areas immediately",
          "Move to designated shelters",
          "Avoid walking in floodwaters",
          "Stay tuned for emergency broadcasts"
        ],
        priority_score: 92,
        risk_analysis: "High risk of waterborne diseases, structural damage to buildings near riverbank",
        estimated_response_time: "15-20 minutes",
        required_teams: ["NDRF", "Medical", "Fire Department", "Police"]
      },
      timestamp: new Date().toISOString(),
      alert_id: `ALERT_${Date.now()}`
    }
  };
};

const AnalyzeAlert: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"alert" | "map" | "ai">("alert");
  const [isAnimating, setIsAnimating] = useState(false);
  const [processingState, setProcessingState] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);

  const handleTabChange = (tab: "alert" | "map" | "ai") => {
    if (tab === activeTab || isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsAnimating(false);
    }, 400);
  };

  const handleAlertSubmit = async (alertData: any) => {
    setProcessingState('processing');
    
    try {
      const response = await simulateBackendAPI(alertData);
      
      if (response.success) {
        setProcessingState('success');
        setAiAnalysis(response.data);
        
        // Add to recent alerts
        setRecentAlerts(prev => [response.data, ...prev.slice(0, 4)]);
        
        // Auto-switch to AI Analysis tab after 2 seconds
        setTimeout(() => {
          handleTabChange('ai');
        }, 2000);
      }
    } catch (error) {
      setProcessingState('error');
      console.error('Alert submission failed:', error);
    }
  };

  const tabs = [
    {
      id: "alert" as const,
      label: "Submit Alert",
      icon: AlertTriangle,
      description: "Report emergency situation",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      borderColor: "border-orange-200"
    },
    {
      id: "map" as const,
      label: "Live Map",
      icon: MapPin,
      description: "Real-time disaster monitoring",
      gradient: "from-blue-500 to-purple-600",
      bgGradient: "from-blue-50 to-purple-50",
      borderColor: "border-blue-200"
    },
    {
      id: "ai" as const,
      label: "AI Analysis",
      icon: Brain,
      description: "Smart response planning",
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50",
      borderColor: "border-green-200"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      {/* Floating Tabs Navigation - Separate Rectangular Component */}
      <div className="container mx-auto px-6 -mb-8 relative z-40 pt-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-2xl border border-slate-200/60">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  disabled={isAnimating}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl transition-all duration-500 relative overflow-hidden group ${
                    isActive 
                      ? `text-white shadow-2xl scale-105`
                      : "text-slate-600 hover:text-slate-800 hover:bg-slate-50/80"
                  } ${isAnimating ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {/* Animated Background */}
                  <div className={`absolute inset-0 transition-all duration-500 ${
                    isActive 
                      ? `bg-gradient-to-r ${tab.gradient} opacity-100`
                      : 'bg-transparent opacity-0 group-hover:bg-slate-100/50'
                  }`}></div>
                  
                  {/* Tab Content */}
                  <div className="relative z-10 flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : `bg-gradient-to-r ${tab.gradient} text-white`
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="text-left">
                      <div className={`font-semibold transition-all duration-300 ${
                        isActive ? 'text-white' : 'text-slate-700'
                      }`}>
                        {tab.label}
                      </div>
                      <div className={`text-xs transition-all duration-300 ${
                        isActive ? 'text-white/80' : 'text-slate-500'
                      }`}>
                        {tab.description}
                      </div>
                    </div>
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1/3 h-0.5 bg-white/60 rounded-full"></div>
                  )}

                  {/* Notification Badge */}
                  {tab.id === 'ai' && aiAnalysis && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-6 py-8">
        <div className={`rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-2xl overflow-hidden transition-all duration-500 ${
          isAnimating ? 'opacity-70 scale-95' : 'opacity-100 scale-100'
        }`}>
          
          {/* Alert Submission Tab */}
          {activeTab === "alert" && (
            <div className="animate-fadeIn">
              <div className="p-1">
                <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      Emergency Alert System
                    </h2>
                    <p className="text-slate-600 mt-2">Report disasters for immediate AI-powered response coordination</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-3">
                      <AlertForm onSubmit={handleAlertSubmit} />
                    </div>
                    
                    {/* Processing Status Panel */}
                    <div className="space-y-6">
                      {/* Processing Status */}
                      {processingState !== 'idle' && (
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
                          <div className="text-center">
                            {processingState === 'processing' && (
                              <>
                                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <h3 className="font-bold text-slate-800 mb-2">AI Analysis in Progress</h3>
                                <p className="text-slate-600 text-sm">Gemini AI is analyzing the emergency situation...</p>
                                <div className="mt-4 space-y-2">
                                  <div className="flex justify-between text-xs text-slate-500">
                                    <span>Severity Assessment</span>
                                    <span>▰▰▰▰▰</span>
                                  </div>
                                  <div className="flex justify-between text-xs text-slate-500">
                                    <span>Risk Analysis</span>
                                    <span>▰▰▰▰▰</span>
                                  </div>
                                  <div className="flex justify-between text-xs text-slate-500">
                                    <span>Response Planning</span>
                                    <span>▰▰▰▰▰</span>
                                  </div>
                                </div>
                              </>
                            )}
                            
                            {processingState === 'success' && (
                              <>
                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h3 className="font-bold text-green-700 mb-2">Alert Submitted Successfully!</h3>
                                <p className="text-slate-600 text-sm">AI analysis complete. Switching to results...</p>
                              </>
                            )}
                            
                            {processingState === 'error' && (
                              <>
                                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                                <h3 className="font-bold text-red-700 mb-2">Submission Failed</h3>
                                <p className="text-slate-600 text-sm">Please try again in a moment</p>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Quick Stats */}
                      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                          <Radio className="w-4 h-4 text-green-400" />
                          Live Stats
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300 text-sm">Active Alerts</span>
                            <span className="font-bold text-white">12</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300 text-sm">Response Teams</span>
                            <span className="font-bold text-white">47</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300 text-sm">Avg Response Time</span>
                            <span className="font-bold text-green-400">8m</span>
                          </div>
                        </div>
                      </div>

                      {/* Recent Alerts */}
                      {recentAlerts.length > 0 && (
                        <div className="bg-white rounded-2xl p-6 border border-slate-200">
                          <h3 className="font-bold text-slate-800 mb-4">Recent Alerts</h3>
                          <div className="space-y-3">
                            {recentAlerts.map((alert, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <div className={`w-3 h-3 rounded-full ${
                                  alert.severity === 'Critical' ? 'bg-red-500' :
                                  alert.severity === 'High' ? 'bg-orange-500' :
                                  alert.severity === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                                }`}></div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-slate-800">{alert.alert_type}</div>
                                  <div className="text-xs text-slate-500">{alert.location}</div>
                                </div>
                                <div className="text-xs text-slate-400">
                                  {new Date(alert.timestamp).toLocaleTimeString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Live Map Tab */}
          {activeTab === "map" && (
            <div className="animate-fadeIn">
              <div className="p-1">
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Live Disaster Map
                      </h2>
                      <p className="text-slate-600 mt-1">Real-time emergency alerts and response coordination</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border border-slate-200">
                        <Satellite className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold text-slate-700">Live Satellite</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-[600px] rounded-2xl overflow-hidden border-2 border-white shadow-2xl">
                    <AlertMap />
                  </div>

                  {/* Map Legend */}
                  <div className="mt-6 grid grid-cols-4 gap-4">
                    {[
                      { level: "Critical", color: "bg-red-500", count: recentAlerts.filter(a => a.severity === 'Critical').length },
                      { level: "High", color: "bg-orange-500", count: recentAlerts.filter(a => a.severity === 'High').length },
                      { level: "Medium", color: "bg-yellow-500", count: recentAlerts.filter(a => a.severity === 'Medium').length },
                      { level: "Low", color: "bg-green-500", count: recentAlerts.filter(a => a.severity === 'Low').length }
                    ].map((item) => (
                      <div key={item.level} className="bg-white/80 rounded-xl p-4 border border-slate-200 backdrop-blur-sm hover-lift">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 ${item.color} rounded-full shadow-lg`}></div>
                          <div>
                            <div className="font-semibold text-slate-800">{item.level}</div>
                            <div className="text-2xl font-bold text-slate-900">{item.count}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Analysis Tab */}
          {activeTab === "ai" && (
            <div className="animate-fadeIn">
              <div className="p-1">
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-600/10 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        AI Intelligence Analysis
                      </h2>
                      <p className="text-slate-600 mt-1">Smart disaster assessment and response planning</p>
                    </div>
                    <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm font-semibold">Gemini AI Active</span>
                    </div>
                  </div>

                  {aiAnalysis ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left Column - Analysis Results */}
                      <div className="space-y-6">
                        {/* Alert Summary */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-500 p-2 rounded-xl">
                              <Brain className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-bold text-slate-800">AI Risk Assessment</h3>
                          </div>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                              <span className="text-sm text-slate-700">Severity Prediction</span>
                              <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold">92% Accurate</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <span className="text-sm text-slate-700">Response Time</span>
                              <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-bold">
                                {aiAnalysis.plan.estimated_response_time}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                              <span className="text-sm text-slate-700">Priority Score</span>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                getPriorityColor(aiAnalysis.plan.priority_score)
                              } bg-orange-100`}>
                                {aiAnalysis.plan.priority_score}/100
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Risk Analysis */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-red-500 p-2 rounded-xl">
                              <AlertTriangle className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-bold text-slate-800">Risk Analysis</h3>
                          </div>
                          <p className="text-slate-700 text-sm leading-relaxed">
                            {aiAnalysis.plan.risk_analysis}
                          </p>
                        </div>

                        {/* Required Teams */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-purple-500 p-2 rounded-xl">
                              <Users className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-bold text-slate-800">Required Response Teams</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {aiAnalysis.plan.required_teams.map((team: string, index: number) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium border border-purple-200"
                              >
                                {team}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Action Plan */}
                      <div className="space-y-6">
                        {/* Response Plan */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-500 p-2 rounded-xl">
                              <ListChecks className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-bold text-slate-800">AI Response Plan</h3>
                          </div>
                          <div className="space-y-4">
                            {aiAnalysis.plan.instructions.map((instruction: string, index: number) => (
                              <div key={index} className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold mt-1">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm text-slate-700">{instruction}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Resources Needed */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-orange-500 p-2 rounded-xl">
                              <Package className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-bold text-slate-800">Resources Required</h3>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {aiAnalysis.plan.resources_needed.map((resource: string, index: number) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <span className="text-sm text-slate-700">{resource}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Evacuation Routes */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-500 p-2 rounded-xl">
                              <Navigation className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-bold text-slate-800">Evacuation Routes</h3>
                          </div>
                          <div className="space-y-2">
                            {aiAnalysis.plan.evacuation_routes.map((route: string, index: number) => (
                              <div key={index} className="flex items-center gap-3 p-2 bg-green-50 rounded-lg border border-green-200">
                                <Sparkles className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-slate-700">{route}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Empty State */
                    <div className="text-center py-16">
                      <Brain className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-600 mb-2">No Analysis Available</h3>
                      <p className="text-slate-500">Submit an emergency alert to generate AI analysis</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyzeAlert;