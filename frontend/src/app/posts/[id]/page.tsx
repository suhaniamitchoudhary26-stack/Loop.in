'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getPost, deletePost, getCurrentUser } from '@/lib/api';
import { Post } from '@/types';
import { useToast } from '@/context/ToastContext';
import PostSkeleton from '@/components/feed/PostSkeleton';
import VoteControl from '@/components/common/VoteControl';
import SmartShareButton from '@/components/common/SmartShareButton';
import DepartmentBadge from '@/components/feed/DepartmentBadge';
import CommentSection from '@/components/comments/CommentSection';
import ConfirmationModal from '@/components/common/ConfirmationModal';

export default function PostDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { showToast } = useToast();
    const postId = typeof params.id === 'string' ? parseInt(params.id) : null;

    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (postId) {
            fetchPost();
            getCurrentUser().then(user => {
                if (user) {
                    setCurrentUserId(user.id);
                    setCurrentUser(user);
                }
            });
        }
    }, [postId]);

    const fetchPost = async () => {
        try {
            if (!postId) return;
            const data = await getPost(postId);
            setPost(data);
        } catch (error) {
            console.error("Failed to fetch post", error);
            showToast("Failed to load post. It might have been deleted.", "error");
            router.push('/');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!postId) return;
        setIsDeleting(true);
        try {
            await deletePost(postId);
            showToast("Post deleted successfully", "success");
            router.push('/');
        } catch (error) {
            console.error("Failed to delete post", error);
            showToast("Not authorized to delete this post", "error");
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4">
                <PostSkeleton count={1} />
            </div>
        );
    }

    if (!post) return null;

    const isAdmin = currentUser?.role === 'admin';
    const canDelete = (currentUserId && post.author_id === currentUserId) || isAdmin;
    const isAnonymous = post.is_anonymous;
    const isUnmasked = isAnonymous && isAdmin && post.author;

    let authorName = isAnonymous ? 'Anonymous Student' : (post.author?.full_name || post.author?.email?.split('@')[0] || 'Student');

    if (isUnmasked) {
        authorName = `${post.author?.full_name} (Ghost)`;
    }

    const deptColors: Record<string, string> = {
        'CS': '13, 148, 136', // Teal-600
        'EE': '217, 119, 6', // Amber-600
        'ME': '59, 130, 246', // Blue-500
        'CE': '190, 18, 60', // Rose-700
        'IT': '126, 34, 206', // Purple-700
        'GENERAL': '100, 116, 139' // Slate-500
    };
    const deptColor = deptColors[post.department || 'GENERAL'] || deptColors['GENERAL'];

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            {/* Back Button with Starlight Animation */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <Link
                    href="/"
                    className="group inline-flex items-center gap-2 text-slate-500 hover:text-blue-500 mb-8 font-bold transition-all duration-300"
                >
                    <div className="p-2 rounded-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-white/5 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </div>
                    <span>Back to Orbit</span>
                </Link>
            </motion.div>

            <motion.article
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`relative aura-glow bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border transition-all duration-700 group ${isUnmasked ? 'border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'border-white/40 dark:border-white/5'}`}
                style={{
                    // @ts-ignore
                    '--post-accent': `rgb(${deptColor})`
                } as any}
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-4">
                        <div className={`relative w-14 h-14 rounded-full overflow-hidden ${isAnonymous ? 'filter blur-[1px] opacity-60' : ''} ${isUnmasked ? 'unmask-dissolve' : ''}`}>
                            {isAnonymous ? (
                                <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center border border-slate-300 dark:border-slate-600 backdrop-blur-sm">
                                    <svg className="w-7 h-7 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            ) : (
                                <div className="w-full h-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl border border-blue-500/20">
                                    {authorName[0]}
                                </div>
                            )}
                            {isAnonymous && (
                                <div className="absolute inset-0 rounded-full bg-slate-400/10 animate-pulse pointer-events-none" />
                            )}
                        </div>
                        <div className={isUnmasked ? 'unmask-dissolve' : ''}>
                            <div className="flex items-center flex-wrap gap-3">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white heading-sora tracking-tight">{authorName}</h3>
                                <DepartmentBadge deptCode={post.department || 'GENERAL'} />
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                {new Date(post.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                            </p>
                        </div>
                    </div>

                    {canDelete && (
                        <button
                            onClick={() => setDeleteModalOpen(true)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Content */}
                <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-8 leading-[1.1] heading-sora tracking-tighter">
                    {post.title}
                </h1>

                {/* Media Section */}
                {post.media_url && (
                    <div className={`mb-12 relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl group transition-all duration-700 hover:shadow-[0_0_50px_var(--post-accent)] ${isAnonymous ? 'grayscale blur-[2px] opacity-70 hover:grayscale-0 hover:blur-0 hover:opacity-100 scanline-filter' : ''}`}>
                        {post.media_type === 'video' ? (
                            <video src={post.media_url} controls className="w-full max-h-[700px] object-contain bg-black" />
                        ) : (
                            <div className="relative w-full min-h-[500px]">
                                <Image
                                    src={post.media_url}
                                    alt={post.title}
                                    fill
                                    className="object-contain transition-transform duration-1000 group-hover:scale-[1.02]"
                                    priority
                                />
                            </div>
                        )}
                        {/* Glow for Media */}
                        <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-[2.5rem]" />
                    </div>
                )}

                <div className="prose dark:prose-invert max-w-none">
                    <p className="text-xl text-slate-800 dark:text-slate-200 leading-relaxed font-normal content-serif whitespace-pre-wrap">
                        {post.content}
                    </p>
                </div>

                {/* Actions & Meta */}
                <div className="mt-12 pt-8 border-t border-slate-100 dark:border-white/5">
                    <div className="flex items-center justify-between mb-10">
                        <VoteControl
                            initialUpvotes={post.upvotes}
                            initialDownvotes={post.downvotes}
                            initialUserVote={post.user_vote}
                            postId={post.id}
                        />
                        <SmartShareButton
                            postId={post.id}
                            postTitle={post.title}
                            initialShareCount={post.share_count || 0}
                        />
                    </div>

                    <CommentSection postId={post.id} initialCount={post.comments_count} currentUserId={currentUserId} />
                </div>
            </motion.article>

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Post"
                message="Are you sure you want to delete this post eternally? This cannot be undone."
                confirmLabel="Delete"
                isDanger={true}
                isLoading={isDeleting}
            />
        </div>
    );
}
