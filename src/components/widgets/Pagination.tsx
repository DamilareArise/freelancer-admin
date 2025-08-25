import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  const getPageNumbers = () => {
    let pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // If total pages are 7 or less, show all pages
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (currentPage <= 4) {
        pages = [1, 2, 3, 4, "...", totalPages - 2, totalPages - 1, totalPages];
      } else if (currentPage >= totalPages - 3) {
        pages = [1, 2, 3, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, 2, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages - 1, totalPages];
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-between md:justify-center items-center mt-[52px] mb-[85px] /px-6 /md:px-8">
      {/* Previous Button */}
      <button
        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className={`px-4 py-2 border rounded md:mr-[24px] text-[10px] md:text-[16px] ${
          currentPage === 1 ? "text-white bg-[#E3E3E3] cursor-not-allowed" : "/hover:bg-gray-100 bg-[#10B981] text-white"
        }`}
      >
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex md:space-x-2">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && setCurrentPage(page)}
            className={`px-3 py-1 border rounded text-[10px] md:text-[16px] ${
              currentPage === page ? "bg-[#10B981] text-white" : "hover:bg-gray-100"
            }`}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 border rounded md:ml-[24px] text-[10px] md:text-[16px] ${
          currentPage === totalPages ? "text-white bg-[#E3E3E3] cursor-not-allowed" : "/hover:bg-gray-100 bg-[#10B981] text-white"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;