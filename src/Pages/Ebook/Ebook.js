"use client";
// model = libraries

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faPlus,
  faSearch,
  faEdit,
  faTrash,
  faEye,
  faDownload,
  faCheck,
  faTimes,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import empty from "../../assets/images/empty-box.png";
import Pagination from "../../Component/Pagination/Pagination";
import { baseUrl } from "../../config/baseUrl";

const Ebook = () => {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [writerFilter, setWriterFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageInfo, setPageInfo] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  });
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  // Fetch ebooks data
  const fetchEbooks = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pageNumber,
        limit: pageInfo.limit,
        search: searchTerm,
        status: statusFilter,
        writer: writerFilter,
        sortby: sortOrder,
      });

      const response = await fetch(`${baseUrl}/ebook?${queryParams}`);
      const data = await response.json();

      if (data.status) {
        setEbooks(data.data);
        setPageInfo({
          total: data.pageInfo.total,
          totalPages: data.pageInfo.totalPages,
          currentPage: data.pageInfo.currentPage,
          limit: 10,
        });
      } else {
        toast.error(data.status || "Failed to fetch ebooks");
      }
    } catch (error) {
      console.error("Error fetching ebooks:", error);
      toast.error("Failed to fetch ebooks");
    } finally {
      setLoading(false);
    }
  };

  // Fetch writers for filter
  const fetchWriters = async () => {
    try {
      const response = await fetch("/api/writers");
      const data = await response.json();
      if (data.success) {
        // setWriters(data.data);
      }
    } catch (error) {
      console.error("Error fetching writers:", error);
    }
  };

  // useEffect(() => {
  //   fetchEbooks();
  // }, [
  //   pageNumber,
  //   searchTerm,
  //   statusFilter,
  //   writerFilter,
  //   sortOrder,
  //   dateRange,
  // ]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      fetchEbooks();
      return;
    }

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(() => {
      fetchEbooks();
    }, 1000);

    setDebounceTimeout(newTimeout);

    return () => clearTimeout(newTimeout);
  }, [searchTerm, writerFilter]);

  useEffect(() => {
    if (!isFirstLoad) {
      fetchEbooks();
    }
  }, [pageNumber, statusFilter, sortOrder, dateRange]);

  const handleStatus = async (ebookId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      const response = await fetch(`${baseUrl}/ebook/status/${ebookId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.status) {
        const updatedStatus = data.data?.status || newStatus;
        setEbooks((prevEbooks) =>
          prevEbooks.map((ebook) =>
            ebook._id === ebookId ? { ...ebook, status: updatedStatus } : ebook
          )
        );

        toast.success("Status updated successfully");
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // Handle delete
  const handleDelete = async (ebookId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${baseUrl}/ebook/${ebookId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (data.success) {
          // Update local state by removing deleted ebook
          setEbooks((prevEbooks) => {
            const updatedEbooks = prevEbooks.filter(
              (ebook) => ebook._id !== ebookId
            );

            // Check if current page is now empty and not first page
            if (updatedEbooks.length === 0 && pageNumber > 1) {
              setPageNumber((prevPage) => prevPage - 1);
            }

            return updatedEbooks;
          });

          toast.success("Ebook deleted successfully");

          // Re-fetch data in case other pages have changed
          fetchEbooks();
        } else {
          toast.error(data.message || "Failed to delete ebook");
        }
      } catch (error) {
        console.error("Error deleting ebook:", error);
        toast.error("Failed to delete ebook");
      }
    }
  };

  // Handle export
  // const handleExport = async () => {
  //     try {
  //         const queryParams = new URLSearchParams({
  //             search: searchTerm,
  //             status: statusFilter,
  //             writer: writerFilter,
  //             startDate: dateRange.startDate,
  //             endDate: dateRange.endDate,
  //         })

  //         const response = await fetch(`/api/ebooks/export?${queryParams}`)

  //         if (response.ok) {
  //             const blob = await response.blob()
  //             const url = window.URL.createObjectURL(blob)
  //             const a = document.createElement("a")
  //             a.style.display = "none"
  //             a.href = url
  //             a.download = "ebooks.xlsx"
  //             document.body.appendChild(a)
  //             a.click()
  //             window.URL.revokeObjectURL(url)
  //             toast.success("Ebooks exported successfully")
  //         } else {
  //             toast.error("Failed to export ebooks")
  //         }
  //     } catch (error) {
  //         console.error("Error exporting ebooks:", error)
  //         toast.error("Failed to export ebooks")
  //     }
  // }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <section className="main-sec">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="dashboard-title">
              <h4 className="dash-head">
                <FontAwesomeIcon icon={faBook} className="me-2" />
                E-Book Listing
              </h4>
            </div>
            <div className="custom-bredcump">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    E-Book Listing
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="col-lg-6 d-flex justify-content-end align-items-start gap-2">
            {/* <button onClick={handleExport} className="btn-export">
                            Export Ebook
                        </button> */}
            <Link to="create" className="btn-add-question">
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Add E-book
            </Link>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="cards bus-list">
              <div className="bus-filter">
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <h5 className="card-title">
                      <FontAwesomeIcon icon={faBook} className="me-2" />
                      E-Books ({pageInfo.total})
                    </h5>
                  </div>
                </div>
              </div>

              <div className="search-filter-container">
                <div className="search-wrapper">
                  <FontAwesomeIcon icon={faSearch} className="search-icon" />
                  <input
                    type="text"
                    className="status-filter"
                    placeholder="Search Book Title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="search-wrapper">
                  <FontAwesomeIcon icon={faSearch} className="search-icon" />
                  <input
                    type="text"
                    className="status-filter"
                    placeholder="Search Writer..."
                    value={writerFilter}
                    onChange={(e) => setWriterFilter(e.target.value)}
                  />
                </div>
                <select
                  className="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>

                <select
                  className="status-filter"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                </select>
              </div>

              {/* <div className="entries-search-container">
                                <div className="entries-container">
                                    <select
                                        className="entries-select"
                                        value={pageInfo.limit}
                                        onChange={(e) => {
                                            setPageInfo((prev) => ({ ...prev, limit: Number.parseInt(e.target.value) }))
                                            setPageNumber(1)
                                        }}
                                    >
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>
                                    <span>entries per page</span>
                                </div>

                                <div className="search-container">
                                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                                    <input
                                        type="text"
                                        className="search-input"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div> */}

              <div className="table-responsive custom-table">
                <table className="table table-borderless">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Book Title</th>
                      <th>Book Image</th>
                      <th>Price</th>
                      <th>Writer</th>
                      <th>Platform Fee</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="10" className="loading-spinner">
                          <div className="spinner"></div>
                        </td>
                      </tr>
                    ) : ebooks.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="empty-state">
                          <img
                            src={empty || "/placeholder.svg"}
                            alt="No ebooks"
                            width="200px"
                          />
                          <h4>No E-books found!</h4>
                          <p className="text-muted">
                            {searchTerm || statusFilter || writerFilter
                              ? "Try adjusting your search or filter criteria"
                              : "Start by adding your first e-book"}
                          </p>
                          <Link to="create" className="btn-add-question mt-3">
                            <FontAwesomeIcon icon={faPlus} className="me-2" />
                            Add E-book
                          </Link>
                        </td>
                      </tr>
                    ) : (
                      ebooks.map((ebook, i) => (
                        <tr key={ebook._id}>
                          <td>{i + 1}</td>
                          <td>
                            <div className="book-title">{ebook.bookTitle}</div>
                            <small className="text-muted">
                              {ebook?.ebookCode || "N/A"}
                            </small>
                          </td>
                          <td>
                            <div className="book-image">
                              {ebook.bookImage ? (
                                <img
                                  src={`${baseUrl}/${ebook.bookImage}`}
                                  alt={ebook.title}
                                  className="book-thumbnail"
                                />
                              ) : (
                                <div className="no-image">No Image</div>
                              )}
                            </div>
                          </td>
                          {/* <td>
                                                        {ebook.uploadBook ? (
                                                            <a
                                                                href={`/${ebook.uploadBook}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="download-link"
                                                            >
                                                                <FontAwesomeIcon icon={faEye} className="me-1" />
                                                                View
                                                            </a>
                                                        ) : (
                                                            <span className="text-muted">No file</span>
                                                        )}
                                                    </td> */}
                          <td>
                            <span className="price-badge">
                              {formatCurrency(ebook.price)}
                            </span>
                          </td>

                          <td>
                            <span className="writer-name">
                              {ebook?.writer || "N/A"}
                            </span>
                          </td>
                          <td>
                            <span className="commission-badge">
                              {ebook?.adminCommission || 0}%
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() =>
                                handleStatus(ebook?._id, ebook?.status)
                              }
                              className={`status-badge ${
                                ebook.status === "active"
                                  ? "status-active"
                                  : "status-inactive"
                              }`}
                            >
                              {ebook.status === "active" ? (
                                <>
                                  <FontAwesomeIcon
                                    icon={faCheck}
                                    className="me-1"
                                  />
                                  Active
                                </>
                              ) : (
                                <>
                                  <FontAwesomeIcon
                                    icon={faTimes}
                                    className="me-1"
                                  />
                                  Inactive
                                </>
                              )}
                            </button>
                          </td>
                          <td>{formatDate(ebook.createdAt)}</td>
                          <td>
                            <div className="action-buttons">
                              {/* <Link to={`view/${ebook._id}`} className="action-btn view-btn">
                                                                <FontAwesomeIcon icon={faEye} />
                                                                <span className="tooltip-text">View</span>
                                                            </Link> */}
                              <Link
                                to={`edit/${ebook._id}`}
                                className="action-btn edit-btn"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                                <span className="tooltip-text">Edit</span>
                              </Link>
                              <button
                                className="action-btn delete-btn"
                                onClick={() => handleDelete(ebook._id)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                                <span className="tooltip-text">Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* Pagination Component */}
                {/* {!loading && ebooks.length > 0 && (
                                    <>
                                        <div className="pagination-info">
                                            <span>
                                                Showing {(pageNumber - 1) * pageInfo.limit + 1} to{" "}
                                                {Math.min(pageNumber * pageInfo.limit, pageInfo.total)} of {pageInfo.total} entries
                                            </span>
                                        </div>
                                        <Pagination
                                            pageNumber={pageNumber}
                                            totalPages={pageInfo.totalPages}
                                            setPageNumber={setPageNumber}
                                            pageLimit={pageInfo.total}
                                        />
                                    </>
                                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
               

                .dashboard-title {
                    margin-bottom: 10px;
                }

                .dash-head {
                    color: #2c3e50;
                    font-weight: 600;
                    margin: 0;
                }

                .custom-bredcump {
                    margin-bottom: 20px;
                }

                .breadcrumb {
                    background: none;
                    padding: 0;
                    margin: 0;
                }

                .breadcrumb-item a {
                    color: #6c757d;
                    text-decoration: none;
                }

                .breadcrumb-item.active {
                    color: #495057;
                }

                .btn-add-question, .btn-export {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                }

                .btn-export {
                    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                    margin-right: 10px;
                }

                .btn-add-question:hover, .btn-export:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    color: white;
                    text-decoration: none;
                }

                .cards {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    padding: 25px;
                    margin-top: 20px;
                }

                .bus-filter {
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #e9ecef;
                }

                .card-title {
                    color: #2c3e50;
                    font-weight: 600;
                    margin: 0;
                }

                .search-filter-container {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                    align-items: center;
                }

                .date-range-container {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: #f8f9fa;
                    padding: 8px 12px;
                    border-radius: 8px;
                    border: 1px solid #dee2e6;
                }

                .date-icon {
                    color: #6c757d;
                }

                .date-input {
                    border: none;
                    background: transparent;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 14px;
                }

                .date-separator {
                    color: #6c757d;
                    font-weight: 500;
                }

                .status-filter {
                    padding: 8px 12px;
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    background: white;
                    font-size: 14px;
                    min-width: 150px;
                }

                .entries-search-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                    gap: 15px;
                }

                .entries-container {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .entries-select {
                    padding: 6px 10px;
                    border: 1px solid #dee2e6;
                    border-radius: 6px;
                    font-size: 14px;
                }

                .search-container {
                    position: relative;
                }

                .search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #6c757d;
                }

                .search-input {
                    padding: 8px 12px 8px 35px;
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    width: 250px;
                    font-size: 14px;
                }

                .custom-table {
                    margin-top: 20px;
                }

                .table {
                    margin: 0;
                }

                .table thead th {
                    background: #f8f9fa;
                    border: none;
                    font-weight: 600;
                    color: #495057;
                    padding: 15px 12px;
                    white-space: nowrap;
                }

                .table tbody td {
                    padding: 15px 12px;
                    vertical-align: middle;
                    border-bottom: 1px solid #e9ecef;
                }

                .book-title {
                    font-weight: 500;
                    color: #2c3e50;
                }

                .book-image {
                    display: flex;
                    justify-content: center;
                }

                .book-thumbnail {
                    width: 40px;
                    height: 50px;
                    object-fit: cover;
                    border-radius: 4px;
                    border: 1px solid #dee2e6;
                }

                .no-image {
                    width: 40px;
                    height: 50px;
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    color: #6c757d;
                }

                .download-link {
                    color: #007bff;
                    text-decoration: none;
                    font-size: 14px;
                    display: inline-flex;
                    align-items: center;
                }

                .download-link:hover {
                    color: #0056b3;
                    text-decoration: underline;
                }

                .price-badge {
                    background: #e3f2fd;
                    color: #1976d2;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 500;
                }

                .status-badge {
                    border: none;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .status-active {
                    background: #d4edda;
                    color: #155724;
                }

                .status-inactive {
                    background: #f8d7da;
                    color: #721c24;
                }

                .writer-name {
                    color: #495057;
                    font-weight: 500;
                }

                .commission-badge {
                    background: #fff3cd;
                    color: #856404;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 500;
                }

                .action-buttons {
                    display: flex;
                    gap: 8px;
                }

                .action-btn {
                    width: 32px;
                    height: 32px;
                    border: none;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    text-decoration: none;
                }

                .view-btn {
                    background: #e3f2fd;
                    color: #1976d2;
                }

                .edit-btn {
                    background: #fff3e0;
                    color: #f57c00;
                }

                .delete-btn {
                    background: #ffebee;
                    color: #d32f2f;
                }

                .action-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                }

                .tooltip-text {
                    visibility: hidden;
                    width: 60px;
                    background-color: #333;
                    color: white;
                    text-align: center;
                    border-radius: 4px;
                    padding: 4px 8px;
                    position: absolute;
                    z-index: 1;
                    bottom: 125%;
                    left: 50%;
                    margin-left: -30px;
                    font-size: 11px;
                }

                .action-btn:hover .tooltip-text {
                    visibility: visible;
                }

                .loading-spinner {
                    text-align: center;
                    padding: 50px;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #007bff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .empty-state {
                    text-align: center;
                    padding: 50px 20px;
                }

                .empty-state img {
                    opacity: 0.6;
                    margin-bottom: 20px;
                }

                .empty-state h4 {
                    color: #6c757d;
                    margin-bottom: 10px;
                }

                .pagination-info {
                    margin-top: 20px;
                    padding-top: 15px;
                    border-top: 1px solid #e9ecef;
                    color: #6c757d;
                    font-size: 14px;
                }

                @media (max-width: 768px) {
                    .search-filter-container {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .date-range-container {
                        justify-content: center;
                    }

                    .entries-search-container {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .search-input {
                        width: 100%;
                    }

                    .table-responsive {
                        font-size: 14px;
                    }

                    .action-buttons {
                        flex-direction: column;
                    }
                }
            `}</style>
    </section>
  );
};

export default Ebook;
