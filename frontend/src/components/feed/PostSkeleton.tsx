import SkeletonLoader from '@/components/common/SkeletonLoader';

interface PostSkeletonProps {
    count?: number;
}

/**
 * Skeleton loader for post cards
 * Shows a loading placeholder while posts are being fetched
 */
export default function PostSkeleton({ count = 1 }: PostSkeletonProps) {
    return (
        <div className="space-y-6">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl p-6 md:p-8 rounded-3xl border border-white/40 dark:border-white/5 space-y-6"
                >
                    {/* Author section */}
                    <div className="flex items-center space-x-4">
                        <SkeletonLoader className="w-12 h-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <SkeletonLoader className="h-5 w-40" />
                            <SkeletonLoader className="h-3 w-28" />
                        </div>
                    </div>

                    {/* Title & Content */}
                    <div className="space-y-4">
                        <SkeletonLoader className="h-8 w-3/4 rounded-xl" />
                        <div className="space-y-2">
                            <SkeletonLoader className="h-4 w-full" />
                            <SkeletonLoader className="h-4 w-5/6" />
                        </div>
                    </div>

                    {/* Media Placeholder (Hifi) */}
                    <SkeletonLoader className="w-full h-64 rounded-2xl" />

                    {/* Footer */}
                    <div className="pt-6 border-t border-slate-100/60 dark:border-white/5 flex justify-between items-center">
                        <div className="flex gap-4">
                            <SkeletonLoader className="h-8 w-16 rounded-full" />
                        </div>
                        <SkeletonLoader className="h-8 w-24 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}
