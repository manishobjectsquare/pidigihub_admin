"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { baseUrl } from "../../config/baseUrl"
import empty from "../../assets/images/empty-box.png"
import Swal from "sweetalert2"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faClipboardList,
  faPlus,
  faEye,
  faEdit,
  faTrash,
  faCheck,
  faTimes,
  faSearch,
  faClock,
  faQuestionCircle,
  faUsers,
  faRupeeSign,
  faList12,
} from "@fortawesome/free-solid-svg-icons"
import moment from "moment/moment"
import { toast } from "react-toastify"

export default function TestSeriesList() {
  const [testSeries, setTestSeries] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

  useEffect(() => {
    fetchTestSeries()
  }, [])

  const fetchTestSeries = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${baseUrl}/test`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      setTestSeries(response.data.data)
    } catch (error) {
      console.log("error", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"
    try {
      await axios(`${baseUrl}/test/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        data: { status: newStatus }
      })
      fetchTestSeries()
      toast.success("Status Updated Successfully")
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to update status",
        icon: "error",
      })
    }
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    })

    if (result.isConfirmed) {
      try {
        await axios.delete(`${baseUrl}/test/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        fetchTestSeries()
        Swal.fire("Deleted!", "Test series has been deleted.", "success")
      } catch (error) {
        Swal.fire("Error!", "Failed to delete test series.", "error")
      }
    }
  }

  // Filter test series based on search term, status, and category
  const filteredTestSeries = testSeries.filter((test) => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "" || test.status === statusFilter
    const matchesCategory = categoryFilter === "" || test.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const truncateText = (text, maxLength = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      easy: "bg-success",
      medium: "bg-warning",
      hard: "bg-danger",
    }
    return badges[difficulty] || "bg-secondary"
  }

  return (
    <>
      <style jsx>{`
        .main-sec {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
          padding: 2rem 0;
        }

        .dashboard-title {
          margin-bottom: 1.5rem;
        }

        .dash-head {
          color: #333;
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0;
        }

        .cards {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .bus-filter {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #eee;
        }

        .card-title {
          color: #333;
          font-weight: 700;
          margin: 0;
        }

        .btn-add-test {
          background: #008080;
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          color: white;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-add-test:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
          color: white;
        }

        .search-filter-container {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .search-input {
          flex: 1;
          min-width: 250px;
          border-radius: 8px;
          border: 1px solid #ddd;
          padding: 0.75rem 1rem;
          padding-left: 2.5rem;
        }

        .search-container {
          position: relative;
          flex: 1;
          min-width: 250px;
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }

        .filter-select {
          border-radius: 8px;
          border: 1px solid #ddd;
          padding: 0.75rem 1rem;
          min-width: 150px;
        }

        .custom-table {
          border-radius: 10px;
          overflow: hidden;
        }

        .table {
          margin: 0;
        }

        .table thead th {
          background: #008080;
          color: white;
          font-weight: 600;
          border: none;
          padding: 1rem;
        }

        .table tbody td {
          padding: 1rem;
          vertical-align: middle;
          border-bottom: 1px solid #f0f0f0;
        }

        .table tbody tr:hover {
          background-color: #f8f9ff;
        }

        .test-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .test-image {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          object-fit: cover;
        }

        .test-details h6 {
          margin: 0;
          font-weight: 600;
          color: #333;
        }

        .test-details p {
          margin: 0;
          color: #666;
          font-size: 0.85rem;
        }

        .stats-container {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.85rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #666;
        }

        .stat-icon {
          color: #667eea;
          width: 16px;
        }

        .difficulty-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .status-active {
          background: #d4edda;
          color: #155724;
        }

        .status-inactive {
          background: #f8d7da;
          color: #721c24;
        }

        .status-draft {
          background: #fff3cd;
          color: #856404;
        }

        .status-badge:hover {
          transform: scale(1.05);
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          width: 35px;
          height: 35px;
          border-radius: 8px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .view-btn {
          background: #4facfe;
          color: white;
        }

        .edit-btn {
          background: #ffa726;
          color: white;
        }

        .delete-btn {
          background: #ef5350;
          color: white;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .tooltip-text {
          position: absolute;
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: #333;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          white-space: nowrap;
        }

        .action-btn:hover .tooltip-text {
          opacity: 1;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
        }

        .empty-state img {
          opacity: 0.7;
          margin-bottom: 1rem;
        }

        .empty-state h4 {
          color: #666;
          margin-bottom: 1rem;
        }

        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 3rem;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .search-filter-container {
            flex-direction: column;
          }
          
          .search-container,
          .filter-select {
            min-width: 100%;
          }
          
          .table-responsive {
            font-size: 0.85rem;
          }
          
          .test-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .stats-container {
            font-size: 0.75rem;
          }
        }
      `}</style>

      <section className="main-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="dashboard-title">
                <h4 className="dash-head">
                  <FontAwesomeIcon icon={faClipboardList} className="me-2" />
                  Test Series
                </h4>
              </div>
              <div className="custom-bredcump">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Test Series List
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="col-lg-6 d-flex justify-content-end align-items-start">
              <Link to="create" className="btn-add-test">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Test Series
              </Link>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="cards bus-list">
                <div className="bus-filter">
                  <div className="row align-items-center">
                    <div className="col-lg-6">
                      <h5 className="card-title">Test Series List ({filteredTestSeries.length})</h5>
                    </div>
                  </div>
                </div>

                <div className="search-filter-container">
                  <div className="search-container">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search test series..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    className="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                  <select
                    className="filter-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    <option value="general">General Knowledge</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="science">Science</option>
                    <option value="english">English</option>
                    <option value="reasoning">Reasoning</option>
                    <option value="computer">Computer Science</option>
                  </select>
                </div>

                <div className="table-responsive custom-table">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>SN</th>
                        <th>Test Series</th>
                        <th>Details</th>
                        <th>Marks</th>
                        <th>Price</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Assign Question</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="7" className="loading-spinner">
                            <div className="spinner"></div>
                          </td>
                        </tr>
                      ) : filteredTestSeries.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="empty-state">
                            <img src={empty || "/placeholder.svg"} alt="No test series" width="200px" />
                            <h4>No Test Series found!</h4>
                            <p className="text-muted">
                              {searchTerm || statusFilter || categoryFilter
                                ? "Try adjusting your search or filter criteria"
                                : "Start by creating your first test series"}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredTestSeries.map((test, i) => (
                          <tr key={test?._id}>
                            <td>{i + 1}</td>
                            <td>
                              <h6>{truncateText(test?.title, 40)}</h6>
                              <p className="text-muted">{test?.packageId?.title}</p>
                            </td>
                            <td>
                              <div className="stats-container">
                                <div className="stat-item">
                                  <FontAwesomeIcon icon={faClock} className="stat-icon" />
                                  <span>{test?.duration} minutes</span>
                                </div>
                                <div className="stat-item">
                                  <FontAwesomeIcon icon={faQuestionCircle} className="stat-icon" />
                                  <span>{test?.questionCount || 0} questions</span>
                                </div>
                                {/* <div className="stat-item">
                                  <FontAwesomeIcon icon={faUsers} className="stat-icon" />
                                  <span>{test?.enrolledCount || 0} enrolled</span>
                                </div> */}
                              </div>
                            </td>
                            <td>
                              <div className="stats-container">
                                <div className="stat-item">
                                  <FontAwesomeIcon icon={faClock} className="stat-icon" />
                                  <span>Total Marks {test?.marks}</span>
                                </div>
                                <div className="stat-item">
                                  <FontAwesomeIcon icon={faQuestionCircle} className="stat-icon" />
                                  <span>Positive Marks {test?.positiveMark || 0}</span>
                                </div>
                                <div className="stat-item">
                                  <FontAwesomeIcon icon={faUsers} className="stat-icon" />
                                  <span>Negative Marks {test?.negativeMark || 0} </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              {test?.isFree === true ? "Free" : "Paid"}
                            </td>
                            <td>
                              {moment(test?.createdAt).format("lll")}
                            </td>
                            <td>
                              <button
                                onClick={() => handleStatus(test?._id, test?.status)}
                                className={`status-badge ${test.status === "active"
                                  ? "status-active"
                                  : test.status === "inactive"
                                    ? "status-inactive"
                                    : "status-draft"
                                  }`}
                              >
                                {test?.status === "active" ? (
                                  <>
                                    <FontAwesomeIcon icon={faCheck} className="me-1" />
                                    Active
                                  </>
                                ) : test?.status === "inactive" ? (
                                  <>
                                    <FontAwesomeIcon icon={faTimes} className="me-1" />
                                    Inactive
                                  </>
                                ) : (
                                  <>
                                    <FontAwesomeIcon icon={faEdit} className="me-1" />
                                    Draft
                                  </>
                                )}
                              </button>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <Link to={`questions/${test?._id}`} className="action-btn view-btn">
                                  {test?.questionCount || 0}
                                  <span className="tooltip-text">Question List</span>
                                </Link>
                                <Link to={`questions/assign/${test?._id}`} className="action-btn edit-btn">
                                  <FontAwesomeIcon icon={faQuestionCircle} />
                                  <span className="tooltip-text">Assign</span>
                                </Link>
                              </div>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <Link to={`/test-series/edit/${test?._id}`} className="action-btn edit-btn">
                                  <FontAwesomeIcon icon={faEdit} />
                                  <span className="tooltip-text">Edit</span>
                                </Link>
                                <button className="action-btn delete-btn" onClick={() => handleDelete(test?._id)}>
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
  )
}
