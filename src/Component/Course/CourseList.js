// import { useState, useEffect, useContext, useRef } from "react";
// import { Link } from "react-router-dom";
// import Pagination from "../Pagination/Pagination";
// import moment from "moment";
// import axios from "axios";
// import { baseUrl } from "../../config/baseUrl";
// import Swal from "sweetalert2";
// import toastify from "../../config/toastify";
// import loaderContext from "../../context/LoaderContext";
// import { Button, Modal } from "react-bootstrap";

// export default function CourseList() {
//   const [pageNumber, setPageNumber] = useState(1);
//   const [totalPages, setTotalPages] = useState(3);
//   const [SequenceChange, setIsSequenceChange] = useState(false);

//   const [paginationDetails, setPaginationDetails] = useState({
//     currentPage: 1,
//     totalPages: 3,
//     totalRecords: 25,
//   });
//   const fileInputRef = useRef(null);
//   let { setLoader } = useContext(loaderContext);

//   const [testPackage, setTestPackage] = useState([]);

//   useEffect(() => {
//     fetchLiveData();
//   }, []);

//   const fetchLiveData = async () => {
//     setLoader(true);
//     try {
//       const response = await axios.get(
//         `${baseUrl}/api/v1/admin/course/course-list`,
//         {
//           headers: {
//             Authorization: localStorage.getItem("token"),
//           },
//         }
//       );
//       // console.log(response.data.data?.length);
//       setTestPackage(response.data.data);
//     } catch (error) {
//       console.log("error", error);
//     } finally {
//       setLoader(false);
//     }
//   };

//   let bulkAddApi = async (file, course) => {
//     try {
//       let response = await axios({
//         method: "POST",
//         // url: `${baseUrl}/api/v1/admin/order/bulk-upload`,
//         url: `${baseUrl}/api/v1/admin/purchase-history/bulk-add/${course}`,
//         data: file,
//         headers: {
//           Authorization: localStorage.getItem("token"),
//         },
//       });

//       if (response.data.status) {
//         fetchLiveData();
//         Swal.fire({
//           title: "data uploaded!",
//           icon: "success",
//           draggable: true,
//         });
//       } else {
//         toastify.error("");
//       }
//     } catch (error) {
//       console.error("API call failed:", error);
//     }
//   };

//   const handleUploadFile = (e, id) => {
//     let file = e.target.files[0];
//     let postData = new FormData();
//     postData.append("excel", file);
//     e.target.value = "";

//     bulkAddApi(postData, id);
//   };


//   const handleStatus = async (id, getstatus) => {

//     try {
//       await axios(
//         `${baseUrl}/api/v1/admin/course-category/category-status/${id}`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: localStorage.getItem("token"),
//           },
//         }
//       );
//       fetchLiveData();
//       Swal.fire({
//         title: "Status Changed!",
//         icon: "success",
//         draggable: true,
//       });
//     } catch (error) { }
//   };

//   const handleApproveDetails = async (id, data) => {
//     setLoader(true);
//     try {
//       await axios(`${baseUrl}/api/v1/admin/course/course-update/${id}`, {
//         data: { is_approved: data },
//         method: "POST",
//         headers: {
//           Authorization: localStorage.getItem("token"),
//         },
//       });
//       fetchLiveData();
//       Swal.fire({
//         title: "Status Changed!",
//         icon: "success",
//         draggable: true,
//       });
//     } catch (error) { }
//   };

//   const itemsPerPage = 100;
//   const startIndex = (pageNumber - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const displayedPackages = testPackage.slice(startIndex, endIndex);

//   const handleDelete = (id) => {
//     let apiCall = async () => {
//       let res = await fetch(
//         `${baseUrl}/api/v1/admin/course/course-delete/${id}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: localStorage.getItem("token"),
//           },
//         }
//       );
//       const result = await res.json();
//       if (result.status) {
//         fetchLiveData();
//       }
//     };
//     Swal.fire({
//       title: "Are you sure?",
//       text: "This action will permanently delete the chapter, along with all lessons and quizzes. You won't be able to undo this.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         apiCall();
//         Swal.fire({
//           title: "Deleted!",
//           text: "Your file has been deleted.",
//           icon: "success",
//         });
//       }
//     });
//   };
//   const [show, setShow] = useState(false);

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);
//   return (
//     <>
//       <section className="main-sec">
//         <div className="row">
//           <div className="col-lg-6">
//             <div className="dashboard-title">
//               <h4 className="dash-head">
//                 <i className="fa fa-chart-bar me-2" />
//                 Courses
//               </h4>
//             </div>
//             <div className="custom-bredcump">
//               <nav aria-label="breadcrumb">
//                 <ol className="breadcrumb">
//                   <li className="breadcrumb-item">
//                     <Link to="/">Dashboard</Link>
//                   </li>
//                   <li className="breadcrumb-item active" aria-current="page">
//                     Courses
//                   </li>
//                 </ol>
//               </nav>
//             </div>
//           </div>
//           <div className="col-lg-6 text-end">
//             <Link
//               to={`${baseUrl}/bulk_upload_sample_courses.xlsx`}
//               download
//               className="btn btn-info text-white me-3"
//             >
//               <i className="fa fa-arrow-down me-1"></i>
//               Download Format
//             </Link>

//             <Link
//               to="/courses/add"
//               className="btn py-2 px-5 text-white btn-for-add"
//             >
//               <i className="fa fa-plus me-2"></i>
//               Add Course
//             </Link>
//           </div>

//           <div className="col-lg-12">
//             <div className="cards bus-list">
//               <div className="bus-filter">
//                 <div className="row ">
//                   <div className="col-lg-6">
//                     <h5 className="card-title">Course List</h5>
//                   </div>
//                 </div>
//               </div>
//               <div className="table table-responsive custom-table">
//                 <table className="table table-borderless">
//                   <thead>
//                     <tr>
//                       <th>Sr. no.</th>
//                       <th>Title</th>
//                       <th>Instructor</th>
//                       <th>Price</th>
//                       <th>Created Date</th>
//                       <th>Update Date</th>
//                       <th>Status</th>
//                       <th>Approve</th>
//                       <th>Assign</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {displayedPackages.map((arr, i) => {
//                       return (
//                         <tr key={arr?._id}>
//                           <td>{startIndex + i + 1}</td>
//                           <td>
//                             <span>{arr?.title}</span>
//                           </td>
//                           <td>{arr?.instructorDetails?.name}</td>
//                           <td>
//                             <span>{arr?.price}</span>
//                           </td>

//                           <td>
//                             <span>{moment(arr?.createdAt).format("LLL")}</span>
//                           </td>
//                           <td>
//                             <span>{moment(arr?.updatedAt).format("LLL")}</span>
//                           </td>
//                           <td>
//                             <button
//                               // onClick={() =>
//                               //   handleStatus(arr?._id, arr?.status)
//                               // }

//                               className={
//                                 arr?.status === "active"
//                                   ? "btn btn-pill btn btn-primary btn-sm"
//                                   : arr?.status === "is_draft"
//                                     ? "btn btn-pill btn btn-warning  btn-sm"
//                                     : "btn btn-pill btn btn-danger btn-sm"
//                               }
//                             >
//                               <span>{arr?.status}</span>
//                             </button>
//                           </td>
//                           <td className="course-table-approve">
//                             <select
//                               name="is_approved"
//                               value={arr?.is_approved}
//                               onChange={(e) =>
//                                 handleApproveDetails(arr?._id, e.target.value)
//                               }
//                               className="form-control course-change-status"
//                               data-id="82"
//                               fdprocessedid="xk72d"
//                             >
//                               <option value="pending">Pending</option>
//                               <option value="approved">Approved</option>
//                               <option value="rejected">Rejected</option>
//                             </select>
//                           </td>
//                           <td>
//                             <label
//                               htmlFor={`fileUpload-${arr._id}`}
//                               className="btn btn-info text-white"
//                               variant="primary" onClick={handleShow}
//                             >
//                               Assign
//                             </label >
//                             <input
//                               type="file"
//                               id={`fileUpload-${arr._id}`}
//                               onChange={(e) => {
//                                 console.log(arr?._id);

//                                 handleUploadFile(e, arr?._id);
//                               }}
//                               className="d-none"
//                             />
//                           </td>
//                           <td>
//                             <div className="action-buttons">
//                               <Link
//                                 className="action-btn edit-btn"
//                                 to={`/courses/add/${arr?._id}`}
//                               >
//                                 <i className="fa fa-edit" />
//                               </Link>
//                               {/* <Link
//                                 to={`/view/${arr?._id}`}
//                                 className="action-btn edit-btn bg-warning"
//                               >
//                                 <i className="fa fa-eye"></i>
//                                 <span className="tooltip-text">View</span>
//                               </Link> */}
//                               <Link
//                                 onClick={() => handleDelete(arr?._id)}
//                                 className="action-btn edit-btn bg-danger"
//                               >
//                                 <i className="fa fa-trash"></i>
//                                 <span className="tooltip-text">delete</span>
//                               </Link>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//                 {/* {totalPages > 1 && (
//                   <Pagination
//                     pageNumber={pageNumber}
//                     setPageNumber={setPageNumber}
//                     pageLimit={testPackage.length}
//                     paginationDetails={paginationDetails}
//                     totalPages={totalPages}
//                   />
//                 )} */}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <Modal show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Modal heading</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleClose}>
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// }


"use client"

import { useState, useEffect, useContext, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import moment from "moment"
import axios from "axios"
import { baseUrl } from "../../config/baseUrl"
import Swal from "sweetalert2"
import toastify from "../../config/toastify"
import loaderContext from "../../context/LoaderContext"
import { Button, Modal } from "react-bootstrap"

export default function CourseList() {
  const [pageNumber, setPageNumber] = useState(1)
  const [totalPages, setTotalPages] = useState(3)
  const [SequenceChange, setIsSequenceChange] = useState(false)

  const [paginationDetails, setPaginationDetails] = useState({
    currentPage: 1,
    totalPages: 3,
    totalRecords: 25,
  })

  const fileInputRef = useRef(null)
  const { setLoader } = useContext(loaderContext)

  const [testPackage, setTestPackage] = useState([])
  const [show, setShow] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState(null)
  const [assignType, setAssignType] = useState(null) // 'bulk' or 'single'
  const [singleAssignInput, setSingleAssignInput] = useState("")

  useEffect(() => {
    fetchLiveData()
  }, [])

  const fetchLiveData = async () => {
    setLoader(true)
    try {
      const response = await axios.get(`${baseUrl}/api/v1/admin/course/course-list`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      setTestPackage(response.data.data)
    } catch (error) {
      console.log("error", error)
    } finally {
      setLoader(false)
    }
  }

  const bulkAddApi = async (file, course) => {
    try {
      const response = await axios({
        method: "POST",
        url: `${baseUrl}/api/v1/admin/purchase-history/bulk-add/${course}`,
        data: file,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })


      if (response.data.status) {
        fetchLiveData()
        Swal.fire({
          title: "Data uploaded!",
          icon: "success",
          draggable: true,
        })
      } else {
        toastify.error("")
      }
    } catch (error) {
      console.error("API call failed:", error)
    }
  }


  // Single assign API call
  const singleAssignApi = async (courseId, inputValue) => {
    try {
      const response = await axios({
        method: "POST",
        url: `${baseUrl}/course_assign`,
        data: { course_Id: courseId, email_Id: inputValue },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      if (response.data.status) {
        fetchLiveData()
        Swal.fire({
          title: "Successfully assigned!",
          icon: "success",
          draggable: true,
        })
      } else {
        toastify.error(response.data.message)
      }
    } catch (error) {
      console.error("Single assign API call failed:", error)
      toastify.error(error)
    }
  }

  const handleUploadFile = (e, id) => {
    const file = e.target.files[0]
    const postData = new FormData()
    postData.append("excel", file)
    e.target.value = ""

    bulkAddApi(postData, id)
  }

  const handleStatus = async (id, getstatus) => {
    try {
      await axios(`${baseUrl}/api/v1/admin/course-category/category-status/${id}`, {
        method: "PUT",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      fetchLiveData()
      Swal.fire({
        title: "Status Changed!",
        icon: "success",
        draggable: true,
      })
    } catch (error) { }
  }

  const handleApproveDetails = async (id, data) => {
    setLoader(true)
    try {
      await axios(`${baseUrl}/api/v1/admin/course/course-update/${id}`, {
        data: { is_approved: data },
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      fetchLiveData()
      Swal.fire({
        title: "Status Changed!",
        icon: "success",
        draggable: true,
      })
    } catch (error) { }
  }

  const itemsPerPage = 100
  const startIndex = (pageNumber - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayedPackages = testPackage.slice(startIndex, endIndex)

  const handleDelete = (id) => {
    const apiCall = async () => {
      const res = await fetch(`${baseUrl}/api/v1/admin/course/course-delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      const result = await res.json()
      if (result.status) {
        fetchLiveData()
      }
    }
    Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the chapter, along with all lessons and quizzes. You won't be able to undo this.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        apiCall()
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        })
      }
    })
  }

  // Modal handlers
  const handleClose = () => {
    setShow(false)
    setSelectedCourseId(null)
    setAssignType(null)
    setSingleAssignInput("")
  }

  const handleShow = (courseId) => {
    setSelectedCourseId(courseId)
    setShow(true)
  }

  const handleAssignTypeSelect = (type) => {
    setAssignType(type)
  }

  const handleBulkUpload = () => {
    // Trigger file input
    const fileInput = document.getElementById(`fileUpload-${selectedCourseId}`)
    if (fileInput) {
      fileInput.click()
    }
    handleClose()
  }

  const handleSingleAssignSubmit = () => {
    if (!singleAssignInput.trim()) {
      toastify.error("Please enter a value")
      return
    }

    singleAssignApi(selectedCourseId, singleAssignInput)
    handleClose()
  }
  const navigate = useNavigate()
  const handleCountClick = (courseId) => {
    navigate(`/purchase-history`, {
      state: { courseId: courseId },
    })
  }
  return (
    <>
      <section className="main-sec">
        <div className="row">
          <div className="col-lg-6">
            <div className="dashboard-title">
              <h4 className="dash-head">
                <i className="fa fa-chart-bar me-2" />
                Courses
              </h4>
            </div>
            <div className="custom-bredcump">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Courses
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="col-lg-6 text-end">
            <Link to={`${baseUrl}/bulk_upload_sample_courses.xlsx`} download className="btn btn-info text-white me-3">
              <i className="fa fa-arrow-down me-1"></i>
              Download Format
            </Link>

            <Link to="/courses/add" className="btn py-2 px-5 text-white btn-for-add">
              <i className="fa fa-plus me-2"></i>
              Add Course
            </Link>
          </div>

          <div className="col-lg-12">
            <div className="cards bus-list">
              <div className="bus-filter">
                <div className="row ">
                  <div className="col-lg-6">
                    <h5 className="card-title">Course List</h5>
                  </div>
                </div>
              </div>
              <div className="table table-responsive custom-table">
                <table className="table table-borderless">
                  <thead>
                    <tr>
                      <th>Sr. no.</th>
                      <th>Title</th>
                      <th>Instructor</th>
                      <th>Price</th>
                      <th>Created Date / Update Date</th>
                      <th>Purchased</th>
                      <th>Status</th>
                      <th>Approve</th>
                      <th>Assign</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedPackages.map((arr, i) => {
                      return (
                        <tr key={arr?._id}>
                          <td>{startIndex + i + 1}</td>
                          <td>
                            <span>{arr?.title}</span>
                          </td>
                          <td>{arr?.instructorDetails?.name}</td>
                          <td>
                            <span>{arr?.price}</span>
                          </td>

                          <td>
                            <span>{moment(arr?.createdAt).format("LLL")}</span><br /><span>{moment(arr?.updatedAt).format("LLL")}</span>
                          </td>
                          <td>
                            <span onClick={() => handleCountClick(arr?._id)} className="btn btn-pill btn btn-primary btn-sm">
                              {arr?.purchasedCount || 0} Students
                            </span>
                          </td>
                          <td>
                            <button
                              className={
                                arr?.status === "active"
                                  ? "btn btn-pill btn btn-primary btn-sm"
                                  : arr?.status === "is_draft"
                                    ? "btn btn-pill btn btn-warning  btn-sm"
                                    : "btn btn-pill btn btn-danger btn-sm"
                              }
                            >
                              <span>{arr?.status}</span>
                            </button>
                          </td>
                          <td className="course-table-approve">
                            <select
                              name="is_approved"
                              value={arr?.is_approved}
                              onChange={(e) => handleApproveDetails(arr?._id, e.target.value)}
                              className="form-control course-change-status"
                              data-id="82"
                              fdprocessedid="xk72d"
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                          <td>
                            <button className="btn btn-info text-white" onClick={() => handleShow(arr?._id)}>
                              Assign
                            </button>
                            <input
                              type="file"
                              id={`fileUpload-${arr._id}`}
                              onChange={(e) => {
                                handleUploadFile(e, arr?._id)
                              }}
                              className="d-none"
                            />
                          </td>
                          <td>
                            <div className="action-buttons">
                              <Link className="action-btn edit-btn" to={`/courses/add/${arr?._id}`}>
                                <i className="fa fa-edit" />
                              </Link>
                              <Link onClick={() => handleDelete(arr?._id)} className="action-btn edit-btn bg-danger">
                                <i className="fa fa-trash"></i>
                                <span className="tooltip-text">delete</span>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assign Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fa fa-user-plus me-2"></i>
            Assign Course
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!assignType ? (
            <div className="assign-options">
              <h6 className="mb-3">Choose assignment method:</h6>
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary btn-lg bulk-upload-bttn" onClick={() => handleAssignTypeSelect("bulk")}>
                  <i className="fa fa-upload me-2"></i>
                  Bulk Upload
                  <small className="d-block text-muted mt-1">Upload Excel file with multiple assignments</small>
                </button>
                <button className="btn btn-outline-success btn-lg single-upload-bttn" onClick={() => handleAssignTypeSelect("single")}>
                  <i className="fa fa-user me-2"></i>
                  Single Assign
                  <small className="d-block text-muted mt-1">Assign to individual user</small>
                </button>
              </div>
            </div>
          ) : assignType === "bulk" ? (
            <div className="bulk-upload-section">
              <h6 className="mb-3">
                <i className="fa fa-upload me-2"></i>
                Bulk Upload
              </h6>
              <p className="text-muted mb-3">Click the button below to select an Excel file for bulk assignment.</p>
              <div className="text-center">
                <button className="btn btn-primary btn-lg" onClick={handleBulkUpload}>
                  <i className="fa fa-file-excel me-2"></i>
                  Select Excel File
                </button>
              </div>
            </div>
          ) : (
            <div className="single-assign-section">
              <h6 className="mb-3">
                <i className="fa fa-user me-2"></i>
                Single Assign
              </h6>
              <div className="mb-3">
                <label htmlFor="singleAssignInput" className="form-label">
                  Enter User ID or Email:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="singleAssignInput"
                  placeholder="Enter user ID or email address"
                  value={singleAssignInput}
                  onChange={(e) => setSingleAssignInput(e.target.value)}
                />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {assignType && (
            <Button variant="secondary" onClick={() => setAssignType(null)}>
              <i className="fa fa-arrow-left me-1"></i>
              Back
            </Button>
          )}
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          {assignType === "single" && (
            <Button variant="success" onClick={handleSingleAssignSubmit} disabled={!singleAssignInput.trim()}>
              <i className="fa fa-check me-1"></i>
              Assign Course
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  )
}
