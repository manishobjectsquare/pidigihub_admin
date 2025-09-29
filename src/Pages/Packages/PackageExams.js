import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import { baseUrl } from "../../config/baseUrl"
import empty from "../../assets/images/empty-box.png"
import Swal from "sweetalert2"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faGraduationCap,
    faPlus,
    faEdit,
    faEye,
} from "@fortawesome/free-solid-svg-icons"
import { toast } from "react-toastify"
import Pagination from "../../Component/Pagination/Pagination"

export default function PackageExams() {
    const { id } = useParams();
    const [exams, setExams] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchExamsForPackage()
    }, [id])

    const fetchExamsForPackage = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${baseUrl}/admin/package/exam/${id}`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })

            if (response?.data?.status) {
                setExams(response?.data?.data || [])
            } else {
                toast.error(response?.data?.message || "Failed to fetch package exams")
            }
        } catch (error) {
            console.error("Error fetching package exams:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatus = async (id) => {
        try {
            const exam = exams.find((e) => e._id === id)
            if (!exam) return

            const newStatus = exam.status === "active" ? "inactive" : "active"

            const response = await axios.patch(
                `${baseUrl}/exams/status/${id}`,
                { status: newStatus },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token"),
                    },
                },
            )

            if (response?.data?.status) {
                setExams((prevExams) => prevExams.map((exam) => (exam._id === id ? { ...exam, status: newStatus } : exam)))
                toast.success(`Exam ${newStatus === "active" ? "activated" : "deactivated"} successfully`)
            } else {
                toast.error(response?.data?.message || "Failed to update status")
            }
        } catch (error) {
            console.error("Error updating status:", error)
            toast.error("Failed to update status")
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    return (
        <section className="main-sec">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="dashboard-title">
                            <h4 className="dash-head">
                                <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                                Package Exams
                            </h4>
                        </div>
                    </div>
                    <div className="col-lg-6 d-flex justify-content-end align-items-start">
                        <Link to="assign-exams" className="btn-add-question">
                            <FontAwesomeIcon icon={faPlus} className="me-2" />
                            Assign Exam
                        </Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="cards bus-list">
                            <div className="table-responsive custom-table">
                                <table className="table table-borderless">
                                    <thead>
                                        <tr>
                                            <th>S.No</th>
                                            <th>Exam / Year</th>
                                            <th>Duration</th>
                                            <th>Total Score</th>

                                            <th>Created Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="7" className="loading-spinner">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    <p className="mt-2">Loading exams...</p>
                                                </td>
                                            </tr>
                                        ) : exams.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="empty-state">
                                                    <img src={empty || "/placeholder.svg"} alt="No exams" width="200px" />
                                                    <h4>No Exams found!</h4>
                                                </td>
                                            </tr>
                                        ) : (
                                            exams.map((exam, i) => (
                                                <tr key={exam?._id}>
                                                    <td>{i + 1}</td>
                                                    <td>
                                                        <div className="subject-name ">
                                                            {exam?.exam_title || "N/A"}
                                                            <br />
                                                            {exam?.exam_year || "N/A"}
                                                        </div>
                                                    </td>
                                                    <td>{exam?.duration || 0} min</td>
                                                    <td>{exam?.total_score || 0}</td>
                                                    <td>
                                                        <span className="date-text">{formatDate(exam?.createdAt)}</span>
                                                    </td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <Link to={`/exams/view/${exam?._id}`} className="action-btn view-btn" title="View Exam">
                                                                <FontAwesomeIcon icon={faEye} />
                                                            </Link>
                                                            <Link to={`/exams/edit/${exam?._id}`} className="action-btn edit-btn" title="Edit Exam">
                                                                <FontAwesomeIcon icon={faEdit} />
                                                            </Link>
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
            <style >{`
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
        </section>
    )
}
