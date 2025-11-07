"use client";

import React, { useState } from "react";
import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  const [gotoPage, setGotoPage] = useState("");
  const [openPopover, setOpenPopover] = useState<'left' | 'right' | null>(null);

  if (totalPages <= 1) {
    return null;
  }

  const handlePageClick = (e: React.MouseEvent<HTMLAnchorElement>, page: number) => {
    e.preventDefault();
    onPageChange(page);
  };
  
  const handleGoToPage = () => {
    const page = parseInt(gotoPage, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
      setGotoPage("");
      setOpenPopover(null); // Close popover on success
    } else {
      setGotoPage(""); // Clear invalid input
    }
  };

  const renderEllipsisWithPopover = (popoverId: 'left' | 'right') => (
    <Popover open={openPopover === popoverId} onOpenChange={(isOpen) => setOpenPopover(isOpen ? popoverId : null)}>
      <PopoverTrigger asChild>
        <span className="flex h-9 w-9 items-center justify-center cursor-pointer rounded-md hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-9 text-base font-semibold">
          <PaginationEllipsis />
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            min="1"
            max={totalPages}
            value={gotoPage}
            onChange={(e) => setGotoPage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleGoToPage();
              }
            }}
            placeholder={`Page...`}
            className="h-9 no-spinner"
          />
          <Button onClick={handleGoToPage} size="sm">Go</Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Total: {totalPages} pages
        </p>
      </PopoverContent>
    </Popover>
  );

  return (
    <ShadcnPagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              if (currentPage > 1) handlePageClick(e, currentPage - 1)
            }}
            className={currentPage === 1 ? 'pointer-events-none text-muted-foreground' : ''}
          />
        </PaginationItem>
        {/* First page */}
        {totalPages > 0 &&
          <PaginationItem>
            <PaginationLink
              href="#"
              isActive={currentPage === 1}
              onClick={(e) => handlePageClick(e, 1)}
            >
              1
            </PaginationLink>
          </PaginationItem>
        }
        {/* Left ellipsis */}
        {totalPages > 5 && currentPage > 3 && (
          <PaginationItem>
            {renderEllipsisWithPopover('left')}
          </PaginationItem>
        )}
        {/* Middle pages */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(page => {
            if (totalPages <= 5) {
              return page > 1 && page < totalPages;
            }
            if (currentPage <= 3) {
              return page > 1 && page < 5;
            } else if (currentPage >= totalPages - 2) {
              return page > totalPages - 4 && page < totalPages;
            } else {
              return page >= currentPage - 1 && page <= currentPage + 1;
            }
          })
          .map(page => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={currentPage === page}
                onClick={(e) => handlePageClick(e, page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
        {/* Right ellipsis */}
        {totalPages > 5 && currentPage < totalPages - 2 && (
          <PaginationItem>
            {renderEllipsisWithPopover('right')}
          </PaginationItem>
        )}
        {/* Last page */}
        {totalPages > 1 && (
          <PaginationItem>
            <PaginationLink
              href="#"
              isActive={currentPage === totalPages}
              onClick={(e) => handlePageClick(e, totalPages)}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              if (currentPage < totalPages) handlePageClick(e, currentPage + 1)
            }}
            className={currentPage === totalPages ? 'pointer-events-none text-muted-foreground' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </ShadcnPagination>
  );
};