import { cn } from "@/utils/cn";
import { useState } from "react";
import { Icon } from "./icon";

type PaginationProps = {
  page: number;
  setPage: (page: number) => void;
  maxPages: number;
  visiblePageCount?: number; // Added this to control the number of visible page buttons
};

export const Pagination = ({
  page,
  setPage,
  maxPages,
  visiblePageCount = 3,
}: PaginationProps) => {
  const [startIndex, setStartIndex] = useState(0);

  const shift = (direction: number) => {
    setStartIndex((prev) => {
      const nextIndex = prev + direction;
      if (nextIndex < 0 || nextIndex + visiblePageCount > maxPages) {
        return prev; // Prevents shifting beyond bounds
      }
      return nextIndex;
    });
  };

  const visiblePages = Array.from(
    { length: visiblePageCount },
    (_, i) => startIndex + i + 1
  );

  return (
    <div className="flex gap-1">
      <button
        className="px-3 py-2 rounded text-brand-white opacity-80 disabled:opacity-40"
        onClick={() => shift(-1)}
        disabled={startIndex === 0}
      >
        <Icon icon="arrow-left" size={14} />
      </button>
      {visiblePages.map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => pageNum <= maxPages && setPage(pageNum)}
          disabled={pageNum > maxPages}
          className={cn(
            "px-4 py-2 rounded disabled:opacity-40 transition text-brand-gray hover:text-brand-white",
            pageNum === page && "bg-brand-navy-light text-brand-white"
          )}
        >
          {pageNum}
        </button>
      ))}
      <button
        onClick={() => shift(1)}
        disabled={startIndex + visiblePageCount >= maxPages}
        className="px-3 py-2 rounded text-brand-white disabled:opacity-40  opacity-80 rotate-180"
      >
        <Icon icon="arrow-left" size={14} />
      </button>
    </div>
  );
};
