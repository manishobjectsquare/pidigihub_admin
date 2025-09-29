import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl";
import empty from "../../assets/images/empty-box.png";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faPlus,
  faEdit,
  faTrash,
  faCheck,
  faTimes,
  faSearch,
  faEye,
  faFileDownload,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Pagination from "../../Component/Pagination/Pagination";

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [pageNumber, setPageNumber] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [pageInfo, setPageInfo] = useState({
    total: 1,
    perPage: 15,
    currentPage: 1,
    totalPages: 1,
  });

  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm, statusFilter, sortOrder, perPage]);

  useEffect(() => {
    fetchData();
  }, [pageNumber, perPage, searchTerm, statusFilter, sortOrder]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/admin/package`, {
        headers: { Authorization: localStorage.getItem("token") },
        params: {
          page: pageNumber,
          limit: perPage,
          search: searchTerm,
          status: statusFilter,
          sort: sortOrder,
        },
      });

      if (response?.data?.status) {
        setPackages(response.data.data || []);
        setPageInfo(response.data.pageInfo);
      } else {
        toast.error(response?.data?.message || "Failed to fetch packages");
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Failed to fetch packages");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      setLoading(true);
      const response = await axios.patch(
        `${baseUrl}/admin/package/package/${id}`,
        { status: newStatus },
        { headers: { Authorization: localStorage.getItem("token") } }
      );

      if (response?.data?.status) {
        setPackages((prev) =>
          prev.map((pkg) =>
            pkg._id === id ? { ...pkg, status: newStatus } : pkg
          )
        );
        toast.success("Status updated");
      } else {
        toast.error(response?.data?.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Status change error:", error);
      toast.error("Error updating status");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePackage = async (id) => {
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
        setLoading(true);
        const response = await axios.delete(
          `${baseUrl}/admin/package/package/${id}`,
          { headers: { Authorization: localStorage.getItem("token") } }
        );

        if (response?.data?.status) {
          setPackages((prev) => prev.filter((pkg) => pkg._id !== id));
          toast.success("Package deleted successfully");
        } else {
          toast.error(response?.data?.message || "Failed to delete package");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Error deleting package");
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <section className="main-sec">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6">
              <div className="dashboard-title">
                <h4 className="dash-head">
                  <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                  Packages
                </h4>
              </div>
              <div className="custom-bredcump">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Packages
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="col-lg-6 d-flex justify-content-end align-items-start">
              <Link to="create" className="btn-add-question">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Package
              </Link>
              <Link
                to={`${baseUrl}/admin/package/excel/download?search=${searchTerm}&status=${statusFilter}&sort=${sortOrder}`}
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
                        Exams List ({pageInfo.total})
                      </h5>
                    </div>
                  </div>
                </div>
                <div className="custom-search-filter mb-4">
                  <div className="row gy-3 gx-md-3 gx-2 align-items-center">
                    {/* Search Input */}
                    <div className="col-12 col-md-6 col-lg-4">
                      <div className="position-relative">
                        <FontAwesomeIcon
                          icon={faSearch}
                          className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                        />
                        <input
                          type="text"
                          className="form-control ps-5"
                          placeholder="Search Packages..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Status Filter */}
                    <div className="col-12 col-md-6 col-lg-4">
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

                    {/* Sort Order Filter */}
                    <div className="col-12 col-md-6 col-lg-4">
                      <select
                        className="form-select"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                      >
                        <option value="default">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="a-z">Name (A-Z)</option>
                        <option value="z-a">Name (Z-A)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="table-responsive custom-table">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Code</th>
                        <th>Package Title</th>
                        <th>Duration</th>
                        <th>Price</th>
                        <th>Exams</th>
                        <th>Status</th>
                        <th>Created Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="8" className="loading-spinner">
                            <div
                              className="spinner-border text-primary"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                            <p className="mt-2">Loading packages...</p>
                          </td>
                        </tr>
                      ) : packages.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="empty-state text-center">
                            <img
                              src={empty || "/placeholder.svg"}
                              alt="No packages"
                              width="200px"
                            />
                            <h4>No Packages found!</h4>
                            <p className="text-muted">
                              {searchTerm || statusFilter
                                ? "Try adjusting your search or filter criteria"
                                : "Start by adding your first package"}
                            </p>
                            <Link to="create" className="btn-add-question mt-3">
                              <FontAwesomeIcon icon={faPlus} className="me-2" />
                              Add Package
                            </Link>
                          </td>
                        </tr>
                      ) : (
                        packages.map((pkg, i) => (
                          <tr key={pkg._id}>
                            <td>{(pageNumber - 1) * perPage + i + 1}</td>
                            <td>{pkg?.packageCode}</td>
                            <td>{pkg.title || "N/A"}</td>
                            <td>{pkg.duration || "N/A"}</td>
                            <td>₹ {pkg.price || 0}</td>
                            <td className="d-flex justify-content-center align-items-center">
                              {/* {pkg.exams?.length || 0} */}
                              <Link
                                to={`exams/${pkg._id}`}
                                className="action-btn view-btn"
                                title="View Package"
                              >
                                {pkg.exams?.length || 0}
                                <span className="tooltip-text">View Exams</span>
                              </Link>
                            </td>
                            <td>
                              <button
                                onClick={() =>
                                  handleStatusChange(pkg?._id, pkg?.status)
                                }
                                className={`status-badge ${
                                  pkg.status === "active"
                                    ? "status-active"
                                    : "status-inactive"
                                }`}
                                disabled={loading}
                              >
                                <FontAwesomeIcon
                                  icon={
                                    pkg.status === "active" ? faCheck : faTimes
                                  }
                                  className="me-1"
                                />
                                {pkg.status === "active"
                                  ? "Active"
                                  : "Inactive"}
                              </button>
                            </td>

                            <td>{formatDate(pkg.createdAt)}</td>
                            <td>
                              <div className="action-buttons">
                                <Link
                                  to={`/packages/view/${pkg._id}`}
                                  className="action-btn view-btn"
                                  title="View Package"
                                >
                                  <FontAwesomeIcon icon={faEye} />
                                  <span className="tooltip-text">View</span>
                                </Link>
                                <Link
                                  to={`/packages/edit/${pkg._id}`}
                                  className="action-btn edit-btn"
                                  title="Edit Package"
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                  <span className="tooltip-text">Edit</span>
                                </Link>
                                <button
                                  className="action-btn delete-btn"
                                  title="Delete Package"
                                  onClick={() => handleDeletePackage(pkg._id)}
                                  disabled={loading}
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
                  {/* {!loading && sortedPackages.length > 0 && (
                                        <Pagination
                                            pageNumber={pageNumber}
                                            totalPages={pageInfo.totalPages}
                                            setPageNumber={setPageNumber}
                                            pageLimit={pageInfo.total}
                                            perPage={perPage}
                                        />
                                    )} */}
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
            `}</style>
    </>
  );
}
// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { baseUrl } from "../../config/baseUrl";
// import empty from "../../assets/images/empty-box.png";
// import Swal from "sweetalert2";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faGraduationCap,
//   faPlus,
//   faEdit,
//   faTrash,
//   faCheck,
//   faTimes,
//   faSearch,
//   faEye,
//   faFileDownload,
// } from "@fortawesome/free-solid-svg-icons";
// import { toast } from "react-toastify";
// import Pagination from "../../Component/Pagination/Pagination";

// export default function Packages() {
//   const [packages, setPackages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [sortOrder, setSortOrder] = useState("newest");
//   const [pageNumber, setPageNumber] = useState(1);
//   const [perPage, setPerPage] = useState(15);
//   const [pageInfo, setPageInfo] = useState({
//     total: 1,
//     perPage: 15,
//     currentPage: 1,
//     totalPages: 1,
//   });

//   useEffect(() => {
//     fetchData();
//   }, [pageNumber, perPage, searchTerm, statusFilter, sortOrder]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${baseUrl}/admin/package`, {
//         headers: { Authorization: localStorage.getItem("token") },
//         params: {
//           page: pageNumber,
//           limit: perPage,
//           search: searchTerm,
//           status: statusFilter,
//           sort: sortOrder,
//         },
//       });

//       if (response?.data?.status) {
//         setPackages(response.data.data || []);
//         setPageInfo(response.data.pageInfo);
//       } else {
//         toast.error(response?.data?.message || "Failed to fetch packages");
//       }
//     } catch (error) {
//       console.error("Error fetching packages:", error);
//       toast.error("Failed to fetch packages");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusChange = async (id, currentStatus) => {
//     const newStatus = currentStatus === "active" ? "inactive" : "active";
//     try {
//       setLoading(true);
//       const response = await axios.patch(
//         `${baseUrl}/admin/package/package/${id}`,
//         { status: newStatus },
//         { headers: { Authorization: localStorage.getItem("token") } }
//       );

//       if (response?.data?.status) {
//         setPackages((prev) =>
//           prev.map((pkg) =>
//             pkg._id === id ? { ...pkg, status: newStatus } : pkg
//           )
//         );
//         toast.success("Status updated");
//       } else {
//         toast.error(response?.data?.message || "Failed to update status");
//       }
//     } catch (error) {
//       console.error("Status change error:", error);
//       toast.error("Error updating status");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeletePackage = async (id) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",
//     });

//     if (result.isConfirmed) {
//       try {
//         setLoading(true);
//         const response = await axios.delete(
//           `${baseUrl}/admin/package/package/${id}`,
//           { headers: { Authorization: localStorage.getItem("token") } }
//         );

//         if (response?.data?.status) {
//           setPackages((prev) => prev.filter((pkg) => pkg._id !== id));
//           toast.success("Package deleted successfully");
//         } else {
//           toast.error(response?.data?.message || "Failed to delete package");
//         }
//       } catch (error) {
//         console.error("Delete error:", error);
//         toast.error("Error deleting package");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   return (
//     <section className="main-sec">
//       <div className="container-fluid">
//         <div className="row">
//           <div className="col-lg-6">
//             <div className="dashboard-title">
//               <h4 className="dash-head">
//                 <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
//                 Packages
//               </h4>
//             </div>
//           </div>
//           <div className="col-lg-6 d-flex justify-content-end">
//             <Link to="create" className="btn-add-question">
//               <FontAwesomeIcon icon={faPlus} className="me-2" />
//               Add Package
//             </Link>
//             <Link
//               to={`${baseUrl}/admin/package/excel/download`}
//               target="_blank"
//               className="ms-2 btn-add-question"
//             >
//               <FontAwesomeIcon icon={faFileDownload} className="me-2" />
//               Export Csv
//             </Link>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="custom-search-filter mb-4">
//           <div className="row gy-3 gx-md-3 gx-2 align-items-center">
//             <div className="col-12 col-md-6 col-lg-4">
//               <div className="position-relative">
//                 <FontAwesomeIcon
//                   icon={faSearch}
//                   className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
//                 />
//                 <input
//                   type="text"
//                   className="form-control ps-5"
//                   placeholder="Search Packages..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>
//             <div className="col-12 col-md-6 col-lg-4">
//               <select
//                 className="form-select"
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option value="">All Status</option>
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>
//             <div className="col-12 col-md-6 col-lg-4">
//               <select
//                 className="form-select"
//                 value={sortOrder}
//                 onChange={(e) => setSortOrder(e.target.value)}
//               >
//                 <option value="newest">Newest First</option>
//                 <option value="oldest">Oldest First</option>
//                 <option value="name-asc">Name (A-Z)</option>
//                 <option value="name-desc">Name (Z-A)</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="table-responsive custom-table">
//           <table className="table table-borderless">
//             <thead>
//               <tr>
//                 <th>S.No</th>
//                 <th>Code</th>
//                 <th>Package Title</th>
//                 <th>Duration</th>
//                 <th>Price</th>
//                 <th>Exams</th>
//                 <th>Status</th>
//                 <th>Created Date</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan="9" className="text-center">
//                     Loading...
//                   </td>
//                 </tr>
//               ) : packages.length === 0 ? (
//                 <tr>
//                   <td colSpan="9" className="empty-state text-center">
//                     <img src={empty} alt="No packages" width="200px" />
//                     <h4>No Packages found!</h4>
//                   </td>
//                 </tr>
//               ) : (
//                 packages.map((pkg, i) => (
//                   <tr key={pkg._id}>
//                     <td>{(pageNumber - 1) * perPage + i + 1}</td>
//                     <td>{pkg?.packageCode}</td>
//                     <td>{pkg.title || "N/A"}</td>
//                     <td>{pkg.duration || "N/A"}</td>
//                     <td>₹ {pkg.price || 0}</td>
//                     <td>
//                       <Link
//                         to={`exams/${pkg._id}`}
//                         className="action-btn view-btn"
//                       >
//                         {pkg.exams?.length || 0}
//                       </Link>
//                     </td>
//                     <td>
//                       <button
//                         onClick={() =>
//                           handleStatusChange(pkg._id, pkg.status)
//                         }
//                         className={`status-badge ${pkg.status === "active"
//                             ? "status-active"
//                             : "status-inactive"
//                           }`}
//                         disabled={loading}
//                       >
//                         <FontAwesomeIcon
//                           icon={pkg.status === "active" ? faCheck : faTimes}
//                           className="me-1"
//                         />
//                         {pkg.status === "active" ? "Active" : "Inactive"}
//                       </button>
//                     </td>
//                     <td>{formatDate(pkg.createdAt)}</td>
//                     <td>
//                       <div className="action-buttons">
//                         <Link
//                           to={`/packages/view/${pkg._id}`}
//                           className="action-btn view-btn"
//                         >
//                           <FontAwesomeIcon icon={faEye} />
//                         </Link>
//                         <Link
//                           to={`/packages/edit/${pkg._id}`}
//                           className="action-btn edit-btn"
//                         >
//                           <FontAwesomeIcon icon={faEdit} />
//                         </Link>
//                         <button
//                           className="action-btn delete-btn"
//                           onClick={() => handleDeletePackage(pkg._id)}
//                           disabled={loading}
//                         >
//                           <FontAwesomeIcon icon={faTrash} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>

//           {/* Pagination */}
//           {!loading && packages.length > 0 && (
//             <Pagination
//               pageNumber={pageNumber}
//               totalPages={pageInfo.totalPages}
//               setPageNumber={setPageNumber}
//               pageLimit={pageInfo.total}
//               perPage={perPage}
//               setPerPage={setPerPage}
//             />
//           )}
//         </div>
//       </div>
//       <style>{`
//                 .status-badge {
//                     border: none;
//                     padding: 6px 12px;
//                     border-radius: 20px;
//                     font-size: 0.85rem;
//                     font-weight: 500;
//                     cursor: pointer;
//                     transition: all 0.3s ease;
//                 }

//                 .status-active {
//                     background-color: #d1e7dd;
//                     color: #0f5132;
//                 }

//                 .status-inactive {
//                     background-color: #f8d7da;
//                     color: #842029;
//                 }

//                 .action-buttons {
//                     display: flex;
//                     gap: 10px;
//                 }

//                 .action-btn {
//                     width: 32px;
//                     height: 32px;
//                     border-radius: 50%;
//                     display: flex;
//                     align-items: center;
//                     justify-content: center;
//                     border: none;
//                     cursor: pointer;
//                     position: relative;
//                     transition: all 0.3s ease;
//                 }

//                 .edit-btn {
//                     background-color: #e3f2fd;
//                     color: #0d6efd;
//                 }

//                 .edit-btn:hover {
//                     background-color: #0d6efd;
//                     color: white;
//                 }

//                 .delete-btn {
//                     background-color: #f8d7da;
//                     color: #dc3545;
//                 }

//                 .delete-btn:hover {
//                     background-color: #dc3545;
//                     color: white;
//                 }

//                 .tooltip-text {
//                     position: absolute;
//                     top: -30px;
//                     left: 50%;
//                     transform: translateX(-50%);
//                     background-color: #333;
//                     color: white;
//                     padding: 4px 8px;
//                     border-radius: 4px;
//                     font-size: 12px;
//                     white-space: nowrap;
//                     opacity: 0;
//                     visibility: hidden;
//                     transition: all 0.3s ease;
//                 }

//                 .action-btn:hover .tooltip-text {
//                     opacity: 1;
//                     visibility: visible;
//                 }

//                 .empty-state {
//                     text-align: center;
//                     padding: 40px 20px;
//                 }

//                 .empty-state img {
//                     margin-bottom: 20px;
//                 }

//                 .empty-state h4 {
//                     margin-bottom: 10px;
//                     color: #333;
//                 }

//                 .spinner {
//                     width: 40px;
//                     height: 40px;
//                     border: 4px solid rgba(0, 0, 0, 0.1);
//                     border-radius: 50%;
//                     border-top: 4px solid #667eea;
//                     animation: spin 1s linear infinite;
//                     margin: 40px auto;
//                 }

//                 @keyframes spin {
//                     0% { transform: rotate(0deg); }
//                     100% { transform: rotate(360deg); }
//                 }

//                 .btn-add-question {
//                     background: #008080;
//                     color: white;
//                     border: none;
//                     padding: 10px 20px;
//                     border-radius: 5px;
//                     font-weight: 500;
//                     display: inline-flex;
//                     align-items: center;
//                     text-decoration: none;
//                     transition: all 0.3s ease;
//                 }

//                 .btn-add-question:hover {
//                     transform: translateY(-2px);
//                     box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
//                     color: white;
//                 }
//             `}</style>
//     </section>
//   );
// }
