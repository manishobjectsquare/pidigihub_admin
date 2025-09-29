"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import {
  faCalendarAlt,
  faCheck,
  faTimes,
  faEdit,
  faTrash,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function TenureList() {
  const [tenures, setTenures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/library-tenure`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      if (response.data.status) {
        setTenures(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching tenures:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id) => {
    try {
      const tenure = tenures.find((t) => t._id === id);
      if (!tenure) return;

      const newStatus = tenure.status === "active" ? "inactive" : "active";

      await axios.patch(
        `${baseUrl}/library-tenure/status/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      const updatedTenures = tenures.map((t) =>
        t._id === id ? { ...t, status: newStatus } : t
      );
      setTenures(updatedTenures);

      toast.success("Tenure status updated!");
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
        let res = await axios.delete(`${baseUrl}/library-tenure/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        if (!res.data.status) {
          return Swal.fire({
            title: "Warning!",
            text: res.data.message,
            icon: "warning",
          });
        }
        const updatedTenures = tenures.filter((t) => t._id !== id);
        setTenures(updatedTenures);
        toast.success("Tenure deleted.");
      } catch (error) {
        console.error("Error deleting tenure:", error);
        toast.error("Failed to delete tenure.");
      }
    }
  };

  const filteredTenures = tenures.filter((tenure) => {
    const matchesSearch = tenure.tenure
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || tenure.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedTenures = [...filteredTenures].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOrder === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
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
  // https://api.pidigihub.in/library-tenure
  return (
    <>
      <section className="main-sec">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6">
              <div className="dashboard-title">
                <h4 className="dash-head">
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                  Tenure
                </h4>
              </div>
              <div className="custom-bredcump">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Tenure
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="col-lg-6 d-flex justify-content-end align-items-start">
              <Link to="add" className="btn-add-question">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Tenure
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
                        Tenure List ({filteredTenures.length})
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
                      placeholder="Search Tenure..."
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
                    {/* <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option> */}
                  </select>
                </div>

                <div className="table-responsive custom-table">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>SN</th>
                        <th>Title(days)</th>
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
                      ) : sortedTenures.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="empty-state">
                            <h4>No Tenure found!</h4>
                            <p className="text-muted">
                              {searchTerm || statusFilter
                                ? "Try adjusting your search or filter criteria"
                                : "Start by adding your first tenure"}
                            </p>
                            <Link to="create" className="btn-add-question mt-3">
                              <FontAwesomeIcon icon={faPlus} className="me-2" />
                              Add Tenure
                            </Link>
                          </td>
                        </tr>
                      ) : (
                        sortedTenures.map((tenure, i) => (
                          <tr key={tenure._id}>
                            <td>{i + 1}</td>
                            <td>
                              <span className="fw-bold">{tenure.tenure}</span>(
                              {tenure.days})
                            </td>
                            <td>{formatDate(tenure.createdAt)}</td>
                            <td>
                              <button
                                onClick={() => handleStatus(tenure._id)}
                                className={`status-badge ${tenure.status === "active"
                                    ? "status-active"
                                    : "status-inactive"
                                  }`}
                              >
                                {tenure.status === "active" ? (
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
                                  to={`edit/${tenure._id}`}
                                  className="action-btn edit-btn"
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                  <span className="tooltip-text">Edit</span>
                                </Link>
                                <button
                                  className="action-btn delete-btn"
                                  onClick={() => handleDelete(tenure._id)}
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
      </section>
    </>
  );
}
