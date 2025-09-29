"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { baseUrl } from "../../config/baseUrl"
import empty from "../../assets/images/empty-box.png"
import Swal from "sweetalert2"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faListUl, faPlus, faEdit, faTrash, faCheck, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons"

export default function TopicList() {
    const [topics, setTopics] = useState([])
    const [subjects, setSubjects] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [subjectFilter, setSubjectFilter] = useState("")
    const [sortOrder, setSortOrder] = useState("newest")

    useEffect(() => {
        fetchTopics()
        fetchSubjects()
    }, [])

    const fetchTopics = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${baseUrl}/topic/list`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })
            if (response.data.status) {
                setTopics(response.data.data)
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "Failed to fetch topics",
                    icon: "error",
                })
            }
        } catch (error) {
            console.error("Error fetching topics:", error)
            Swal.fire({
                title: "Error!",
                text: "Failed to fetch topics",
                icon: "error",
            })
        } finally {
            setLoading(false)
        }
    }

    const fetchSubjects = async () => {
        try {
            const response = await axios.get(`${baseUrl}/subject/list`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })
            if (response.data.status) {
                setSubjects(response.data.data)
            }
        } catch (error) {
            console.error("Error fetching subjects:", error)
        }
    }

    const handleStatus = async (id) => {
        try {
            const topic = topics.find((t) => t._id === id)
            const newStatus = topic.status === "active" ? "inactive" : "active"

            await axios.patch(
                `${baseUrl}/topic/status/${id}`,
                {
                    status: newStatus,
                },
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                },
            )

            fetchTopics()
            Swal.fire({
                title: "Status Changed!",
                text: "Topic status updated successfully",
                icon: "success",
                draggable: true,
            })
        } catch (error) {
            console.error("Error updating status:", error)
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
                await axios.delete(`${baseUrl}/topic/delete/${id}`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                })
                fetchTopics()
                Swal.fire("Deleted!", "Topic has been deleted.", "success")
            } catch (error) {
                console.error("Error deleting topic:", error)
                Swal.fire("Error!", "Failed to delete topic.", "error")
            }
        }
    }

    // Filter topics based on search term, status, and subject
    const filteredTopics = topics.filter((topic) => {
        const matchesSearch = topic.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "" || topic.status === statusFilter
        const matchesSubject = subjectFilter === "" || (topic.subject && topic.subject._id === subjectFilter)
        return matchesSearch && matchesStatus && matchesSubject
    })

    // Sort topics based on sort order
    const sortedTopics = [...filteredTopics].sort((a, b) => {
        if (sortOrder === "newest") {
            return new Date(b.createdAt) - new Date(a.createdAt)
        } else if (sortOrder === "oldest") {
            return new Date(a.createdAt) - new Date(b.createdAt)
        } else if (sortOrder === "name-asc") {
            return a.name.localeCompare(b.name)
        } else if (sortOrder === "name-desc") {
            return b.name.localeCompare(a.name)
        }
        return 0
    })

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    return (
        <>
            <section className="main-sec">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="dashboard-title">
                                <h4 className="dash-head">
                                    <FontAwesomeIcon icon={faListUl} className="me-2" />
                                    Topics
                                </h4>
                            </div>
                            <div className="custom-bredcump">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link to="/">Dashboard</Link>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            Topics
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                        <div className="col-lg-6 d-flex justify-content-end align-items-start">
                            <Link to="/topics/add" className="btn-add-question">
                                <FontAwesomeIcon icon={faPlus} className="me-2" />
                                Add Topic
                            </Link>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="cards bus-list">
                                <div className="bus-filter">
                                    <div className="row align-items-center">
                                        <div className="col-lg-6">
                                            <h5 className="card-title">Topics List ({filteredTopics.length})</h5>
                                        </div>
                                    </div>
                                </div>

                                <div className="search-filter-container">
                                    <div className="search-container">
                                        <FontAwesomeIcon icon={faSearch} className="search-icon" />
                                        <input
                                            type="text"
                                            className="search-input"
                                            placeholder="Search topics..."
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
                                        value={subjectFilter}
                                        onChange={(e) => setSubjectFilter(e.target.value)}
                                    >
                                        <option value="">All Subjects</option>
                                        {subjects.map((subject) => (
                                            <option key={subject._id} value={subject._id}>
                                                {subject.name}
                                            </option>
                                        ))}
                                    </select>
                                    <select className="status-filter" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                                        <option value="newest">Newest First</option>
                                        <option value="oldest">Oldest First</option>
                                        <option value="name-asc">Name (A-Z)</option>
                                        <option value="name-desc">Name (Z-A)</option>
                                    </select>
                                </div>

                                <div className="table-responsive custom-table">
                                    <table className="table table-borderless">
                                        <thead>
                                            <tr>
                                                <th>SN</th>
                                                <th>Name</th>
                                                <th>Subject</th>
                                                <th>Created Date</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr>
                                                    <td colSpan="6" className="loading-spinner">
                                                        <div className="spinner"></div>
                                                    </td>
                                                </tr>
                                            ) : sortedTopics.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="empty-state">
                                                        <img src={empty || "/placeholder.svg"} alt="No topics" width="200px" />
                                                        <h4>No Topics found!</h4>
                                                        <p className="text-muted">
                                                            {searchTerm || statusFilter || subjectFilter
                                                                ? "Try adjusting your search or filter criteria"
                                                                : "Start by adding your first topic"}
                                                        </p>
                                                        <Link to="/topics/add" className="btn-add-question mt-3">
                                                            <FontAwesomeIcon icon={faPlus} className="me-2" />
                                                            Add Topic
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ) : (
                                                sortedTopics.map((topic, i) => (
                                                    <tr key={topic._id}>
                                                        <td>{i + 1}</td>
                                                        <td>
                                                            <div className="topic-name fw-bold">{topic.name}</div>
                                                        </td>
                                                        <td>
                                                            <span className="subject-badge">{topic.subject ? topic.subject.name : "N/A"}</span>
                                                        </td>
                                                        <td>{formatDate(topic.createdAt)}</td>
                                                        <td>
                                                            <button
                                                                onClick={() => handleStatus(topic._id)}
                                                                className={`status-badge ${topic.status === "active" ? "status-active" : "status-inactive"}`}
                                                            >
                                                                {topic.status === "active" ? (
                                                                    <>
                                                                        <FontAwesomeIcon icon={faCheck} className="me-1" />
                                                                        Active
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <FontAwesomeIcon icon={faTimes} className="me-1" />
                                                                        Inactive
                                                                    </>
                                                                )}
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <div className="action-buttons">
                                                                <Link to={`/topics/edit/${topic._id}`} className="action-btn edit-btn">
                                                                    <FontAwesomeIcon icon={faEdit} />
                                                                    <span className="tooltip-text">Edit</span>
                                                                </Link>
                                                                <button className="action-btn delete-btn" onClick={() => handleDelete(topic._id)}>
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

            <style jsx>{`
                .search-filter-container {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                }
                
                .search-container {
                    position: relative;
                    flex: 1;
                    min-width: 200px;
                }
                
                .search-icon {
                    position: absolute;
                    left: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #6c757d;
                }
                
                .search-input {
                    width: 100%;
                    padding: 10px 15px 10px 40px;
                    border: 1px solid #ced4da;
                    border-radius: 5px;
                }
                
                .status-filter {
                    padding: 10px 15px;
                    border: 1px solid #ced4da;
                    border-radius: 5px;
                    min-width: 150px;
                }
                
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
                
                .subject-badge {
                    background-color: #e3f2fd;
                    color: #0d6efd;
                    padding: 5px 10px;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 500;
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
    )
}
