import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/dashboard.css";
import "./assets/css/dashboard-responsive.css";
import "font-awesome/css/font-awesome.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/js/bootstrap.min.js";
import "./assets/css/role-permission.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./Layout";

import Protected from "./Protected";
import Dashboard from "./Component/Home/Dashboard";
import Login from "./Component/Login/Login";

import Students from "./Component/Users/Students";
import StudentAdd from "./Component/Users/StudentAdd";
import CourseList from "./Component/Course/CourseList";
import Videos from "./Component/Course/Videos";
import VideoAdd from "./Component/Course/VideoAdd";
import CourseCategory from "./Component/Category/CourseCategory";
import CourseCategoryAdd from "./Component/Category/CourseCategoryAdd";
import CourseCategoryEdit from "./Component/Category/CourseCategoryEdit";
import Reviews from "./Component/Reviews/Reviews";
import Instructors from "./Component/Users/Instructors/Instructors";
import InstructorRequest from "./Component/InstructorRequest/InstructorRequest";
import RequestView from "./Component/Users/Instructors/RequestView";
import OrderList from "./Component/Orders/OrderList";
import BlogList from "./Component/Blogs/BlogList";
import BlogAdd from "./Component/Blogs/BlogAdd";
import BlogCategory from "./Component/Blogs/BlogCategory";
import BlogEdit from "./Component/Blogs/BlogEdit";
import BlogCategoryAdd from "./Component/Blogs/BlogCategoryAdd";
import TestimonialList from "./Component/Testimonials/TestimonialList";
import TestimonialAdd from "./Component/Testimonials/TestimonialAdd";
import TestimonialEdit from "./Component/Testimonials/TestimonialEdit";
import MessagesList from "./Component/Contact/MessagesList";
import MessageView from "./Component/Contact/MessageView";
import SubCategoryList from "./Component/Category/SubactegoryList";
import SubcategoryAdd from "./Component/Category/SubcategoryAdd";
import CouponList from "./Pages/Coupons/CouponList.js";
import CouponAdd from "./Pages/Coupons/CouponAdd.js";
import ArshadStudentList from "./Component/Users/ArshadStudentList";

import Banner from "./Component/Banner/Banner";
import BannerAdd from "./Component/Banner/BannerAdd";
import BannerEdit from "./Component/Banner/BannerEdit";

import CourseForm from "./Component/Course/CourseForm";
import CourseMoreInfo from "./Component/Course/CourseMoreInfo";
import CourseContent from "./Component/Course/CourseContent";
import Finish from "./Component/Course/Finish";
import Settings from "./Component/Settings/Settings";
import CmsList from "./Component/Cms/CmsList";
import LocationList from "./Component/Career/LocationList";
import LocationAdd from "./Component/Career/LocationAdd";
import DepartmentList from "./Component/Career/DepartmentList";
import JobList from "./Component/Career/JobList";
import JobApplications from "./Component/Career/JobApplications";
import PurchaseHistory from "./Component/PurchaseHistory/PurchaseHistory";
import InvoicePrint from "./Component/Invoice/InvoicePrint";
import CouponEdit from "./Pages/Coupons/CouponEdit.js";
import AddQuestion from "./Question/AddQuestion";
import QuestionList from "./Question/QuestionList";
import TestSeriesList from "./Component/Test/TestseriesList";
import AddTestSeries from "./Component/Test/AddTestSeries";
import TestPackageList from "./Component/Test/TestPackageList";
import AddTestPackage from "./Component/Test/AddTestPackage";
import PageNotFound from "./Component/404/PageNotFound";
import NotificationList from "./Component/Notification/NotificationList";
import NotificationAdd from "./Component/Notification/NotificationAdd";
import ViewTestPackage from "./Component/Test/ViewTestPackage";
import EditTestPackage from "./Component/Test/EditTestPackage";
import NotificationEdit from "./Component/Notification/NotificationEdit";
import TestEdit from "./Component/Test/EditTest";
import AssignQuestionList from "./Question/AssignQuestionList";
import EditQuestion from "./Question/EditQuestion";

import CmsAdd from "./Component/Cms/CmsAdd.js";
import CmsEdit from "./Component/Cms/CmsEdit.js";
import QuestionFeedbackList from "./Question/QuestionFeedbackList.js";
import AllSubcategories from "./Component/Category/AllSubcategories.js";
import PackageTest from "./Component/Test/PackageTest.js";
import EditSubcategory from "./Component/Category/EditSubcategory.js";
import Organizations from "./Pages/Organization/Organizations.js";
import AddOrganization from "./Pages/Organization/AddOrganization.js";
import EditOrganization from "./Pages/Organization/EditOrganization.js";
import Sections from "./Pages/Section/Sections.js";
import Addsection from "./Pages/Section/Addsection.js";
import EditSection from "./Pages/Section/EditSection.js";
import SubTopic from "./Pages/SubTopic/SubTopic.js";
import AddSubTopic from "./Pages/SubTopic/AddSubTopic.js";
import EditSubTopic from "./Pages/SubTopic/EditSubTopic.js";
import Exams from "./Pages/Exam/Exams.js";
import AddExam from "./Pages/Exam/AddExam.js";
import EditExam from "./Pages/Exam/EditExam.js";
import SubjectList from "./Pages/Subject/SubjectList.js";
import AddSubject from "./Pages/Subject/AddSubject.js";
import EditSubject from "./Pages/Subject/EditSubject.js";
import TopicList from "./Pages/Topic/TopicList.js";
import AddTopic from "./Pages/Topic/AddTopic.js";
import EditTopic from "./Pages/Topic/EditTopic.js";
import ViewExam from "./Pages/Exam/ViewExam.js";
import Working from "./Component/404/Working.js";
import Library from "./Pages/Library/Library.js";
import AddLibrary from "./Pages/Library/AddLibrary.js";
import EditLibrary from "./Pages/Library/EditLibrary.js";
import ViewLibrary from "./Pages/Library/ViewLibrary.js";
import MentorList from "./Pages/Mentor/MentorList.js";
import AddMentor from "./Pages/Mentor/AddMentor.js";
import Ebook from "./Pages/Ebook/Ebook.js";
import ExamQuestions from "./Question/ExamQuestions.js";
import LibraryBookingList from "./Pages/Orders/LibraryBookingList.js";
import AddTenure from "./Pages/LibraryTenure/AddTenure.js";
import Tenure from "./Pages/LibraryTenure/Tenure.js";
import EditTenure from "./Pages/LibraryTenure/EditTenure.js";
import Packages from "./Pages/Packages/Packages.js";

import EditPackage from "./Pages/Packages/EditPackage.js";
import ViewPackage from "./Pages/Packages/ViewPackage.js";
import AddPackage from "./Pages/Packages/AddPackage.js";
import PackageExams from "./Pages/Packages/PackageExams.js";
import ExamsForAssign from "./Pages/Packages/ExamsForAssign.js";
import EbookAdd from "./Pages/Ebook/EbookAdd.js";
import EditEbook from "./Pages/Ebook/EditEbook.js";
import EditMentor from "./Pages/Mentor/EditMentor.js";
import ReferralList from "./Pages/Referral/ReferralList.js";
import ViewMentor from "./Pages/Mentor/ViewMentor.js";
import LanguageList from "./Pages/Language/LanguageList.js";
import AddLanguage from "./Pages/Language/AddLanguage.js";
import EditLanguage from "./Pages/Language/EditLanguage.js";
import PackagePurchaseList from "./Pages/Orders/PackagePurchaseList.js";
import EbookPurchaseList from "./Pages/Orders/EbookPurchaseList.js";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login />} />
          {/* <Route path="/forget-password" element={ <ForgetPassword/>} /> */}
          {/* <Route path="/reset-password" element={ <ResetPassword/>} /> */}

          <Route path="/" element={<Layout />}>
            <Route index element={<Protected Component={Dashboard} />} />
            <Route path="banner" element={<Protected Component={Banner} />} />
            <Route
              path="banner-add"
              element={<Protected Component={BannerAdd} />}
            />
            <Route
              path="banner-edit/:id"
              element={<Protected Component={BannerEdit} />}
            />
            <Route
              path="students"
              element={<Protected Component={Students} />}
            />
            <Route
              path="student-add"
              element={<Protected Component={StudentAdd} />}
            />
            <Route
              path="instructors"
              element={<Protected Component={Instructors} />}
            />
            <Route
              path="instructor-request"
              element={<Protected Component={InstructorRequest} />}
            />
            <Route
              path="instructor-request/view/:id"
              element={<Protected Component={RequestView} />}
            />

            <Route path="videos" element={<Protected Component={Videos} />} />

            <Route
              path="add-video"
              element={<Protected Component={VideoAdd} />}
            />

            <Route
              path="orders"
              element={<Protected Component={OrderList} />}
            />
            <Route path="blogs" element={<Protected Component={BlogList} />} />
            <Route
              path="blogs/add"
              element={<Protected Component={BlogAdd} />}
            />
            <Route
              path="blogs/edit/:id"
              element={<Protected Component={BlogEdit} />}
            />
            <Route
              path="blogs/category"
              element={<Protected Component={BlogCategory} />}
            />
            <Route
              path="blogs/category/add"
              element={<Protected Component={BlogCategoryAdd} />}
            />
            <Route
              path="testimonials"
              element={<Protected Component={TestimonialList} />}
            />
            <Route
              path="testimonials/add"
              element={<Protected Component={TestimonialAdd} />}
            />
            <Route
              path="testimonials/edit/:id"
              element={<Protected Component={TestimonialEdit} />}
            />

            <Route
              path="/settings"
              element={<Protected Component={Settings} />}
            />

            <Route path="cms" element={<Protected Component={CmsList} />} />
            <Route
              path="cms/edit/:id"
              element={<Protected Component={CmsEdit} />}
            />
            <Route path="cms/add" element={<Protected Component={CmsAdd} />} />
            <Route
              path="/locations"
              element={<Protected Component={LocationList} />}
            />
            <Route
              path="/location-add"
              element={<Protected Component={LocationAdd} />}
            />
            <Route
              path="/departments"
              element={<Protected Component={DepartmentList} />}
            />
            <Route path="/jobs" element={<Protected Component={JobList} />} />
            <Route
              path="/job-applications"
              element={<Protected Component={JobApplications} />}
            />
            <Route
              path="/ "
              element={<Protected Component={ArshadStudentList} />}
            />
            <Route
              path="courses"
              element={<Protected Component={CourseList} />}
            />
            <Route
              path="/courses/add"
              element={<Protected Component={CourseForm} />}
            />
            <Route
              path="/courses/add/:id"
              element={<Protected Component={CourseForm} />}
            />
            <Route
              path="/courses/add/:id/step=2"
              element={<Protected Component={CourseMoreInfo} />}
            />
            <Route
              path="/courses/add/:id/step=3"
              element={<Protected Component={CourseContent} />}
            />
            <Route
              path="/courses/add/:id/step=4"
              element={<Protected Component={Finish} />}
            />
            <Route
              path="/purchase-history"
              element={<Protected Component={PurchaseHistory} />}
            />

            {/* JOB SUCCESSS ROUTES NEW */}

            <Route
              path="/questions/feedbacks"
              element={<Protected Component={QuestionFeedbackList} />}
            />
            {/* TEST */}
            <Route
              path="/test-series"
              element={<Protected Component={TestSeriesList} />}
            />
            <Route
              path="/test-series/view/:id"
              element={<Protected Component={TestEdit} />}
            />
            <Route
              path="/test-series/create"
              element={<Protected Component={AddTestSeries} />}
            />
            <Route
              path="/test-series/edit/:id"
              element={<Protected Component={TestEdit} />}
            />
            <Route
              path="/test-packages"
              element={<Protected Component={TestPackageList} />}
            />
            <Route
              path="/test-packages/create"
              element={<Protected Component={AddTestPackage} />}
            />
            <Route
              path="/test-packages/view/:id"
              element={<Protected Component={ViewTestPackage} />}
            />
            <Route
              path="/test-packages/edit/:id"
              element={<Protected Component={EditTestPackage} />}
            />
            <Route
              path="/test-packages/test-list/:id"
              element={<Protected Component={PackageTest} />}
            />
            <Route
              path="categories"
              element={<Protected Component={CourseCategory} />}
            />
            <Route
              path="categories/add"
              element={<Protected Component={CourseCategoryAdd} />}
            />
            <Route
              path="categories/edit/:id"
              element={<Protected Component={CourseCategoryEdit} />}
            />
            <Route
              path="/categories/subcategories/:categoryID/create"
              element={<Protected Component={SubcategoryAdd} />}
            />
            <Route
              path="/categories/subcategories/:categoryId"
              element={<Protected Component={SubCategoryList} />}
            />
            <Route
              path="/categories/subcategories/:categoryId/edit/:id"
              element={<Protected Component={EditSubcategory} />}
            />
            <Route
              path="/categories/subcategories"
              element={<Protected Component={AllSubcategories} />}
            />
            <Route path="reviews" element={<Protected Component={Reviews} />} />

            <Route
              path="contact-messages"
              element={<Protected Component={MessagesList} />}
            />
            <Route
              path="contact-messages/view"
              element={<Protected Component={MessageView} />}
            />
            <Route
              path="notifications"
              element={<Protected Component={NotificationList} />}
            />
            <Route
              path="notifications/create"
              element={<Protected Component={NotificationAdd} />}
            />
            <Route
              path="notifications/edit/:id"
              element={<Protected Component={NotificationEdit} />}
            />

            <Route path="/invoice/:invoiceId" element={<InvoicePrint />} />

            <Route path="library" element={<Protected Component={Library} />} />
            <Route
              path="library/add"
              element={<Protected Component={AddLibrary} />}
            />
            <Route
              path="library/edit/:id"
              element={<Protected Component={EditLibrary} />}
            />
            <Route
              path="library/view/:id"
              element={<Protected Component={ViewLibrary} />}
            />
            <Route path="tenures" element={<Protected Component={Tenure} />} />
            <Route
              path="tenures/add"
              element={<Protected Component={AddTenure} />}
            />
            <Route
              path="tenures/edit/:id"
              element={<Protected Component={EditTenure} />}
            />
            {/* <Route
              path="library/view/:id"
              element={<Protected Component={ViewLibrary} />}
            /> */}
            <Route
              path="mentors"
              element={<Protected Component={MentorList} />}
            />
            <Route
              path="mentors/add"
              element={<Protected Component={AddMentor} />}
            />

            <Route
              path="mentors/edit/:id"
              element={<Protected Component={EditMentor} />}
            />
            <Route
              path="mentors/view/:id"
              element={<Protected Component={ViewMentor} />}
            />
            <Route path="ebook" element={<Protected Component={Ebook} />} />
            <Route
              path="ebook/create"
              element={<Protected Component={EbookAdd} />}
            />
            <Route
              path="ebook/edit/:id"
              element={<Protected Component={EditEbook} />}
            />
            <Route
              path="organizations"
              element={<Protected Component={Organizations} />}
            />
            <Route
              path="organizations/create"
              element={<Protected Component={AddOrganization} />}
            />
            <Route
              path="organizations/edit/:id"
              element={<Protected Component={EditOrganization} />}
            />
            <Route
              path="sections"
              element={<Protected Component={Sections} />}
            />
            <Route
              path="sections/create"
              element={<Protected Component={Addsection} />}
            />
            <Route
              path="sections/edit/:id"
              element={<Protected Component={EditSection} />}
            />
            <Route
              path="subjects"
              element={<Protected Component={SubjectList} />}
            />
            <Route
              path="subjects/add"
              element={<Protected Component={AddSubject} />}
            />
            <Route
              path="subjects/edit/:id"
              element={<Protected Component={EditSubject} />}
            />
            <Route
              path="topics"
              element={<Protected Component={TopicList} />}
            />
            <Route
              path="topics/add"
              element={<Protected Component={AddTopic} />}
            />
            <Route
              path="topics/edit/:id"
              element={<Protected Component={EditTopic} />}
            />
            <Route
              path="subtopics"
              element={<Protected Component={SubTopic} />}
            />
            <Route
              path="subtopics/add"
              element={<Protected Component={AddSubTopic} />}
            />
            <Route
              path="subtopics/edit/:id"
              element={<Protected Component={EditSubTopic} />}
            />
            <Route path="exams" element={<Protected Component={Exams} />} />
            <Route
              path="exams/create"
              element={<Protected Component={AddExam} />}
            />
            <Route
              path="exams/edit/:id"
              element={<Protected Component={EditExam} />}
            />
            <Route
              path="exams/view/:id"
              element={<Protected Component={ViewExam} />}
            />
            <Route
              path="exams/:id/questions"
              element={<Protected Component={ExamQuestions} />}
            />
            <Route
              path="packages"
              element={<Protected Component={Packages} />}
            />
            <Route
              path="packages/create"
              element={<Protected Component={AddPackage} />}
            />
            <Route
              path="packages/edit/:id"
              element={<Protected Component={EditPackage} />}
            />
            <Route
              path="packages/view/:id"
              element={<Protected Component={ViewPackage} />}
            />
            <Route
              path="packages/exams/:id"
              element={<Protected Component={PackageExams} />}
            />
            <Route
              path="packages/exams/:id/assign-exams"
              element={<Protected Component={ExamsForAssign} />}
            />
            <Route
              path="exams/:id/questions/assign"
              element={<Protected Component={AssignQuestionList} />}
            />
            <Route
              path="/questions/create"
              element={<Protected Component={AddQuestion} />}
            />
            <Route
              path="/questions/edit/:id"
              element={<Protected Component={EditQuestion} />}
            />
            <Route
              path="/questions"
              element={<Protected Component={QuestionList} />}
            />
            <Route
              path="test-series/questions/assign/:id"
              element={<Protected Component={AssignQuestionList} />}
            />

            <Route
              path="orders/library-bookings"
              element={<Protected Component={LibraryBookingList} />}
            />
            <Route
              path="orders/package-purchase"
              element={<Protected Component={PackagePurchaseList} />}
            />
            <Route
              path="orders/ebook-purchase"
              element={<Protected Component={EbookPurchaseList} />}
            />

            <Route
              path="/coupons"
              element={<Protected Component={CouponList} />}
            />
            <Route
              path="/coupons/add"
              element={<Protected Component={CouponAdd} />}
            />
            <Route
              path="/coupons/edit/:id"
              element={<Protected Component={CouponEdit} />}
            />
            <Route
              path="/languages"
              element={<Protected Component={LanguageList} />}
            />
            <Route
              path="/languages/add"
              element={<Protected Component={AddLanguage} />}
            />
            <Route
              path="/languages/edit/:id"
              element={<Protected Component={EditLanguage} />}
            />
            <Route
              path="/referrals"
              element={<Protected Component={ReferralList} />}
            />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;
