import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

interface VoteControlProps {
    initialUpvotes: number;
    initialDownvotes: number;
    initialUserVote?: 1 | -1 | null;
    postId?: number;
    commentId?: number;
    onVoteChange?: (upvotes: number, downvotes: number, userVote: 1 | -1 | null) => void;
    size?: 'sm' | 'md';
}

export default function VoteControl({
    initialUpvotes = 0,
    initialDownvotes = 0,
    initialUserVote,
    postId,
    commentId,
    onVoteChange,
    size = 'md'
}: VoteControlProps) {
    const [upvotes, setUpvotes] = useState(initialUpvotes);
    const [downvotes, setDownvotes] = useState(initialDownvotes);
    const [userVote, setUserVote] = useState<1 | -1 | null>(initialUserVote || null);
    const [loading, setLoading] = useState(false);

    const handleVote = async (type: 1 | -1) => {
        if (loading) return;
        setLoading(true);

        const previousState = { upvotes, downvotes, userVote };
        let newUpvotes = upvotes;
        let newDownvotes = downvotes;
        let newUserVote: 1 | -1 | null = type;

        if (userVote === type) {
            newUserVote = null;
            if (type === 1) newUpvotes--;
            else newDownvotes--;
        } else {
            if (userVote === 1) newUpvotes--;
            if (userVote === -1) newDownvotes--;
            if (type === 1) newUpvotes++;
            else newDownvotes++;
        }

        setUpvotes(newUpvotes);
        setDownvotes(newDownvotes);
        setUserVote(newUserVote);

        try {
            await api.post('/votes/', {
                post_id: postId,
                comment_id: commentId,
                vote_type: type
            });
            if (onVoteChange) onVoteChange(newUpvotes, newDownvotes, newUserVote);
        } catch (error) {
            console.error("Vote failed", error);
            setUpvotes(previousState.upvotes);
            setDownvotes(previousState.downvotes);
            setUserVote(previousState.userVote);
        } finally {
            setLoading(false);
        }
    };

    const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    const netVotes = upvotes - downvotes;

    const containerStyles = size === 'sm'
        ? 'h-8 px-1'
        : 'h-10 px-1.5';

    return (
        <div className={`flex items-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-xl border border-white/20 dark:border-white/5 shadow-sm group/vote ${containerStyles}`}>
            <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleVote(1)}
                disabled={loading}
                className={`flex items-center justify-center p-1.5 rounded-lg transition-all ${userVote === 1 ? 'text-orange-500 bg-orange-500/10 shadow-[0_0_12px_rgba(249,115,22,0.3)]' : 'text-slate-400 hover:text-orange-400 hover:bg-orange-500/5'}`}
            >
                <svg className={iconSize} fill={userVote === 1 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={userVote === 1 ? 2.5 : 2} d="M5 15l7-7 7 7" />
                </svg>
            </motion.button>

            <div className={`px-2 flex flex-col items-center justify-center min-w-[24px] overflow-hidden`}>
                <AnimatePresence mode="wait">
                    <motion.span
                        key={netVotes}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className={`text-sm font-black tracking-tight ${userVote === 1 ? 'text-orange-500' : userVote === -1 ? 'text-indigo-500' : 'text-slate-600 dark:text-slate-300'}`}
                    >
                        {netVotes}
                    </motion.span>
                </AnimatePresence>
            </div>

            <motion.button
                whileHover={{ scale: 1.1, y: 2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleVote(-1)}
                disabled={loading}
                className={`flex items-center justify-center p-1.5 rounded-lg transition-all ${userVote === -1 ? 'text-indigo-500 bg-indigo-500/10 shadow-[0_0_12px_rgba(99,102,241,0.3)]' : 'text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/5'}`}
            >
                <svg className={iconSize} fill={userVote === -1 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={userVote === -1 ? 2.5 : 2} d="M19 9l-7 7-7-7" />
                </svg>
            </motion.button>
        </div>
    );
}
