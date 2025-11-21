
import React from 'react';

interface TabButtonProps {
    label: string;
    onClick: () => void;
    isActive: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({ label, onClick, isActive }) => {
    const baseClasses = "px-4 py-2 text-base font-semibold transition-colors duration-300 ease-in-out border-b-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 rounded-t-md";
    const activeClasses = "border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400";
    const inactiveClasses = "border-transparent text-gray-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-300 dark:hover:border-teal-500";

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        >
            {label}
        </button>
    );
};

export default TabButton;