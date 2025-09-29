"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl";
import empty from "../../assets/images/empty-box.png";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
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

export default function LanguageList() {
  const [languages, setLanguages] = useState([]);
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
    fetchLanguages();
  }, [pageNumber, searchTerm, statusFilter, sortOrder]);

  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm, statusFilter, sortOrder]);

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/language/language-list`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (response.data.status) {
        setLanguages(response.data.data);
        setPageInfo((prev) => ({
          ...prev,
          total: response.data.data.length,
          totalPages: Math.ceil(response.data.data.length / prev.perPage),
          currentPage: pageNumber,
        }));
      }
    } catch (error) {
      console.error("Error fetching languages:", error);
      toast.error("Failed to fetch languages");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id) => {
    try {
      const lang = languages.find((l) => l._id === id);
      if (!lang) return;

      const updatedStatus = !lang.isActive;

      const response = await fetch(`${baseUrl}/language/status/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ isActive: updatedStatus }),
      });

      const data = await response.json();
      if (data.status) {
        const updatedLanguages = languages.map((l) =>
          l._id === id ? { ...l, isActive: updatedStatus } : l
        );
        setLanguages(updatedLanguages);
        toast.success("Language status updated!");
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update language status.");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the language.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${baseUrl}/language/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        const data = await response.json();
        if (data.status) {
          const updatedLanguages = languages.filter((l) => l._id !== id);
          setLanguages(updatedLanguages);
          toast.success("Language deleted successfully");

          if (updatedLanguages.length === 0 && pageNumber > 1) {
            setPageNumber(pageNumber - 1);
          }
        } else {
          toast.error(data.message || "Failed to delete language");
        }
      } catch (error) {
        console.error("Error deleting language:", error);
        toast.error("Failed to delete language.");
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="main-sec">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="dashboard-title">
              <h4 className="dash-head">
                <FontAwesomeIcon icon={faGlobe} className="me-2" />
                Languages
              </h4>
            </div>
            <div className="custom-bredcump">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Languages
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="col-lg-6 d-flex justify-content-end align-items-start">
            <Link to="/languages/add" className="btn-add-question">
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Add Language
            </Link>
            <Link
              to={`${baseUrl}/language/excel/download/?search=${searchTerm}&status=${statusFilter}&sort=${sortOrder}`}
              target="_blank"
              className="ms-2 btn-add-question"
            >
              <FontAwesomeIcon icon={faFileDownload} className="me-2" />
              Export CSV
            </Link>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-lg-12">
            <div className="cards bus-list">
              {/* <div className="search-filter-container">
                <div className="search-container">
                  <FontAwesomeIcon icon={faSearch} className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search languages..."
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
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div> */}

              <div className="table-responsive custom-table">
                <table className="table table-borderless">
                  <thead>
                    <tr>
                      <th>SN</th>
                      <th>Name</th>
                      <th>Code</th>
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
                    ) : languages.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="empty-state">
                          <img src={empty} alt="No languages" width="200px" />
                          <h4>No Languages found!</h4>
                          <p className="text-muted">
                            {searchTerm || statusFilter
                              ? "Try adjusting your search or filter criteria"
                              : "Start by adding your first language"}
                          </p>
                          <Link
                            to="/languages/add"
                            className="btn-add-question mt-3"
                          >
                            <FontAwesomeIcon icon={faPlus} className="me-2" />
                            Add Language
                          </Link>
                        </td>
                      </tr>
                    ) : (
                      languages.map((lang, i) => (
                        <tr key={lang._id}>
                          <td>{(pageNumber - 1) * pageInfo.perPage + i + 1}</td>
                          <td>
                            <div>{lang.name}</div>
                            <div className="text-muted small mt-1">
                              Code: {lang.code}
                            </div>
                          </td>
                          <td>{lang.code}</td>
                          <td>{formatDate(lang.createdAt)}</td>
                          <td>
                            <button
                              onClick={() => handleStatusToggle(lang._id)}
                              className={`status-badge ${
                                lang.isActive
                                  ? "status-active"
                                  : "status-inactive"
                              }`}
                            >
                              {lang.isActive ? (
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
                                to={`/languages/edit/${lang._id}`}
                                className="action-btn edit-btn"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </Link>
                              <button
                                className="action-btn delete-btn"
                                onClick={() => handleDelete(lang._id)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
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
    </section>
  );
}
