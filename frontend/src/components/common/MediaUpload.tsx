'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/context/ToastContext';
import { storage, auth } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

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

        if (selectedFile.size > 20 * 1024 * 1024) {
            // Increased to 20MB for Firebase
            showToast("File is too heavy! Max size allowed is 20MB.", "error");
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
        uploadToFirebase(selectedFile);
    };

    const uploadToFirebase = async (selectedFile: File) => {
        setIsUploading(true);
        setUploadProgress(0);

        try {
            const userId = auth.currentUser?.uid || 'anonymous';
            const timestamp = Date.now();
            const cleanFileName = selectedFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
            const storagePath = `uploads/${userId}/${timestamp}_${cleanFileName}`;
            const storageRef = ref(storage, storagePath);

            const uploadTask = uploadBytesResumable(storageRef, selectedFile);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(Math.round(progress));
                },
                (error) => {
                    console.error("Firebase Storage Error:", error);
                    showToast("Upload failed: " + error.message, "error");
                    setIsUploading(false);
                    setFile(null);
                    setPreview(null);
                },
                async () => {
                    // Upload completed successfully
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                    onUploadComplete({
                        url: downloadURL,
                        public_id: storagePath, // Using storage path as public_id
                        type: selectedFile.type.startsWith('video/') ? 'video' : 'image'
                    });

                    showToast("Media uploaded successfully!", "success");
                    setIsUploading(false);
                }
            );

        } catch (error: any) {
            console.error("Upload setup failed", error);
            showToast("Upload failed to start.", "error");
            setIsUploading(false);
            setFile(null);
            setPreview(null);
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
                            <span className="text-xs opacity-60">Images or Videos up to 20MB</span>
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
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,1)]" />
                                Ready to Post
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
