"use client";

import { useState, useEffect } from "react";
import { baseUrl } from "../../../config/baseUrl";

const AddQuizModal = ({
  isOpen,
  onClose,
  chapters,
  chapterId,
  type,
  courseId,
  instructorId,
}) => {
  const [formData, setFormData] = useState({
    course_id: courseId || "",
    chapter_id: chapterId || "",
    type: type || "quiz",
    chapter: chapterId || "",
    title: "",
    time_limit: "",
    attempts: "",
    total_mark: "",
    pass_mark: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      chapter_id: chapterId || "",
      chapter: chapterId || "",
      type: type || "quiz",
      course_id: courseId || "",
    }));
  }, [chapterId, type, courseId]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    if (!formData.chapter) {
      alert("Please select a chapter");
      return false;
    }
    if (!formData.title.trim()) {
      alert("Title is required");
      return false;
    }
    if (
      !formData.total_mark ||
      isNaN(formData.total_mark) ||
      Number(formData.total_mark) <= 0
    ) {
      alert("Total mark must be a positive number");
      return false;
    }
    if (
      !formData.pass_mark ||
      isNaN(formData.pass_mark) ||
      Number(formData.pass_mark) < 0
    ) {
      alert("Pass mark must be zero or a positive number");
      return false;
    }
    // time_limit and attempts can be empty or numeric
    if (
      formData.time_limit &&
      (isNaN(formData.time_limit) || Number(formData.time_limit) <= 0)
    ) {
      alert("Time limit must be a positive number if provided");
      return false;
    }
    if (
      formData.attempts &&
      (isNaN(formData.attempts) || Number(formData.attempts) <= 0)
    ) {
      alert("Attempts must be a positive number if provided");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const payload = {
      instructor_id: instructorId, // Must be passed as prop
      chapter_id: formData.chapter,
      course_id: formData.course_id,
      title: formData.title.trim(),
      time: formData.time_limit ? Number(formData.time_limit) : 0, // zero means unlimited
      attempt: formData.attempts ? Number(formData.attempts) : 0, // zero means unlimited
      total_mark: Number(formData.total_mark),
      pass_mark: Number(formData.pass_mark),
      status: "draft", // default or change as you want
    };

    try {
      const response = await fetch(`${baseUrl}/api/v1/admin/quiz/quiz-store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.status) {
        alert("Quiz created successfully!");
        onClose();
      } else {
        alert(result.message || "Failed to create quiz");
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
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
            <h1 className="modal-title fs-5">Add Quiz</h1>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>
          <div className="p-3">
            <form
              className="add_lesson_form instructor__profile-form"
              onSubmit={handleSubmit}
            >
              <input
                type="hidden"
                name="course_id"
                value={formData.course_id}
              />
              <input
                type="hidden"
                name="chapter_id"
                value={formData.chapter_id}
              />
              <input type="hidden" name="type" value={formData.type} />

              <div className="col-md-12">
                <div className="custom-frm-bx">
                  <label htmlFor="chapter">
                    Chapter <code>*</code>
                  </label>
                  <select
                    name="chapter"
                    id="chapter"
                    className="chapter form-select"
                    value={formData.chapter}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">Select</option>
                    {chapters.map((chapter) => (
                      <option key={chapter._id} value={chapter._id}>
                        {chapter.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-12">
                <div className="custom-frm-bx">
                  <label htmlFor="title">
                    Title <code>*</code>
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    className="form-control"
                    value={formData.title}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="custom-frm-bx">
                    <label htmlFor="time_limit">
                      Time Limit <code>(leave empty for unlimited)</code>
                    </label>
                    <input
                      id="time_limit"
                      name="time_limit"
                      className="form-control"
                      type="text"
                      value={formData.time_limit}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="custom-frm-bx">
                    <label htmlFor="attempts">
                      Attempts <code>(leave empty for unlimited)</code>
                    </label>
                    <input
                      id="attempts"
                      name="attempts"
                      className="form-control"
                      type="text"
                      value={formData.attempts}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="custom-frm-bx">
                    <label htmlFor="total_mark">
                      Total mark <code>*</code>
                    </label>
                    <input
                      id="total_mark"
                      name="total_mark"
                      className="form-control"
                      type="text"
                      value={formData.total_mark}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="custom-frm-bx">
                    <label htmlFor="pass_mark">
                      Pass mark <code>*</code>
                    </label>
                    <input
                      id="pass_mark"
                      name="pass_mark"
                      className="form-control"
                      type="text"
                      value={formData.pass_mark}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary submit-btn"
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuizModal;
