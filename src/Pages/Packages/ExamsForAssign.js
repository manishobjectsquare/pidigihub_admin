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
// } from "@fortawesome/free-solid-svg-icons"
// import { toast } from "react-toastify"
// import Pagination from "../../Component/Pagination/Pagination"

// export default function ExamsForAssign() {
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
//     }, [pageNumber, perPage])

//     const fetchData = async () => {
//         try {
//             setLoading(true)
//             const response = await axios.get(`${baseUrl}/exams?page=${pageNumber}&limit=${perPage}`, {
//                 headers: {
//                     Authorization: localStorage.getItem("token"),
//                 },
//             })

//             if (response?.data?.status) {
//                 setExams(response?.data?.combinedData || [])
//                 setPageInfo({
//                     total: response?.data?.pageInfo?.total || response?.data?.data?.length,
//                     perPage: perPage,
//                     currentPage: response?.data?.pageInfo?.currentPage || pageNumber,
//                     totalPages: response?.data?.pageInfo?.totalPages || Math.ceil((response?.data?.data?.length || 0) / perPage),
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
//                                     Assign Exams To Package
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
//                                                 <th>
//                                                     <input type="checkbox" id="" />
//                                                 </th>
//                                                 <th>S.No</th>
//                                                 <th>Exam / Year</th>
//                                                 <th>Duration</th>
//                                                 <th>Total Score</th>
//                                                 <th>Packages</th>
//                                                 <th>Questions</th>
//                                                 <th>Status</th>
//                                                 <th>Created Date</th>
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
//                                                         <Link to="assign-exams" className="btn-add-question mt-3">
//                                                             <FontAwesomeIcon icon={faPlus} className="me-2" />
//                                                             Assign Exam
//                                                         </Link>
//                                                     </td>
//                                                 </tr>
//                                             ) : (
//                                                 sortedExams.map((exam, i) => (
//                                                     <tr key={exam?._id}>
//                                                         <td>
//                                                             <label htmlFor={exam?._id}></label>
//                                                             <input type="checkbox" id={exam?._id} name={exam?._id} />
//                                                         </td>
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
//                                                                 <Link to={`${exam?._id}/questions`} className="action-btn view-btn" title="Edit Exam">
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

//         </>
//     )
// }
"use client";

import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl";
import empty from "../../assets/images/empty-box.png";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faPlus,
  faCheck,
  faTimes,
  faSearch,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Pagination from "../../Component/Pagination/Pagination";

export default function ExamsForAssign() {
  const { id: packageId } = useParams(); // Get package ID from URL params
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Selection states
  const [selectedExams, setSelectedExams] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchData();
  }, [pageNumber, perPage]);

  // Update selectAll state when selectedExams changes
  useEffect(() => {
    const filteredAndSortedExams = getSortedExams();
    setSelectAll(
      filteredAndSortedExams.length > 0 &&
        selectedExams.length === filteredAndSortedExams.length
    );
  }, [selectedExams, exams, searchTerm, statusFilter, sortOrder]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseUrl}/exams?page=${pageNumber}&limit=${perPage}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (response?.data?.status) {
        setExams(response?.data?.combinedData || []);
        setPageInfo({
          total:
            response?.data?.pageInfo?.total || response?.data?.data?.length,
          perPage: perPage,
          currentPage: response?.data?.pageInfo?.currentPage || pageNumber,
          totalPages:
            response?.data?.pageInfo?.totalPages ||
            Math.ceil((response?.data?.data?.length || 0) / perPage),
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
        // Update local state immediately
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

  // Handle individual exam selection
  const handleExamSelect = (examId) => {
    setSelectedExams((prev) => {
      if (prev.includes(examId)) {
        return prev.filter((id) => id !== examId);
      } else {
        return [...prev, examId];
      }
    });
  };

  // Handle select all functionality
  const handleSelectAll = () => {
    const filteredAndSortedExams = getSortedExams();
    if (selectAll) {
      // Deselect all visible exams
      setSelectedExams((prev) =>
        prev.filter(
          (id) => !filteredAndSortedExams.some((exam) => exam._id === id)
        )
      );
    } else {
      // Select all visible exams
      const visibleExamIds = filteredAndSortedExams.map((exam) => exam._id);
      setSelectedExams((prev) => [...new Set([...prev, ...visibleExamIds])]);
    }
  };

  // Get filtered and sorted exams
  const getSortedExams = () => {
    // Filter exams based on search term and status
    const filteredExams = exams.filter((exam) => {
      const examName = exam?.exam_title || exam?.name || "";
      const matchesSearch = examName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "" || exam?.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort exams based on sort order
    return [...filteredExams].sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b?.createdAt) - new Date(a?.createdAt);
      } else if (sortOrder === "oldest") {
        return new Date(a?.createdAt) - new Date(b?.createdAt);
      } else if (sortOrder === "name-asc") {
        const nameA = a?.exam_title || a?.name || "";
        const nameB = b?.exam_title || b?.name || "";
        return nameA.localeCompare(nameB);
      } else if (sortOrder === "name-desc") {
        const nameA = a?.exam_title || a?.name || "";
        const nameB = b?.exam_title || b?.name || "";
        return nameB.localeCompare(nameA);
      }
      return 0;
    });
  };

  // Handle assign exams to package
  const handleAssignExams = async () => {
    if (selectedExams.length === 0) {
      toast.warning("Please select at least one exam to assign");
      return;
    }

    if (!packageId) {
      toast.error("Package ID not found");
      return;
    }

    const result = await Swal.fire({
      title: "Assign Exams?",
      text: `Are you sure you want to assign ${selectedExams.length} exam(s) to this package?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, assign them!",
    });

    if (result.isConfirmed) {
      try {
        setAssigning(true);
        const response = await axios.post(
          `${baseUrl}/admin/package/add-exam`,
          {
            packageId: packageId,
            examIds: selectedExams,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        if (response?.data?.status) {
          toast.success("Exams assigned to package successfully!");
          setSelectedExams([]); // Clear selection after successful assignment
          // Optionally refresh the data
          fetchData();
        } else {
          toast.error(response?.data?.message || "Failed to assign exams");
        }
      } catch (error) {
        console.error("Error assigning exams:", error);
        toast.error("Failed to assign exams");
      } finally {
        setAssigning(false);
      }
    }
  };

  const sortedExams = getSortedExams();

  // Format date for display
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
          <div className="row">
            <div className="col-lg-6">
              <div className="dashboard-title">
                <h4 className="dash-head">
                  <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                  Assign Exams To Package
                </h4>
              </div>
              <div className="custom-bredcump">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="/packages">Packages</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Assign Exams
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="col-lg-6 d-flex justify-content-end align-items-start gap-2">
              {selectedExams.length > 0 && (
                <button
                  onClick={handleAssignExams}
                  className="btn-add-question"
                  disabled={assigning}
                >
                  <FontAwesomeIcon icon={faSave} className="me-2" />
                  {assigning
                    ? "Assigning..."
                    : `Assign ${selectedExams.length} Exam(s)`}
                </button>
              )}
              {/* <Link to="create" className="btn-add-question">
                                <FontAwesomeIcon icon={faPlus} className="me-2" />
                                Add Exam
                            </Link> */}
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
                        {selectedExams.length > 0 && (
                          <span className="badge bg-primary ms-2">
                            {selectedExams.length} Selected
                          </span>
                        )}
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
                    {/* Sort Order Filter */}
                    <div className="col-12 col-md-6 col-lg-4">
                      <select
                        className="form-select"
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
                </div>
                <div className="table-responsive custom-table">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                            disabled={loading || sortedExams.length === 0}
                          />
                        </th>
                        <th>S.No</th>
                        <th>Exam / Year</th>
                        <th>Duration</th>
                        <th>Total Score</th>
                        <th>Packages</th>
                        <th>Questions</th>
                        <th>Status</th>
                        <th>Created Date</th>
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
                      ) : sortedExams.length === 0 ? (
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
                        sortedExams.map((exam, i) => (
                          <tr
                            key={exam?._id}
                            className={
                              selectedExams.includes(exam?._id)
                                ? "table-active"
                                : ""
                            }
                          >
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedExams.includes(exam?._id)}
                                onChange={() => handleExamSelect(exam?._id)}
                                disabled={loading}
                              />
                            </td>
                            <td>{(pageNumber - 1) * perPage + i + 1}</td>
                            <td>
                              <div className="subject-name">
                                {exam?.exam_title || exam?.name || "N/A"}
                                <br />
                                {exam?.exam_year || "N/A"}
                              </div>
                            </td>
                            <td>{exam?.duration || 0} min</td>
                            <td>{exam?.total_score || 0}</td>
                            <td>{exam?.packages?.length || 0}</td>
                            <td>
                              <div className="action-buttons">
                                <Link
                                  to={`${exam?._id}/questions`}
                                  className="action-btn view-btn"
                                  title="View Questions"
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
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  {/* Pagination Component */}
                  {!loading && sortedExams.length > 0 && (
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

      <style>
        {`
                .table-active {
                    background-color: #e3f2fd !important;
                }
                
                .btn-add-question {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 0.375rem;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                
                .btn-add-question:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    color: white;
                    text-decoration: none;
                }
                
                .btn-add-question:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }
                
                .loading-spinner {
                    text-align: center;
                    padding: 3rem 0;
                }
                
                .empty-state {
                    text-align: center;
                    padding: 3rem 0;
                }
                
                .status-badge {
                    border: none;
                    padding: 0.375rem 0.75rem;
                    border-radius: 0.375rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .status-active {
                    background-color: #d4edda;
                    color: #155724;
                }
                
                .status-inactive {
                    background-color: #f8d7da;
                    color: #721c24;
                }
                
                .status-badge:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .badge {
                    font-size: 0.75rem;
                }
                
                .subject-name {
                    font-weight: 500;
                    line-height: 1.4;
                }
                
                .action-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 2rem;
                    height: 2rem;
                    border-radius: 0.375rem;
                    text-decoration: none;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    position: relative;
                }
                
                .view-btn {
                    background-color: #e3f2fd;
                    color: #1976d2;
                }
                
                .view-btn:hover {
                    background-color: #bbdefb;
                    color: #1565c0;
                    text-decoration: none;
                }
                
                .tooltip-text {
                    visibility: hidden;
                    width: 80px;
                    background-color: #333;
                    color: white;
                    text-align: center;
                    border-radius: 4px;
                    padding: 5px;
                    position: absolute;
                    z-index: 1;
                    bottom: 125%;
                    left: 50%;
                    margin-left: -40px;
                    font-size: 12px;
                }
                
                .action-btn:hover .tooltip-text {
                    visibility: visible;
                }
                
                .date-text {
                    color: #6c757d;
                    font-size: 0.875rem;
                }
                `}
      </style>
    </>
  );
}
