import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children: ReactNode;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled,
    className = '',
    children,
    ...props
}: ButtonProps) {
    const baseStyles = 'relative rounded-xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2 disabled:cursor-not-allowed overflow-hidden group';

    const sizeStyles = {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-2.5 text-sm',
        lg: 'px-8 py-4 text-base',
    };

    const variantStyles = {
        primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 border border-white/10',
        secondary: 'bg-white/10 backdrop-blur-md border border-white/20 text-slate-700 dark:text-white hover:bg-white/20',
        ghost: 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20',
        danger: 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40 border border-white/10',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98, y: 0 }}
            className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
            disabled={disabled || isLoading}
            {...props as any}
        >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                    <>
                        <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        <span>Processing...</span>
                    </>
                ) : (
                    children
                )}
            </span>
        </motion.button>
    );
}
