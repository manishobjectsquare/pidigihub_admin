// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import toastify from "../../../config/toastify";
// import { baseUrl } from "../../../config/baseUrl";

// const EditLiveLessonModal = ({
//   isOpen,
//   onClose,
//   chapterItem,
//   chapters,
//   courseId,
// }) => {
//   const [formData, setFormData] = useState({
//     course_id: courseId || "",
//     chapter_item_id: chapterItem?.chapterItemId || "",
//     type: chapterItem?.type || "live",
//     chapter: chapterItem?.chapter_id || "",
//     title: chapterItem?.lesson?.title || "",
//     live_type: chapterItem?.lesson?.live?.type || "zoom",
//     start_time: chapterItem?.lesson?.live?.start_time || "",
//     duration: chapterItem?.lesson?.duration || "",
//     meeting_id: chapterItem?.lesson?.live?.meeting_id || "",
//     password: chapterItem?.lesson?.live?.password || "",
//     join_url: chapterItem?.lesson?.live?.join_url || "",
//     source: chapterItem?.lesson?.storage || "",
//     description: chapterItem?.lesson?.description || "",
//     student_mail_sent: false,
//     upload_path:
//       chapterItem?.lesson?.storage === "upload"
//         ? chapterItem?.lesson?.file_path
//         : "",
//     link_path:
//       chapterItem?.lesson?.storage !== "upload"
//         ? chapterItem?.lesson?.file_path
//         : "",
//   });
//   console.log(chapters);

//   useEffect(() => {
//     const fetchLessonData = async () => {
//       if (!chapterItem?.chapterItemId) return;

//       try {
//         const res = await axios.get(
//           `${baseUrl}/api/v1/admin/live-lesson/live-lession-view/${chapterItem?.chapterItemId}`
//         );
//         const lesson = res.data.data;
//         setFormData({
//           ...lesson,
//           chapter: lesson?.chapter_id,
//           student_mail_sent: lesson.email_to_all_students,
//           start_time: lesson.start_time
//             ? new Date(lesson.start_time).toISOString().slice(0, 16)
//             : "",
//         });
//       } catch (err) {
//         console.error("Error fetching live lesson:", err);
//       }
//     };

//     if (isOpen && chapterItem?.chapterItemId) {
//       fetchLessonData();
//     }
//   }, [isOpen, chapterItem?.chapterItemId]);

//   if (!isOpen) return null;

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const data = {
//       course_id: formData.course_id,
//       chapter_id: formData.chapter,
//       title: formData.title,
//       live_platform_type: formData.live_type,
//       start_time: formData.start_time,
//       duration: formData.duration,
//       meeting_id: formData.meeting_id,
//       password: formData.password,
//       join_url: formData.join_url,
//       description: formData.description,
//       email_to_all_students: formData.student_mail_sent,
//       is_free: formData.is_free,
//       status: "active", // Keeping status as active, modify as per your requirement
//     };

//     try {
//       const res = await axios.put(
//         `${baseUrl}/api/v1/admin/live-lesson/live-lession-edit/${chapterItem?.chapterItemId}`,
//         data
//       );

//       if (res.data.status) {
//         toastify.success("Live lesson updated successfully!");
//         onClose();
//       } else {
//         toastify.error(res.data.message || "Failed to update live lesson");
//       }
//     } catch (err) {
//       console.error("Error updating live lesson:", err);
//       toastify.error("An error occurred while updating the live lesson");
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
//             <h1 className="modal-title fs-5">Edit Live Lesson</h1>
//             <button
//               type="button"
//               className="btn-close"
//               onClick={onClose}
//             ></button>
//           </div>

//           <div className="p-3">
//             <form
//               onSubmit={handleSubmit}
//               className="update_lesson_form instructor__profile-form"
//             >
//               <input
//                 type="hidden"
//                 name="course_id"
//                 value={formData.course_id}
//               />
//               <input
//                 type="hidden"
//                 name="chapter_item_id"
//                 value={formData.chapter_item_id}
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
//                     {chapters?.map((chapter) => (
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

//               {/* Additional form fields and logic for live lesson */}
//               <div className="row">
//                 <div className="col-md-3">
//                   <div className="custom-frm-bx">
//                     <label htmlFor="live_type">
//                       Live Platform <code>*</code>
//                     </label>
//                     <select
//                       name="live_type"
//                       id="live_type"
//                       className="form-select"
//                       value={formData.live_type}
//                       onChange={handleChange}
//                     >
//                       <option value="zoom">Zoom</option>
//                       <option value="jitsi">Jitsi</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="col-md-6">
//                   <div className="custom-frm-bx">
//                     <label htmlFor="start_time">
//                       Start Time <code>*</code>
//                     </label>
//                     <input
//                       id="start_time"
//                       name="start_time"
//                       className="form-control"
//                       type="datetime-local"
//                       value={formData.start_time}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>

//                 <div className="col-md-3">
//                   <div className="custom-frm-bx">
//                     <label htmlFor="duration">
//                       Duration <code>* (in minutes)</code>
//                     </label>
//                     <input
//                       id="duration"
//                       name="duration"
//                       type="text"
//                       className="form-control"
//                       value={formData.duration}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Meeting ID, Password, Join URL */}
//               <div className="row">
//                 <div className="col-md-6">
//                   <div className="custom-frm-bx">
//                     <label htmlFor="meeting_id">
//                       Meeting ID <code>*</code>
//                     </label>
//                     <input
//                       id="meeting_id"
//                       name="meeting_id"
//                       className="form-control"
//                       type="text"
//                       value={formData.meeting_id}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>

//                 <div className="col-md-6">
//                   <div className="custom-frm-bx">
//                     <label htmlFor="password">Password</label>
//                     <input
//                       id="password"
//                       name="password"
//                       className="form-control"
//                       type="text"
//                       value={formData.password}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>

//                 <div className="col-md-12">
//                   <div className="custom-frm-bx">
//                     <label htmlFor="join_url">Join URL</label>
//                     <input
//                       id="join_url"
//                       name="join_url"
//                       className="form-control"
//                       type="url"
//                       value={formData.join_url}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Description */}
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

//               {/* Email to all students */}
//               <div className="col-md-12 mb-3">
//                 <div className="account__check-remember custom-frm-bx">
//                   <input
//                     id="student_mail_sent"
//                     type="checkbox"
//                     className="form-check-input form-control"
//                     name="student_mail_sent"
//                     checked={formData.student_mail_sent}
//                     onChange={handleChange}
//                   />
//                   <label
//                     htmlFor="student_mail_sent"
//                     className="form-check-label"
//                   >
//                     Email to all students.
//                   </label>
//                 </div>
//               </div>

//               <div className="modal-footer">
//                 <button type="submit" className="btn btn-primary submit-btn">
//                   Update
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditLiveLessonModal;


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
  const [progress, setProgress] = useState(0);

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

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    return interval;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const progressInterval = simulateProgress();

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

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        if (result.status) {
          alert("Live lesson created successfully!");
          onClose();
        } else {
          alert(result.message || "Failed to create live lesson");
        }
        setProgress(0);
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      console.error("Error:", error);
      alert("Something went wrong");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  return (
    <>
      <style jsx>{`
        .progress-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(5px);
        }
        .progress-container {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          text-align: center;
          min-width: 400px;
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .progress-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 1rem;
        }
        .progress-bar-container {
          position: relative;
          background: #f0f0f0;
          border-radius: 25px;
          height: 12px;
          overflow: hidden;
          margin: 1.5rem 0;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          border-radius: 25px;
          transition: width 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .progress-bar-fill::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          animation: shimmer 2s infinite;
        }
        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
        .progress-percentage {
          font-size: 1.1rem;
          font-weight: 600;
          color: #667eea;
          margin-top: 0.5rem;
        }
        .progress-status {
          color: #666;
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }
        .spinner {
          width: 20px;
          height: 20px;
          // border: 2px solid #f3f3f3;
          border-top: 2px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          display: inline-block;
          margin-right: 10px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

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
                  className={`col-12 zoom-alert-box ${formData.live_type === "jitsi" ? "d-none" : ""
                    }`}
                >
                  <div className="alert alert-warning" role="alert">
                    The meeting ID, password, and Zoom settings must be configured
                    using the same Zoom account. The course creator needs to set
                    up the <a href="#">Zoom live setting</a>.
                  </div>
                </div>

                <div
                  className={`col-12 jitsi-alert-box ${formData.live_type === "zoom" ? "d-none" : ""
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
                    className={`col-md-${formData.live_type === "jitsi" ? "12" : "6"
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
                    className={`col-md-6 zoom-box ${formData.live_type === "jitsi" ? "d-none" : ""
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
                    className={`col-md-12 zoom-box ${formData.live_type === "jitsi" ? "d-none" : ""
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

      {loading && (
        <div className="progress-overlay">
          <div className="progress-container">
            <div className="progress-title">
              <div className="spinner"></div>
              Creating Live Lesson...
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-percentage">{Math.round(progress)}%</div>
            <div className="progress-status">
              {progress < 30
                ? "Validating data..."
                : progress < 60
                  ? "Processing request..."
                  : progress < 90
                    ? "Saving lesson..."
                    : "Finalizing..."}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddLiveLessonModal;