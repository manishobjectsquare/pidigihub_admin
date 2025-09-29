"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { baseUrl } from "../../config/baseUrl"
import axios from "axios"
import toastify from "../../config/toastify"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faBoxOpen, faSave, faUpload, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons"

export default function EditTestPackage() {
    const { id } = useParams()
    const [formval, setFormval] = useState({
        title: "",
        description: "",
        price: "",
        offerPrice: "",
        status: "",
        subcategoryID: "",
    })

    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [existingImage, setExistingImage] = useState("")
    const [isDragging, setIsDragging] = useState(false)
    const [loading, setLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(true)
    const [subcategories, setSubcategories] = useState([])
    const [packageNotFound, setPackageNotFound] = useState(false)

    const navigate = useNavigate()

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
        }
    }

    const removeFile = () => {
        setSelectedFile(null)
        setPreviewUrl(null)
    }

    const fetchPackageData = async () => {
        try {
            setPageLoading(true)

            // Fetch package list
            const response = await axios.get(`${baseUrl}/package`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })

            if (response.data.status && response.data.data) {
                // Find the specific package by ID
                const packageData = response.data.data.find((pkg) => pkg._id === id)

                if (packageData) {
                    // Set form values
                    setFormval({
                        title: packageData.title || "",
                        description: packageData.description || "",
                        price: packageData.price || "",
                        offerPrice: packageData.offerPrice || "",
                        status: packageData.status || "",
                        subcategoryID: packageData.subcategoryID?._id || "",
                    })

                    // Set existing image
                    if (packageData.image) {
                        setExistingImage(`${baseUrl}/${packageData?.image}`)
                    }
                } else {
                    setPackageNotFound(true)
                    toastify.error("Package not found")
                }
            }
        } catch (error) {
            console.error("Error fetching package data:", error)
            toastify.error("Failed to fetch package data")
            setPackageNotFound(true)
        } finally {
            setPageLoading(false)
        }
    }

    const fetchSubcategories = async () => {
        try {
            const response = await axios.get(`${baseUrl}/subcategory`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })
            if (response.data.status && response.data.data) {
                setSubcategories(response.data.data)
            }
        } catch (error) {
            console.error("Error fetching subcategories:", error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Form validation
        if (!formval.title) {
            return toastify.error("Title is required")
        }
        if (!formval.description) {
            return toastify.error("Description is required")
        }
        if (!formval.price) {
            return toastify.error("Price is required")
        }
        if (!formval.status) {
            return toastify.error("Status is required")
        }
        if (!formval.subcategoryID) {
            return toastify.error("Subcategory is required")
        }

        // Validate offer price
        if (formval.offerPrice && Number.parseFloat(formval.offerPrice) >= Number.parseFloat(formval.price)) {
            return toastify.error("Offer price should be less than regular price")
        }

        setLoading(true)

        try {
            const formData = new FormData()

            // Append all form fields
            Object.keys(formval).forEach((key) => {
                if (formval[key] !== "") {
                    formData.append(key, formval[key])
                }
            })

            // Append image if selected (new image)
            if (selectedFile) {
                formData.append("image", selectedFile)
            }

            console.log("Updating package with data:", Object.fromEntries(formData))

            const response = await axios(`${baseUrl}/package/${id}`, {
                method: "PATCH",
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
                data: formData,
            })

            if (!response?.data?.status) {
                toastify.error("An error occurred while updating package")
                return
            }

            toastify.success("Package updated successfully")
            navigate("/test-packages")
        } catch (error) {
            console.error("Error:", error)
            toastify.error("Failed to update package")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchPackageData()
            fetchSubcategories()
        }
    }, [id])

    if (pageLoading) {
        return (
            <section className="main-sec">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6 text-center">
                            <div className="loading-container" style={{ padding: "4rem 0" }}>
                                <FontAwesomeIcon icon={faSpinner} spin size="3x" color="#667eea" />
                                <h4 style={{ marginTop: "1rem", color: "#666" }}>Loading package data...</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    if (packageNotFound) {
        return (
            <section className="main-sec">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6 text-center">
                            <div className="error-container" style={{ padding: "4rem 0" }}>
                                <h4 style={{ color: "#ef5350", marginBottom: "1rem" }}>Package Not Found</h4>
                                <p style={{ color: "#666", marginBottom: "2rem" }}>
                                    The package you're looking for doesn't exist or has been deleted.
                                </p>
                                <Link to="/packages" className="btn btn-info text-white">
                                    <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                                    Back to Packages
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

        .form-label {
          font-weight: 600;
          color: #555;
          margin-bottom: 0.5rem;
        }

        .form-control {
          border-radius: 8px;
          border: 1px solid #ddd;
          padding: 0.75rem 1rem;
          transition: all 0.3s ease;
        }

        .form-control:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.25);
        }

        .form-section {
          background: #f8f9ff;
          border-radius: 10px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          border-left: 4px solid #667eea;
        }

        .section-title {
          color: #667eea;
          font-weight: 700;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .file-upload-container {
          margin-bottom: 1.5rem;
        }

        .file-upload-area {
          border: 2px dashed #ddd;
          border-radius: 10px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .file-upload-area.dragging {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.1);
        }

        .file-upload-area:hover {
          border-color: #667eea;
        }

        .file-upload-icon {
          font-size: 3rem;
          color: #667eea;
          margin-bottom: 1rem;
        }

        .file-upload-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .file-upload-subtext {
          color: #666;
          font-size: 0.9rem;
        }

        .file-upload-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .file-preview-container {
          position: relative;
          display: inline-block;
        }

        .file-preview {
          max-width: 200px;
          max-height: 200px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .existing-image {
          max-width: 200px;
          max-height: 200px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          margin-bottom: 1rem;
        }

        .file-remove-btn {
          position: absolute;
          top: -10px;
          right: -10px;
          background: #ef5350;
          color: white;
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .file-info {
          margin-top: 1rem;
          font-size: 0.9rem;
          color: #666;
        }

        .existing-image-info {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 1rem;
        }

        .btn-for-add {
          background: #008080;
          border: none;
          border-radius: 8px;
          padding: 0.75rem 2rem;
          font-weight: 600;
          transition: all 0.3s ease;
          color: white;
        }

        .btn-for-add:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .btn-for-add:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-info {
          background: #4facfe;
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-info:hover {
          background: #2f86fe;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(79, 172, 254, 0.3);
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 0.5rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .cards {
            padding: 1.5rem;
          }
          
          .form-section {
            padding: 1rem;
          }
        }
      `}</style>

            <section className="main-sec">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="dashboard-title">
                                <h4 className="dash-head">
                                    <FontAwesomeIcon icon={faBoxOpen} className="me-2" />
                                    Edit Package
                                </h4>
                            </div>
                            <div className="custom-bredcump">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link to="/">Dashboard</Link>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <Link to="/test-packages">Packages</Link>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            Edit Package
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                        <div className="col-lg-6 d-flex justify-content-end">
                            <Link to="/test-packages" className="btn btn-info text-white">
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
                                        <h5 className="section-title">Package Details</h5>
                                        <div className="row">
                                            <div className="col-lg-6 mb-4">
                                                <label htmlFor="title" className="form-label">
                                                    Title<sup className="text-danger">*</sup>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="title"
                                                    placeholder="Enter package title"
                                                    onChange={changeHandler}
                                                    value={formval?.title}
                                                />
                                            </div>
                                            <div className="col-lg-6 mb-4">
                                                <label htmlFor="price" className="form-label">
                                                    Price (₹)<sup className="text-danger">*</sup>
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="price"
                                                    placeholder="Enter price"
                                                    onChange={changeHandler}
                                                    value={formval?.price}
                                                />
                                            </div>
                                            <div className="col-lg-6 mb-4">
                                                <label htmlFor="offerPrice" className="form-label">
                                                    Offer Price (₹)
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="offerPrice"
                                                    placeholder="Enter offer price"
                                                    onChange={changeHandler}
                                                    value={formval?.offerPrice}
                                                />
                                            </div>
                                            <div className="col-lg-12 mb-4">
                                                <label htmlFor="description" className="form-label">
                                                    Description<sup className="text-danger">*</sup>
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    name="description"
                                                    rows="4"
                                                    placeholder="Enter package description"
                                                    onChange={changeHandler}
                                                    value={formval?.description}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Package Image */}
                                    <div className="form-section">
                                        <h5 className="section-title">Package Image</h5>

                                        {/* Show existing image if available */}
                                        {existingImage && !selectedFile && (
                                            <div className="existing-image-container mb-3">
                                                <div className="existing-image-info">Current Image:</div>
                                                <img
                                                    src={`${existingImage}`}
                                                    alt="Current package"
                                                    className="existing-image"
                                                    onError={(e) => {
                                                        e.target.style.display = "none"
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div className="file-upload-container">
                                            <div
                                                className={`file-upload-area ${isDragging ? "dragging" : ""}`}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                            >
                                                {!selectedFile ? (
                                                    <>
                                                        <div className="file-upload-icon">
                                                            <FontAwesomeIcon icon={faUpload} />
                                                        </div>
                                                        <div className="file-upload-text">
                                                            {existingImage ? "Upload new image to replace current" : "Drag & Drop your image here"}
                                                        </div>
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
                                                        <div className="file-info">
                                                            {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-section">
                                        <h5 className="section-title">Category Selection</h5>
                                        <div className="row">
                                            <div className="col-lg-12 mb-4">
                                                <label htmlFor="subcategoryID" className="form-label">
                                                    Subcategory<sup className="text-danger">*</sup>
                                                </label>
                                                <select
                                                    className="form-control"
                                                    name="subcategoryID"
                                                    onChange={changeHandler}
                                                    value={formval?.subcategoryID}
                                                >
                                                    <option value="">Select Subcategory</option>
                                                    {subcategories.map((subcat) => (
                                                        <option key={subcat._id} value={subcat._id}>
                                                            {subcat.title}
                                                        </option>
                                                    ))}
                                                </select>
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
                                            {loading ? "Updating..." : "Update Package"}
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
