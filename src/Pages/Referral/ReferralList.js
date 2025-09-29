"use client";

import { useState, useEffect } from "react";
import { baseUrl } from "../../config/baseUrl";
import { Link } from "react-router-dom";

const ReferralList = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
    referrerType: "",
    packageType: "",
  });

  useEffect(() => {
    fetchReferrals();
  }, [currentPage, filters]);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/referral/referral-list`);
      if (!response.ok) {
        throw new Error("Failed to fetch referrals");
      }
      const data = await response.json();
      setReferrals(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      status: "",
      referrerType: "",
      packageType: "",
    });
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: "badge bg-success",
      pending: "badge bg-warning",
      expired: "badge bg-danger",
      completed: "badge bg-info",
    };
    return statusClasses[status?.toLowerCase()] || "badge bg-secondary";
  };

  const getReferrerTypeBadge = (type) => {
    const typeClasses = {
      student: "badge bg-primary",
      teacher: "badge bg-info",
      admin: "badge bg-dark",
    };
    return typeClasses[type?.toLowerCase()] || "badge bg-secondary";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReferrals = referrals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(referrals.length / itemsPerPage);

  if (loading) {
    return (
      <div className="container-fluid">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "400px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Error loading referrals: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="main-sec">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-white border-bottom">
                <div className="row align-items-center">
                  <div className="col">
                    <h5 className="card-title mb-0">
                      <i className="fas fa-users me-2 text-primary"></i>
                      Referral List
                    </h5>
                    <small className="text-muted">
                      Manage and track referral activities
                    </small>
                  </div>
                  <div className="col-auto">
                    <Link
                      className="btn btn-success btn-sm"
                      to="https://api.pidigihub.in/referral/export-list"
                      target="_blank"
                    >
                      <i className="fas fa-file-excel me-1"></i>
                      Export Excel
                    </Link>
                  </div>
                </div>
              </div>

              <div className="card-body">
                {/* Filters */}
                <div className="row mb-4">
                  {/* <div className="col-md-2">
                                        <label className="form-label small fw-semibold">Start Date</label>
                                        <input
                                            type="date"
                                            className="form-control form-control-sm"
                                            value={filters.startDate}
                                            onChange={(e) => handleFilterChange("startDate", e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label small fw-semibold">End Date</label>
                                        <input
                                            type="date"
                                            className="form-control form-control-sm"
                                            value={filters.endDate}
                                            onChange={(e) => handleFilterChange("endDate", e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label small fw-semibold">Status</label>
                                        <select
                                            className="form-select form-select-sm"
                                            value={filters.status}
                                            onChange={(e) => handleFilterChange("status", e.target.value)}
                                        >
                                            <option value="">All Status</option>
                                            <option value="active">Active</option>
                                            <option value="pending">Pending</option>
                                            <option value="expired">Expired</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label small fw-semibold">Referrer Type</label>
                                        <select
                                            className="form-select form-select-sm"
                                            value={filters.referrerType}
                                            onChange={(e) => handleFilterChange("referrerType", e.target.value)}
                                        >
                                            <option value="">All Types</option>
                                            <option value="student">Student</option>
                                            <option value="teacher">Teacher</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label small fw-semibold">Package</label>
                                        <select
                                            className="form-select form-select-sm"
                                            value={filters.packageType}
                                            onChange={(e) => handleFilterChange("packageType", e.target.value)}
                                        >
                                            <option value="">All Packages</option>
                                            <option value="premium">Premium</option>
                                            <option value="basic">Basic</option>
                                            <option value="pro">Pro</option>
                                        </select>
                                    </div>
                                    <div className="col-md-2 d-flex align-items-end">
                                        <button className="btn btn-outline-secondary btn-sm w-100" onClick={clearFilters}>
                                            <i className="fas fa-filter me-1"></i>
                                            Clear
                                        </button>
                                    </div> */}
                </div>

                {/* Results Summary */}
                {/* <div className="row mb-3">
                                    <div className="col">
                                        <p className="mb-0 text-muted small">
                                            Referrals List ({referrals.length} of {referrals.length})
                                            <span className="text-primary ms-2">(Click Referrer Name for Referral Details)</span>
                                        </p>
                                    </div>
                                </div> */}

                {/* Table */}
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-primary">
                      <tr>
                        <th
                          scope="col"
                          className="text-center"
                          style={{ width: "60px" }}
                        >
                          SN
                        </th>
                        <th scope="col" style={{ width: "200px" }}>
                          User
                        </th>
                        <th scope="col" style={{ width: "150px" }}>
                          Referral Code
                        </th>
                        <th scope="col" style={{ width: "180px" }}>
                          Details
                        </th>
                        <th scope="col" style={{ width: "120px" }}>
                          Referred By
                        </th>
                        <th scope="col" style={{ width: "120px" }}>
                          Created Date
                        </th>
                        <th scope="col" style={{ width: "100px" }}>
                          Type
                        </th>
                        <th scope="col" style={{ width: "100px" }}>
                          Purchase Amout
                        </th>
                        <th scope="col" style={{ width: "100px" }}>
                          Commission Amout
                        </th>
                        <th scope="col" style={{ width: "100px" }}>
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentReferrals.length > 0 ? (
                        currentReferrals.map((referral, index) => (
                          <tr key={referral._id || index}>
                            <td className="text-center fw-semibold">
                              {indexOfFirstItem + index + 1}
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div>
                                  <div
                                    className="fw-semibold text-primary"
                                    style={{ cursor: "pointer" }}
                                  >
                                    {referral.referrerUserId?.name || "N/A"}
                                  </div>
                                  <small className="text-muted">
                                    ID:{" "}
                                    {referral.referrerUserId?._id?.slice(-8) ||
                                      "N/A"}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="fw-semibold text-dark">
                                {referral.refCode || "N/A"}
                              </div>
                            </td>
                            <td>
                              <div className="fw-semibold">
                                {referral.package_id?.title || "N/A"}
                              </div>
                              <small className="text-muted">
                                Package ID:{" "}
                                {referral.package_id?._id?.slice(-8) || "N/A"}
                              </small>
                            </td>
                            <td>
                              <div className="fw-semibold">
                                {referral.libraryId?.libraryName ||
                                  referral.mentorId?.mentorName ||
                                  "N/A"}
                              </div>
                              <small className="text-muted">
                                library : {referral.libraryId?.category}
                              </small>
                            </td>
                            <td>
                              <div className="fw-semibold">
                                {formatDate(referral.createdAt)}
                              </div>
                              <small className="text-muted">
                                {formatTime(referral.createdAt)}
                              </small>
                            </td>
                            <td>
                              <span
                                className={getReferrerTypeBadge(
                                  referral.referrerType
                                )}
                              >
                                {referral.referrerType || "N/A"}
                              </span>
                            </td>
                            <td>
                              <div className="fw-semibold text-dark">
                                {referral.amount}
                              </div>
                            </td>
                            <td>
                              <div className="fw-semibold text-dark">
                                {referral.commissionAmount}
                              </div>
                            </td>
                            <td>
                              <span className={getStatusBadge(referral.status)}>
                                {referral.status || "N/A"}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center py-4">
                            <div className="text-muted">
                              <i className="fas fa-inbox fa-2x mb-2"></i>
                              <p className="mb-0">No referrals found</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="row mt-3">
                    <div className="col-sm-6">
                      <div className="text-muted small">
                        Showing {indexOfFirstItem + 1} to{" "}
                        {Math.min(indexOfLastItem, referrals.length)} of{" "}
                        {referrals.length} entries
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <nav aria-label="Referral pagination">
                        <ul className="pagination pagination-sm justify-content-end mb-0">
                          <li
                            className={`page-item ${
                              currentPage === 1 ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              Previous
                            </button>
                          </li>
                          {[...Array(totalPages)].map((_, i) => (
                            <li
                              key={i + 1}
                              className={`page-item ${
                                currentPage === i + 1 ? "active" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(i + 1)}
                              >
                                {i + 1}
                              </button>
                            </li>
                          ))}
                          <li
                            className={`page-item ${
                              currentPage === totalPages ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralList;
