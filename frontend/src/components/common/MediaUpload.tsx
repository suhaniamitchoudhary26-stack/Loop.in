'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/context/ToastContext';
import axios from 'axios';
import api from '@/lib/api';

interface MediaUploadProps {
    onUploadComplete: (data: { url: string; public_id: string; type: string }) => void;
    onClear: () => void;
}

export default function MediaUpload({ onUploadComplete, onClear }: MediaUploadProps) {
    const { showToast } = useToast();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            prepareFile(selectedFile);
        }
    };

    const prepareFile = (selectedFile: File) => {
        // Validate type and size
        const isImage = selectedFile.type.startsWith('image/');
        const isVideo = selectedFile.type.startsWith('video/');

        if (!isImage && !isVideo) {
            showToast("Unsupported file format. Please use PNG, JPG, or MP4.", "error");
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            showToast("File is too heavy! Max size allowed is 10MB.", "error");
            return;
        }

        setFile(selectedFile);

        // Generate floating preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);

        // Auto-start upload once file is selected
        uploadToCloudinary(selectedFile);
    };

    const uploadToCloudinary = async (selectedFile: File) => {
        setIsUploading(true);
        setUploadProgress(0);

        try {
            // 1. Get Signature from our Backend (Orbit-Safe Logic)
            const { data: signData } = await api.get('/media/signature');

            // --- Orbit-Mock Mode Fallback (If Backend isn't configured) ---
            if (signData.mock) {
                console.warn("Media service not configured. running in LIFT-OFF MOCK MODE.");
                showToast("Dev Mode: Simulating upload...", "info");

                // Simulate orbital burn (progress)
                for (let i = 0; i <= 100; i += 20) {
                    setUploadProgress(i);
                    await new Promise(r => setTimeout(r, 150));
                }

                // Complete using the local preview URL as the hosted URL
                onUploadComplete({
                    url: preview || "",
                    public_id: "mock_" + Date.now(),
                    type: selectedFile.type.startsWith('video/') ? 'video' : 'image'
                });

                showToast("Mock Stabilization Complete! (Dev Mode)", "success");
                setIsUploading(false);
                return;
            }

            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('api_key', signData.api_key);
            formData.append('timestamp', signData.timestamp);
            formData.append('signature', signData.signature);
            formData.append('folder', signData.folder);

            // 2. Direct Upload to Cloudinary
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${signData.cloud_name}/upload`,
                formData,
                {
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                        setUploadProgress(percentCompleted);
                    }
                }
            );

            const result = response.data;
            onUploadComplete({
                url: result.secure_url,
                public_id: result.public_id,
                type: result.resource_type // image or video
            });

            showToast("Media stabilized in orbit! (Upload Complete)", "success");
        } catch (error: any) {
            console.error("Cloudinary upload failed", error);
            const detail = error.response?.data?.detail || error.message || "Upload Error";

            showToast(`Re-entry Failed! (${detail}). Try again.`, "error");
            setFile(null);
            setPreview(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleClear = () => {
        setFile(null);
        setPreview(null);
        onClear();
    };

    return (
        <div className="w-full relative">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,video/mp4"
            />

            <AnimatePresence mode="wait">
                {!preview ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            const droppedFile = e.dataTransfer.files[0];
                            if (droppedFile) prepareFile(droppedFile);
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                            relative h-40 w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                            ${isDragging
                                ? 'border-cyan-400 bg-cyan-50/10 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                                : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800'}
                        `}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none" />

                        <div className="flex flex-col items-center gap-2 relative z-10 text-slate-500 dark:text-slate-400">
                            <motion.div
                                animate={isDragging ? { scale: 1.2, rotate: 5 } : {}}
                                className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-1"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                            </motion.div>
                            <span className="text-sm font-medium">Drag & Drop or Click to Upload</span>
                            <span className="text-xs opacity-60">Images or Videos up to 10MB</span>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl group"
                    >
                        {file?.type.startsWith('video/') ? (
                            <video src={preview} className="w-full h-full object-cover" controls={false} muted autoPlay loop />
                        ) : (
                            <img src={preview} alt="Upload Preview" className="w-full h-full object-cover" />
                        )}

                        {/* Progress Aura Overlay */}
                        {isUploading && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                <div className="relative w-24 h-24">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="40"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="transparent"
                                            className="text-white/20"
                                        />
                                        <motion.circle
                                            cx="48"
                                            cy="48"
                                            r="40"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="transparent"
                                            strokeDasharray={251.2}
                                            initial={{ strokeDashoffset: 251.2 }}
                                            animate={{ strokeDashoffset: 251.2 - (251.2 * uploadProgress) / 100 }}
                                            className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                                        {uploadProgress}%
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Controls */}
                        {!isUploading && (
                            <div className="absolute top-2 right-2 flex gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={handleClear}
                                    className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full backdrop-blur transition-all"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Floating Status Indicator */}
                        {!isUploading && (
                            <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/60 backdrop-blur rounded-full text-white text-[10px] font-bold tracking-widest uppercase border border-white/10 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,1)]" />
                                Staged for Orbit
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
