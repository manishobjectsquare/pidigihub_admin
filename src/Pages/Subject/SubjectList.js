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

export default function SubjectList() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [pageNumber, setPageNumber] = useState(1);

  const [pageInfo, setPageInfo] = useState({
    total: 0,
    perPage: 30,
    currentPage: 1,
    totalPages: 1,
  });

  useEffect(() => {
    fetchSubjects();
  }, [pageNumber, searchTerm, statusFilter, sortOrder]);
  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm, statusFilter, sortOrder]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${baseUrl}/subjects?page=${pageNumber}&limit=${pageInfo.perPage}&search=${searchTerm}&status=${statusFilter}&sort=${sortOrder}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.data.status) {
        setSubjects(response.data.data);
        setPageInfo({
          total: response.data.pageInfo.total,
          perPage: 30,
          currentPage: response.data.pageInfo.currentPage,
          totalPages: response.data.pageInfo.totalPages,
        });
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to fetch subjects");
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id) => {
    try {
      const subject = subjects.find((s) => s._id === id);
      if (!subject) return;

      const newStatus = subject.status === "active" ? "inactive" : "active";

      const response = await fetch(`${baseUrl}/subjects/status/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (data.status) {
        // Update local state
        const updatedSubjects = subjects.map((s) =>
          s._id === id ? { ...s, status: newStatus } : s
        );
        setSubjects(updatedSubjects);
        toast.success("Subject status updated successfully!");
      } else {
        toast.error(data.message || "Failed to update subject status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update subject status.");
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
        const response = await fetch(`${baseUrl}/subjects/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        const data = await response.json();
        if (data.status) {
          // Update local state
          const updatedSubjects = subjects.filter((s) => s._id !== id);
          setSubjects(updatedSubjects);

          // Update page info
          setPageInfo((prev) => ({
            ...prev,
            total: prev.total - 1,
          }));

          toast.success("Subject has been deleted.");

          // If current page becomes empty and it's not the first page, go to previous page
          if (updatedSubjects.length === 0 && pageNumber > 1) {
            setPageNumber(pageNumber - 1);
          }
        } else {
          toast.error(data.message || "Failed to delete subject");
        }
      } catch (error) {
        console.error("Error deleting subject:", error);
        toast.error("Failed to delete subject.");
      }
    }
  };

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
                  Subjects
                </h4>
              </div>
              <div className="custom-bredcump">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Subjects
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="col-lg-6 d-flex justify-content-end align-items-start">
              <Link to="/subjects/add" className="btn-add-question">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Subject
              </Link>
              <Link
                to={`${baseUrl}/subjects/excel/download/?search=${searchTerm}&status=${statusFilter}&sort=${sortOrder}`}
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
                        Subjects List ({pageInfo.total})
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
                      placeholder="Search subjects..."
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
                    <option value="a-z">Name (A-Z)</option>
                    <option value="z-a">Name (Z-A)</option>
                  </select>
                </div>

                <div className="table-responsive custom-table">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>SN</th>
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
                      ) : subjects.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="empty-state">
                            <img
                              src={empty || "/placeholder.svg"}
                              alt="No subjects"
                              width="200px"
                            />
                            <h4>No Subjects found!</h4>
                            <p className="text-muted">
                              {searchTerm || statusFilter
                                ? "Try adjusting your search or filter criteria"
                                : "Start by adding your first subject"}
                            </p>
                            <Link
                              to="/subjects/add"
                              className="btn-add-question mt-3"
                            >
                              <FontAwesomeIcon icon={faPlus} className="me-2" />
                              Add Subject
                            </Link>
                          </td>
                        </tr>
                      ) : (
                        subjects.map((subject, i) => (
                          <tr key={subject._id}>
                            <td>{(pageNumber - 1) * 30 + i + 1}</td>
                            <td>
                              <div className="subject-name ">
                                {subject.name}
                              </div>
                              <div className="text-muted small mt-1">
                                {subject?.subjectCode}
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
                                  to={`/subjects/edit/${subject._id}`}
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

                  {/* Pagination Component */}
                  {!loading && subjects.length > 0 && (
                    <Pagination
                      pageNumber={pageNumber}
                      totalPages={pageInfo.totalPages}
                      setPageNumber={setPageNumber}
                      pageLimit={pageInfo.total}
                      perPage={pageInfo.perPage}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
