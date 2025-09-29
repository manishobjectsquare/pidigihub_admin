"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl";
import empty from "../../assets/images/empty-box.png";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faPlus,
  faEdit,
  faTrash,
  faCheck,
  faTimes,
  faSearch,
  faFileDownload,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Pagination from "../../Component/Pagination/Pagination";

export default function Organizations() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [pageNumber, setPageNumber] = useState(1);
  const [perPage] = useState(15); // backend limit
  const [pageInfo, setPageInfo] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
  });

  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm, statusFilter, sortOrder, perPage]);
  useEffect(() => {
    fetchData();
  }, [searchTerm, statusFilter, sortOrder, pageNumber]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/organizations`, {
        params: {
          page: pageNumber,
          search: searchTerm,
          status: statusFilter,
          sort:
            sortOrder === "name-asc"
              ? "asc"
              : sortOrder === "name-desc"
              ? "desc"
              : sortOrder === "oldest"
              ? "oldest"
              : "newest",
        },
        headers: { Authorization: localStorage.getItem("token") },
      });

      if (response.data.status) {
        setSubjects(response.data.data);
        if (response.data.pageInfo) {
          setPageInfo(response.data.pageInfo);
        }
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id) => {
    try {
      const subject = subjects.find((s) => s._id === id);
      if (!subject) return;

      const newStatus = subject.status === "active" ? "inactive" : "active";

      await axios.patch(
        `${baseUrl}/organizations/status/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      // Update state without re-fetch
      const updatedSubjects = subjects.map((s) =>
        s._id === id ? { ...s, status: newStatus } : s
      );
      setSubjects(updatedSubjects);

      toast.success("Organization status updated!");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
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
        await axios.delete(`${baseUrl}/organizations/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        // Update local state
        const updatedSubjects = subjects.filter((s) => s._id !== id);
        setSubjects(updatedSubjects);

        toast.success("Organization deleted.");
      } catch (error) {
        console.error("Error deleting subject:", error);
        toast.error("Failed to delete organization.");
      }
    }
  };

  // Filter subjects based on search term and status

  // Sort subjects based on sort order
  const sortedSubjects = [...subjects].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOrder === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortOrder === "name-asc") {
      return a.name.localeCompare(b.name);
    } else if (sortOrder === "name-desc") {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <section className="main-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="dashboard-title">
                <h4 className="dash-head">
                  <FontAwesomeIcon icon={faBook} className="me-2" />
                  Organization
                </h4>
              </div>
              <div className="custom-bredcump">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Organization
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="col-lg-6 d-flex justify-content-end align-items-start">
              <Link to="create" className="btn-add-question">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Organization
              </Link>
              <Link
                to={`${baseUrl}/organizations/excel/download?search=${searchTerm}&status=${statusFilter}&sort=${
                  sortOrder === "name-asc"
                    ? "asc"
                    : sortOrder === "name-desc"
                    ? "desc"
                    : sortOrder === "oldest"
                    ? "oldest"
                    : "newest"
                }`}
                target="_blank"
                className="ms-2 btn-add-question"
              >
                <FontAwesomeIcon icon={faFileDownload} className="me-2" />
                Export Csv
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
                        Organization List ({subjects.length})
                      </h5>
                    </div>
                  </div>
                </div>

                <div className="search-filter-container">
                  <div className="search-container">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search Organization..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
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
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                  </select>
                </div>

                <div className="table-responsive custom-table">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>SN</th>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Created Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="5" className="loading-spinner">
                            <div className="spinner"></div>
                          </td>
                        </tr>
                      ) : sortedSubjects.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="empty-state">
                            <img
                              src={empty || "/placeholder.svg"}
                              alt="No subjects"
                              width="200px"
                            />
                            <h4>No Organization found!</h4>
                            <p className="text-muted">
                              {searchTerm || statusFilter
                                ? "Try adjusting your search or filter criteria"
                                : "Start by adding your first organization"}
                            </p>
                            <Link to="create" className="btn-add-question mt-3">
                              <FontAwesomeIcon icon={faPlus} className="me-2" />
                              Add Organization
                            </Link>
                          </td>
                        </tr>
                      ) : (
                        sortedSubjects.map((subject, i) => (
                          <tr key={subject._id}>
                            <td>{(pageNumber - 1) * perPage + (i + 1)}</td>
                            <td>{subject?.organizationCode}</td>
                            <td>
                              <div className="subject-name fw-bold">
                                {subject.name}
                              </div>
                            </td>
                            <td>{formatDate(subject.createdAt)}</td>
                            <td>
                              <button
                                onClick={() => handleStatus(subject._id)}
                                className={`status-badge ${
                                  subject.status === "active"
                                    ? "status-active"
                                    : "status-inactive"
                                }`}
                              >
                                {subject.status === "active" ? (
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
                            <td>
                              <div className="action-buttons">
                                <Link
                                  to={`edit/${subject._id}`}
                                  className="action-btn edit-btn"
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                  <span className="tooltip-text">Edit</span>
                                </Link>
                                <button
                                  className="action-btn delete-btn"
                                  onClick={() => handleDelete(subject._id)}
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
                </div>
              </div>
            </div>
          </div>
        </div>
        {!loading && subjects.length > 0 && (
          <Pagination
            pageNumber={pageNumber}
            totalPages={pageInfo.totalPages}
            setPageNumber={setPageNumber}
            pageLimit={pageInfo.total}
            perPage={perPage}
          />
        )}
      </section>
    </>
  );
}
