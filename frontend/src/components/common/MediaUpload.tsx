'use client';

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import Button from './Button';

interface MediaData {
    url: string;
    public_id: string;
    type: string;
}

interface MediaUploadProps {
    onUploadComplete: (data: MediaData) => void;
    onClear: () => void;
}

export default function MediaUpload({ onUploadComplete, onClear }: MediaUploadProps) {
    const { user } = useAuth();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<'upload' | 'url'>('upload');
    const [manualUrl, setManualUrl] = useState('');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset state
        setError(null);
        setUploading(true);

        try {
            // 1. Get Signature from Backend
            const { data: sigData } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/media/signature`, {
                headers: {
                    Authorization: `Bearer ${await (await import('@/lib/firebase')).auth.currentUser?.getIdToken()}`
                }
            });

            // 2. Check if Mock Mode
            if (sigData.mock) {
                // If backend says Cloudinary is not configured, show error and switch to URL mode
                setError("Media upload is not configured on the server. Please use an external URL.");
                setMode('url');
                setUploading(false);
                return;
            }

            // 3. Prepare Form Data for Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', sigData.api_key);
            formData.append('timestamp', sigData.timestamp.toString());
            formData.append('signature', sigData.signature);
            formData.append('folder', sigData.folder);
            // formData.append('upload_preset', 'mits_campus_preset'); // If needed based on backend

            // 4. Upload to Cloudinary
            const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${sigData.cloud_name}/image/upload`;
            const uploadRes = await axios.post(cloudinaryUrl, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            // 5. Success
            const result = uploadRes.data;
            const mediaData = {
                url: result.secure_url,
                public_id: result.public_id,
                type: result.resource_type
            };

            setPreviewUrl(mediaData.url);
            onUploadComplete(mediaData);

        } catch (err: any) {
            console.error("Upload failed", err);
            setError(err.response?.data?.error?.message || "Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    const handleManualUrlSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualUrl) return;

        const mediaData = {
            url: manualUrl,
            public_id: 'external_url_' + Date.now(),
            type: 'image'
        };
        setPreviewUrl(manualUrl);
        onUploadComplete(mediaData);
    };

    const handleClear = () => {
        setPreviewUrl(null);
        setManualUrl('');
        setError(null);
        onClear();
    };

    if (previewUrl) {
        return (
            <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto object-contain" />
                <div className="absolute top-2 right-2">
                    <button
                        onClick={handleClear}
                        className="p-1 bg-white/80 dark:bg-black/50 hover:bg-red-500 hover:text-white rounded-full transition-colors shadow-sm"
                        title="Remove image"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Mode Toggle */}
            <div className="flex gap-4 text-sm mb-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
                    <input
                        type="radio"
                        checked={mode === 'upload'}
                        onChange={() => setMode('upload')}
                        className="text-blue-600 focus:ring-blue-500"
                    />
                    Upload File
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
                    <input
                        type="radio"
                        checked={mode === 'url'}
                        onChange={() => setMode('url')}
                        className="text-blue-600 focus:ring-blue-500"
                    />
                    Image URL
                </label>
            </div>

            {mode === 'upload' ? (
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div className="space-y-2 pointer-events-none">
                        <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
                            {uploading ? (
                                <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                            )}
                        </div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {uploading ? 'Uploading...' : 'Click or Drag to Upload'}
                        </p>
                        <p className="text-xs text-slate-500">
                            JPG, PNG, GIF up to 5MB
                        </p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleManualUrlSubmit} className="flex gap-2">
                    <input
                        type="url"
                        value={manualUrl}
                        onChange={(e) => setManualUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 px-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none dark:bg-slate-950 dark:text-white"
                        required
                    />
                    <Button type="submit" variant="secondary" size="sm">
                        Add
                    </Button>
                </form>
            )}

            {error && (
                <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                    {error}
                </div>
            )}
        </div>
    );
}
