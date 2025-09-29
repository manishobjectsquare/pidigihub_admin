"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faSearch,
  faFilter,
  faUser,
  faCalendarAlt,
  faCreditCard,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { baseUrl } from "../../config/baseUrl";

export default function EbookPurchaseList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [bookingsPerPage] = useState(15);

  useEffect(() => {
    fetchBookings();
  }, [currentPage]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/ebook-purchase/purchases-list`, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      if (data.status) {
        setBookings(data.data || []);
        setTotalBookings(data.total || 0);
      } else {
        toast.error(data.message || "Failed to fetch bookings");
        setBookings([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch bookings");
      setBookings([]);
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to change status to ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, change to ${newStatus}!`,
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${baseUrl}/ebook-purchase/update-status/${bookingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
            body: JSON.stringify({ status: newStatus }),
          }
        );
        const data = await response.json();
        if (data.status) {
          // Update local state immediately
          setBookings((prevBookings) =>
            prevBookings.map((booking) =>
              booking._id === bookingId
                ? { ...booking, paymentStatus: newStatus }
                : booking
            )
          );
          toast.success(`Status updated to ${newStatus} successfully`);
        } else {
          toast.error(data.message || "Failed to update status");
        }
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Failed to update status");
      }
    }
  };

  const getStatusBadge = (status, bookingId) => {
    const statusConfig = {
      pending: { color: "warning", icon: faClock, text: "pending" },
      success: { color: "success", icon: faCheckCircle, text: "success" },
      failed: { color: "danger", icon: faTimesCircle, text: "failed" },
      // ["success", "pending", "failed"]
      // cancelled: { color: "danger", icon: faTimesCircle, text: "Cancelled" },
      // completed: { color: "info", icon: faCheckCircle, text: "Completed" },
    };

    const config = statusConfig[status] || statusConfig.pending;

    // Get available status options (exclude current status)
    const availableStatuses = [
      { value: "pending", label: "Pending", icon: faClock },
      { value: "success", label: "success", icon: faCheckCircle },
      // { value: "cancelled", label: "Cancelled", icon: faTimesCircle },
      // { value: "completed", label: "Completed", icon: faCheckCircle },
    ].filter((s) => s.value !== status);

    return (
      <div className="dropdown">
        <span
          className={`badge bg-${config.color} d-flex align-items-center gap-1 dropdown-toggle cursor-pointer`}
          data-bs-toggle="dropdown"
          aria-expanded="false"
          style={{ cursor: "pointer" }}
        >
          <FontAwesomeIcon icon={config.icon} size="sm" />
          {config.text}
          <FontAwesomeIcon icon={faChevronDown} size="xs" />
        </span>
        <ul className="dropdown-menu">
          {availableStatuses.map((statusOption) => (
            <li key={statusOption.value}>
              <button
                className={`dropdown-item ${
                  statusOption.value === "cancelled" ? "text-danger" : ""
                }`}
                onClick={() =>
                  handleStatusChange(bookingId, statusOption.value)
                }
              >
                <FontAwesomeIcon icon={statusOption.icon} className="me-2" />
                {statusOption.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const getPaymentMethodBadge = (method) => {
    return (
      <span
        className={`badge ${
          method === "online" ? "bg-primary" : "bg-secondary"
        }`}
      >
        <FontAwesomeIcon icon={faCreditCard} className="me-1" />
        {method === "online" ? "Online" : "Offline"}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter bookings based on search and filters
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.libraryId?.libraryName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      !statusFilter || booking.paymentStatus === statusFilter;
    const matchesPaymentMethod =
      !paymentMethodFilter || booking.paymentMethod === paymentMethodFilter;
    return matchesSearch && matchesStatus && matchesPaymentMethod;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const startIndex = (currentPage - 1) * bookingsPerPage;
  const paginatedBookings = filteredBookings.slice(
    startIndex,
    startIndex + bookingsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <section className="main-sec">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6">
              <div className="dashboard-title">
                <h4 className="dash-head">
                  <FontAwesomeIcon icon={faBookOpen} className="me-2" />
                  Ebook Management
                </h4>
              </div>
              <div className="custom-bredcump">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Ebook Bookings
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="cards bus-list">
                <div className="bus-filter">
                  <div className="row align-items-center">
                    <div className="col-lg-6">
                      <h5 className="card-title">
                        Purchase List ({filteredBookings.length} of{" "}
                        {totalBookings})
                      </h5>
                    </div>
                    <div className="col-lg-6 text-end">
                      <small className="text-muted">
                        Page {currentPage} of {totalPages} | Total:{" "}
                        {filteredBookings.length}
                      </small>
                    </div>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="responsive-search-filter mb-3">
                  <div className="row gx-2 gy-3 align-items-center">
                    {/* Search Input */}
                    <div className="col-12 col-md-6 col-lg-4">
                      <div className="responsive-search-box position-relative">
                        <FontAwesomeIcon
                          icon={faSearch}
                          className="responsive-search-icon"
                        />
                        <input
                          type="text"
                          className="form-control responsive-search-input ps-5"
                          placeholder="Search by user name, email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Status Filter */}
                    <div className="col-12 col-sm-6 col-md-3 col-lg-2">
                      <select
                        className="form-select responsive-status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="success">Success</option>
                        {/* <option value="cancelled">Cancelled</option> */}
                        {/* <option value="completed">Completed</option> */}
                      </select>
                    </div>

                    {/* Payment Method Filter */}
                    {/* <div className="col-12 col-sm-6 col-md-3 col-lg-2">
                      <select
                        className="form-select responsive-payment-filter"
                        value={paymentMethodFilter}
                        onChange={(e) => setPaymentMethodFilter(e.target.value)}
                      >
                        <option value="">All Methods</option>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                      </select>
                    </div> */}

                    {/* Clear Button */}
                    <div className="col-12 col-md-6 col-lg-2">
                      <button
                        className="btn btn-outline-secondary w-100 responsive-clear-btn"
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter("");
                          setPaymentMethodFilter("");
                        }}
                      >
                        <FontAwesomeIcon icon={faFilter} className="me-1" />
                        Clear
                      </button>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="table-responsive custom-table">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>SN</th>
                        <th>User Details</th>
                        <th>Ebook</th>
                        <th>Booking Date</th>
                        {/* <th>Payment</th> */}
                        <th>Status</th>
                        {/* <th>Created</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="7" className="loading-spinner">
                            <div
                              className="spinner-border text-primary"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                            <p className="mt-2">Loading bookings...</p>
                          </td>
                        </tr>
                      ) : paginatedBookings.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="empty-state">
                            <FontAwesomeIcon
                              icon={faBookOpen}
                              size="3x"
                              className="text-muted mb-3"
                            />
                            <h4>No Bookings Found!</h4>
                            <p className="text-muted">
                              {searchTerm || statusFilter || paymentMethodFilter
                                ? "Try adjusting your search or filter criteria"
                                : "No library bookings available at the moment"}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        paginatedBookings.map((booking, i) => (
                          <tr key={booking._id}>
                            <td>{startIndex + i + 1}</td>
                            <td>
                              <div className="user-info">
                                <div className="fw-medium text-primary">
                                  <FontAwesomeIcon
                                    icon={faUser}
                                    className="me-1"
                                  />
                                  {booking.userId?.name || "N/A"}
                                </div>
                                <small className="text-muted">
                                  {booking.userId?.email || "N/A"}
                                </small>
                              </div>
                            </td>
                            <td>
                              <span className="library-name">
                                {booking.ebookId?.bookTitle || "N/A"}
                              </span>
                            </td>
                            <td>
                              <div className="booking-date">
                                <FontAwesomeIcon
                                  icon={faCalendarAlt}
                                  className="me-1 text-muted"
                                />
                                {formatDate(booking.purchaseDate)}
                              </div>
                            </td>
                            {/* <td>
                              <div className="payment-info">
                                {getPaymentMethodBadge(booking.paymentMethod)}
                                {booking.paymentDetails && (
                                  <div className="mt-1">
                                    <small className="text-success">
                                      ₹{booking.paymentDetails.amount}
                                    </small>
                                  </div>
                                )}
                              </div>
                            </td> */}
                            <td>
                              {getStatusBadge(
                                booking.paymentStatus,
                                booking._id
                              )}
                            </td>
                            {/* <td>
                                  <small className="text-muted">{formatDateTime(booking.createdAt)}</small>
                                </td> */}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination-container">
                    <nav aria-label="Bookings pagination">
                      <ul className="pagination justify-content-center">
                        <li
                          className={`page-item ${
                            currentPage === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </button>
                        </li>
                        {[...Array(totalPages)].map((_, index) => {
                          const pageNumber = index + 1;
                          if (
                            pageNumber === 1 ||
                            pageNumber === totalPages ||
                            (pageNumber >= currentPage - 1 &&
                              pageNumber <= currentPage + 1)
                          ) {
                            return (
                              <li
                                key={pageNumber}
                                className={`page-item ${
                                  currentPage === pageNumber ? "active" : ""
                                }`}
                              >
                                <button
                                  className="page-link"
                                  onClick={() => paginate(pageNumber)}
                                >
                                  {pageNumber}
                                </button>
                              </li>
                            );
                          } else if (
                            pageNumber === currentPage - 2 ||
                            pageNumber === currentPage + 2
                          ) {
                            return (
                              <li
                                key={pageNumber}
                                className="page-item disabled"
                              >
                                <span className="page-link">...</span>
                              </li>
                            );
                          }
                          return null;
                        })}
                        <li
                          className={`page-item ${
                            currentPage === totalPages ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>
        {`
                .stats-cards {
                    display: flex;
                    gap: 1rem;
                }
                
                .stat-card {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 1rem;
                    border-radius: 8px;
                    text-align: center;
                    min-width: 100px;
                }
                
                .stat-number {
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin-bottom: 0.25rem;
                }
                
                .stat-label {
                    font-size: 0.8rem;
                    opacity: 0.9;
                }
                
                .user-info {
                    display: flex;
                    flex-direction: column;
                }
                
                .library-name {
                    font-weight: 500;
                    color: #495057;
                }
                
                .booking-date {
                    display: flex;
                    align-items: center;
                    font-weight: 500;
                }
                
                .payment-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                
                .search-container .search-icon {
                    position: absolute;
                    left: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #6c757d;
                    z-index: 10;
                }
                
                .search-input {
                    padding-left: 2.5rem !important;
                }
                
                .loading-spinner {
                    text-align: center;
                    padding: 3rem 0;
                }
                
                .empty-state {
                    text-align: center;
                    padding: 3rem 0;
                }
                
                .pagination-container {
                    margin-top: 2rem;
                    padding-top: 1rem;
                    border-top: 1px solid #dee2e6;
                }
                
               
                .badge {
                    font-size: 14px;
                    font-weight: 500;
                    padding: 0.375rem 0.75rem;
                }
                
                .badge.dropdown-toggle {
                    transition: all 0.2s ease;
                }
                
                .badge.dropdown-toggle:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .table th {
                    background-color: #f8f9fa;
                    font-weight: 600;
                    border-bottom: 2px solid #dee2e6;
                }
                
                .table td {
                    vertical-align: middle;
                    padding: 1rem 0.75rem;
                }
                
                .table tbody tr:hover {
                    background-color: #f8f9fa;
                }
                
                .cursor-pointer {
                    cursor: pointer;
                }
                
                .dropdown-menu {
                    border: 1px solid #dee2e6;
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
                }
                
                .dropdown-item:hover {
                    background-color: #f8f9fa;
                }
                    /* Style icons inside input */
.responsive-search-box .responsive-search-icon {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  color: #6c757d;
  z-index: 2;
}

/* On small screens, stack vertically if needed */
@media (max-width: 576px) {
  .responsive-search-filter .form-select,
  .responsive-search-filter .form-control,
  .responsive-clear-btn {
    font-size: 0.9rem;
  }
}

                `}
      </style>
    </>
  );
}
