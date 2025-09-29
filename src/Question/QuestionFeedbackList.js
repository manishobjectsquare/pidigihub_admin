"use client"

import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { baseUrl } from "../config/baseUrl"
import empty from "../assets/images/empty-box.png"
import Swal from "sweetalert2"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faExclamationTriangle,
    faEye,
    faEdit,
    faTrash,
    faCheck,
    faSearch,
    faUser,
    faCommentDots,
} from "@fortawesome/free-solid-svg-icons"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function QuestionFeedbackList() {
    const [feedbacks, setFeedbacks] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [subjects, setSubjects] = useState([])
    const [topics, setTopics] = useState([])
    const [subjectFilter, setSubjectFilter] = useState("")

    useEffect(() => {
        fetchFeedbacks()
    }, [])

    const fetchFeedbacks = async () => {
        try {
            setLoading(true)

            // Fetch feedbacks, subjects, and topics in parallel
            const [feedbacksResponse, subjectsResponse, topicsResponse] = await Promise.all([
                axios.get(`${baseUrl}/question/feedback-list`, {
                    headers: { Authorization: localStorage.getItem("token") },
                }),
                axios.get(`${baseUrl}/subject/list`, {
                    headers: { Authorization: localStorage.getItem("token") },
                }),
                axios.get(`${baseUrl}/topic/list`, {
                    headers: { Authorization: localStorage.getItem("token") },
                }),
            ])

            if (feedbacksResponse.data.status && Array.isArray(feedbacksResponse.data.data)) {
                setFeedbacks(feedbacksResponse.data.data)
            } else {
                setFeedbacks([])
            }

            if (subjectsResponse.data && subjectsResponse.data.data) {
                setSubjects(subjectsResponse.data.data)
            }

            if (topicsResponse.data && topicsResponse.data.data) {
                setTopics(topicsResponse.data.data)
            }
        } catch (error) {
            console.error("Error fetching feedback data:", error)
            toast.error("Failed to fetch question feedbacks")
            setFeedbacks([])
        } finally {
            setLoading(false)
        }
    }

    const handleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === "active" ? "inactive" : "active"

        try {
            const response = await fetch(`${baseUrl}/question/feedback-status/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
                body: JSON.stringify({ status: newStatus }),
            })

            if (!response.ok) {
                throw new Error("Failed to update status")
            }

            // Update UI optimistically
            setFeedbacks((prevQuestions) =>
                prevQuestions.map((q) =>
                    q._id === id ? { ...q, status: newStatus } : q
                )
            )
            toast.success("Status Changed Successfully!")
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
                await axios.delete(`${baseUrl}/question/feedback-delete/${id}`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                })
                fetchFeedbacks()
                toast.success("Deleted!", "Feedback has been deleted.", "success")
            } catch (error) {
                Swal.fire("Error!", "Failed to delete feedback.", "error")
            }
        }
    }

    // Helper function to get subject name
    const getSubjectName = (question) => {
        if (!question?.subject) return "N/A"

        // Check if it's a 24-character MongoDB ObjectId
        if (typeof question.subject === "string" && question.subject.length === 24) {
            const foundSubject = subjects.find((s) => s._id === question.subject)
            return foundSubject ? foundSubject.name : "Unknown Subject"
        }

        // If it's a direct name (from bulk upload)
        return question.subject
    }

    // Helper function to get topic name
    const getTopicName = (question) => {
        if (!question?.topic) return "N/A"

        // Check if it's a 24-character MongoDB ObjectId
        if (typeof question.topic === "string" && question.topic.length === 24) {
            const foundTopic = topics.find((t) => t._id === question.topic)
            return foundTopic ? foundTopic.name : "Unknown Topic"
        }

        // If it's a direct name (from bulk upload)
        return question.topic
    }

    // Helper function to get question text
    const getQuestionText = (question) => {
        return question?.question_english || question?.question || "No question text"
    }

    // Filter feedbacks based on search term and filters
    const filteredFeedbacks = feedbacks.filter((feedback) => {
        const questionText = getQuestionText(feedback.questionId)
        const subjectName = getSubjectName(feedback.questionId)
        const topicName = getTopicName(feedback.questionId)
        const studentName = feedback.userId?.name || ""
        const feedbackMessage = feedback.feedbackMessage || ""

        const matchesSearch =
            questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            topicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            feedbackMessage.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "" || feedback.status === statusFilter
        const matchesSubject = subjectFilter === "" || getSubjectName(feedback.questionId) === subjectFilter

        return matchesSearch && matchesStatus && matchesSubject
    })

    const truncateText = (text, maxLength = 50) => {
        if (!text) return ""
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
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
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                                    Question Feedbacks
                                </h4>
                            </div>
                            <div className="custom-bredcump">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link to="/">Dashboard</Link>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            Question Feedbacks
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="cards bus-list">
                                <div className="bus-filter">
                                    <div className="row align-items-center">
                                        <div className="col-lg-6">
                                            <h5 className="card-title">
                                                <FontAwesomeIcon icon={faCommentDots} className="me-2" />
                                                Reported Questions ({filteredFeedbacks.length})
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
                                            placeholder="Search by question, student, or feedback..."
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
                                        <option value="inactive">Resolved</option>
                                    </select>
                                    <select
                                        className="status-filter"
                                        value={subjectFilter}
                                        onChange={(e) => setSubjectFilter(e.target.value)}
                                    >
                                        <option value="">All Subjects</option>
                                        {subjects.map((subject) => (
                                            <option key={subject._id} value={subject.name}>
                                                {subject.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="table-responsive custom-table">
                                    <table className="table table-borderless">
                                        <thead>
                                            <tr>
                                                <th>SN</th>
                                                <th>Student</th>
                                                <th>Question</th>
                                                <th>Subject & Topic</th>
                                                <th>Feedback</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr>
                                                    <td colSpan="8" className="loading-spinner">
                                                        <div className="spinner"></div>
                                                    </td>
                                                </tr>
                                            ) : filteredFeedbacks.length === 0 ? (
                                                <tr>
                                                    <td colSpan="8" className="empty-state">
                                                        <img src={empty || "/placeholder.svg"} alt="No feedbacks" width="200px" />
                                                        <h4>No Question Feedbacks found!</h4>
                                                        <p className="text-muted">
                                                            {searchTerm || statusFilter || subjectFilter
                                                                ? "Try adjusting your search or filter criteria"
                                                                : "No students have reported any question errors yet"}
                                                        </p>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredFeedbacks.map((feedback, i) => (
                                                    <tr key={feedback?._id} className={feedback.status === "active" ? "priority-high" : ""}>
                                                        <td>{i + 1}</td>
                                                        <td>
                                                            <div className="student-info">
                                                                <div className="student-details">
                                                                    <div className="student-name">{feedback.userId?.name || "Unknown"}</div>
                                                                    <div className="student-mobile">
                                                                        {feedback.userId?.mobile ? `+91 ${feedback.userId.mobile}` : "N/A"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="question-text">
                                                                {truncateText(getQuestionText(feedback.questionId), 60)}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="subject-topic-info">
                                                                <div className="subject-name">{getSubjectName(feedback.questionId)}</div>
                                                                <div className="topic-name">{getTopicName(feedback.questionId)}</div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="feedback-message">
                                                                <FontAwesomeIcon icon={faCommentDots} className="feedback-icon" />
                                                                {truncateText(feedback.feedbackMessage, 50)}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="date-info">{formatDate(feedback.createdAt)}</div>
                                                        </td>
                                                        <td>
                                                            <button
                                                                onClick={() => handleStatus(feedback?._id, feedback?.status)}
                                                                className={`status-badge ${feedback.status === "active" ? "status-inactive" : " status-active"
                                                                    }`}
                                                            >
                                                                {feedback?.status === "active" ? (
                                                                    <>
                                                                        <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
                                                                        Open
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <FontAwesomeIcon icon={faCheck} className="me-1" />
                                                                        Resolved
                                                                    </>
                                                                )}
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <div className="action-buttons">
                                                                <Link
                                                                    to={`/questions/edit/${feedback.questionId?._id}`}
                                                                    className="action-btn edit-btn"
                                                                >
                                                                    <FontAwesomeIcon icon={faEdit} />
                                                                    <span className="tooltip-text">Edit Question</span>
                                                                </Link>
                                                                <button className="action-btn delete-btn" onClick={() => handleDelete(feedback?._id)}>
                                                                    <FontAwesomeIcon icon={faTrash} />
                                                                    <span className="tooltip-text">Delete Feedback</span>
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
        

        .table thead th {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
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
          background-color: #fff5f5;
        }

        .question-text {
          max-width: 250px;
          font-weight: 500;
        }

        .student-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .student-avatar {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background: #008080;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .student-details {
          display: flex;
          flex-direction: column;
        }

        .student-name {
          font-weight: 600;
          color: #333;
          margin: 0;
        }

        .student-mobile {
          font-size: 0.85rem;
          color: #666;
          margin: 0;
        }

        .subject-topic-info {
          font-size: 0.9rem;
        }

        .subject-name {
          font-weight: 600;
          color: #667eea;
        }

        .topic-name {
          color: #666;
          margin-top: 0.25rem;
        }

        .feedback-message {
          max-width: 200px;
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 0.75rem;
          font-size: 0.9rem;
          color: #856404;
        }

        .feedback-icon {
          color: #ffc107;
          margin-right: 0.5rem;
        }

        .date-info {
          font-size: 0.85rem;
          color: #666;
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
          border-top: 4px solid #dc3545;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .priority-high {
          border-left: 4px solid #dc3545;
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
          .status-filter {
            min-width: 100%;
          }
          
          .table-responsive {
            font-size: 0.85rem;
          }
          
          .question-text,
          .feedback-message {
            max-width: 150px;
          }
          
          .student-info {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
        </>
    )
}
