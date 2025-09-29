
// import { Link } from "react-router-dom"

// export default function Pagination({ pageNumber, totalPages, setPageNumber, pageLimit }) {
//   return (
//     <>
//       <div className="row justify-content-between align-items-center mt-3">
//         <div className="col-lg-6">
//           <p className="text-muted mb-0">
//             Showing {(pageNumber - 1) * 10 + 1} to {Math.min(pageNumber * 10, pageLimit)} of {pageLimit} entries
//           </p>
//         </div>
//         <div className="col-lg-6">
//           <div className="custom-pagination">
//             <nav aria-label="Page navigation">
//               <ul className="pagination justify-content-end mb-0">
//                 {/* First Page Button */}
//                 {pageNumber > 2 && (
//                   <li className="page-item" onClick={() => setPageNumber(1)}>
//                     <Link className="page-link" to="#" onClick={(e) => e.preventDefault()}>
//                       <i className="fa fa-angle-double-left"></i>
//                     </Link>
//                   </li>
//                 )}

//                 {/* Previous Button */}
//                 {pageNumber > 1 && (
//                   <li className="page-item" onClick={() => setPageNumber((prev) => prev - 1)}>
//                     <Link className="page-link" to="#" onClick={(e) => e.preventDefault()}>
//                       <i className="fa fa-angle-left"></i>
//                     </Link>
//                   </li>
//                 )}

//                 {/* Page Numbers */}
//                 {pageNumber > 1 && (
//                   <li className="page-item" onClick={() => setPageNumber(pageNumber - 1)}>
//                     <Link className="page-link" to="#" onClick={(e) => e.preventDefault()}>
//                       {pageNumber - 1}
//                     </Link>
//                   </li>
//                 )}

//                 {/* Current Page */}
//                 <li className="page-item active">
//                   <Link className="page-link" to="#" onClick={(e) => e.preventDefault()}>
//                     {pageNumber}
//                   </Link>
//                 </li>

//                 {/* Next Page Number */}
//                 {pageNumber < totalPages && (
//                   <li className="page-item" onClick={() => setPageNumber(pageNumber + 1)}>
//                     <Link className="page-link" to="#" onClick={(e) => e.preventDefault()}>
//                       {pageNumber + 1}
//                     </Link>
//                   </li>
//                 )}

//                 {/* Next Button */}
//                 {pageNumber < totalPages && (
//                   <li className="page-item" onClick={() => setPageNumber((prev) => prev + 1)}>
//                     <Link className="page-link" to="#" onClick={(e) => e.preventDefault()}>
//                       <i className="fa fa-angle-right"></i>
//                     </Link>
//                   </li>
//                 )}

//                 {/* Last Page Button */}
//                 {pageNumber < totalPages - 1 && (
//                   <li className="page-item" onClick={() => setPageNumber(totalPages)}>
//                     <Link className="page-link" to="#" onClick={(e) => e.preventDefault()}>
//                       <i className="fa fa-angle-double-right"></i>
//                     </Link>
//                   </li>
//                 )}
//               </ul>
//             </nav>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }



"use client"

import { Link } from "react-router-dom"

export default function Pagination({ pageNumber, totalPages, setPageNumber, pageLimit, perPage }) {
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPageNumber(newPage)
    }
  }

  return (
    <>
      <div className="row justify-content-between align-items-center mt-3">
        <div className="col-lg-6">
          <p className="text-muted mb-0">
            {/* Showing {(pageNumber - 1) * perPage + 1} to {Math.min(pageNumber * 10, pageLimit)} of {pageLimit} entries */}
            Showing {(pageNumber - 1) * perPage + 1} to {Math.min(pageNumber * perPage, pageLimit)} of {pageLimit} entries

          </p>
        </div>
        <div className="col-lg-6">
          <div className="custom-pagination">
            <nav aria-label="Page navigation">
              <ul className="pagination justify-content-end mb-0">
                {/* First Page Button */}
                {pageNumber > 2 && (
                  <li className="page-item" onClick={() => handlePageChange(1)}>
                    <Link className="page-link" to="#" onClick={(e) => e.preventDefault()}>
                      <i className="fa fa-angle-double-left"></i>
                    </Link>
                  </li>
                )}

                {/* Previous Button */}
                {pageNumber > 1 && (
                  <li className="page-item" onClick={() => handlePageChange(pageNumber - 1)}>
                    <Link className="page-link" to="#" onClick={(e) => e.preventDefault()}>
                      <i className="fa fa-angle-left"></i>
                    </Link>
                  </li>
                )}

                {/* Page Numbers */}
                {pageNumber > 1 && (
                  <li className="page-item" onClick={() => handlePageChange(pageNumber - 1)}>
                    <Link className="page-link" to="#" onClick={(e) => e.preventDefault()}>
                      {pageNumber - 1}
                    </Link>
                  </li>
                )}

                {/* Current Page */}
                <li className="page-item active">
                  <Link className="page-link" to="#" onClick={(e) => e.preventDefault()}>
                    {pageNumber}
                  </Link>
                </li>

                {/* Next Page Number */}
                {pageNumber < totalPages && (
                  <li className="page-item" onClick={() => handlePageChange(pageNumber + 1)}>
                    <Link className="page-link" to="#" onClick={(e) => e.preventDefault()}>
                      {pageNumber + 1}
                    </Link>
                  </li>
                )}

                {/* Next Button */}
                {pageNumber < totalPages && (
                  <li className="page-item" onClick={() => handlePageChange(pageNumber + 1)}>
                    <Link className="page-link" to="#" onClick={(e) => e.preventDefault()}>
                      <i className="fa fa-angle-right"></i>
                    </Link>
                  </li>
                )}

                {/* Last Page Button */}
                {pageNumber < totalPages - 1 && (
                  <li className="page-item" onClick={() => handlePageChange(totalPages)}>
                    <Link className="page-link" to="#" onClick={(e) => e.preventDefault()}>
                      <i className="fa fa-angle-double-right"></i>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}
