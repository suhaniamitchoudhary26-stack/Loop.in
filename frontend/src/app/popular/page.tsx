'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPopularPosts, getCurrentUser } from '@/lib/api';
import { Post } from '@/types';
import PostCard from '@/components/feed/PostCard';
import PostSkeleton from '@/components/feed/PostSkeleton';
import EmptyState from '@/components/common/EmptyState';
import AnnouncementsWidget from '@/components/feed/AnnouncementsWidget';
import HeroSection from '@/components/feed/HeroSection';

const timeframes = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'all', label: 'All Time' },
];

export default function PopularPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [timeframe, setTimeframe] = useState('today');
    const [isLoading, setIsLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await getCurrentUser();
                if (user) setCurrentUserId(user.id);
            } catch (err) {
                console.warn("Failed to fetch user data for popular feed", err);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        fetchPopularPosts();
    }, [timeframe]);

    const fetchPopularPosts = async () => {
        setIsLoading(true);
        try {
            const data = await getPopularPosts(timeframe);
            setPosts(data);
        } catch (error) {
            console.error("Failed to fetch popular posts", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
            {/* Left Column: Feed */}
            <div className="space-y-6">

                {/* Sticky Page Header with Glassmorphism */}
                <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-1 py-4 -mx-1 mb-6 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-transparent transition-all duration-300">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-slate-100">
                            🔥 Trending
                        </h1>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            Most active discussions on campus
                        </p>
                    </div>
                </header>

                {/* Clean Pill Filters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {timeframes.map((tf) => (
                        <button
                            key={tf.id}
                            onClick={() => setTimeframe(tf.id)}
                            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap ${timeframe === tf.id
                                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg shadow-slate-900/20'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-800 dark:hover:bg-slate-800'
                                }`}
                        >
                            {tf.label}
                        </button>
                    ))}
                </div>

                {/* Content Feed */}
                <div className="space-y-6 min-h-[500px]">
                    {isLoading ? (
                        <PostSkeleton count={3} />
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {posts.length > 0 ? (
                                <div className="space-y-6">
                                    {posts.map((post, index) => (
                                        <motion.div
                                            key={post.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <PostCard post={post} currentUserId={currentUserId} />
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="py-12"
                                >
                                    <EmptyState
                                        icon="📈"
                                        title="No Trending Posts"
                                        description="It's quiet right now. Be the first to start a conversation!"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* Right Column: Widgets */}
            <aside className="hidden lg:block w-full mt-16 space-y-6">
                <AnnouncementsWidget />
            </aside>
        </div>
    );
}
