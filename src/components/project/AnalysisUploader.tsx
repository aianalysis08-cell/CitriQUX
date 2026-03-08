"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
    Upload,
    Image as ImageIcon,
    X,
    Loader2,
    Sparkles,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import Image from "next/image";

interface AnalysisUploaderProps {
    projectId: string;
    onUploadComplete?: (designId: string) => void;
}

export function AnalysisUploader({ projectId, onUploadComplete }: AnalysisUploaderProps) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setError(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
        maxFiles: 1,
        multiple: false,
    });

    const clearFile = () => {
        setFile(null);
        setPreview(null);
        setError(null);
    };

    const handleUpload = async () => {
        if (!file || !projectId) return;

        setIsUploading(true);
        setProgress(10);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("projectId", projectId);

            setProgress(40);
            const response = await fetch("/api/designs/upload", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Upload failed");
            }

            setProgress(100);
            setTimeout(() => {
                if (onUploadComplete) onUploadComplete(result.data.id);
                clearFile();
                setIsUploading(false);
                setProgress(0);
            }, 500);

        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {!preview ? (
                    <motion.div
                        key="dropzone"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="w-full flex"
                    >
                        <div
                            {...getRootProps()}
                            className={cn(
                                "relative border-2 border-dashed rounded-[2.5rem] p-12 transition-all cursor-pointer group flex flex-col items-center justify-center min-h-[400px] w-full",
                                isDragActive
                                    ? "border-primary-500 bg-primary-500/10 scale-[1.01]"
                                    : "border-white/10 glass hover:border-white/20 hover:bg-white/5"
                            )}
                        >
                            <input {...getInputProps()} />

                            <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mb-8 group-hover:glow-primary transition-all relative">
                                <Upload className={cn("w-10 h-10 transition-colors", isDragActive ? "text-primary-400" : "text-white/20")} />
                                {isDragActive && (
                                    <motion.div
                                        layoutId="glow"
                                        className="absolute inset-0 rounded-3xl border-2 border-primary-500 animate-pulse"
                                    />
                                )}
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">
                                {isDragActive ? "Drop to Critique" : "Upload your Design"}
                            </h3>
                            <p className="text-white/40 text-sm mb-10 max-w-xs text-center">
                                Drag and drop an image or click to browse. Supports PNG, JPG, or WebP.
                            </p>

                            <div className="flex items-center gap-6">
                                {[
                                    { icon: Sparkles, label: "AI Audit" },
                                    { icon: ImageIcon, label: "High Res" },
                                    { icon: CheckCircle2, label: "Fast Result" },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                        <item.icon className="w-3.5 h-3.5" />
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-card rounded-[2.5rem] border border-white/10 overflow-hidden"
                    >
                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50">
                                    <ImageIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white max-w-[200px] truncate">{file?.name}</p>
                                    <p className="text-[10px] text-white/30">Ready for Analysis</p>
                                </div>
                            </div>
                            {!isUploading && (
                                <button
                                    onClick={clearFile}
                                    className="p-2 rounded-xl hover:bg-white/5 text-white/30 hover:text-white transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        <div className="aspect-video relative bg-surface-900 flex items-center justify-center overflow-hidden">
                            <Image src={preview} fill style={{ objectFit: 'contain' }} alt="Preview" />

                            {isUploading && (
                                <div className="absolute inset-0 bg-surface-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-8">
                                    <Loader2 className="w-12 h-12 text-primary-400 animate-spin mb-6" />
                                    <h4 className="text-xl font-bold text-white mb-2">Analyzing Design...</h4>
                                    <p className="text-white/40 text-sm mb-8">This usually takes about 10-15 seconds.</p>

                                    <div className="w-full max-w-xs h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            className="h-full gradient-primary"
                                        />
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="absolute inset-0 bg-surface-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center text-error">
                                    <AlertCircle className="w-12 h-12 mb-4" />
                                    <h4 className="text-xl font-bold mb-2">Upload Failed</h4>
                                    <p className="text-sm text-error/70 mb-8 max-w-xs">{error}</p>
                                    <button
                                        onClick={clearFile}
                                        className="px-6 py-3 rounded-xl glass hover:bg-white/5 font-bold transition-all"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            )}
                        </div>

                        {!isUploading && !error && (
                            <div className="p-8">
                                <button
                                    onClick={handleUpload}
                                    className="w-full py-5 rounded-[1.5rem] gradient-primary text-white font-extrabold text-lg glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                >
                                    Start UX Analysis
                                    <Sparkles className="w-6 h-6" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
