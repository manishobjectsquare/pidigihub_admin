"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTie,
  faPlus,
  faEye,
  faEdit,
  faTrash,
  faDownload,
  faSearch,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { baseUrl } from "../../config/baseUrl";
import empty from "../../assets/images/empty-box.png";
import Swal from "sweetalert2";
import Pagination from "../../Component/Pagination/Pagination";

export default function MentorList() {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [qualificationFilter, setQualificationFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [pageNumber, setPageNumber] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [pageInfo, setPageInfo] = useState({
    total: 1,
    perPage: 10,
    currentPage: 1,
    totalPages: 1,
  });

  useEffect(() => {
    fetchMentors();
  }, [pageNumber, perPage]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${baseUrl}/mentors?page=${pageNumber}&limit=${perPage}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      if (data.status && data.data) {
        setMentors(data.data);
        setPageInfo({
          total: data.pageInfo?.total || data.data.length,
          perPage: perPage,
          currentPage: data.pageInfo?.currentPage || pageNumber,
          totalPages:
            data.pageInfo?.totalPages || Math.ceil(data.data.length / perPage),
        });
      } else {
        toast("Working On This");
      }
    } catch (error) {
      console.error("Error fetching mentors:", error);
      toast("Working On This");
    } finally {
      setLoading(false);
    }
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setPageNumber(1); // Reset to first page when changing perPage
  };

  const handleStatusToggle = async (mentorId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const response = await fetch(`${baseUrl}/mentors/status/${mentorId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();
      if (data.status) {
        setMentors((prevMentors) =>
          prevMentors.map((mentor) =>
            mentor._id === mentorId ? { ...mentor, status: newStatus } : mentor
          )
        );
        toast.success(
          `Mentor ${!currentStatus ? "activated" : "deactivated"} successfully`
        );
      } else {
        toast.error(data.message || "Failed to update mentor status");
      }
    } catch (error) {
      console.error("Error updating mentor status:", error);
      toast.error("Failed to update mentor status");
    }
  };

  const handleDelete = async (mentorId) => {
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
        const response = await fetch(`${baseUrl}/mentors/${mentorId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();
        if (data.status) {
          // Update local state instead of refetching
          const updatedMentors = mentors.filter(
            (mentor) => mentor._id !== mentorId
          );
          setMentors(updatedMentors);
          // Update page info
          setPageInfo((prev) => ({
            ...prev,
            total: prev.total - 1,
          }));
          toast.success("Mentor deleted successfully");
          // If current page becomes empty and it's not the first page, go to previous page
          if (updatedMentors.length === 0 && pageNumber > 1) {
            setPageNumber(pageNumber - 1);
          }
        } else {
          toast.error(data.message || "Failed to delete mentor");
        }
      } catch (error) {
        console.error("Error deleting mentor:", error);
        toast.error("Failed to delete mentor");
      }
    }
  };

  const handleExport = () => {
    toast.info("Export functionality will be implemented soon");
  };

  // Filter mentors based on search and filters
  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.mentorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.uniqueCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "" ||
      (statusFilter === "active" ? mentor.status : !mentor.status);
    const matchesQualification =
      !qualificationFilter ||
      mentor.qualification
        ?.toLowerCase()
        .includes(qualificationFilter.toLowerCase());
    const matchesLocation =
      !locationFilter ||
      mentor.location?.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = !typeFilter || mentor.mentorType === typeFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesQualification &&
      matchesLocation &&
      matchesType
    );
  });

  // Sort mentors based on sort order
  const sortedMentors = [...filteredMentors].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOrder === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortOrder === "name-asc") {
      return a.mentorName?.localeCompare(b.mentorName) || 0;
    } else if (sortOrder === "name-desc") {
      return b.mentorName?.localeCompare(a.mentorName) || 0;
    } else if (sortOrder === "amount-high") {
      return (b.mentorAmount || 0) - (a.mentorAmount || 0);
    } else if (sortOrder === "amount-low") {
      return (a.mentorAmount || 0) - (b.mentorAmount || 0);
    }
    return 0;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <>
      <section className="main-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="dashboard-title">
                <h4 className="dash-head">
                  <FontAwesomeIcon icon={faUserTie} className="me-2" />
                  Mentor Listing
                </h4>
              </div>
              <div className="custom-bredcump">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Mentor Listing
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="col-lg-6 d-flex justify-content-end align-items-start gap-2">
              <button onClick={handleExport} className="btn-add-question">
                <FontAwesomeIcon icon={faDownload} className="me-2" />
                Export Mentors
              </button>
              <Link to="/mentors/add" className="btn-add-question">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Mentor
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
                        Mentors List ({pageInfo.total})
                      </h5>
                    </div>
                  </div>
                </div>

                <div className="search-filter-container mb-3">
                  <div className="row gx-3 gy-2 align-items-center">
                    {/* Search Input */}
                    <div className="col-lg-4 col-md-6">
                      <div className="search-container position-relative">
                        <FontAwesomeIcon
                          icon={faSearch}
                          className="search-icon"
                        />
                        <input
                          type="text"
                          className="form-control ps-5"
                          placeholder="Search Mentors..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Location Filter */}
                    <div className="col-lg-3 col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Filter by Location"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                      />
                    </div>

                    {/* Status Filter */}
                    <div className="col-lg-2 col-md-6">
                      <select
                        className="form-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    {/* Sort Filter */}
                    <div className="col-lg-3 col-md-6">
                      <select
                        className="form-select"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                      >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="name-asc">Name A-Z</option>
                        <option value="name-desc">Name Z-A</option>
                        <option value="amount-high">Amount High</option>
                        <option value="amount-low">Amount Low</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="table-responsive custom-table">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Mentor Name (UniqueCode)</th>
                        <th>Qualification</th>
                        <th>Location</th>
                        <th>Email</th>
                        <th>Contact</th>
                        <th>Mentor Amount (₹/hr)</th>
                        <th>Mentor Added Date Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="10" className="loading-spinner">
                            <div
                              className="spinner-border text-primary"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                            <p className="mt-2">Loading mentors...</p>
                          </td>
                        </tr>
                      ) : sortedMentors.length === 0 ? (
                        <tr>
                          <td colSpan="10" className="empty-state">
                            <img
                              src={empty || "/placeholder.svg"}
                              alt="No mentors"
                              width="200px"
                            />
                            <h4>No Mentors Found</h4>
                            <p className="text-muted">
                              {searchTerm ||
                              statusFilter ||
                              qualificationFilter ||
                              locationFilter ||
                              typeFilter
                                ? "Try adjusting your search or filter criteria"
                                : "Start by adding your first mentor"}
                            </p>
                            <Link
                              to="/mentors/add"
                              className="btn-add-question mt-3"
                            >
                              <FontAwesomeIcon icon={faPlus} className="me-2" />
                              Add Mentor
                            </Link>
                          </td>
                        </tr>
                      ) : (
                        sortedMentors.map((mentor, index) => (
                          <tr key={mentor._id}>
                            <td>{(pageNumber - 1) * perPage + index + 1}</td>
                            <td>
                              <div className="mentor-info">
                                <div className="mentor-name fw-bold">
                                  {mentor.mentorName || "N/A"}
                                </div>
                                <small className="text-muted">
                                  {mentor.mentorCode}
                                </small>
                              </div>
                            </td>
                            <td>
                              <span className="qualification-badge">
                                {mentor.qualification || "N/A"}
                              </span>
                            </td>
                            <td>
                              <span className="location-badge">
                                {mentor.location || "N/A"}
                              </span>
                            </td>
                            <td>
                              <div className="email-text">
                                {mentor.email || "N/A"}
                              </div>
                            </td>
                            <td>
                              <div className="contact-text">
                                {mentor.contact || mentor.phone || "N/A"}
                              </div>
                            </td>
                            <td>
                              <div className="amount-text fw-bold">
                                {formatAmount(mentor.mentorAmount)}
                              </div>
                            </td>
                            <td>
                              <span className="date-text">
                                {formatDate(mentor.createdAt)}
                              </span>
                            </td>
                            <td>
                              <button
                                onClick={() =>
                                  handleStatusToggle(mentor._id, mentor?.status)
                                }
                                className={`status-badge ${
                                  mentor?.status === "active"
                                    ? "status-active"
                                    : "status-inactive"
                                }`}
                              >
                                <FontAwesomeIcon
                                  icon={mentor.status ? faCheck : faTimes}
                                  className="me-1"
                                />
                                {mentor.status === "active"
                                  ? "Active"
                                  : "Inactive"}
                              </button>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="action-btn view-btn"
                                  title="View"
                                  onClick={() =>
                                    navigate(`/mentors/view/${mentor?._id}`)
                                  }
                                >
                                  <FontAwesomeIcon icon={faEye} />
                                  <span className="tooltip-text">View</span>
                                </button>
                                <Link
                                  className="action-btn edit-btn"
                                  title="Edit"
                                  to={`edit/${mentor?._id}`}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                  <span className="tooltip-text">Edit</span>
                                </Link>
                                <button
                                  className="action-btn delete-btn"
                                  title="Delete"
                                  onClick={() => handleDelete(mentor._id)}
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
                  {!loading && sortedMentors.length > 0 && (
                    <Pagination
                      pageNumber={pageNumber}
                      totalPages={pageInfo.totalPages}
                      setPageNumber={setPageNumber}
                      pageLimit={pageInfo.total}
                      perPage={perPage}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
       
        
        
        .status-badge {
          border: none;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .status-active {
          background-color: #d1e7dd;
          color: #0f5132;
        }
        
        .status-inactive {
          background-color: #f8d7da;
          color: #842029;
        }

        .qualification-badge {
          background-color: #e3f2fd;
          color: #1976d2;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .location-badge {
          background-color: #f3e5f5;
          color: #7b1fa2;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .action-buttons {
          display: flex;
          gap: 10px;
        }
        
        .action-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .view-btn {
          background-color: #e8f5e8;
          color: #28a745;
        }
        
        .view-btn:hover {
          background-color: #28a745;
          color: white;
        }
        
        .edit-btn {
          background-color: #e3f2fd;
          color: #0d6efd;
        }
        
        .edit-btn:hover {
          background-color: #0d6efd;
          color: white;
        }
        
        .delete-btn {
          background-color: #f8d7da;
          color: #dc3545;
        }
        
        .delete-btn:hover {
          background-color: #dc3545;
          color: white;
        }
        
        .tooltip-text {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #333;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        
        .action-btn:hover .tooltip-text {
          opacity: 1;
          visibility: visible;
        }
        
        .empty-state {
          text-align: center;
          padding: 40px 20px;
        }
        
        .empty-state img {
          margin-bottom: 20px;
        }
        
        .empty-state h4 {
          margin-bottom: 10px;
          color: #333;
        }
        
        .btn-add-question {
          background: #008080;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .btn-add-question:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
          color: white;
        }

        .mentor-info {
          min-width: 150px;
        }

        .mentor-name {
          color: #333;
          font-size: 0.95rem;
        }

        .email-text {
          font-size: 0.85rem;
          color: #6c757d;
          max-width: 200px;
          word-break: break-word;
        }

        .contact-text {
          font-size: 0.9rem;
          color: #333;
          font-weight: 500;
        }

        .amount-text {
          color: #28a745;
          font-size: 0.9rem;
        }

        .date-text {
          font-size: 0.85rem;
          color: #6c757d;
        }

        .custom-table table {
          font-size: 0.9rem;
        }

        .custom-table th {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #495057;
          border-bottom: 2px solid #dee2e6;
          padding: 12px 8px;
        }

        .custom-table td {
          padding: 12px 8px;
          vertical-align: middle;
          border-bottom: 1px solid #dee2e6;
        }

        .loading-spinner {
          text-align: center;
          padding: 40px 20px;
        }
      `}</style>
    </>
  );
}

// {
//   "_id": {
//     "$oid": "686cfd0b3e6e7e56532e8788"
//   },
//   "name": "super admin",
//   "email": "superadmin@email.com",
//   "mobile": "9876543210",
//   "gender": "Male",
//   "dob": {
//     "$date": "2000-01-01T00:00:00.000Z"
//   },
//   "address": "delhi",
//   "state": "Delhi",
//   "city": "New Delhi",
//   "pinCode": "110001",
//   "profileImage": "1753764300599.jpg",
//   "status": "inactive",
//   "createdAt": {
//     "$date": "2025-07-08T07:03:55.820Z"
//   },
//   "updatedAt": {
//     "$date": "2025-07-31T10:15:03.602Z"
//   },
//   "__v": 0,
//   "password": "123456",
//   "otp": 464539,
//   "otpExpiry": {
//     "$date": "2025-07-31T10:25:03.583Z"
//   },
//   "user_type": "admin"
// }

// {
//   "_id": {
//     "$oid": "686cc2db526c6f3780ff02f2"
//   },
//   "name": "hello",
//   "email": "manishobjectsquare@gmail.com",
//   "mobile": "1234567890",
//   "gender": "Male",
//   "dob": {
//     "$date": "2000-01-01T00:00:00.000Z"
//   },
//   "address": "delhi",
//   "state": "Delhi",
//   "city": "New Delhi",
//   "pinCode": "110001",
//   "profileImage": "1755511312418.jpg",
//   "status": "inactive",
//   "createdAt": {
//     "$date": "2025-07-08T07:03:55.820Z"
//   },
//   "updatedAt": {
//     "$date": "2025-08-18T10:01:52.468Z"
//   },
//   "__v": 0,
//   "password": "1234",
//   "otp": 0,
//   "otpExpiry": {
//     "$date": "2025-08-18T06:01:44.813Z"
//   }
// }
