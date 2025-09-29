// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { baseUrl } from "../../config/baseUrl";
// import axios from "axios";
// import toastify from "../../config/toastify";

// export default function CourseCategoryEdit() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [formval, setFormval] = useState({
//     title: "",
//     status: "",
//   });

//   const [selectedFile, setSelectedFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);

//   // Change handler for form fields
//   const changeHandler = (e) => {
//     const { name, value } = e.target;
//     setFormval((prevVal) => ({
//       ...prevVal,
//       [name]: value,
//     }));
//   };

//   // Fetch existing category data
//   const fetchLiveData = async () => {
//     try {
//       const response = await axios.get(`${baseUrl}/category/${id}`, {
//         headers: {
//           Authorization: localStorage.getItem("token"),
//         },
//       });
//       const data = response.data.data;
//       setFormval({
//         title: data.title || "",
//         show_at_trending: data.show_at_trending || "",
//         status: data.status || "",
//       });
//       if (data.image) {
//         setSelectedFile(data.image);
//         setPreviewUrl(`${baseUrl}/${data.image}`);
//       }
//     } catch (error) {
//       console.error("Error fetching category:", error);
//     }
//   };

//   useEffect(() => {
//     fetchLiveData();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("title", formval.title);
//     formData.append("image", selectedFile);
//     formData.append("show_at_trending", formval.show_at_trending);
//     formData.append("status", formval.status);

//     try {
//       const response = await axios.patch(`${baseUrl}/category/${id}`, formData, {
//         headers: {
//           Authorization: localStorage.getItem("token"),
//         },
//       });

//       if (response?.data?.status) {
//         toastify.success("Category updated successfully");
//         navigate(`/categories`);
//       } else {
//         toastify.error(response?.data?.message || "Something went wrong");
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       toastify.error("Failed to update category");
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//       const reader = new FileReader();
//       reader.onload = () => setPreviewUrl(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const file = e.dataTransfer.files[0];
//     if (file) {
//       setSelectedFile(file);
//       const reader = new FileReader();
//       reader.onload = () => setPreviewUrl(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const removeFile = () => {
//     setSelectedFile(null);
//     setPreviewUrl(null);
//   };

//   return (
//     <section className="main-sec">
//       <div className="row align-items-center">
//         <div className="col-lg-6">
//           <div className="dashboard-title">
//             <h4 className="dash-head">
//               <i className="fa fa-users me-2" />
//               Edit  Category
//             </h4>
//           </div>
//           <div className="custom-bredcump">
//             <nav aria-label="breadcrumb">
//               <ol className="breadcrumb">
//                 <li className="breadcrumb-item">
//                   <Link to="/">Dashboard</Link>
//                 </li>
//                 <li className="breadcrumb-item active" aria-current="page">
//                   Edit  Category
//                 </li>
//               </ol>
//             </nav>
//           </div>
//         </div>
//         <div className="col-lg-6 d-flex justify-content-end">
//           <Link to="/categories" className="btn btn-info text-white">
//             <i className="fa fa-arrow-left me-1"></i>
//             Back
//           </Link>
//         </div>
//       </div>

//       <div className="row">
//         <div className="col-lg-12">
//           <div className="cards edit-usr">
//             <form onSubmit={handleSubmit}>
//               <div className="row">
//                 <div className="col-lg-6 mb-4">
//                   <label className="form-label">
//                     Title<sup className="text-danger">*</sup>
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="title"
//                     placeholder="Category Title"
//                     onChange={changeHandler}
//                     value={formval.title}
//                   />
//                 </div>

//                 <div className="col-lg-6 mb-4">
//                   <label className="form-label">
//                     Show at Trending<sup className="text-danger">*</sup>
//                   </label>
//                   <select
//                     className="form-control"
//                     name="show_at_trending"
//                     onChange={changeHandler}
//                     value={formval.show_at_trending}
//                   >
//                     <option value="">Select Option</option>
//                     <option value="yes">Yes</option>
//                     <option value="no">No</option>
//                   </select>
//                 </div>

//                 <div className="col-lg-6 mb-4">
//                   <label className="form-label">
//                     Status<sup className="text-danger">*</sup>
//                   </label>
//                   <select
//                     className="form-control"
//                     name="status"
//                     onChange={changeHandler}
//                     value={formval.status}
//                   >
//                     <option value="">Select Status</option>
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                   </select>
//                 </div>

//                 <div className="col-lg-12 mb-4">
//                   <label className="form-label">
//                     Icon<sup className="text-danger">*</sup>
//                   </label>
//                   <div className="file-upload-container">
//                     <div
//                       className={`file-upload-area ${isDragging ? "dragging" : ""}`}
//                       onDragOver={handleDragOver}
//                       onDragLeave={handleDragLeave}
//                       onDrop={handleDrop}
//                     >
//                       {!selectedFile || typeof selectedFile === "string" ? (
//                         <>
//                           <div className="file-upload-icon">
//                             <i className="fa fa-cloud-upload"></i>
//                           </div>
//                           <div className="file-upload-text">
//                             Drag & Drop your image here
//                           </div>
//                           <div className="file-upload-subtext">
//                             or click to browse files
//                           </div>
//                           <input
//                             type="file"
//                             className="file-upload-input"
//                             name="image"
//                             accept="image/*"
//                             onChange={handleFileChange}
//                           />
//                         </>
//                       ) : (
//                         <div className="file-preview-container">
//                           <img
//                             src={previewUrl || "/placeholder.svg"}
//                             alt="Preview"
//                             className="file-preview"
//                           />
//                           <button
//                             type="button"
//                             className="file-remove-btn"
//                             onClick={removeFile}
//                           >
//                             <i className="fa fa-times"></i>
//                           </button>
//                           <div className="file-info">
//                             {selectedFile.name} (
//                             {Math.round(selectedFile.size / 1024)} KB)
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="col-lg-12 text-center">
//                   <button type="submit" className="btn btn-for-add text-white">
//                     <i className="fa fa-save me-1"></i>
//                     Save
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }







"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { baseUrl } from "../../config/baseUrl"
import axios from "axios"
import toastify from "../../config/toastify"

export default function CourseCategoryEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formval, setFormval] = useState({
    title: "",
    status: "",
  })

  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(true)

  // Change handler for form fields
  const changeHandler = (e) => {
    const { name, value } = e.target
    setFormval((prevVal) => ({
      ...prevVal,
      [name]: value,
    }))
  }

  // Fetch existing category data from the new API
  const fetchLiveData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${baseUrl}/category`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })

      // Find the specific category by ID
      const categories = response.data.data
      const category = categories.find((cat) => cat._id === id)

      if (category) {
        setFormval({
          title: category.title || "",
          status: category.status || "",
        })
        if (category.image) {
          setSelectedFile(category.image)
          setPreviewUrl(`${baseUrl}/${category.image}`)
        }
      } else {
        toastify.error("Category not found")
        navigate("/categories")
      }
    } catch (error) {
      console.error("Error fetching category:", error)
      toastify.error("Failed to fetch category data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLiveData()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("_id", id)
    formData.append("title", formval.title)
    formData.append("status", formval.status)
    if (selectedFile && typeof selectedFile !== "string") {
      formData.append("image", selectedFile)
    }

    try {
      const response = await axios.put(`${baseUrl}/category/update/${id}`, formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })

      if (response?.data?.status) {
        toastify.success("Category updated successfully")
        navigate(`/categories`)
      } else {
        toastify.error(response?.data?.message || "Something went wrong")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toastify.error("Failed to update category")
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = () => setPreviewUrl(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = () => setPreviewUrl(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  if (loading) {
    return (
      <section className="main-sec">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading category data...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="main-sec">
      <div className="row align-items-center">
        <div className="col-lg-6">
          <div className="dashboard-title">
            <h4 className="dash-head">
              <i className="fa fa-users me-2" />
              Edit Category
            </h4>
          </div>
          <div className="custom-bredcump">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Edit Category
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="col-lg-6 d-flex justify-content-end">
          <Link to="/categories" className="btn btn-info text-white">
            <i className="fa fa-arrow-left me-1"></i>
            Back
          </Link>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="cards edit-usr">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-6 mb-4">
                  <label className="form-label">
                    Title<sup className="text-danger">*</sup>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    placeholder="Category Title"
                    onChange={changeHandler}
                    value={formval.title}
                    required
                  />
                </div>

                <div className="col-lg-6 mb-4">
                  <label className="form-label">
                    Status<sup className="text-danger">*</sup>
                  </label>
                  <select
                    className="form-control"
                    name="status"
                    onChange={changeHandler}
                    value={formval.status}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="col-lg-12 mb-4">
                  <label className="form-label">
                    Icon<sup className="text-danger">*</sup>
                  </label>
                  <div className="file-upload-container">
                    <div
                      className={`file-upload-area ${isDragging ? "dragging" : ""}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {previewUrl ? (
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
                            {typeof selectedFile === "string"
                              ? "Current Image"
                              : `${selectedFile?.name} (${Math.round(
                                selectedFile?.size / 1024
                              )} KB)`}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="file-upload-icon">
                            <i className="fa fa-cloud-upload"></i>
                          </div>
                          <div className="file-upload-text">Drag & Drop your image here</div>
                          <div className="file-upload-subtext">or click to browse files</div>
                          <input
                            type="file"
                            className="file-upload-input"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>


                <div className="col-lg-12 text-center">
                  <button type="submit" className="btn btn-for-add text-white">
                    <i className="fa fa-save me-1"></i>
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
