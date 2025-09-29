import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
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

export default function Library() {
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [pageNumber, setPageNumber] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [pageInfo, setPageInfo] = useState({
    total: 1,
    perPage: 10,
    currentPage: 1,
    totalPages: 1,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchLibraries();
  }, [pageNumber, searchTerm, statusFilter, cityFilter, areaFilter, sortOrder]);
  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm, statusFilter, cityFilter, areaFilter, sortOrder]);

  const fetchLibraries = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${baseUrl}/library?page=${pageNumber}&limit=${perPage}&search=${searchTerm}&sort=${sortOrder}&status=${statusFilter}&city=${cityFilter}&area=${areaFilter}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      if (data.status && data.data) {
        setLibraries(data.data);
        setPageInfo({
          total: data.pageInfo?.total || data.data.length,
          perPage: perPage,
          currentPage: data.pageInfo?.currentPage || pageNumber,
          totalPages:
            data.pageInfo?.totalPages || Math.ceil(data.data.length / perPage),
        });
      } else {
        toast.error("Failed to fetch libraries");
      }
    } catch (error) {
      console.error("Error fetching libraries:", error);
      toast.error("Failed to fetch libraries");
    } finally {
      setLoading(false);
    }
  };

  // Handle perPage change
  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setPageNumber(1); // Reset to first page when changing perPage
  };

  const handleStatusToggle = async (libraryId, currentStatus) => {
    try {
      const response = await fetch(`${baseUrl}/library/status/${libraryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      if (data.status) {
        setLibraries((prevLibraries) =>
          prevLibraries.map((library) =>
            library._id === libraryId
              ? { ...library, status: !currentStatus }
              : library
          )
        );
        toast.success(
          `Library ${!currentStatus ? "activated" : "deactivated"} successfully`
        );
      } else {
        toast.error(data.message || "Failed to update library status");
      }
    } catch (error) {
      console.error("Error updating library status:", error);
      toast.error("Failed to update library status");
    }
  };

  const handleDelete = async (libraryId) => {
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
        const response = await fetch(`${baseUrl}/library/${libraryId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();
        if (data.status) {
          // Update local state instead of refetching
          const updatedLibraries = libraries.filter(
            (library) => library._id !== libraryId
          );
          setLibraries(updatedLibraries);
          // Update page info
          setPageInfo((prev) => ({
            ...prev,
            total: prev.total - 1,
          }));
          toast.success("Library deleted successfully");
          // If current page becomes empty and it's not the first page, go to previous page
          if (updatedLibraries.length === 0 && pageNumber > 1) {
            setPageNumber(pageNumber - 1);
          }
        } else {
          toast.error(data.message || "Failed to delete library");
        }
      } catch (error) {
        console.error("Error deleting library:", error);
        toast.error("Failed to delete library");
      }
    }
  };
  const handleExport = async () => {
    try {
      const response = await fetch(`${baseUrl}/library/excel/get`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "libraries.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Exported Successfully!");
    } catch (error) {
      toast.error("Failed to Export");
      console.error("Library Export Error:", error);
    }
  };

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

  const getLibraryPrice = (slots) => {
    if (slots && slots.length > 0) {
      return slots[0].libraryPrice || 0;
    }
    return 0;
  };

  // if (loading) {
  //   return (
  //     <section className="main-sec">
  //       <div className="container">
  //         <div className="row">
  //           <div className="col-lg-12">
  //             <div className="cards">
  //               <div className="text-center py-5">
  //                 <div className="spinner-border text-primary" role="status">
  //                   <span className="visually-hidden">Loading...</span>
  //                 </div>
  //                 <p className="mt-3">Loading libraries...</p>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </section>
  //   );
  // }

  return (
    <>
      <section className="main-sec">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6">
              <div className="dashboard-title">
                <h4 className="dash-head">
                  <FontAwesomeIcon icon={faBook} className="me-2" />
                  Library Listing
                </h4>
              </div>
              <div className="custom-bredcump">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Library Listing
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="col-lg-6 d-flex justify-content-end align-items-start gap-2">
              <button onClick={handleExport} className="btn-add-question">
                <FontAwesomeIcon icon={faDownload} className="me-2" />
                Export Libraries
              </button>
              <Link to="/library/add" className="btn-add-question">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Library
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
                        Libraries List ({pageInfo.total})
                      </h5>
                    </div>
                  </div>
                </div>

                <div className="library-filters">
                  <div className="filter-item">
                    <div className="search-wrapper">
                      <FontAwesomeIcon
                        icon={faSearch}
                        className="search-icon"
                      />
                      <input
                        type="text"
                        className="filter-input"
                        placeholder="Search Libraries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="filter-item">
                    <select
                      className="filter-input"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>

                  <div className="filter-item">
                    <input
                      type="text"
                      className="filter-input"
                      placeholder="Area"
                      value={areaFilter}
                      onChange={(e) => setAreaFilter(e.target.value)}
                    />
                  </div>

                  <div className="filter-item">
                    <input
                      type="text"
                      className="filter-input"
                      placeholder="City"
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                    />
                  </div>

                  <div className="filter-item">
                    <select
                      className="filter-input"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="name-asc">Name (A-Z)</option>
                      <option value="name-desc">Name (Z-A)</option>
                    </select>
                  </div>
                </div>

                <div className="table-responsive custom-table">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Library Name</th>
                        <th>Area / City</th>
                        <th>Library Slots</th>
                        <th>Created Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="9" className="loading-spinner">
                            <div
                              className="spinner-border text-primary"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                            <p className="mt-2">Loading libraries...</p>
                          </td>
                        </tr>
                      ) : libraries.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="empty-state">
                            <img
                              src={empty || "/placeholder.svg"}
                              alt="No libraries"
                              width="200px"
                            />
                            <h4>No Libraries Found</h4>
                            <p className="text-muted">
                              {searchTerm ||
                              statusFilter ||
                              areaFilter ||
                              cityFilter
                                ? "Try adjusting your search or filter criteria"
                                : "Start by adding your first library"}
                            </p>
                            <Link
                              to="/library/add"
                              className="btn-add-question mt-3"
                            >
                              <FontAwesomeIcon icon={faPlus} className="me-2" />
                              Add Library
                            </Link>
                          </td>
                        </tr>
                      ) : (
                        libraries.map((library, index) => (
                          <tr key={library._id}>
                            <td>{(pageNumber - 1) * perPage + index + 1}</td>
                            <td>
                              <div className="library-name fw-bold">
                                {library.libraryName}
                              </div>
                              <small className="text-muted">
                                {library?.libraryCode || "N/A"}
                              </small>
                            </td>
                            <td>
                              <div className=" ">{library.area}</div>
                              <span>{library.pinCode}</span>
                              <div className="subject-badge mt-1  ">
                                {library.city}
                              </div>
                            </td>
                            <td>{library?.slots?.length}</td>
                            <td>
                              <span className="date-text">
                                {formatDate(library.createdAt)}
                              </span>
                            </td>
                            <td>
                              <button
                                onClick={() =>
                                  handleStatusToggle(
                                    library._id,
                                    library.status
                                  )
                                }
                                className={`status-badge ${
                                  library.status
                                    ? "status-active"
                                    : "status-inactive"
                                }`}
                              >
                                <FontAwesomeIcon
                                  icon={library.status ? faCheck : faTimes}
                                  className="me-1"
                                />
                                {library.status ? "Active" : "Inactive"}
                              </button>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="action-btn view-btn"
                                  title="View"
                                  onClick={() =>
                                    navigate(`view/${library?._id}`)
                                  }
                                >
                                  <FontAwesomeIcon icon={faEye} />
                                  <span className="tooltip-text">View</span>
                                </button>
                                <button
                                  className="action-btn edit-btn"
                                  title="Edit"
                                  onClick={() =>
                                    navigate(`edit/${library?._id}`)
                                  }
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                  <span className="tooltip-text">Edit</span>
                                </button>
                                {/* <button
                                                                    className="action-btn delete-btn"
                                                                    title="Delete"
                                                                    onClick={() => handleDelete(library._id)}
                                                                >
                                                                    <FontAwesomeIcon icon={faTrash} />
                                                                    <span className="tooltip-text">Delete</span>
                                                                </button> */}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  {/* Pagination Component */}
                  {!loading && libraries.length > 0 && (
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
        

        
        .status-active {
          background-color: #d1e7dd;
          color: #0f5132;
        }
        
        .status-inactive {
          background-color: #f8d7da;
          color: #842029;
        }

        .subject-badge {
          background-color: #e3f2fd;
          color: #1976d2;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
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

        .library-name {
          color: #333;
          font-size: 0.95rem;
        }

        .date-text {
          font-size: 0.85rem;
          color: #6c757d;
        }
          /* Filters Container */
.library-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

/* Each Filter Block */
.filter-item {
  flex: 1 1 calc(20% - 1rem); /* 5 items per row on large screens */
  min-width: 200px;
}

/* Input Styling */
.filter-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

/* Search Input with Icon */
.search-wrapper {
  position: relative;
}

.search-wrapper .search-icon {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: #aaa;
  font-size: 14px;
}

.search-wrapper input {
  padding-left: 36px;
}

/* Responsive Breakpoints */
@media (max-width: 1400px) {
  .filter-item {
    flex: 1 1 calc(25% - 1rem); /* 4 per row */
  }
}

@media (max-width: 992px) {
  .filter-item {
    flex: 1 1 calc(33.33% - 1rem); /* 3 per row */
  }
}

@media (max-width: 768px) {
  .filter-item {
    flex: 1 1 calc(50% - 1rem); /* 2 per row */
  }
}

@media (max-width: 576px) {
  .filter-item {
    flex: 1 1 100%; /* Full width per row */
  }
}

      `}</style>
    </>
  );
}
