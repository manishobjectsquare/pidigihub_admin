import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faArrowLeft,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { baseUrl } from "../config/baseUrl";
import { toast } from "react-toastify";
import axios from "axios";

export default function AddQuestion() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [errors, setErrors] = useState({});
  const [languageList, setLanguageList] = useState([]);
  const [sections, setSections] = useState([]);
  // Form state
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    subtopic: "",
    question_title: "",
    questionType: "single_choice",
    questionContent: "",
    description: "",
    solution: "",
    correctAnswer: "",
    status: "active",
    language: "",
  });

  // Options state for different question types
  const [options, setOptions] = useState([
    { id: 1, content: "", isCorrect: false },
    { id: 2, content: "", isCorrect: false },
  ]);

  useEffect(() => {
    fetchSubjects();
    fetchLanguageList();
    fetchSections();
  }, []);

  const fetchLanguageList = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/language/language-list?status=true`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.data.status) {
        setLanguageList(response.data.data);
      } else {
        toast.error("Failed to fetch language list");
      }
    } catch (error) {
      console.error("Error fetching language list:", error);
      toast.error("Error fetching language list");
    }
  };
  useEffect(() => {
    if (formData.subject) {
      fetchTopics(formData.subject);
    } else {
      setTopics([]);
      setSubtopics([]);
    }
  }, [formData.subject]);

  useEffect(() => {
    if (formData.topic) {
      fetchSubtopics(formData.topic);
    } else {
      setSubtopics([]);
    }
  }, [formData.topic]);

  useEffect(() => {
    resetOptionsForQuestionType(formData.questionType);
  }, [formData.questionType]);

  const fetchSubjects = async () => {
    try {
      const response = await fetch(`${baseUrl}/subjects`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      const data = await response.json();
      setSubjects(data.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchTopics = async (subjectId) => {
    console.log(subjectId);
    try {
      const response = await fetch(`${baseUrl}/topics?subject=${subjectId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      const data = await response.json();
      const filteredTopics = data.data.filter(
        (topic) => topic.subject_id._id === subjectId
      );
      setTopics(filteredTopics);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const fetchSubtopics = async (topicId) => {
    try {
      const response = await fetch(`${baseUrl}/subtopics?topic=${topicId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      const data = await response.json();
      const filteredSubtopics = data.data.filter(
        (subtopic) => subtopic.topic_id._id === topicId
      );
      setSubtopics(filteredSubtopics);
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

  const resetOptionsForQuestionType = (questionType) => {
    switch (questionType) {
      case "yes_no":
        setOptions([
          { id: 1, content: "Yes", isCorrect: false },
          { id: 2, content: "No", isCorrect: false },
        ]);
        break;
      case "single_choice":
        setOptions([
          { id: 1, content: "", isCorrect: false },
          { id: 2, content: "", isCorrect: false },
          { id: 3, content: "", isCorrect: false },
          { id: 4, content: "", isCorrect: false },
        ]);
        break;
      case "multiple_choice":
        setOptions([
          { id: 1, content: "", isCorrect: false },
          { id: 2, content: "", isCorrect: false },
          { id: 3, content: "", isCorrect: false },
          { id: 4, content: "", isCorrect: false },
        ]);
        break;
      case "text":
        setOptions([{ id: 1, content: "", isCorrect: true }]);
        break;
      default:
        setOptions([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reset dependent fields
    if (name === "subject") {
      setFormData((prev) => ({ ...prev, topic: "", subtopic: "" }));
    } else if (name === "topic") {
      setFormData((prev) => ({ ...prev, subtopic: "" }));
    }
  };

  const handleQuillChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOptionChange = (optionId, content) => {
    setOptions((prev) =>
      prev.map((option) =>
        option.id === optionId ? { ...option, content } : option
      )
    );
  };

  const handleCorrectAnswerChange = (optionId, isCorrect) => {
    if (formData.questionType === "single_choice") {
      setOptions((prev) =>
        prev.map((option) => ({
          ...option,
          isCorrect: option.id === optionId ? isCorrect : false,
        }))
      );
    } else {
      setOptions((prev) =>
        prev.map((option) =>
          option.id === optionId ? { ...option, isCorrect } : option
        )
      );
    }
  };

  const addOption = () => {
    const newId = Math.max(...options.map((o) => o.id)) + 1;
    setOptions((prev) => [
      ...prev,
      { id: newId, content: "", isCorrect: false },
    ]);
  };

  const removeOption = (optionId) => {
    if (options.length > 2) {
      setOptions((prev) => prev.filter((option) => option.id !== optionId));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    if (
      !formData.subject ||
      !formData.topic ||
      !formData.subtopic ||
      !formData.question_title ||
      !formData.section_id ||
      !formData.language
    ) {
      Swal.fire({
        title: "Error!",
        text: "Please fill in all required fields",
        icon: "error",
      });
      return;
    }

    // Validate options for choice questions
    if (
      ["single_choice", "multiple_choice", "yes_no"].includes(
        formData.questionType
      )
    ) {
      const hasEmptyOptions = options.some((option) => !option.content.trim());
      const hasCorrectAnswer = options.some((option) => option.isCorrect);

      if (hasEmptyOptions) {
        Swal.fire({
          title: "Error!",
          text: "Please fill in all option fields",
          icon: "error",
        });
        return;
      }

      if (!hasCorrectAnswer) {
        Swal.fire({
          title: "Error!",
          text: "Please select at least one correct answer",
          icon: "error",
        });
        return;
      }
    }

    // Validate text type question
    if (formData.questionType === "text" && !options[0]?.content.trim()) {
      Swal.fire({
        title: "Error!",
        text: "Please provide the correct answer for text question",
        icon: "error",
      });
      return;
    }

    try {
      setLoading(true);

      // Prepare data for API according to the provided format
      const questionData = {
        subject_id: formData.subject,
        topic_id: formData.topic,
        subtopic_id: formData.subtopic,
        section_id: formData.section_id,
        question_title: formData.question_title,
        question_type: formData.questionType,
        options: options.map((option) => ({
          option: option.content,
          correct: option.isCorrect,
        })),
        description: formData.description,
        solution: formData.solution,
        language: formData.language,
        status: formData.status,
      };

      const response = await fetch(`${baseUrl}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(questionData),
      });

      const result = await response.json();

      if (response.ok && result.status) {
        Swal.fire({
          title: "Success!",
          text: result.message || "Question created successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/questions");
        });
      } else {
        throw new Error(result.message || "Failed to create question");
      }
    } catch (error) {
      console.error("Error creating question:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to create question",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const renderQuestionTypeFields = () => {
    switch (formData.questionType) {
      case "text":
        return (
          <div className="col-md-12 mb-3">
            <label className="form-label">
              Correct Answer <span className="text-danger">*</span>
            </label>
            <ReactQuill
              theme="snow"
              value={options[0]?.content || ""}
              onChange={(value) => handleOptionChange(1, value)}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  [{ script: "sub" }, { script: "super" }],
                  [{ indent: "-1" }, { indent: "+1" }],
                  ["link", "image", "formula"],
                  ["clean"],
                ],
              }}
              className="custom-quill-editor"
            />
          </div>
        );

      case "yes_no":
        return (
          <div className="col-md-12 mb-3">
            <label className="form-label">
              Correct Answer <span className="text-danger">*</span>
            </label>
            <div className="yes-no-options">
              {options.map((option) => (
                <div key={option.id} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="correctAnswer"
                    id={`option-${option.id}`}
                    checked={option.isCorrect}
                    onChange={(e) =>
                      handleCorrectAnswerChange(option.id, e.target.checked)
                    }
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`option-${option.id}`}
                  >
                    {option.content}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case "single_choice":
      case "multiple_choice":
        return (
          <div className="col-md-12 mb-3">
            <label className="form-label">
              Options <span className="text-danger">*</span>
            </label>
            <div className="options-container">
              {options.map((option, index) => (
                <div key={option.id} className="option-item">
                  <div className="option-header">
                    <span className="option-label">
                      Option {String.fromCharCode(65 + index)}
                    </span>
                    {options.length > 2 && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeOption(option.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    )}
                  </div>
                  <ReactQuill
                    theme="snow"
                    value={option.content}
                    onChange={(value) => handleOptionChange(option.id, value)}
                    modules={{
                      toolbar: [
                        ["bold", "italic", "underline"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ script: "sub" }, { script: "super" }],
                        ["link", "image", "formula"],
                        ["clean"],
                      ],
                    }}
                    className="custom-quill-editor-small"
                  />
                  <div className="form-check mt-2">
                    <input
                      className="form-check-input"
                      type={
                        formData.questionType === "single_choice"
                          ? "radio"
                          : "checkbox"
                      }
                      name={
                        formData.questionType === "single_choice"
                          ? "correctAnswer"
                          : `correct-${option.id}`
                      }
                      id={`correct-${option.id}`}
                      checked={option.isCorrect}
                      onChange={(e) =>
                        handleCorrectAnswerChange(option.id, e.target.checked)
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`correct-${option.id}`}
                    >
                      Correct Answer
                    </label>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-outline-primary btn-sm mt-2"
                onClick={addOption}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Option
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <section className="main-sec">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6">
              <div className="dashboard-title">
                <h4 className="dash-head">
                  <FontAwesomeIcon icon={faQuestionCircle} className="me-2" />
                  Add Question
                </h4>
              </div>
              <div className="custom-bredcump">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="/questions">Questions</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Add Question
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="col-lg-6 d-flex justify-content-end align-items-start">
              <Link
                to="/questions"
                className="btn-info text-white btn-add-question me-2 bg-info"
              >
                View Questions
              </Link>
              <button onClick={handleCancel} className="btn-add-question">
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                Back
              </button>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="cards">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {/* Subject */}
                    <div className="col-md-4 mb-3">
                      <label className="form-label">
                        Subject <span className="text-danger">*</span>
                      </label>
                      <select
                        name="subject"
                        className="form-select"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">-- Select Subject --</option>
                        {subjects.map((subject) => (
                          <option key={subject._id} value={subject._id}>
                            {subject.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Topic */}
                    <div className="col-md-4 mb-3">
                      <label className="form-label">
                        Topic <span className="text-danger">*</span>
                      </label>
                      <select
                        name="topic"
                        className="form-select"
                        value={formData.topic}
                        onChange={handleInputChange}
                        required
                        disabled={!formData.subject}
                      >
                        <option value="">-- Select Topic --</option>
                        {topics.map((topic) => (
                          <option key={topic._id} value={topic._id}>
                            {topic.topic_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Subtopic */}
                    <div className="col-md-4 mb-3">
                      <label className="form-label">
                        Subtopic <span className="text-danger">*</span>
                      </label>
                      <select
                        name="subtopic"
                        className="form-select"
                        value={formData.subtopic}
                        onChange={handleInputChange}
                        required
                        disabled={!formData.topic}
                      >
                        <option value="">-- Select Subtopic --</option>
                        {subtopics.map((subtopic) => (
                          <option key={subtopic._id} value={subtopic._id}>
                            {subtopic.sub_topic_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-3 mb-3">
                      <label className="form-label">
                        Language <span className="text-danger">*</span>
                      </label>
                      <select
                        name="language"
                        className={`form-select ${
                          errors.language ? "is-invalid" : ""
                        }`}
                        value={formData.language}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">-- Select language --</option>
                        {languageList.map((lang) => (
                          <option key={lang._id} value={lang._id}>
                            {lang.name}
                          </option>
                        ))}
                      </select>
                      {errors.language && (
                        <div className="invalid-feedback">
                          {errors.language}
                        </div>
                      )}
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label">
                        Section <span className="text-danger">*</span>
                      </label>
                      <select
                        name="section_id"
                        className={`form-select`}
                        value={formData.section_id}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">-- Select Section --</option>
                        {sections.map((section) => (
                          <option key={section._id} value={section._id}>
                            {section.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Question Title */}
                    <div className="col-md-12 mb-3">
                      <label className="form-label">
                        Question Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="question_title"
                        className="form-control"
                        placeholder="Enter question title"
                        value={formData.question_title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Question Type */}
                    {/* <div className="col-md-4 mb-3">
                                            <label className="form-label">
                                                Question Type <span className="text-danger">*</span>
                                            </label>
                                            <select
                                                name="questionType"
                                                className="form-select"
                                                value={formData.questionType}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="text">Text</option>
                                                <option value="yes_no">Yes/No</option>
                                                <option value="single_choice">Single Choice</option>
                                                <option value="multiple_choice">Multiple Choice</option>
                                            </select>
                                        </div> */}

                    {/* Section */}

                    {/* Dynamic Question Type Fields */}
                    {renderQuestionTypeFields()}

                    {/* Description */}
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Description</label>
                      <ReactQuill
                        theme="snow"
                        value={formData.description}
                        onChange={(value) =>
                          handleQuillChange("description", value)
                        }
                        modules={{
                          toolbar: [
                            [{ header: [1, 2, 3, 4, 5, 6, false] }],
                            ["bold", "italic", "underline", "strike"],
                            [{ list: "ordered" }, { list: "bullet" }],
                            [{ script: "sub" }, { script: "super" }],
                            [{ indent: "-1" }, { indent: "+1" }],
                            ["link", "image", "formula"],
                            ["clean"],
                          ],
                        }}
                        className="custom-quill-editor"
                      />
                    </div>

                    {/* Solution */}
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Solution</label>
                      <ReactQuill
                        theme="snow"
                        value={formData.solution}
                        onChange={(value) =>
                          handleQuillChange("solution", value)
                        }
                        modules={{
                          toolbar: [
                            [{ header: [1, 2, 3, 4, 5, 6, false] }],
                            ["bold", "italic", "underline", "strike"],
                            [{ list: "ordered" }, { list: "bullet" }],
                            [{ script: "sub" }, { script: "super" }],
                            [{ indent: "-1" }, { indent: "+1" }],
                            ["link", "image", "formula"],
                            ["clean"],
                          ],
                        }}
                        className="custom-quill-editor"
                      />
                    </div>

                    {/* Status */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Status</label>
                      <select
                        name="status"
                        className="form-select"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    {/* Submit Buttons */}
                    <div className="col-md-12">
                      <div className="d-flex gap-3">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          {loading ? "Creating..." : "Create Question"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .options-container {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
          background-color: #f9f9f9;
        }

        .option-item {
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 15px;
          margin-bottom: 15px;
          position: relative;
        }

        .option-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .option-label {
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }

        .yes-no-options {
          display: flex;
          gap: 20px;
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 6px;
          border: 1px solid #e9ecef;
        }

        .form-check {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-check-input {
          margin: 0;
        }

        .form-check-label {
          margin: 0;
          font-weight: 500;
        }

        .cards {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 30px;
          margin-bottom: 30px;
        }

        .form-label {
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .form-control,
        .form-select {
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 10px 12px;
          font-size: 14px;
          transition: border-color 0.3s ease;
        }

        .form-control:focus,
        .form-select:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }

        .btn-primary {
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
          border: none;
          padding: 12px 24px;
          font-weight: 600;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
        }

        .btn-secondary {
          background: #6c757d;
          border: none;
          padding: 12px 24px;
          font-weight: 600;
          border-radius: 6px;
          color: white;
        }

        .btn-outline-primary {
          border: 1px solid #007bff;
          color: #007bff;
          background: transparent;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .btn-outline-primary:hover {
          background: #007bff;
          color: white;
        }

        .btn-outline-danger {
          border: 1px solid #dc3545;
          color: #dc3545;
          background: transparent;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .btn-outline-danger:hover {
          background: #dc3545;
          color: white;
        }

        .text-danger {
          color: #dc3545 !important;
        }

        /* Fixed ReactQuill Styling */
        :global(.custom-quill-editor) {
          margin-bottom: 20px;
        }

        :global(.custom-quill-editor .ql-container) {
          min-height: 200px;
          max-height: 400px;
          overflow-y: auto;
          border-bottom-left-radius: 6px;
          border-bottom-right-radius: 6px;
        }

        :global(.custom-quill-editor .ql-toolbar) {
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
          border-bottom: 1px solid #ccc;
        }

        :global(.custom-quill-editor-small) {
          margin-bottom: 15px;
        }

        :global(.custom-quill-editor-small .ql-container) {
          min-height: 120px;
          max-height: 200px;
          overflow-y: auto;
          border-bottom-left-radius: 6px;
          border-bottom-right-radius: 6px;
        }

        :global(.custom-quill-editor-small .ql-toolbar) {
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
          border-bottom: 1px solid #ccc;
        }

        :global(.ql-editor) {
          padding: 12px 15px;
          line-height: 1.6;
          font-size: 14px;
        }

        :global(.ql-toolbar.ql-snow) {
          padding: 8px;
          background-color: #f8f9fa;
        }

        :global(.ql-container.ql-snow) {
          border: 1px solid #ddd;
        }

        :global(.ql-toolbar.ql-snow) {
          border: 1px solid #ddd;
        }

        @media (max-width: 768px) {
          .cards {
            padding: 20px;
          }

          .option-item {
            padding: 10px;
          }

          .yes-no-options {
            flex-direction: column;
            gap: 10px;
          }

          :global(.custom-quill-editor .ql-container) {
            min-height: 150px;
          }

          :global(.custom-quill-editor-small .ql-container) {
            min-height: 100px;
          }
        }
      `}</style>
    </>
  );
}
