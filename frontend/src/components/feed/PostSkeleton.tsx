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
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="bg-white p-6 rounded-xl border border-gray-100 space-y-4"
                >
                    {/* Author section */}
                    <div className="flex items-center space-x-3">
                        <SkeletonLoader className="w-10 h-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <SkeletonLoader className="h-4 w-32" />
                            <SkeletonLoader className="h-3 w-24" />
                        </div>
                    </div>

                    {/* Title */}
                    <SkeletonLoader className="h-6 w-3/4" />

                    {/* Content lines */}
                    <div className="space-y-2">
                        <SkeletonLoader className="h-4 w-full" />
                        <SkeletonLoader className="h-4 w-5/6" />
                        <SkeletonLoader className="h-4 w-4/5" />
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2">
                        <SkeletonLoader className="h-6 w-20 rounded-full" />
                        <SkeletonLoader className="h-6 w-16 rounded-full" />
                    </div>

                    {/* Actions footer */}
                    <div className="pt-4 border-t border-gray-50 flex gap-4">
                        <SkeletonLoader className="h-8 w-16" />
                        <SkeletonLoader className="h-8 w-24" />
                    </div>
                </div>
            ))}
        </>
    );
}
