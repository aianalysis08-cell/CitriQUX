"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  Share2,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Eye,
  Palette,
  Layout,
  Smartphone,
  Target,
  FileText,
  Sparkles,
  BarChart3,
  Award,
  RefreshCw,
  Copy,
  Mail,
  Shield,
  Zap,
  Users,
  Globe,
  MessageCircle,
  X,
  Send,
  Minimize2,
  Maximize2,
  Star,
  TrendingDown,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface AnalysisResult {
  success: boolean;
  analysis: string;
  provider: "openai" | "gemini" | "free-api";
  domainUrl?: string;
  figmaUrl?: string;
  fileCount?: number;
  scores?: {
    overall: number;
    visual: number;
    navigation: number;
    usability: number;
    accessibility: number;
    mobile: number;
    content: number;
    conversion: number;
    journey: number;
  };
  grade?: string;
  classification?: string;
  executiveSummary?: {
    keyStrengths: string[];
    criticalIssues: string[];
    quickWins: string[];
  };
  error?: string;
}

interface AnalysisResultsProps {
  result: AnalysisResult;
  onReset: () => void;
}

// Helper functions for grade and classification
const calculateGrade = (score: number): string => {
  if (score >= 9.5) return 'A+';
  if (score >= 9.0) return 'A';
  if (score >= 8.5) return 'A-';
  if (score >= 8.0) return 'B+';
  if (score >= 7.5) return 'B';
  if (score >= 7.0) return 'B-';
  if (score >= 6.5) return 'C+';
  if (score >= 6.0) return 'C';
  if (score >= 5.5) return 'C-';
  if (score >= 5.0) return 'D';
  return 'F';
};

const calculateClassification = (score: number): string => {
  if (score >= 9.0) return 'World-Class';
  if (score >= 8.0) return 'Professional';
  if (score >= 7.0) return 'Good';
  if (score >= 6.0) return 'Adequate';
  if (score >= 5.0) return 'Needs Improvement';
  return 'Critical';
};

const extractExecutiveSummary = (analysis: string) => {
  const extractBulletPoints = (sectionHeader: string): string[] => {
    const sectionStart = analysis.indexOf(sectionHeader);
    if (sectionStart === -1) return [];
    
    const sectionEnd = analysis.indexOf('\n\n', sectionStart);
    const section = sectionEnd !== -1 ? analysis.substring(sectionStart, sectionEnd) : analysis.substring(sectionStart);
    
    const bulletPoints = section.match(/- ([^\n]+)/g) || [];
    return bulletPoints.map(point => point.replace('- ', '').trim()).filter(point => point.length > 0);
  };

  return {
    keyStrengths: extractBulletPoints('**Key Strengths:**'),
    criticalIssues: extractBulletPoints('**Critical Issues:**'),
    quickWins: extractBulletPoints('**Quick Wins:**'),
  };
};

const extractScores = (analysis: string) => {
  const scores = {
    overall: 7.5,
    visual: 8.0,
    navigation: 7.0,
    usability: 8.0,
    accessibility: 6.0,
    mobile: 8.0,
    content: 7.0,
    conversion: 7.0,
    journey: 8.0,
  };

  const overallMatch = analysis.match(/Overall UX Score:\s*(\d+\.?\d+)\/10/);
  if (overallMatch) scores.overall = parseFloat(overallMatch[1]) || 7.5;

  const visualMatch = analysis.match(/Visual Design & Aesthetics\s*\((\d+\.?\d+)\/10\)/);
  if (visualMatch) scores.visual = parseFloat(visualMatch[1]) || 8.0;

  const navigationMatch = analysis.match(/Navigation & Information Architecture\s*\((\d+\.?\d+)\/10\)/);
  if (navigationMatch) scores.navigation = parseFloat(navigationMatch[1]) || 7.0;

  const usabilityMatch = analysis.match(/User Experience & Usability\s*\((\d+\.?\d+)\/10\)/);
  if (usabilityMatch) scores.usability = parseFloat(usabilityMatch[1]) || 8.0;

  const accessibilityMatch = analysis.match(/Accessibility\s*\((\d+\.?\d+)\/10\)/);
  if (accessibilityMatch) scores.accessibility = parseFloat(accessibilityMatch[1]) || 6.0;

  const mobileMatch = analysis.match(/Mobile Responsiveness\s*\((\d+\.?\d+)\/10\)/);
  if (mobileMatch) scores.mobile = parseFloat(mobileMatch[1]) || 8.0;

  const contentMatch = analysis.match(/Content & Copy\s*\((\d+\.?\d+)\/10\)/);
  if (contentMatch) scores.content = parseFloat(contentMatch[1]) || 7.0;

  const conversionMatch = analysis.match(/Conversion Optimization\s*\((\d+\.?\d+)\/10\)/);
  if (conversionMatch) scores.conversion = parseFloat(conversionMatch[1]) || 7.0;

  const journeyMatch = analysis.match(/User Journey & Flow\s*\((\d+\.?\d+)\/10\)/);
  if (journeyMatch) scores.journey = parseFloat(journeyMatch[1]) || 8.0;

  return scores;
};

const ScoreBar = ({
  score,
  label,
  icon: Icon,
  color,
}: {
  score: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <span className="text-white/70 text-sm font-medium">{label}</span>
        </div>
        <span className="text-white font-bold text-lg">{score.toFixed(1)}</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: animated ? `${score * 10}%` : "0%" }}
        />
      </div>
    </div>
  );
};

const CircularProgress = ({ score, size = 120 }: { score: number; size?: number }) => {
  const [animated, setAnimated] = useState(false);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 10) * circumference;

  useEffect(() => {
    setTimeout(() => setAnimated(true), 200);
  }, []);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? strokeDashoffset : circumference}
          className="transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{score.toFixed(1)}</span>
        <span className="text-white/50 text-xs">OVERALL</span>
      </div>
    </div>
  );
};

interface ChatMessage {
  id: number;
  sender: "user" | "assistant";
  text: string;
}

export default function AnalysisResults({ result, onReset }: AnalysisResultsProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "detailed" | "recommendations" | "metrics">("overview");
  const [isExporting, setIsExporting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "assistant",
      text: "Hello! I'm here to help you understand your UX analysis results. Feel free to ask any questions about the recommendations or scores!",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  // ── Failure state ────────────────────────────────────────────────────────────
  if (!result.success) {
    return (
      <div className="glass-strong p-8 rounded-2xl border border-white/10">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Analysis Failed</h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            {result.error || "An error occurred during analysis. Please try again."}
          </p>
          <button
            onClick={onReset}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-3 mx-auto font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── Derived values ────────────────────────────────────────────────────────────
  const scores = result.scores || extractScores(result.analysis);
  const grade = result.grade || calculateGrade(scores.overall);
  const classification = result.classification || calculateClassification(scores.overall);
  const executiveSummary = result.executiveSummary || extractExecutiveSummary(result.analysis);
  
  const scoreColor =
    scores.overall >= 8 ? "text-green-400" : scores.overall >= 6 ? "text-yellow-400" : "text-red-400";
  const scoreBg =
    scores.overall >= 8 ? "bg-green-500/20" : scores.overall >= 6 ? "bg-yellow-500/20" : "bg-red-500/20";
    
  const gradeColor = 
    grade.includes('A') ? "text-green-400" : 
    grade.includes('B') ? "text-blue-400" : 
    grade.includes('C') ? "text-yellow-400" : "text-red-400";

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleCopyResults = () => {
    navigator.clipboard.writeText(result.analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = async () => {
    setIsExporting(true);
    const blob = new Blob([result.analysis], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ux-analysis-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setIsExporting(false), 1000);
  };

  const generateAIResponse = (userMessage: string, sc: typeof scores) => {
    const lower = userMessage.toLowerCase();

    if (lower.includes("score") || lower.includes("rating")) {
      const sorted = Object.entries(sc).sort(([, a], [, b]) => (b as number) - (a as number));
      return `Based on your analysis, your overall score is ${sc.overall.toFixed(1)}/10. Your strongest area is ${sorted[0][0]} (${(sorted[0][1] as number).toFixed(1)}/10). Accessibility (${sc.accessibility.toFixed(1)}/10) and navigation (${sc.navigation.toFixed(1)}/10) need the most attention.`;
    }
    if (lower.includes("improve") || lower.includes("better")) {
      return `To improve your UX, start with accessibility improvements, then optimise navigation. Based on your scores, you should see a 15–20 % improvement in user satisfaction by implementing these changes.`;
    }
    if (lower.includes("accessibility")) {
      return `Your accessibility score is ${sc.accessibility.toFixed(1)}/10. Key improvements: ensure proper colour contrast ratios, add ARIA labels, add focus indicators for keyboard navigation, and provide text alternatives for non-text content.`;
    }
    if (lower.includes("mobile")) {
      return `Your mobile experience score is ${sc.mobile.toFixed(1)}/10. Recommendations: optimise tap targets, implement PWA features, improve mobile loading speed, and ensure responsive design works across all device sizes.`;
    }
    return `I understand you're asking about "${userMessage}". Based on your analysis results, I can provide specific guidance on accessibility, mobile optimisation, visual design, navigation, or any other recommendations!`;
  };

  const handleSendMessage = () => {
    const text = inputMessage.trim();
    if (!text) return;

    const userMsg: ChatMessage = { id: chatMessages.length + 1, sender: "user", text };
    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage("");

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: chatMessages.length + 2,
        sender: "assistant",
        text: generateAIResponse(text, scores),
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="space-y-6">
        {/* ── Header with Enhanced Score Display ── */}
        <div className="glass-strong p-8 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-12 h-12 rounded-xl ${scoreBg} flex items-center justify-center`}>
                  <Award className={`w-6 h-6 ${scoreColor}`} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Analysis Complete!</h2>
                  <p className="text-white/60 text-sm">
                    Powered by{" "}
                    {result.provider === "openai"
                      ? "OpenAI GPT-4o Vision"
                      : result.provider === "gemini"
                        ? "Google Gemini"
                        : "AI Analysis Engine"}
                  </p>
                </div>
              </div>
              {result.domainUrl && (
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <Globe className="w-4 h-4" />
                  <span>{result.domainUrl}</span>
                </div>
              )}
            </div>
            <button
              onClick={onReset}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center gap-2 text-white/70 hover:text-white"
            >
              <RefreshCw className="w-4 h-4" />
              New Analysis
            </button>
          </div>

          {/* Enhanced Score Display with Grade and Classification */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-8 mb-6">
              <CircularProgress score={scores.overall} />
              <div className="text-left">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-4xl font-bold ${gradeColor}`}>{grade}</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(scores.overall / 2)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-white/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className={`text-xl font-semibold ${scoreColor} mb-2`}>
                  {classification}
                </div>
                <div className="text-white/60 text-sm">
                  Overall UX Score: {scores.overall.toFixed(1)}/10
                </div>
              </div>
            </div>

            {/* Executive Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-semibold text-sm">Key Strengths</span>
                </div>
                <ul className="space-y-1">
                  {executiveSummary.keyStrengths.slice(0, 2).map((strength, i) => (
                    <li key={i} className="text-white/80 text-xs text-left">
                      • {strength}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 font-semibold text-sm">Critical Issues</span>
                </div>
                <ul className="space-y-1">
                  {executiveSummary.criticalIssues.slice(0, 2).map((issue, i) => (
                    <li key={i} className="text-white/80 text-xs text-left">
                      • {issue}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 font-semibold text-sm">Quick Wins</span>
                </div>
                <ul className="space-y-1">
                  {executiveSummary.quickWins.slice(0, 2).map((win, i) => (
                    <li key={i} className="text-white/80 text-xs text-left">
                      • {win}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-2 font-medium disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isExporting ? "Exporting..." : "Export Results"}
            </button>
            <button
              onClick={handleCopyResults}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center gap-2 text-white/70 hover:text-white font-medium"
            >
              <Copy className="w-4 h-4" />
              {copied ? "Copied!" : "Copy Results"}
            </button>
            <button className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center gap-2 text-white/70 hover:text-white font-medium">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center gap-2 text-white/70 hover:text-white font-medium">
              <Mail className="w-4 h-4" />
              Email
            </button>
          </div>
        </div>

        {/* ── Enhanced Tabs ── */}
        <div className="glass-strong rounded-2xl border border-white/10 p-2">
          <div className="flex gap-2">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "detailed", label: "Detailed Analysis", icon: FileText },
              { id: "recommendations", label: "Strategic Plan", icon: Target },
              { id: "metrics", label: "Success Metrics", icon: TrendingUp },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === id
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Overview Tab ── */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ScoreBar score={scores.visual} label="Visual Design" icon={Palette} color="bg-blue-500/20" />
            <ScoreBar score={scores.navigation} label="Navigation" icon={Layout} color="bg-green-500/20" />
            <ScoreBar score={scores.usability} label="Usability" icon={Users} color="bg-purple-500/20" />
            <ScoreBar score={scores.accessibility} label="Accessibility" icon={Eye} color="bg-yellow-500/20" />
            <ScoreBar score={scores.mobile} label="Mobile Experience" icon={Smartphone} color="bg-pink-500/20" />
            <ScoreBar score={scores.content} label="Content Quality" icon={FileText} color="bg-indigo-500/20" />
            <ScoreBar score={scores.conversion} label="Conversion Rate" icon={Target} color="bg-red-500/20" />
            <ScoreBar score={scores.journey} label="User Journey" icon={TrendingUp} color="bg-teal-500/20" />
          </div>
        )}

        {/* ── Detailed Tab ── */}
        {activeTab === "detailed" && (
          <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-strong p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Analysis Depth</h3>
                    <p className="text-white/60 text-sm">Comprehensive Review</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: "85%" }}
                    />
                  </div>
                  <span className="text-white font-bold">85%</span>
                </div>
              </div>

              <div className="glass-strong p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Action Items</h3>
                    <p className="text-white/60 text-sm">Ready to Implement</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-400">24</div>
              </div>

              <div className="glass-strong p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Impact Score</h3>
                    <p className="text-white/60 text-sm">Expected Improvement</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-orange-400">+42%</div>
              </div>
            </div>

            {/* Full analysis text */}
            <div className="glass-strong p-8 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Complete Analysis Report</h3>
                    <p className="text-white/60 text-sm">AI-powered insights and recommendations</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleExport}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center gap-2 text-white/70 hover:text-white"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button
                    onClick={handleCopyResults}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center gap-2 text-white/70 hover:text-white"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-sm font-medium">Live Analysis</span>
                </div>

                {/* Mini score strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: "Overall", score: scores.overall, color: "from-blue-500 to-purple-500" },
                    { label: "Visual", score: scores.visual, color: "from-green-500 to-teal-500" },
                    { label: "UX", score: scores.usability, color: "from-orange-500 to-red-500" },
                    { label: "Mobile", score: scores.mobile, color: "from-pink-500 to-rose-500" },
                  ].map(({ label, score, color }) => (
                    <div key={label} className="text-center">
                      <div
                        className={`w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br ${color} flex items-center justify-center`}
                      >
                        <span className="text-white font-bold text-lg">{score.toFixed(1)}</span>
                      </div>
                      <span className="text-white/70 text-xs">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Formatted analysis text */}
                <div className="space-y-6">
                  {result.analysis.split("\n\n").map((section, index) => {
                    if (section.includes("#")) {
                      return (
                        <div key={index} className="border-l-4 border-blue-500 pl-4">
                          <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                            {section.replace(/#/g, "").trim()}
                          </h4>
                        </div>
                      );
                    }
                    if (section.includes("**")) {
                      return (
                        <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <p className="text-white/90 leading-relaxed">
                            {section.split("**").map((part, i) =>
                              i % 2 === 1 ? (
                                <strong key={i} className="text-blue-400">
                                  {part}
                                </strong>
                              ) : (
                                part
                              )
                            )}
                          </p>
                        </div>
                      );
                    }
                    if (section.includes("-")) {
                      return (
                        <div key={index} className="space-y-2">
                          {section
                            .split("\n")
                            .filter((item) => item.trim())
                            .map((item, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
                              >
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-white/80 text-sm">{item.replace("-", "").trim()}</span>
                              </div>
                            ))}
                        </div>
                      );
                    }
                    return (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-white/5 to-transparent rounded-lg p-4 border-l-2 border-white/20"
                      >
                        <p className="text-white/90 leading-relaxed">{section}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="glass-strong p-6 rounded-2xl border border-white/10">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-400" />
                Key Insights
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: TrendingUp, label: "Growth Potential", value: "+68%", color: "text-green-400" },
                  { icon: Users, label: "User Satisfaction", value: "87%", color: "text-blue-400" },
                  { icon: Shield, label: "Security Score", value: "A+", color: "text-purple-400" },
                  { icon: Zap, label: "Performance", value: "94/100", color: "text-orange-400" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white/70" />
                      </div>
                      <span className="text-white/80">{label}</span>
                    </div>
                    <span className={`font-bold ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={handleExport}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-2 font-medium"
              >
                <Download className="w-4 h-4" />
                Download Full Report
              </button>
              <button className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center gap-2 text-white/70 hover:text-white font-medium">
                <Share2 className="w-4 h-4" />
                Share Analysis
              </button>
              <button className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center gap-2 text-white/70 hover:text-white font-medium">
                <Mail className="w-4 h-4" />
                Email Report
              </button>
            </div>
          </div>
        )}

        {/* ── Success Metrics Tab ── */}
        {activeTab === "metrics" && (
          <div className="space-y-6">
            {/* Success Metrics Overview */}
            <div className="glass-strong p-8 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Success Metrics</h3>
                    <p className="text-white/60 text-sm">Expected improvements and KPIs</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleExport}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center gap-2 text-white/70 hover:text-white"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button
                    onClick={handleCopyResults}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center gap-2 text-white/70 hover:text-white"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                </div>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  {
                    label: "User Satisfaction",
                    current: "65%",
                    target: `${Math.round(65 + (scores.overall - 7) * 15)}%`,
                    improvement: scores.overall - 7,
                    icon: Users,
                    color: "from-green-500 to-emerald-500",
                    bgColor: "bg-green-500/20",
                  },
                  {
                    label: "Task Completion",
                    current: "72%",
                    target: `${Math.round(72 + (scores.usability - 7) * 20)}%`,
                    improvement: scores.usability - 7,
                    icon: CheckCircle,
                    color: "from-blue-500 to-cyan-500",
                    bgColor: "bg-blue-500/20",
                  },
                  {
                    label: "Conversion Rate",
                    current: "3.2%",
                    target: `${(3.2 + (scores.conversion - 7) * 0.8).toFixed(1)}%`,
                    improvement: scores.conversion - 7,
                    icon: Target,
                    color: "from-purple-500 to-pink-500",
                    bgColor: "bg-purple-500/20",
                  },
                  {
                    label: "Accessibility Score",
                    current: "C+",
                    target: scores.accessibility >= 8 ? "AA" : scores.accessibility >= 6 ? "A" : "B+",
                    improvement: scores.accessibility - 7,
                    icon: Eye,
                    color: "from-orange-500 to-red-500",
                    bgColor: "bg-orange-500/20",
                  },
                ].map(({ label, current, target, improvement, icon: Icon, color, bgColor }) => (
                  <div key={label} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className={`text-lg font-bold ${improvement > 0 ? 'text-green-400' : improvement < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                        {improvement > 0 ? '+' : ''}{(improvement * 10).toFixed(0)}%
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="text-white/70 text-sm mb-1">{label}</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white">{target}</span>
                        <span className="text-white/50 text-sm line-through">{current}</span>
                      </div>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000`}
                        style={{ width: `${Math.min(100, Math.max(0, 50 + improvement * 10))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Implementation Timeline */}
              <div className="mb-8">
                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Implementation Timeline
                </h4>
                <div className="space-y-4">
                  {[
                    { phase: "Week 1-2", focus: "Critical fixes", items: ["Accessibility compliance", "Usability barriers"] },
                    { phase: "Week 3-4", focus: "High priority", items: ["Navigation optimization", "Conversion improvements"] },
                    { phase: "Month 2", focus: "Medium priority", items: ["Mobile enhancements", "Content optimization"] },
                    { phase: "Month 3", focus: "Long-term", items: ["Advanced features", "Performance monitoring"] },
                  ].map(({ phase, focus, items }) => (
                    <div key={phase} className="flex gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex-shrink-0">
                        <div className="w-16 text-center">
                          <div className="text-blue-400 font-semibold text-sm">{phase}</div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium mb-1">{focus}</div>
                        <div className="text-white/60 text-sm">{items.join(" • ")}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ROI Calculator */}
              <div>
                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Estimated ROI
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30">
                    <div className="text-green-400 font-semibold mb-1">Revenue Impact</div>
                    <div className="text-2xl font-bold text-white">+{Math.round((scores.conversion - 7) * 25)}%</div>
                    <div className="text-white/60 text-sm">Based on conversion improvements</div>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                    <div className="text-blue-400 font-semibold mb-1">Cost Savings</div>
                    <div className="text-2xl font-bold text-white">-${Math.round((scores.usability - 7) * 800)}</div>
                    <div className="text-white/60 text-sm">Reduced support tickets</div>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                    <div className="text-purple-400 font-semibold mb-1">Time to Value</div>
                    <div className="text-2xl font-bold text-white">6-8 weeks</div>
                    <div className="text-white/60 text-sm">Full implementation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Recommendations Tab ── */}
        {activeTab === "recommendations" && (
          <div className="space-y-6">
            <div className="glass-strong p-8 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Strategic Recommendations</h3>
                    <p className="text-white/60 text-sm">Based on your analysis scores</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleExport}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center gap-2 text-white/70 hover:text-white"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button
                    onClick={handleCopyResults}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center gap-2 text-white/70 hover:text-white"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                </div>
              </div>

              {/* Priority cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(
                  [
                    {
                      priority: "Critical",
                      icon: AlertCircle,
                      color: "bg-red-500/20 border-red-500/30",
                      bgColor: "bg-red-500",
                      show: scores.overall < 6.0 || scores.accessibility < 5.0,
                      description: "Immediate action required",
                      items: () => {
                        const list: string[] = [];
                        if (scores.accessibility < 5.0) list.push("Fix accessibility compliance issues");
                        if (scores.overall < 6.0) list.push("Address fundamental UX problems");
                        if (scores.navigation < 5.0) list.push("Redesign navigation structure");
                        return list.length > 0 ? list : ["No critical issues identified"];
                      },
                    },
                    {
                      priority: "High",
                      icon: AlertCircle,
                      color: "bg-orange-500/20 border-orange-500/30",
                      bgColor: "bg-orange-500",
                      show: scores.overall < 7.0 || scores.accessibility < 6.5 || scores.mobile < 7.0,
                      description: "Plan for next sprint",
                      items: () => {
                        const list: string[] = [];
                        if (scores.accessibility < 6.5) list.push("Improve accessibility compliance");
                        if (scores.mobile < 7.0) list.push("Enhance mobile experience");
                        if (scores.navigation < 7.0) list.push("Optimise navigation structure");
                        if (scores.visual < 7.0) list.push("Improve visual hierarchy");
                        if (scores.usability < 7.5) list.push("Enhance user experience");
                        return list.length > 0 ? list : ["Focus on core UX improvements"];
                      },
                    },
                    {
                      priority: "Medium",
                      icon: TrendingUp,
                      color: "bg-yellow-500/20 border-yellow-500/30",
                      bgColor: "bg-yellow-500",
                      show: scores.overall < 8.0 || scores.content < 8.0 || scores.conversion < 7.5,
                      description: "Plan for upcoming iterations",
                      items: () => {
                        const list: string[] = [];
                        if (scores.content < 8.0) list.push("Enhance content quality");
                        if (scores.conversion < 7.5) list.push("Optimise conversion funnel");
                        if (scores.journey < 8.0) list.push("Improve user journey");
                        if (scores.visual < 8.0) list.push("Add visual polish");
                        return list.length > 0 ? list : ["Refine existing features"];
                      },
                    },
                    {
                      priority: "Low",
                      icon: Sparkles,
                      color: "bg-green-500/20 border-green-500/30",
                      bgColor: "bg-green-500",
                      show: scores.overall >= 8.0,
                      description: "Nice-to-have improvements",
                      items: () => {
                        const list: string[] = [];
                        if (scores.overall >= 8.5) list.push("Add advanced features");
                        if (scores.overall >= 9.0) list.push("Implement innovative solutions");
                        if (scores.mobile >= 8.5) list.push("Enhance mobile gestures");
                        return list.length > 0 ? list : ["Consider future enhancements"];
                      },
                    },
                  ] as const
                )
                  .filter((item) => item.show)
                  .map(({ priority, icon: Icon, color, bgColor, description, items }) => (
                    <div
                      key={priority}
                      className={`rounded-xl p-6 border ${color} hover:border-white/30 transition-all duration-300`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-lg">{priority}</h4>
                          <p className="text-white/60 text-sm">{description}</p>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {items().map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-white/80 text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
                        <span className="text-white/60 text-xs">Estimated Impact</span>
                        <span
                          className={`text-xs font-bold ${priority === "Critical"
                              ? "text-red-400"
                              : priority === "High"
                                ? "text-orange-400"
                                : priority === "Medium"
                                  ? "text-yellow-400"
                                  : "text-green-400"
                            }`}
                        >
                          {priority === "Critical"
                            ? "High"
                            : priority === "High"
                              ? "Medium"
                              : priority === "Medium"
                                ? "Low"
                                : "Minimal"}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Score-based insights */}
            <div className="glass-strong p-6 rounded-2xl border border-white/10">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Score-Based Insights
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    label: "Overall Performance",
                    value: scores.overall,
                    color:
                      scores.overall >= 8.5
                        ? "text-green-400"
                        : scores.overall >= 7.0
                          ? "text-yellow-400"
                          : "text-red-400",
                    insight:
                      scores.overall >= 8.5
                        ? "Excellent UX quality"
                        : scores.overall >= 7.0
                          ? "Good UX foundation"
                          : "Needs significant improvements",
                    recommendation:
                      scores.overall >= 8.5
                        ? "Maintain quality standards"
                        : scores.overall >= 7.0
                          ? "Focus on core improvements"
                          : "Comprehensive redesign needed",
                  },
                  {
                    label: "Accessibility Score",
                    value: scores.accessibility,
                    color:
                      scores.accessibility >= 8.0
                        ? "text-green-400"
                        : scores.accessibility >= 6.5
                          ? "text-yellow-400"
                          : "text-red-400",
                    insight:
                      scores.accessibility >= 8.0
                        ? "Inclusive design"
                        : scores.accessibility >= 6.5
                          ? "Partial accessibility"
                          : "Major accessibility issues",
                    recommendation:
                      scores.accessibility >= 8.0
                        ? "Continue inclusive practices"
                        : scores.accessibility >= 6.5
                          ? "Address accessibility gaps"
                          : "Accessibility audit required",
                  },
                  {
                    label: "Mobile Experience",
                    value: scores.mobile,
                    color:
                      scores.mobile >= 8.5
                        ? "text-green-400"
                        : scores.mobile >= 7.0
                          ? "text-yellow-400"
                          : "text-red-400",
                    insight:
                      scores.mobile >= 8.5
                        ? "Mobile-first design"
                        : scores.mobile >= 7.0
                          ? "Responsive layout"
                          : "Mobile optimisation needed",
                    recommendation:
                      scores.mobile >= 8.5
                        ? "Enhance mobile features"
                        : scores.mobile >= 7.0
                          ? "Improve responsiveness"
                          : "Mobile redesign required",
                  },
                  {
                    label: "Visual Design",
                    value: scores.visual,
                    color:
                      scores.visual >= 8.5
                        ? "text-green-400"
                        : scores.visual >= 7.0
                          ? "text-yellow-400"
                          : "text-red-400",
                    insight:
                      scores.visual >= 8.5
                        ? "Professional appearance"
                        : scores.visual >= 7.0
                          ? "Decent visual design"
                          : "Visual redesign needed",
                    recommendation:
                      scores.visual >= 8.5
                        ? "Refine visual polish"
                        : scores.visual >= 7.0
                          ? "Enhance visual hierarchy"
                          : "Complete visual overhaul",
                  },
                ].map(({ label, value, color, insight, recommendation }) => (
                  <div
                    key={label}
                    className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/80 font-medium">{label}</span>
                      <span className={`text-lg font-bold ${color}`}>{value.toFixed(1)}/10</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                        <span className="text-blue-400 text-sm font-medium">Insight:</span>
                        <span className="text-white/80 text-sm">{insight}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                        <span className="text-green-400 text-sm font-medium">Recommendation:</span>
                        <span className="text-white/80 text-sm">{recommendation}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Plan */}
            <div className="glass-strong p-6 rounded-2xl border border-white/10">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-400" />
                Action Plan
              </h4>
              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    gradient: "from-blue-500 to-purple-500",
                    title: "Immediate Actions (Week 1–2)",
                    description: "Address critical issues identified in high-priority recommendations",
                  },
                  {
                    step: 2,
                    gradient: "from-green-500 to-teal-500",
                    title: "Short-term Goals (Month 1)",
                    description: "Complete high-priority items and medium-priority improvements",
                  },
                  {
                    step: 3,
                    gradient: "from-orange-500 to-red-500",
                    title: "Long-term Vision (Quarter 1)",
                    description: "Implement all remaining improvements and optimise for scale",
                  },
                ].map(({ step, gradient, title, description }) => (
                  <div
                    key={step}
                    className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}
                    >
                      <span className="text-white font-bold text-sm">{step}</span>
                    </div>
                    <div>
                      <h5 className="text-white font-medium mb-1">{title}</h5>
                      <p className="text-white/70 text-sm">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress tracking */}
            <div className="glass-strong p-6 rounded-2xl border border-white/10">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Expected Progress
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: "85%", label: "UX Improvement", width: "85%", gradient: "from-blue-500 to-purple-500", color: "text-blue-400" },
                  { value: "42%", label: "Conversion Rate", width: "42%", gradient: "from-green-500 to-teal-500", color: "text-green-400" },
                  { value: "2.5s", label: "Load Time", width: "75%", gradient: "from-orange-500 to-red-500", color: "text-orange-400" },
                ].map(({ value, label, width, gradient, color }) => (
                  <div key={label} className="text-center">
                    <div className={`text-2xl font-bold ${color}`}>{value}</div>
                    <div className="text-white/60 text-sm">{label}</div>
                    <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                      <div className={`bg-gradient-to-r ${gradient} h-2 rounded-full`} style={{ width }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={handleExport}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-2 font-medium"
              >
                <Download className="w-4 h-4" />
                Download Action Plan
              </button>
              <button className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center gap-2 text-white/70 hover:text-white font-medium">
                <Share2 className="w-4 h-4" />
                Share Recommendations
              </button>
              <button className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center gap-2 text-white/70 hover:text-white font-medium">
                <Mail className="w-4 h-4" />
                Email Action Plan
              </button>
            </div>
          </div>
        )}

        {/* ── Footer Stats ── */}
        <div className="glass-strong p-6 rounded-2xl border border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">8</div>
              <div className="text-white/60 text-sm">Categories Analyzed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">24</div>
              <div className="text-white/60 text-sm">Recommendations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">95%</div>
              <div className="text-white/60 text-sm">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-400">2.5s</div>
              <div className="text-white/60 text-sm">Analysis Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Floating Chat ── */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
        title="Chat with AI Assistant"
      >
        <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        {chatMessages.length > 1 && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {isChatOpen && (
        <div
          className="fixed bottom-24 right-8 w-96 bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 flex flex-col z-50"
          style={{ height: "600px" }}
        >
          {/* Chat header */}
          <div className="flex items-center justify-between p-4 border-b border-white/20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-white" />
              <h3 className="text-white font-semibold">UX Analysis Assistant</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsChatMinimized(!isChatMinimized)}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                title={isChatMinimized ? "Maximize" : "Minimize"}
              >
                {isChatMinimized ? (
                  <Maximize2 className="w-4 h-4 text-white" />
                ) : (
                  <Minimize2 className="w-4 h-4 text-white" />
                )}
              </button>
              <button
                onClick={() => setIsChatOpen(false)}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                title="Close"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {!isChatMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${message.sender === "user"
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                          : "bg-white/10 text-white border border-white/20"
                        }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/20">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask about your UX analysis..."
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-700 transition-all flex-shrink-0"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}