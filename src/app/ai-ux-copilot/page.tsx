"use client";

import React, { useState } from "react";
import { Upload, Link, Globe, ArrowRight, Loader2, X } from "lucide-react";
import AnalysisResults from "@/components/AnalysisResults";

interface AnalysisResult {
  success: boolean;
  analysis: string;
  provider: "openai" | "gemini";
  domainUrl?: string;
  figmaUrl?: string;
  fileCount?: number;
  error?: string;
}

export default function AIUXCopilotPage() {
  const [inputType, setInputType] = useState<"domain" | "screenshots" | "figma" | null>(null);
  const [domainUrl, setDomainUrl] = useState("");
  const [figmaUrl, setFigmaUrl] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [domainUrlError, setDomainUrlError] = useState("");
  const [fileError, setFileError] = useState("");
  const [figmaUrlError, setFigmaUrlError] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // URL validation function
  const isValidUrl = (url: string): boolean => {
    if (!url) return false;
    
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  // Figma URL validation function
  const isValidFigmaUrl = (url: string): boolean => {
    if (!url) return false;
    
    const figmaUrlRegex = /^https:\/\/(www\.)?figma\.com\/(file|design|proto)\/[a-zA-Z0-9]+\/.*/;
    return figmaUrlRegex.test(url);
  };

  // Real-time validation for domain URL
  const handleDomainUrlChange = (value: string) => {
    setDomainUrl(value);
    
    if (value && !isValidUrl(value)) {
      setDomainUrlError("Please enter a valid URL (e.g., https://example.com)");
    } else {
      setDomainUrlError("");
    }
  };

  // Real-time validation for Figma URL
  const handleFigmaUrlChange = (value: string) => {
    setFigmaUrl(value);
    
    if (value && !isValidFigmaUrl(value)) {
      setFigmaUrlError("Please enter a valid Figma URL (e.g., https://www.figma.com/file/...)");
    } else {
      setFigmaUrlError("");
    }
  };

  // File validation for screenshots
  const validateFiles = (files: File[]): { validFiles: File[], error: string } => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    // Check total file count
    if (files.length > 3) {
      errors.push("Maximum 3 images allowed");
      return { validFiles: [], error: errors.join(", ") };
    }

    // Check each file
    files.forEach(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name} is not an image`);
        return;
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        errors.push(`${file.name} exceeds 5MB limit`);
        return;
      }

      validFiles.push(file);
    });

    return { validFiles, error: errors.join(", ") };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFileError(""); // Clear previous errors

    const { validFiles, error } = validateFiles(files);
    
    if (error) {
      setFileError(error);
      setUploadedFiles([]); // Clear files if there's an error
    } else {
      setUploadedFiles(validFiles);
    }
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSubmit = async () => {
    if (!inputType) return;

    setIsSubmitting(true);
    
    try {
      let response;
      
      if (inputType === "domain") {
        // Route to OpenAI API for domain analysis
        response = await fetch("/api/analyze-domain", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            domainUrl: domainUrl,
          }),
        });
      } else {
        // Route to Gemini API for screenshots or Figma
        response = await fetch("/api/analyze-design", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            figmaUrl: inputType === "figma" ? figmaUrl : null,
            screenshotFiles: inputType === "screenshots" ? uploadedFiles.map(f => f.name) : [],
          }),
        });
      }

      const result = await response.json();

      if (result.success) {
        console.log("Analysis completed:", result);
        setAnalysisResult({
          success: true,
          analysis: result.analysis,
          provider: result.provider,
          domainUrl: result.domainUrl,
          figmaUrl: result.figmaUrl,
          fileCount: result.fileCount,
        });
      } else {
        console.error("Analysis failed:", result.error);
        setAnalysisResult({
          success: false,
          analysis: "",
          provider: "openai", // Default, won't be used for error case
          error: result.error || "Unknown error occurred",
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      setAnalysisResult({
        success: false,
        analysis: "",
        provider: "openai", // Default, won't be used for error case
        error: "Network error occurred. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setInputType(null);
    setDomainUrl("");
    setFigmaUrl("");
    setUploadedFiles([]);
    setDomainUrlError("");
    setFileError("");
    setFigmaUrlError("");
  };

  const isSubmitDisabled = 
    (inputType === "domain" && (!domainUrl || !isValidUrl(domainUrl) || domainUrlError !== "")) ||
    (inputType === "figma" && (!figmaUrl || !isValidFigmaUrl(figmaUrl) || figmaUrlError !== "")) ||
    (inputType === "screenshots" && uploadedFiles.length === 0);

  const handleOptionClick = (type: "domain" | "screenshots" | "figma") => {
    setInputType(type);
    // Reset other states when switching
    setDomainUrl("");
    setFigmaUrl("");
    setUploadedFiles([]);
    setDomainUrlError("");
    setFileError("");
    setFigmaUrlError("");
  };

  return (
    <div className="min-h-screen pt-24 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">
          AI UX <span className="gradient-text">Copilot</span>
        </h1>
        <p className="text-white/60 text-lg mb-12">
          Your intelligent companion for making better UX decisions with real-time AI guidance and recommendations.
        </p>
        
        {analysisResult ? (
          <AnalysisResults result={analysisResult} onReset={handleReset} />
        ) : (
          <div className="glass-strong p-8 rounded-2xl border border-white/10">
            {!inputType ? (
              // Show option cards when nothing is selected
              <>
                <h2 className="text-2xl font-semibold text-white mb-8">Choose Analysis Method</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div
                    onClick={() => handleOptionClick("domain")}
                    className="p-6 rounded-xl border-2 border-white/10 bg-white/5 hover:border-white/20 transition-all cursor-pointer group"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition-colors">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">Domain URL</h3>
                      <p className="text-white/50 text-sm">
                        Analyze any live website by entering its URL
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => handleOptionClick("screenshots")}
                    className="p-6 rounded-xl border-2 border-white/10 bg-white/5 hover:border-white/20 transition-all cursor-pointer group"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition-colors">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">Upload Screenshots</h3>
                      <p className="text-white/50 text-sm">
                        Upload screenshots of your website for analysis
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => handleOptionClick("figma")}
                    className="p-6 rounded-xl border-2 border-white/10 bg-white/5 hover:border-white/20 transition-all cursor-pointer group"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition-colors">
                        <Link className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">Figma Design</h3>
                      <p className="text-white/50 text-sm">
                        Provide a Figma design link for UX analysis
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Show input field when option is selected
              <>
                <div className="flex items-center gap-4 mb-8">
                  <button
                    onClick={() => setInputType(null)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-4 h-4 text-white/70" />
                  </button>
                  <h2 className="text-xl font-semibold text-white">
                    {inputType === "domain" && "Enter Website URL"}
                    {inputType === "screenshots" && "Upload Screenshots"}
                    {inputType === "figma" && "Enter Figma Design URL"}
                  </h2>
                </div>

                <div className="mb-8">
                  {inputType === "domain" && (
                    <div>
                      <p className="text-white/50 text-sm mb-4">
                        Analyze any live website by entering its URL
                      </p>
                      <input
                        type="url"
                        placeholder="https://example.com"
                        value={domainUrl}
                        onChange={(e) => handleDomainUrlChange(e.target.value)}
                        className={`w-full p-4 rounded-lg bg-white/5 border text-white placeholder-white/40 focus:outline-none transition-colors ${
                          domainUrlError 
                            ? "border-red-500 focus:border-red-500" 
                            : "border-white/10 focus:border-primary-500"
                        }`}
                      />
                      {domainUrlError && (
                        <p className="text-red-400 text-sm mt-2">
                          {domainUrlError}
                        </p>
                      )}
                    </div>
                  )}

                  {inputType === "screenshots" && (
                    <div>
                      <p className="text-white/50 text-sm mb-4">
                        Upload screenshots of your website for analysis
                      </p>
                      <div className="relative">
                        <input
                          type="file"
                          id="file-upload"
                          multiple
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="file-upload"
                          className={`block w-full p-8 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
                            fileError 
                              ? "border-red-500 hover:border-red-500" 
                              : "border-white/20 hover:border-primary-500/50"
                          }`}
                        >
                          <div className="text-center">
                            <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${
                              fileError ? "text-red-400" : "text-white/50"
                            }`} />
                            <p className={`text-lg mb-2 ${
                              uploadedFiles.length > 0 
                                ? "text-white/70" 
                                : fileError 
                                  ? "text-red-400" 
                                  : "text-white/70"
                            }`}>
                              {fileError 
                                ? fileError 
                                : uploadedFiles.length > 0 
                                  ? `${uploadedFiles.length} file(s) selected` 
                                  : "Click to upload or drag and drop"
                              }
                            </p>
                            <p className="text-white/40 text-sm">
                              {uploadedFiles.length > 0 && !fileError
                                ? `Max 3 images, up to 5MB each`
                                : "PNG, JPG, GIF up to 5MB each"
                              }
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* File list and indicators */}
                      {uploadedFiles.length > 0 && !fileError && (
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between text-sm text-white/60 mb-2">
                            <span>Selected Files ({uploadedFiles.length}/3)</span>
                            <span>Total Size: {formatFileSize(uploadedFiles.reduce((total, file) => total + file.size, 0))}</span>
                          </div>
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
                                  <Upload className="w-4 h-4 text-primary-400" />
                                </div>
                                <div>
                                  <p className="text-white text-sm font-medium">{file.name}</p>
                                  <p className="text-white/40 text-xs">{formatFileSize(file.size)}</p>
                                </div>
                              </div>
                              <div className="text-green-400 text-xs">
                                ✓ Valid
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Error message */}
                      {fileError && (
                        <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                          <p className="text-red-400 text-sm">
                            {fileError}
                          </p>
                        </div>
                      )}

                      {/* Upload guidelines */}
                      {!fileError && uploadedFiles.length === 0 && (
                        <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                          <p className="text-blue-400 text-sm">
                            <strong>Upload Guidelines:</strong> Maximum 3 images, each up to 5MB. Supported formats: PNG, JPG, GIF.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {inputType === "figma" && (
                    <div>
                      <p className="text-white/50 text-sm mb-4">
                        Provide a Figma design link for UX analysis
                      </p>
                      <input
                        type="url"
                        placeholder="https://www.figma.com/file/..."
                        value={figmaUrl}
                        onChange={(e) => handleFigmaUrlChange(e.target.value)}
                        className={`w-full p-4 rounded-lg bg-white/5 border text-white placeholder-white/40 focus:outline-none transition-colors ${
                          figmaUrlError 
                            ? "border-red-500 focus:border-red-500" 
                            : "border-white/10 focus:border-primary-500"
                        }`}
                      />
                      {figmaUrlError && (
                        <p className="text-red-400 text-sm mt-2">
                          {figmaUrlError}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitDisabled || isSubmitting}
                  className={`w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-3 ${
                    isSubmitDisabled || isSubmitting
                      ? "bg-white/10 text-white/40 cursor-not-allowed"
                      : "gradient-primary text-white hover:opacity-90 cursor-pointer"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span>Start AI Analysis</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-blue-400 text-sm">
                    <strong>Note:</strong> Our AI will analyze your {inputType === "domain" ? "website" : inputType === "figma" ? "Figma design" : "screenshots"} and provide comprehensive UX recommendations within 30 seconds.
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
