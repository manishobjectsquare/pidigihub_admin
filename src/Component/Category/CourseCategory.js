

// "use client"

// import { useState, useEffect } from "react"
// import { Link } from "react-router-dom"
// import axios from "axios"
// import { baseUrl } from "../../config/baseUrl"
// import Swal from "sweetalert2"
// import moment from "moment/moment"

// export default function CourseCatgory() {
//   const [category, setCategory] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetchCategories()
//   }, [])

//   const fetchCategories = async () => {
//     setLoading(true)
//     try {
//       const response = await axios.get(`${baseUrl}/category`, {
//         headers: {
//           Authorization: localStorage.getItem("token"),
//         },
//       })
//       setCategory(response.data.data)
//       setLoading(false)
//     } catch (error) {
//       console.log("error", error)
//       setLoading(false)
//     }
//   }

//   const handleStatus = async (id, currentStatus) => {
//     const newStatus = currentStatus === "active" ? "inactive" : "active"

//     try {
//       const response = await fetch(`${baseUrl}/category/status-update/${id}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: localStorage.getItem("token"),
//         },
//         body: JSON.stringify({ status: newStatus }),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to update status")
//       }

//       // Optional: handle response data if needed
//       const result = await response.json()

//       // Refresh category list
//       fetchCategories()

//       // Show success message
//       Swal.fire({
//         title: "Status Changed!",
//         icon: "success",
//         draggable: true,
//       })
//     } catch (error) {
//       console.error("Error updating status:", error)
//       Swal.fire({
//         title: "Error!",
//         text: "Failed to update status",
//         icon: "error",
//       })
//     }
//   }

//   const handleDelete = (id) => {
//     const apiCall = async () => {
//       const res = await fetch(`${baseUrl}/category/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: localStorage.getItem("token"),
//         },
//       })
//       const result = await res.json()
//       fetchCategories()
//     }
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         apiCall()
//         Swal.fire({
//           title: "Deleted!",
//           text: "Your file has been deleted.",
//           icon: "success",
//         })
//       }
//     })
//   }

//   return (
//     <>
//       <section className="main-sec">
//         <div className="row">
//           <div className="col-lg-6">
//             <div className="dashboard-title">
//               <h4 className="dash-head">
//                 <i className="fa fa-chart-bar me-2" />
//                 Category List
//               </h4>
//             </div>
//             <div className="custom-bredcump">
//               <nav aria-label="breadcrumb">
//                 <ol className="breadcrumb">
//                   <li className="breadcrumb-item">
//                     <Link to="/">Dashboard</Link>
//                   </li>
//                   <li className="breadcrumb-item active" aria-current="page">
//                     Categories
//                   </li>
//                 </ol>
//               </nav>
//             </div>
//           </div>
//           <div className="col-lg-6 text-end">
//             <Link to="add" className="btn py-2 px-5 text-white btn-for-add">
//               <i className="fa fa-plus me-2"></i>
//               Add Category
//             </Link>
//           </div>
//           <div className="col-lg-12">
//             <div className="cards bus-list">
//               <div className="bus-filter">
//                 <div className="row ">
//                   <div className="col-lg-6">
//                     <h5 className="card-title">Category List</h5>
//                   </div>
//                 </div>
//               </div>
//               {loading ? (
//                 <div className="text-center py-4">
//                   <div className="spinner-border text-primary" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                   </div>
//                   <p className="mt-2">Loading categories...</p>
//                 </div>
//               ) : (
//                 <div className="table table-responsive custom-table">
//                   <table className="table table-borderless">
//                     <thead>
//                       <tr>
//                         <th>SN</th>
//                         <th>Name</th>
//                         <th>Icon</th>
//                         <th>Date</th>
//                         <th>Status</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {category.map((cat, i) => {
//                         return (
//                           <tr key={cat?._id}>
//                             <td>{i + 1}</td>
//                             <td>
//                               <Link to={`subcategories/${cat._id}`} className="text capitalize">
//                                 {cat?.title}
//                               </Link>
//                             </td>
//                             <td>
//                               <img
//                                 src={`${baseUrl}/${cat?.image || "/jslogo.png"}`}
//                                 width={100}
//                                 className="p-2"
//                                 alt="category"
//                                 onError={(e) => {
//                                   e.target.onerror = null
//                                   e.target.src = "/jslogo.png"
//                                 }}
//                               />
//                             </td>
//                             <td>{moment(cat?.createdAt).format("lll")}</td>
//                             <td>
//                               <button
//                                 onClick={() => handleStatus(cat?._id, cat?.status)}
//                                 className={
//                                   cat.status === "active"
//                                     ? "btn btn-pill btn-primary btn-sm"
//                                     : "btn btn-pill btn-danger btn-sm"
//                                 }
//                               >
//                                 <span>{cat?.status === "active" ? "Active" : "InActive"}</span>
//                               </button>
//                             </td>
//                             <td>
//                               <div className="action-buttons">
//                                 <Link className="action-btn edit-btn" to={`edit/${cat?._id}`}>
//                                   <i className="fa fa-edit" />
//                                 </Link>
//                                 <Link
//                                   title="Sub Category"
//                                   className="action-btn edit-btn bg-primary"
//                                   to={`subcategories/${cat._id}`}
//                                 >
//                                   <i className="fa fa-list" />
//                                   <span className="tooltip-text">Sub Category</span>
//                                 </Link>
//                                 <Link onClick={() => handleDelete(cat?._id)} className="action-btn edit-btn bg-danger">
//                                   <i className="fa fa-trash"></i>
//                                 </Link>
//                               </div>
//                             </td>
//                           </tr>
//                         )
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   )
// }







"use client"

import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import { baseUrl } from "../../config/baseUrl"
import Swal from "sweetalert2"
import moment from "moment/moment"
import { toast } from "react-toastify"

export default function CourseCatgory() {
  const [category, setCategory] = useState([])
  const [loading, setLoading] = useState(true)
  const [sequenceLoading, setSequenceLoading] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${baseUrl}/category`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      // Sort categories by sequence if available, otherwise by creation date
      const sortedCategories = response.data.data.sort((a, b) => {
        if (a.sequence !== undefined && b.sequence !== undefined) {
          return a.sequence - b.sequence
        }
        return new Date(a.createdAt) - new Date(b.createdAt)
      })
      setCategory(sortedCategories)
      setLoading(false)
    } catch (error) {
      console.log("error", error)
      setLoading(false)
    }
  }

  const handleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      const response = await fetch(`${baseUrl}/category/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const result = await response.json();

      // ✅ Update local state
      setCategory((prev) =>
        prev.map((cat) =>
          cat._id === id ? { ...cat, status: newStatus } : cat
        )
      );

      toast.success("Status Changed Successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update status",
        icon: "error",
      });
    }
  };


  const handleDelete = (id) => {
    const apiCall = async () => {
      const res = await fetch(`${baseUrl}/category/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      const result = await res.json();

      // ✅ Remove from local state
      setCategory((prev) => prev.filter((cat) => cat._id !== id));
    };

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
        apiCall();
        toast.success("Category deleted successfully");
      }
    });
  };

  // const handleSequenceChange = async (categoryId, direction) => {
  //   setSequenceLoading(categoryId)

  //   try {
  //     const currentIndex = category.findIndex((cat) => cat._id === categoryId)

  //     if (
  //       (direction === "up" && currentIndex === 0) ||
  //       (direction === "down" && currentIndex === category.length - 1)
  //     ) {
  //       setSequenceLoading(null)
  //       return
  //     }

  //     const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
  //     const newCategories = ([...category][
  //       // Swap the categories
  //       (newCategories[currentIndex], newCategories[newIndex])
  //     ] = [newCategories[newIndex], newCategories[currentIndex]])

  //     // Update sequence numbers
  //     const updatedCategories = newCategories.map((cat, index) => ({
  //       ...cat,
  //       sequence: index + 1,
  //     }))

  //     // Optimistically update the UI
  //     setCategory(updatedCategories)

  //     // Call API to update sequence
  //     const response = await axios.post(
  //       `${baseUrl}/category/update-sequence`,
  //       {
  //         categories: updatedCategories.map((cat) => ({
  //           id: cat._id,
  //           sequence: cat.sequence,
  //         })),
  //       },
  //       {
  //         headers: {
  //           Authorization: localStorage.getItem("token"),
  //           "Content-Type": "application/json",
  //         },
  //       },
  //     )

  //     if (!response.data.status) {
  //       throw new Error("Failed to update sequence")
  //     }

  //     Swal.fire({
  //       title: "Sequence Updated!",
  //       icon: "success",
  //       timer: 1500,
  //       showConfirmButton: false,
  //     })
  //   } catch (error) {
  //     console.error("Error updating sequence:", error)
  //     // Revert the optimistic update on error
  //     fetchCategories()
  //     Swal.fire({
  //       title: "Error!",
  //       text: "Failed to update sequence",
  //       icon: "error",
  //     })
  //   } finally {
  //     setSequenceLoading(null)
  //   }
  // }
  const { id } = useParams()
  const handleSequenceChange = async (id, direction) => {
    setSequenceLoading(id)

    try {
      const currentIndex = category.findIndex((cat) => cat._id === id)

      if (
        (direction === "up" && currentIndex === 0) ||
        (direction === "down" && currentIndex === category.length - 1)
      ) {
        setSequenceLoading(null)
        return
      }

      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

      const newCategories = [...category]

      // Swap the categories locally
      const temp = newCategories[currentIndex]
      newCategories[currentIndex] = newCategories[newIndex]
      newCategories[newIndex] = temp

      // Recalculate and update sequence numbers
      const updatedCategories = newCategories.map((cat, index) => ({
        ...cat,
        sequence: index + 1,
      }))

      setCategory(updatedCategories) // Optimistic UI update

      // Send only the moved category to API
      const movedCategory = updatedCategories.find((cat) => cat._id === id)

      const response = await axios.patch(
        `${baseUrl}/category/sequence-status/${id}`,
        { sequence: movedCategory.sequence },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.data.status) {
        throw new Error("Failed to update sequence")
      }

      toast.success("Sequence updated successfully")
    } catch (error) {
      console.error("Error updating sequence:", error)
      fetchCategories() // Rollback on failure
      Swal.fire({
        title: "Error!",
        text: "Failed to update sequence",
        icon: "error",
      })
    } finally {
      setSequenceLoading(null)
    }
  }

  return (
    <>
      <section className="main-sec">
        <div className="row">
          <div className="col-lg-6">
            <div className="dashboard-title">
              <h4 className="dash-head">
                <i className="fa fa-chart-bar me-2" />
                Category List
              </h4>
            </div>
            <div className="custom-bredcump">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Categories
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="col-lg-6 text-end">
            <Link to="add" className="btn py-2 px-5 text-white btn-for-add">
              <i className="fa fa-plus me-2"></i>
              Add Category
            </Link>
          </div>
          <div className="col-lg-12">
            <div className="cards bus-list">
              <div className="bus-filter">
                <div className="row ">
                  <div className="col-lg-6">
                    <h5 className="card-title">Category List</h5>
                  </div>
                  <div className="col-lg-6 text-end">
                    <small className="text-muted">
                      <i className="fa fa-info-circle me-1"></i>
                      Use arrows to reorder categories
                    </small>
                  </div>
                </div>
              </div>
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading categories...</p>
                </div>
              ) : (
                <div className="table table-responsive custom-table">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>SN</th>
                        <th>Sequence</th>
                        <th>Name</th>
                        <th>Icon</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.map((cat, i) => {
                        return (
                          <tr key={cat?._id}>
                            <td>{i + 1}</td>
                            <td>
                              <div className="sequence-controls">
                                <button
                                  className={`sequence-btn ${i === 0 ? "disabled" : ""}`}
                                  onClick={() => handleSequenceChange(cat._id, "up")}
                                  disabled={i === 0 || sequenceLoading === cat._id}
                                  title="Move Up"
                                >
                                  {sequenceLoading === cat._id ? (
                                    <div className="mini-spinner"></div>
                                  ) : (
                                    <i className="fa fa-arrow-up"></i>
                                  )}
                                </button>
                                <span className="sequence-number">{cat?.sequence || i + 1}</span>
                                <button
                                  className={`sequence-btn ${i === category.length - 1 ? "disabled" : ""}`}
                                  onClick={() => handleSequenceChange(cat._id, "down")}
                                  disabled={i === category.length - 1 || sequenceLoading === cat._id}
                                  title="Move Down"
                                >
                                  {sequenceLoading === cat._id ? (
                                    <div className="mini-spinner"></div>
                                  ) : (
                                    <i className="fa fa-arrow-down"></i>
                                  )}
                                </button>
                              </div>
                            </td>
                            <td>
                              <Link to={`subcategories/${cat._id}`} className="text capitalize">
                                {cat?.title}
                              </Link>
                            </td>
                            <td>
                              <img
                                src={`${baseUrl}/${cat?.image || "/jslogo.png"}`}
                                width={100}
                                className="p-2"
                                alt="category"
                                onError={(e) => {
                                  e.target.onerror = null
                                  e.target.src = "/jslogo.png"
                                }}
                              />
                            </td>
                            <td>{moment(cat?.createdAt).format("lll")}</td>
                            <td>
                              <button
                                onClick={() => handleStatus(cat?._id, cat?.status)}
                                className={
                                  cat.status === "active"
                                    ? "btn btn-pill btn-primary btn-sm"
                                    : "btn btn-pill btn-danger btn-sm"
                                }
                              >
                                <span>{cat?.status === "active" ? "Active" : "InActive"}</span>
                              </button>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <Link className="action-btn edit-btn" to={`edit/${cat?._id}`}>
                                  <i className="fa fa-edit" />
                                </Link>
                                <Link
                                  title="Sub Category"
                                  className="action-btn edit-btn bg-primary"
                                  to={`subcategories/${cat._id}`}
                                >
                                  <i className="fa fa-list" />
                                  <span className="tooltip-text">Sub Category</span>
                                </Link>
                                <Link onClick={() => handleDelete(cat?._id)} className="action-btn edit-btn bg-danger">
                                  <i className="fa fa-trash"></i>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .sequence-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
        }

        .sequence-btn {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 12px;
        }

        .sequence-btn:hover:not(.disabled) {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .sequence-btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #f8f9fa;
        }

        .sequence-number {
          font-weight: 600;
          color: #495057;
          min-width: 20px;
          text-align: center;
          font-size: 14px;
        }

        .mini-spinner {
          width: 12px;
          height: 12px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .action-buttons {
          display: flex;
          gap: 5px;
          justify-content: center;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.2s ease;
          position: relative;
        }

        .edit-btn {
          background: #28a745;
          color: white;
        }

        .edit-btn:hover {
          background: #218838;
          color: white;
        }

        .bg-primary {
          background: #007bff !important;
        }

        .bg-primary:hover {
          background: #0056b3 !important;
        }

        .bg-danger {
          background: #dc3545 !important;
        }

        .bg-danger:hover {
          background: #c82333 !important;
        }

        .tooltip-text {
          visibility: hidden;
          width: 80px;
          background-color: #333;
          color: #fff;
          text-align: center;
          border-radius: 4px;
          padding: 5px;
          position: absolute;
          z-index: 1;
          bottom: 125%;
          left: 50%;
          margin-left: -40px;
          font-size: 12px;
        }

        .action-btn:hover .tooltip-text {
          visibility: visible;
        }
      `}</style>
    </>
  )
}
