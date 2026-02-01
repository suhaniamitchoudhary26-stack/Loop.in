import { ReactNode } from 'react';

interface EmptyStateProps {
    icon?: string;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

/**
 * Generic empty state component for when there's no data to display
 * 
 * @example
 * <EmptyState
 *   icon="📭"
 *   title="No posts yet"
 *   description="Be the first to start a discussion"
 *   action={{ label: "Create Post", onClick: handleCreate }}
 * />
 */
export default function EmptyState({
    icon = "📭",
    title,
    description,
    action
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="text-6xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 max-w-md mb-6">{description}</p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
