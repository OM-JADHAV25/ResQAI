import React, { useState, useRef } from "react";
import { 
  AlertCircle, 
  MapPin, 
  FileText, 
  AlertTriangle, 
  Send, 
  Clock, 
  Users, 
  Navigation, 
  Satellite, 
  Shield, 
  Camera,
  User, 
  Eye, 
  EyeOff, 
  Upload,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  CheckCircle,
  X,
  Plus,
  Minus
} from "lucide-react";

interface AlertFormData {
  type: string;
  location: string;
  description: string;
  severity: string;
  estimatedAffected: number;
  immediateThreats: string[];
  contactName: string;
  contactNumber: string;
  isAnonymous: boolean;
  image: File | null;
}

interface AlertFormProps {
  onSubmit: (alertData: any) => void;
}

const AlertForm: React.FC<AlertFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<AlertFormData>({
    type: "",
    location: "",
    description: "",
    severity: "Medium",
    estimatedAffected: 0,
    immediateThreats: [],
    contactName: "",
    contactNumber: "",
    isAnonymous: false,
    image: null
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const disasterTypes = [
    { value: "flood", label: "Flood", icon: "🌊", color: "from-blue-500 to-cyan-500", bgColor: "bg-blue-500" },
    { value: "earthquake", label: "Earthquake", icon: "🌋", color: "from-orange-500 to-red-500", bgColor: "bg-orange-500" },
    { value: "fire", label: "Fire", icon: "🔥", color: "from-red-500 to-orange-500", bgColor: "bg-red-500" },
    { value: "landslide", label: "Landslide", icon: "🏔️", color: "from-amber-500 to-yellow-500", bgColor: "bg-amber-500" },
    { value: "cyclone", label: "Cyclone", icon: "🌀", color: "from-purple-500 to-pink-500", bgColor: "bg-purple-500" },
    { value: "accident", label: "Accident", icon: "🚗", color: "from-gray-500 to-slate-500", bgColor: "bg-gray-500" },
    { value: "medical", label: "Medical", icon: "🏥", color: "from-green-500 to-emerald-500", bgColor: "bg-green-500" },
    { value: "terrorist", label: "Terror Attack", icon: "🎯", color: "from-rose-500 to-red-500", bgColor: "bg-rose-500" }
  ];

  const threatOptions = [
    "Structural Damage", "Fire Hazard", "Flooding", "Chemical Spill",
    "Power Outage", "Communication Failure", "Road Blockage", 
    "Medical Emergency", "Food Shortage", "Water Contamination", 
    "Gas Leak", "Building Collapse", "Tsunami Risk", "Landslide Risk"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const alertData = {
        type: formData.type,
        location: formData.location,
        description: formData.description,
        severity: formData.severity,
        estimatedAffected: formData.estimatedAffected,
        immediateThreats: formData.immediateThreats,
        contact: formData.isAnonymous ? null : {
          name: formData.contactName,
          number: formData.contactNumber
        },
        image: formData.image
      };

      await onSubmit(alertData);
      
      setFormData({
        type: "",
        location: "",
        description: "",
        severity: "Medium",
        estimatedAffected: 0,
        immediateThreats: [],
        contactName: "",
        contactNumber: "",
        isAnonymous: false,
        image: null
      });
      setImagePreview("");
      setAiSuggestions([]);
      
    } catch (err) {
      setMessage("❌ Submission failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => Math.min(prev + 1, 4));
        setIsAnimating(false);
      }, 400);
    }
  };

  const prevStep = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => Math.max(prev - 1, 1));
      setIsAnimating(false);
    }, 400);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.type || !formData.location) {
          setMessage("❌ Please fill all required fields");
          return false;
        }
        return true;
      case 2:
        if (!formData.description || formData.description.length < 20) {
          setMessage("❌ Please provide a detailed description (min 20 characters)");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      setTimeout(() => {
        setAiSuggestions(prev => [
          ...prev,
          "📸 AI detected structural damage in uploaded image",
          "🔍 Image analysis confirms high severity situation",
          "🚨 Multiple people detected in affected area"
        ]);
      }, 1500);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview("");
  };

  const addThreat = (threat: string) => {
    if (!formData.immediateThreats.includes(threat)) {
      setFormData(prev => ({
        ...prev,
        immediateThreats: [...prev.immediateThreats, threat]
      }));
    }
  };

  const removeThreat = (threat: string) => {
    setFormData(prev => ({
      ...prev,
      immediateThreats: prev.immediateThreats.filter(t => t !== threat)
    }));
  };

  const detectLocation = () => {
    setFormData(prev => ({ 
      ...prev, 
      location: "Current Location (GPS) - Lat: 28.6139, Lng: 77.209" 
    }));
    setMessage("📍 Location detected via GPS");
  };

  const getSeverityConfig = (severity: string) => {
    const config = {
      Low: { color: "from-green-500 to-emerald-500", bg: "bg-green-500", text: "text-green-700" },
      Medium: { color: "from-yellow-500 to-amber-500", bg: "bg-yellow-500", text: "text-yellow-700" },
      High: { color: "from-orange-500 to-red-500", bg: "bg-orange-500", text: "text-orange-700" },
      Critical: { color: "from-red-600 to-rose-700", bg: "bg-red-600", text: "text-red-700" }
    };
    return config[severity as keyof typeof config] || config.Medium;
  };

  const stepConfigs = [
    { number: 1, title: "Emergency Details", icon: AlertCircle },
    { number: 2, title: "Impact Assessment", icon: AlertTriangle },
    { number: 3, title: "Contact Info", icon: User },
    { number: 4, title: "Review & Submit", icon: Shield }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Premium Glass Container */}
      <div className="glass-effect premium-shadow rounded-3xl overflow-hidden">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 p-1">
          <div className="bg-white/5 backdrop-blur-sm rounded-t-3xl p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="relative">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 rounded-2xl shadow-2xl hover-lift">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                    Emergency Alert System
                  </h2>
                  <p className="text-slate-300 text-sm mt-2">
                    AI-Powered Disaster Response & Rescue Coordination
                  </p>
                </div>
              </div>
            </div>

            {/* Animated Progress Steps */}
            <div className="flex justify-between items-center mb-8 relative">
              <div className="absolute top-4 left-0 right-0 h-2 bg-slate-700/50 rounded-full -z-10">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                ></div>
              </div>
              
              {stepConfigs.map((step, index) => {
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                const Icon = step.icon;
                
                return (
                  <div key={step.number} className="flex flex-col items-center z-10">
                    <div className={`relative transition-all duration-500 ${
                      isActive ? 'scale-110' : 'scale-100'
                    }`}>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        isCompleted 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
                          : isActive
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl shadow-blue-500/25'
                          : 'bg-slate-700 text-slate-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <Icon className="w-6 h-6" />
                        )}
                      </div>
                      {isActive && (
                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20 animate-pulse"></div>
                      )}
                    </div>
                    <span className={`text-xs mt-3 font-medium transition-all duration-300 ${
                      isActive || isCompleted ? 'text-white' : 'text-slate-400'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white/95 backdrop-blur-sm p-8">
          <form onSubmit={handleSubmit}>
            <div className={`transition-all duration-500 ${
              isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}>
              
              {/* Step 1: Emergency Details */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-fadeIn">
                  {/* Disaster Type Selection */}
                  <div>
                    <label className="flex items-center gap-3 text-lg font-bold text-slate-800 mb-6">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-xl">
                        <AlertCircle className="w-6 h-6 text-white" />
                      </div>
                      Disaster Type *
                    </label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {disasterTypes.map((disaster) => (
                        <button
                          key={disaster.value}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, type: disaster.value }));
                            setMessage("");
                          }}
                          className={`group relative p-6 rounded-2xl border-2 transition-all duration-500 hover-lift ${
                            formData.type === disaster.value
                              ? `border-transparent bg-gradient-to-r ${disaster.color} text-white shadow-2xl scale-105`
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow-xl"
                          }`}
                        >
                          {/* Hover Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
                          
                          <div className="relative z-10 space-y-3">
                            <div className="text-3xl">{disaster.icon}</div>
                            <div className="text-sm font-semibold">{disaster.label}</div>
                          </div>

                          {/* Selection Indicator */}
                          {formData.type === disaster.value && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Location & Image Upload */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Location Input */}
                    <div>
                      <label className="flex items-center gap-3 text-lg font-bold text-slate-800 mb-4">
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-xl">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        Location *
                      </label>
                      <div className="space-y-4">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Enter precise location or coordinates..."
                            value={formData.location}
                            onChange={(e) => {
                              setFormData(prev => ({ ...prev, location: e.target.value }));
                              setMessage("");
                            }}
                            required
                            className="w-full p-4 pl-12 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white text-slate-900 placeholder-slate-400 text-lg"
                          />
                          <Satellite className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                        </div>
                        <button
                          type="button"
                          onClick={detectLocation}
                          className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-bold hover:from-emerald-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                        >
                          <Navigation className="w-5 h-5" />
                          <span>Detect Current Location (GPS)</span>
                        </button>
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="flex items-center gap-3 text-lg font-bold text-slate-800 mb-4">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
                          <Camera className="w-6 h-6 text-white" />
                        </div>
                        Upload Emergency Image
                      </label>
                      <div 
                        className={`border-3 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer group ${
                          imagePreview 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-slate-300 hover:border-purple-500 bg-slate-50 hover:bg-purple-50'
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <div className="space-y-4">
                          <div className={`p-4 rounded-2xl transition-all duration-300 ${
                            imagePreview 
                              ? 'bg-green-500 text-white' 
                              : 'bg-white text-slate-400 group-hover:bg-purple-500 group-hover:text-white'
                          }`}>
                            {imagePreview ? (
                              <CheckCircle className="w-12 h-12 mx-auto" />
                            ) : (
                              <Upload className="w-12 h-12 mx-auto" />
                            )}
                          </div>
                          <div>
                            <p className={`font-semibold transition-colors duration-300 ${
                              imagePreview ? 'text-green-700' : 'text-slate-600 group-hover:text-purple-700'
                            }`}>
                              {imagePreview ? 'Image Uploaded Successfully!' : 'Click to Upload Emergency Photo'}
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                              {imagePreview ? 'AI analysis in progress...' : 'Supports JPG, PNG, WEBP'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {imagePreview && (
                        <div className="mt-4 relative">
                          <img 
                            src={imagePreview} 
                            alt="Emergency preview" 
                            className="w-full h-48 object-cover rounded-2xl border-4 border-green-500 shadow-2xl"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white text-xs p-2 rounded-lg backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              AI analyzing image for damage assessment...
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Impact Assessment */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-fadeIn">
                  {/* Severity Level */}
                  <div>
                    <label className="flex items-center gap-3 text-lg font-bold text-slate-800 mb-6">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-xl">
                        <AlertTriangle className="w-6 h-6 text-white" />
                      </div>
                      AI Severity Assessment
                    </label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {["Low", "Medium", "High", "Critical"].map((level) => {
                        const config = getSeverityConfig(level);
                        const isSelected = formData.severity === level;
                        
                        return (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, severity: level }))}
                            className={`group relative p-6 rounded-2xl border-2 transition-all duration-500 hover-lift ${
                              isSelected
                                ? `border-transparent bg-gradient-to-r ${config.color} text-white shadow-2xl scale-105`
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow-xl"
                            }`}
                          >
                            <div className="relative z-10 space-y-2 text-center">
                              <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${
                                isSelected ? 'bg-white/20' : config.bg
                              }`}>
                                <AlertTriangle className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-white'}`} />
                              </div>
                              <div className="font-bold text-lg">{level}</div>
                              <div className="text-xs opacity-80">
                                {level === "Low" && "Minor incident"}
                                {level === "Medium" && "Moderate emergency"}
                                {level === "High" && "Serious situation"}
                                {level === "Critical" && "Life-threatening"}
                              </div>
                            </div>

                            {isSelected && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Estimated Affected */}
                  <div>
                    <label className="flex items-center gap-3 text-lg font-bold text-slate-800 mb-6">
                      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-xl">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      Estimated People Affected
                    </label>
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border-2 border-purple-200">
                      <div className="space-y-6">
                        <input
                          type="range"
                          min="0"
                          max="100000"
                          step="1000"
                          value={formData.estimatedAffected}
                          onChange={(e) => setFormData(prev => ({ ...prev, estimatedAffected: parseInt(e.target.value) }))}
                          className="w-full h-3 bg-purple-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-600 [&::-webkit-slider-thumb]:to-blue-600 [&::-webkit-slider-thumb]:shadow-2xl"
                        />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600 font-medium">0</span>
                          <div className="text-center">
                            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                              {formData.estimatedAffected.toLocaleString()}
                            </div>
                            <div className="text-sm text-slate-600 font-medium">People Affected</div>
                          </div>
                          <span className="text-sm text-slate-600 font-medium">100K+</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="flex items-center gap-3 text-lg font-bold text-slate-800 mb-4">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-xl">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      Emergency Description *
                    </label>
                    <div className="relative">
                      <textarea
                        placeholder="Describe what happened, current situation, immediate dangers, specific help needed, and any other critical details..."
                        rows={6}
                        value={formData.description}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, description: e.target.value }));
                          setMessage("");
                        }}
                        required
                        className="w-full p-6 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none bg-white text-slate-900 placeholder-slate-400 text-lg leading-relaxed"
                      />
                      <div className="absolute bottom-4 right-4 flex items-center gap-2">
                        <div className={`text-sm font-medium ${
                          formData.description.length < 20 ? 'text-orange-500' : 'text-green-500'
                        }`}>
                          {formData.description.length}/20
                        </div>
                        {formData.description.length >= 20 && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-slate-500">AI will analyze and improve clarity</span>
                      <span className="text-sm text-slate-500">Minimum 20 characters required</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Information */}
              {currentStep === 3 && (
                <div className="space-y-8 animate-fadeIn">
                  {/* Anonymous Mode Toggle */}
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 border-2 border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl transition-colors duration-300 ${
                          formData.isAnonymous ? 'bg-slate-600' : 'bg-blue-500'
                        }`}>
                          {formData.isAnonymous ? (
                            <EyeOff className="w-6 h-6 text-white" />
                          ) : (
                            <Eye className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-lg">Anonymous Mode</p>
                          <p className="text-slate-600">Submit without personal contact details</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, isAnonymous: !prev.isAnonymous }))}
                        className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-500 ${
                          formData.isAnonymous ? 'bg-slate-600' : 'bg-blue-500'
                        }`}
                      >
                        <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-2xl transition-all duration-500 ${
                          formData.isAnonymous ? 'translate-x-9' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>

                  {!formData.isAnonymous && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Contact Name */}
                      <div>
                        <label className="flex items-center gap-3 text-lg font-bold text-slate-800 mb-4">
                          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-xl">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          Your Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your full name for rescue coordination"
                          value={formData.contactName}
                          onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                          className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white text-slate-900 placeholder-slate-400 text-lg"
                        />
                      </div>

                      {/* Contact Number */}
                      <div>
                        <label className="flex items-center gap-3 text-lg font-bold text-slate-800 mb-4">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-xl">
                            <Navigation className="w-6 h-6 text-white" />
                          </div>
                          Contact Number
                        </label>
                        <input
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          value={formData.contactNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                          className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white text-slate-900 placeholder-slate-400 text-lg"
                        />
                      </div>
                    </div>
                  )}

                  {/* AI Suggestions */}
                  {aiSuggestions.length > 0 && (
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-bold text-slate-800 text-lg">AI Analysis & Suggestions</h4>
                      </div>
                      <ul className="space-y-3">
                        {aiSuggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-3 p-3 bg-white/50 rounded-xl border border-blue-100">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-slate-700">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 border-2 border-green-200">
                    <h3 className="font-bold text-2xl text-slate-800 mb-6 text-center">
                      Alert Summary
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Basic Info */}
                      <div className="space-y-4">
                        <div className="bg-white rounded-2xl p-4 border-2 border-slate-200">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 font-medium">Disaster Type</span>
                            <span className="font-bold text-slate-800">
                              {disasterTypes.find(d => d.value === formData.type)?.label}
                            </span>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-4 border-2 border-slate-200">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 font-medium">Location</span>
                            <span className="font-bold text-slate-800 text-right">{formData.location}</span>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-4 border-2 border-slate-200">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 font-medium">Severity</span>
                            <span className={`font-bold ${getSeverityConfig(formData.severity).text}`}>
                              {formData.severity}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="space-y-4">
                        <div className="bg-white rounded-2xl p-4 border-2 border-slate-200">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 font-medium">Estimated Affected</span>
                            <span className="font-bold text-slate-800">
                              {formData.estimatedAffected.toLocaleString()} people
                            </span>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-4 border-2 border-slate-200">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 font-medium">Contact Mode</span>
                            <span className="font-bold text-slate-800">
                              {formData.isAnonymous ? "Anonymous" : "Registered"}
                            </span>
                          </div>
                        </div>

                        {formData.immediateThreats.length > 0 && (
                          <div className="bg-white rounded-2xl p-4 border-2 border-slate-200">
                            <span className="text-slate-600 font-medium block mb-2">Immediate Threats</span>
                            <div className="flex flex-wrap gap-2">
                              {formData.immediateThreats.map(threat => (
                                <span key={threat} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium border border-red-200">
                                  {threat}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {formData.description && (
                      <div className="mt-6 bg-white rounded-2xl p-6 border-2 border-slate-200">
                        <span className="text-slate-600 font-medium block mb-3">Emergency Description</span>
                        <p className="text-slate-700 leading-relaxed">{formData.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1 || isSubmitting}
                className="flex items-center gap-3 px-8 py-4 border-2 border-slate-300 text-slate-600 rounded-2xl font-bold hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover-lift"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
              
              <div className="flex items-center gap-4">
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold hover:from-blue-600 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-300 hover-lift"
                  >
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-3 px-12 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl font-bold hover:from-red-600 hover:to-orange-600 shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Activating Emergency Response...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Emergency Alert
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Status Message */}
          {message && (
            <div className={`mt-6 p-6 rounded-2xl border-2 text-center font-bold text-lg transition-all duration-500 ${
              message.includes("✅") || message.includes("🚨") || message.includes("📍")
                ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800"
                : "bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-800"
            }`}>
              {message}
            </div>
          )}

          {/* Emergency Footer */}
          <div className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200">
            <div className="flex items-center gap-4">
              <Clock className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-lg font-bold text-orange-800">Emergency Response Protocol Activated</p>
                <p className="text-orange-600">AI is analyzing your alert and coordinating with response teams</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertForm;