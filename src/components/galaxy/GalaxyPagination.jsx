import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './GalaxyPagination.css';

const GalaxyPagination = ({ currentPage = 1, totalPages = 10, onPageChange, className = "" }) => {

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className={`galaxy-pagination ${className}`}>
            <button
                className={`galaxy-page-item ${currentPage === 1 ? 'disabled' : ''}`}
                onClick={() => onPageChange(currentPage - 1)}
            >
                <ChevronLeft size={16} />
            </button>

            {getPageNumbers().map(page => (
                <button
                    key={page}
                    className={`galaxy-page-item ${page === currentPage ? 'active' : ''}`}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}

            <button
                className={`galaxy-page-item ${currentPage === totalPages ? 'disabled' : ''}`}
                onClick={() => onPageChange(currentPage + 1)}
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
};

export default GalaxyPagination;
