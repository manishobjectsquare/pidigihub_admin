import { useState, useEffect, useContext } from "react"
import { Link, useLocation } from "react-router-dom"
import moment from "moment"
import axios from "axios"
import { baseUrl } from "../../config/baseUrl"
import Swal from "sweetalert2"
import loaderContext from "../../context/LoaderContext"
import Pagination from "../Pagination/Pagination"

export default function PurchaseHistory() {
    const [pageNumber, setPageNumber] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [SequenceChange, setIsSequenceChange] = useState(false)

    const [paginationDetails, setPaginationDetails] = useState({
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
    })

    const { setLoader } = useContext(loaderContext)
    const [courseList, setCourseList] = useState([])
    const [history, setHistory] = useState([])
    const [filteredHistory, setFilteredHistory] = useState([])
    const [fullApiResponse, setFullApiResponse] = useState(null)
    const location = useLocation()

    // Filter states
    const [filters, setFilters] = useState({
        courseId: "",
        startDate: "",
        endDate: "",
        status: "",
    })
    const [showFilters, setShowFilters] = useState(false)

    useEffect(() => {
        fetchPurchaseHistory()
        fetchLiveData()
    }, [])

    useEffect(() => {
        if (location.state?.courseId) {
            setFilters((prev) => ({
                ...prev,
                courseId: location.state.courseId,
            }))
            setShowFilters(true)
            window.history.replaceState({}, document.title)
        }
    }, [location.state])

    useEffect(() => {
        applyFilters()
    }, [history, filters])

    // Update pagination when filtered history changes
    useEffect(() => {
        const itemsPerPage = 10
        const calculatedTotalPages = Math.ceil(filteredHistory.length / itemsPerPage)
        setTotalPages(calculatedTotalPages)
        setPaginationDetails({
            currentPage: pageNumber,
            totalPages: calculatedTotalPages,
            totalRecords: filteredHistory.length,
        })
        // Reset to page 1 when filters change
        if (pageNumber > calculatedTotalPages && calculatedTotalPages > 0) {
            setPageNumber(1)
        }
    }, [filteredHistory, pageNumber])

    const fetchLiveData = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/admin/course/course-list`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })
            setCourseList(response.data.data || [])
        } catch (error) {
            console.log("error", error)
            setCourseList([])
        }
    }


    const fetchPurchaseHistory = async () => {
        setLoader(true)
        try {
            const response = await axios.get(`${baseUrl}/api/history`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })

            // Store the complete API response
            setFullApiResponse(response.data)

            const validData = (response.data.data || []).filter((item) => item != null)
            setHistory(validData)
        } catch (error) {
            console.log("error", error)
            setHistory([])
            setFullApiResponse(null)
        } finally {
            setLoader(false)
        }
    }

    const applyFilters = () => {
        let filtered = [...history]

        // Filter out null/undefined items first
        filtered = filtered.filter((item) => item != null)

        // Filter by course ID - Updated to match your API response field names
        if (filters.courseId) {
            filtered = filtered.filter((item) => {
                if (!item) return false
                // Match by course ID - checking all possible field names from your API
                return (
                    item.course_Id === filters.courseId || // This is the correct field from your API
                    item.course_id === filters.courseId ||
                    item.courseId === filters.courseId ||
                    item.course?._id === filters.courseId
                )
            })
        }

        // Filter by date range
        if (filters.startDate) {
            filtered = filtered.filter((item) => {
                if (!item || !item.createdAt) return false
                const itemDate = moment(item.createdAt)
                const startDate = moment(filters.startDate)
                return itemDate.isValid() && itemDate.isSameOrAfter(startDate, "day")
            })
        }

        if (filters.endDate) {
            filtered = filtered.filter((item) => {
                if (!item || !item.createdAt) return false
                const itemDate = moment(item.createdAt)
                const endDate = moment(filters.endDate)
                return itemDate.isValid() && itemDate.isSameOrBefore(endDate, "day")
            })
        }

        // Filter by status
        if (filters.status) {
            filtered = filtered.filter((item) => {
                if (!item) return false
                const status = item.payment_Status || item.Status || ""
                return status.toLowerCase() === filters.status.toLowerCase()
            })
        }

        setFilteredHistory(filtered)
    }

    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }))
        setPageNumber(1) // Reset to first page when filter changes
    }

    const clearFilters = () => {
        setFilters({
            courseId: "",
            startDate: "",
            endDate: "",
            status: "",
        })
        setPageNumber(1)
    }

    const hasActiveFilters = () => {
        return filters.courseId || filters.startDate || filters.endDate || filters.status
    }

    // Get course name by ID for display
    const getCourseNameById = (courseId) => {
        const course = courseList.find((c) => c._id === courseId)
        return course?.title || "Unknown Course"
    }

    // Get selected course name for display
    const getSelectedCourseName = () => {
        if (filters.courseId) {
            return getCourseNameById(filters.courseId)
        }
        return null
    }

    const itemsPerPage = 10
    const startIndex = (pageNumber - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const displayedHistory = filteredHistory.slice(startIndex, endIndex)
    // Handle invoice click - open in new tab with complete API data
    const handleInvoiceClick = (selectedItem) => {
        // Prepare complete data for invoice including the full API response
        const completeInvoiceData = {
            // Selected item data
            selectedItem: selectedItem,
            // Complete API response
            fullApiResponse: fullApiResponse,
            // Course list for reference
            courseList: courseList,
            // Additional metadata
            metadata: {
                totalRecords: fullApiResponse?.data?.length || 0,
                apiMessage: fullApiResponse?.message || "",
                apiSuccess: fullApiResponse?.success || false,
                generatedAt: new Date().toISOString(),
            },
        }

        const invoiceParams = new URLSearchParams({
            data: encodeURIComponent(JSON.stringify(completeInvoiceData)),
        })

        // Open invoice in new tab
        const invoiceUrl = `/invoice/${selectedItem.invoice || selectedItem.purchaseId}?${invoiceParams.toString()}`
        window.open(invoiceUrl, "_blank")
    }
    return (
        <>
            <section className="main-sec">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="dashboard-title">
                            <h4 className="dash-head">
                                <i className="fa fa-chart-bar me-2" />
                                Purchase History
                            </h4>
                        </div>
                        <div className="custom-bredcump">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/">Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Purchase History
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>

                    <div className="col-lg-12">
                        <div className="cards bus-list">
                            <div className="bus-filter">
                                <div className="row align-items-center">
                                    <div className="col-lg-6">
                                        <h5 className="card-title">Purchase History ({history?.length || 0})</h5>
                                    </div>
                                    <div className="col-lg-6 text-end">
                                        <button
                                            className={`btn btn-outline-primary me-2 ${showFilters ? "active" : ""}`}
                                            onClick={() => setShowFilters(!showFilters)}
                                        >
                                            <i className="fa fa-filter me-1"></i>
                                            Filters
                                            {hasActiveFilters() && (
                                                <span className="badge bg-danger ms-1">{Object.values(filters).filter((v) => v).length}</span>
                                            )}
                                        </button>
                                        {hasActiveFilters() && (
                                            <button className="btn btn-outline-secondary" onClick={clearFilters}>
                                                <i className="fa fa-times me-1"></i>
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Filter Panel */}
                                {showFilters && (
                                    <div className="filter-panel mt-3 p-3 bg-light rounded">
                                        <div className="row g-3">
                                            <div className="col-md-3">
                                                <label className="form-label">Course Name</label>
                                                <select
                                                    className="form-control"
                                                    value={filters.courseId}
                                                    onChange={(e) => handleFilterChange("courseId", e.target.value)}
                                                >
                                                    <option value="">All Courses</option>
                                                    {courseList?.map((course) => (
                                                        <option key={course._id} value={course._id}>
                                                            {course?.title}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Start Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={filters.startDate}
                                                    onChange={(e) => handleFilterChange("startDate", e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">End Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={filters.endDate}
                                                    onChange={(e) => handleFilterChange("endDate", e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Status</label>
                                                <select
                                                    className="form-control"
                                                    value={filters.status}
                                                    onChange={(e) => handleFilterChange("status", e.target.value)}
                                                >
                                                    <option value="">All Status</option>
                                                    <option value="paid">Paid</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="row mt-2">
                                    <div className="col-lg-12 text-end">
                                        <span className="text-muted">
                                            Showing {displayedHistory.length > 0 ? startIndex + 1 : 0} to{" "}
                                            {Math.min(endIndex, filteredHistory.length)} of {filteredHistory.length} entries
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="table table-responsive custom-table">
                                <table className="table table-borderless">
                                    <thead>
                                        <tr>
                                            <th>Sr. no.</th>
                                            <th>Invoice</th>
                                            <th>Course Name</th>
                                            <th>Student Name</th>
                                            <th>Amount</th>
                                            <th>Payment Method</th>
                                            <th>Payment Status</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedHistory?.length > 0 ? (
                                            displayedHistory.map((arr, i) => {
                                                return (
                                                    <tr key={arr?._id || i}>
                                                        <td>{startIndex + i + 1}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-link p-0 text-primary fw-bold"
                                                                onClick={() => handleInvoiceClick(arr)}
                                                                style={{
                                                                    textDecoration: "underline",
                                                                    border: "none",
                                                                    background: "none",
                                                                    cursor: "pointer",
                                                                }}
                                                                title="Click to view/print invoice"
                                                            >
                                                                {arr?.invoice || "N/A"}
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <span className="fw-medium">
                                                                {arr?.courseTitle ||
                                                                    arr?.courseName ||
                                                                    getCourseNameById(arr?.course_Id || arr?.course_id || arr?.courseId) ||
                                                                    "N/A"}
                                                            </span>
                                                        </td>
                                                        <td>{arr?.userName || "N/A"}</td>
                                                        <td>
                                                            <span className="fw-bold">{arr?.paid || "0"}</span>
                                                        </td>
                                                        <td>
                                                            <span>{arr?.payment_Gateway || "N/A"}</span>
                                                        </td>
                                                        <td>
                                                            <span
                                                                className={
                                                                    arr?.payment_Status === "completed" ||
                                                                        arr?.Status === "completed" ||
                                                                        arr?.payment_Status === "paid"
                                                                        ? "btn btn-pill btn btn-success btn-sm"
                                                                        : arr?.payment_Status === "pending" || arr?.Status === "pending"
                                                                            ? "btn btn-pill btn btn-warning btn-sm"
                                                                            : "btn btn-pill btn btn-danger btn-sm"
                                                                }
                                                            >
                                                                {arr?.payment_Status || arr?.Status || "Unknown"}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span>{arr?.createdAt ? moment(arr.createdAt).format("DD/MM/YYYY") : "N/A"}</span>
                                                            <br />
                                                            <small className="text-muted">
                                                                {arr?.createdAt ? moment(arr.createdAt).format("hh:mm A") : ""}
                                                            </small>
                                                        </td>
                                                        <td>
                                                            <div className="action-buttons">
                                                                <Link
                                                                    className="action-btn edit-btn bg-info"
                                                                    to={`/purchase-history/view/${arr?._id}`}
                                                                    title="View Details"
                                                                >
                                                                    <i className="fa fa-eye" />
                                                                </Link>
                                                                <Link
                                                                    className="action-btn edit-btn bg-primary"
                                                                    to={`/purchase-history/edit/${arr?._id}`}
                                                                    title="Edit"
                                                                >
                                                                    <i className="fa fa-edit" />
                                                                </Link>
                                                                <button
                                                                    className="action-btn edit-btn bg-danger border-0"
                                                                    title="Delete"
                                                                    onClick={() => {
                                                                        Swal.fire({
                                                                            title: "Are you sure?",
                                                                            text: "You won't be able to revert this!",
                                                                            icon: "warning",
                                                                            showCancelButton: true,
                                                                            confirmButtonColor: "#3085d6",
                                                                            cancelButtonColor: "#d33",
                                                                            confirmButtonText: "Yes, delete it!",
                                                                        }).then((result) => {
                                                                            if (result.isConfirmed) {
                                                                                // Add delete functionality here
                                                                                console.log("Delete:", arr?._id)
                                                                            }
                                                                        })
                                                                    }}
                                                                >
                                                                    <i className="fa fa-trash"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="text-center py-4">
                                                    <div className="no-data">
                                                        <i className="fa fa-inbox fa-3x text-muted mb-3"></i>
                                                        <h5 className="text-muted">
                                                            {hasActiveFilters() ? "No Records Found" : "No Purchase History Found"}
                                                        </h5>
                                                        <p className="text-muted">
                                                            {hasActiveFilters()
                                                                ? "Try adjusting your filters to see more results."
                                                                : "There are no purchase records to display."}
                                                        </p>
                                                        {hasActiveFilters() && (
                                                            <button className="btn btn-primary btn-sm" onClick={clearFilters}>
                                                                <i className="fa fa-times me-1"></i>
                                                                Clear Filters
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Show pagination only if there are records and more than one page */}
                            {filteredHistory.length > 0 && totalPages > 1 && (
                                <Pagination
                                    pageNumber={pageNumber}
                                    totalPages={totalPages}
                                    setPageNumber={setPageNumber}
                                    pageLimit={filteredHistory.length}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
        .filter-panel {
          border: 1px solid #e0e0e0;
          animation: slideDown 0.3s ease-out;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .btn.active {
          background-color: #007bff;
          color: white;
          border-color: #007bff;
        }
        
        .action-buttons {
          display: flex;
          gap: 5px;
        }
        
        .action-btn {
          padding: 5px 8px;
          border-radius: 4px;
          text-decoration: none;
          color: white;
          font-size: 12px;
        }
        
        .sold-count {
          font-weight: bold;
          color: #007bff;
        }
      `}</style>
        </>
    )
}
