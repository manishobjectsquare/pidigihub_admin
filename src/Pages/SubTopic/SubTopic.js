import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { baseUrl } from "../../config/baseUrl";
import empty from "../../assets/images/empty-box.png";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListUl,
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

export default function SubTopic() {
  const [subtopics, setSubtopics] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  // Pagination
  const [pageNumber, setPageNumber] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [pageInfo, setPageInfo] = useState({
    total: 1,
    perPage: 15,
    currentPage: 1,
    totalPages: 1,
  });

  let [excelSearch, setExcelSearch] = useState(
    new URLSearchParams({
      limit: "",
      search: "",
      subject: "",
      sort:
        sortOrder === "name-asc"
          ? "a-z"
          : sortOrder === "name-desc"
          ? "z-a"
          : sortOrder,
      status: "",
    }).toString()
  );

  // 🔹 Debounce searchTerm (wait before firing API)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPageNumber(1); // reset to first page when searching
    }, 600); // 600ms debounce
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    setPageNumber(1);
  }, [statusFilter, sortOrder, perPage]);

  // 🔹 Fetch subtopics when filters or pagination changes
  useEffect(() => {
    fetchSubtopics();
  }, [
    pageNumber,
    perPage,
    debouncedSearch,
    statusFilter,
    topicFilter,
    sortOrder,
  ]);

  const fetchSubtopics = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pageNumber,
        limit: perPage,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(statusFilter && { status: statusFilter }),
        ...(topicFilter && { topic: topicFilter }),
        ...(sortOrder && { sort: sortOrder }),
      });

      setExcelSearch(
        new URLSearchParams({
          ...(debouncedSearch && { search: debouncedSearch }),
          ...(statusFilter && { status: statusFilter }),
          ...(topicFilter && { topic: topicFilter }),
          ...(sortOrder && { sort: sortOrder }),
        })
      );

      const res = await fetch(
        `${baseUrl}/subtopics?${queryParams.toString()}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      const data = await res.json();
      if (data?.status) {
        setSubtopics(data?.data || []);
        setPageInfo({
          total: data.pageInfo?.total || data.data.length,
          perPage: perPage,
          currentPage: data.pageInfo?.currentPage || pageNumber,
          totalPages:
            data.pageInfo?.totalPages || Math.ceil(data.data.length / perPage),
        });
      } else {
        toast.error(data?.message || "Failed to fetch subtopics");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Something went wrong while fetching subtopics");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch(`${baseUrl}/topics`, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        const data = await res.json();
        if (data?.status) {
          setTopics(data?.data || []);
        } else {
          toast.error(data?.message || "Failed to fetch topics");
        }
      } catch (err) {
        console.error("Fetch topics error:", err);
        toast.error("Failed to fetch topics");
      }
    };
    fetchTopics();
  }, []);

  // Handle perPage change
  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setPageNumber(1); // Reset to first page when changing perPage
  };

  const handleStatus = async (id) => {
    const sub = subtopics.find((s) => s?._id === id);
    if (!sub) return;

    const newStatus = sub?.status === "active" ? "inactive" : "active";

    try {
      const response = await fetch(`${baseUrl}/subtopics/status/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update local state immediately
        setSubtopics((prevSubtopics) =>
          prevSubtopics.map((s) =>
            s?._id === id ? { ...s, status: newStatus } : s
          )
        );
        toast.success(
          `Subtopic ${
            newStatus === "active" ? "activated" : "deactivated"
          } successfully`
        );
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch(`${baseUrl}/subtopics/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        if (response.ok) {
          // Update local state immediately
          const updatedSubtopics = subtopics.filter((s) => s?._id !== id);
          setSubtopics(updatedSubtopics);
          // Update page info
          setPageInfo((prev) => ({
            ...prev,
            total: prev.total - 1,
          }));
          toast.success("Subtopic deleted successfully");
          // If current page becomes empty and it's not the first page, go to previous page
          if (updatedSubtopics.length === 0 && pageNumber > 1) {
            setPageNumber(pageNumber - 1);
          }
        } else {
          toast.error("Failed to delete subtopic");
        }
      } catch (err) {
        console.error("Delete error:", err);
        toast.error("Failed to delete subtopic");
      }
    }
  };

  // const filtered = subtopics.filter((sub) => {
  //   const matchSearch = sub?.sub_topic_name
  //     ?.toLowerCase()
  //     .includes(searchTerm.toLowerCase());
  //   const matchStatus = !statusFilter || sub?.status === statusFilter;
  //   const matchTopic = !topicFilter || sub?.topic_id?._id === topicFilter;
  //   return matchSearch && matchStatus && matchTopic;
  // });

  const sorted = [...subtopics].sort((a, b) => {
    if (sortOrder === "newest")
      return new Date(b?.createdAt) - new Date(a?.createdAt);
    if (sortOrder === "oldest")
      return new Date(a?.createdAt) - new Date(b?.createdAt);
    if (sortOrder === "name-asc")
      return a?.sub_topic_name?.localeCompare(b?.sub_topic_name);
    if (sortOrder === "name-desc")
      return b?.sub_topic_name?.localeCompare(a?.sub_topic_name);
    return 0;
  });

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <section className="main-sec">
      <div className="container">
        <div className="row mb-3">
          <div className="col-lg-6">
            <div className="dashboard-title">
              <h4 className="dash-head">
                <FontAwesomeIcon icon={faListUl} className="me-2" />
                Subtopics
              </h4>
            </div>
            <div className="custom-bredcump">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Subtopics
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="col-lg-6 d-flex justify-content-end align-items-start">
            <Link to="/subtopics/add" className="btn-add-question">
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Add Subtopic
            </Link>
            <Link
              to={`${baseUrl}/subtopics/excel/download?${excelSearch}`}
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
                      Subtopics List ({pageInfo.total})
                    </h5>
                  </div>
                </div>
              </div>

              <div className="subtopic-search-filters mb-4">
                <div className="row g-3 align-items-stretch">
                  {/* Search Input */}
                  <div className="col-12 col-md-6 col-lg-3">
                    <div className="position-relative h-100">
                      <FontAwesomeIcon
                        icon={faSearch}
                        className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                      />
                      <input
                        type="text"
                        className="form-control ps-5"
                        placeholder="Search Subtopics..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="col-12 col-md-6 col-lg-2">
                    <select
                      className="form-select h-100"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Topic Filter */}
                  <div className="col-12 col-md-6 col-lg-4">
                    <select
                      className="form-select h-100"
                      value={topicFilter}
                      onChange={(e) => setTopicFilter(e.target.value)}
                    >
                      <option value="">All Topics</option>
                      {topics.map((topic) => (
                        <option key={topic._id} value={topic._id}>
                          {topic.topic_name || "Unknown Topic"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort Order Filter */}
                  <div className="col-12 col-md-6 col-lg-3">
                    <select
                      className="form-select h-100"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="az">Name (A-Z)</option>
                      <option value="za">Name (Z-A)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="table-responsive custom-table">
                <table className="table table-borderless">
                  <thead>
                    <tr>
                      <th>Sr</th>
                      <th>Subtopic</th>
                      <th>Topic</th>
                      <th>Subject</th>
                      <th>Created Date</th>
                      <th>Status</th>
                      <th>Actions</th>
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
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <p className="mt-2">Loading subtopics...</p>
                        </td>
                      </tr>
                    ) : sorted.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="empty-state">
                          <img
                            src={empty || "/placeholder.svg"}
                            alt="No subtopics"
                            width="200px"
                          />
                          <h4>No Subtopics Found</h4>
                          <p className="text-muted">
                            {searchTerm || statusFilter || topicFilter
                              ? "Try adjusting your search or filter criteria"
                              : "Start by adding your first subtopic"}
                          </p>
                          <Link
                            to="/subtopics/add"
                            className="btn-add-question mt-3"
                          >
                            <FontAwesomeIcon icon={faPlus} className="me-2" />
                            Add Subtopic
                          </Link>
                        </td>
                      </tr>
                    ) : (
                      sorted.map((sub, i) => (
                        <tr key={sub?._id}>
                          <td>{(pageNumber - 1) * perPage + i + 1}</td>
                          <td>
                            <div className="subject-name fw-bold">
                              {sub?.sub_topic_name || "N/A"}
                            </div>
                            <div className="text-muted small mt-1">
                              {sub?.subTopicCode || "N/A"}
                            </div>
                          </td>
                          <td>
                            <span className="subject-badge">
                              {sub?.topic_id?.name ||
                                sub?.topic_id?.topic_name ||
                                "N/A"}
                            </span>
                          </td>
                          <td>
                            <span className="subject-badge">
                              {sub?.subject_id?.name ||
                                sub?.subject_id?.subject_name ||
                                "N/A"}
                            </span>
                          </td>
                          <td>
                            <span className="date-text">
                              {formatDate(sub?.createdAt)}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => handleStatus(sub?._id)}
                              className={`status-badge ${
                                sub?.status === "active"
                                  ? "status-active"
                                  : "status-inactive"
                              }`}
                            >
                              <FontAwesomeIcon
                                icon={
                                  sub?.status === "active" ? faCheck : faTimes
                                }
                                className="me-1"
                              />
                              {sub?.status === "active" ? "Active" : "Inactive"}
                            </button>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <Link
                                to={`edit/${sub?._id}`}
                                className="action-btn edit-btn"
                                title="Edit"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                                <span className="tooltip-text">Edit</span>
                              </Link>
                              <button
                                onClick={() => handleDelete(sub?._id)}
                                className="action-btn delete-btn"
                                title="Delete"
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
                {!loading && sorted.length > 0 && (
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
                
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    border-radius: 50%;
                    border-top: 4px solid #667eea;
                    animation: spin 1s linear infinite;
                    margin: 40px auto;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
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
                     .subject-badge {
                    background-color: #e3f2fd;
                    color: #0d6efd;
                    padding: 5px 10px;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 500;
                }
            `}</style>
    </section>
  );
}
