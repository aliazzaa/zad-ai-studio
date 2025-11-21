import React from 'react';

const SkeletonLoader: React.FC = () => {
    return (
        <div className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-md animate-pulse dark:bg-slate-800 dark:border-slate-700">
            <div className="space-y-6">
                {/* Title */}
                <div>
                    <div className="h-4 mb-2 bg-slate-200 rounded w-1/4 dark:bg-slate-700"></div>
                    <div className="h-8 bg-slate-200 rounded dark:bg-slate-700"></div>
                </div>
                
                {/* Script */}
                <div>
                    <div className="h-4 mb-2 bg-slate-200 rounded w-1/4 dark:bg-slate-700"></div>
                    <div className="h-24 bg-slate-200 rounded dark:bg-slate-700"></div>
                </div>

                {/* Explanation */}
                <div>
                    <div className="h-4 mb-2 bg-slate-200 rounded w-1/4 dark:bg-slate-700"></div>
                    <div className="h-40 bg-slate-200 rounded dark:bg-slate-700"></div>
                </div>
                
                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-slate-700">
                    <div className="h-10 bg-slate-200 rounded w-24 dark:bg-slate-700"></div>
                    <div className="h-10 bg-slate-200 rounded w-24 dark:bg-slate-700"></div>
                    <div className="h-10 bg-slate-200 rounded w-24 dark:bg-slate-700"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonLoader;