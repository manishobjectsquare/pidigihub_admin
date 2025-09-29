"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { baseUrl } from "../../config/baseUrl"
import axios from "axios"
import toastify from "../../config/toastify"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faEdit, faSave, faPlus, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons"

export default function TestEdit() {
    const { id } = useParams()
    const [formval, setFormval] = useState({
        title: "",
        description: "",
        duration: "",
        marks: "",
        positiveMark: "",
        negativeMark: "",
        packageId: "",
        isFree: true,
        language: "English",
        status: "active",
    })

    const [selectedQuestions, setSelectedQuestions] = useState([])
    const [availableQuestions, setAvailableQuestions] = useState([])
    const [packages, setPackages] = useState([])
    const [loading, setLoading] = useState(false)
    const [fetchingTest, setFetchingTest] = useState(true)
    const [fetchingQuestions, setFetchingQuestions] = useState(false)
    const [fetchingPackages, setFetchingPackages] = useState(false)
    const [questionSearchTerm, setQuestionSearchTerm] = useState("")
    const [subjectFilter, setSubjectFilter] = useState("")
    const [subjects, setSubjects] = useState([])
    const [testNotFound, setTestNotFound] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        fetchTestData()
        fetchPackages()
        fetchQuestions()
    }, [id])

    useEffect(() => {
        // Extract unique subjects from questions
        if (availableQuestions.length > 0) {
            const uniqueSubjects = [...new Set(availableQuestions.map((q) => q.subject).filter(Boolean))]
            setSubjects(uniqueSubjects)
        }
    }, [availableQuestions])

    const fetchTestData = async () => {
        try {
            setFetchingTest(true)
            const response = await axios.get(`${baseUrl}/test`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })

            if (response.data.status) {
                const tests = response.data.data || []
                const currentTest = tests.find((test) => test._id === id)

                if (currentTest) {
                    setFormval({
                        title: currentTest.title || "",
                        description: currentTest.description || "",
                        duration: currentTest.duration?.toString() || "",
                        marks: currentTest.marks?.toString() || "",
                        positiveMark: currentTest.positiveMark?.toString() || "",
                        negativeMark: currentTest.negativeMark?.toString() || "",
                        packageId: currentTest.packageId || "",
                        isFree: currentTest.isFree ?? true,
                        language: currentTest.language || "English",
                        status: currentTest.status || "active",
                    })

                    // If test has questions, we'll fetch and pre-select them
                    if (currentTest.questions && currentTest.questions.length > 0) {
                        fetchTestQuestions(currentTest.questions)
                    }
                } else {
                    setTestNotFound(true)
                    toastify.error("Test not found")
                }
            }
        } catch (error) {
            console.error("Error fetching test data:", error)
            toastify.error("Failed to fetch test data")
            setTestNotFound(true)
        } finally {
            setFetchingTest(false)
        }
    }

    const fetchTestQuestions = async (questionIds) => {
        try {
            // Fetch questions and filter the ones that belong to this test
            const response = await axios.get(`${baseUrl}/question`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })

            if (response.data.status) {
                const allQuestions = response.data.data || []
                const testQuestions = allQuestions.filter((q) => questionIds.includes(q._id))
                setSelectedQuestions(testQuestions)
            }
        } catch (error) {
            console.error("Error fetching test questions:", error)
        }
    }

    const fetchPackages = async () => {
        try {
            setFetchingPackages(true)
            const response = await axios.get(`${baseUrl}/package`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })
            if (response.data.status) {
                setPackages(response.data.data || [])
            }
        } catch (error) {
            console.error("Error fetching packages:", error)
        } finally {
            setFetchingPackages(false)
        }
    }

    const fetchQuestions = async () => {
        try {
            setFetchingQuestions(true)
            const response = await axios.get(`${baseUrl}/question`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })
            if (response.data.status) {
                setAvailableQuestions(response.data.data || [])
            }
        } catch (error) {
            console.error("Error fetching questions:", error)
            toastify.error("Failed to fetch questions")
        } finally {
            setFetchingQuestions(false)
        }
    }

    const changeHandler = (e) => {
        const { name, value, type, checked } = e.target
        setFormval((prevVal) => ({
            ...prevVal,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const getQuestionText = (question, language) => {
        switch (language.toLowerCase()) {
            case "english":
                return question.question_english || question.questions || "Question not available"
            case "bengali":
                return question.question_bengali || question.questions || "Question not available"
            case "hindi":
                return question.question_hindi || question.questions || "Question not available"
            default:
                return question.question_english || question.questions || "Question not available"
        }
    }

    // const handleAddQuestion = (question) => {
    //     if (!selectedQuestions.find((q) => q._id === question._id)) {
    //         setSelectedQuestions([...selectedQuestions, question])
    //     }
    // }

    // const handleRemoveQuestion = (questionId) => {
    //     setSelectedQuestions(selectedQuestions.filter((q) => q._id !== questionId))
    // }

    // const filteredQuestions = availableQuestions.filter((question) => {
    //     const questionText = getQuestionText(question, formval.language)
    //     const subject = question.subject || ""
    //     const topic = question.topic || ""
    //     const questionId = question.questionId || ""

    //     const matchesSearch =
    //         questionText.toLowerCase().includes(questionSearchTerm.toLowerCase()) ||
    //         subject.toLowerCase().includes(questionSearchTerm.toLowerCase()) ||
    //         topic.toLowerCase().includes(questionSearchTerm.toLowerCase()) ||
    //         questionId.toLowerCase().includes(questionSearchTerm.toLowerCase())

    //     const matchesSubject = subjectFilter === "" || subject === subjectFilter

    //     return matchesSearch && matchesSubject && !selectedQuestions.find((q) => q._id === question._id)
    // })

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Form validation
        if (!formval.title) {
            return toastify.error("Title is required")
        }
        if (!formval.description) {
            return toastify.error("Description is required")
        }
        if (!formval.duration) {
            return toastify.error("Duration is required")
        }
        if (!formval.marks) {
            return toastify.error("Total marks is required")
        }
        if (!formval.positiveMark) {
            return toastify.error("Positive mark is required")
        }
        if (!formval.negativeMark && formval.negativeMark !== 0) {
            return toastify.error("Negative mark is required")
        }

        setLoading(true)

        try {
            const payload = {
                title: formval.title,
                description: formval.description,
                duration: Number.parseInt(formval.duration),
                marks: Number.parseInt(formval.marks),
                positiveMark: Number.parseInt(formval.positiveMark),
                negativeMark: Number.parseInt(formval.negativeMark),
                packageId: formval.packageId || null,
                isFree: formval.isFree,
                language: formval.language,
                status: formval.status,
                questions: selectedQuestions.map((q) => q._id), // Send question IDs
            }

            const response = await axios.patch(`${baseUrl}/test/${id}`, payload, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            })

            if (response.data.status) {
                toastify.success("Test updated successfully")
                navigate("/test-series")
            } else {
                toastify.error(response.data.message || "An error occurred while updating test")
            }
        } catch (error) {
            console.error("Error:", error)
            toastify.error(error.response?.data?.message || "Failed to update test")
        } finally {
            setLoading(false)
        }
    }

    if (fetchingTest) {
        return (
            <section className="main-sec">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="cards">
                                <div className="loading-message">
                                    <div className="loading-spinner" style={{ display: "inline-block" }}></div>
                                    <span className="ms-2">Loading test data...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    if (testNotFound) {
        return (
            <section className="main-sec">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="cards">
                                <div className="empty-message">
                                    <h5>Test Not Found</h5>
                                    <p>The test you're looking for doesn't exist or has been deleted.</p>
                                    <Link to="/test-series" className="btn btn-info text-white">
                                        <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                                        Back to Tests
                                    </Link>
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
            <style jsx>{`
        
        .section-title {
          color: #667eea;
          font-weight: 700;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .checkbox-container input[type="checkbox"] {
          accent-color: #667eea;
          width: 18px;
          height: 18px;
        }

        .question-selection-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .search-container {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }

        .search-input {
          padding-left: 2.5rem;
          width: 100%;
        }

        .filter-container {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .filter-select {
          flex: 1;
          min-width: 200px;
          border-radius: 8px;
          border: 1px solid #ddd;
          padding: 0.75rem 1rem;
          background-color: white;
        }

        .available-questions {
          border: 1px solid #ddd;
          border-radius: 8px;
          max-height: 400px;
          overflow-y: auto;
        }

        .question-item {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 1rem;
          border-bottom: 1px solid #eee;
          transition: all 0.3s ease;
        }

        .question-item:last-child {
          border-bottom: none;
        }

        .question-item:hover {
          background: #f8f9ff;
        }

        .question-info {
          flex: 1;
          margin-right: 1rem;
        }

        .question-text {
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .question-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #666;
        }

        .question-subject {
          background: #e3f2fd;
          color: #1976d2;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-weight: 600;
        }

        .question-topic {
          background: #f3e5f5;
          color: #7b1fa2;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-weight: 600;
        }

        .question-id {
          background: #e8f5e8;
          color: #388e3c;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-weight: 600;
        }

        .add-question-btn {
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .add-question-btn:hover {
          background: #5a6eea;
          transform: scale(1.1);
        }

        .selected-questions {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1rem;
          max-height: 300px;
          overflow-y: auto;
        }

        .selected-question-item {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 0.75rem;
          background: #f8f9ff;
          border-radius: 8px;
          margin-bottom: 0.75rem;
        }

        .selected-question-item:last-child {
          margin-bottom: 0;
        }

        .remove-question-btn {
          background: #ef5350;
          color: white;
          border: none;
          border-radius: 6px;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .remove-question-btn:hover {
          background: #e53935;
          transform: scale(1.1);
        }

        .empty-message {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        .loading-message {
          text-align: center;
          padding: 2rem;
          color: #667eea;
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

        .question-count-badge {
          background: #667eea;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-left: 0.5rem;
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
          
          .question-item {
            flex-direction: column;
            gap: 1rem;
          }
          
          .question-meta {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>

            <section className="main-sec">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="dashboard-title">
                                <h4 className="dash-head">
                                    <FontAwesomeIcon icon={faEdit} className="me-2" />
                                    Edit Test
                                </h4>
                            </div>
                            <div className="custom-bredcump">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link to="/">Dashboard</Link>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <Link to="/test-series">Tests</Link>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            Edit Test
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                        <div className="col-lg-6 d-flex justify-content-end">
                            <Link to="/test-series" className="btn btn-info text-white">
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
                                        <h5 className="section-title">Basic Information</h5>
                                        <div className="row">
                                            <div className="col-lg-6 mb-4">
                                                <label htmlFor="title" className="form-label">
                                                    Title<sup className="text-danger">*</sup>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="title"
                                                    placeholder="Enter test title"
                                                    onChange={changeHandler}
                                                    value={formval?.title}
                                                />
                                            </div>
                                            <div className="col-lg-6 mb-4">
                                                <label htmlFor="language" className="form-label">
                                                    Language<sup className="text-danger">*</sup>
                                                </label>
                                                <select
                                                    className="form-control"
                                                    name="language"
                                                    onChange={changeHandler}
                                                    value={formval?.language}
                                                >
                                                    <option value="English">English</option>
                                                    <option value="Hindi">Hindi</option>
                                                    <option value="Bengali">Bengali</option>
                                                </select>
                                            </div>
                                            <div className="col-lg-12 mb-4">
                                                <label htmlFor="description" className="form-label">
                                                    Description<sup className="text-danger">*</sup>
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    name="description"
                                                    rows="4"
                                                    placeholder="Enter test description"
                                                    onChange={changeHandler}
                                                    value={formval?.description}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Test Configuration */}
                                    <div className="form-section">
                                        <h5 className="section-title">Test Configuration</h5>
                                        <div className="row">
                                            <div className="col-lg-4 mb-4">
                                                <label htmlFor="duration" className="form-label">
                                                    Duration (minutes)<sup className="text-danger">*</sup>
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="duration"
                                                    placeholder="60"
                                                    onChange={changeHandler}
                                                    value={formval?.duration}
                                                />
                                            </div>
                                            <div className="col-lg-4 mb-4">
                                                <label htmlFor="marks" className="form-label">
                                                    Total Marks<sup className="text-danger">*</sup>
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="marks"
                                                    placeholder="100"
                                                    onChange={changeHandler}
                                                    value={formval?.marks}
                                                />
                                            </div>
                                            <div className="col-lg-4 mb-4">
                                                <label htmlFor="packageId" className="form-label">
                                                    Package
                                                </label>
                                                <select
                                                    className="form-control"
                                                    name="packageId"
                                                    onChange={changeHandler}
                                                    value={formval?.packageId}
                                                    disabled={fetchingPackages}
                                                >
                                                    <option value="">Select Package</option>
                                                    {packages.map((pkg) => (
                                                        <option key={pkg._id} value={pkg?._id}>
                                                            {pkg?.title}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-lg-6 mb-4">
                                                <label htmlFor="positiveMark" className="form-label">
                                                    Positive Mark<sup className="text-danger">*</sup>
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="positiveMark"
                                                    placeholder="1"
                                                    onChange={changeHandler}
                                                    value={formval?.positiveMark}
                                                />
                                            </div>
                                            <div className="col-lg-6 mb-4">
                                                <label htmlFor="negativeMark" className="form-label">
                                                    Negative Mark<sup className="text-danger">*</sup>
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="negativeMark"
                                                    placeholder="0"
                                                    onChange={changeHandler}
                                                    value={formval?.negativeMark}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Question Selection */}
                                    {/* <div className="form-section">
                                        <h5 className="section-title">
                                            Select Questions
                                            <span className="question-count-badge">{selectedQuestions.length} Selected</span>
                                        </h5>
                                        <div className="question-selection-container">
                                            <div className="filter-container">
                                                <div className="search-container" style={{ flex: 2 }}>
                                                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                                                    <input
                                                        type="text"
                                                        className="form-control search-input"
                                                        placeholder="Search questions by text, subject, topic or ID..."
                                                        value={questionSearchTerm}
                                                        onChange={(e) => setQuestionSearchTerm(e.target.value)}
                                                    />
                                                </div>

                                                <select
                                                    className="filter-select"
                                                    value={subjectFilter}
                                                    onChange={(e) => setSubjectFilter(e.target.value)}
                                                >
                                                    <option value="">All Subjects</option>
                                                    {subjects.map((subject) => (
                                                        <option key={subject} value={subject}>
                                                            {subject}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="available-questions">
                                                {fetchingQuestions ? (
                                                    <div className="loading-message">
                                                        <div className="loading-spinner" style={{ display: "inline-block" }}></div>
                                                        <span className="ms-2">Loading questions...</span>
                                                    </div>
                                                ) : filteredQuestions.length === 0 ? (
                                                    <div className="empty-message">
                                                        {questionSearchTerm || subjectFilter
                                                            ? "No matching questions found"
                                                            : availableQuestions.length === 0
                                                                ? "No questions available"
                                                                : "All questions have been selected"}
                                                    </div>
                                                ) : (
                                                    filteredQuestions.map((question) => (
                                                        <div key={question._id} className="question-item">
                                                            <div className="question-info">
                                                                <div className="question-text">{getQuestionText(question, formval.language)}</div>
                                                                <div className="question-meta">
                                                                    {question.subject && <span className="question-subject">{question.subject}</span>}
                                                                    {question.topic && <span className="question-topic">{question.topic}</span>}
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="add-question-btn"
                                                                onClick={() => handleAddQuestion(question)}
                                                                title="Add to test"
                                                            >
                                                                <FontAwesomeIcon icon={faPlus} />
                                                            </button>
                                                        </div>
                                                    ))
                                                )}
                                            </div>

                                            <div className="mt-4">
                                                <h6 className="mb-3">
                                                    <FontAwesomeIcon icon={faEdit} className="me-2" />
                                                    Selected Questions ({selectedQuestions.length})
                                                </h6>
                                                <div className="selected-questions">
                                                    {selectedQuestions.length === 0 ? (
                                                        <div className="empty-message">No questions selected yet</div>
                                                    ) : (
                                                        selectedQuestions.map((question) => (
                                                            <div key={question._id} className="selected-question-item">
                                                                <div className="question-info">
                                                                    <div className="question-text">{getQuestionText(question, formval.language)}</div>
                                                                    <div className="question-meta">
                                                                        {question.questionId && (
                                                                            <span className="question-id">ID: {question.questionId}</span>
                                                                        )}
                                                                        {question.subject && <span className="question-subject">{question.subject}</span>}
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    className="remove-question-btn"
                                                                    onClick={() => handleRemoveQuestion(question._id)}
                                                                    title="Remove from test"
                                                                >
                                                                    <FontAwesomeIcon icon={faTimes} />
                                                                </button>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}

                                    {/* Settings */}
                                    <div className="form-section mt-2">
                                        <div className="row">
                                            <div className="col-lg-6 mb-4">
                                                <label htmlFor="status" className="form-label">
                                                    Status<sup className="text-danger">*</sup>
                                                </label>
                                                <select className="form-control" name="status" onChange={changeHandler} value={formval?.status}>
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                            </div>
                                            <div className="col-lg-6 mb-4">
                                                <div className="checkbox-container">
                                                    <input type="checkbox" name="isFree" checked={formval.isFree} onChange={changeHandler} />
                                                    <label>Free Test</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-12 text-center mt-4">
                                        <button type="submit" className="btn btn-for-add text-white" disabled={loading}>
                                            {loading && <div className="loading-spinner"></div>}
                                            <FontAwesomeIcon icon={faSave} className="me-2" />
                                            {loading ? "Updating..." : "Update Test"}
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
