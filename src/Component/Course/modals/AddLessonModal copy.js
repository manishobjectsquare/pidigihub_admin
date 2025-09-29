"use client";

import { useState, useEffect } from "react";

const AddLessonModal = ({ isOpen, onClose, chapters, chapterId, type }) => {
  const [formData, setFormData] = useState({
    course_id: "",
    chapter_id: "",
    type: type || "lesson",
    chapter: chapterId || "",
    title: "",
    source: "",
    file_type: "",
    duration: "",
    is_free: false,
    description: "",
    upload_path: "",
    link_path: "",
  });

  useEffect(() => {
    setFormData({
      ...formData,
      chapter_id: chapterId || "",
      chapter: chapterId || "",
      type: type || "lesson",
    });
  }, [chapterId, type]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // onClose();
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
            <h1 className="modal-title fs-5">Add Lesson</h1>
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
                  >
                    <option value="">Select</option>
                    {chapters.map((chapter) => (
                      <option key={chapter._id} value={chapter.id}>
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
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="custom-frm-bx">
                    <label htmlFor="source">
                      Source <code>*</code>
                    </label>
                    <select
                      name="source"
                      id="source"
                      className="source form-select"
                      value={formData.source}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="upload">Upload</option>
                      <option value="youtube">YouTube</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="custom-frm-bx">
                    <label htmlFor="file_type">
                      File Type <code>*</code>
                    </label>
                    <select
                      name="file_type"
                      id="file_type"
                      className="file_type form-select"
                      value={formData.file_type}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="video">Video</option>
                      <option value="link">Link</option>
                    </select>
                  </div>
                </div>

                <div
                  className={`col-md-9 upload ${
                    formData.source == "upload" ? "" : "d-none"
                  }`}
                >
                  <div className="from-group mb-3 custom-frm-bx">
                    <label className="form-file-manager-label" htmlFor="">
                      Video Upload <code>*</code>
                    </label>
                    <div className="input-group">
                      <input
                        id="path"
                        readOnly
                        className="form-control file-manager-input"
                        type="file"
                        name="video"
                        accept="video/*"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className={`col-md-12 cloud_storage d-none custom-frm-bx`}>
                  <div className="custom-frm-bx mb-3">
                    <label className="form-file-manager-label" htmlFor="">
                      Upload
                    </label>
                    <div className="input-group">
                      <div className="input-group">
                        <input
                          id="file-input"
                          type="file"
                          className="form-control"
                        />
                        <button
                          type="button"
                          id="cloud-btn"
                          className="input-group-text"
                          //   id="basic-addon1"
                        >
                          <i className="fas fa-upload"></i>
                        </button>
                      </div>
                    </div>
                    <div className="progress d-none">
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated w-100"
                        role="progressbar"
                        aria-valuenow="100"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                </div>
                <div
                  className={`col-md-9 link_path ${
                    formData.source !== "upload" ? "" : "d-none"
                  }`}
                >
                  <div className="custom-frm-bx">
                    <label htmlFor="meta_description">
                      Path <code>*</code>
                    </label>
                    <div className="input-group mb-3">
                      <span className="input-group-text" id="basic-addon1">
                        <i className="fa fa-link"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="input_link"
                        name="link_path"
                        placeholder="paste source url"
                        value={formData.link_path}
                        onChange={handleChange}
                      />
                    </div>
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
                      type="text"
                      value={formData.duration}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              {/* <div className="row is_free_wrapper">
                <div className="col-md-6 mt-2 mb-3">
                  <span className="toggle-label">Preview</span>
                  <div className="switcher">
                    <label htmlFor="toggle-0">
                      <input
                        type="checkbox"
                        id="toggle-0"
                        value="1"
                        name="is_free"
                        checked={formData.is_free}
                        onChange={handleChange}
                      />
                      <span>
                        <small></small>
                      </span>
                    </label>
                  </div>
                </div>
              </div> */}

              <div className="col-md-12">
                <div className="custom-frm-bx">
                  <label htmlFor="description">
                    Description <code></code>
                  </label>
                  <textarea
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>
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

export default AddLessonModal;
