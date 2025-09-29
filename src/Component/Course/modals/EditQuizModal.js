"use client";

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { baseUrl } from "../../../config/baseUrl";
import loaderContext from "../../../context/LoaderContext";
import toastify from "../../../config/toastify";

const AddQuizModal = ({
  isOpen,
  onClose,
  chapters,
  chapterItem,
  chapterId,
  type,
}) => {
  const [formData, setFormData] = useState({
    course_id: "",
    chapter_id: chapterId || "",
    type: type || "quiz",
    chapter: chapterId || "",
    title: "",
    time_limit: "",
    attempts: "",
    total_mark: "",
    pass_mark: "",
  });
  let { setLoader } = useContext(loaderContext);
  //   useEffect(() => {
  //     setFormData({
  //       ...formData,
  //       chapter_id: chapterId || "",
  //       chapter: chapterId || "",

  //     });
  //   }, [chapterId, type]);

  useEffect(() => {
    const fetchChapterItem = async () => {
      if (!chapterItem?.chapterItemId) return;

      try {
        const res = await axios.get(
          `${baseUrl}/api/v1/admin/quiz/quiz-view/${chapterItem?.chapterItemId}`
        );
        const item = res.data.data;
        console.log(item);
        //   const [formData, setFormData] = useState({
        //     course_id: "",
        //     chapter_id: chapterId || "",
        //     type: type || "quiz",
        //     chapter: chapterId || "",
        //     title: "",
        //     time_limit: "",
        //     attempts: "",
        //     total_mark: "",
        //     pass_mark: "",
        //   });
        setFormData({
          ...item,
          attempts: item.attempt,
          time_limit: item.time,
          chapter: item.chapter_id,
        });
      } catch (err) {
        console.error("Error fetching   item:", err);
      }
    };

    fetchChapterItem();
  }, [chapterItem?.chapterItemId]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //   const handleSubmit = (e) => {
  //     e.preventDefault();
  //     // In a real app, you would submit the form data to your backend
  //     console.log("Form submitted:", formData);
  //     onClose();
  //   };
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoader(true);

    const payload = {
      chapter_id: formData.chapter,
      title: formData.title.trim(),
      time: formData.time_limit ? Number(formData.time_limit) : 0,
      attempt: formData.attempts ? Number(formData.attempts) : 0,
      total_mark: Number(formData.total_mark),
      pass_mark: Number(formData.pass_mark),
    };

    try {
      const response = await fetch(
        `${baseUrl}/api/v1/admin/quiz/quiz-edit/${chapterItem?.chapterItemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (result.status) {
        toastify.success("Quiz update.!");
        onClose();
      } else {
        alert(result.message || "Failed to create quiz");
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Something went wrong");
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
            <h1 className="modal-title fs-5">Add Quiz</h1>
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
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="custom-frm-bx">
                    <label htmlFor="time_limit">
                      Time Limit <code>(In minutes)</code>
                    </label>
                    <input
                      id="time_limit"
                      name="time_limit"
                      className="form-control"
                      type="text"
                      value={formData.time_limit}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="custom-frm-bx">
                    <label htmlFor="attempts">
                      Attempts <code>()</code>
                    </label>
                    <input
                      id="attempts"
                      name="attempts"
                      className="form-control"
                      type="text"
                      value={formData.attempts}
                      onChange={handleChange}
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
                    />
                  </div>
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

export default AddQuizModal;
