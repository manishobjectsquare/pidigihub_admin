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

export default function Sections() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  // Pagination info
  const [pageInfo, setPageInfo] = useState({
    total: 0,
    currentPage: 1,
    totalPages: 1,
  });

  useEffect(() => {
    fetchSections(pageInfo.currentPage);
  }, [pageInfo.currentPage, searchTerm, statusFilter, sortOrder]);

  useEffect(() => {
    // Reset to page 1 when any filter/search/sort changes
    setPageInfo((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  }, [searchTerm, statusFilter, sortOrder]);

  const fetchSections = async (page = 1) => {
    try {
      setLoading(true);

      const response = await axios.get(`${baseUrl}/sections`, {
        params: {
          page,
          search: searchTerm,
          status: statusFilter,
          sort: sortOrder,
        },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (response.data.status) {
        setSections(response.data.data);
        if (response.data.pageInfo) {
          setPageInfo(response.data.pageInfo);
        }
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id) => {
    const section = sections.find((s) => s._id === id);
    if (!section) return;

    const newStatus = section.status === "active" ? "inactive" : "active";

    try {
      await axios.patch(
        `${baseUrl}/sections/status/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      setSections((prevSections) =>
        prevSections.map((s) =>
          s._id === id ? { ...s, status: newStatus } : s
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
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
        await axios.delete(`${baseUrl}/sections/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        setSections((prevSections) => prevSections.filter((s) => s._id !== id));

        toast.success("Section has been deleted.");
      } catch (error) {
        console.error("Error deleting section:", error);
        Swal.fire("Error!", "Failed to delete section.", "error");
      }
    }
  };

  // const filteredSections = sections.filter((section) => {
  //   const matchesSearch = section.name
  //     .toLowerCase()
  //     .includes(searchTerm.toLowerCase());
  //   const matchesStatus =
  //     statusFilter === "" || section.status === statusFilter;
  //   return matchesSearch && matchesStatus;
  // });

  const sortedSections = [...sections].sort((a, b) => {
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
                  Sections
                </h4>
              </div>
              <div className="custom-bredcump">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Sections
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="col-lg-6 d-flex justify-content-end align-items-start">
              <Link to="create" className="btn-add-question">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Section
              </Link>
              <Link
                to={`${baseUrl}/sections/excel/download?search=${searchTerm}&status=${statusFilter}&sort=${sortOrder}`}
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
                        Section List ({sections.length})
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
                      placeholder="Search Section..."
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
                        <th>Organization</th>
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
                      ) : sortedSections.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="empty-state">
                            <img src={empty} alt="No sections" width="200px" />
                            <h4>No Section found!</h4>
                            <p className="text-muted">
                              {searchTerm || statusFilter
                                ? "Try adjusting your search or filter criteria"
                                : "Start by adding your first section"}
                            </p>
                            <Link to="create" className="btn-add-question mt-3">
                              <FontAwesomeIcon icon={faPlus} className="me-2" />
                              Add Section
                            </Link>
                          </td>
                        </tr>
                      ) : (
                        sortedSections.map((section, i) => (
                          <tr key={section._id}>
                            <td>{(pageInfo.currentPage - 1) * 15 + i + 1}</td>
                            <td>
                              <div className="subject-name fw-bold">
                                {section.name}
                              </div>
                              <div className="text-muted small">
                                {section?.sectionCode}
                              </div>
                            </td>
                            <td>
                              <div className="subject-name fw-bold">
                                {section?.organization_id?.name}
                              </div>
                            </td>
                            <td>{formatDate(section.createdAt)}</td>
                            <td>
                              <button
                                onClick={() => handleStatus(section._id)}
                                className={`status-badge ${
                                  section.status === "active"
                                    ? "status-active"
                                    : "status-inactive"
                                }`}
                              >
                                {section.status === "active" ? (
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
                                  to={`/sections/edit/${section._id}`}
                                  className="action-btn edit-btn"
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                  <span className="tooltip-text">Edit</span>
                                </Link>
                                <button
                                  className="action-btn delete-btn"
                                  onClick={() => handleDelete(section._id)}
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
        {!loading && sections.length > 0 && (
          <Pagination
            pageNumber={pageInfo.currentPage}
            totalPages={pageInfo.totalPages}
            setPageNumber={(page) => {
              setPageInfo((prev) => ({ ...prev, currentPage: page }));
              fetchSections(page);
            }}
            pageLimit={pageInfo.total}
            perPage={pageInfo.perPage || 15}
          />
        )}
      </section>
    </>
  );
}
