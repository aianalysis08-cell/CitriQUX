"use client";

import React, { useState } from "react";
import { Upload } from "lucide-react";
import { HeatmapAnnotator } from "@/components/heatmap/HeatmapAnnotator";

export default function HeatmapPredictionPage() {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, this would upload to Supabase Storage and get a public URL.
      // For immediate preview, we generate an object URL.
      const objectUrl = URL.createObjectURL(file);
      setUploadedImageUrl(objectUrl);
    }
  };

  const handleReset = () => {
    setUploadedImageUrl(null);
  };

  return (
    <div className="min-h-screen pt-24 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">
          Heatmap <span className="gradient-text">Prediction</span>
        </h1>
        <p className="text-white/60 text-lg mb-8">
          Predict user attention patterns and optimize your designs for maximum engagement.
        </p>

        <div className="glass-strong p-8 rounded-2xl border border-white/10 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Analyze User Attention</h2>
          <p className="text-white/50 mb-6">
            Upload your design to generate predictive heatmaps showing where users will focus.
          </p>

          <div className="relative">
            <input
              type="file"
              id="heatmap-upload"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="heatmap-upload"
              className="block w-full p-8 border-2 border-dashed border-white/20 rounded-lg hover:border-primary-500/50 transition-colors cursor-pointer text-center"
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-white/50" />
              <p className="text-lg mb-2 text-white/70">
                {uploadedImageUrl ? "Image loaded! Click to change." : "Click to upload or drag and drop"}
              </p>
              <p className="text-white/40 text-sm">PNG, JPG up to 5MB</p>
            </label>
          </div>
        </div>

        {/* Heatmap Annotator UI rendering */}
        <HeatmapAnnotator
          imageUrl={uploadedImageUrl}
          analysisResult={null}
          onReset={handleReset}
        />
      </div>
    </div>
  );
}
