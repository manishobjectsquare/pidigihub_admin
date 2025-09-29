"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { baseUrl } from "../../config/baseUrl"
import axios from "axios"
import toastify from "../../config/toastify"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faBell, faSave, faUpload, faTimes } from "@fortawesome/free-solid-svg-icons"

export default function NotificationEdit() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [formval, setFormval] = useState({
        title: "",
        message: "",
        status: "",
    })

    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [existingImage, setExistingImage] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [loading, setLoading] = useState(false)
    const [fetchLoading, setFetchLoading] = useState(false)

    useEffect(() => {
        if (id) {
            fetchNotificationData()
        }
    }, [id])

    const fetchNotificationData = async () => {
        try {
            setFetchLoading(true)
            const response = await axios.get(`${baseUrl}/notification`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })

            if (response.data.status) {
                // Find the notification with matching ID
                const notification = response.data.data.find((item) => item._id === id)

                if (notification) {
                    setFormval({
                        title: notification.title,
                        message: notification.message,
                        status: notification.status,
                    })

                    if (notification.image) {
                        setExistingImage(notification.image)
                        setPreviewUrl(`${baseUrl}/uploads/${notification.image}`)
                    }
                } else {
                    toastify.error("Notification not found")
                    navigate("/notifications")
                }
            }
        } catch (error) {
            console.error("Error fetching notification:", error)
            toastify.error("Failed to fetch notification data")
        } finally {
            setFetchLoading(false)
        }
    }

    const changeHandler = (e) => {
        const { name, value } = e.target
        setFormval((prevVal) => ({
            ...prevVal,
            [name]: value,
        }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onload = () => {
                setPreviewUrl(reader.result)
            }
            reader.readAsDataURL(file)
            setExistingImage(null) // Clear existing image when new file is selected
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onload = () => {
                setPreviewUrl(reader.result)
            }
            reader.readAsDataURL(file)
            setExistingImage(null) // Clear existing image when new file is dropped
        }
    }

    const removeFile = () => {
        setSelectedFile(null)
        setPreviewUrl(null)
        setExistingImage(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Form validation
        if (!formval.title) {
            return toastify.error("Title is required")
        }
        if (!formval.message) {
            return toastify.error("Message is required")
        }
        if (!formval.status) {
            return toastify.error("Status is required")
        }

        setLoading(true)

        try {
            const formData = new FormData()

            // Append all form fields
            Object.keys(formval).forEach((key) => {
                formData.append(key, formval[key])
            })

            // Append image if selected
            if (selectedFile) {
                formData.append("image", selectedFile)
            }

            const response = await axios(`${baseUrl}/notification/${id}`, {
                method: "PATCH",
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
                data: formData,
            })

            if (response.data.status) {
                toastify.success("Notification updated successfully")
                navigate("/notifications")
            } else {
                toastify.error("An error occurred while updating notification")
            }
        } catch (error) {
            console.error("Error:", error)
            toastify.error("Failed to update notification")
        } finally {
            setLoading(false)
        }
    }

    if (fetchLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <>


            <section className="main-sec">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="dashboard-title">
                                <h4 className="dash-head">
                                    <FontAwesomeIcon icon={faBell} className="me-2" />
                                    Edit Notification
                                </h4>
                            </div>
                            <div className="custom-bredcump">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link to="/">Dashboard</Link>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <Link to="/notifications">Notifications</Link>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            Edit Notification
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                        <div className="col-lg-6 d-flex justify-content-end">
                            <Link to="/notifications" className="btn btn-info text-white">
                                <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                                Back
                            </Link>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="cards edit-usr">
                                <form onSubmit={handleSubmit}>
                                    {/* Basic Information */}
                                    <div className="form-section">
                                        <h5 className="section-title">Notification Details</h5>
                                        <div className="row">
                                            <div className="col-lg-12 mb-4">
                                                <label htmlFor="title" className="form-label">
                                                    Title<sup className="text-danger">*</sup>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="title"
                                                    placeholder="Enter notification title"
                                                    onChange={changeHandler}
                                                    value={formval?.title}
                                                />
                                            </div>
                                            <div className="col-lg-12 mb-4">
                                                <label htmlFor="message" className="form-label">
                                                    Message<sup className="text-danger">*</sup>
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    name="message"
                                                    rows="4"
                                                    placeholder="Enter notification message"
                                                    onChange={changeHandler}
                                                    value={formval?.message}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notification Image */}
                                    <div className="form-section">
                                        <h5 className="section-title">Notification Image</h5>
                                        <div className="file-upload-container">
                                            <div
                                                className={`file-upload-area ${isDragging ? "dragging" : ""}`}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                            >
                                                {!previewUrl ? (
                                                    <>
                                                        <div className="file-upload-icon">
                                                            <FontAwesomeIcon icon={faUpload} />
                                                        </div>
                                                        <div className="file-upload-text">Drag & Drop your image here</div>
                                                        <div className="file-upload-subtext">or click to browse files</div>
                                                        <input
                                                            type="file"
                                                            className="file-upload-input"
                                                            accept="image/*"
                                                            onChange={handleFileChange}
                                                        />
                                                    </>
                                                ) : (
                                                    <div className="file-preview-container">
                                                        <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="file-preview" />
                                                        <button type="button" className="file-remove-btn" onClick={removeFile}>
                                                            <FontAwesomeIcon icon={faTimes} />
                                                        </button>
                                                        <div className={selectedFile ? "file-info" : "existing-image-info"}>
                                                            {selectedFile
                                                                ? `${selectedFile.name} (${Math.round(selectedFile.size / 1024)} KB)`
                                                                : `Current image: ${existingImage}`}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="form-section">
                                        <h5 className="section-title">Status</h5>
                                        <div className="row">
                                            <div className="col-lg-6 mb-4">
                                                <label htmlFor="status" className="form-label">
                                                    Status<sup className="text-danger">*</sup>
                                                </label>
                                                <select className="form-control" name="status" onChange={changeHandler} value={formval?.status}>
                                                    <option value="">Select Status</option>
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-12 text-center mt-4">
                                        <button type="submit" className="btn btn-for-add text-white" disabled={loading}>
                                            {loading && <div className="loading-spinner"></div>}
                                            <FontAwesomeIcon icon={faSave} className="me-2" />
                                            {loading ? "Updating..." : "Update Notification"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
