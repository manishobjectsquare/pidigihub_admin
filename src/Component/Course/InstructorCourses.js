// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//     faBook,
//     faClock,
//     faUserGraduate,
//     faStar,
//     faEdit,
//     faTrashAlt
// } from '@fortawesome/free-solid-svg-icons';
// import courseIMg from "../../assets/images/course-img-01.png"
// import InsImg from "../../assets/images/instructor-img-04.png"
// const InstructorCourses = () => {
//     // Mock data for courses
//     const [courses, setCourses] = useState([
//         {
//             id: 1,
//             title: "Complete Web Development Bootcamp",
//             thumbnail: courseIMg,
//             is_approved: "approved",
//             duration: 2520, // in minutes
//             instructor: {
//                 name: "John Doe",
//                 image: InsImg
//             },
//             lectureCount: 42,
//             studentCount: 1250,
//             rating: 4.8
//         },
//         {
//             id: 2,
//             title: "Data Science and Machine Learning",
//             thumbnail: courseIMg,
//             is_approved: "pending",
//             duration: 1860, // in minutes
//             instructor: {
//                 name: "Sarah Johnson",
//                 image: InsImg
//             },
//             lectureCount: 36,
//             studentCount: 980,
//             rating: 4.7
//         },
//         {
//             id: 3,
//             title: "Mobile App Development with React Native",
//             thumbnail: courseIMg,
//             is_approved: "rejected",
//             duration: 1560, // in minutes
//             instructor: {
//                 name: "Michael Chen",
//                 image: InsImg
//             },
//             lectureCount: 28,
//             studentCount: 750,
//             rating: 4.5
//         }
//     ]);

//     // Helper function to convert minutes to hours and minutes format
//     const minutesToHours = (minutes) => {
//         const hours = Math.floor(minutes / 60);
//         const remainingMinutes = minutes % 60;
//         return `${hours}h ${remainingMinutes}m`;
//     };

//     // Helper function to get badge class based on approval status
//     const getBadgeClass = (status) => {
//         switch (status) {
//             case 'pending':
//                 return 'bg-warning';
//             case 'rejected':
//                 return 'bg-danger';
//             case 'approved':
//                 return 'bg-success';
//             default:
//                 return 'bg-secondary';
//         }
//     };

//     return (
//         <div className="col-lg-9">
//             <div className="d-flex justify-content-between align-items-center">
//                 <h4 className="title mb-0">All Courses</h4>
//                 <Link to="/instructor/courses/create" className="thm-btn mb-3">Add Course</Link>
//             </div>

//             <div className="panel-cards">
//                 <div className="row">
//                     {courses.length > 0 ? (
//                         courses.map(course => (
//                             <div key={course.id} className="col-md-6 col-lg-4 mb-4">
//                                 <div className="product-card">
//                                     <div className="product-img">
//                                         <img src={course.thumbnail || "/placeholder.svg"} className="card-img-top" alt="Course Image" />
//                                     </div>
//                                     <div className="product-content">
//                                         <h5>
//                                             <Link to={`/instructor/courses/edit/${course.id}`}>
//                                                 {course.title}
//                                             </Link>
//                                         </h5>
//                                         <p className={`badges ${getBadgeClass(course.is_approved)}`}>
//                                             {course.is_approved.charAt(0).toUpperCase() + course.is_approved.slice(1)}
//                                         </p>

//                                         <ul className="list-unstyled mt-2">
//                                             <li>
//                                                 <span>
//                                                     <FontAwesomeIcon icon={faBook} className="me-1" /> {course.lectureCount} Lectures
//                                                 </span>
//                                             </li>
//                                             <li>
//                                                 <span>
//                                                     <FontAwesomeIcon icon={faClock} className="me-1" /> {minutesToHours(course.duration)}
//                                                 </span>
//                                             </li>
//                                             <li>
//                                                 <span>
//                                                     <FontAwesomeIcon icon={faUserGraduate} className="me-1" /> {course.studentCount} Students
//                                                 </span>
//                                             </li>
//                                         </ul>

//                                         <div className="course-usr-new">
//                                             <div>
//                                                 <img src={course.instructor.image || "/placeholder.svg"} alt="Instructor" />
//                                                 <span>{course.instructor.name}</span>
//                                             </div>
//                                             <span className="text-warning">
//                                                 <FontAwesomeIcon icon={faStar} /> {course.rating.toFixed(1)}
//                                             </span>
//                                         </div>
//                                     </div>
//                                     <div className="card-footer d-flex justify-content-between">
//                                         <Link to={`/instructor/courses/edit/${course.id}`} className="thm-btn">
//                                             <FontAwesomeIcon icon={faEdit} /> Edit
//                                         </Link>
//                                         <Link to={`/instructor/courses/delete-request/${course.id}`} className="thm-btn danger">
//                                             <FontAwesomeIcon icon={faTrashAlt} /> Delete
//                                         </Link>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <div className="col-12">
//                             <div className="text-center">
//                                 <h6 className="text-muted">No Course Found</h6>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {courses.length > 0 && (
//                     <div className="mt-3">
//                         {/* Pagination component would go here */}
//                         <nav aria-label="Page navigation">
//                             <ul className="pagination justify-content-center">
//                                 <li className="page-item disabled">
//                                     <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">Previous</a>
//                                 </li>
//                                 <li className="page-item active"><a className="page-link" href="#">1</a></li>
//                                 <li className="page-item"><a className="page-link" href="#">2</a></li>
//                                 <li className="page-item"><a className="page-link" href="#">3</a></li>
//                                 <li className="page-item">
//                                     <a className="page-link" href="#">Next</a>
//                                 </li>
//                             </ul>
//                         </nav>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default InstructorCourses;



import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBook,
    faClock,
    faUserGraduate,
    faStar,
    faEdit,
    faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import courseIMg from "../../assets/images/course-img-01.png"
import InsImg from "../../assets/images/instructor-img-04.png"

const InstructorCourses = () => {
    const { t } = useTranslation();

    // Mock data for courses
    const [courses, setCourses] = useState([
        {
            id: 1,
            title: "Complete Web Development Bootcamp",
            thumbnail: courseIMg,
            is_approved: "approved",
            duration: 2520, // in minutes
            instructor: {
                name: "John Doe",
                image: InsImg
            },
            lectureCount: 42,
            studentCount: 1250,
            rating: 4.8
        },
        {
            id: 2,
            title: "Data Science and Machine Learning",
            thumbnail: courseIMg,
            is_approved: "pending",
            duration: 1860, // in minutes
            instructor: {
                name: "Sarah Johnson",
                image: InsImg
            },
            lectureCount: 36,
            studentCount: 980,
            rating: 4.7
        },
        {
            id: 3,
            title: "Mobile App Development with React Native",
            thumbnail: courseIMg,
            is_approved: "rejected",
            duration: 1560, // in minutes
            instructor: {
                name: "Michael Chen",
                image: InsImg
            },
            lectureCount: 28,
            studentCount: 750,
            rating: 4.5
        }
    ]);

    // Helper function to convert minutes to hours and minutes format
    const minutesToHours = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}${t('h')} ${remainingMinutes}${t('m')}`;
    };

    // Helper function to get badge class based on approval status
    const getBadgeClass = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-warning';
            case 'rejected':
                return 'bg-danger';
            case 'approved':
                return 'bg-success';
            default:
                return 'bg-secondary';
        }
    };

    // Helper function to translate approval status
    const getStatusTranslation = (status) => {
        return t(status.charAt(0).toUpperCase() + status.slice(1));
    };

    return (
        <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center">
                <h4 className="title mb-0">{t('All Courses')}</h4>
                <Link to="/instructor/courses/create" className="thm-btn mb-3">{t('Add Course')}</Link>
            </div>

            <div className="panel-cards">
                <div className="row">
                    {courses.length > 0 ? (
                        courses.map(course => (
                            <div key={course.id} className="col-md-6 col-lg-4 mb-4">
                                <div className="product-card">
                                    <div className="product-img">
                                        <img
                                            src={course.thumbnail || "/placeholder.svg"}
                                            className="card-img-top"
                                            alt={t('Course Image')}
                                        />
                                    </div>
                                    <div className="product-content">
                                        <h5>
                                            <Link to={`/instructor/courses/edit/${course.id}`}>
                                                {course.title}
                                            </Link>
                                        </h5>
                                        <p className={`badges ${getBadgeClass(course.is_approved)}`}>
                                            {getStatusTranslation(course.is_approved)}
                                        </p>

                                        <ul className="list-unstyled mt-2">
                                            <li>
                                                <span>
                                                    <FontAwesomeIcon icon={faBook} className="me-1" />
                                                    {t('{{count}} Lectures', { count: course.lectureCount })}
                                                </span>
                                            </li>
                                            <li>
                                                <span>
                                                    <FontAwesomeIcon icon={faClock} className="me-1" />
                                                    {minutesToHours(course.duration)}
                                                </span>
                                            </li>
                                            <li>
                                                <span>
                                                    <FontAwesomeIcon icon={faUserGraduate} className="me-1" />
                                                    {t('{{count}} Students', { count: course.studentCount })}
                                                </span>
                                            </li>
                                        </ul>

                                        <div className="course-usr-new">
                                            <div>
                                                <img
                                                    src={course.instructor.image || "/placeholder.svg"}
                                                    alt={t('Instructor')}
                                                />
                                                <span>{course.instructor.name}</span>
                                            </div>
                                            <span className="text-warning">
                                                <FontAwesomeIcon icon={faStar} /> {course.rating.toFixed(1)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="card-footer d-flex justify-content-between">
                                        <Link
                                            to={`/instructor/courses/edit/${course.id}`}
                                            className="thm-btn"
                                            aria-label={t('Edit course')}
                                        >
                                            <FontAwesomeIcon icon={faEdit} /> {t('Edit')}
                                        </Link>
                                        <Link
                                            to={`/instructor/courses/delete-request/${course.id}`}
                                            className="thm-btn danger"
                                            aria-label={t('Delete course')}
                                        >
                                            <FontAwesomeIcon icon={faTrashAlt} /> {t('Delete')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12">
                            <div className="text-center">
                                <h6 className="text-muted">{t('No Course Found')}</h6>
                            </div>
                        </div>
                    )}
                </div>

                {courses.length > 0 && (
                    <div className="mt-3">
                        {/* Pagination component would go here */}
                        <nav aria-label={t('Page navigation')}>
                            <ul className="pagination justify-content-center">
                                <li className="page-item disabled">
                                    <a
                                        className="page-link"
                                        href="#"
                                        tabIndex="-1"
                                        aria-disabled="true"
                                    >
                                        {t('Previous')}
                                    </a>
                                </li>
                                <li className="page-item active">
                                    <a className="page-link" href="#">1</a>
                                </li>
                                <li className="page-item">
                                    <a className="page-link" href="#">2</a>
                                </li>
                                <li className="page-item">
                                    <a className="page-link" href="#">3</a>
                                </li>
                                <li className="page-item">
                                    <a className="page-link" href="#">{t('Next')}</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructorCourses;