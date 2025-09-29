"use client";

import { useState, useEffect, useContext } from "react";
import { baseUrl } from "../../../config/baseUrl";
import axios from "axios";
import loaderContext from "../../../context/LoaderContext";
import toastify from "../../../config/toastify";

const EditLessonModal = ({ isOpen, onClose, chapters, chapterItem }) => {
  let { setLoader } = useContext(loaderContext);
  const [formData, setFormData] = useState({
    course_id: chapterItem?.courseId || "",
    type: chapterItem?.type || "lesson",
    chapter: chapterItem?.chapterId || "",
    title: "",
    source: "",
    file_type: "",
    duration: "",
    is_free: false,
    description: "",
    upload_path: "",
    link_path: "",
  });

  // 6825c04232503dce40b9ba1c
  //   useEffect(() => {
  //     if (chapterItem) {
  //       // In a real app, you would fetch the lesson data from your backend
  //       // For now, we'll just use the chapterItem data
  //         setFormData({
  //           course_id: chapterItem.courseId || "",
  //           chapter_item_id: chapterItem.chapterItemId || "",
  //           type: chapterItem.type || "lesson",
  //           chapter: chapterItem.chapterId || "",
  //           title: chapterItem.title || "",
  //           source: chapterItem.source || "",
  //           file_type: chapterItem.file_type || "",
  //           duration: chapterItem.duration || "",
  //           is_free: chapterItem.is_free || false,
  //           description: chapterItem.description || "",
  //           upload_path: chapterItem.upload_path || "",
  //           link_path: chapterItem.link_path || "",
  //         });
  //     }
  //   }, [chapterItem]);

  useEffect(() => {
    const fetchChapterItem = async () => {
      if (!chapterItem?.chapterItemId) return;

      try {
        const res = await axios.get(
          `${baseUrl}/api/v1/admin/chapter-lesson/lessons-view/${chapterItem?.chapterItemId}`
        );
        const item = res.data.data;

        setFormData({
          course_id: item.course_id || "",
          type: item.type || "lesson",
          chapter: item.chapter_id || "",
          title: item.title || "",
          source: item.source || "",
          file_type: item.file_type || "",
          duration: item.duration || "",
          is_free: item.is_free || false,
          description: item.description || "",
          upload_path: item.upload_path || "",
          link_path: item.video_link || "",
        });
      } catch (err) {
        console.error("Error fetching chapter item:", err);
      }
    };

    fetchChapterItem();
  }, [chapterItem?.chapterItemId]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      course_id,
      chapter,
      title,
      source,
      file_type,
      duration,
      is_free,
      description,
      upload_path,
      link_path,
      chapter_item_id,
      type,
    } = formData;

    // Validation similar to add

    try {
      const data = new FormData();
      setLoader(true);

      data.append("chapter_id", chapter);
      data.append("type", type);
      data.append("title", title);
      data.append("source", source);
      data.append("file_type", file_type);
      data.append("duration", duration);
      data.append("is_free", is_free);
      data.append("description", description);

      if (source === "upload") {
        // Only append file if it's a File object (upload)
        console.log(upload_path);

        if (upload_path instanceof File) {
          data.append("file", upload_path);
        }
      } else {
        data.append("video_link", link_path);
      }

      const res = await axios.put(
        `${baseUrl}/api/v1/admin/chapter-lesson/lessons-edit/${chapterItem?.chapterItemId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Lesson updated successfully:", res.data);
      toastify.success("Lesson updated successfully");
      onClose();
    } catch (err) {
      console.error(
        "Error updating lesson:",
        err.response?.data || err.message
      );
      alert("Error updating lesson");
    } finally {
      setLoader(false);
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
            <h1 className="modal-title fs-5">Edit Lesson</h1>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="p-3">
            <form
              className="update_lesson_form instructor__profile-form"
              onSubmit={handleSubmit}
            >
              <input
                type="hidden"
                name="course_id"
                value={formData.course_id}
              />
              <input
                type="hidden"
                name="chapter_item_id"
                value={formData.chapter_item_id}
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
                      {/* <option value="upload">Upload</option>
                      <option value="youtube">YouTube</option>
                      <option value="vimeo">Vimeo</option>
                      <option value="external_link">External Link</option> */}
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
                      <option value="file">File</option>
                    </select>
                  </div>
                </div>

                <div
                  className={`col-md-9 upload ${
                    formData.source === "upload" ? "" : "d-none"
                  }`}
                >
                  <div className="from-group mb-3 custom-frm-bx">
                    <label className="form-file-manager-label" htmlFor="">
                      Video Upload <code>*</code>
                    </label>
                    <div className="input-group">
                      <input
                        id="upload_path"
                        className="form-control file-manager-input"
                        type="file"
                        name="upload_path"
                        accept="video/*"
                        onChange={handleChange}
                      />
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
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLessonModal;
