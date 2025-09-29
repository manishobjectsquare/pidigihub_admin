// import React, { useState } from "react";

// // Import FontAwesome CSS
// // Note: In a real project, you would need to install FontAwesome via npm
// // and import it properly, but for this example we'll assume it's available

// const CourseContent = () => {
//     // Sample data for demonstration
//     const [chapters, setChapters] = useState([
//         {
//             id: 1,
//             title: "Introduction to the Course",
//             isOpen: true,
//             chapterItems: [
//                 {
//                     id: 101,
//                     type: "lesson",
//                     lesson: { title: "Welcome to the Course" },
//                 },
//                 {
//                     id: 102,
//                     type: "document",
//                     lesson: { title: "Course Syllabus" },
//                 },
//                 {
//                     id: 103,
//                     type: "quiz",
//                     isOpen: false,
//                     quiz: {
//                         id: 201,
//                         title: "Introduction Quiz",
//                         questions: [
//                             { id: 301, title: "What is this course about?" },
//                             { id: 302, title: "What will you learn in this course?" },
//                         ],
//                     },
//                 },
//             ],
//         },
//         {
//             id: 2,
//             title: "Getting Started",
//             isOpen: false,
//             chapterItems: [
//                 {
//                     id: 104,
//                     type: "lesson",
//                     lesson: { title: "Setting Up Your Environment" },
//                 },
//                 {
//                     id: 105,
//                     type: "live",
//                     lesson: { title: "Live Q&A Session" },
//                 },
//             ],
//         },
//     ]);

//     // State for modals
//     const [activeModal, setActiveModal] = useState(null);
//     const [dropdownOpen, setDropdownOpen] = useState({});
//     const [modalData, setModalData] = useState({
//         chapterId: null,
//         courseId: null,
//         chapterItemId: null,
//         type: null,
//         quizId: null,
//     });

//     // Function to open a modal
//     const openModal = (modalName, data = {}) => {
//         setActiveModal(modalName);
//         setModalData({ ...modalData, ...data });
//     };

//     // Function to close a modal
//     const closeModal = () => {
//         setActiveModal(null);
//     };

//     const toggleChapter = (chapterId) => {
//         setChapters(
//             chapters.map((chapter) =>
//                 chapter.id === chapterId ? { ...chapter, isOpen: !chapter.isOpen } : chapter
//             )
//         );
//     };

//     const toggleQuiz = (chapterId, itemId) => {
//         setChapters(
//             chapters.map((chapter) =>
//                 chapter.id === chapterId
//                     ? {
//                         ...chapter,
//                         chapterItems: chapter.chapterItems.map((item) =>
//                             item.id === itemId ? { ...item, isOpen: !item.isOpen } : item
//                         ),
//                     }
//                     : chapter
//             )
//         );
//     };

//     const toggleDropdown = (id) => {
//         setDropdownOpen({
//             ...dropdownOpen,
//             [id]: !dropdownOpen[id],
//         });
//     };

//     const truncate = (text) => {
//         return text && text.length > 40 ? text.substring(0, 40) + "..." : text;
//     };

//     // Function to handle form submission (placeholder)
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // In a real app, you would handle form submission here
//         closeModal();
//     };

//     return (
//         <div className="col-lg-9">
//             <form className="instructor__profile-form course-form">
//                 <input type="hidden" name="step" value="3" />
//                 <input type="hidden" name="next_step" value="4" />
//             </form>

//             <div className="instructor__profile-form-wrap">
//                 <form>
//                     <div className="mb-3 d-flex flex-wrap justify-content-between">
//                         <button
//                             type="button"
//                             className="thm-btn"
//                             onClick={() => openModal("addChapter")}
//                         >
//                             Add new chapter
//                         </button>

//                         <button
//                             type="button"
//                             className="thm-btn info"
//                             onClick={() => openModal("sortChapters")}
//                         >
//                             Sort chapter
//                         </button>
//                     </div>
//                     <div className="accordion draggable-list" id="accordionPanelsStayOpenExample">
//                         {chapters.length > 0 ? (
//                             chapters.map((chapter) => (
//                                 <div
//                                     key={chapter.id}
//                                     className="accordion-item course-section add_course_section_area"
//                                 >
//                                     <h2 className="accordion-header" id={`panelsStayOpen-heading${chapter.id}`}>
//                                         <div className="accordion_header_content d-flex flex-wrap">
//                                             <button
//                                                 className={`accordion-button course-section-btn ${chapter.isOpen ? "" : "collapsed"
//                                                     }`}
//                                                 type="button"
//                                                 onClick={() => toggleChapter(chapter.id)}
//                                             >
//                                                 <div className="icon_area d-flex flex-wrap justify-content-between align-items-center w-100">
//                                                     <div className="d-flex flex-wrap align-items-center">
//                                                         <span className="icon-container">
//                                                             <i className="far fa-folder"></i>
//                                                         </span>
//                                                         <p className="mb-0 ms-2 bold-text">{chapter.title}</p>
//                                                     </div>
//                                                 </div>
//                                             </button>

//                                             <div className="item-action item_action_header d-flex flex-wrap">
//                                                 <div className="dropdown action-item">
//                                                     <span
//                                                         className="dropdown-toggle btn btn-small small-more-btn"
//                                                         onClick={() => toggleDropdown(`chapter-${chapter.id}`)}
//                                                     >
//                                                         <i className="fas fa-plus"></i>
//                                                     </span>
//                                                     {dropdownOpen[`chapter-${chapter.id}`] && (
//                                                         <ul className="dropdown-menu dropdown-menu-end show">
//                                                             <li>
//                                                                 <a
//                                                                     className="dropdown-item add-lesson-btn"
//                                                                     onClick={() =>
//                                                                         openModal("addLesson", {
//                                                                             chapterId: chapter.id,
//                                                                             type: "lesson",
//                                                                         })
//                                                                     }
//                                                                     href="javascript:;"
//                                                                 >
//                                                                     Add Lesson
//                                                                 </a>
//                                                             </li>
//                                                             <li>
//                                                                 <a
//                                                                     className="dropdown-item add-lesson-btn"
//                                                                     onClick={() =>
//                                                                         openModal("addDocument", {
//                                                                             chapterId: chapter.id,
//                                                                             type: "document",
//                                                                         })
//                                                                     }
//                                                                     href="javascript:;"
//                                                                 >
//                                                                     Add Document
//                                                                 </a>
//                                                             </li>
//                                                             <li>
//                                                                 <a
//                                                                     className="dropdown-item add-lesson-btn"
//                                                                     onClick={() =>
//                                                                         openModal("addLiveLesson", {
//                                                                             chapterId: chapter.id,
//                                                                             type: "live",
//                                                                         })
//                                                                     }
//                                                                     href="javascript:;"
//                                                                 >
//                                                                     Add Live lesson
//                                                                 </a>
//                                                             </li>
//                                                             <li>
//                                                                 <a
//                                                                     className="dropdown-item add-lesson-btn"
//                                                                     onClick={() =>
//                                                                         openModal("addQuiz", {
//                                                                             chapterId: chapter.id,
//                                                                             type: "quiz",
//                                                                         })
//                                                                     }
//                                                                     href="javascript:;"
//                                                                 >
//                                                                     Add Quiz
//                                                                 </a>
//                                                             </li>
//                                                         </ul>
//                                                     )}
//                                                 </div>
//                                                 <a
//                                                     href="javascript:;"
//                                                     className="text-dark action-item edit-chapter-btn"
//                                                     onClick={() =>
//                                                         openModal("editChapter", { chapterId: chapter.id })
//                                                     }
//                                                 >
//                                                     <i className="fas fa-edit"></i>
//                                                 </a>
//                                                 <a
//                                                     href="javascript:;"
//                                                     className="text-danger action-item delete-item"
//                                                 >
//                                                     <i className="fas fa-trash-alt"></i>
//                                                 </a>
//                                             </div>
//                                         </div>
//                                     </h2>
//                                     <div
//                                         id={`panelsStayOpen-collapse${chapter.id}`}
//                                         className={`accordion-collapse collapse ${chapter.isOpen ? "show" : ""}`}
//                                         aria-labelledby={`panelsStayOpen-heading${chapter.id}`}
//                                     >
//                                         <div className="accordion-body">
//                                             {chapter.chapterItems && chapter.chapterItems.length > 0 ? (
//                                                 chapter.chapterItems.map((chapterItem) => {
//                                                     if (chapterItem.type === "lesson" || chapterItem.type === "live") {
//                                                         return (
//                                                             <div
//                                                                 key={chapterItem.id}
//                                                                 className="card course-section-item create_couese_item mb-3"
//                                                                 data-chapter-item-id={chapterItem.id}
//                                                                 data-chapterid={chapter.id}
//                                                             >
//                                                                 <div className="d-flex flex-wrap justify-content-between align-items-center">
//                                                                     <div className="edit_course_icons d-flex flex-wrap align-items-center">
//                                                                         <span className="icon-container">
//                                                                             <i
//                                                                                 className={`fas ${chapterItem.type === "lesson"
//                                                                                         ? "fa-video"
//                                                                                         : "fa-chalkboard-teacher"
//                                                                                     }`}
//                                                                             ></i>
//                                                                         </span>
//                                                                         <p className="mb-0 ms-2 bold-text">
//                                                                             {truncate(chapterItem?.lesson?.title)}
//                                                                         </p>
//                                                                     </div>
//                                                                     <div className="item-action">
//                                                                         <a
//                                                                             href="javascript:;"
//                                                                             className="ms-2 text-dark edit-lesson-btn"
//                                                                             onClick={() =>
//                                                                                 openModal(
//                                                                                     chapterItem.type === "lesson"
//                                                                                         ? "editLesson"
//                                                                                         : "editLiveLesson",
//                                                                                     {
//                                                                                         type: chapterItem.type,
//                                                                                         courseId: chapter.id,
//                                                                                         chapterId: chapter.id,
//                                                                                         chapterItemId: chapterItem.id,
//                                                                                     }
//                                                                                 )
//                                                                             }
//                                                                         >
//                                                                             <i className="fas fa-edit"></i>
//                                                                         </a>
//                                                                         <a
//                                                                             href="javascript:;"
//                                                                             className="ms-2 text-danger delete-item"
//                                                                         >
//                                                                             <i className="fas fa-trash-alt"></i>
//                                                                         </a>
//                                                                         <a href="javascript:;" className="ms-2 dragger">
//                                                                             <i className="fas fa-arrows-alt"></i>
//                                                                         </a>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         );
//                                                     } else if (chapterItem.type === "document") {
//                                                         return (
//                                                             <div
//                                                                 key={chapterItem.id}
//                                                                 className="card course-section-item create_couese_item mb-3"
//                                                                 data-chapter-item-id={chapterItem.id}
//                                                                 data-chapterid={chapter.id}
//                                                             >
//                                                                 <div className="d-flex flex-wrap justify-content-between align-items-center">
//                                                                     <div className="edit_course_icons d-flex flex-wrap align-items-center">
//                                                                         <span className="icon-container">
//                                                                             <i className="fas fa-file-pdf"></i>
//                                                                         </span>
//                                                                         <p className="mb-0 ms-2 bold-text">
//                                                                             {truncate(chapterItem?.lesson?.title)}
//                                                                         </p>
//                                                                     </div>
//                                                                     <div className="item-action">
//                                                                         <a
//                                                                             href="javascript:;"
//                                                                             className="ms-2 text-dark edit-lesson-btn"
//                                                                             onClick={() =>
//                                                                                 openModal("editDocument", {
//                                                                                     type: chapterItem.type,
//                                                                                     courseId: chapter.id,
//                                                                                     chapterId: chapter.id,
//                                                                                     chapterItemId: chapterItem.id,
//                                                                                 })
//                                                                             }
//                                                                         >
//                                                                             <i className="fas fa-edit"></i>
//                                                                         </a>
//                                                                         <a
//                                                                             href="javascript:;"
//                                                                             className="ms-2 text-danger delete-item"
//                                                                         >
//                                                                             <i className="fas fa-trash-alt"></i>
//                                                                         </a>
//                                                                         <a href="javascript:;" className="ms-2 dragger">
//                                                                             <i className="fas fa-arrows-alt"></i>
//                                                                         </a>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         );
//                                                     } else {
//                                                         // Quiz type
//                                                         return (
//                                                             <div
//                                                                 key={chapterItem.id}
//                                                                 className="accordion card mb-2"
//                                                                 id="accordionExample"
//                                                                 data-chapter-item-id={chapterItem.id}
//                                                                 data-chapterid={chapter.id}
//                                                             >
//                                                                 <div className="accordion-item">
//                                                                     <h2 className="accordion-header">
//                                                                         <div className="d-flex flex-wrap justify-content-between">
//                                                                             <button
//                                                                                 className={`accordion-button course-quiz-btn ${chapterItem.isOpen ? "" : "collapsed"
//                                                                                     }`}
//                                                                                 type="button"
//                                                                                 onClick={() => toggleQuiz(chapter.id, chapterItem.id)}
//                                                                             >
//                                                                                 <div className="d-flex flex-wrap justify-content-between align-items-center">
//                                                                                     <div className="d-flex flex-wrap align-items-center">
//                                                                                         <span className="icon-container">
//                                                                                             <i className="fas fa-question"></i>
//                                                                                         </span>
//                                                                                         <p className="mb-0 ms-2 bold-text">
//                                                                                             {chapterItem?.quiz?.title}
//                                                                                         </p>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             </button>
//                                                                             <div className="item-action d-flex flex-wrap">
//                                                                                 <div className="dropdown action-item">
//                                                                                     <span
//                                                                                         className="dropdown-toggle btn btn-small small-more-btn"
//                                                                                         onClick={() =>
//                                                                                             toggleDropdown(`quiz-${chapterItem.id}`)
//                                                                                         }
//                                                                                     >
//                                                                                         <i className="fas fa-plus"></i>
//                                                                                     </span>
//                                                                                     {dropdownOpen[`quiz-${chapterItem.id}`] && (
//                                                                                         <ul className="dropdown-menu dropdown-menu-end show">
//                                                                                             <li>
//                                                                                                 <a
//                                                                                                     className="dropdown-item add-quiz-question-btn"
//                                                                                                     onClick={() =>
//                                                                                                         openModal("addQuizQuestion", {
//                                                                                                             quizId: chapterItem.quiz?.id,
//                                                                                                         })
//                                                                                                     }
//                                                                                                     href="javascript:;"
//                                                                                                 >
//                                                                                                     Add Question
//                                                                                                 </a>
//                                                                                             </li>
//                                                                                         </ul>
//                                                                                     )}
//                                                                                 </div>
//                                                                                 <a
//                                                                                     href="javascript:;"
//                                                                                     onClick={() =>
//                                                                                         openModal("editQuiz", {
//                                                                                             type: chapterItem.type,
//                                                                                             courseId: chapter.id,
//                                                                                             chapterId: chapter.id,
//                                                                                             chapterItemId: chapterItem.id,
//                                                                                         })
//                                                                                     }
//                                                                                     className="text-dark action-item edit-lesson-btn"
//                                                                                 >
//                                                                                     <i className="fas fa-edit"></i>
//                                                                                 </a>
//                                                                                 <a
//                                                                                     href="javascript:;"
//                                                                                     className="text-danger action-item delete-item"
//                                                                                 >
//                                                                                     <i className="fas fa-trash-alt"></i>
//                                                                                 </a>
//                                                                                 <a href="javascript:;" className="ms-2 dragger">
//                                                                                     <i className="fas fa-arrows-alt"></i>
//                                                                                 </a>
//                                                                             </div>
//                                                                         </div>
//                                                                     </h2>
//                                                                     <div
//                                                                         id={`panelsStayOpen-collapse${chapterItem.id}`}
//                                                                         className={`accordion-collapse collapse ${chapterItem.isOpen ? "show" : ""
//                                                                             }`}
//                                                                         data-bs-parent="#accordionExample"
//                                                                     >
//                                                                         <div className="accordion-body">
//                                                                             {chapterItem?.quiz?.questions &&
//                                                                                 chapterItem.quiz.questions.length > 0 ? (
//                                                                                 chapterItem.quiz.questions.map((question) => (
//                                                                                     <div
//                                                                                         key={question.id}
//                                                                                         className="card course-section-item mb-3"
//                                                                                         data-chapter-item-id=""
//                                                                                         data-chapterid=""
//                                                                                     >
//                                                                                         <div className="d-flex flex-wrap justify-content-between align-items-center">
//                                                                                             <div className="edit_course_icons d-flex flex-wrap align-items-center">
//                                                                                                 <span className="icon-container">
//                                                                                                     <i className="far fa-question-circle"></i>
//                                                                                                 </span>
//                                                                                                 <p className="mb-0 ms-2 bold-text">
//                                                                                                     {question.title}
//                                                                                                 </p>
//                                                                                             </div>
//                                                                                             <div className="item-action">
//                                                                                                 <a
//                                                                                                     href="javascript:;"
//                                                                                                     className="ms-2 text-dark edit-question-btn"
//                                                                                                     onClick={() =>
//                                                                                                         openModal("editQuizQuestion", {
//                                                                                                             questionId: question.id,
//                                                                                                         })
//                                                                                                     }
//                                                                                                 >
//                                                                                                     <i className="fas fa-edit"></i>
//                                                                                                 </a>
//                                                                                                 <a
//                                                                                                     href="javascript:;"
//                                                                                                     className="ms-2 text-danger delete-item"
//                                                                                                 >
//                                                                                                     <i className="fas fa-trash-alt"></i>
//                                                                                                 </a>
//                                                                                             </div>
//                                                                                         </div>
//                                                                                     </div>
//                                                                                 ))
//                                                                             ) : (
//                                                                                 <p className="text-center">No questions found.</p>
//                                                                             )}
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         );
//                                                     }
//                                                 })
//                                             ) : (
//                                                 <p className="text-center">No lessons found.</p>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))
//                         ) : (
//                             <p className="text-center p-5">No chapters found.</p>
//                         )}
//                     </div>
//                 </form>
//             </div>

//             {/* Modal Components */}
//             {/* Add Chapter Modal */}
//             {activeModal === "addChapter" && (
//                 <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-modal="true" role="dialog">
//                     <div className="modal-dialog modal-dialog-centered modal-lg">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h1 className="modal-title fs-5">Chapter Title</h1>
//                                 <button type="button" className="btn-close" onClick={closeModal}></button>
//                             </div>
//                             <div className="modal-body">
//                                 <form className="instructor__profile-form" onSubmit={handleSubmit}>
//                                     <div className="col-md-12">
//                                         <div className="form-grp custom-frm-bx">
//                                             <label htmlFor="title">
//                                                 Title <code>*</code>
//                                             </label>
//                                             <input id="title" name="title" type="text" value="" className="form-control" />
//                                         </div>
//                                     </div>
//                                     <div className="text-end">
//                                         <button type="submit" className="btn btn-primary">
//                                             Create
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Sort Chapters Modal */}
//             {activeModal === "sortChapters" && (
//                 <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-modal="true" role="dialog">
//                     <div className="modal-dialog modal-dialog-centered">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h1 className="modal-title fs-5">Sort Chapters</h1>
//                                 <button type="button" className="btn-close" onClick={closeModal}></button>
//                             </div>
//                             <div className="p-3">
//                                 <form className="chapter_sorting_form" onSubmit={handleSubmit}>
//                                     <ul className="list-group draggable-list">
//                                         {chapters.map((chapter) => (
//                                             <li key={chapter.id} className="list-group-item mb-2" data-order={chapter.id}>
//                                                 <input type="hidden" name="chapter_ids[]" value={chapter.id} />
//                                                 <div className="course_shorting d-flex flex-wrap justify-content-between align-items-center">
//                                                     <div className="d-flex flex-wrap align-items-center">
//                                                         <span className="icon-container">
//                                                             <i className="fas fa-play"></i>
//                                                         </span>
//                                                         <p className="mb-0 ms-2 bold-text">{truncate(chapter.title)}</p>
//                                                     </div>
//                                                     <div className="item-action">
//                                                         <a href="javascript:;" className="ms-2 text-dark dragger">
//                                                             <i className="fas fa-arrows-alt"></i>
//                                                         </a>
//                                                     </div>
//                                                 </div>
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </form>
//                             </div>
//                             <div className="modal-footer">
//                                 <button type="button" className="btn btn-primary" onClick={handleSubmit}>
//                                     Save changes
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Add Document Modal */}
//             {activeModal === "addDocument" && (
//                 <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-modal="true" role="dialog">
//                     <div className="modal-dialog modal-dialog-centered modal-lg">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h1 className="modal-title fs-5">Add Document</h1>
//                                 <button type="button" className="btn-close" onClick={closeModal}></button>
//                             </div>
//                             <div className="p-3">
//                                 <form className="add_lesson_form instructor__profile-form" onSubmit={handleSubmit}>
//                                     <input type="hidden" name="course_id" value="" />
//                                     <input type="hidden" name="chapter_id" value={modalData.chapterId} />
//                                     <input type="hidden" name="type" value={modalData.type} />

//                                     <div className="col-md-12">
//                                         <div className="custom-frm-bx">
//                                             <label htmlFor="chapter">
//                                                 Chapter <code>*</code>
//                                             </label>
//                                             <select name="chapter" id="chapter" className="chapter from-select form-select">
//                                                 <option value="">Select</option>
//                                                 {chapters.map((chapter) => (
//                                                     <option
//                                                         key={chapter.id}
//                                                         selected={modalData.chapterId === chapter.id}
//                                                         value={chapter.id}
//                                                     >
//                                                         {chapter.title}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </div>
//                                     </div>

//                                     <div className="col-md-12">
//                                         <div className="custom-frm-bx">
//                                             <label htmlFor="title">
//                                                 Title <code>*</code>
//                                             </label>
//                                             <input id="title" name="title" className="form-control" type="text" value="" />
//                                         </div>
//                                     </div>

//                                     <div className="row">
//                                         <div className="col-md-9 upload">
//                                             <div className="from-group mb-3">
//                                                 <label className="form-file-manager-label" htmlFor="">
//                                                     Path <code>*</code>
//                                                 </label>
//                                                 <div className="input-group custom-frm-bx">
//                                                     <span className="input-group-text" id="basic-addon1">
//                                                         <a className="file-manager">
//                                                             <i className="fa fa-picture-o"></i> Choose
//                                                         </a>
//                                                     </span>
//                                                     <input
//                                                         id="path"
//                                                         readOnly
//                                                         className="from-control file-manager-input form-control"
//                                                         type="text"
//                                                         name="upload_path"
//                                                         value=""
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="col-md-3">
//                                             <div className="custom-frm-bx">
//                                                 <label htmlFor="file_type_select">
//                                                     File Type <code>*</code>
//                                                 </label>
//                                                 <select name="file_type" id="file_type_select" className="file_type form-select">
//                                                     <option value="">Select</option>
//                                                     <option value="pdf">PDF</option>
//                                                     <option value="txt">TXT</option>
//                                                     <option value="docx">DOCX</option>
//                                                 </select>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="col-md-12">
//                                         <div className="custom-frm-bx">
//                                             <label htmlFor="description">
//                                                 Description <code></code>
//                                             </label>
//                                             <textarea name="description" className="form-control"></textarea>
//                                         </div>
//                                     </div>
//                                     <div className="modal-footer">
//                                         <button type="submit" className="btn btn-primary submit-btn">
//                                             Create
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Add Lesson Modal */}
//             {activeModal === "addLesson" && (
//                 <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-modal="true" role="dialog">
//                     <div className="modal-dialog modal-dialog-centered modal-lg">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h1 className="modal-title fs-5">Add Lesson</h1>
//                                 <button type="button" className="btn-close" onClick={closeModal}></button>
//                             </div>
//                             <div className="p-3">
//                                 <form className="add_lesson_form instructor__profile-form" onSubmit={handleSubmit}>
//                                     <input type="hidden" name="course_id" value="" />
//                                     <input type="hidden" name="chapter_id" value={modalData.chapterId} />
//                                     <input type="hidden" name="type" value={modalData.type} />

//                                     <div className="col-md-12">
//                                         <div className="custom-frm-bx">
//                                             <label htmlFor="chapter">
//                                                 Chapter <code>*</code>
//                                             </label>
//                                             <select name="chapter" id="chapter" className="chapter form-select">
//                                                 <option value="">Select</option>
//                                                 {chapters.map((chapter) => (
//                                                     <option
//                                                         key={chapter.id}
//                                                         selected={modalData.chapterId === chapter.id}
//                                                         value={chapter.id}
//                                                     >
//                                                         {chapter.title}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </div>
//                                     </div>

//                                     <div className="col-md-12">
//                                         <div className="custom-frm-bx">
//                                             <label htmlFor="title">
//                                                 Title <code>*</code>
//                                             </label>
//                                             <input id="title" name="title" className="form-control" type="text" value="" />
//                                         </div>
//                                     </div>

//                                     <div className="row">
//                                         <div className="col-md-6">
//                                             <div className="custom-frm-bx">
//                                                 <label htmlFor="source">
//                                                     Source <code>*</code>
//                                                 </label>
//                                                 <select name="source" id="source" className="source form-select">
//                                                     <option value="">Select</option>
//                                                     <option value="upload">Upload</option>
//                                                     <option value="youtube">YouTube</option>
//                                                     <option value="vimeo">Vimeo</option>
//                                                     <option value="external_link">External Link</option>
//                                                 </select>
//                                             </div>
//                                         </div>
//                                         <div className="col-md-6">
//                                             <div className="custom-frm-bx">
//                                                 <label htmlFor="file_type">
//                                                     File Type <code>*</code>
//                                                 </label>
//                                                 <select name="file_type" id="file_type" className="file_type form-select">
//                                                     <option value="">Select</option>
//                                                     <option value="video">Video</option>
//                                                     <option value="file">File</option>
//                                                     <option value="other">Other</option>
//                                                 </select>
//                                             </div>
//                                         </div>

//                                         <div className="col-md-9 upload">
//                                             <div className="from-group mb-3 custom-frm-bx">
//                                                 <label className="form-file-manager-label" htmlFor="">
//                                                     Path <code>*</code>
//                                                 </label>
//                                                 <div className="input-group">
//                                                     <span className="input-group-text" id="basic-addon1">
//                                                         <a className="file-manager">
//                                                             <i className="fa fa-picture-o"></i> Choose
//                                                         </a>
//                                                     </span>
//                                                     <input
//                                                         id="path"
//                                                         readOnly
//                                                         className="form-control file-manager-input"
//                                                         type="text"
//                                                         name="upload_path"
//                                                         value=""
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="col-md-12 cloud_storage d-none custom-frm-bx">
//                                             <div className="custom-frm-bx mb-3">
//                                                 <label className="form-file-manager-label" htmlFor="">Upload</label>
//                                                 <div className="input-group">
//                                                     <div className="input-group">
//                                                         <input id="file-input" type="file" className="form-control" />
//                                                         <button type="button" id="cloud-btn" className="input-group-text" id="basic-addon1">
//                                                             <i className="fas fa-upload"></i>
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                                 <div className="progress d-none">
//                                                     <div
//                                                         className="progress-bar progress-bar-striped progress-bar-animated w-100"
//                                                         role="progressbar"
//                                                         aria-valuenow="100"
//                                                         aria-valuemin="0"
//                                                         aria-valuemax="100"
//                                                     ></div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="col-md-9 link_path d-none">
//                                             <div className="custom-frm-bx">
//                                                 <label htmlFor="meta_description">
//                                                     Path <code>*</code>
//                                                 </label>
//                                                 <div className="input-group mb-3">
//                                                     <span className="input-group-text" id="basic-addon1">
//                                                         <i className="fas fa-link"></i>
//                                                     </span>
//                                                     <input
//                                                         type="text"
//                                                         className="form-control"
//                                                         id="input_link"
//                                                         name="link_path"
//                                                         placeholder="paste source url"
//                                                         value=""
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div className="col-md-3">
//                                             <div className="custom-frm-bx">
//                                                 <label htmlFor="duration">
//                                                     Duration <code>* (in minutes)</code>
//                                                 </label>
//                                                 <input id="duration" name="duration" className="form-control" type="text" value="" />
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="row is_free_wrapper">
//                                         <div className="col-md-6 mt-2 mb-3">
//                                             <span className="toggle-label">Preview</span>
//                                             <div className="switcher">
//                                                 <label htmlFor="toggle-0">
//                                                     <input type="checkbox" id="toggle-0" value="1" name="is_free" />
//                                                     <span>
//                                                         <small></small>
//                                                     </span>
//                                                 </label>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="col-md-12">
//                                         <div className="custom-frm-bx">
//                                             <label htmlFor="description">
//                                                 Description <code></code>
//                                             </label>
//                                             <textarea name="description" className="form-control"></textarea>
//                                         </div>
//                                     </div>
//                                     <div className="modal-footer">
//                                         <button type="submit" className="btn btn-primary submit-btn">
//                                             Create
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Add Live Lesson Modal */}
//             {activeModal === "addLiveLesson" && (
//                 <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-modal="true" role="dialog">
//                     <div className="modal-dialog modal-dialog-centered modal-lg">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h1 className="modal-title fs-5">Add live lesson</h1>
//                                 <button type="button" className="btn-close" onClick={closeModal}></button>
//                             </div>
//                             <div className="p-3">
//                                 <form className="add_lesson_form instructor__profile-form" onSubmit={handleSubmit}>
//                                     <input type="hidden" name="course_id" value="" />
//                                     <input type="hidden" name="chapter_id" value={modalData.chapterId} />
//                                     <input type="hidden" name="type" value={modalData.type} />

//                                     <div className="col-md-12">
//                                         <div className="custom-frm-bx">
//                                             <label htmlFor="chapter">
//                                                 Chapter <code>*</code>
//                                             </label>
//                                             <select name="chapter" id="chapter" className="chapter form-select">
//                                                 <option value="">Select</option>
//                                                 {chapters.map((chapter) => (
//                                                     <option
//                                                         key={chapter.id}
//                                                         selected={modalData.chapterId === chapter.id}
//                                                         value={chapter.id}
//                                                     >
//                                                         {chapter.title}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </div>
//                                     </div>

//                                     <div className="col-md-12">
//                                         <div className="custom-frm-bx">
//                                             <label htmlFor="title">
//                                                 Title <code>*</code>
//                                             </label>
//                                             <input id="title" name="title" className="form-control" type="text" value="" />
//                                         </div>
//                                     </div>
//                                     <div className="row">
//                                         <div className="col-md-3">
//                                             <div className="custom-frm-bx">
//                                                 <label htmlFor="live_type">
//                                                     Live Platform <code>*</code>
//                                                 </label>
//                                                 <select name="live_type" id="live_type" className="form-select">
//                                                     <option value="zoom">Zoom</option>
//                                                     <option value="jitsi">Jitsi</option>
//                                                 </select>
//                                             </div>
//                                         </div>
//                                         <div className="col-md-6">
//                                             <div className="custom-frm-bx">
//                                                 <label htmlFor="start_time">
//                                                     Start Time <code>*</code>
//                                                 </label>
//                                                 <input id="start_time" name="start_time" className="form-control" type="datetime-local" />
//                                             </div>
//                                         </div>

//                                         <div className="col-md-3">
//                                             <div className="custom-frm-bx">
//                                                 <label htmlFor="duration">
//                                                     Duration <code>* (in minutes)</code>
//                                                 </label>
//                                                 <input id="duration" name="duration" className="form-control" type="text" value="" />
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="col-12 zoom-alert-box">
//                                         <div className="alert alert-warning" role="alert">
//                                             The meeting ID, password, and Zoom settings must be configured using the same Zoom account. The course creator needs to set up the{" "}
//                                             <a href="#">Zoom live setting</a>.
//                                         </div>
//                                     </div>
//                                     <div className="col-12 jitsi-alert-box d-none">
//                                         <div className="alert alert-warning" role="alert">
//                                             The meeting ID and Jitsi settings must be configured. The course creator needs to set up the{" "}
//                                             <a href="#">Jitsi setting</a>.
//                                         </div>
//                                     </div>
//                                     <div className="row">
//                                         <div className="col-md-6 meeting-id-box">
//                                             <div className="custom-frm-bx">
//                                                 <label htmlFor="meeting_id">
//                                                     Meeting ID <code>*</code>
//                                                 </label>
//                                                 <input id="meeting_id" name="meeting_id" className="form-control" type="text" value="" />
//                                             </div>
//                                         </div>
//                                         <div className="col-md-6 zoom-box">
//                                             <div className="custom-frm-bx">
//                                                 <label htmlFor="password">
//                                                     Password <code>*</code>
//                                                 </label>
//                                                 <input id="password" name="password" className="form-control" type="text" value="" />
//                                             </div>
//                                         </div>
//                                         <div className="col-md-12 zoom-box">
//                                             <div className="custom-frm-bx">
//                                                 <label htmlFor="join_url">Join URL</label>
//                                                 <input id="join_url" name="join_url" className="form-control" type="url" />
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="col-md-12">
//                                         <div className="custom-frm-bx">
//                                             <label htmlFor="description">
//                                                 Description <code></code>
//                                             </label>
//                                             <textarea name="description" className="form-control"></textarea>
//                                         </div>
//                                     </div>
//                                     <div className="col-md-12 mb-3">
//                                         <div className="account__check-remember">
//                                             <input
//                                                 id="student_mail_sent"
//                                                 type="checkbox"
//                                                 className="form-check-input"
//                                                 name="student_mail_sent"
//                                             />
//                                             <label htmlFor="student_mail_sent" className="form-check-label">
//                                                 Email to all students.
//                                             </label>
//                                         </div>
//                                     </div>
//                                     <div className="modal-footer">
//                                         <button type="submit" className="btn btn-primary submit-btn">
//                                             Create
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Add Quiz Modal */}
//             {activeModal === "addQuiz" && (
//                 <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-modal="true" role="dialog">
//                     <div className="modal-dialog modal-dialog-centered modal-lg">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h1 className="modal-title fs-5">Add Quiz</h1>
//                                 <button type="button" className="btn-close" onClick={closeModal}></button>
//                             </div>
//                             <div className="p-3">
//                                 <form className="add_lesson_form instructor__profile-form" onSubmit={handleSubmit}>
//                                     <input type="hidden" name="course_id" value="" />
//                                     <input type="hidden" name="chapter_id" value={modalData.chapterId} />
//                                     <input type="hidden" name="type" value={modalData.type} />

//                                     <div className="col-md-12">
//                                         <div className="custom-frm-bx">
//                                             <label htmlFor="chapter">
//                                                 Chapter <code>*</code>
//                                             </label>
//                                             <select name="chapter" id="chapter" className="chapter form-select">
//                                                 <option value="">Select</option>
//                                                 {chapters.map((chapter) => (
//                                                     <option
//                                                         key={chapter.id}
//                                                         selected={modalData.chapterId === chapter.id}
//                                                         value={chapter.id}
//                                                     >
//                                                         {chapter.title}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </div>
//                                     </div>

//                                     <div className="col-md-12">
//                                         <div className="custom-frm-bx">
//                                             <label htmlFor="title">
//                                                 Title <code>*</code>
//                                             </label>
//                                             <input id="title" name="title" type="text" className="form-control" value="" />
//                                         </div>
//                                     </div>

//                                     <div className="row">
//                                         <div className="col-md-6">
//                                             <div className="custom-frm-bx">
//                                                 <label htmlFor="time_limit">
//                                                     Time Limit <code>(leave empty for unlimited)</code>
//                                                 </label>
//                                                 <input id="time_limit" name="time_limit" className="form-control" type="text" value="" />
//                                             </div>
//                                         </div>
//                                         <div className="col-md-6">
//                                             <div className="custom-frm-bx">
//                                                 <label htmlFor="attempts">
//                                                     Attempts <code>(leave empty for unlimited)</code>
//                                                 </label>
//                                                 <input id="attempts" name="attempts" className="form-control" type="text" value="" />
//                                             </div>
//                                         </div>
//                                         <div className="col-md-6">
//                                             <div className="custom-frm-bx">
//                                                 <label htmlFor="total_mark">
//                                                     Total mark <code>*</code>
//                                                 </label>
//                                                 <input id="total_mark" name="total_mark" className="form-control" type="text" value="" />
//                                             </div>
//                                         </div>
//                                         <div className="col-md-6">
//                                             <div className="custom-frm-bx">
//                                                 <label htmlFor="pass_mark">
//                                                     Pass mark <code>*</code>
//                                                 </label>
//                                                 <input id="pass_mark" name="pass_mark" className="form-control" type="text" value="" />
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="modal-footer">
//                                         <button type="submit" className="btn btn-primary submit-btn">
//                                             Create
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Add Quiz Question Modal */}
//             {activeModal === "addQuizQuestion" && (
//                 <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-modal="true" role="dialog">
//                     <div className="modal-dialog modal-dialog-centered modal-lg">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h1 className="modal-title fs-5">Add Quiz Question</h1>
//                                 <button type="button" className="btn-close" onClick={closeModal}></button>
//                             </div>
//                             <div className="p-3">
//                                 <form className="add_lesson_form instructor__profile-form" onSubmit={handleSubmit}>
//                                     <div className="row">
//                                         <div className="col-md-10">
//                                             <div className="custom-frm-bx">
//                                                 <label htmlFor="title">
//                                                     Question Title <code>*</code>
//                                                 </label>
//                                                 <input id="title" name="title" className="form-control" type="text" value="" />
//                                             </div>
//                                         </div>
//                                         <div className="col-md-2">
//                                             <div className="custom-frm-bx">
//                                                 <label htmlFor="title">
//                                                     Grade <code>*</code>
//                                                 </label>
//                                                 <input id="title" name="grade" className="form-control" type="text" value="" />
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div>
//                                         <button className="add-answer btn" type="button">
//                                             Add Answer
//                                         </button>
//                                     </div>

//                                     <div className="answer-container">
//                                         <div className="card mt-3">
//                                             <div className="card-body">
//                                                 <div className="col-md-12">
//                                                     <div className="custom-frm-bx">
//                                                         <div className="d-flex justify-content-between">
//                                                             <label htmlFor="answer">
//                                                                 Answer Title <code>*</code>
//                                                             </label>
//                                                             <button className="remove-answer" type="button">
//                                                                 <i className="fas fa-trash-alt"></i>
//                                                             </button>
//                                                         </div>
//                                                         <input
//                                                             className="answer form-control"
//                                                             name="answers[]"
//                                                             type="text"
//                                                             value=""
//                                                             required
//                                                         />
//                                                     </div>
//                                                     <div className="switcher d-flex">
//                                                         <p className="me-3">Correct Answer</p>
//                                                         <label htmlFor="toggle-0">
//                                                             <input type="checkbox" className="correct" id="toggle-0" value="1" name="correct[]" />
//                                                             <span>
//                                                                 <small></small>
//                                                             </span>
//                                                         </label>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="modal-footer">
//                                         <button type="submit" className="btn btn-primary submit-btn">
//                                             Create
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Edit Chapter Modal */}
//             {activeModal === "editChapter" && (
//                 <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-modal="true" role="dialog">
//                     <div className="modal-dialog modal-dialog-centered modal-lg">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h1 className="modal-title fs-5">Chapter Title</h1>
//                                 <button type="button" className="btn-close" onClick={closeModal}></button>
//                             </div>
//                             <div className="p-3">
//                                 <form className="instructor__profile-form" onSubmit={handleSubmit}>
//                                     <div className="col-md-12">
//                                         <div className="form-grp custom-frm-bx">
//                                             <label htmlFor="title">
//                                                 Title <code>*</code>
//                                             </label>
//                                             <input
//                                                 id="title"
//                                                 name="title"
//                                                 className="form-control"
//                                                 type="text"
//                                                 value={
//                                                     chapters.find((chapter) => chapter.id === modalData.chapterId)?.title || ""
//                                                 }
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className="text-end">
//                                         <button type="submit" className="btn btn-primary">
//                                             Update
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Other modals would follow the same pattern */}
//             {/* I've included the most important ones, but you can add more as needed */}
//         </div>
//     );
// };

// export default CourseContent;



import { useState } from "react"
// Import FontAwesome CSS
// Note: In a real project, you would need to install FontAwesome via npm
// and import it properly, but for this example we'll assume it's available

const CourseContentv1 = () => {
    // Sample data for demonstration
    const [chapters, setChapters] = useState([
        {
            id: 1,
            title: "Introduction to the Course",
            isOpen: true,
            chapterItems: [
                {
                    id: 101,
                    type: "lesson",
                    lesson: { title: "Welcome to the Course" },
                },
                {
                    id: 102,
                    type: "document",
                    lesson: { title: "Course Syllabus" },
                },
                {
                    id: 103,
                    type: "quiz",
                    isOpen: false,
                    quiz: {
                        id: 201,
                        title: "Introduction Quiz",
                        questions: [
                            { id: 301, title: "What is this course about?" },
                            { id: 302, title: "What will you learn in this course?" },
                        ],
                    },
                },
            ],
        },
        {
            id: 2,
            title: "Getting Started",
            isOpen: false,
            chapterItems: [
                {
                    id: 104,
                    type: "lesson",
                    lesson: { title: "Setting Up Your Environment" },
                },
                {
                    id: 105,
                    type: "live",
                    lesson: { title: "Live Q&A Session" },
                },
            ],
        },
    ])

    // State for modals
    const [activeModal, setActiveModal] = useState(null)
    const [dropdownOpen, setDropdownOpen] = useState({})
    const [modalData, setModalData] = useState({
        chapterId: null,
        courseId: null,
        chapterItemId: null,
        type: null,
        quizId: null,
    })

    // Function to open a modal
    const openModal = (modalName, data = {}) => {
        setActiveModal(modalName)
        setModalData({ ...modalData, ...data })
    }

    // Function to close a modal
    const closeModal = () => {
        setActiveModal(null)
    }

    const toggleChapter = (chapterId) => {
        setChapters(
            chapters.map((chapter) => (chapter.id === chapterId ? { ...chapter, isOpen: !chapter.isOpen } : chapter)),
        )
    }

    const toggleQuiz = (chapterId, itemId) => {
        setChapters(
            chapters.map((chapter) =>
                chapter.id === chapterId
                    ? {
                        ...chapter,
                        chapterItems: chapter.chapterItems.map((item) =>
                            item.id === itemId ? { ...item, isOpen: !item.isOpen } : item,
                        ),
                    }
                    : chapter,
            ),
        )
    }

    const toggleDropdown = (id) => {
        setDropdownOpen({
            ...dropdownOpen,
            [id]: !dropdownOpen[id],
        })
    }

    const truncate = (text) => {
        return text && text.length > 40 ? text.substring(0, 40) + "..." : text
    }

    // Function to handle form submission (placeholder)
    const handleSubmit = (e) => {
        e.preventDefault()
        // In a real app, you would handle form submission here
        closeModal()
    }

    return (
        <div className="col-lg-9">
            <form className="instructor__profile-form course-form">
                <input type="hidden" name="step" value="3" />
                <input type="hidden" name="next_step" value="4" />
            </form>

            <div className="instructor__profile-form-wrap">
                <form>
                    <div className="mb-3 d-flex flex-wrap justify-content-between">
                        <button type="button" className="thm-btn" onClick={() => openModal("addChapter")}>
                            Add new chapter
                        </button>

                        <button type="button" className="thm-btn info" onClick={() => openModal("sortChapters")}>
                            Sort chapter
                        </button>
                    </div>
                    <div className="accordion draggable-list" id="accordionPanelsStayOpenExample">
                        {chapters.length > 0 ? (
                            chapters.map((chapter) => (
                                <div key={chapter.id} className="accordion-item course-section add_course_section_area">
                                    <h2 className="accordion-header" id={`panelsStayOpen-heading${chapter.id}`}>
                                        <div className="accordion_header_content d-flex flex-wrap">
                                            <button
                                                className={`accordion-button course-section-btn ${chapter.isOpen ? "" : "collapsed"}`}
                                                type="button"
                                                onClick={() => toggleChapter(chapter.id)}
                                            >
                                                <div className="icon_area d-flex flex-wrap justify-content-between align-items-center w-100">
                                                    <div className="d-flex flex-wrap align-items-center">
                                                        <span className="icon-container">
                                                            <i className="far fa-folder"></i>
                                                        </span>
                                                        <p className="mb-0 ms-2 bold-text">{chapter.title}</p>
                                                    </div>
                                                </div>
                                            </button>

                                            <div className="item-action item_action_header d-flex flex-wrap">
                                                <div className="dropdown action-item">
                                                    <span
                                                        className="dropdown-toggle btn btn-small small-more-btn"
                                                        onClick={() => toggleDropdown(`chapter-${chapter.id}`)}
                                                    >
                                                        <i className="fas fa-plus"></i>
                                                    </span>
                                                    {dropdownOpen[`chapter-${chapter.id}`] && (
                                                        <ul className="dropdown-menu dropdown-menu-end show">
                                                            <li>
                                                                <a
                                                                    className="dropdown-item add-lesson-btn"
                                                                    onClick={() =>
                                                                        openModal("addLesson", {
                                                                            chapterId: chapter.id,
                                                                            type: "lesson",
                                                                        })
                                                                    }
                                                                    href="javascript:;"
                                                                >
                                                                    Add Lesson
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a
                                                                    className="dropdown-item add-lesson-btn"
                                                                    onClick={() =>
                                                                        openModal("addDocument", {
                                                                            chapterId: chapter.id,
                                                                            type: "document",
                                                                        })
                                                                    }
                                                                    href="javascript:;"
                                                                >
                                                                    Add Document
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a
                                                                    className="dropdown-item add-lesson-btn"
                                                                    onClick={() =>
                                                                        openModal("addLiveLesson", {
                                                                            chapterId: chapter.id,
                                                                            type: "live",
                                                                        })
                                                                    }
                                                                    href="javascript:;"
                                                                >
                                                                    Add Live lesson
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a
                                                                    className="dropdown-item add-lesson-btn"
                                                                    onClick={() =>
                                                                        openModal("addQuiz", {
                                                                            chapterId: chapter.id,
                                                                            type: "quiz",
                                                                        })
                                                                    }
                                                                    href="javascript:;"
                                                                >
                                                                    Add Quiz
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    )}
                                                </div>
                                                <a
                                                    href="javascript:;"
                                                    className="text-dark action-item edit-chapter-btn"
                                                    onClick={() => openModal("editChapter", { chapterId: chapter.id })}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </a>
                                                <a href="javascript:;" className="text-danger action-item delete-item">
                                                    <i className="fas fa-trash-alt"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </h2>
                                    <div
                                        id={`panelsStayOpen-collapse${chapter.id}`}
                                        className={`accordion-collapse collapse ${chapter.isOpen ? "show" : ""}`}
                                        aria-labelledby={`panelsStayOpen-heading${chapter.id}`}
                                    >
                                        <div className="accordion-body">
                                            {chapter.chapterItems && chapter.chapterItems.length > 0 ? (
                                                chapter.chapterItems.map((chapterItem) => {
                                                    if (chapterItem.type === "lesson" || chapterItem.type === "live") {
                                                        return (
                                                            <div
                                                                key={chapterItem.id}
                                                                className="card course-section-item create_couese_item mb-3"
                                                                data-chapter-item-id={chapterItem.id}
                                                                data-chapterid={chapter.id}
                                                            >
                                                                <div className="d-flex flex-wrap justify-content-between align-items-center">
                                                                    <div className="edit_course_icons d-flex flex-wrap align-items-center">
                                                                        <span className="icon-container">
                                                                            <i
                                                                                className={`fas ${chapterItem.type === "lesson" ? "fa-video" : "fa-chalkboard-teacher"
                                                                                    }`}
                                                                            ></i>
                                                                        </span>
                                                                        <p className="mb-0 ms-2 bold-text">{truncate(chapterItem?.lesson?.title)}</p>
                                                                    </div>
                                                                    <div className="item-action">
                                                                        <a
                                                                            href="javascript:;"
                                                                            className="ms-2 text-dark edit-lesson-btn"
                                                                            onClick={() =>
                                                                                openModal(chapterItem.type === "lesson" ? "editLesson" : "editLiveLesson", {
                                                                                    type: chapterItem.type,
                                                                                    courseId: chapter.id,
                                                                                    chapterId: chapter.id,
                                                                                    chapterItemId: chapterItem.id,
                                                                                })
                                                                            }
                                                                        >
                                                                            <i className="fas fa-edit"></i>
                                                                        </a>
                                                                        <a href="javascript:;" className="ms-2 text-danger delete-item">
                                                                            <i className="fas fa-trash-alt"></i>
                                                                        </a>
                                                                        <a href="javascript:;" className="ms-2 dragger">
                                                                            <i className="fas fa-arrows-alt"></i>
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    } else if (chapterItem.type === "document") {
                                                        return (
                                                            <div
                                                                key={chapterItem.id}
                                                                className="card course-section-item create_couese_item mb-3"
                                                                data-chapter-item-id={chapterItem.id}
                                                                data-chapterid={chapter.id}
                                                            >
                                                                <div className="d-flex flex-wrap justify-content-between align-items-center">
                                                                    <div className="edit_course_icons d-flex flex-wrap align-items-center">
                                                                        <span className="icon-container">
                                                                            <i className="fas fa-file-pdf"></i>
                                                                        </span>
                                                                        <p className="mb-0 ms-2 bold-text">{truncate(chapterItem?.lesson?.title)}</p>
                                                                    </div>
                                                                    <div className="item-action">
                                                                        <a
                                                                            href="javascript:;"
                                                                            className="ms-2 text-dark edit-lesson-btn"
                                                                            onClick={() =>
                                                                                openModal("editDocument", {
                                                                                    type: chapterItem.type,
                                                                                    courseId: chapter.id,
                                                                                    chapterId: chapter.id,
                                                                                    chapterItemId: chapterItem.id,
                                                                                })
                                                                            }
                                                                        >
                                                                            <i className="fas fa-edit"></i>
                                                                        </a>
                                                                        <a href="javascript:;" className="ms-2 text-danger delete-item">
                                                                            <i className="fas fa-trash-alt"></i>
                                                                        </a>
                                                                        <a href="javascript:;" className="ms-2 dragger">
                                                                            <i className="fas fa-arrows-alt"></i>
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    } else {
                                                        // Quiz type
                                                        return (
                                                            <div
                                                                key={chapterItem.id}
                                                                className="accordion card mb-2"
                                                                id="accordionExample"
                                                                data-chapter-item-id={chapterItem.id}
                                                                data-chapterid={chapter.id}
                                                            >
                                                                <div className="accordion-item">
                                                                    <h2 className="accordion-header">
                                                                        <div className="d-flex flex-wrap justify-content-between">
                                                                            <button
                                                                                className={`accordion-button course-quiz-btn ${chapterItem.isOpen ? "" : "collapsed"
                                                                                    }`}
                                                                                type="button"
                                                                                onClick={() => toggleQuiz(chapter.id, chapterItem.id)}
                                                                            >
                                                                                <div className="d-flex flex-wrap justify-content-between align-items-center">
                                                                                    <div className="d-flex flex-wrap align-items-center">
                                                                                        <span className="icon-container">
                                                                                            <i className="fas fa-question"></i>
                                                                                        </span>
                                                                                        <p className="mb-0 ms-2 bold-text">{chapterItem?.quiz?.title}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </button>
                                                                            <div className="item-action d-flex flex-wrap">
                                                                                <div className="dropdown action-item">
                                                                                    <span
                                                                                        className="dropdown-toggle btn btn-small small-more-btn"
                                                                                        onClick={() => toggleDropdown(`quiz-${chapterItem.id}`)}
                                                                                    >
                                                                                        <i className="fas fa-plus"></i>
                                                                                    </span>
                                                                                    {dropdownOpen[`quiz-${chapterItem.id}`] && (
                                                                                        <ul className="dropdown-menu dropdown-menu-end show">
                                                                                            <li>
                                                                                                <a
                                                                                                    className="dropdown-item add-quiz-question-btn"
                                                                                                    onClick={() =>
                                                                                                        openModal("addQuizQuestion", {
                                                                                                            quizId: chapterItem.quiz?.id,
                                                                                                        })
                                                                                                    }
                                                                                                    href="javascript:;"
                                                                                                >
                                                                                                    Add Question
                                                                                                </a>
                                                                                            </li>
                                                                                        </ul>
                                                                                    )}
                                                                                </div>
                                                                                <a
                                                                                    href="javascript:;"
                                                                                    onClick={() =>
                                                                                        openModal("editQuiz", {
                                                                                            type: chapterItem.type,
                                                                                            courseId: chapter.id,
                                                                                            chapterId: chapter.id,
                                                                                            chapterItemId: chapterItem.id,
                                                                                        })
                                                                                    }
                                                                                    className="text-dark action-item edit-lesson-btn"
                                                                                >
                                                                                    <i className="fas fa-edit"></i>
                                                                                </a>
                                                                                <a href="javascript:;" className="text-danger action-item delete-item">
                                                                                    <i className="fas fa-trash-alt"></i>
                                                                                </a>
                                                                                <a href="javascript:;" className="ms-2 dragger">
                                                                                    <i className="fas fa-arrows-alt"></i>
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    </h2>
                                                                    <div
                                                                        id={`panelsStayOpen-collapse${chapterItem.id}`}
                                                                        className={`accordion-collapse collapse ${chapterItem.isOpen ? "show" : ""}`}
                                                                        data-bs-parent="#accordionExample"
                                                                    >
                                                                        <div className="accordion-body">
                                                                            {chapterItem?.quiz?.questions && chapterItem.quiz.questions.length > 0 ? (
                                                                                chapterItem.quiz.questions.map((question) => (
                                                                                    <div
                                                                                        key={question.id}
                                                                                        className="card course-section-item mb-3"
                                                                                        data-chapter-item-id=""
                                                                                        data-chapterid=""
                                                                                    >
                                                                                        <div className="d-flex flex-wrap justify-content-between align-items-center">
                                                                                            <div className="edit_course_icons d-flex flex-wrap align-items-center">
                                                                                                <span className="icon-container">
                                                                                                    <i className="far fa-question-circle"></i>
                                                                                                </span>
                                                                                                <p className="mb-0 ms-2 bold-text">{question.title}</p>
                                                                                            </div>
                                                                                            <div className="item-action">
                                                                                                <a
                                                                                                    href="javascript:;"
                                                                                                    className="ms-2 text-dark edit-question-btn"
                                                                                                    onClick={() =>
                                                                                                        openModal("editQuizQuestion", {
                                                                                                            questionId: question.id,
                                                                                                        })
                                                                                                    }
                                                                                                >
                                                                                                    <i className="fas fa-edit"></i>
                                                                                                </a>
                                                                                                <a href="javascript:;" className="ms-2 text-danger delete-item">
                                                                                                    <i className="fas fa-trash-alt"></i>
                                                                                                </a>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ))
                                                                            ) : (
                                                                                <p className="text-center">No questions found.</p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })
                                            ) : (
                                                <p className="text-center">No lessons found.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center p-5">No chapters found.</p>
                        )}
                    </div>
                </form>
            </div>

            {/* Modal Components */}
            {/* Add Chapter Modal */}
            {activeModal === "addChapter" && (
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-modal="true" role="dialog">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5">Chapter Title</h1>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                <form className="instructor__profile-form" onSubmit={handleSubmit}>
                                    <div className="col-md-12">
                                        <div className="form-grp custom-frm-bx">
                                            <label htmlFor="title">
                                                Title <code>*</code>
                                            </label>
                                            <input id="title" name="title" type="text" value="" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <button type="submit" className="btn btn-primary">
                                            Create
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Sort Chapters Modal */}
            {activeModal === "sortChapters" && (
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-modal="true" role="dialog">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5">Sort Chapters</h1>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="p-3">
                                <form className="chapter_sorting_form" onSubmit={handleSubmit}>
                                    <ul className="list-group draggable-list">
                                        {chapters.map((chapter) => (
                                            <li key={chapter.id} className="list-group-item mb-2" data-order={chapter.id}>
                                                <input type="hidden" name="chapter_ids[]" value={chapter.id} />
                                                <div className="course_shorting d-flex flex-wrap justify-content-between align-items-center">
                                                    <div className="d-flex flex-wrap align-items-center">
                                                        <span className="icon-container">
                                                            <i className="fas fa-play"></i>
                                                        </span>
                                                        <p className="mb-0 ms-2 bold-text">{truncate(chapter.title)}</p>
                                                    </div>
                                                    <div className="item-action">
                                                        <a href="javascript:;" className="ms-2 text-dark dragger">
                                                            <i className="fas fa-arrows-alt"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                                    Save changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Document Modal */}
            {activeModal === "addDocument" && (
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-modal="true" role="dialog">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5">Add Document</h1>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="p-3">
                                <form className="add_lesson_form instructor__profile-form" onSubmit={handleSubmit}>
                                    <input type="hidden" name="course_id" value="" />
                                    <input type="hidden" name="chapter_id" value={modalData.chapterId} />
                                    <input type="hidden" name="type" value={modalData.type} />

                                    <div className="col-md-12">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="chapter">
                                                Chapter <code>*</code>
                                            </label>
                                            <select name="chapter" id="chapter" className="chapter from-select form-select">
                                                <option value="">Select</option>
                                                {chapters.map((chapter) => (
                                                    <option key={chapter.id} selected={modalData.chapterId === chapter.id} value={chapter.id}>
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
                                            <input id="title" name="title" className="form-control" type="text" value="" />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-9 upload">
                                            <div className="from-group mb-3">
                                                <label className="form-file-manager-label" htmlFor="">
                                                    Path <code>*</code>
                                                </label>
                                                <div className="input-group custom-frm-bx">
                                                    <span className="input-group-text" id="basic-addon1">
                                                        <a className="file-manager">
                                                            <i className="fa fa-picture-o"></i> Choose
                                                        </a>
                                                    </span>
                                                    <input
                                                        id="path"
                                                        readOnly
                                                        className="from-control file-manager-input form-control"
                                                        type="text"
                                                        name="upload_path"
                                                        value=""
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="file_type_select">
                                                    File Type <code>*</code>
                                                </label>
                                                <select name="file_type" id="file_type_select" className="file_type form-select">
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
                                            <label htmlFor="description">
                                                Description <code></code>
                                            </label>
                                            <textarea name="description" className="form-control"></textarea>
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
            )}

            {/* Add Lesson Modal */}
            {activeModal === "addLesson" && (
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-modal="true" role="dialog">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5">Add Lesson</h1>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="p-3">
                                <form className="add_lesson_form instructor__profile-form" onSubmit={handleSubmit}>
                                    <input type="hidden" name="course_id" value="" />
                                    <input type="hidden" name="chapter_id" value={modalData.chapterId} />
                                    <input type="hidden" name="type" value={modalData.type} />

                                    <div className="col-md-12">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="chapter">
                                                Chapter <code>*</code>
                                            </label>
                                            <select name="chapter" id="chapter" className="chapter form-select">
                                                <option value="">Select</option>
                                                {chapters.map((chapter) => (
                                                    <option key={chapter.id} selected={modalData.chapterId === chapter.id} value={chapter.id}>
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
                                            <input id="title" name="title" className="form-control" type="text" value="" />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="source">
                                                    Source <code>*</code>
                                                </label>
                                                <select name="source" id="source" className="source form-select">
                                                    <option value="">Select</option>
                                                    <option value="upload">Upload</option>
                                                    <option value="youtube">YouTube</option>
                                                    <option value="vimeo">Vimeo</option>
                                                    <option value="external_link">External Link</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="file_type">
                                                    File Type <code>*</code>
                                                </label>
                                                <select name="file_type" id="file_type" className="file_type form-select">
                                                    <option value="">Select</option>
                                                    <option value="video">Video</option>
                                                    <option value="file">File</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="col-md-9 upload">
                                            <div className="from-group mb-3 custom-frm-bx">
                                                <label className="form-file-manager-label" htmlFor="">
                                                    Path <code>*</code>
                                                </label>
                                                <div className="input-group">
                                                    <span className="input-group-text" id="basic-addon1">
                                                        <a className="file-manager">
                                                            <i className="fa fa-picture-o"></i> Choose
                                                        </a>
                                                    </span>
                                                    <input
                                                        id="path"
                                                        readOnly
                                                        className="form-control file-manager-input"
                                                        type="text"
                                                        name="upload_path"
                                                        value=""
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12 cloud_storage d-none custom-frm-bx">
                                            <div className="custom-frm-bx mb-3">
                                                <label className="form-file-manager-label" htmlFor="">
                                                    Upload
                                                </label>
                                                <div className="input-group">
                                                    <div className="input-group">
                                                        <input id="file-input" type="file" className="form-control" />
                                                        <button type="button" id="cloud-btn" className="input-group-text" id="basic-addon1">
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
                                        <div className="col-md-9 link_path d-none">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="meta_description">
                                                    Path <code>*</code>
                                                </label>
                                                <div className="input-group mb-3">
                                                    <span className="input-group-text" id="basic-addon1">
                                                        <i className="fas fa-link"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="input_link"
                                                        name="link_path"
                                                        placeholder="paste source url"
                                                        value=""
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-3">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="duration">
                                                    Duration <code>* (in minutes)</code>
                                                </label>
                                                <input id="duration" name="duration" className="form-control" type="text" value="" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row is_free_wrapper">
                                        <div className="col-md-6 mt-2 mb-3">
                                            <span className="toggle-label">Preview</span>
                                            <div className="switcher">
                                                <label htmlFor="toggle-0">
                                                    <input type="checkbox" id="toggle-0" value="1" name="is_free" />
                                                    <span>
                                                        <small></small>
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="description">
                                                Description <code></code>
                                            </label>
                                            <textarea name="description" className="form-control"></textarea>
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
            )}

            {/* Add Live Lesson Modal */}
            {activeModal === "addLiveLesson" && (
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-modal="true" role="dialog">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5">Add live lesson</h1>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="p-3">
                                <form className="add_lesson_form instructor__profile-form" onSubmit={handleSubmit}>
                                    <input type="hidden" name="course_id" value="" />
                                    <input type="hidden" name="chapter_id" value={modalData.chapterId} />
                                    <input type="hidden" name="type" value={modalData.type} />

                                    <div className="col-md-12">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="chapter">
                                                Chapter <code>*</code>
                                            </label>
                                            <select name="chapter" id="chapter" className="chapter form-select">
                                                <option value="">Select</option>
                                                {chapters.map((chapter) => (
                                                    <option key={chapter.id} selected={modalData.chapterId === chapter.id} value={chapter.id}>
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
                                            <input id="title" name="title" className="form-control" type="text" value="" />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="live_type">
                                                    Live Platform <code>*</code>
                                                </label>
                                                <select name="live_type" id="live_type" className="form-select">
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
                                                <input id="start_time" name="start_time" className="form-control" type="datetime-local" />
                                            </div>
                                        </div>

                                        <div className="col-md-3">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="duration">
                                                    Duration <code>* (in minutes)</code>
                                                </label>
                                                <input id="duration" name="duration" className="form-control" type="text" value="" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 zoom-alert-box">
                                        <div className="alert alert-warning" role="alert">
                                            The meeting ID, password, and Zoom settings must be configured using the same Zoom account. The
                                            course creator needs to set up the <a href="#">Zoom live setting</a>.
                                        </div>
                                    </div>
                                    <div className="col-12 jitsi-alert-box d-none">
                                        <div className="alert alert-warning" role="alert">
                                            The meeting ID and Jitsi settings must be configured. The course creator needs to set up the{" "}
                                            <a href="#">Jitsi setting</a>.
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 meeting-id-box">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="meeting_id">
                                                    Meeting ID <code>*</code>
                                                </label>
                                                <input id="meeting_id" name="meeting_id" className="form-control" type="text" value="" />
                                            </div>
                                        </div>
                                        <div className="col-md-6 zoom-box">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="password">
                                                    Password <code>*</code>
                                                </label>
                                                <input id="password" name="password" className="form-control" type="text" value="" />
                                            </div>
                                        </div>
                                        <div className="col-md-12 zoom-box">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="join_url">Join URL</label>
                                                <input id="join_url" name="join_url" className="form-control" type="url" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="description">
                                                Description <code></code>
                                            </label>
                                            <textarea name="description" className="form-control"></textarea>
                                        </div>
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <div className="account__check-remember">
                                            <input
                                                id="student_mail_sent"
                                                type="checkbox"
                                                className="form-check-input"
                                                name="student_mail_sent"
                                            />
                                            <label htmlFor="student_mail_sent" className="form-check-label">
                                                Email to all students.
                                            </label>
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
            )}

            {/* Add Quiz Modal */}
            {activeModal === "addQuiz" && (
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-modal="true" role="dialog">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5">Add Quiz</h1>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="p-3">
                                <form className="add_lesson_form instructor__profile-form" onSubmit={handleSubmit}>
                                    <input type="hidden" name="course_id" value="" />
                                    <input type="hidden" name="chapter_id" value={modalData.chapterId} />
                                    <input type="hidden" name="type" value={modalData.type} />

                                    <div className="col-md-12">
                                        <div className="custom-frm-bx">
                                            <label htmlFor="chapter">
                                                Chapter <code>*</code>
                                            </label>
                                            <select name="chapter" id="chapter" className="chapter form-select">
                                                <option value="">Select</option>
                                                {chapters.map((chapter) => (
                                                    <option key={chapter.id} selected={modalData.chapterId === chapter.id} value={chapter.id}>
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
                                            <input id="title" name="title" type="text" className="form-control" value="" />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="time_limit">
                                                    Time Limit <code>(leave empty for unlimited)</code>
                                                </label>
                                                <input id="time_limit" name="time_limit" className="form-control" type="text" value="" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="attempts">
                                                    Attempts <code>(leave empty for unlimited)</code>
                                                </label>
                                                <input id="attempts" name="attempts" className="form-control" type="text" value="" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="total_mark">
                                                    Total mark <code>*</code>
                                                </label>
                                                <input id="total_mark" name="total_mark" className="form-control" type="text" value="" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="pass_mark">
                                                    Pass mark <code>*</code>
                                                </label>
                                                <input id="pass_mark" name="pass_mark" className="form-control" type="text" value="" />
                                            </div>
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
            )}

            {/* Add Quiz Question Modal */}
            {activeModal === "addQuizQuestion" && (
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-modal="true" role="dialog">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5">Add Quiz Question</h1>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="p-3">
                                <form className="add_lesson_form instructor__profile-form" onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-10">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="title">
                                                    Question Title <code>*</code>
                                                </label>
                                                <input id="title" name="title" className="form-control" type="text" value="" />
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="custom-frm-bx">
                                                <label htmlFor="title">
                                                    Grade <code>*</code>
                                                </label>
                                                <input id="title" name="grade" className="form-control" type="text" value="" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <button className="add-answer btn" type="button">
                                            Add Answer
                                        </button>
                                    </div>

                                    <div className="answer-container">
                                        <div className="card mt-3">
                                            <div className="card-body">
                                                <div className="col-md-12">
                                                    <div className="custom-frm-bx">
                                                        <div className="d-flex justify-content-between">
                                                            <label htmlFor="answer">
                                                                Answer Title <code>*</code>
                                                            </label>
                                                            <button className="remove-answer" type="button">
                                                                <i className="fas fa-trash-alt"></i>
                                                            </button>
                                                        </div>
                                                        <input className="answer form-control" name="answers[]" type="text" value="" required />
                                                    </div>
                                                    <div className="switcher d-flex">
                                                        <p className="me-3">Correct Answer</p>
                                                        <label htmlFor="toggle-0">
                                                            <input type="checkbox" className="correct" id="toggle-0" value="1" name="correct[]" />
                                                            <span>
                                                                <small></small>
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
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
            )}

            {/* Edit Chapter Modal */}
            {activeModal === "editChapter" && (
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-modal="true" role="dialog">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5">Chapter Title</h1>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="p-3">
                                <form className="instructor__profile-form" onSubmit={handleSubmit}>
                                    <div className="col-md-12">
                                        <div className="form-grp custom-frm-bx">
                                            <label htmlFor="title">
                                                Title <code>*</code>
                                            </label>
                                            <input
                                                id="title"
                                                name="title"
                                                className="form-control"
                                                type="text"
                                                value={chapters.find((chapter) => chapter.id === modalData.chapterId)?.title || ""}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <button type="submit" className="btn btn-primary">
                                            Update
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div>
    )
}

export default CourseContentv1
