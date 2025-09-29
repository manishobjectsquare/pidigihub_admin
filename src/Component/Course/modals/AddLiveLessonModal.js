"use client";

import { useState, useEffect } from "react";
import { baseUrl } from "../../../config/baseUrl";

const AddLiveLessonModal = ({
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
    type: type || "live",
    chapter: chapterId || "",
    title: "",
    live_type: "zoom",
    start_time: "",
    duration: "",
    meeting_id: "",
    password: "",
    join_url: "",
    description: "",
    student_mail_sent: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      chapter_id: chapterId || "",
      chapter: chapterId || "",
      type: type || "live",
      course_id: courseId || "",
    }));
  }, [chapterId, type, courseId]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
    if (!formData.start_time) {
      alert("Start time is required");
      return false;
    }
    if (
      !formData.duration ||
      isNaN(formData.duration) ||
      formData.duration <= 0
    ) {
      alert("Duration must be a positive number");
      return false;
    }
    if (!formData.meeting_id.trim()) {
      alert("Meeting ID is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        chapter_id: formData.chapter,
        course_id: formData.course_id,
        instructor_id: instructorId,
        title: formData.title.trim(),
        live_platform_type: formData.live_type,
        start_time: new Date(formData.start_time).toISOString(),
        duration: Number(formData.duration),
        meeting_id: formData.meeting_id.trim(),
        password: formData.password.trim(),
        join_url: formData.join_url.trim(),
        description: formData.description.trim(),
        email_to_all_students: formData.student_mail_sent,
        is_free: false,
        status: "scheduled",
      };

      const response = await fetch(
        `${baseUrl}/api/v1/admin/live-lesson/live-lession-store`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (result.status) {
        alert("Live lesson created successfully!");
        onClose();
      } else {
        alert(result.message || "Failed to create live lesson");
      }
    } catch (error) {
      console.error("Error:", error);
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
            <h1 className="modal-title fs-5">Add Live Lesson</h1>
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
                      <option key={chapter.id} value={chapter.id}>
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
                    className="form-control"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-3">
                  <div className="custom-frm-bx">
                    <label htmlFor="live_type">
                      Live Platform <code>*</code>
                    </label>
                    <select
                      name="live_type"
                      id="live_type"
                      className="form-select"
                      value={formData.live_type}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="zoom">Zoom</option>
                      <option value="jitsi">Jitsi</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="custom-frm-bx">
                    <label htmlFor="start_time">
                      Start Time <code>*</code>
                    </label>
                    <input
                      id="start_time"
                      name="start_time"
                      className="form-control"
                      type="datetime-local"
                      value={formData.start_time}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="custom-frm-bx">
                    <label htmlFor="duration">
                      Duration <code>* (in minutes)</code>
                    </label>
                    <input
                      id="duration"
                      name="duration"
                      className="form-control"
                      type="number"
                      min="1"
                      value={formData.duration}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>
              </div>

              <div
                className={`col-12 zoom-alert-box ${
                  formData.live_type === "jitsi" ? "d-none" : ""
                }`}
              >
                <div className="alert alert-warning" role="alert">
                  The meeting ID, password, and Zoom settings must be configured
                  using the same Zoom account. The course creator needs to set
                  up the <a href="#">Zoom live setting</a>.
                </div>
              </div>

              <div
                className={`col-12 jitsi-alert-box ${
                  formData.live_type === "zoom" ? "d-none" : ""
                }`}
              >
                <div className="alert alert-warning" role="alert">
                  The meeting ID and Jitsi settings must be configured. The
                  course creator needs to set up the{" "}
                  <a href="#">Jitsi setting</a>.
                </div>
              </div>

              <div className="row">
                <div
                  className={`col-md-${
                    formData.live_type === "jitsi" ? "12" : "6"
                  } meeting-id-box`}
                >
                  <div className="custom-frm-bx">
                    <label htmlFor="meeting_id">
                      Meeting ID <code>*</code>
                    </label>
                    <input
                      id="meeting_id"
                      name="meeting_id"
                      className="form-control"
                      type="text"
                      value={formData.meeting_id}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div
                  className={`col-md-6 zoom-box ${
                    formData.live_type === "jitsi" ? "d-none" : ""
                  }`}
                >
                  <div className="custom-frm-bx">
                    <label htmlFor="password">
                      Password <code>*</code>
                    </label>
                    <input
                      id="password"
                      name="password"
                      className="form-control"
                      type="text"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div
                  className={`col-md-12 zoom-box ${
                    formData.live_type === "jitsi" ? "d-none" : ""
                  }`}
                >
                  <div className="custom-frm-bx">
                    <label htmlFor="join_url">Join URL</label>
                    <input
                      id="join_url"
                      name="join_url"
                      className="form-control"
                      type="url"
                      value={formData.join_url}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="custom-frm-bx">
                  <label htmlFor="description">Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={loading}
                  ></textarea>
                </div>
              </div>

              <div className="col-md-12 mb-3">
                <div className="account__check-remember">
                  <input
                    id="student_mail_sent"
                    type="checkbox"
                    className="form-check-input"
                    name="student_mail_sent"
                    checked={formData.student_mail_sent}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <label
                    htmlFor="student_mail_sent"
                    className="form-check-label"
                  >
                    Email to all students.
                  </label>
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

export default AddLiveLessonModal;
