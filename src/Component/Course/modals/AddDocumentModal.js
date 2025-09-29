"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../config/baseUrl";

const AddDocumentModal = ({
  isOpen,
  onClose,
  chapters,
  chapterId,
  type,
  courseId,
}) => {
  const [formData, setFormData] = useState({
    course_id: courseId || "",
    chapter_id: chapterId || "",
    type: type || "document",
    chapter: chapterId || "",
    title: "",
    file_type: "",
    description: "",
    upload_path: null, // Will store the File object here
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      chapter_id: chapterId || "",
      chapter: chapterId || "",
      type: type || "document",
      course_id: courseId || "",
    }));
  }, [chapterId, type, courseId]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0], // Save the file object
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("course_id", formData.course_id);
      data.append("chapter_id", formData.chapter_id);
      data.append("title", formData.title);
      data.append("file_type", formData.file_type);
      data.append("description", formData.description);

      if (formData.upload_path) {
        data.append("path", formData.upload_path); // Key must match multer's single('file') or single('upload_path')
      }

      const res = await axios.post(
        `${baseUrl}/api/v1/admin/chapter-doc/documnet-create`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.status) {
        alert("Document created successfully!");
        onClose();
      } else {
        alert(res.data.message || "Failed to create document");
      }
    } catch (err) {
      console.error("Create document error:", err);
      alert("An error occurred while creating the document.");
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
            <h1 className="modal-title fs-5">Add Document</h1>
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
                    name="chapter_id"
                    id="chapter"
                    className="chapter from-select form-select"
                    value={formData.chapter_id}
                    onChange={handleChange}
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
                    className="form-control"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-9 upload">
                  <div className="from-group mb-3">
                    <label
                      className="form-file-manager-label"
                      htmlFor="upload_path"
                    >
                      Upload Document <code>*</code>
                    </label>
                    <div className="input-group custom-frm-bx">
                      <input
                        id="upload_path"
                        className="form-control file-manager-input"
                        type="file"
                        name="upload_path"
                        accept=".pdf,.txt,.doc,.docx"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="custom-frm-bx">
                    <label htmlFor="file_type_select">
                      File Type <code>*</code>
                    </label>
                    <select
                      name="file_type"
                      id="file_type_select"
                      className="file_type form-select"
                      value={formData.file_type}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select</option>
                      <option value="pdf">PDF</option>
                      <option value="txt">TXT</option>
                      <option value="docx">DOCX</option>
                    </select>
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

export default AddDocumentModal;
