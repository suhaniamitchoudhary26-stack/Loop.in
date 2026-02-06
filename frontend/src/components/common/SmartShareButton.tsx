'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/context/ToastContext';
import { sharePost } from '@/lib/api';

interface SmartShareButtonProps {
    postId: number;
    postTitle: string;
    initialShareCount?: number;
}

export default function SmartShareButton({ postId, postTitle, initialShareCount = 0 }: SmartShareButtonProps) {
    const { showToast } = useToast();
    const [showMenu, setShowMenu] = useState(false);
    const [shareCount, setShareCount] = useState(initialShareCount);
    const [isSharing, setIsSharing] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const postUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/posts/${postId}`
        : `/posts/${postId}`;

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Track share on backend
    const trackShare = async () => {
        // Optimistic Update
        setShareCount(prev => prev + 1);
        try {
            const result = await sharePost(postId);
            if (result?.share_count) {
                setShareCount(result.share_count); // Sync with exact server count
            }
        } catch (error) {
            console.error('Failed to track share:', error);
            setShareCount(prev => Math.max(0, prev - 1)); // Revert
        }
    };

    // Primary: Web Share API
    const handleNativeShare = async () => {
        setIsSharing(true);
        try {
            if (navigator.share) {
                await navigator.share({
                    title: postTitle,
                    text: `Check out this post on Loop.in! ${postTitle}`,
                    url: postUrl,
                });
                await trackShare();
                showToast('Shared successfully! 🚀', 'success');
            } else {
                // Fallback to clipboard
                handleCopyLink();
            }
        } catch (error: any) {
            if (error?.name !== 'AbortError') {
                handleCopyLink();
            }
        } finally {
            setIsSharing(false);
            setShowMenu(false);
        }
    };

    // Secondary: WhatsApp Direct
    const handleWhatsAppShare = async () => {
        const message = encodeURIComponent(`Check out this post on Loop.in! ${postTitle} ${postUrl}`);
        const whatsappUrl = `https://wa.me/?text=${message}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        await trackShare();
        setShowMenu(false);
    };

    // Fallback: Copy to clipboard
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(postUrl);
            await trackShare();
            showToast('Link sent to orbit! 🛰️', 'success');
        } catch (error) {
            showToast('Failed to copy link', 'error');
        }
        setShowMenu(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            {/* Main Share Button with Neon Cyan Glow */}
            <motion.button
                onClick={() => setShowMenu(!showMenu)}
                disabled={isSharing}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95, y: 0 }}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-white/5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                aria-label="Share this post"
            >
                <svg
                    className="w-5 h-5 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Share</span>

                <AnimatePresence mode="wait">
                    {shareCount > 0 && (
                        <motion.span
                            key={shareCount}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 px-1.5 py-0.5 rounded-md text-[10px] uppercase font-black"
                        >
                            {shareCount}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Share Menu Dropdown */}
            <AnimatePresence>
                {showMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.9, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 12, scale: 0.9, filter: 'blur(10px)' }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="absolute bottom-full right-0 mb-3 w-56 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/40 dark:border-white/10 overflow-hidden z-50 p-1.5"
                    >
                        {/* Native Share */}
                        {typeof navigator !== 'undefined' && 'share' in navigator && (
                            <button
                                onClick={handleNativeShare}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-xl transition-all group/item"
                            >
                                <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover/item:scale-110 transition-transform">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                </div>
                                <span>System Share</span>
                            </button>
                        )}

                        {/* WhatsApp */}
                        <button
                            onClick={handleWhatsAppShare}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400 rounded-xl transition-all group/item"
                        >
                            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 group-hover/item:scale-110 transition-transform">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </div>
                            <span>WhatsApp</span>
                        </button>

                        <div className="h-px bg-slate-100 dark:bg-white/5 my-1 mx-2" />

                        {/* Copy Link */}
                        <button
                            onClick={handleCopyLink}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-500/10 rounded-xl transition-all group/item"
                        >
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover/item:scale-110 transition-transform">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span>Copy Starlight</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
