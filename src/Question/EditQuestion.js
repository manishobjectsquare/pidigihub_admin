import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faArrowLeft,
  faPlus,
  faTrash,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { baseUrl } from "../config/baseUrl";
import loaderContext from "../context/LoaderContext";
import axios from "axios";

export default function EditQuestion() {
  let { setLoader } = useContext(loaderContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [sections, setSections] = useState([]);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [languageList, setLanguageList] = useState([]);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      const nextId = questions[newIndex]?._id;
      setCurrentQuestion(nextId);
      navigate(`/questions/edit/${nextId}`);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      const prevId = questions[newIndex]?._id;
      setCurrentQuestion(prevId);
      navigate(`/questions/edit/${prevId}`);
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      let response = await fetch(`${baseUrl}/questions/question-ids/all`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      let res = await response.json();
      setQuestions(res.data);
      setCurrentQuestion(id);
      res.data.forEach((arr, i) => {
        if (arr?._id === id) setCurrentIndex(i);
      });
    };
    fetchQuestions();
  }, [id]);

  const [formData, setFormData] = useState({
    subject_id: "",
    topic_id: "",
    subtopic_id: "",
    question_title: "",
    question_type: "text",
    description: "",
    solution: "",
    status: "active",
    options: [],
  });

  const convertApiOptionsObjectToArray = (optionsObject) => {
    if (
      !optionsObject ||
      typeof optionsObject !== "object" ||
      Array.isArray(optionsObject)
    ) {
      return [];
    }
    return Object.keys(optionsObject).map((key, index) => ({
      id: index + 1,
      option: optionsObject[key].value,
      correct: optionsObject[key].correct,
    }));
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoader(true);
      try {
        setFetchingData(true);
        const [questionRes, subjectsRes] = await Promise.all([
          fetch(`${baseUrl}/questions/${id}`, {
            headers: { Authorization: localStorage.getItem("token") },
          }),
          fetch(`${baseUrl}/subjects`, {
            headers: { Authorization: localStorage.getItem("token") },
          }),
        ]);

        const questionData = await questionRes.json();
        const subjectsData = await subjectsRes.json();

        setSubjects(subjectsData.data || []);

        if (questionData.status && questionData.data) {
          const question = questionData.data;
          const initialFormData = {
            subject_id: question.subject_id?._id || "",
            topic_id: question.topic_id?._id || "",
            subtopic_id: question.subtopic_id?._id || "",
            section_id: question.section_id?._id || "",
            question_title: question.question_title || "",
            question_type: question.question_type || "text",
            description: question.description || "",
            solution: question.solution || "",
            status: question.status || "active",
            language: question.language,
            // Use the conversion function here to fix the crash
            options: convertApiOptionsObjectToArray(question.options),
          };
          setFormData(initialFormData);

          if (initialFormData.subject_id) {
            fetchTopics(initialFormData.subject_id);
          }
          if (initialFormData.topic_id) {
            fetchSubtopics(initialFormData.topic_id);
          }
          fetchSections();
        } else {
          toast.error("Failed to load question data.");
          navigate("/questions");
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("An error occurred while fetching data.");
        navigate("/questions");
      } finally {
        setLoader(false);
        setFetchingData(false);
      }
    };

    fetchInitialData();
    fetchLanguageList();
  }, [id, navigate]);

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

  const fetchTopics = async (subjectId) => {
    try {
      const response = await fetch(`${baseUrl}/topics?subject=${subjectId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      const data = await response.json();
      setTopics(data.data || []);
    } catch (error) {
      console.error("Error fetching topics:", error);
      setTopics([]);
    }
  };

  const fetchSubtopics = async (topicId) => {
    try {
      const response = await fetch(`${baseUrl}/subtopics?topic=${topicId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      const data = await response.json();
      setSubtopics(data.data || []);
    } catch (error) {
      console.error("Error fetching subtopics:", error);
      setSubtopics([]);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === "subject_id") {
        newState.topic_id = "";
        newState.subtopic_id = "";
        setTopics([]);
        setSubtopics([]);
        if (value) fetchTopics(value);
      }
      if (name === "topic_id") {
        newState.subtopic_id = "";
        setSubtopics([]);
        if (value) fetchSubtopics(value);
      }
      if (name === "question_type") {
        newState.options = getInitialOptionsForType(value);
      }
      return newState;
    });
  };

  const getInitialOptionsForType = (type) => {
    switch (type) {
      case "text":
        return [{ id: 1, option: "", correct: true }];
      case "yes_no":
        return [
          { id: 1, option: "Yes", correct: false },
          { id: 2, option: "No", correct: false },
        ];
      default:
        return [
          { id: 1, option: "", correct: false },
          { id: 2, option: "", correct: false },
        ];
    }
  };

  const handleQuillChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOptionContentChange = (optionId, content) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((opt) =>
        opt.id === optionId ? { ...opt, option: content } : opt
      ),
    }));
  };

  const handleCorrectChange = (optionId) => {
    setFormData((prev) => {
      let newOptions = [...prev.options];
      if (
        prev.question_type === "single_choice" ||
        prev.question_type === "yes_no"
      ) {
        newOptions = newOptions.map((opt) => ({
          ...opt,
          correct: opt.id === optionId,
        }));
      } else {
        newOptions = newOptions.map((opt) =>
          opt.id === optionId ? { ...opt, correct: !opt.correct } : opt
        );
      }
      return { ...prev, options: newOptions };
    });
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        {
          id:
            prev.options.length > 0
              ? Math.max(...prev.options.map((o) => o.id)) + 1
              : 1,
          option: "",
          correct: false,
        },
      ],
    }));
  };

  const removeOption = (optionId) => {
    if (formData.options.length > 2) {
      setFormData((prev) => ({
        ...prev,
        options: prev.options.filter((opt) => opt.id !== optionId),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { subject_id, topic_id, subtopic_id, question_title, options } =
      formData;

    if (!subject_id || !topic_id || !subtopic_id || !question_title) {
      toast.error("Please fill all required fields.");
      setLoading(false);
      return;
    }

    const finalOptions = options.map(({ option, correct }) => ({
      option,
      correct,
    }));

    const payload = {
      ...formData,
      options: finalOptions,
    };
    delete payload.options.id;

    try {
      const response = await fetch(`${baseUrl}/questions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.status) {
        toast.success("Question updated successfully!");
        navigate(-1);
      } else {
        toast.error(result.message || "Failed to update question.");
      }
    } catch (error) {
      console.error("Error updating question:", error);
      toast.error("An error occurred while updating the question.");
    } finally {
      setLoading(false);
    }
  };

  const renderOptions = () => {
    const { question_type, options } = formData;
    switch (question_type) {
      case "text":
        return (
          <div className="col-md-12 mb-3">
            <label className="form-label">
              Correct Answer <span className="text-danger">*</span>
            </label>
            <ReactQuill
              theme="snow"
              value={options[0]?.option || ""}
              onChange={(value) =>
                handleOptionContentChange(options[0].id, value)
              }
            />
          </div>
        );
      case "yes_no":
        return (
          <div className="col-md-12 mb-3">
            <label className="form-label">
              Correct Answer <span className="text-danger">*</span>
            </label>
            <div className="d-flex gap-3">
              {options.map((opt) => (
                <div className="form-check" key={opt.id}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="correctAnswer"
                    id={`option-${opt.id}`}
                    checked={opt.correct}
                    onChange={() => handleCorrectChange(opt.id)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`option-${opt.id}`}
                  >
                    {opt.option}
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
            {options.map((opt, index) => (
              <div key={opt.id} className="option-item mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label mb-0">Option {index + 1}</label>
                  {options.length > 2 && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeOption(opt.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </div>
                <ReactQuill
                  theme="snow"
                  value={opt.option}
                  onChange={(value) => handleOptionContentChange(opt.id, value)}
                />
                <div className="form-check mt-2">
                  <input
                    className="form-check-input"
                    type={
                      question_type === "single_choice" ? "radio" : "checkbox"
                    }
                    name={
                      question_type === "single_choice"
                        ? "correctAnswer"
                        : `correct-${opt.id}`
                    }
                    id={`correct-${opt.id}`}
                    checked={opt.correct}
                    onChange={() => handleCorrectChange(opt.id)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`correct-${opt.id}`}
                  >
                    Correct
                  </label>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={addOption}
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" /> Add Option
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (fetchingData) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <section className="main-sec">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6">
            <div className="dashboard-title">
              <h4 className="dash-head">
                <FontAwesomeIcon icon={faQuestionCircle} className="me-2" />
                Edit Question
              </h4>
            </div>
          </div>
          <div className="col-lg-6 d-flex justify-content-end align-items-start">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="btn-add-question me-2"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              prev
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
              className="btn-add-question me-2"
            >
              next
              <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
            </button>

            <button onClick={() => navigate(-1)} className="btn-add-question">
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Back
            </button>
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="btn-add-question ms-2"
            >
              {loading ? "Updating..." : "Update Question"}
            </button>
          </div>
        </div>
        <div className="cards">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Subject <span className="text-danger">*</span>
                </label>
                <select
                  name="subject_id"
                  className="form-select"
                  value={formData.subject_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Topic <span className="text-danger">*</span>
                </label>
                <select
                  name="topic_id"
                  className="form-select"
                  value={formData.topic_id}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.subject_id}
                >
                  <option value="">Select Topic</option>
                  {topics.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.topic_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Subtopic <span className="text-danger">*</span>
                </label>
                <select
                  name="subtopic_id"
                  className="form-select"
                  value={formData.subtopic_id}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.topic_id}
                >
                  <option value="">Select Subtopic</option>
                  {subtopics.map((st) => (
                    <option key={st._id} value={st._id}>
                      {st.sub_topic_name}
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
                  className={`form-select  `}
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
              <div className="col-md-8 mb-3">
                <label className="form-label">
                  Question Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="question_title"
                  className="form-control"
                  value={formData.question_title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {/* <div className="col-md-4 mb-3">
                                <label className="form-label">
                                    Question Type <span className="text-danger">*</span>
                                </label>
                                <select
                                    name="question_type"
                                    className="form-select"
                                    value={formData.question_type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="text">Text</option>
                                    <option value="yes_no">Yes/No</option>
                                    <option value="single_choice">Single Choice</option>
                                    <option value="multiple_choice">Multiple Choice</option>
                                </select>
                            </div> */}
              {renderOptions()}
              <div className="col-md-12 mb-3">
                <label className="form-label">Description</label>
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={(val) => handleQuillChange("description", val)}
                />
              </div>
              <div className="col-md-12 mb-3">
                <label className="form-label">Solution</label>
                <ReactQuill
                  theme="snow"
                  value={formData.solution}
                  onChange={(val) => handleQuillChange("solution", val)}
                />
              </div>
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
              <div className="col-md-12">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Question"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
