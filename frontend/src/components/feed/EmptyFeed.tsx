import EmptyState from '@/components/common/EmptyState';

/**
 * Empty state specifically for the feed when there are no posts
 */
export default function EmptyFeed() {
    return (
        <EmptyState
            icon="📭"
            title="No posts yet"
            description="Be the first to start a discussion in your campus community"
        />
    );
}
