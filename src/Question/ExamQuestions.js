"use client";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import empty from "../assets/images/empty-box.png";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faArrowUp,
  faArrowDown,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { baseUrl } from "../config/baseUrl";

export default function ExamQuestions() {
  const location = useLocation();
  const title = location.state?.title;

  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sequenceLoading, setSequenceLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [subtopicFilter, setSubtopicFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(100);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [sections, setSections] = useState([]);
  const [sectionFilter, setSectionFilter] = useState("");
  const fileInputRef = useRef(null);
  const { id: examId } = useParams();

  useEffect(() => {
    fetchAllData();
    fetchSubjects();
    fetchTopics();
    fetchSubtopics();
    fetchSections();
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, subjectFilter, topicFilter, subtopicFilter]);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const params = {
        examId: examId,
      };

      if (searchTerm) params.questionCode = searchTerm; // Filter by name (search term)
      if (statusFilter) params.status = statusFilter; // Filter by status
      if (subjectFilter) params.subject_id = subjectFilter; // Filter by subject
      if (topicFilter) params.topic_id = topicFilter; // Filter by topic
      if (subtopicFilter) params.subtopic_id = subtopicFilter;
      if (sectionFilter) params.section_id = sectionFilter;

      const response = await fetch(
        `${baseUrl}/selected-question/question-list`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify(params),
        }
      );
      const data = await response.json();
      if (data.status) {
        // Sort by sequence to maintain order
        const sortedData = data.data.sort((a, b) => a.sequence - b.sequence);
        setQuestions(sortedData);
        setTotalQuestions(sortedData.length);
        setTotalPages(Math.ceil(sortedData.length / questionsPerPage));
      } else {
        setQuestions([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching exam questions:", error);
      toast.error("Failed to fetch exam questions");
      setQuestions([]);
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await fetch(`${baseUrl}/subjects`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      const data = await response.json();
      if (data.status) {
        setSubjects(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchTopics = async () => {
    try {
      const response = await fetch(`${baseUrl}/topics`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      const data = await response.json();
      if (data.status) {
        setTopics(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const fetchSubtopics = async () => {
    try {
      const response = await fetch(`${baseUrl}/subtopics`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      const data = await response.json();
      if (data.status) {
        setSubtopics(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching subtopics:", error);
    }
  };

  const fetchSections = async (topicId) => {
    try {
      const response = await fetch(`${baseUrl}/sections`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      const data = await response.json();
      setSections(data.data || []);
    } catch (error) {
      console.error("Error fetching subtopics:", error);
      setSubtopics([]);
    }
  };

  // Helper functions to get names by ID
  const getSubjectNameById = (subjectId) => {
    if (!subjectId) return "N/A";
    const subject = subjects.find((s) => s._id === subjectId);
    return subject ? subject.name : "Unknown Subject";
  };

  const getTopicNameById = (topicId) => {
    if (!topicId) return "N/A";
    const topic = topics.find((t) => t._id === topicId);
    return topic ? topic.topic_name : "Unknown Topic";
  };

  const getSubtopicNameById = (subtopicId) => {
    if (!subtopicId) return "N/A";
    const subtopic = subtopics.find((st) => st._id === subtopicId);
    return subtopic ? subtopic.sub_topic_name : "Unknown Subtopic";
  };

  const updateSequence = async (questionId, newSequence) => {
    try {
      setSequenceLoading((prev) => ({ ...prev, [questionId]: true }));

      // Find the question that will be swapped
      const otherQuestion = questions.find((q) => q.sequence === newSequence);

      const response = await fetch(
        `${baseUrl}/selected-question/update-sequence`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            examId: examId,
            questionId: questionId,
            newSequence: newSequence,
          }),
        }
      );

      const data = await response.json();

      if (data.status) {
        // Update local state for both swapped questions
        setQuestions((prevQuestions) => {
          const updatedQuestions = prevQuestions.map((item) => {
            if (item.question._id === questionId) {
              return { ...item, sequence: newSequence };
            } else if (item.question._id === otherQuestion?.question?._id) {
              return {
                ...item,
                sequence: prevQuestions.find(
                  (q) => q.question._id === questionId
                )?.sequence,
              };
            }
            return item;
          });

          // Re-sort by sequence
          return updatedQuestions.sort((a, b) => a.sequence - b.sequence);
        });

        toast.success("Sequence updated successfully");
      } else {
        toast.error(data.message || "Failed to update sequence");
      }

      setSequenceLoading((prev) => ({ ...prev, [questionId]: false }));
    } catch (error) {
      console.error("Error updating sequence:", error);
      toast.error("Failed to update sequence");
      setSequenceLoading((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  const moveSequenceUp = (questionId, currentSequence) => {
    if (currentSequence > 1) {
      updateSequence(questionId, currentSequence - 1);
    }
  };

  const moveSequenceDown = (questionId, currentSequence) => {
    if (currentSequence < questions.length) {
      updateSequence(questionId, currentSequence + 1);
    }
  };

  const handleDelete = async (questionId) => {
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
        const response = await fetch(
          `${baseUrl}/selected-question/question-delete`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
            body: JSON.stringify({
              questionId: questionId,
              examId: examId,
            }),
          }
        );
        const data = await response.json();
        if (data.status) {
          // Update local state immediately
          setQuestions((prevQuestions) =>
            prevQuestions.filter((item) => item.question._id !== questionId)
          );
          setTotalQuestions((prev) => prev - 1);
          toast.success("Question removed from exam successfully");
        } else {
          toast.error(data.message || "Failed to remove question");
        }
      } catch (error) {
        console.error("Error removing question:", error);
        toast.error("Failed to remove question");
      }
    }
  };

  // Get unique subjects for filter from assigned questions
  const getUniqueSubjectsFromQuestions = () => {
    const subjectIds = new Set();
    questions.forEach((item) => {
      const question = item.question;
      if (question.subject_id) {
        subjectIds.add(question.subject_id);
      }
    });
    return Array.from(subjectIds)
      .map((id) => {
        const subject = subjects.find((s) => s._id === id);
        return subject ? { id: subject._id, name: subject.name } : null;
      })
      .filter(Boolean);
  };

  // Get unique topics for filter from assigned questions
  const getUniqueTopicsFromQuestions = () => {
    const topicIds = new Set();
    questions.forEach((item) => {
      const question = item.question;
      if (question.topic_id) {
        topicIds.add(question.topic_id);
      }
    });
    return Array.from(topicIds)
      .map((id) => {
        const topic = topics.find((t) => t._id === id);
        return topic ? { id: topic._id, name: topic.topic_name } : null;
      })
      .filter(Boolean);
  };

  // Get unique subtopics for filter from assigned questions
  const getUniqueSubtopicsFromQuestions = () => {
    const subtopicIds = new Set();
    questions.forEach((item) => {
      const question = item.question;
      if (question.subtopic_id) {
        subtopicIds.add(question.subtopic_id);
      }
    });
    return Array.from(subtopicIds)
      .map((id) => {
        const subtopic = subtopics.find((st) => st._id === id);
        return subtopic
          ? { id: subtopic._id, name: subtopic.sub_topic_name }
          : null;
      })
      .filter(Boolean);
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

  // Filter questions based on search and filters

  // Paginate filtered questions
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const paginatedQuestions = questions;

  const updateStatus = async (questionId, status) => {
    try {
      console.log(questionId, "questionId", status);

      const response = await fetch(
        `${baseUrl}/selected-question/update-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            examId: examId,
            questionId: questionId,
            status: !status,
          }),
        }
      );

      const data = await response.json();

      if (data.status) {
        toast.success("Sequence updated successfully");

        setQuestions((prevQuestions) => {
          const updatedQuestions = prevQuestions.map((item) => {
            if (item.question._id === questionId) {
              return { ...item, status: !status };
            }

            return item;
          });

          // Re-sort by sequence
          return updatedQuestions.sort((a, b) => a.sequence - b.sequence);
        });
      } else {
        toast.error(data.message || "Failed to update sequence");
      }
    } catch (error) {
      console.log("Error updating sequence:", error);
      toast.error("Failed to update sequence");
    }
  };

  return (
    <>
      <section className="main-sec">
        <div className="-fluid">
          <div className="row">
            <div className="col-lg-8">
              <div className="dashboard-title">
                <h4 className="dash-head">
                  <FontAwesomeIcon icon={faQuestionCircle} className="me-2" />
                  {title || "Exam Questions Management"}
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
                      Assigned Questions In {title || "Exam"}
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="col-lg-4 d-flex justify-content-end align-items-start">
              <Link
                to="assign"
                state={{ title: location.state?.title }}
                className="btn-add-question"
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Assign More Questions
              </Link>
              <Link
                to={-1}
                state={{ title: location.state?.title }}
                className="btn-add-question ms-2"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                Back
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
                        Assigned Questions ({questions.length} of{" "}
                        {questions.length})
                      </h5>
                    </div>
                    <div className="col-lg-6 text-end">
                      <small className="text-muted">
                        Page {currentPage} of {totalPages} | Total:{" "}
                        {questions.length}
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
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                      </select>
                    </div>
                    <div className="col-lg-2 col-md-6">
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
                        {subjects.map((subject, index) => (
                          <option key={index} value={subject._id}>
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
                        {getUniqueTopicsFromQuestions().map((topic, index) => (
                          <option key={index} value={topic._id}>
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
                        {getUniqueSubtopicsFromQuestions().map(
                          (subtopic, index) => (
                            <option key={index} value={subtopic._id}>
                              {subtopic.name}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="table-responsive custom-table">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>Sr</th>
                        <th>Code</th>
                        <th>Sequence</th>
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
                          <td colSpan="10" className="loading-spinner">
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
                      ) : paginatedQuestions.length === 0 ? (
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
                                : "No questions assigned to this exam yet"}
                            </p>
                            {!searchTerm &&
                              !statusFilter &&
                              !subjectFilter &&
                              !topicFilter &&
                              !subtopicFilter && (
                                <Link
                                  to="assign"
                                  className="btn btn-primary mt-3"
                                >
                                  <FontAwesomeIcon
                                    icon={faPlus}
                                    className="me-2"
                                  />
                                  Assign Questions
                                </Link>
                              )}
                          </td>
                        </tr>
                      ) : (
                        paginatedQuestions.map((item, i) => {
                          const question = item.question;
                          const isSequenceLoading =
                            sequenceLoading[question._id];
                          return (
                            <tr key={question?._id}>
                              <td>
                                {(currentPage - 1) * questionsPerPage + i + 1}
                              </td>
                              <td>{question?.questionCode}</td>
                              <td>
                                <div className="sequence-controls">
                                  <span className="sequence-number">
                                    {item.sequence}
                                  </span>
                                  <div className="sequence-buttons">
                                    <button
                                      className="sequence-btn up-btn"
                                      onClick={() =>
                                        moveSequenceUp(
                                          question._id,
                                          item.sequence
                                        )
                                      }
                                      disabled={
                                        item.sequence === 1 || isSequenceLoading
                                      }
                                      title="Move Up"
                                    >
                                      {isSequenceLoading ? (
                                        <span
                                          className="spinner-border spinner-border-sm"
                                          role="status"
                                        ></span>
                                      ) : (
                                        <FontAwesomeIcon icon={faArrowUp} />
                                      )}
                                    </button>
                                    <button
                                      className="sequence-btn down-btn"
                                      onClick={() =>
                                        moveSequenceDown(
                                          question._id,
                                          item.sequence
                                        )
                                      }
                                      disabled={
                                        item.sequence === questions.length ||
                                        isSequenceLoading
                                      }
                                      title="Move Down"
                                    >
                                      {isSequenceLoading ? (
                                        <span
                                          className="spinner-border spinner-border-sm"
                                          role="status"
                                        ></span>
                                      ) : (
                                        <FontAwesomeIcon icon={faArrowDown} />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </td>

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
                                  {question.subject_id.name}
                                </span>
                              </td>
                              <td>
                                <span className="text-muted">
                                  {truncateText(
                                    getTopicNameById(question.topic_id),
                                    30
                                  )}
                                </span>
                              </td>
                              <td>
                                <span className="text-muted">
                                  {truncateText(
                                    getSubtopicNameById(question.subtopic_id),
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
                                <span
                                  onClick={() =>
                                    updateStatus(question._id, item.status)
                                  }
                                  className={`status-badge ${
                                    item.status === true
                                      ? "status-active"
                                      : "status-inactive"
                                  }`}
                                >
                                  {item?.status === true
                                    ? "Active"
                                    : "Inactive"}
                                </span>
                              </td>
                              <td>
                                <div className="action-buttons d-flex">
                                  <Link
                                    to={`/questions/edit/${question?._id}`}
                                    className="action-btn edit-btn "
                                    title="Edit Question"
                                  >
                                    <FontAwesomeIcon icon={faEdit} />
                                  </Link>
                                  <button
                                    className="action-btn delete-btn d-block"
                                    onClick={() => handleDelete(question?._id)}
                                    title="Remove from Exam"
                                    disabled={loading}
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </button>
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

                .sequence-controls {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .sequence-number {
                    font-weight: bold;
                    color: #495057;
                    min-width: 20px;
                    text-align: center;
                }

                .sequence-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .sequence-btn {
                    background: none;
                    border: 1px solid #dee2e6;
                    padding: 2px 6px;
                    border-radius: 3px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 0.7rem;
                    width: 24px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .sequence-btn:hover:not(:disabled) {
                    background-color: #f8f9fa;
                    border-color: #adb5bd;
                }

                .sequence-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .up-btn {
                    color: #28a745;
                }

                .down-btn {
                    color: #dc3545;
                }

                .up-btn:hover:not(:disabled) {
                    background-color: rgba(40, 167, 69, 0.1);
                    border-color: #28a745;
                }

                .down-btn:hover:not(:disabled) {
                    background-color: rgba(220, 53, 69, 0.1);
                    border-color: #dc3545;
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
