'use client'
import React, { FC } from 'react';
import { Button } from '~/components/ui/button';

interface pageProps{
    currentPage: number;
    pageSize: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}
const Pagination:FC<pageProps> = ({ currentPage, pageSize, totalPages, onPageChange }) => {
  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  const renderPageButtons = () => {
    const buttons = [];

    if (currentPage > 1) {
      buttons.push(
        <Button
          key="prev"
          variant="ghost"
          className="px-4 py-2"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Prev
        </Button>
      );
    }

    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? 'default' : 'ghost'}
          className="px-4 py-2"
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }

    if (currentPage < totalPages) {
      buttons.push(
        <Button
          key="next"
          variant="ghost"
          className="px-4 py-2"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      {renderPageButtons()}
    </div>
  );
};

export default Pagination;