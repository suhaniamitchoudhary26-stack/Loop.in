'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
    variant?: 'card' | 'text' | 'avatar' | 'title';
    className?: string;
}

export default function SkeletonLoader({ variant = 'text', className = '' }: SkeletonLoaderProps) {
    const variants = {
        card: "h-64 w-full rounded-2xl",
        text: "h-4 w-3/4 rounded-md",
        avatar: "h-10 w-10 rounded-full",
        title: "h-8 w-1/2 rounded-lg"
    };

    return (
        <div className={`relative overflow-hidden bg-slate-200/50 dark:bg-slate-800/40 backdrop-blur-sm ${variants[variant]} ${className}`}>
            {/* Spectral Shimmer Effect */}
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear"
                }}
                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent skew-x-12"
            />
            {/* Subtle Pulse */}
            <motion.div
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{
                    repeat: Infinity,
                    duration: 2.5,
                    ease: "easeInOut"
                }}
                className="w-full h-full"
            />
        </div>
    );
}

export function PostCardSkeleton() {
    return (
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/40 dark:border-white/5 shadow-2xl mb-6">
            <div className="flex items-center gap-3 mb-5">
                <SkeletonLoader variant="avatar" />
                <div className="space-y-2 flex-1">
                    <SkeletonLoader variant="text" className="w-32" />
                    <SkeletonLoader variant="text" className="w-24 h-3" />
                </div>
            </div>
            <div className="space-y-4 mb-6">
                <SkeletonLoader variant="title" className="w-full" />
                <SkeletonLoader variant="text" className="w-full" />
                <SkeletonLoader variant="text" className="w-5/6" />
            </div>
            <div className="flex gap-2 mb-6">
                <SkeletonLoader variant="text" className="w-16 h-6 rounded-full" />
                <SkeletonLoader variant="text" className="w-16 h-6 rounded-full" />
            </div>
            <div className="pt-6 border-t border-slate-100/60 dark:border-white/5 flex justify-between">
                <SkeletonLoader variant="text" className="w-24 h-8" />
                <SkeletonLoader variant="text" className="w-24 h-8" />
            </div>
        </div>
    );
}
