import EmptyState from '@/components/common/EmptyState';

export default function DeadlinesPage() {
    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">📅 Assignment Tracker</h1>
                <p className="text-gray-500 mt-2">
                    Track your upcoming deadlines and never miss a submission
                </p>
            </header>

            {/* Calendar placeholder */}
            <div className="bg-white rounded-xl border border-gray-200 p-12">
                <EmptyState
                    icon="✅"
                    title="You're all caught up!"
                    description="No upcoming deadlines. Add one to start tracking your assignments."
                />
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <StatCard label="This Week" value="0" color="blue" />
                <StatCard label="This Month" value="0" color="amber" />
                <StatCard label="Overdue" value="0" color="red" />
            </div>
        </div>
    );
}

function StatCard({
    label,
    value,
    color
}: {
    label: string;
    value: string;
    color: 'blue' | 'amber' | 'red';
}) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-700 border-blue-200',
        amber: 'bg-amber-50 text-amber-700 border-amber-200',
        red: 'bg-red-50 text-red-700 border-red-200'
    };

    return (
        <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
            <div className="text-sm font-medium opacity-80">{label}</div>
            <div className="text-3xl font-bold mt-1">{value}</div>
        </div>
    );
}
