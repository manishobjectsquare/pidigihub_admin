// import { useState, useEffect } from "react"
// import { Link } from "react-router-dom"
// import axios from "axios"
// import { baseUrl } from "../../config/baseUrl"
// import empty from "../../assets/images/empty-box.png"
// import Swal from "sweetalert2"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import {
//     faGraduationCap,
//     faPlus,
//     faEdit,
//     faTrash,
//     faCheck,
//     faTimes,
//     faSearch,
//     faEye,
//     faFileDownload,
// } from "@fortawesome/free-solid-svg-icons"
// import { toast } from "react-toastify"
// import Pagination from "../../Component/Pagination/Pagination"

// export default function Exams() {
//     const [exams, setExams] = useState([])
//     const [loading, setLoading] = useState(false)
//     const [searchTerm, setSearchTerm] = useState("")
//     const [statusFilter, setStatusFilter] = useState("")
//     const [sortOrder, setSortOrder] = useState("newest")
//     const [pageNumber, setPageNumber] = useState(1)
//     const [perPage, setPerPage] = useState(15)
//     const [pageInfo, setPageInfo] = useState({ total: 1, perPage: 10, currentPage: 1, totalPages: 1 })

//     useEffect(() => {
//         fetchData()
//     }, [pageNumber, perPage, searchTerm, statusFilter, sortOrder])

//     const fetchData = async () => {
//         try {
//             setLoading(true)
//             const response = await axios.get(`${baseUrl}/exams`, {
//                 headers: {
//                     Authorization: localStorage.getItem("token"),
//                 },
//                 params: {
//                     page: pageNumber,
//                     limit: perPage,
//                     search: searchTerm,
//                     status: statusFilter,
//                     sort: sortOrder,
//                 },
//             })

//             if (response?.data?.status) {
//                 setExams(response?.data?.combinedData || [])
//                 setPageInfo({
//                     total: response?.data?.pageInfo?.total || 0,
//                     perPage: perPage,
//                     currentPage: response?.data?.pageInfo?.currentPage || pageNumber,
//                     totalPages: response?.data?.pageInfo?.totalPages || 1,
//                 })
//             } else {
//                 toast.error(response?.data?.message || "Failed to fetch exams")
//             }
//         } catch (error) {
//             console.error("Error fetching exams:", error)
//             toast.error("Failed to fetch exams")
//         } finally {
//             setLoading(false)
//         }
//     }

//     // Handle perPage change
//     const handlePerPageChange = (newPerPage) => {
//         setPerPage(newPerPage)
//         setPageNumber(1) // Reset to first page when changing perPage
//     }

//     // Filter exams based on search term and status
//     const filteredExams = exams.filter((exam) => {
//         const examName = exam?.exam_title || exam?.name || ""
//         const matchesSearch = examName.toLowerCase().includes(searchTerm.toLowerCase())
//         const matchesStatus = statusFilter === "" || exam?.status === statusFilter
//         return matchesSearch && matchesStatus
//     })

//     // Sort exams based on sort order
//     const sortedExams = [...filteredExams].sort((a, b) => {
//         if (sortOrder === "newest") {
//             return new Date(b?.createdAt) - new Date(a?.createdAt)
//         } else if (sortOrder === "oldest") {
//             return new Date(a?.createdAt) - new Date(b?.createdAt)
//         } else if (sortOrder === "name-asc") {
//             const nameA = a?.exam_title || a?.name || ""
//             const nameB = b?.exam_title || b?.name || ""
//             return nameA.localeCompare(nameB)
//         } else if (sortOrder === "name-desc") {
//             const nameA = a?.exam_title || a?.name || ""
//             const nameB = b?.exam_title || b?.name || ""
//             return nameB.localeCompare(nameA)
//         }
//         return 0
//     })

//     const handleStatus = async (id) => {
//         try {
//             const exam = exams.find((e) => e._id === id)
//             if (!exam) return

//             const newStatus = exam.status === "active" ? "inactive" : "active"

//             const response = await axios.patch(
//                 `${baseUrl}/exams/status/${id}`,
//                 { status: newStatus },
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: localStorage.getItem("token"),
//                     },
//                 },
//             )

//             if (response?.data?.status) {
//                 // Update local state immediately
//                 setExams((prevExams) => prevExams.map((exam) => (exam._id === id ? { ...exam, status: newStatus } : exam)))
//                 toast.success(`Exam ${newStatus === "active" ? "activated" : "deactivated"} successfully`)
//             } else {
//                 toast.error(response?.data?.message || "Failed to update status")
//             }
//         } catch (error) {
//             console.error("Error updating status:", error)
//             toast.error("Failed to update status")
//         }
//     }

//     const handleDelete = async (id) => {
//         const result = await Swal.fire({
//             title: "Are you sure?",
//             text: "You won't be able to revert this!",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonColor: "#d33",
//             cancelButtonColor: "#3085d6",
//             confirmButtonText: "Yes, delete it!",
//         })

//         if (result.isConfirmed) {
//             try {
//                 const response = await axios.delete(`${baseUrl}/exams/${id}`, {
//                     headers: {
//                         Authorization: localStorage.getItem("token"),
//                     },
//                 })

//                 if (response?.data?.status) {
//                     // Update local state immediately
//                     const updatedExams = exams.filter((exam) => exam._id !== id)
//                     setExams(updatedExams)
//                     // Update page info
//                     setPageInfo((prev) => ({
//                         ...prev,
//                         total: prev.total - 1,
//                     }))
//                     toast.success("Exam deleted successfully")
//                     // If current page becomes empty and it's not the first page, go to previous page
//                     if (updatedExams.length === 0 && pageNumber > 1) {
//                         setPageNumber(pageNumber - 1)
//                     }
//                 } else {
//                     toast.error(response?.data?.message || "Failed to delete exam")
//                 }
//             } catch (error) {
//                 console.error("Error deleting exam:", error)
//                 toast.error("Failed to delete exam")
//             }
//         }
//     }
//     // Format date for display
//     const formatDate = (dateString) => {
//         if (!dateString) return "N/A"
//         const date = new Date(dateString)
//         return date.toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "short",
//             day: "numeric",
//         })
//     }

//     return (
//         <>
//             <section className="main-sec">
//                 <div className="container-fluid">
//                     <div className="row">
//                         <div className="col-lg-6">
//                             <div className="dashboard-title">
//                                 <h4 className="dash-head">
//                                     <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
//                                     Exams
//                                 </h4>
//                             </div>
//                             <div className="custom-bredcump">
//                                 <nav aria-label="breadcrumb">
//                                     <ol className="breadcrumb">
//                                         <li className="breadcrumb-item">
//                                             <Link to="/">Dashboard</Link>
//                                         </li>
//                                         <li className="breadcrumb-item active" aria-current="page">
//                                             Exams
//                                         </li>
//                                     </ol>
//                                 </nav>
//                             </div>
//                         </div>
//                         <div className="col-lg-6 d-flex justify-content-end align-items-start">
//                             <Link to="create" className="btn-add-question">
//                                 <FontAwesomeIcon icon={faPlus} className="me-2" />
//                                 Add Exam
//                             </Link>
//                             <Link to={`${baseUrl}/exams/excel/download`} target="_blank" className="ms-2 btn-add-question">
//                                 <FontAwesomeIcon icon={faFileDownload} className="me-2" />
//                                 Export Csv
//                             </Link>
//                         </div>
//                     </div>
//                     <div className="row">
//                         <div className="col-lg-12">
//                             <div className="cards bus-list">
//                                 <div className="bus-filter">
//                                     <div className="row align-items-center">
//                                         <div className="col-lg-6">
//                                             <h5 className="card-title">Exams List ({pageInfo.total})</h5>
//                                         </div>

//                                     </div>
//                                 </div>
//                                 <div className="custom-search-filter mb-4">
//                                     <div className="row gy-3 gx-md-3 gx-2 align-items-center">

//                                         {/* Search Input */}
//                                         <div className="col-12 col-md-6 col-lg-4">
//                                             <div className="position-relative">
//                                                 <FontAwesomeIcon icon={faSearch} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
//                                                 <input
//                                                     type="text"
//                                                     className="form-control ps-5"
//                                                     placeholder="Search Exams..."
//                                                     value={searchTerm}
//                                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                                 />
//                                             </div>
//                                         </div>

//                                         {/* Status Filter */}
//                                         <div className="col-12 col-md-6 col-lg-4">
//                                             <select
//                                                 className="form-select"
//                                                 value={statusFilter}
//                                                 onChange={(e) => setStatusFilter(e.target.value)}
//                                             >
//                                                 <option value="">All Status</option>
//                                                 <option value="active">Active</option>
//                                                 <option value="inactive">Inactive</option>
//                                             </select>
//                                         </div>

//                                         {/* Sort Order Filter */}
//                                         <div className="col-12 col-md-6 col-lg-4">
//                                             <select
//                                                 className="form-select"
//                                                 value={sortOrder}
//                                                 onChange={(e) => setSortOrder(e.target.value)}
//                                             >
//                                                 <option value="newest">Newest First</option>
//                                                 <option value="oldest">Oldest First</option>
//                                                 <option value="name-asc">Name (A-Z)</option>
//                                                 <option value="name-desc">Name (Z-A)</option>
//                                             </select>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="table-responsive custom-table">
//                                     <table className="table table-borderless">
//                                         <thead>
//                                             <tr>
//                                                 <th>S.No</th>
//                                                 <th>Exam / Year</th>
//                                                 <th>Duration</th>
//                                                 <th>Total Score</th>
//                                                 <th>Packages</th>
//                                                 <th>Questions</th>
//                                                 <th>Status</th>
//                                                 <th>Created Date</th>
//                                                 <th>Action</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {loading ? (
//                                                 <tr>
//                                                     <td colSpan="9" className="loading-spinner">
//                                                         <div className="spinner-border text-primary" role="status">
//                                                             <span className="visually-hidden">Loading...</span>
//                                                         </div>
//                                                         <p className="mt-2">Loading exams...</p>
//                                                     </td>
//                                                 </tr>
//                                             ) : sortedExams.length === 0 ? (
//                                                 <tr>
//                                                     <td colSpan="9" className="empty-state">
//                                                         <img src={empty || "/placeholder.svg"} alt="No exams" width="200px" />
//                                                         <h4>No Exams found!</h4>
//                                                         <p className="text-muted">
//                                                             {searchTerm || statusFilter
//                                                                 ? "Try adjusting your search or filter criteria"
//                                                                 : "Start by adding your first exam"}
//                                                         </p>
//                                                         <Link to="create" className="btn-add-question mt-3">
//                                                             <FontAwesomeIcon icon={faPlus} className="me-2" />
//                                                             Add Exam
//                                                         </Link>
//                                                     </td>
//                                                 </tr>
//                                             ) : (
//                                                 sortedExams.map((exam, i) => (
//                                                     <tr key={exam?._id}>
//                                                         <td>{(pageNumber - 1) * perPage + i + 1}</td>
//                                                         <td>
//                                                             <div className="subject-name ">
//                                                                 {exam?.exam_title || exam?.name || "N/A"}
//                                                                 <br />
//                                                                 {exam?.exam_year || "N/A"}
//                                                             </div>
//                                                         </td>

//                                                         <td>{exam?.duration || 0} min</td>
//                                                         <td>{exam?.total_score || 0}</td>
//                                                         <td>{exam?.packages?.length || 0}</td>
//                                                         <td>
//                                                             <div className="action-buttons">
//                                                                 <Link to={`${exam?._id}/questions`} state={{ title: exam?.exam_title, code: exam?.examCode }} className="action-btn view-btn" title="Edit Exam">
//                                                                     {exam?.ExamQuestionCount}
//                                                                     <span className="tooltip-text">Questions</span>
//                                                                 </Link>
//                                                             </div>
//                                                         </td>
//                                                         <td>
//                                                             <button
//                                                                 onClick={() => handleStatus(exam?._id)}
//                                                                 className={`status-badge ${exam?.status === "active" ? "status-active" : "status-inactive"
//                                                                     }`}
//                                                                 disabled={loading}
//                                                             >
//                                                                 <FontAwesomeIcon
//                                                                     icon={exam?.status === "active" ? faCheck : faTimes}
//                                                                     className="me-1"
//                                                                 />
//                                                                 {exam?.status === "active" ? "Active" : "Inactive"}
//                                                             </button>
//                                                         </td>
//                                                         <td>
//                                                             <span className="date-text">{formatDate(exam?.createdAt)}</span>
//                                                         </td>
//                                                         <td>
//                                                             <div className="action-buttons">
//                                                                 <Link to={`/exams/view/${exam?._id}`} className="action-btn view-btn" title="View Exam">
//                                                                     <FontAwesomeIcon icon={faEye} />
//                                                                     <span className="tooltip-text">View</span>
//                                                                 </Link>
//                                                                 <Link to={`/exams/edit/${exam?._id}`} className="action-btn edit-btn" title="Edit Exam">
//                                                                     <FontAwesomeIcon icon={faEdit} />
//                                                                     <span className="tooltip-text">Edit</span>
//                                                                 </Link>
//                                                                 <button
//                                                                     className="action-btn delete-btn"
//                                                                     onClick={() => handleDelete(exam?._id)}
//                                                                     title="Delete Exam"
//                                                                     disabled={loading}
//                                                                 >
//                                                                     <FontAwesomeIcon icon={faTrash} />
//                                                                     <span className="tooltip-text">Delete</span>
//                                                                 </button>
//                                                             </div>
//                                                         </td>
//                                                     </tr>
//                                                 ))
//                                             )}
//                                         </tbody>
//                                     </table>
//                                     {/* Pagination Component */}
//                                     {!loading && sortedExams.length > 0 && (
//                                         <Pagination
//                                             pageNumber={pageNumber}
//                                             totalPages={pageInfo.totalPages}
//                                             setPageNumber={setPageNumber}
//                                             pageLimit={pageInfo.total}
//                                             perPage={perPage}
//                                         />
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//             <style >{`
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
//         </>
//     )
// }
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

export default function Exams() {
  const [exams, setExams] = useState([]);
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
      const response = await axios.get(`${baseUrl}/exams`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        params: {
          page: pageNumber,
          limit: perPage,
          search: searchTerm,
          status: statusFilter,
          sort: sortOrder,
        },
      });

      if (response?.data?.status) {
        setExams(response?.data?.combinedData || []);
        setPageInfo({
          total: response?.data?.pageInfo?.total || 0,
          perPage: perPage,
          currentPage: response?.data?.pageInfo?.currentPage || pageNumber,
          totalPages: response?.data?.pageInfo?.totalPages || 1,
        });
      } else {
        toast.error(response?.data?.message || "Failed to fetch exams");
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
      toast.error("Failed to fetch exams");
    } finally {
      setLoading(false);
    }
  };

  // Handle perPage change
  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setPageNumber(1); // Reset to first page when changing perPage
  };

  // Reset page number when search/filter/sort changes
  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm, statusFilter, sortOrder]);

  const handleStatus = async (id) => {
    try {
      const exam = exams.find((e) => e._id === id);
      if (!exam) return;

      const newStatus = exam.status === "active" ? "inactive" : "active";

      const response = await axios.patch(
        `${baseUrl}/exams/status/${id}`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response?.data?.status) {
        setExams((prevExams) =>
          prevExams.map((exam) =>
            exam._id === id ? { ...exam, status: newStatus } : exam
          )
        );
        toast.success(
          `Exam ${
            newStatus === "active" ? "activated" : "deactivated"
          } successfully`
        );
      } else {
        toast.error(response?.data?.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
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
        const response = await axios.delete(`${baseUrl}/exams/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        if (response?.data?.status) {
          const updatedExams = exams.filter((exam) => exam._id !== id);
          setExams(updatedExams);
          setPageInfo((prev) => ({
            ...prev,
            total: prev.total - 1,
          }));
          toast.success("Exam deleted successfully");

          if (updatedExams.length === 0 && pageNumber > 1) {
            setPageNumber(pageNumber - 1);
          }
        } else {
          toast.error(response?.data?.message || "Failed to delete exam");
        }
      } catch (error) {
        console.error("Error deleting exam:", error);
        toast.error("Failed to delete exam");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
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
        <div className="container-fluid">
          {/* Top Section */}
          <div className="row">
            <div className="col-lg-6">
              <div className="dashboard-title">
                <h4 className="dash-head">
                  <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                  Exams
                </h4>
              </div>
              <div className="custom-bredcump">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Exams
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="col-lg-6 d-flex justify-content-end align-items-start">
              <Link to="create" className="btn-add-question">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Exam
              </Link>
              <Link
                to={`${baseUrl}/exams/excel/download?search=${searchTerm}&status=${statusFilter}&sort=${sortOrder}`}
                target="_blank"
                className="ms-2 btn-add-question"
              >
                <FontAwesomeIcon icon={faFileDownload} className="me-2" />
                Export Csv
              </Link>
            </div>
          </div>

          {/* Filters */}
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
                    {/* Search */}
                    <div className="col-12 col-md-6 col-lg-4">
                      <div className="position-relative">
                        <FontAwesomeIcon
                          icon={faSearch}
                          className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                        />
                        <input
                          type="text"
                          className="form-control ps-5"
                          placeholder="Search Exams..."
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

                    {/* Sort Order */}
                    <div className="col-12 col-md-6 col-lg-4">
                      <select
                        className="form-select"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="asc">Name (A-Z)</option>
                        <option value="desc">Name (Z-A)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="table-responsive custom-table">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Code</th>
                        <th>Exam / Year</th>
                        <th>Duration</th>
                        <th>Total Score</th>
                        <th>Questions</th>
                        <th>Status</th>
                        <th>Created Date</th>
                        <th>Action</th>
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
                            <p className="mt-2">Loading exams...</p>
                          </td>
                        </tr>
                      ) : exams.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="empty-state">
                            <img
                              src={empty || "/placeholder.svg"}
                              alt="No exams"
                              width="200px"
                            />
                            <h4>No Exams found!</h4>
                            <p className="text-muted">
                              {searchTerm || statusFilter
                                ? "Try adjusting your search or filter criteria"
                                : "Start by adding your first exam"}
                            </p>
                            <Link to="create" className="btn-add-question mt-3">
                              <FontAwesomeIcon icon={faPlus} className="me-2" />
                              Add Exam
                            </Link>
                          </td>
                        </tr>
                      ) : (
                        exams.map((exam, i) => (
                          <tr key={exam?._id}>
                            <td>{(pageNumber - 1) * perPage + i + 1}</td>
                            <td>{exam?.examCode}</td>
                            <td>
                              <div className="subject-name ">
                                {exam?.exam_title || exam?.name || "N/A"}
                                <br />
                                {exam?.exam_year || "N/A"}
                              </div>
                            </td>
                            <td>{exam?.duration || 0} min</td>
                            <td>{exam?.total_score || 0}</td>
                            <td>
                              <div className="action-buttons">
                                <Link
                                  to={`${exam?._id}/questions`}
                                  state={{ title: exam?.exam_title }}
                                  className="action-btn view-btn"
                                  title="Edit Exam"
                                >
                                  {exam?.ExamQuestionCount}
                                  <span className="tooltip-text">
                                    Questions
                                  </span>
                                </Link>
                              </div>
                            </td>
                            <td>
                              <button
                                onClick={() => handleStatus(exam?._id)}
                                className={`status-badge ${
                                  exam?.status === "active"
                                    ? "status-active"
                                    : "status-inactive"
                                }`}
                                disabled={loading}
                              >
                                <FontAwesomeIcon
                                  icon={
                                    exam?.status === "active"
                                      ? faCheck
                                      : faTimes
                                  }
                                  className="me-1"
                                />
                                {exam?.status === "active"
                                  ? "Active"
                                  : "Inactive"}
                              </button>
                            </td>
                            <td>
                              <span className="date-text">
                                {formatDate(exam?.createdAt)}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <Link
                                  to={`/exams/view/${exam?._id}`}
                                  className="action-btn view-btn"
                                  title="View Exam"
                                >
                                  <FontAwesomeIcon icon={faEye} />
                                  <span className="tooltip-text">View</span>
                                </Link>
                                <Link
                                  to={`/exams/edit/${exam?._id}`}
                                  className="action-btn edit-btn"
                                  title="Edit Exam"
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                  <span className="tooltip-text">Edit</span>
                                </Link>
                                <button
                                  className="action-btn delete-btn"
                                  onClick={() => handleDelete(exam?._id)}
                                  title="Delete Exam"
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

                  {/* Pagination */}
                  {!loading && exams.length > 0 && (
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
