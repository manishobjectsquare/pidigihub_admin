"use client";
import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import empty from "../assets/images/empty-box.png";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";
import {
  faQuestionCircle,
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { baseUrl } from "../config/baseUrl";
import Pagination from "../Component/Pagination/Pagination";

export default function AssignQuestionList() {
  const location = useLocation();
  const title = location.state?.title;
  const { id: examId } = useParams(); // Get exam ID from URL
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [assignedQuestions, setAssignedQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [subtopicFilter, setSubtopicFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const fileInputRef = useRef(null);
  const [sectionFilter, setSectionFilter] = useState("");
  const [sections, setSections] = useState([]);

  useEffect(() => {
    if (examId) {
      fetchAssignedQuestions();
    }
    fetchAllData();
  }, [
    examId,
    currentPage,
    searchTerm,
    statusFilter,
    subjectFilter,
    topicFilter,
    subtopicFilter,
    sectionFilter,
  ]);

  const fetchAssignedQuestions = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/selected-question/question-list`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            examId: examId,
          }),
        }
      );
      const data = await response.json();
      if (data.status) {
        // Extract question IDs from the nested structure
        const assignedQuestionIds = data.data.map((item) => item.question._id);
        setAssignedQuestions(assignedQuestionIds);
        // console.log("Assigned Questions:", assignedQuestionIds);
      }
    } catch (error) {
      console.error("Error fetching assigned questions:", error);
      setAssignedQuestions([]);
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      // Build query parameters
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
        fetch(`${baseUrl}/topics`, {
          headers: { Authorization: localStorage.getItem("token") },
        }),
        fetch(`${baseUrl}/subtopics`, {
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
      setSections([]);
      setTopics([]);
      setSubtopics([]);
      setLoading(false);
    }
  };

  const handleQuestionSelect = (questionId) => {
    setSelectedQuestions((prev) => {
      if (prev.includes(questionId)) {
        return prev.filter((id) => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  const handleSelectAll = () => {
    const availableQuestions = questions.filter(
      (q) => !isQuestionAssigned(q._id)
    );
    if (selectedQuestions.length === availableQuestions.length) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(availableQuestions.map((q) => q._id));
    }
  };

  const isQuestionAssigned = (questionId) => {
    return assignedQuestions.includes(questionId);
  };

  const assignQuestionsToExam = async () => {
    if (selectedQuestions.length === 0) {
      toast.warning("Please select at least one question to assign");
      return;
    }

    const result = await Swal.fire({
      title: "Assign Questions?",
      text: `Are you sure you want to assign ${selectedQuestions.length} question(s) to this exam?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Assign!",
    });

    if (result.isConfirmed) {
      try {
        setAssignLoading(true);
        const response = await fetch(
          `${baseUrl}/selected-question/pick-questions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
            body: JSON.stringify({
              examId: examId,
              questionId: selectedQuestions,
            }),
          }
        );

        const data = await response.json();
        if (data.status) {
          toast.success(
            `${selectedQuestions.length} question(s) assigned successfully!`
          );
          setSelectedQuestions([]);
          fetchAssignedQuestions(); // Refresh assigned questions
        } else {
          toast.error(data.message || "Failed to assign questions");
        }
        setAssignLoading(false);
      } catch (error) {
        console.error("Error assigning questions:", error);
        toast.error("Failed to assign questions");
        setAssignLoading(false);
      }
    }
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
      const response = await fetch(`${baseUrl}/questions/upload-excel`, {
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
      }
      setLoading(false);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload questions");
      setLoading(false);
    }
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, subjectFilter, topicFilter, subtopicFilter]);

  const availableQuestions = questions.filter(
    (q) => !isQuestionAssigned(q._id)
  );

  return (
    <>
      <section className="main-sec">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-8">
              <div className="dashboard-title">
                <h4 className="dash-head">
                  <FontAwesomeIcon icon={faQuestionCircle} className="me-2" />
                  {title}
                </h4>
                <p className="text-muted mb-0">
                  {/* <strong>Exam ID:</strong> {title} | {" "} */}
                  <strong>Assigned:</strong> {assignedQuestions.length}{" "}
                  questions
                </p>
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
                      {title}
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="col-lg-4 d-flex justify-content-end align-items-start gap-2">
              {selectedQuestions.length > 0 && (
                <button
                  onClick={assignQuestionsToExam}
                  className="btn btn-success"
                  disabled={assignLoading}
                >
                  {assignLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Assigning...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCheck} className="me-2" />
                      Assign Selected ({selectedQuestions.length})
                    </>
                  )}
                </button>
              )}
              <Link to="/questions/create" className="btn-add-question">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Question
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="cards bus-list">
                <div className="bus-filter">
                  <div className="row align-items-center">
                    <div className="col-lg-6">
                      <h5 className="card-title">
                        Available Questions ({availableQuestions.length} of{" "}
                        {totalQuestions})
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
                <div className="search-filter-container">
                  <div className="row gx-2 gy-2 align-items-center">
                    <div className="col-lg-3 col-md-6">
                      <div className="search-container position-relative">
                        <FontAwesomeIcon
                          icon={faSearch}
                          className="search-icon"
                        />
                        <input
                          type="text"
                          className="form-control search-input ps-5"
                          placeholder="Search questions, subjects, topics..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-6">
                      <select
                        className="form-select status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
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
                    <div className="col-lg-2 col-md-6">
                      <select
                        className="form-select status-filter"
                        value={subjectFilter}
                        onChange={(e) => {
                          setSubjectFilter(e.target.value);
                          setTopicFilter("");
                          setSubtopicFilter("");
                        }}
                      >
                        <option value="">All Subjects</option>
                        {getUniqueSubjects().map((subject, index) => (
                          <option key={index} value={subject.id}>
                            {subject.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-lg-2 col-md-6">
                      <select
                        className="form-select status-filter"
                        value={topicFilter}
                        onChange={(e) => {
                          setTopicFilter(e.target.value);
                          setSubtopicFilter("");
                        }}
                      >
                        <option value="">All Topics</option>
                        {getUniqueTopics().map((topic, index) => (
                          <option key={index} value={topic.id}>
                            {topic.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <select
                        className="form-select status-filter"
                        value={subtopicFilter}
                        onChange={(e) => setSubtopicFilter(e.target.value)}
                      >
                        <option value="">All Subtopics</option>
                        {getUniqueSubtopics().map((subtopic, index) => (
                          <option key={index} value={subtopic.id}>
                            {subtopic.name}
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
                        <th>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            onChange={handleSelectAll}
                            checked={
                              selectedQuestions.length ===
                                availableQuestions.length &&
                              availableQuestions.length > 0
                            }
                          />
                        </th>
                        <th>SN</th>
                        <th>Code</th>
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
                          <td colSpan="11" className="loading-spinner">
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
                          <td colSpan="11" className="empty-state">
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
                                  to="/questions/create"
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
                        questions.map((question, i) => {
                          const isAssigned = isQuestionAssigned(question._id);
                          return (
                            <tr
                              key={question?._id}
                              className={
                                isAssigned
                                  ? "table-secondary assigned-question"
                                  : ""
                              }
                            >
                              <td>
                                {isAssigned ? (
                                  <span className="badge bg-success assigned-badge">
                                    <FontAwesomeIcon icon={faCheck} />
                                  </span>
                                ) : (
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={selectedQuestions.includes(
                                      question._id
                                    )}
                                    onChange={() =>
                                      handleQuestionSelect(question._id)
                                    }
                                  />
                                )}
                              </td>
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
                                  {isAssigned && (
                                    <small className="text-success assigned-text">
                                      <FontAwesomeIcon
                                        icon={faCheck}
                                        className="me-1"
                                      />
                                      Already assigned to this exam
                                    </small>
                                  )}
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
                                    question.subtopic_id?.sub_topic_name ||
                                      "N/A",
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
                                    handleStatus(
                                      question?._id,
                                      question?.status
                                    )
                                  }
                                  className={`status-badge ${
                                    question.status === "active"
                                      ? "status-active"
                                      : "status-inactive"
                                  }`}
                                  disabled={loading || isAssigned}
                                >
                                  {question?.status === "active"
                                    ? "Active"
                                    : "Inactive"}
                                </button>
                              </td>
                              <td>
                                <div className="action-buttons">
                                  {isAssigned ? (
                                    <span className="assigned-indicator">
                                      <FontAwesomeIcon
                                        icon={faCheck}
                                        className="text-success me-1"
                                      />
                                      <small className="text-success">
                                        Assigned
                                      </small>
                                    </span>
                                  ) : (
                                    <>
                                      <Link
                                        to={`/questions/edit/${question?._id}`}
                                        className="action-btn edit-btn"
                                        title="Edit Question"
                                      >
                                        <FontAwesomeIcon icon={faEdit} />
                                      </Link>
                                      <button
                                        className="action-btn delete-btn"
                                        onClick={() =>
                                          handleDelete(question?._id)
                                        }
                                        title="Delete Question"
                                        disabled={loading}
                                      >
                                        <FontAwesomeIcon icon={faTrash} />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
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

                .assigned-question {
                    background-color: rgba(40, 167, 69, 0.1) !important;
                    border-left: 4px solid #28a745;
                }

                .assigned-badge {
                    background-color: #28a745 !important;
                    color: white;
                    padding: 6px 8px;
                    border-radius: 50%;
                    font-size: 0.8rem;
                }

                .assigned-text {
                    font-weight: 500;
                    color: #28a745 !important;
                    display: block;
                    margin-top: 4px;
                }

                .assigned-indicator {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px;
                    background-color: rgba(40, 167, 69, 0.1);
                    border-radius: 6px;
                    border: 1px solid rgba(40, 167, 69, 0.2);
                }
                
                .btn-success {
                    background: linear-gradient(135deg, #28a745, #20c997);
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }
                
                .btn-success:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
                }
                
                .btn-add-question {
                    background: linear-gradient(135deg, #007bff, #0056b3);
                    color: white;
                    text-decoration: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    border: none;
                    display: inline-flex;
                    align-items: center;
                }
                
                .btn-add-question:hover {
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
                    text-decoration: none;
                }

                .status-badge:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .loading-spinner {
                    text-align: center;
                    padding: 40px;
                }

                .empty-state {
                    text-align: center;
                    padding: 40px;
                }

                .search-container .search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #6c757d;
                    z-index: 10;
                }

                .search-input {
                    padding-left: 40px !important;
                }

                .action-btn {
                    background: none;
                    border: none;
                    padding: 6px 8px;
                    margin: 0 2px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .edit-btn {
                    color: #007bff;
                    text-decoration: none;
                }

                .edit-btn:hover {
                    background-color: rgba(0, 123, 255, 0.1);
                    color: #0056b3;
                }

                .delete-btn {
                    color: #dc3545;
                }

                .delete-btn:hover {
                    background-color: rgba(220, 53, 69, 0.1);
                    color: #c82333;
                }

                .status-active {
                    background-color: #28a745;
                    color: white;
                    border: none;
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                }

                .status-inactive {
                    background-color: #6c757d;
                    color: white;
                    border: none;
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                }

                .pagination-container {
                    margin-top: 20px;
                }

                .page-link {
                    color: #007bff;
                    background-color: #fff;
                    border: 1px solid #dee2e6;
                }

                .page-item.active .page-link {
                    background-color: #007bff;
                    border-color: #007bff;
                    color: white;
                }

                .page-link:hover {
                    color: #0056b3;
                    background-color: #e9ecef;
                    border-color: #dee2e6;
                }
                `}
      </style>
    </>
  );
}
