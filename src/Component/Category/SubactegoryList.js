// import { useState, useEffect } from "react";
// import { Link, useParams } from "react-router-dom";
// import axios from "axios";
// import { baseUrl } from "../../config/baseUrl";
// import Swal from "sweetalert2";
// import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// export default function SubCategoryList() {
//   let { id } = useParams();
//   const [category, setCategory] = useState([]);
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get(
//         `${baseUrl}/subcategory`,
//         {
//           headers: {
//             Authorization: localStorage.getItem("token"),
//           },
//         }
//       );
//       setCategory(response.data.data);
//     } catch (error) {
//       console.log("error", error);
//     }
//   };

//   const handleDelete = (id) => {
//     let apiCall = async () => {
//       let res = await fetch(
//         `${baseUrl}/api/v1/admin/course-sub-category/subcategory/${id}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: localStorage.getItem("token"),
//           },
//         }
//       );
//       const result = await res.json();
//       fetchCategories();
//     };
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
//         apiCall();
//         Swal.fire({
//           title: "Deleted!",
//           text: "Your file has been deleted.",
//           icon: "success",
//         });
//       }
//     });
//   };

//   const handleStatus = async (id) => {
//     await axios(
//       `${baseUrl}/api/v1/admin/course-sub-category/subcategory-status/${id}`,
//       {
//         method: "PUT",
//         headers: {
//           Authorization: localStorage.getItem("token"),
//         },
//       }
//     );
//     fetchCategories();
//     Swal.fire({
//       title: "Status Changed!",
//       icon: "success",
//       draggable: true,
//     });
//   };
//   const filteredCategories = category.filter((subcat, i) => {
//     return subcat._id === id;
//   })
//   return (
//     <>
//       <section className="main-sec">
//         <div className="row">
//           <div className="col-lg-6">
//             <div className="dashboard-title">
//               <h4 className="dash-head">
//                 <i className="fa fa-chart-bar me-2" />
//                 Parent Category &gt; Parent Category Name
//               </h4>
//             </div>
//             <div className="custom-bredcump">
//               <nav aria-label="breadcrumb">
//                 <ol className="breadcrumb">
//                   <li className="breadcrumb-item">
//                     <Link to="/">Dashboard</Link>
//                   </li>
//                   <li className="breadcrumb-item active" aria-current="page">
//                     Sub Category List
//                   </li>
//                 </ol>
//               </nav>
//             </div>
//           </div>
//           <div className="col-lg-6 text-end">
//             <div className="d-flex align-items-center justify-content-end gap-3">
//               <Link
//                 to="/categories"
//                 download
//                 className="btn btn-info text-white"
//               >
//                 <i className="fa fa-arrow-left me-1"></i>
//                 Back
//               </Link>
//               <Link
//                 to="create"
//                 className="btn btn-primary d-flex align-items-center justify-content-center"
//               >
//                 <i className="fa fa-plus me-1"></i>
//                 Add New
//               </Link>
//             </div>
//           </div>
//           <div className="col-lg-12">
//             <div className="cards bus-list">
//               <div className="bus-filter">
//                 <div className="row ">
//                   <div className="col-lg-6">
//                     <h5 className="card-title">Sub Category List</h5>
//                   </div>
//                 </div>
//               </div>
//               <div className="table table-responsive custom-table">
//                 <table className="table table-borderless">
//                   <thead>
//                     <tr>
//                       <th>SN</th>
//                       <th>Name</th>
//                       {/* <th>Slug</th> */}
//                       <th>Status</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredCategories?.map((cat, i) => {

//                       return (
//                         <tr key={cat?._id}>
//                           <td>{i + 1}</td>
//                           <td>
//                             <span>{cat?.title}</span>
//                           </td>
//                           <td>
//                             <button
//                               onClick={() => handleStatus(cat?._id)}
//                               className={`status-badge ${cat.status === "active" ? "status-active" : "status-inactive"
//                                 }`}
//                             >
//                               {cat?.status === "active" ? (
//                                 <>
//                                   <FontAwesomeIcon icon={faCheck} className="me-1" />
//                                   Active
//                                 </>
//                               ) : (
//                                 <>
//                                   <FontAwesomeIcon icon={faTimes} className="me-1" />
//                                   Inactive
//                                 </>
//                               )}
//                             </button>
//                           </td>
//                           <td>
//                             <div className="action-buttons">
//                               <button
//                                 className="action-btn delete-btn "
//                                 onClick={() => handleDelete(cat?._id)}
//                               >
//                                 <i className="fa fa-trash"></i>
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }


"use client"

import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import { baseUrl } from "../../config/baseUrl"
import Swal from "sweetalert2"
import { faCheck, faTimes, faArrowLeft, faPlus, faList } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { toast } from "react-toastify"

export default function SubCategoryList() {
  const { categoryId } = useParams()
  console.log(useParams())
  const [subcategories, setSubcategories] = useState([])
  const [parentCategory, setParentCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchParentCategory()
    fetchSubcategories()
  }, [categoryId])

  const fetchParentCategory = async () => {
    try {
      const response = await axios.get(`${baseUrl}/category`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })

      const category = response.data.data.find((cat) => cat._id === categoryId)
      setParentCategory(category)
    } catch (error) {
      console.error("Error fetching parent category:", error)
      setError("Failed to load parent category")
    }
  }

  const fetchSubcategories = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${baseUrl}/subcategory`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })

      // Filter subcategories by categoryId
      console.log(response.data.data)
      const filteredSubcategories = response.data.data.filter(
        (subcat) => subcat?.categoryId?._id === categoryId,
      )

      setSubcategories(filteredSubcategories)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching subcategories:", error)
      setError("Failed to load subcategories")
      setLoading(false)
    }
  }

  const handleDelete = (id) => {
    const apiCall = async () => {
      const res = await fetch(`${baseUrl}/subcategory/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      const result = await res.json()
      if (result.status) {
        setSubcategories((prevSubs) => prevSubs.filter((sub) => sub._id !== id))
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    }
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
        apiCall()
        toast.success(result.message)
      }
    })
  }


  const handleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      const response = await fetch(`${baseUrl}/subcategory/${id}/status`, {
        method: "PATCH",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (data.status) {
        toast.success(data.message);

        setSubcategories((prevSubs) =>
          prevSubs.map((sub) =>
            sub._id === id ? { ...sub, status: newStatus } : sub
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error Updating Status", error);
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <section className="main-sec">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading subcategories...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="main-sec">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center py-5">
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
              <Link to="/categories" className="btn btn-primary">
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                Back to Categories
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="main-sec">
        <div className="row">
          <div className="col-lg-6">
            <div className="dashboard-title">
              <h4 className="dash-head">
                <FontAwesomeIcon icon={faList} className="me-2" />
                Parent Category &gt; {parentCategory?.title || "Loading..."}
              </h4>
            </div>
            <div className="custom-bredcump">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/categories">Categories</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {parentCategory?.title || "Loading..."} Subcategories
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="col-lg-6 text-end">
            <div className="d-flex align-items-center justify-content-end gap-3">
              <Link to="/categories" className="btn btn-info text-white">
                <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                Back
              </Link>
              <Link
                to={`/categories/subcategories/${categoryId}/create`}
                className="btn btn-primary d-flex align-items-center justify-content-center"
              >
                <FontAwesomeIcon icon={faPlus} className="me-1" />
                Add New
              </Link>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="cards bus-list">
              <div className="bus-filter">
                <div className="row ">
                  <div className="col-lg-6">
                    <h5 className="card-title">{parentCategory?.title || "Category"} - Subcategories</h5>
                  </div>
                </div>
              </div>
              {subcategories.length === 0 ? (
                <div className="alert alert-info m-3">
                  No subcategories found for this category. Click "Add New" to create one.
                </div>
              ) : (
                <div className="table table-responsive custom-table">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>SN</th>
                        <th>Icon</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subcategories.map((subcat, i) => (
                        <tr key={subcat?._id}>
                          <td>{i + 1}</td>
                          <td>
                            <img src={`${baseUrl}/${subcat?.image}`} style={{ width: '100px' }} />
                          </td>
                          <td>
                            <span>{subcat?.title}</span>
                          </td>

                          <td>
                            <button
                              onClick={() => handleStatus(subcat?._id, subcat?.status)}
                              className={`status-badge ${subcat.status === "active" ? "status-active" : "status-inactive"}`}
                            >
                              {subcat?.status === "active" ? (
                                <>
                                  <FontAwesomeIcon icon={faCheck} className="me-1" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <FontAwesomeIcon icon={faTimes} className="me-1" />
                                  Inactive
                                </>
                              )}
                            </button>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <Link
                                to={`/categories/subcategories/${categoryId}/edit/${subcat._id}`}
                                className="action-btn edit-btn"
                              >
                                <i className="fa fa-edit"></i>
                              </Link>
                              <button className="action-btn delete-btn" onClick={() => handleDelete(subcat?._id)}>
                                <i className="fa fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

