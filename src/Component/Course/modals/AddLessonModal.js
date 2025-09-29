// // Modified handleSubmit and state to support file upload to the API

// import axios from "axios";
// import { useEffect, useState, useContext } from "react";
// import { useParams } from "react-router-dom";
// import loaderContext from "../../../context/LoaderContext";
// import toastify from "../../../config/toastify";
// import { baseUrl } from "../../../config/baseUrl";
// const AddLessonModal = ({
//   isOpen,
//   onClose,
//   chapters,
//   chapterId,
//   type,
//   instructorId,
// }) => {
//   let { id: courseId } = useParams();
//   // console.log(courseId);
//   const [formData, setFormData] = useState({
//     course_id: courseId || "",
//     chapter_id: chapterId || "",
//     type: type || "lesson",
//     chapter: chapterId || "",
//     title: "",
//     source: "",
//     file_type: "",
//     duration: "",
//     is_free: false,
//     description: "",
//     upload_path: null,
//     link_path: "",
//   });
//   let { setLoader } = useContext(loaderContext);
//   useEffect(() => {
//     setFormData((prev) => ({
//       ...prev,
//       chapter_id: chapterId || "",
//       chapter: chapterId || "",
//       type: type || "lesson",
//       course_id: courseId || "",
//     }));
//   }, [chapterId, type, courseId]);

//   if (!isOpen) return null;

//   const handleChange = (e) => {
//     const { name, value, type, checked, files } = e.target;
//     setFormData({
//       ...formData,
//       [name]:
//         type === "checkbox" ? checked : type === "file" ? files[0] : value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const {
//       course_id,
//       chapter_id,
//       title,
//       source,
//       file_type,
//       duration,
//       is_free,
//       description,
//     } = formData;

//     if (!course_id) {
//       toastify.error("course_id is required");
//       return;
//     }
//     if (!chapter_id) {
//       toastify.error("chapter_id is required");
//       return;
//     }

//     if (!title) {
//       toastify.error("title is required");
//       return;
//     }
//     if (!source) {
//       toastify.error("source is required");
//       return;
//     }
//     if (!file_type) {
//       toastify.error("file_type is required");
//       return;
//     }
//     if (!duration) {
//       toastify.error("duration is required");
//       return;
//     }

//     if (!description) {
//       toastify.error("description is required");
//       return;
//     }
//     try {
//       const data = new FormData();
//       setLoader(true);
//       data.append("course_id", formData.course_id);
//       data.append("chapter_id", formData.chapter_id);
//       data.append("instructor_id", instructorId);
//       data.append("title", formData.title);
//       data.append("source", formData.source);
//       data.append("file_type", formData.file_type);
//       data.append("duration", formData.duration);
//       data.append("is_free", formData.is_free);
//       data.append("description", formData.description);

//       if (formData.source === "upload") {
//         data.append("file", formData.upload_path);
//       } else {
//         data.append("video_link", formData.link_path);
//       }

//       const res = await axios.post(
//         `${baseUrl}/api/v1/admin/chapter-lesson/lesson-store`,
//         data,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       console.log("Lesson created successfully:", res.data);
//       toastify.success("Lesson created successfully");
//       onClose();
//     } catch (err) {
//       console.error(
//         "Error creating lesson:",
//         err.response?.data || err.message
//       );
//       alert("Error creating lesson");
//     } finally {
//       setLoader(false);
//     }
//   };

//   return (
//     <div
//       className="modal fade show"
//       style={{ display: "block" }}
//       tabIndex="-1"
//       aria-modal="true"
//       role="dialog"
//     >
//       <div className="modal-dialog modal-dialog-centered modal-lg">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h1 className="modal-title fs-5">Add Lesson</h1>
//             <button
//               type="button"
//               className="btn-close"
//               onClick={onClose}
//             ></button>
//           </div>
//           <div className="p-3">
//             <form
//               className="add_lesson_form instructor__profile-form"
//               onSubmit={handleSubmit}
//             >
//               <input
//                 type="hidden"
//                 name="course_id"
//                 value={formData.course_id}
//               />
//               <input
//                 type="hidden"
//                 name="chapter_id"
//                 value={formData.chapter_id}
//               />
//               <input type="hidden" name="type" value={formData.type} />

//               <div className="col-md-12">
//                 <div className="custom-frm-bx">
//                   <label htmlFor="chapter">
//                     Chapter <code>*</code>
//                   </label>
//                   <select
//                     name="chapter"
//                     id="chapter"
//                     className="chapter form-select"
//                     value={formData.chapter}
//                     onChange={handleChange}
//                   >
//                     <option value="">Select</option>
//                     {chapters.map((chapter) => (
//                       <option key={chapter._id} value={chapter._id}>
//                         {chapter.title}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="col-md-12">
//                 <div className="custom-frm-bx">
//                   <label htmlFor="title">
//                     Title <code>*</code>
//                   </label>
//                   <input
//                     id="title"
//                     name="title"
//                     className="form-control"
//                     type="text"
//                     value={formData.title}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>

//               <div className="row">
//                 <div className="col-md-6">
//                   <div className="custom-frm-bx">
//                     <label htmlFor="source">
//                       Source <code>*</code>
//                     </label>
//                     <select
//                       name="source"
//                       id="source"
//                       className="source form-select"
//                       value={formData.source}
//                       onChange={handleChange}
//                     >
//                       <option value="">Select</option>
//                       <option value="upload">Upload</option>
//                       <option value="youtube">YouTube</option>
//                     </select>
//                   </div>
//                 </div>
//                 <div className="col-md-6">
//                   <div className="custom-frm-bx">
//                     <label htmlFor="file_type">
//                       File Type <code>*</code>
//                     </label>
//                     <select
//                       name="file_type"
//                       id="file_type"
//                       className="file_type form-select"
//                       value={formData.file_type}
//                       onChange={handleChange}
//                     >
//                       <option value="">Select</option>
//                       <option value="video">Video</option>
//                       <option value="link">Link</option>
//                     </select>
//                   </div>
//                 </div>

//                 {formData.source === "upload" && (
//                   <div className="col-md-9 upload">
//                     <div className="from-group mb-3 custom-frm-bx">
//                       <label className="form-file-manager-label">
//                         Video Upload <code>*</code>
//                       </label>
//                       <div className="input-group">
//                         <input
//                           id="upload_path"
//                           className="form-control file-manager-input"
//                           type="file"
//                           name="upload_path"
//                           accept="video/*"
//                           onChange={handleChange}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {formData.source !== "upload" && (
//                   <div className="col-md-9 link_path">
//                     <div className="custom-frm-bx">
//                       <label htmlFor="link_path">
//                         Path <code>*</code>
//                       </label>
//                       <div className="input-group mb-3">
//                         <span className="input-group-text" id="basic-addon1">
//                           <i className="fa fa-link"></i>
//                         </span>
//                         <input
//                           type="text"
//                           className="form-control"
//                           id="link_path"
//                           name="link_path"
//                           placeholder="paste source url"
//                           value={formData.link_path}
//                           onChange={handleChange}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <div className="col-md-3">
//                   <div className="custom-frm-bx">
//                     <label htmlFor="duration">
//                       Duration <code>* (in minutes)</code>
//                     </label>
//                     <input
//                       id="duration"
//                       name="duration"
//                       className="form-control"
//                       type="text"
//                       value={formData.duration}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="col-md-12">
//                 <div className="custom-frm-bx">
//                   <label htmlFor="description">Description</label>
//                   <textarea
//                     name="description"
//                     className="form-control"
//                     value={formData.description}
//                     onChange={handleChange}
//                   ></textarea>
//                 </div>
//               </div>

//               <div className="modal-footer">
//                 <button type="submit" className="btn btn-primary submit-btn">
//                   Create
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddLessonModal;
"use client"

// Modified handleSubmit and state to support file upload to the API

import axios from "axios"
import { useEffect, useState, useContext } from "react"
import { useParams } from "react-router-dom"
import loaderContext from "../../../context/LoaderContext"
import toastify from "../../../config/toastify"
import { baseUrl } from "../../../config/baseUrl"

const AddLessonModal = ({ isOpen, onClose, chapters, chapterId, type, instructorId }) => {
  const { id: courseId } = useParams()
  // console.log(courseId);
  const [formData, setFormData] = useState({
    course_id: courseId || "",
    chapter_id: chapterId || "",
    type: type || "lesson",
    chapter: chapterId || "",
    title: "",
    source: "",
    file_type: "",
    duration: "",
    is_free: false,
    description: "",
    upload_path: null,
    link_path: "",
  })

  // Added progress state for upload tracking
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showProgress, setShowProgress] = useState(false)

  const { setLoader } = useContext(loaderContext)

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      chapter_id: chapterId || "",
      chapter: chapterId || "",
      type: type || "lesson",
      course_id: courseId || "",
    }))
  }, [chapterId, type, courseId])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { course_id, chapter_id, title, source, file_type, duration, is_free, description } = formData

    if (!course_id) {
      toastify.error("course_id is required")
      return
    }
    if (!chapter_id) {
      toastify.error("chapter_id is required")
      return
    }

    if (!title) {
      toastify.error("title is required")
      return
    }
    if (!source) {
      toastify.error("source is required")
      return
    }
    if (!file_type) {
      toastify.error("file_type is required")
      return
    }
    if (!duration) {
      toastify.error("duration is required")
      return
    }

    if (!description) {
      toastify.error("description is required")
      return
    }
    try {
      const data = new FormData()
      setLoader(true)
      setShowProgress(true)
      setUploadProgress(0)

      data.append("course_id", formData.course_id)
      data.append("chapter_id", formData.chapter_id)
      data.append("instructor_id", instructorId)
      data.append("title", formData.title)
      data.append("source", formData.source)
      data.append("file_type", formData.file_type)
      data.append("duration", formData.duration)
      data.append("is_free", formData.is_free)
      data.append("description", formData.description)

      if (formData.source === "upload") {
        data.append("file", formData.upload_path)
      } else {
        data.append("video_link", formData.link_path)
      }

      const res = await axios.post(`${baseUrl}/api/v1/admin/chapter-lesson/lesson-store`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(percentCompleted)
        },
      })

      console.log("Lesson created successfully:", res.data)
      toastify.success("Lesson created successfully")
      onClose()
    } catch (err) {
      console.error("Error creating lesson:", err.response?.data || err.message)
      alert("Error creating lesson")
    } finally {
      setLoader(false)
      setShowProgress(false)
      setUploadProgress(0)
    }
  }

  return (
    <>
      <style >{`
        .upload-progress-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          backdrop-filter: blur(8px);
        }

        .upload-progress-container {
          background: #008080;
          padding: 2.5rem;
          border-radius: 20px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
          text-align: center;
          min-width: 450px;
          color: white;
          animation: slideInScale 0.4s ease-out;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        @keyframes slideInScale {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .upload-progress-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .upload-progress-bar-container {
          position: relative;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 30px;
          height: 16px;
          overflow: hidden;
          margin: 2rem 0;
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .upload-progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #00f5ff 0%, #00d4ff 50%, #0099ff 100%);
          border-radius: 30px;
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0, 245, 255, 0.5);
        }

        .upload-progress-bar-fill::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
          animation: progressShimmer 2.5s infinite;
        }

        @keyframes progressShimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }

        .upload-progress-percentage {
          font-size: 2rem;
          font-weight: 800;
          margin: 1rem 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .upload-progress-status {
          font-size: 1rem;
          opacity: 0.9;
          margin-top: 1rem;
          font-weight: 500;
        }

        .upload-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: uploadSpin 1s linear infinite;
        }

        @keyframes uploadSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .upload-file-icon {
          font-size: 1.2rem;
          opacity: 0.8;
        }

        .upload-progress-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 0.9rem;
          opacity: 0.8;
        }
      `}</style>

      <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-modal="true" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Add Lesson</h1>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="p-3">
              <form className="add_lesson_form instructor__profile-form" onSubmit={handleSubmit}>
                <input type="hidden" name="course_id" value={formData.course_id} />
                <input type="hidden" name="chapter_id" value={formData.chapter_id} />
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

                  {formData.source === "upload" && (
                    <div className="col-md-9 upload">
                      <div className="from-group mb-3 custom-frm-bx">
                        <label className="form-file-manager-label">
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
                  )}

                  {formData.source !== "upload" && (
                    <div className="col-md-9 link_path">
                      <div className="custom-frm-bx">
                        <label htmlFor="link_path">
                          Path <code>*</code>
                        </label>
                        <div className="input-group mb-3">
                          <span className="input-group-text" id="basic-addon1">
                            <i className="fa fa-link"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            id="link_path"
                            name="link_path"
                            placeholder="paste source url"
                            value={formData.link_path}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  )}

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

      {showProgress && (
        <div className="upload-progress-overlay">
          <div className="upload-progress-container">
            <div className="upload-progress-title">
              <div className="upload-spinner"></div>
              <span className="upload-file-icon">📹</span>
              {formData.source === "upload" ? "Uploading Video..." : "Creating Lesson..."}
            </div>

            <div className="upload-progress-bar-container">
              <div className="upload-progress-bar-fill" style={{ width: `${uploadProgress}%` }}></div>
            </div>

            <div className="upload-progress-percentage">{uploadProgress}%</div>

            <div className="upload-progress-status">
              {uploadProgress < 25
                ? "Preparing upload..."
                : uploadProgress < 50
                  ? "Uploading video file..."
                  : uploadProgress < 75
                    ? "Processing video..."
                    : uploadProgress < 95
                      ? "Finalizing lesson..."
                      : "Almost done..."}
            </div>

            <div className="upload-progress-details">
              <span>📁 {formData.title || "New Lesson"}</span>
              <span>⏱️ {formData.duration} min</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AddLessonModal
