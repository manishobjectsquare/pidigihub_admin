"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { baseUrl } from "../../config/baseUrl"
import Swal from "sweetalert2"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faListUl, faSave, faArrowLeft, faPlus } from "@fortawesome/free-solid-svg-icons"

export default function EditTopic() {
    const { id } = useParams()
    const [formData, setFormData] = useState({
        name: "",
        subject: "",
        status: "active",
    })
    const [subjects, setSubjects] = useState([])
    const [loading, setLoading] = useState(false)
    const [fetchingData, setFetchingData] = useState(true)
    const [fetchingSubjects, setFetchingSubjects] = useState(false)
    const [errors, setErrors] = useState({})
    const [notFound, setNotFound] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        fetchSubjects()
        fetchTopicData()
    }, [id])

    const fetchTopicData = async () => {
        try {
            setFetchingData(true)
            const response = await axios.get(`${baseUrl}/topic/list`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })

            if (response.data.status) {
                const topic = response.data.data.find((t) => t._id === id)

                if (topic) {
                    setFormData({
                        name: topic.name,
                        subject: topic.subject?._id || "",
                        status: topic.status,
                    })
                } else {
                    setNotFound(true)
                    Swal.fire({
                        title: "Error!",
                        text: "Topic not found",
                        icon: "error",
                    })
                }
            } else {
                setNotFound(true)
                Swal.fire({
                    title: "Error!",
                    text: "Failed to fetch topic data",
                    icon: "error",
                })
            }
        } catch (error) {
            console.error("Error fetching topic data:", error)
            setNotFound(true)
            Swal.fire({
                title: "Error!",
                text: "Failed to fetch topic data",
                icon: "error",
            })
        } finally {
            setFetchingData(false)
        }
    }

    const fetchSubjects = async () => {
        try {
            setFetchingSubjects(true)
            const response = await axios.get(`${baseUrl}/subject/list`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })

            if (response.data.status) {
                // Filter only active subjects
                const activeSubjects = response.data.data.filter((subject) => subject.status === "active")
                setSubjects(activeSubjects)
            }
        } catch (error) {
            console.error("Error fetching subjects:", error)
            Swal.fire({
                title: "Error!",
                text: "Failed to fetch subjects",
                icon: "error",
            })
        } finally {
            setFetchingSubjects(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })

        // Clear error when field is edited
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            })
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = "Topic name is required"
        }

        if (!formData.subject) {
            newErrors.subject = "Subject is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)

        try {
            const response = await axios.put(`${baseUrl}/topic/update/${id}`, formData, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            })

            if (response.data.status) {
                Swal.fire({
                    title: "Success!",
                    text: "Topic updated successfully",
                    icon: "success",
                    confirmButtonColor: "#667eea",
                })
                navigate("/topics")
            } else {
                Swal.fire({
                    title: "Error!",
                    text: response.data.message || "Failed to update topic",
                    icon: "error",
                })
            }
        } catch (error) {
            console.error("Error updating topic:", error)
            Swal.fire({
                title: "Error!",
                text: error.response?.data?.message || "Failed to update topic",
                icon: "error",
            })
        } finally {
            setLoading(false)
        }
    }

    if (notFound) {
        return (
            <section className="main-sec">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="cards text-center py-5">
                                <h3 className="text-danger mb-4">Topic Not Found</h3>
                                <p className="mb-4">The topic you are trying to edit does not exist or has been deleted.</p>
                                <Link to="/topics" className="btn-back">
                                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                                    Back to Topics
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
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
                                    Edit Topic
                                </h4>
                            </div>
                            <div className="custom-bredcump">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link to="/">Dashboard</Link>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <Link to="/topics">Topics</Link>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            Edit Topic
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                        <div className="col-lg-6 d-flex justify-content-end align-items-start">
                            <Link to="/topics" className="btn-back">
                                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                                Back to Topics
                            </Link>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="cards">
                                {fetchingData ? (
                                    <div className="text-center py-5">
                                        <div className="spinner"></div>
                                        <p className="mt-3">Loading topic data...</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-section">
                                            <div className="row">
                                                <div className="col-lg-6 mb-4">
                                                    <label htmlFor="name" className="form-label">
                                                        Topic Name<sup className="text-danger">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                                        id="name"
                                                        name="name"
                                                        placeholder="Enter topic name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                                </div>
                                                <div className="col-lg-6 mb-4">
                                                    <label htmlFor="subject" className="form-label">
                                                        Subject<sup className="text-danger">*</sup>
                                                    </label>
                                                    <div className="subject-select-container">
                                                        <select
                                                            className={`form-control ${errors.subject ? "is-invalid" : ""}`}
                                                            id="subject"
                                                            name="subject"
                                                            value={formData.subject}
                                                            onChange={handleChange}
                                                            disabled={fetchingSubjects}
                                                        >
                                                            <option value="">Select Subject</option>
                                                            {subjects.map((subject) => (
                                                                <option key={subject._id} value={subject._id}>
                                                                    {subject.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <Link to="/subjects/add" className="btn-add-subject">
                                                            <FontAwesomeIcon icon={faPlus} />
                                                        </Link>
                                                        {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                                                    </div>
                                                    {fetchingSubjects && (
                                                        <div className="text-muted mt-2">
                                                            <small>
                                                                <span
                                                                    className="spinner-border spinner-border-sm me-1"
                                                                    role="status"
                                                                    aria-hidden="true"
                                                                ></span>
                                                                Loading subjects...
                                                            </small>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-lg-6 mb-4">
                                                    <label htmlFor="status" className="form-label">
                                                        Status
                                                    </label>
                                                    <select
                                                        className="form-control"
                                                        id="status"
                                                        name="status"
                                                        value={formData.status}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="active">Active</option>
                                                        <option value="inactive">Inactive</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row mt-4">
                                            <div className="col-12 text-center">
                                                <button type="submit" className="btn-save" disabled={loading}>
                                                    {loading ? (
                                                        <>
                                                            <span
                                                                className="spinner-border spinner-border-sm me-2"
                                                                role="status"
                                                                aria-hidden="true"
                                                            ></span>
                                                            Updating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FontAwesomeIcon icon={faSave} className="me-2" />
                                                            Update Topic
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .form-section {
                    background-color: #f8f9ff;
                    border-radius: 10px;
                    padding: 20px;
                    margin-bottom: 20px;
                    border-left: 4px solid #667eea;
                }
                
                .form-label {
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 8px;
                }
                
                .form-control {
                    border-radius: 5px;
                    border: 1px solid #ced4da;
                    padding: 10px 15px;
                    transition: all 0.3s ease;
                }
                
                .form-control:focus {
                    border-color: #667eea;
                    box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25);
                }
                
                .subject-select-container {
                    display: flex;
                    gap: 10px;
                    position: relative;
                }
                
                .btn-add-subject {
                    width: 38px;
                    height: 38px;
                    background: #008080;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                    margin-top: 1px;
                }
                
                .btn-add-subject:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
                    color: white;
                }
                
                .btn-save {
                    background: #008080;
                    color: white;
                    border: none;
                    padding: 10px 30px;
                    border-radius: 5px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }
                
                .btn-save:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
                }
                
                .btn-save:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }
                
                .btn-back {
                    background-color: #f8f9fa;
                    color: #333;
                    border: 1px solid #ced4da;
                    padding: 8px 15px;
                    border-radius: 5px;
                    font-weight: 500;
                    display: inline-flex;
                    align-items: center;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }
                
                .btn-back:hover {
                    background-color: #e9ecef;
                    color: #333;
                }
                
                .cards {
                    background-color: white;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    padding: 25px;
                    margin-bottom: 30px;
                }
                
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    border-radius: 50%;
                    border-top: 4px solid #667eea;
                    animation: spin 1s linear infinite;
                    margin: 0 auto;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </>
    )
}
