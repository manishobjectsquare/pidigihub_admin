"use client";

import { useState, useEffect } from "react";
import { baseUrl } from "../../../config/baseUrl";

const AddQuizQuestionModal = ({ isOpen, onClose, quizId }) => {
  const [formData, setFormData] = useState({
    quiz_id: quizId || "",
    question_text: "",
    question_type: "multiple_choice",
    options: [{ id: 1, option_text: "", is_correct: false }],
    correct_answer: "", // for short_answer or true_false
    marks: 1,
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      quiz_id: quizId || "",
    }));
  }, [quizId]);

  if (!isOpen) return null;

  // Handle input change for question_text, question_type, correct_answer, marks
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "marks" ? Number(value) : value,
    }));
  };

  // Handle option text change for multiple choice options
  const handleOptionChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((opt) =>
        opt.id === id ? { ...opt, option_text: value } : opt
      ),
    }));
  };

  // Handle toggling correct option checkbox
  const handleCorrectToggle = (id) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((opt) =>
        opt.id === id ? { ...opt, is_correct: !opt.is_correct } : opt
      ),
    }));
  };

  // Add new option for multiple choice
  const addOption = () => {
    const newId = Math.max(...formData.options.map((o) => o.id)) + 1;
    setFormData((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        { id: newId, option_text: "", is_correct: false },
      ],
    }));
  };

  // Remove option by id (minimum one option must remain)
  const removeOption = (id) => {
    if (formData.options.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((opt) => opt.id !== id),
    }));
  };

  // Validate form before submit
  const validate = () => {
    if (!formData.question_text.trim()) {
      alert("Question text is required.");
      return false;
    }
    if (formData.marks <= 0) {
      alert("Marks must be a positive number.");
      return false;
    }
    if (formData.question_type === "multiple_choice") {
      if (formData.options.some((opt) => !opt.option_text.trim())) {
        alert("All options must have text.");
        return false;
      }
      if (!formData.options.some((opt) => opt.is_correct)) {
        alert("At least one option must be marked correct.");
        return false;
      }
    } else {
      if (!formData.correct_answer.trim()) {
        alert("Correct answer is required.");
        return false;
      }
    }
    return true;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      quiz_id: formData.quiz_id,
      question_text: formData.question_text.trim(),
      question_type: formData.question_type,
      marks: formData.marks,
    };

    if (formData.question_type === "multiple_choice") {
      payload.options = formData.options.map(({ option_text, is_correct }) => ({
        option_text: option_text.trim(),
        is_correct,
      }));
      payload.correct_answer = "";
    } else {
      payload.correct_answer = formData.correct_answer.trim();
      payload.options = [];
    }

    try {
      const res = await fetch(
        `${baseUrl}/api/v1/admin/quiz-question/quiz-question-store`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();

      if (result.status) {
        alert("Quiz question created successfully!");
        onClose();
      } else {
        alert(result.message || "Failed to create quiz question");
      }
    } catch (error) {
      console.error("API error:", error);
      alert("Something went wrong while creating quiz question");
    }
  };

  return (
    <div
      className="modal fade show"
      style={{ display: "block" }}
      tabIndex="-1"
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">Add Quiz Question</h1>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="p-3">
            <form
              className="add_lesson_form instructor__profile-form"
              onSubmit={handleSubmit}
            >
              <div className="col-md-12 mb-3">
                <label htmlFor="question_text">
                  Question Text <code>*</code>
                </label>
                <input
                  id="question_text"
                  name="question_text"
                  type="text"
                  className="form-control"
                  value={formData.question_text}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="question_type">
                  Question Type <code>*</code>
                </label>
                <select
                  id="question_type"
                  name="question_type"
                  className="form-select"
                  value={formData.question_type}
                  onChange={handleChange}
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="true_false">True / False</option>
                  <option value="short_answer">Short Answer</option>
                </select>
              </div>

              {formData.question_type === "multiple_choice" ? (
                <div className="col-md-12">
                  <h5>Options</h5>
                  {formData.options.map((opt) => (
                    <div
                      key={opt.id}
                      className="mb-3 d-flex align-items-center"
                    >
                      <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Option text"
                        value={opt.option_text}
                        onChange={(e) =>
                          handleOptionChange(opt.id, e.target.value)
                        }
                        required
                      />
                      <label className="form-check-label me-2">
                        <input
                          type="checkbox"
                          checked={opt.is_correct}
                          onChange={() => handleCorrectToggle(opt.id)}
                        />{" "}
                        Correct
                      </label>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm ms-auto"
                        onClick={() => removeOption(opt.id)}
                        disabled={formData.options.length <= 1}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={addOption}
                  >
                    Add Option
                  </button>
                </div>
              ) : (
                <div className="col-md-12 mb-3">
                  <label htmlFor="correct_answer">
                    Correct Answer <code>*</code>
                  </label>
                  <input
                    id="correct_answer"
                    name="correct_answer"
                    type="text"
                    className="form-control"
                    value={formData.correct_answer}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="col-md-6 mb-3">
                <label htmlFor="marks">
                  Marks <code>*</code>
                </label>
                <input
                  id="marks"
                  name="marks"
                  type="number"
                  min="1"
                  className="form-control"
                  value={formData.marks}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn btn-primary submit-btn">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuizQuestionModal;
