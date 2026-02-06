import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    userInitials: string;
    userName: string;
    userEmail: string;
}

export default function ProfileDropdown({
    isOpen,
    onClose,
    userInitials,
    userName,
    userEmail,
}: ProfileDropdownProps) {
    const router = useRouter();
    const { logout } = useAuth();

    const menuItems = [
        { label: 'View Profile', href: '/profile', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> },
        { label: 'Edit Profile', href: '/profile/edit', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /> }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Invisible overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-30"
                        onClick={onClose}
                    />

                    {/* Dropdown menu */}
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="absolute right-0 top-full mt-2 w-64 glass-panel rounded-2xl shadow-2xl z-40 overflow-hidden aura-glow"
                    >
                        {/* User info */}
                        <div className="p-5 border-b border-slate-200/50 dark:border-white/5 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center font-bold text-lg border border-blue-500/20 shadow-inner">
                                    {userInitials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate heading-sora">{userName}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">{userEmail}</p>
                                </div>
                            </div>
                        </div>

                        {/* Menu items */}
                        <div className="p-2">
                            {menuItems.map((item, i) => (
                                <motion.a
                                    key={item.label}
                                    href={item.href}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-center px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/5 rounded-xl transition-all group"
                                    onClick={onClose}
                                >
                                    <svg className="w-4 h-4 mr-3 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {item.icon}
                                    </svg>
                                    <span className="font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                        {item.label}
                                    </span>
                                </motion.a>
                            ))}

                            <div className="h-px bg-slate-200/50 dark:bg-white/5 my-2 mx-2"></div>

                            <motion.button
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: menuItems.length * 0.05 }}
                                className="w-full flex items-center px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition-all group"
                                onClick={() => {
                                    logout();
                                    onClose();
                                }}
                            >
                                <svg className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="font-bold">Logout</span>
                            </motion.button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
