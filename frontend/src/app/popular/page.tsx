'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPopularPosts, getCurrentUser } from '@/lib/api';
import { Post } from '@/types';
import PostCard from '@/components/feed/PostCard';
import PostSkeleton from '@/components/feed/PostSkeleton';
import EmptyState from '@/components/common/EmptyState';

const timeframes = [
    { id: 'today', label: 'Today', icon: '🕒' },
    { id: 'week', label: 'This Week', icon: '📅' },
    { id: 'month', label: 'This Month', icon: '🌙' },
    { id: 'all', label: 'All Time', icon: '✨' },
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
        <div className="space-y-8 max-w-4xl mx-auto pb-20">
            {/* Trending Header */}
            <header className="relative py-12 px-8 overflow-hidden rounded-[3rem] bg-gradient-to-br from-orange-500/10 via-rose-500/5 to-transparent border border-white/20 backdrop-blur-md shadow-2xl">
                {/* Animated Embers */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: Math.random() * 100 + "%", y: "110%", opacity: 0 }}
                            animate={{
                                y: "-10%",
                                opacity: [0, 0.5, 0],
                                rotate: [0, 45, -45]
                            }}
                            transition={{
                                duration: Math.random() * 5 + 3,
                                repeat: Infinity,
                                delay: Math.random() * 5
                            }}
                            className="absolute w-2 h-2 rounded-full bg-orange-400 blur-sm"
                        />
                    ))}
                </div>

                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-orange-500 to-rose-600 flex items-center justify-center shadow-lg shadow-orange-500/30 animate-pulse">
                        <span className="text-4xl">🔥</span>
                    </div>
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white heading-sora tracking-tighter mb-2">
                            Trending Discussions
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-sm opacity-80">
                            Discover the most impactful orbits on campus
                        </p>
                    </div>
                </div>
            </header>

            {/* Time Filter System */}
            <div className="flex flex-wrap items-center gap-3 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-2 rounded-2xl border border-white/20 dark:border-white/5 sticky top-24 z-40 shadow-xl mx-4 md:mx-0">
                {timeframes.map((tf) => (
                    <motion.button
                        key={tf.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setTimeframe(tf.id)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all duration-300 ${timeframe === tf.id
                            ? 'bg-gradient-to-tr from-orange-500 to-rose-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-105'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800'
                            }`}
                    >
                        <span className="text-lg">{tf.icon}</span>
                        {tf.label}
                    </motion.button>
                ))}
            </div>

            {/* Content Feed */}
            <div className="space-y-8">
                {isLoading ? (
                    <PostSkeleton count={3} />
                ) : (
                    <AnimatePresence mode="popLayout">
                        {posts.length > 0 ? (
                            <div className="grid grid-cols-1 gap-8">
                                {posts.map((post, index) => (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <PostCard post={post} currentUserId={currentUserId} />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-20"
                            >
                                <EmptyState
                                    icon="☄️"
                                    title="Celestial Silence"
                                    description="No trending posts found in this timeframe. Be the spark that starts a fire!"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
