
"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { baseUrl } from "../../config/baseUrl"
import Swal from "sweetalert2"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faListUl, faSave, faArrowLeft, faPlus } from "@fortawesome/free-solid-svg-icons"
import { toast } from "react-toastify"

export default function EditTopic() {
    const { id } = useParams()
    const [formData, setFormData] = useState({
        topic: "", // Changed from 'name' to 'topic' to match AddTopic
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
            const response = await axios.get(`${baseUrl}/topics/${id}`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })

            if (response.data.status) {
                const topic = response.data.data
                if (topic) {
                    setFormData({
                        topic: topic.topic_name, // Changed from 'name' to 'topic'
                        subject: topic.subject_id?._id || "",
                        status: topic.status,
                    })
                } else {
                    setNotFound(true)
                    toast.error("Topic not found")
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
            toast.error("Error fetching topic data")
        } finally {
            setFetchingData(false)
        }
    }

    const fetchSubjects = async () => {
        try {
            setFetchingSubjects(true)
            const response = await axios.get(`${baseUrl}/subjects`, {
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
            toast.error("Error fetching subjects")
        } finally {
            setFetchingSubjects(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value.trim(), // Trim whitespace
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

        if (!formData.topic.trim()) {
            // Changed from 'name' to 'topic'
            newErrors.topic = "Topic name is required"
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
            const submitData = {
                topic_name: formData.topic.trim(),
                subject_id: formData.subject, // ✅ key updated here
                status: formData.status,
            }

            console.log("Submitting data:", submitData)

            const response = await axios.patch(`${baseUrl}/topics/${id}`, submitData, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            })

            if (response.data.status) {
                toast.success("Topic updated successfully")
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
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-3">Loading topic data...</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-section">
                                            <div className="row">
                                                <div className="col-lg-6 mb-4">
                                                    <label htmlFor="topic" className="form-label">
                                                        Topic Name<sup className="text-danger">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${errors.topic ? "is-invalid" : ""}`}
                                                        id="topic"
                                                        name="topic"
                                                        placeholder="Enter topic name"
                                                        value={formData.topic}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.topic && <div className="invalid-feedback">{errors.topic}</div>}
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

        </>
    )
}
