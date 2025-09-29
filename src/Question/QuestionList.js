import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import empty from "../assets/images/empty-box.png";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faFileDownload,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { baseUrl } from "../config/baseUrl";

export default function QuestionList() {
  const [questions, setQuestions] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [subtopicFilter, setSubtopicFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const fileInputRef = useRef(null);
  let [excelSearch, setExcelSearch] = useState(
    new URLSearchParams({
      name: searchTerm,
      status: statusFilter,
    })
  );

  // useEffect(() => {
  //   fetchAllData();
  // }, [currentPage, statusFilter, subjectFilter, topicFilter, subtopicFilter]);

  // useEffect(() => {
  //   const delayDebounce = setTimeout(() => {
  //     fetchAllData();
  //   }, 1000);

  //   return () => clearTimeout(delayDebounce); // 🧹 Clear timeout on every keystroke
  // }, [searchTerm]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchAllData();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [
    searchTerm,
    currentPage,
    statusFilter,
    subjectFilter,
    topicFilter,
    subtopicFilter,
    sectionFilter,
    // languageFilter,
  ]);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: questionsPerPage.toString(),
      });

      if (searchTerm) params.append("name", searchTerm);
      if (statusFilter) params.append("status", statusFilter);
      if (subjectFilter) params.append("subject", subjectFilter);
      if (topicFilter) params.append("topic", topicFilter);
      if (subtopicFilter) params.append("subtopic", subtopicFilter);
      if (sectionFilter) params.append("section", sectionFilter);
      setExcelSearch(
        new URLSearchParams({
          name: searchTerm,
          status: statusFilter,
          subject: subjectFilter,
          topic: topicFilter,
          subtopic: subtopicFilter,
          section: sectionFilter,
        })
      );

      const [
        questionsResponse,
        subjectsResponse,
        sectionResponse,
        topicsResponse,
        subtopicsResponse,
      ] = await Promise.all([
        fetch(`${baseUrl}/questions?${params.toString()}`, {
          headers: { Authorization: localStorage.getItem("token") },
        }),
        fetch(`${baseUrl}/subjects`, {
          headers: { Authorization: localStorage.getItem("token") },
        }),
        fetch(`${baseUrl}/sections`, {
          headers: { Authorization: localStorage.getItem("token") },
        }),
        fetch(`${baseUrl}/topics?subject=${subjectFilter}`, {
          headers: { Authorization: localStorage.getItem("token") },
        }),
        fetch(`${baseUrl}/subtopics?${params.toString()}`, {
          headers: { Authorization: localStorage.getItem("token") },
        }),
      ]);

      const questionsData = await questionsResponse.json();
      const subjectsData = await subjectsResponse.json();
      const sectionData = await sectionResponse.json();
      const topicsData = await topicsResponse.json();
      const subtopicsData = await subtopicsResponse.json();

      if (questionsData.status) {
        setQuestions(questionsData.data || []);
        setTotalPages(questionsData.pageInfo?.totalPages || 1);
        setTotalQuestions(questionsData.pageInfo?.total || 0);
      }

      if (subjectsData.status) {
        setSubjects(subjectsData.data || []);
      }
      if (sectionData.status) {
        setSections(sectionData.data || []);
      }

      if (topicsData.status) {
        setTopics(topicsData.data || []);
      }

      if (subtopicsData.status) {
        setSubtopics(subtopicsData.data || []);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
      setQuestions([]);
      setSubjects([]);
      setTopics([]);
      setSubtopics([]);
      setLoading(false);
    }
  };

  // Helper function to get subject name by ID
  const getSubjectNameById = (subjectId) => {
    if (!subjectId) return "N/A";
    const subject = subjects.find((s) => s._id === subjectId);
    return subject ? subject.name : "Unknown Subject";
  };

  // Helper function to get topic name by ID
  const getTopicNameById = (topicId) => {
    if (!topicId) return "N/A";
    const topic = topics.find((t) => t._id === topicId);
    return topic ? topic.topic_name : "Unknown Topic";
  };

  // Helper function to get subtopic name by ID
  const getSubtopicNameById = (subtopicId) => {
    if (!subtopicId) return "N/A";
    const subtopic = subtopics.find((st) => st._id === subtopicId);
    return subtopic ? subtopic.sub_topic_name : "Unknown Subtopic";
  };

  const handleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      const response = await fetch(`${baseUrl}/questions/status/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.status) {
        // Update local state immediately for better UX
        setQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
            q._id === id ? { ...q, status: newStatus } : q
          )
        );
        toast.success("Status updated successfully");
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${baseUrl}/questions/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        const data = await response.json();

        if (data.status) {
          // Update local state immediately
          setQuestions((prevQuestions) =>
            prevQuestions.filter((q) => q._id !== id)
          );
          setTotalQuestions((prev) => prev - 1);
          toast.success("Question deleted successfully");
        } else {
          toast.error(data.message || "Failed to delete question");
        }
      } catch (error) {
        console.error("Error deleting question:", error);
        toast.error("Failed to delete question");
      }
    }
  };

  // Get unique subjects for filter
  const getUniqueSubjects = () => {
    const subjectSet = new Set();
    questions.forEach((question) => {
      if (question.subject_id) {
        subjectSet.add(
          JSON.stringify({
            id: question.subject_id._id,
            name: question.subject_id.name,
          })
        );
      }
    });
    return Array.from(subjectSet).map((item) => JSON.parse(item));
  };

  // Get unique topics for filter
  const getUniqueTopics = () => {
    const topicSet = new Set();
    questions.forEach((question) => {
      if (question.topic_id) {
        topicSet.add(
          JSON.stringify({
            id: question.topic_id._id,
            name: question.topic_id.topic_name,
          })
        );
      }
    });
    return Array.from(topicSet).map((item) => JSON.parse(item));
  };

  // Get unique subtopics for filter
  const getUniqueSubtopics = () => {
    const subtopicSet = new Set();
    questions.forEach((question) => {
      if (question.subtopic_id) {
        subtopicSet.add(
          JSON.stringify({
            id: question.subtopic_id._id,
            name: question.subtopic_id.sub_topic_name,
          })
        );
      }
    });
    return Array.from(subtopicSet).map((item) => JSON.parse(item));
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const handleUploadFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const postData = new FormData();
    postData.append("file", file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    apiCall(postData);
  };

  const apiCall = async (file) => {
    try {
      setLoading(true);

      const response = await fetch(`${baseUrl}/questions/excel/upload`, {
        method: "POST",
        body: file,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      const data = await response.json();

      if (data.status) {
        fetchAllData();
        toast.success("Questions uploaded successfully");
      } else {
        toast.error(data.message || "Failed to upload questions");
        fetchAllData();
      }

      setLoading(false);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload questions");
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, subjectFilter, topicFilter, subtopicFilter]);

  return (
    <>
      <section className="main-sec">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6">
              <div className="dashboard-title">
                <h4 className="dash-head">
                  <FontAwesomeIcon icon={faQuestionCircle} className="me-2" />
                  Questions Management
                </h4>
              </div>
              <div className="custom-bredcump">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Questions List
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="col-lg-6 d-flex justify-content-end align-items-start">
              <div className="d-flex align-items-center">
                <label
                  htmlFor="fileUpload"
                  className="btn-primary me-2 mb-0 btn-add-question"
                >
                  <i className="fa fa-upload me-1"></i>
                  Bulk Upload
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleUploadFile}
                  id="fileUpload"
                  className="d-none"
                  accept=".xlsx,.xls,.ods,.csv"
                />
              </div>
              <Link
                to="/question_upload.xlsx"
                download
                target="_blank"
                rel="noopener noreferrer"
                className="btn-info text-white btn-add-question me-2 bg-info"
              >
                <i className="fa fa-arrow-down me-1"></i>
                Download Format
              </Link>

              <Link to="create" className="btn-add-question">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Question
              </Link>
              <Link
                to={`${baseUrl}/questions/download-csv/all?${excelSearch}`}
                target="_blank"
                className="ms-2 btn-add-question"
              >
                <FontAwesomeIcon icon={faFileDownload} className="me-2" />
                Export Csv
              </Link>
            </div>
            {/* <Link
              to="https://api.pidigihub.in/questions/download-csv/all"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="mb-2"
            >
              <i className="fa fa-arrow-down me-1"></i>
              Download CSV
            </Link> */}
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="cards bus-list">
                <div className="bus-filter">
                  <div className="row align-items-center">
                    <div className="col-lg-6">
                      <h5 className="card-title">
                        Questions List ({questions.length} of {totalQuestions})
                      </h5>
                    </div>
                    <div className="col-lg-6 text-end">
                      <small className="text-muted">
                        Page {currentPage} of {totalPages} | Total:{" "}
                        {totalQuestions}
                      </small>
                    </div>
                  </div>
                </div>

                <div className="responsive-filter-container mb-4">
                  <div className="row g-3 align-items-stretch">
                    {/* Search Input */}
                    <div className="col-12 col-md-6 col-lg-3">
                      <div className="position-relative h-100">
                        <FontAwesomeIcon
                          icon={faSearch}
                          className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                        />
                        <input
                          type="text"
                          className="form-control ps-5"
                          placeholder="Search questions, subjects, topics..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Status Filter */}
                    <div className="col-12 col-md-6 col-lg-2">
                      <select
                        className="form-select h-100"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    {/* Section Filter */}
                    <div className="col-12 col-md-6 col-lg-2">
                      <select
                        className="form-select h-100"
                        value={sectionFilter}
                        onChange={(e) => {
                          setSectionFilter(e.target.value);
                        }}
                      >
                        <option value="">All Section</option>
                        {sections.map((section, index) => (
                          <option key={index} value={section._id}>
                            {section.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Subject Filter */}
                    <div className="col-12 col-md-6 col-lg-2">
                      <select
                        className="form-select h-100"
                        value={subjectFilter}
                        onChange={(e) => {
                          setSubjectFilter(e.target.value);
                          setTopicFilter("");
                          setSubtopicFilter("");
                        }}
                      >
                        <option value="">All Subjects</option>
                        {subjects.map((subject, index) => (
                          <option key={index} value={subject._id}>
                            {subject.name}
                          </option>
                        ))}
                        {/* {getUniqueSubjects().map((subject, index) => (
                          <option key={index} value={subject.id}>
                            {subject.name}
                          </option>
                        ))} */}
                      </select>
                    </div>

                    {/* Topic Filter */}
                    <div className="col-12 col-md-6 col-lg-2">
                      <select
                        className="form-select h-100"
                        value={topicFilter}
                        onChange={(e) => {
                          setTopicFilter(e.target.value);
                          setSubtopicFilter("");
                        }}
                      >
                        <option value="">All Topics</option>
                        {topics.map((topic, index) => (
                          <option key={index} value={topic._id}>
                            {topic.topic_name}
                          </option>
                        ))}
                        {/* {getUniqueTopics().map((topic, index) => (
                          <option key={index} value={topic.id}>
                            {topic.name}
                          </option>
                        ))} */}
                      </select>
                    </div>

                    {/* Subtopic Filter */}
                    <div className="col-12 col-md-6 col-lg-3">
                      <select
                        className="form-select h-100"
                        value={subtopicFilter}
                        onChange={(e) => setSubtopicFilter(e.target.value)}
                      >
                        <option value="">All Subtopics</option>
                        {/* {getUniqueSubtopics().map((subtopic, index) => (
                          <option key={index} value={subtopic.id}>
                            {subtopic.name}
                          </option>
                        ))} */}
                        {subtopics.map((subtopic, index) => (
                          <option key={index} value={subtopic._id}>
                            {subtopic.sub_topic_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="table-responsive custom-table">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>SN</th>

                        <th>Question Code</th>
                        <th>Question</th>
                        <th>Section</th>
                        <th>Subject</th>
                        <th>Topic</th>
                        <th>Subtopic</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="8" className="loading-spinner">
                            <div
                              className="spinner-border text-primary"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                            <p className="mt-2">Loading questions...</p>
                          </td>
                        </tr>
                      ) : questions.length === 0 ? (
                        <tr>
                          <td colSpan="10" className="empty-state">
                            <img
                              src={empty || "/placeholder.svg"}
                              alt="No questions"
                              width="200px"
                            />
                            <h4>No Questions found!</h4>
                            <p className="text-muted">
                              {searchTerm ||
                              statusFilter ||
                              subjectFilter ||
                              topicFilter ||
                              subtopicFilter
                                ? "Try adjusting your search or filter criteria"
                                : "Start by adding your first question"}
                            </p>
                            {!searchTerm &&
                              !statusFilter &&
                              !subjectFilter &&
                              !topicFilter &&
                              !subtopicFilter && (
                                <Link
                                  to="create"
                                  className="btn btn-primary mt-3"
                                >
                                  <FontAwesomeIcon
                                    icon={faPlus}
                                    className="me-2"
                                  />
                                  Add Your First Question
                                </Link>
                              )}
                          </td>
                        </tr>
                      ) : (
                        questions.map((question, i) => (
                          <tr key={question?._id}>
                            <td>
                              {(currentPage - 1) * questionsPerPage + i + 1}
                            </td>
                            <td>{question?.questionCode}</td>
                            <td>
                              <div className="question-text">
                                <div
                                  className="fw-medium"
                                  dangerouslySetInnerHTML={{
                                    __html: truncateText(
                                      question.question_title,
                                      80
                                    ),
                                  }}
                                />
                              </div>
                            </td>
                            <td>
                              <span
                                className="subject-badge"
                                style={{ "text-wrap": "nowrap" }}
                              >
                                {question.section_id?.name || "N/A"}
                              </span>
                            </td>
                            <td>
                              <span className="subject-badge">
                                {question.subject_id?.name || "N/A"}
                              </span>
                            </td>
                            <td>
                              <span className="text-muted">
                                {truncateText(
                                  question.topic_id?.topic_name || "N/A",
                                  30
                                )}
                              </span>
                            </td>
                            <td>
                              <span className="text-muted">
                                {truncateText(
                                  question.subtopic_id?.sub_topic_name || "N/A",
                                  30
                                )}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-info text-capitalize">
                                {question.question_type?.replace("_", " ") ||
                                  "N/A"}
                              </span>
                            </td>
                            <td>
                              <button
                                onClick={() =>
                                  handleStatus(question?._id, question?.status)
                                }
                                className={`status-badge ${
                                  question.status === "active"
                                    ? "status-active"
                                    : "status-inactive"
                                }`}
                                disabled={loading}
                              >
                                {question?.status === "active"
                                  ? "Active"
                                  : "Inactive"}
                              </button>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <Link
                                  to={`/questions/edit/${question?._id}`}
                                  className="action-btn edit-btn"
                                  title="Edit Question"
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </Link>
                                <button
                                  className="action-btn delete-btn"
                                  onClick={() => handleDelete(question?._id)}
                                  title="Delete Question"
                                  disabled={loading}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination-container">
                    <nav aria-label="Questions pagination">
                      <ul className="pagination justify-content-center">
                        <li
                          className={`page-item ${
                            currentPage === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </button>
                        </li>
                        {[...Array(totalPages)].map((_, index) => {
                          const pageNumber = index + 1;
                          // Show first page, last page, current page, and pages around current page
                          if (
                            pageNumber === 1 ||
                            pageNumber === totalPages ||
                            (pageNumber >= currentPage - 1 &&
                              pageNumber <= currentPage + 1)
                          ) {
                            return (
                              <li
                                key={pageNumber}
                                className={`page-item ${
                                  currentPage === pageNumber ? "active" : ""
                                }`}
                              >
                                <button
                                  className="page-link"
                                  onClick={() => paginate(pageNumber)}
                                >
                                  {pageNumber}
                                </button>
                              </li>
                            );
                          } else if (
                            pageNumber === currentPage - 2 ||
                            pageNumber === currentPage + 2
                          ) {
                            return (
                              <li
                                key={pageNumber}
                                className="page-item disabled"
                              >
                                <span className="page-link">...</span>
                              </li>
                            );
                          }
                          return null;
                        })}
                        <li
                          className={`page-item ${
                            currentPage === totalPages ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <style>
        {`
        .subject-badge {
                    background-color: #e3f2fd;
                    color: #1976d2;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: 500;
                }
        
.btn-add-question {
  background: #008080;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  color: white;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-add-question:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  color: white;
}

        `}
      </style>
    </>
  );
}
