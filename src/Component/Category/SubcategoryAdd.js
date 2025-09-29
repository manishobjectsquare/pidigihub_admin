// import React, { useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { baseUrl } from "../../config/baseUrl";
// import axios from "axios";
// import toastify from "../../config/toastify";

// export default function SubcategoryAdd() {
//   const [formval, setFormval] = useState();
//   let navigate = useNavigate();
//   let changeHandler = (e) => {
//     setFormval((preVal) => ({ ...preVal, [e.target.name]: e.target.value }));
//   };

//   let { id } = useParams();
//   let handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formval.title) {
//       return toastify.error("name is require");
//     }

//     if (!formval.status) {
//       return toastify.error("status is require");
//     }
//     formval.categoryId = id;

//     try {
//       let response = await axios(
//         `${baseUrl}/subcategory/addsubcat`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: localStorage.getItem("token"),
//           },
//           data: formval,
//         }
//       );
//       if (!response?.status) {
//         toastify.error("some error accoured");
//         return;
//       }
//       navigate(`/course-category/${id}/subcategories`);
//     } catch (error) {
//       console.error("Error :", error);
//     }
//   };

//   return (
//     <>
//       <section className="main-sec">
//         <div className="row align-items-center">
//           <div className="col-lg-6">
//             <div className="dashboard-title">
//               <h4 className="dash-head">
//                 <i className="fa fa-users me-2" />
//                 Add Sub Category
//               </h4>
//             </div>
//             <div className="custom-bredcump">
//               <nav aria-label="breadcrumb">
//                 <ol className="breadcrumb">
//                   <li className="breadcrumb-item">
//                     <Link to="/">Dashboard</Link>
//                   </li>
//                   <li className="breadcrumb-item active" aria-current="page">
//                     Add Sub Course Category
//                   </li>
//                 </ol>
//               </nav>
//             </div>
//           </div>
//           <div className="col-lg-6 d-flex justify-content-end">
//             <Link to="/categories/subcategories" className="btn btn-info text-white">
//               <i className="fa fa-arrow-left me-1"></i>
//               Back
//             </Link>
//           </div>
//         </div>
//         <div className="row">
//           <div className="col-lg-12">
//             <div className="cards edit-usr">
//               <form action="" onSubmit={handleSubmit}>
//                 <div className="row">
//                   <div className="col-lg-4 mb-4">
//                     <label htmlFor="name" className="form-label">
//                       Sub Category Name<sup className="text-danger">*</sup>
//                     </label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="name"
//                       placeholder="Category Name"
//                       onChange={changeHandler}
//                       value={formval?.name}
//                     />
//                   </div>
//                   <div className="col-lg-4 mb-4">
//                     <label htmlFor="slug" className="form-label">
//                       Slug<sup className="text-danger">*</sup>
//                     </label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="slug"
//                       placeholder="Slug"
//                       onChange={changeHandler}
//                       value={formval?.name}
//                     />
//                   </div>

//                   <div className="col-lg-4 mb-4">
//                     <label htmlFor="status" className="form-label">
//                       Status<sup className="text-danger">*</sup>
//                     </label>
//                     <select
//                       className="form-control"
//                       name="status"
//                       onChange={changeHandler}
//                       value={formval?.status}
//                     >
//                       <option value={""}>Select Status</option>
//                       <option value={1}>Active</option>
//                       <option value={0}>Inactive</option>
//                     </select>
//                   </div>

//                   <div className="col-lg-12 text-center">
//                     <button
//                       type="Submit"
//                       className="btn btn-for-add text-white"
//                     >
//                       <i className="fa fa-save me-1"></i>
//                       Save
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }
"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { baseUrl } from "../../config/baseUrl"
import axios from "axios"
import toastify from "../../config/toastify"

export default function SubcategoryAdd() {
  const [formval, setFormval] = useState({
    title: "",
    status: "",
  })
  const [loading, setLoading] = useState(false)
  const [categoryName, setCategoryName] = useState("")

  const navigate = useNavigate()
  const { categoryID } = useParams()
  console.log(useParams())
  useEffect(() => {
    fetchCategoryDetails()
  }, [categoryID])

  const fetchCategoryDetails = async () => {
    try {
      const response = await axios.get(`${baseUrl}/category`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      const category = response.data.data.find((cat) => cat._id === categoryID)
      if (category) {
        setCategoryName(category.title)
      }
    } catch (error) {
      console.error("Error fetching category:", error)
    }
  }

  const changeHandler = (e) => {
    setFormval((preVal) => ({ ...preVal, [e.target.name]: e.target.value }))
  }

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };



  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   setLoading(true)

  //   if (!formval.title) {
  //     setLoading(false)
  //     return toastify.error("Title is required")
  //   }

  //   if (!formval.status) {
  //     setLoading(false)
  //     return toastify.error("Status is required")
  //   }

  //   try {
  //     // Create a new object for the API request
  //     const requestData = {
  //       ...formval,
  //       categoryId: categoryID,
  //     }


  //     const response = await axios({
  //       method: "POST",
  //       url: `${baseUrl}/subcategory`,
  //       headers: {
  //         Authorization: localStorage.getItem("token"),
  //         "Content-Type": "application/json",
  //       },
  //       data: requestData,
  //     })

  //     if (response.data.status) {
  //       toastify.success("Subcategory added successfully")
  //       navigate(`/categories/subcategories/${categoryID}`)
  //     } else {
  //       toastify.error(response.data.message || "Some error occurred")
  //     }
  //   } catch (error) {
  //     console.error("Error:", error)
  //     toastify.error("Failed to add subcategory")
  //   } finally {
  //     setLoading(false)
  //   }
  // }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formval.title) {
      setLoading(false);
      return toastify.error("Title is required");
    }

    if (!formval.status) {
      setLoading(false);
      return toastify.error("Status is required");
    }

    if (!selectedFile) {
      setLoading(false);
      return toastify.error("Please select an icon/image");
    }

    try {
      const formData = new FormData();
      formData.append("title", formval.title);
      formData.append("status", formval.status);
      formData.append("categoryId", categoryID);
      formData.append("image", selectedFile); // 👈 file goes here

      const response = await axios.post(`${baseUrl}/subcategory`, formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data", // 👈 necessary for files
        },
      });

      if (response.data.status) {
        toastify.success("Subcategory added successfully");
        navigate(`/categories/subcategories/${categoryID}`);
      } else {
        toastify.error(response.data.message || "Some error occurred");
      }
    } catch (error) {
      console.error("Error:", error);
      toastify.error("Failed to add subcategory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="main-sec">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="dashboard-title">
              <h4 className="dash-head">
                <i className="fa fa-plus me-2" />
                Add SubCategory
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
                  <li className="breadcrumb-item">
                    <Link to={`/categories/subcategories/${categoryID}`}>{categoryName || "Category"} Subcategories</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Add Subcategory
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="col-lg-6 d-flex justify-content-end">
            <Link to={`/categories/subcategories/${categoryID}`} className="btn btn-info text-white">
              <i className="fa fa-arrow-left me-1"></i>
              Back
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="cards edit-usr">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  Add Subcategory for: <span className="text-primary">{categoryName}</span>
                </h5>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="title" className="form-label">
                      Subcategory Title<sup className="text-danger">*</sup>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      id="title"
                      placeholder="Enter subcategory title"
                      onChange={changeHandler}
                      value={formval?.title}
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="col-lg-6 mb-4">
                    <label htmlFor="status" className="form-label">
                      Status<sup className="text-danger">*</sup>
                    </label>
                    <select
                      className="form-control"
                      name="status"
                      id="status"
                      onChange={changeHandler}
                      value={formval?.status}
                      disabled={loading}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="col-lg-12 mb-4">
                    <label htmlFor="image" className="form-label">
                      Icon<sup className="text-danger">*</sup>
                    </label>
                    <div className="file-upload-container">
                      <div
                        className={`file-upload-area ${isDragging ? "dragging" : ""
                          }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        {!selectedFile ? (
                          <>
                            <div className="file-upload-icon">
                              <i className="fa fa-cloud-upload"></i>
                            </div>
                            <div className="file-upload-text">
                              Drag & Drop your image here
                            </div>
                            <div className="file-upload-subtext">
                              or click to browse files
                            </div>
                            <input
                              type="file"
                              className="file-upload-input"
                              id="image"
                              name="image"
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </>
                        ) : (
                          <div className="file-preview-container">
                            <img
                              src={previewUrl || "/placeholder.svg"}
                              alt="Preview"
                              className="file-preview"
                            />
                            <button
                              type="button"
                              className="file-remove-btn"
                              onClick={removeFile}
                            >
                              <i className="fa fa-times"></i>
                            </button>
                            <div className="file-info">
                              {selectedFile.name} (
                              {Math.round(selectedFile.size / 1024)} KB)
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hidden field to ensure categoryId is included */}
                  <input type="hidden" name="categoryId" value={categoryID} />

                  <div className="col-lg-12 text-center">
                    <button type="submit" className="btn btn-for-add text-white" disabled={loading}>
                      {loading ? (
                        <>
                          <i className="fa fa-spinner fa-spin me-1"></i>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="fa fa-save me-1"></i>
                          Save Subcategory
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
