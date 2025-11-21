import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const { t } = useLanguage();

    if (totalPages <= 1) {
        return null;
    }

    const handlePrev = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="flex items-center justify-center gap-4 mt-6">
            <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 font-semibold text-white bg-teal-600 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-teal-700"
            >
                {t('pagination.previous')}
            </button>
            <span className="text-lg font-medium text-gray-700">
                {t('pagination.pageInfo', { currentPage, totalPages })}
            </span>
            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 font-semibold text-white bg-teal-600 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-teal-700"
            >
                {t('pagination.next')}
            </button>
        </div>
    );
};

export default Pagination;
