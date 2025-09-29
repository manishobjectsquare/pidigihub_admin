"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListUl,
  faSave,
  faArrowLeft,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

export default function EditSubTopic() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    sub_topic: "",
    status: "active",
  });
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [fetchingSubjects, setFetchingSubjects] = useState(false);
  const [fetchingTopics, setFetchingTopics] = useState(false);
  const [errors, setErrors] = useState({});
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjects();
    fetchSubTopicData();
  }, [id]);

  // Fetch topics when subject changes
  useEffect(() => {
    if (formData.subject) {
      fetchTopics(formData.subject);
    } else {
      setTopics([]);
    }
  }, [formData.subject]);

  const fetchSubTopicData = async () => {
    try {
      setFetchingData(true);
      const response = await axios.get(`${baseUrl}/subtopics/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (response?.data?.status) {
        let subtopic = response?.data?.data;
        // const subtopic = response?.data?.data?.find((st) => st?._id === id)
        if (subtopic) {
          setFormData({
            subject: subtopic?.subject_id?._id || subtopic?.subject_id || "",
            topic: subtopic?.topic_id?._id || subtopic?.topic_id || "",
            sub_topic: subtopic?.sub_topic_name || "",
            status: subtopic?.status || "active",
          });
        } else {
          setNotFound(true);
          toast.error("Subtopic not found");
        }
      } else {
        setNotFound(true);
        toast.error(response?.data?.message || "Failed to fetch subtopic data");
      }
    } catch (error) {
      console.error("Error fetching subtopic data:", error);
      setNotFound(true);
      toast.error("Error fetching subtopic data");
    } finally {
      setFetchingData(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      setFetchingSubjects(true);
      const response = await axios.get(`${baseUrl}/subjects`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (response?.data?.status) {
        // Filter only active subjects
        const activeSubjects =
          response?.data?.data?.filter(
            (subject) => subject?.status === "active"
          ) || [];
        setSubjects(activeSubjects);
      } else {
        toast.error(response?.data?.message || "Failed to fetch subjects");
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Error fetching subjects");
    } finally {
      setFetchingSubjects(false);
    }
  };

  const fetchTopics = async (subjectId) => {
    try {
      setFetchingTopics(true);
      const response = await axios.get(
        `${baseUrl}/topics?subject=${subjectId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response?.data?.status) {
        // Filter only active topics for the selected subject
        const activeTopics =
          response?.data?.data?.filter((topic) => topic?.status === "active") ||
          [];
        setTopics(activeTopics);
      } else {
        toast.error(response?.data?.message || "Failed to fetch topics");
        setTopics([]);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
      toast.error("Failed to fetch topics");
      setTopics([]);
    } finally {
      setFetchingTopics(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    // Reset topic when subject changes
    if (name === "subject" && value !== formData.subject) {
      setFormData((prev) => ({
        ...prev,
        subject: value,
        topic: "", // Reset topic when subject changes
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.sub_topic?.trim()) {
      newErrors.sub_topic = "Subtopic name is required";
    }

    if (!formData.subject) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.topic) {
      newErrors.topic = "Topic is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Properly structured payload as per API expectation
      const submitData = {
        subject_id: formData.subject,
        topic_id: formData.topic,
        sub_topic_name: formData.sub_topic.trim(),
        status: formData.status,
      };

      console.log("Submitting data:", submitData); // Optional debug log

      const response = await axios.patch(
        `${baseUrl}/subtopics/${id}`,
        submitData,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.status) {
        toast.success(
          response?.data?.message || "Subtopic updated successfully"
        );
        navigate("/subtopics");
      } else {
        toast.error(response?.data?.message || "Failed to update subtopic");
      }
    } catch (error) {
      console.error("Error updating subtopic:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update subtopic"
      );
    } finally {
      setLoading(false);
    }
  };

  if (notFound) {
    return (
      <section className="main-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="cards text-center py-5">
                <h3 className="text-danger mb-4">Subtopic Not Found</h3>
                <p className="mb-4">
                  The subtopic you are trying to edit does not exist or has been
                  deleted.
                </p>
                <Link to="/subtopics" className="btn-back">
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  Back to Subtopics
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="main-sec">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="dashboard-title">
              <h4 className="dash-head">
                <FontAwesomeIcon icon={faListUl} className="me-2" />
                Edit Subtopic
              </h4>
            </div>
            <div className="custom-bredcump">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/subtopics">Subtopics</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Edit Subtopic
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="col-lg-6 d-flex justify-content-end align-items-start">
            <Link to="/subtopics" className="btn-back">
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Back to Subtopics
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
                  <p className="mt-3">Loading subtopic data...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-section">
                    <div className="row">
                      {/* Subject Selection */}
                      <div className="col-lg-6 mb-4">
                        <label htmlFor="subject" className="form-label">
                          Subject<sup className="text-danger">*</sup>
                        </label>
                        <div className="subject-select-container">
                          <select
                            className={`form-control ${
                              errors.subject ? "is-invalid" : ""
                            }`}
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            disabled={fetchingSubjects}
                          >
                            <option value="">Select Subject</option>
                            {subjects.map((subject) => (
                              <option key={subject?._id} value={subject?._id}>
                                {subject?.name || subject?.subject_name}
                              </option>
                            ))}
                          </select>
                          <Link to="/subjects/add" className="btn-add-subject">
                            <FontAwesomeIcon icon={faPlus} />
                          </Link>
                          {errors.subject && (
                            <div className="invalid-feedback">
                              {errors.subject}
                            </div>
                          )}
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

                      {/* Topic Selection */}
                      <div className="col-lg-6 mb-4">
                        <label htmlFor="topic" className="form-label">
                          Topic<sup className="text-danger">*</sup>
                        </label>
                        <div className="subject-select-container">
                          <select
                            className={`form-control ${
                              errors.topic ? "is-invalid" : ""
                            }`}
                            id="topic"
                            name="topic"
                            value={formData.topic}
                            onChange={handleChange}
                            disabled={fetchingTopics || !formData.subject}
                          >
                            <option value="">
                              {!formData.subject
                                ? "Select Subject First"
                                : "Select Topic"}
                            </option>
                            {topics.map((topic) => (
                              <option key={topic?._id} value={topic?._id}>
                                {topic?.name || topic?.topic_name}
                              </option>
                            ))}
                          </select>
                          <Link
                            to={
                              formData.subject
                                ? `/topics/add?subject=${formData.subject}`
                                : "/topics/add"
                            }
                            className="btn-add-subject"
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </Link>
                          {errors.topic && (
                            <div className="invalid-feedback">
                              {errors.topic}
                            </div>
                          )}
                        </div>
                        {fetchingTopics && (
                          <div className="text-muted mt-2">
                            <small>
                              <span
                                className="spinner-border spinner-border-sm me-1"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Loading topics...
                            </small>
                          </div>
                        )}
                      </div>

                      {/* Subtopic Name */}
                      <div className="col-lg-6 mb-4">
                        <label htmlFor="sub_topic" className="form-label">
                          Subtopic Name<sup className="text-danger">*</sup>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            errors.sub_topic ? "is-invalid" : ""
                          }`}
                          id="sub_topic"
                          name="sub_topic"
                          placeholder="Enter subtopic name"
                          value={formData.sub_topic}
                          onChange={handleChange}
                        />
                        {errors.sub_topic && (
                          <div className="invalid-feedback">
                            {errors.sub_topic}
                          </div>
                        )}
                      </div>

                      {/* Status */}
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
                      <button
                        type="submit"
                        className="btn-save"
                        disabled={loading}
                      >
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
                            Update Subtopic
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
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
}
