
import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import axios from "axios"
import { baseUrl } from "../../config/baseUrl"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGraduationCap, faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { toast } from "react-toastify"

export default function ViewExam() {
    const navigate = useNavigate()
    const { id } = useParams() // Get exam ID from URL
    const [loading, setLoading] = useState(false)
    const [fetchingData, setFetchingData] = useState(true)
    const [fetchingSections, setFetchingSections] = useState(false)

    const [sections, setSections] = useState([])
    const [errors, setErrors] = useState({})

    // Form state - updated to match API structure
    const [formData, setFormData] = useState({

        exam_title: "",
        exam_year: "",
        duration: "",
        section_id: "",
        total_score: "",
        negative_score: "",
        options_per_question: "",
        score_per_question: "",
        description: "",
        mark_review: "",
        status: "inactive",

        packages: [
            {
                package_name: "",
                price: "",
                no_of_attempts: ""
            }
        ]
    })


    // PDF file state
    const [pdfFile, setPdfFile] = useState(null)
    const [pdfFileName, setPdfFileName] = useState("")
    const [existingPdfUrl, setExistingPdfUrl] = useState("")

    useEffect(() => {

        fetchSections()
        fetchExamData()
    }, [id])

    const fetchExamData = async () => {
        try {
            setFetchingData(true)
            const response = await axios.get(`${baseUrl}/exams/${id}`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })

            if (response?.data?.status && response?.data?.data) {
                const exam = response.data.data

                setFormData({
                    exam_title: exam.exam_title || "",
                    exam_year: exam.exam_year?.toString() || "",
                    duration: exam.duration?.toString() || "",
                    section_id: exam.section_id?._id || "",
                    total_score: exam.total_score?.toString() || "",
                    negative_score: exam.negative_score?.toString() || "",
                    options_per_question: exam.options_per_question?.toString() || "",
                    score_per_question: exam.score_per_question?.toString() || "",
                    description: exam.description || "",
                    mark_review: exam.mark_review ? "yes" : "no",
                    status: exam.status || "inactive",
                    author: exam?.author,
                })

                // Set existing PDF URL if available
                if (exam.pdf_url) {
                    setExistingPdfUrl(exam.pdf_url)
                }
            } else {
                toast.error("Failed to fetch exam data")
                navigate("/exams")
            }
        } catch (error) {
            console.error("Error fetching exam data:", error)
            toast.error("Failed to fetch exam data")
            navigate("/exams")
        } finally {
            setFetchingData(false)
        }
    }


    const fetchSections = async () => {
        try {
            setFetchingSections(true)
            const response = await axios.get(`${baseUrl}/sections`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })

            if (response?.data?.status) {
                // Filter only active sections
                const activeSections = response?.data?.data?.filter((section) => section?.status === "active") || []
                setSections(activeSections)
            } else {
                toast.error(response?.data?.message || "Failed to fetch sections")
            }
        } catch (error) {
            console.error("Error fetching sections:", error)
            toast.error("Failed to fetch sections")
        } finally {
            setFetchingSections(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        // Clear error when field is edited
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            })
        }
    }

    const handleDescriptionChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            description: value,
        }))
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Validate file type
            if (file.type !== "application/pdf") {
                toast.error("Please select a valid PDF file")
                return
            }

            // Validate file size (10MB limit)
            const maxSize = 10 * 1024 * 1024 // 10MB in bytes
            if (file.size > maxSize) {
                toast.error("File size should not exceed 10MB")
                return
            }

            setPdfFile(file)
            setPdfFileName(file.name)

            // Clear error if exists
            if (errors.pdfFile) {
                setErrors((prev) => ({ ...prev, pdfFile: "" }))
            }
        }
    }

    const handleRemoveFile = () => {
        setPdfFile(null)
        setPdfFileName("")
        // Reset file input
        const fileInput = document.getElementById("pdfFile")
        if (fileInput) {
            fileInput.value = ""
        }
    }

    const validateForm = () => {
        const newErrors = {}

        // Required field validation

        if (!formData.exam_title?.trim()) newErrors.exam_title = "Exam title is required"
        if (!formData.section_id) newErrors.section_id = "Section is required"
        if (!formData.exam_year) newErrors.exam_year = "Exam year is required"
        if (!formData.duration) newErrors.duration = "Duration is required"
        if (!formData.total_score) newErrors.total_score = "Total score is required"
        if (!formData.options_per_question) newErrors.options_per_question = "Options per question is required"
        if (!formData.score_per_question) newErrors.score_per_question = "Score per question is required"


        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }





    const handleCancel = () => {
        navigate(-1) // Go back to previous page
    }

    // Show loading spinner while fetching data
    if (fetchingData) {
        return (
            <section className="main-sec">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="cards">
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-3">Loading exam data...</p>
                                </div>
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
                                    <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
                                    View Exam
                                </h4>
                            </div>
                            <div className="custom-bredcump">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link to="/">Dashboard</Link>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <Link to="/exams">Exams</Link>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            View Exam
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                        <div className="col-lg-6 d-flex justify-content-end align-items-start">
                            <button onClick={handleCancel} className="btn-add-question me-2">
                                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                                Back
                            </button>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="cards">
                                <form >
                                    <div className="row">
                                        {/* Exam Title */}
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">
                                                Exam Title <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="exam_title"
                                                className={`form-control ${errors.exam_title ? "is-invalid" : ""}`}
                                                placeholder="Enter exam title"
                                                value={formData.exam_title}
                                                onChange={handleInputChange}
                                                disabled
                                            />
                                            {errors.exam_title && <div className="invalid-feedback">{errors.exam_title}</div>}
                                        </div>

                                        {/* Exam Year */}
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">
                                                Exam Year <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="exam_year"
                                                className={`form-control ${errors.exam_year ? "is-invalid" : ""}`}
                                                value={formData.exam_year}
                                                onChange={handleInputChange}
                                                min="2020"
                                                max="2030"
                                                disabled
                                            />
                                            {errors.exam_year && <div className="invalid-feedback">{errors.exam_year}</div>}
                                        </div>

                                        {/* Duration */}
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">
                                                Duration (Minutes) <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="duration"
                                                className={`form-control ${errors.duration ? "is-invalid" : ""}`}
                                                placeholder="Duration in minutes"
                                                value={formData.duration}
                                                onChange={handleInputChange}
                                                min="1"
                                                disabled
                                            />
                                            {errors.duration && <div className="invalid-feedback">{errors.duration}</div>}
                                        </div>

                                        {/* Section */}
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">
                                                Section <span className="text-danger">*</span>
                                            </label>
                                            <select
                                                name="section_id"
                                                className={`form-select ${errors.section_id ? "is-invalid" : ""}`}
                                                value={formData.section_id}
                                                onChange={handleInputChange}
                                                disabled
                                            >
                                                <option value="">-- Select Section --</option>
                                                {sections.map((section) => (
                                                    <option key={section._id} value={section._id}>
                                                        {section.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.section_id && <div className="invalid-feedback">{errors.section_id}</div>}
                                            {fetchingSections && (
                                                <div className="text-muted mt-1">
                                                    <small>Loading sections...</small>
                                                </div>
                                            )}
                                        </div>

                                        {/* Total Score */}
                                        <div className="col-md-3 mb-3">
                                            <label className="form-label">
                                                Total Score <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="total_score"
                                                className={`form-control ${errors.total_score ? "is-invalid" : ""}`}
                                                value={formData.total_score}
                                                onChange={handleInputChange}
                                                min="1"
                                                disabled
                                            />
                                            {errors.total_score && <div className="invalid-feedback">{errors.total_score}</div>}
                                        </div>

                                        {/* Negative Score */}
                                        <div className="col-md-3 mb-3">
                                            <label className="form-label">Negative Score</label>
                                            <input
                                                type="number"
                                                name="negative_score"
                                                className="form-control"
                                                value={formData.negative_score}
                                                onChange={handleInputChange}
                                                step="0.1"
                                                min="0"
                                                placeholder="0.25"
                                                disabled
                                            />
                                        </div>

                                        {/* Options per Question */}
                                        <div className="col-md-3 mb-3">
                                            <label className="form-label">
                                                Options per Question <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="options_per_question"
                                                className={`form-control ${errors.options_per_question ? "is-invalid" : ""}`}
                                                value={formData.options_per_question}
                                                onChange={handleInputChange}
                                                min="2"
                                                max="6"
                                                disabled
                                            />
                                            {errors.options_per_question && (
                                                <div className="invalid-feedback">{errors.options_per_question}</div>
                                            )}
                                        </div>

                                        {/* Score per Question */}
                                        <div className="col-md-3 mb-3">
                                            <label className="form-label">
                                                Score per Question <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="score_per_question"
                                                className={`form-control ${errors.score_per_question ? "is-invalid" : ""}`}
                                                value={formData.score_per_question}
                                                onChange={handleInputChange}
                                                step="0.1"
                                                min="0.1"
                                                disabled
                                            />
                                            {errors.score_per_question && <div className="invalid-feedback">{errors.score_per_question}</div>}
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label className="form-label">
                                                Author <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="author"
                                                className={`form-control ${errors.author ? "is-invalid" : ""}`}
                                                value={formData.author}
                                                onChange={handleInputChange}
                                                disabled
                                            />
                                            {errors.author && <div className="invalid-feedback">{errors.author}</div>}
                                        </div>
                                        {/* PDF File Upload */}
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">Choose a PDF File</label>

                                            {/* Show existing PDF if available */}
                                            {existingPdfUrl && !pdfFile && (
                                                <div className="mb-2">
                                                    <div className="alert alert-info d-flex align-items-center">
                                                        <i className="fas fa-file-pdf text-danger me-2"></i>
                                                        <span>Current PDF: </span>
                                                        <a
                                                            href={`${baseUrl}/${existingPdfUrl}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="ms-2"
                                                        >
                                                            View Current PDF
                                                        </a>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="file-upload-container">
                                                <input
                                                    type="file"
                                                    id="pdfFile"
                                                    name="pdfFile"
                                                    accept=".pdf"
                                                    onChange={handleFileUpload}
                                                    className="d-none"
                                                    disabled
                                                />

                                                <div className="file-upload-area" onClick={() => document.getElementById("pdfFile").click()}>
                                                    {pdfFile ? (
                                                        <div className="file-selected">
                                                            <i className="fas fa-file-pdf text-danger me-2"></i>
                                                            <span className="file-name">{pdfFileName}</span>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger ms-2"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handleRemoveFile()
                                                                }}
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="file-placeholder">
                                                            <i className="fas fa-cloud-upload-alt mb-2"></i>
                                                            <p className="mb-1">Click to browse PDF file</p>
                                                            <small className="text-muted">Maximum file size: 10MB</small>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {errors.pdfFile && <div className="invalid-feedback d-block">{errors.pdfFile}</div>}
                                        </div>

                                        {/* Description */}
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">Description</label>
                                            <ReactQuill
                                                theme="snow"
                                                value={formData.description}
                                                onChange={handleDescriptionChange}
                                                disabled
                                            />
                                        </div>

                                        {/* Mark Review */}
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Mark Review</label>
                                            <select
                                                name="mark_review"
                                                className="form-select"
                                                value={formData.mark_review}
                                                onChange={handleInputChange}
                                                disabled
                                            >
                                                <option value="">-- Select Mark Review --</option>
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                            </select>
                                        </div>

                                        {/* Status */}
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">
                                                Status <span className="text-danger">*</span>
                                            </label>
                                            <select
                                                name="status"
                                                className="form-select"
                                                value={formData.status}
                                                onChange={handleInputChange}
                                                disabled
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
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
