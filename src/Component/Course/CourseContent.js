import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import CourseNavigation from "./CourseNavigation";
import SortChaptersModal from "./modals/SortChaptersModal";
import AddLessonModal from "./modals/AddLessonModal";
import AddDocumentModal from "./modals/AddDocumentModal";
import AddLiveLessonModal from "./modals/AddLiveLessonModal";
import AddQuizModal from "./modals/AddQuizModal";
import EditChapterModal from "./modals/EditChapterModal";
import EditLessonModal from "./modals/EditLessonModal";
import EditLiveLessonModal from "./modals/EditLiveLessonModal";
import EditDocumentModal from "./modals/EditDocumentModal";
import EditQuizModal from "./modals/EditQuizModal";
import AddQuizQuestionModal from "./modals/AddQuizQuestionModal";
import EditQuizQuestionModal from "./modals/EditQuizQuestionModal";
import AddChapterModal from "./modals/AddChapterModal";
import {
  FolderIcon,
  PencilIcon,
  TrashIcon,
  VideoIcon,
  FileIcon,
  ArrowUpDownIcon as ArrowsUpDownIcon,
  PlusIcon,
  VideoIcon as VideoCamera,
  HelpCircle,
} from "lucide-react";
import { baseUrl } from "../../config/baseUrl";
import toastify from "../../config/toastify";
import Swal from "sweetalert2";

const CourseContent = () => {
  const { id: courseId } = useParams();
  // const baseUrl = "https://lms-inno-backend.innoview.tech"
  const [chapters, setChapters] = useState([]);
  const [loader, setLoader] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState({});

  useEffect(() => {
    fetchLiveData();
  }, [courseId]);

  const openModal = (modalName, data = {}) => {
    setActiveModal(modalName);
    setModalData(data);
  };

  function closeModal() {
    setActiveModal(null);
    setModalData({});
    // Always fetch fresh data when a modal is closed
    fetchLiveData();
  }

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const toggleChapter = (chapterId) => {
    setChapters((prevChapters) =>
      prevChapters.map((chapter) =>
        chapter._id === chapterId
          ? { ...chapter, isOpen: !chapter.isOpen }
          : chapter
      )
    );
  };

  const toggleQuiz = (chapterId, quizId) => {
    setChapters((prevChapters) =>
      prevChapters.map((chapter) => {
        if (chapter._id === chapterId) {
          return {
            ...chapter,
            quizDetails: chapter.quizDetails.map((quiz) =>
              quiz._id === quizId ? { ...quiz, isOpen: !quiz.isOpen } : quiz
            ),
          };
        }
        return chapter;
      })
    );
  };

  const truncate = (str, n = 30) => {
    return str?.length > n ? str.slice(0, n - 1) + "..." : str;
  };

  // const handleDelete = async (id) => {
  //   try {
  //     const response = await axios.delete(`${baseUrl}/api/v1/admin/course-chapter/delete-chapter-item/${id}`, {
  //       headers: {
  //         Authorization: localStorage.getItem("token"),
  //       },
  //     })
  //     if (response.data.status) {
  //       fetchLiveData()
  //     }
  //   } catch (error) {
  //     console.error("Error deleting chapter item:", error)
  //   }
  // }

  const handleDelete = (id, type) => {
    // Display a toast message indicating that work is in progress
    // toastify.success("Work is going on");

    // Function for making API call
    let apiCall = async () => {
      let url = `${baseUrl}/api/v1/admin/`;

      // Determine the correct URL based on the type of entity to be deleted
      switch (type) {
        case "chapter":
          url += `course-chapter/course-chapters/${id}`;
          break;
        case "lesson":
          url += `chapter-lesson/lessons-delete/${id}`;
          break;
        case "liveLesson":
          url += `live-lesson/live-lession-delete/${id}`;
          break;
        case "document":
          url += `chapter-doc/documnet-delete/${id}`;
          break;
        case "quiz":
          url += `quiz/quiz-delete/${id}`;
          break;
        case "quizQuestion":
          url += `quiz-question/quiz-question-delete/${id}`;
          break;
        default:
          toastify.error("Invalid type!");
          return;
      }

      // Making the DELETE request
      try {
        const res = await fetch(url, {
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        const result = await res.json();

        if (result.status) {
          toastify.success(`${type} deleted successfully!`);
          fetchLiveData(); // Re-fetch data after deletion
        } else {
          toastify.error(result.message || "Error deleting the item");
        }
      } catch (err) {
        console.error("Error deleting item:", err);
        toastify.error("Something went wrong during deletion");
      }
    };

    // Show confirmation popup using SweetAlert
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        apiCall(); // Call the API to delete the item
        Swal.fire({
          title: "Deleted!",
          text: "Your item has been deleted.",
          icon: "success",
        });
      }
    });
  };
  const fetchLiveData = async () => {
    try {
      setLoader(true);
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/course-chapter/course-chapter-list/${courseId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.data.status) {
        // Add isOpen property to each chapter for accordion functionality
        const chaptersWithOpen = response.data.data.map((chapter) => ({
          ...chapter,
          isOpen: false, // Default closed
          // Add isOpen property to each quiz for nested accordion
          quizDetails:
            chapter.quizDetails?.map((quiz) => ({
              ...quiz,
              isOpen: false, // Default closed
            })) || [],
        }));

        // Set first chapter as open by default if chapters exist
        if (chaptersWithOpen.length > 0) {
          chaptersWithOpen[0].isOpen = true;
        }

        setChapters(chaptersWithOpen);
      } else {
        console.error("Failed to fetch chapters:", response.data.message);
      }
      setLoader(false);
    } catch (error) {
      console.error("Error fetching chapters:", error);
      setLoader(false);
    }
  };

  // Get file icon based on file type
  const getFileIcon = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case "pdf":
        return <FileIcon size={16} />;
      case "doc":
      case "docx":
        return <FileIcon size={16} />;
      case "xls":
      case "xlsx":
        return <FileIcon size={16} />;
      default:
        return <FileIcon size={16} />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="main-sec">
      <CourseNavigation />
      <form className="instructor__profile-form course-form">
        <input type="hidden" name="step" value="3" />
        <input type="hidden" name="next_step" value="4" />
      </form>

      <div className="instructor__profile-form-wrap">
        <form>
          <div className="mb-3 d-flex flex-wrap justify-content-between">
            <button
              type="button"
              className="thm-btn"
              onClick={() => openModal("addChapter")}
            >
              Add new chapter
            </button>

            <button type="button" className="thm-btn" onClick={fetchLiveData}>
              Refresh chapters
            </button>

            <button
              type="button"
              className="thm-btn info"
              onClick={() => openModal("sortChapters")}
            >
              Sort chapter
            </button>
          </div>

          {loader ? (
            <div className="text-center p-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div
              className="accordion draggable-list"
              id="accordionPanelsStayOpenExample"
            >
              {chapters?.length > 0 ? (
                chapters.map((chapter, i) => (
                  <div
                    key={chapter._id}
                    className="accordion-item course-section add_course_section_area"
                  >
                    <h2
                      className="accordion-header"
                      id={`panelsStayOpen-heading${chapter._id}`}
                    >
                      <div className="accordion_header_content d-flex flex-wrap">
                        <button
                          className={`accordion-button course-section-btn ${
                            chapter.isOpen ? "" : "collapsed"
                          }`}
                          type="button"
                          onClick={() => toggleChapter(chapter._id)}
                        >
                          <div className="icon_area d-flex flex-wrap justify-content-between align-items-center w-100">
                            <div className="d-flex flex-wrap align-items-center">
                              <span className="icon-container">
                                <FolderIcon size={16} />
                              </span>
                              <h3 className="mb-0 ms-2 text-dark fs-5">
                                {chapter.title}
                              </h3>
                            </div>
                          </div>
                        </button>

                        <div className="item-action item_action_header d-flex flex-wrap">
                          <div className="dropdown action-item">
                            <span
                              className="dropdown-toggle btn btn-small small-more-btn"
                              onClick={() =>
                                toggleDropdown(`chapter-${chapter._id}`)
                              }
                            >
                              <PlusIcon size={16} />
                            </span>
                            {dropdownOpen[`chapter-${chapter._id}`] && (
                              <ul className="dropdown-menu dropdown-menu-end show">
                                <li>
                                  <Link
                                    className="dropdown-item add-lesson-btn"
                                    onClick={() =>
                                      openModal("addLesson", {
                                        chapterId: chapter._id,
                                        type: "lesson",
                                      })
                                    }
                                    href=""
                                  >
                                    Add Lesson
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    className="dropdown-item add-lesson-btn"
                                    onClick={() =>
                                      openModal("addDocument", {
                                        chapterId: chapter._id,
                                        type: "document",
                                      })
                                    }
                                    href=""
                                  >
                                    Add Document
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    className="dropdown-item add-lesson-btn"
                                    onClick={() =>
                                      openModal("addLiveLesson", {
                                        chapterId: chapter._id,
                                        type: "live",
                                      })
                                    }
                                    href=""
                                  >
                                    Add Live lesson
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    className="dropdown-item add-lesson-btn"
                                    onClick={() =>
                                      openModal("addQuiz", {
                                        chapterId: chapter._id,
                                        type: "quiz",
                                      })
                                    }
                                    href=""
                                  >
                                    Add Quiz
                                  </Link>
                                </li>
                              </ul>
                            )}
                          </div>
                          <Link
                            href=""
                            className="text-dark action-item edit-chapter-btn"
                            onClick={() =>
                              openModal("editChapter", {
                                chapterId: chapter._id,
                              })
                            }
                          >
                            <PencilIcon size={16} />
                          </Link>
                          <Link
                            onClick={() => handleDelete(chapter._id, "chapter")}
                            className="text-danger action-item delete-item"
                          >
                            <TrashIcon size={16} />
                          </Link>
                        </div>
                      </div>
                    </h2>
                    <div
                      id={`panelsStayOpen-collapse${chapter._id}`}
                      className={`accordion-collapse collapse ${
                        chapter.isOpen ? "show" : ""
                      }`}
                      aria-labelledby={`panelsStayOpen-heading${chapter._id}`}
                    >
                      <div className="accordion-body">
                        {/* Lessons */}
                        {chapter.lessonDetails &&
                          chapter.lessonDetails.length > 0 &&
                          chapter.lessonDetails.map((lesson) => (
                            <div
                              key={lesson._id}
                              className="card course-section-item create_couese_item mb-3"
                              data-chapter-item-id={lesson._id}
                              data-chapterid={chapter._id}
                            >
                              <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className="edit_course_icons d-flex flex-wrap align-items-center">
                                  <span className="icon-container">
                                    <VideoIcon size={16} />
                                  </span>
                                  <p className="mb-0 ms-2 bold-text">
                                    {truncate(lesson.title)}
                                    {lesson.duration && (
                                      <span className="ms-1 text-muted">
                                        ({lesson.duration}s)
                                      </span>
                                    )}
                                  </p>
                                </div>
                                <div className="item-action">
                                  <Link
                                    href=""
                                    className="ms-2 text-dark edit-lesson-btn"
                                    onClick={() =>
                                      openModal("editLesson", {
                                        type: "lesson",
                                        courseId: chapter.course_id,
                                        chapterId: chapter._id,
                                        chapterItemId: lesson._id,
                                      })
                                    }
                                  >
                                    <PencilIcon size={16} />
                                  </Link>
                                  <Link
                                    onClick={() =>
                                      handleDelete(lesson._id, "lesson")
                                    }
                                    className="ms-2 text-danger delete-item"
                                  >
                                    <TrashIcon size={16} />
                                  </Link>
                                  <Link href="" className="ms-2 dragger">
                                    <ArrowsUpDownIcon size={16} />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}

                        {/* Documents */}
                        {chapter.documentDetails &&
                          chapter.documentDetails.length > 0 &&
                          chapter.documentDetails.map((doc) => (
                            <div
                              key={doc._id}
                              className="card course-section-item create_couese_item mb-3"
                              data-chapter-item-id={doc._id}
                              data-chapterid={chapter._id}
                            >
                              <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className="edit_course_icons d-flex flex-wrap align-items-center">
                                  <span className="icon-container">
                                    {getFileIcon(doc.file_type)}
                                  </span>
                                  <p className="mb-0 ms-2 bold-text">
                                    {truncate(doc.title)} ({doc.file_type})
                                  </p>
                                </div>
                                <div className="item-action">
                                  <Link
                                    href=""
                                    className="ms-2 text-dark edit-lesson-btn"
                                    onClick={() =>
                                      openModal("editDocument", {
                                        type: "document",
                                        courseId: chapter.course_id,
                                        chapterId: chapter._id,
                                        chapterItemId: doc._id,
                                      })
                                    }
                                  >
                                    <PencilIcon size={16} />
                                  </Link>
                                  <Link
                                    // onClick={() => handleDelete(doc._id)}
                                    onClick={() =>
                                      handleDelete(doc._id, "document")
                                    }
                                    className="ms-2 text-danger delete-item"
                                  >
                                    <TrashIcon size={16} />
                                  </Link>
                                  <Link href="" className="ms-2 dragger">
                                    <ArrowsUpDownIcon size={16} />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}

                        {/* Live Lessons */}
                        {chapter.liveLessonDetails &&
                          chapter.liveLessonDetails.length > 0 &&
                          chapter.liveLessonDetails.map((liveLesson) => (
                            <div
                              key={liveLesson._id}
                              className="card course-section-item create_couese_item mb-3"
                              data-chapter-item-id={liveLesson._id}
                              data-chapterid={chapter._id}
                            >
                              <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className="edit_course_icons d-flex flex-wrap align-items-center">
                                  <span className="icon-container">
                                    <VideoCamera size={16} />
                                  </span>
                                  <p className="mb-0 ms-2 bold-text">
                                    <span className="badge bg-primary me-2">
                                      LIVE
                                    </span>
                                    {truncate(liveLesson.title)} -{" "}
                                    {formatDate(liveLesson.start_time)}
                                    {liveLesson.duration && (
                                      <span className="ms-1 text-muted">
                                        ({liveLesson.duration}m)
                                      </span>
                                    )}
                                  </p>
                                </div>
                                <div className="item-action">
                                  <Link
                                    href=""
                                    className="ms-2 text-dark edit-lesson-btn"
                                    onClick={() =>
                                      openModal("editLiveLesson", {
                                        type: "live",
                                        courseId: chapter.course_id,
                                        chapterId: chapter._id,
                                        chapterItemId: liveLesson._id,
                                      })
                                    }
                                  >
                                    <PencilIcon size={16} />
                                  </Link>
                                  <Link
                                    onClick={() =>
                                      handleDelete(liveLesson._id, "liveLesson")
                                    }
                                    className="ms-2 text-danger delete-item"
                                  >
                                    <TrashIcon size={16} />
                                  </Link>
                                  <Link href="" className="ms-2 dragger">
                                    <ArrowsUpDownIcon size={16} />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}

                        {/* Quizzes */}
                        {chapter.quizDetails &&
                          chapter.quizDetails.length > 0 &&
                          chapter.quizDetails.map((quiz) => (
                            <div
                              key={quiz._id}
                              className="accordion card mb-2"
                              id={`accordionQuiz${quiz._id}`}
                              data-chapter-item-id={quiz._id}
                              data-chapterid={chapter._id}
                            >
                              <div className="accordion-item">
                                <h2 className="accordion-header">
                                  <div className="d-flex flex-wrap justify-content-between">
                                    <button
                                      className={`accordion-button course-quiz-btn ${
                                        quiz.isOpen ? "" : "collapsed"
                                      }`}
                                      type="button"
                                      onClick={() =>
                                        toggleQuiz(chapter._id, quiz._id)
                                      }
                                    >
                                      <div className="d-flex flex-wrap justify-content-between align-items-center">
                                        <div className="d-flex flex-wrap align-items-center">
                                          <span className="icon-container">
                                            <HelpCircle size={16} />
                                          </span>
                                          <p className="mb-0 ms-2 bold-text">
                                            {quiz.title} - {quiz.time} min |
                                            Pass mark: {quiz.pass_mark}/
                                            {quiz.total_mark}
                                          </p>
                                        </div>
                                      </div>
                                    </button>
                                    <div className="item-action d-flex flex-wrap">
                                      <div className="dropdown action-item">
                                        <span
                                          className="dropdown-toggle btn btn-small small-more-btn"
                                          onClick={() =>
                                            toggleDropdown(`quiz-${quiz._id}`)
                                          }
                                        >
                                          <PlusIcon size={16} />
                                        </span>
                                        {dropdownOpen[`quiz-${quiz._id}`] && (
                                          <ul className="dropdown-menu dropdown-menu-end show">
                                            <li>
                                              <Link
                                                className="dropdown-item add-quiz-question-btn"
                                                onClick={() =>
                                                  openModal("addQuizQuestion", {
                                                    quizId: quiz._id,
                                                  })
                                                }
                                                href=""
                                              >
                                                Add Question
                                              </Link>
                                            </li>
                                          </ul>
                                        )}
                                      </div>
                                      <Link
                                        href=""
                                        onClick={() =>
                                          openModal("editQuiz", {
                                            type: "quiz",
                                            courseId: chapter.course_id,
                                            chapterId: chapter._id,
                                            chapterItemId: quiz._id,
                                          })
                                        }
                                        className="text-dark action-item edit-lesson-btn"
                                      >
                                        <PencilIcon size={16} />
                                      </Link>
                                      <Link
                                        // onClick={() => handleDelete(quiz._id)}

                                        onClick={() =>
                                          handleDelete(quiz._id, "quiz")
                                        }
                                        className="text-danger action-item delete-item"
                                      >
                                        <TrashIcon size={16} />
                                      </Link>
                                      <Link href="" className="ms-2 dragger">
                                        <ArrowsUpDownIcon size={16} />
                                      </Link>
                                    </div>
                                  </div>
                                </h2>
                                <div
                                  id={`panelsStayOpen-collapse${quiz._id}`}
                                  className={`accordion-collapse collapse ${
                                    quiz.isOpen ? "show" : ""
                                  }`}
                                  data-bs-parent={`#accordionQuiz${quiz._id}`}
                                >
                                  <div className="accordion-body">
                                    {quiz.questions &&
                                    quiz.questions.length > 0 ? (
                                      quiz.questions.map((question, qIndex) => (
                                        <div
                                          key={question._id}
                                          className="card course-section-item mb-3"
                                          data-chapter-item-id={question._id}
                                          data-quizid={quiz._id}
                                        >
                                          <div className="d-flex flex-wrap justify-content-between align-items-center">
                                            <div className="edit_course_icons d-flex flex-wrap align-items-center">
                                              <span className="icon-container">
                                                <HelpCircle size={16} />
                                              </span>
                                              <p className="mb-0 ms-2 bold-text">
                                                {question.question} (
                                                {question.points} points)
                                              </p>
                                            </div>
                                            <div className="item-action">
                                              <Link
                                                href=""
                                                className="ms-2 text-dark edit-question-btn"
                                                onClick={() =>
                                                  openModal(
                                                    "editQuizQuestion",
                                                    {
                                                      questionId: question._id,
                                                      quizId: quiz._id,
                                                      question: question,
                                                    }
                                                  )
                                                }
                                              >
                                                <PencilIcon size={16} />
                                              </Link>
                                              <Link
                                                href=""
                                                onClick={() =>
                                                  handleDelete(
                                                    question._id,
                                                    "quizQuestion"
                                                  )
                                                }
                                                className="ms-2 text-danger delete-item"
                                              >
                                                <TrashIcon size={16} />
                                              </Link>
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-center">
                                        No questions found.
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}

                        {/* Empty State */}
                        {(!chapter.lessonDetails ||
                          chapter.lessonDetails.length === 0) &&
                          (!chapter.documentDetails ||
                            chapter.documentDetails.length === 0) &&
                          (!chapter.liveLessonDetails ||
                            chapter.liveLessonDetails.length === 0) &&
                          (!chapter.quizDetails ||
                            chapter.quizDetails.length === 0) && (
                            <p className="text-center">No content found.</p>
                          )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center p-5">No chapters found.</p>
              )}
            </div>
          )}
        </form>
      </div>

      {/* Render modals based on activeModal state */}
      {activeModal === "addChapter" && (
        <AddChapterModal
          isOpen={true}
          onClose={closeModal}
          setLoader={setLoader}
        />
      )}

      {activeModal === "sortChapters" && (
        <SortChaptersModal
          isOpen={true}
          onClose={closeModal}
          chapters={chapters}
        />
      )}

      {activeModal === "addLesson" && (
        <AddLessonModal
          isOpen={true}
          onClose={closeModal}
          chapters={chapters}
          chapterId={modalData.chapterId}
          type={modalData.type}
        />
      )}

      {activeModal === "addDocument" && (
        <AddDocumentModal
          isOpen={true}
          onClose={closeModal}
          chapters={chapters}
          chapterId={modalData.chapterId}
          type={modalData.type}
          courseId={courseId}
        />
      )}

      {activeModal === "addLiveLesson" && (
        <AddLiveLessonModal
          isOpen={true}
          onClose={closeModal}
          chapters={chapters}
          chapterId={modalData.chapterId}
          type={modalData.type}
          courseId={courseId}
        />
      )}

      {activeModal === "addQuiz" && (
        <AddQuizModal
          isOpen={true}
          onClose={closeModal}
          chapters={chapters}
          chapterId={modalData.chapterId}
          type={modalData.type}
          courseId={courseId}
        />
      )}

      {activeModal === "editChapter" && (
        <EditChapterModal
          isOpen={true}
          onClose={closeModal}
          chapterId={modalData.chapterId}
          chapter={chapters.find((c) => c._id === modalData.chapterId)}
          setLoader={setLoader}
        />
      )}

      {activeModal === "editLesson" && (
        <EditLessonModal
          isOpen={true}
          onClose={closeModal}
          chapters={chapters}
          chapterItem={modalData}
        />
      )}

      {activeModal === "editLiveLesson" && (
        <EditLiveLessonModal
          isOpen={true}
          onClose={closeModal}
          chapters={chapters}
          chapterItem={modalData}
          courseId={modalData.courseId}
        />
      )}

      {activeModal === "editDocument" && (
        <EditDocumentModal
          isOpen={true}
          onClose={closeModal}
          chapters={chapters}
          chapterItem={modalData}
          courseId={modalData.courseId}
        />
      )}

      {activeModal === "editQuiz" && (
        <EditQuizModal
          isOpen={true}
          onClose={closeModal}
          chapters={chapters}
          chapterItem={modalData}
        />
      )}

      {activeModal === "addQuizQuestion" && (
        <AddQuizQuestionModal
          isOpen={true}
          onClose={closeModal}
          quizId={modalData.quizId}
        />
      )}

      {activeModal === "editQuizQuestion" && (
        <EditQuizQuestionModal
          isOpen={true}
          onClose={closeModal}
          questionId={modalData.questionId}
          quizId={modalData.quizId}
          question={modalData.question}
        />
      )}
    </div>
  );
};

export default CourseContent;
