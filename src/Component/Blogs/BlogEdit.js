// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import ReactQuill from "react-quill";
// import { Link, useParams } from "react-router-dom";


// export default function BlogEdit() {
//     const [formval, setFormval] = useState();
//     const [blog, setBlog] = useState({});
//     let changeHandler = (e) => {
//         setFormval((preVal) => ({ ...preVal, [e.target.name]: e.target.value }));
//     };

//     // let handleSubmit = async (e) => {
//     //     e.preventDefault();

//     //     try {

//     //     } catch (error) {
//     //         console.error("Error :", error);
//     //     }
//     // };
//     const id = useParams().id;
//     console.log(id)
//     const fetchBlogList = async (id) => {
//         try {
//             const response = await axios.get(
//                 `https://api.basementex.com/blog/${id}`,
//                 {
//                     headers: {
//                         "Content-type": "application/json",
//                     },
//                 }
//             );
//             console.log("response", response);
//             setBlog(response);
//         } catch (error) {
//             console.log("error", error);
//         }
//     };
//     useEffect(() => {
//         fetchBlogList();
//     }, [id])

//     // const blog = blogList.find((blog) => blog._id === id);

//     const [selectedFile, setSelectedFile] = useState(`https://api.basementex.com/${blog?.image}`);
//     const [previewUrl, setPreviewUrl] = useState(null);
//     const [isDragging, setIsDragging] = useState(false);
//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setSelectedFile(file);

//             // Create preview URL
//             const reader = new FileReader();
//             reader.onload = () => {
//                 setPreviewUrl(reader.result);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleDragOver = (e) => {
//         e.preventDefault();
//         setIsDragging(true);
//     };

//     const handleDragLeave = () => {
//         setIsDragging(false);
//     };

//     const handleDrop = (e) => {
//         e.preventDefault();
//         setIsDragging(false);

//         if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//             const file = e.dataTransfer.files[0];
//             setSelectedFile(file);

//             // Create preview URL
//             const reader = new FileReader();
//             reader.onload = () => {
//                 setPreviewUrl(reader.result);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const removeFile = () => {
//         setSelectedFile(null);
//         setPreviewUrl(null);
//     };


//     return (
//         <>
//             <section className="main-sec">
//                 <div className="row align-items-center">
//                     <div className="col-lg-6">
//                         <div className="dashboard-title">
//                             <h4 className="dash-head">
//                                 <i className="fa fa-users me-2" />
//                                 Edit Post
//                             </h4>
//                         </div>
//                         <div className="custom-bredcump">
//                             <nav aria-label="breadcrumb">
//                                 <ol className="breadcrumb">
//                                     <li className="breadcrumb-item">
//                                         <Link to="/">Dashboard</Link>
//                                     </li>
//                                     <li className="breadcrumb-item active" aria-current="page">
//                                         Edit Post
//                                     </li>
//                                 </ol>
//                             </nav>
//                         </div>
//                     </div>
//                     <div className="col-lg-6 d-flex justify-content-end">
//                         <Link to="/blogs" className="btn btn-info text-white">
//                             <i className="fa fa-arrow-left me-1"></i>
//                             Back
//                         </Link>
//                     </div>
//                 </div>
//                 <div className="row">
//                     <div className="col-lg-12">
//                         <div className="cards edit-usr">
//                             <form action=""  >
//                                 {/* {blogList.find(category === id).map((blog, index) => (

//                                 ))} */}
//                                 <div className="row">
//                                     <div className="col-lg-6 mb-4">
//                                         <label htmlFor="name" className="form-label">
//                                             Title<sup className="text-danger">*</sup>
//                                         </label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="name"
//                                             placeholder="Title"
//                                             onChange={changeHandler}
//                                             value={blog?.title}

//                                         />
//                                     </div>
//                                     {/* <div className="col-lg-6 mb-4">
//                                             <label htmlFor="slug" className="form-label">
//                                                 Slug<sup className="text-danger">*</sup>
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 name="slug"
//                                                 placeholder="Slug"
//                                                 onChange={changeHandler}
//                                                 value={formval?.slug}
//                                                 disabled
//                                             />
//                                         </div> */}
//                                     <div className="col-lg-6 mb-4">
//                                         <label htmlFor="select-user" className="form-label">
//                                             Category<sup className="text-danger">*</sup>
//                                         </label>
//                                         <select className="form-control" disabled>
//                                             <option>{blog?.category}</option>
//                                         </select>
//                                     </div>
//                                     {/* <div className="col-lg-6 mb-4">
//                                             <label htmlFor="select-user" className="form-label">
//                                                 Show at Homepage<sup className="text-danger">*</sup>
//                                             </label>
//                                             <select className="form-control" disabled>
//                                                 <option>Yes</option>
//                                                 <option>No</option>
//                                             </select>
//                                         </div> */}

//                                     {/* <div className="col-lg-6 mb-4">
//                                             <label htmlFor="select-user" className="form-label">
//                                                 Status<sup className="text-danger">*</sup>
//                                             </label>
//                                             <select className="form-control" disabled>
//                                                 <option>Active</option>
//                                                 <option>Inactive</option>
//                                             </select>
//                                         </div> */}
//                                     {/* <div className="col-lg-6 mb-4">
//                                             <label htmlFor="select-user" className="form-label">
//                                                 Mark As Popular<sup className="text-danger">*</sup>
//                                             </label>
//                                             <select className="form-control" disabled>
//                                                 <option>Yes</option>
//                                                 <option>No</option>
//                                             </select>
//                                         </div> */}
//                                     <div className="col-lg-12 mb-4">
//                                         <label htmlFor="image" className="form-label">
//                                             Icon<sup className="text-danger">*</sup>
//                                         </label>
//                                         <div className="file-upload-container">
//                                             <div
//                                                 className={`file-upload-area ${isDragging ? "dragging" : ""
//                                                     }`}
//                                                 onDragOver={handleDragOver}
//                                                 onDragLeave={handleDragLeave}
//                                                 onDrop={handleDrop}
//                                             >
//                                                 {!selectedFile ? (
//                                                     <>
//                                                         <div className="file-upload-icon">
//                                                             <i className="fa fa-cloud-upload"></i>
//                                                         </div>
//                                                         <div className="file-upload-text">
//                                                             Drag & Drop your image here
//                                                         </div>
//                                                         <div className="file-upload-subtext">
//                                                             or click to browse files
//                                                         </div>
//                                                         <input
//                                                             type="file"
//                                                             className="file-upload-input"
//                                                             id="image"
//                                                             name="image"
//                                                             accept="image/*"
//                                                             onChange={handleFileChange}
//                                                         // value={`https://api.basementex.com/${blog?.image}`}
//                                                         />
//                                                     </>
//                                                 ) : (
//                                                     <div className="file-preview-container">
//                                                         <img
//                                                             src={`https://api.basementex.com/${blog?.image}`}
//                                                             alt="Preview"
//                                                             className="file-preview"
//                                                         />
//                                                         <button
//                                                             type="button"
//                                                             className="file-remove-btn"
//                                                             onClick={removeFile}
//                                                         >
//                                                             <i className="fa fa-times"></i>
//                                                         </button>
//                                                         <div className="file-info">
//                                                             {selectedFile.name} (
//                                                             {Math.round(selectedFile.size / 1024)} KB)
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="col-lg-12 mb-4">
//                                         <label htmlFor="description" className="form-label">
//                                             Description<sup className="text-danger">*</sup>
//                                         </label>
//                                         <ReactQuill
//                                             theme="snow"
//                                             value={formval?.description}
//                                             onChange={(value) =>
//                                                 setFormval({
//                                                     ...formval,
//                                                     description: value,
//                                                 })
//                                             }
//                                             modules={{
//                                                 toolbar: [
//                                                     [{ header: [1, 2, false] }],
//                                                     ["bold", "italic", "underline"],
//                                                     ["link", "image"],
//                                                     ["clean"],
//                                                 ],
//                                             }} />
//                                     </div>
//                                     <div className="col-lg-12 text-center">
//                                         <button
//                                             type="Submit"
//                                             className="btn btn-for-add text-white"
//                                         >
//                                             <i className="fa fa-save me-2"></i>
//                                             Save
//                                         </button>
//                                     </div>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </>
//     );
// }


"use client"

// import axios from "axios"
// import { useEffect, useState } from "react"
// import ReactQuill from "react-quill"
// import { Link, useParams, useNavigate } from "react-router-dom"
// import "react-quill/dist/quill.snow.css"

// export default function BlogEdit() {
//     const { id } = useParams()
//     const navigate = useNavigate()
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState(null)
//     const stripHtml = (html) => {
//         const tempDiv = document.createElement("div");
//         tempDiv.innerHTML = html;
//         return tempDiv.textContent || tempDiv.innerText || "";
//     };
//     const [formValues, setFormValues] = useState({
//         title: "",
//         category: "",
//         description: "",
//         image: null,
//     })

//     const [selectedFile, setSelectedFile] = useState(null)
//     const [previewUrl, setPreviewUrl] = useState(null)
//     const [isDragging, setIsDragging] = useState(false)
//     const [submitLoading, setSubmitLoading] = useState(false)

//     // Fetch blog by ID
//     useEffect(() => {
//         const fetchBlog = async () => {
//             setLoading(true)
//             try {
//                 const response = await axios.get(`https://api.basementex.com/blog/${id}`, {
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 })

//                 console.log("Blog data:", response.data)
//                 console.log(response.data.data.title)

//                 if (response.data) {
//                     // Initialize form values with blog data
//                     setFormValues({
//                         title: response.data.data.title || "",
//                         category: response.data.data.category || "",
//                         description: response.data.data.description || "",
//                         image: response.data.data.image || null,
//                     })

//                     // Set preview URL for existing image
//                     if (response.data.image) {
//                         setPreviewUrl(`https://api.basementex.com/media/${response.data.image}`)
//                     }
//                 }

//                 setLoading(false)
//             } catch (error) {
//                 console.error("Error fetching blog:", error)
//                 setError("Failed to fetch blog data. Please try again.")
//                 setLoading(false)
//             }
//         }

//         if (id) {
//             fetchBlog()
//         }
//     }, [id])

//     // Handle input changes
//     const handleInputChange = (e) => {
//         const { name, value } = e.target
//         setFormValues((prev) => ({
//             ...prev,
//             [name]: value,
//         }))
//     }

//     // Handle rich text editor changes
//     const handleEditorChange = (content) => {
//         setFormValues((prev) => ({
//             ...prev,
//             description: content,
//         }))
//     }

//     // Handle file selection
//     const handleFileChange = (e) => {
//         const file = e.target.files[0]
//         if (file) {
//             setSelectedFile(file)

//             // Create preview URL
//             const reader = new FileReader()
//             reader.onload = () => {
//                 setPreviewUrl(reader.result)
//             }
//             reader.readAsDataURL(file)

//             // Update form values
//             setFormValues((prev) => ({
//                 ...prev,
//                 image: file,
//             }))
//         }
//     }

//     // Handle drag and drop
//     const handleDragOver = (e) => {
//         e.preventDefault()
//         setIsDragging(true)
//     }

//     const handleDragLeave = () => {
//         setIsDragging(false)
//     }

//     const handleDrop = (e) => {
//         e.preventDefault()
//         setIsDragging(false)

//         if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//             const file = e.dataTransfer.files[0]
//             setSelectedFile(file)

//             // Create preview URL
//             const reader = new FileReader()
//             reader.onload = () => {
//                 setPreviewUrl(reader.result)
//             }
//             reader.readAsDataURL(file)

//             // Update form values
//             setFormValues((prev) => ({
//                 ...prev,
//                 image: file,
//             }))
//         }
//     }

//     const removeFile = () => {
//         setSelectedFile(null)
//         setPreviewUrl(null)
//         setFormValues((prev) => ({
//             ...prev,
//             image: null,
//         }))
//     }

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         setSubmitLoading(true)

//         try {
//             // Create FormData for file upload
//             const formData = new FormData()
//             formData.append("title", formValues.title)
//             formData.append("category", formValues.category)

//             // Strip HTML tags before saving
//             const plainDescription = stripHtml(formValues.description);
//             formData.append("description", plainDescription);
//             // formData.append("description", formValues.description)

//             // Only append image if a new one was selected
//             if (selectedFile) {
//                 formData.append("image", selectedFile)
//             }

//             // Send PUT request to update blog
//             const response = await axios.put(`https://api.basementex.com/blog/${id}`, formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             })

//             console.log("Update response:", response.data)

//             // Show success message and redirect
//             alert("Blog updated successfully!")
//             navigate("/blogs") // Redirect to blogs list
//         } catch (error) {
//             console.error("Error updating blog:", error)
//             setError("Failed to update blog. Please try again.")
//         } finally {
//             setSubmitLoading(false)
//         }
//     }

//     if (loading) {
//         return (
//             <section className="main-sec">
//                 <div className="text-center py-5">
//                     <div className="spinner-border" role="status">
//                         <span className="visually-hidden">Loading...</span>
//                     </div>
//                     <p className="mt-2">Loading blog data...</p>
//                 </div>
//             </section>
//         )
//     }

//     if (error) {
//         return (
//             <section className="main-sec">
//                 <div className="alert alert-danger" role="alert">
//                     {error}
//                     <button className="btn btn-sm btn-outline-danger ms-3" onClick={() => window.location.reload()}>
//                         Retry
//                     </button>
//                 </div>
//             </section>
//         )
//     }

//     return (
//         <>
//             <section className="main-sec">
//                 <div className="row align-items-center">
//                     <div className="col-lg-6">
//                         <div className="dashboard-title">
//                             <h4 className="dash-head">
//                                 <i className="fa fa-users me-2" />
//                                 Edit Post
//                             </h4>
//                         </div>
//                         <div className="custom-bredcump">
//                             <nav aria-label="breadcrumb">
//                                 <ol className="breadcrumb">
//                                     <li className="breadcrumb-item">
//                                         <Link to="/">Dashboard</Link>
//                                     </li>
//                                     <li className="breadcrumb-item active" aria-current="page">
//                                         Edit Post
//                                     </li>
//                                 </ol>
//                             </nav>
//                         </div>
//                     </div>
//                     <div className="col-lg-6 d-flex justify-content-end">
//                         <Link to="/blogs" className="btn btn-info text-white">
//                             <i className="fa fa-arrow-left me-1"></i>
//                             Back
//                         </Link>
//                     </div>
//                 </div>
//                 <div className="row">
//                     <div className="col-lg-12">
//                         <div className="cards edit-usr">
//                             <form onSubmit={handleSubmit}>
//                                 <div className="row">
//                                     <div className="col-lg-6 mb-4">
//                                         <label htmlFor="title" className="form-label">
//                                             Title<sup className="text-danger">*</sup>
//                                         </label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="title"
//                                             id="title"
//                                             placeholder="Title"
//                                             value={formValues.title}
//                                             onChange={handleInputChange}
//                                             required
//                                         />
//                                     </div>
//                                     <div className="col-lg-6 mb-4">
//                                         <label htmlFor="category" className="form-label">
//                                             Category<sup className="text-danger">*</sup>
//                                         </label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="category"
//                                             id="category"
//                                             value={formValues.category}
//                                             onChange={handleInputChange}
//                                             disabled
//                                         />
//                                     </div>
//                                     <div className="col-lg-12 mb-4">
//                                         <label htmlFor="image" className="form-label">
//                                             Image<sup className="text-danger">*</sup>
//                                         </label>
//                                         <div className="file-upload-container">
//                                             <div
//                                                 className={`file-upload-area ${isDragging ? "dragging" : ""}`}
//                                                 onDragOver={handleDragOver}
//                                                 onDragLeave={handleDragLeave}
//                                                 onDrop={handleDrop}
//                                             >
//                                                 {!previewUrl ? (
//                                                     <>
//                                                         <div className="file-upload-icon">
//                                                             <i className="fa fa-cloud-upload"></i>
//                                                         </div>
//                                                         <div className="file-upload-text">Drag & Drop your image here</div>
//                                                         <div className="file-upload-subtext">or click to browse files</div>
//                                                         <input
//                                                             type="file"
//                                                             className="file-upload-input"
//                                                             id="image"
//                                                             name="image"
//                                                             accept="image/*"
//                                                             onChange={handleFileChange}
//                                                         />
//                                                     </>
//                                                 ) : (
//                                                     <div className="file-preview-container">
//                                                         <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="file-preview" />
//                                                         <button type="button" className="file-remove-btn" onClick={removeFile}>
//                                                             <i className="fa fa-times"></i>
//                                                         </button>
//                                                         <div className="file-info">
//                                                             {selectedFile ? (
//                                                                 <>
//                                                                     {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
//                                                                 </>
//                                                             ) : (
//                                                                 "Current image"
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="col-lg-12 mb-4">
//                                         <label htmlFor="description" className="form-label">
//                                             Description<sup className="text-danger">*</sup>
//                                         </label>
//                                         <ReactQuill
//                                             theme="snow"
//                                             value={formValues.description}
//                                             onChange={handleEditorChange}
//                                             modules={{
//                                                 toolbar: [
//                                                     [{ header: [1, 2, false] }],
//                                                     ["bold", "italic", "underline"],
//                                                     ["link", "image"],
//                                                     ["clean"],
//                                                 ],
//                                             }}
//                                         />
//                                     </div>
//                                     <div className="col-lg-12 text-center">
//                                         <button type="submit" className="btn btn-for-add text-white" disabled={submitLoading}>
//                                             {submitLoading ? (
//                                                 <>
//                                                     <span
//                                                         className="spinner-border spinner-border-sm me-2"
//                                                         role="status"
//                                                         aria-hidden="true"
//                                                     ></span>
//                                                     Saving...
//                                                 </>
//                                             ) : (
//                                                 <>
//                                                     <i className="fa fa-save me-2"></i>
//                                                     Save
//                                                 </>
//                                             )}
//                                         </button>
//                                     </div>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </>
//     )
// }


"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import ReactQuill from "react-quill"
import { Link, useParams, useNavigate } from "react-router-dom"
import "react-quill/dist/quill.snow.css"
import { toast } from "react-toastify"

export default function BlogEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const stripHtml = (html) => {
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = html
        return tempDiv.textContent || tempDiv.innerText || ""
    }

    const [formValues, setFormValues] = useState({
        title: "",
        category: "",
        description: "",
        image: null,
    })

    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)

    // Fetch blog by ID
    useEffect(() => {
        const fetchBlog = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`https://api.basementex.com/blog/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })

                console.log("Blog data:", response.data)


                if (response.data && response.data.data) {
                    const blogData = response.data.data



                    setFormValues({
                        title: blogData.title || "",
                        category: blogData.category || "",
                        description: blogData.description || "",
                        image: blogData.image || null,
                    })

                    if (blogData.image) {
                        const imageUrl = `https://api.basementex.com/${blogData.image}`

                        setPreviewUrl(imageUrl)
                    }
                } else {
                    console.error("Unexpected API response structure:", response.data)
                    setError("Invalid data format received from server")
                }

                setLoading(false)
            } catch (error) {
                console.error("Error fetching blog:", error)
                setError("Failed to fetch blog data. Please try again.")
                setLoading(false)
            }
        }

        if (id) {
            fetchBlog()
        }
    }, [id])

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // Handle rich text editor changes
    const handleEditorChange = (content) => {
        setFormValues((prev) => ({
            ...prev,
            description: content,
        }))
    }

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFile(file)

            // Create preview URL
            const reader = new FileReader()
            reader.onload = () => {
                setPreviewUrl(reader.result)
            }
            reader.readAsDataURL(file)

            // Update form values
            setFormValues((prev) => ({
                ...prev,
                image: file,
            }))
        }
    }

    // Handle drag and drop
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

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            setSelectedFile(file)

            // Create preview URL
            const reader = new FileReader()
            reader.onload = () => {
                setPreviewUrl(reader.result)
            }
            reader.readAsDataURL(file)

            // Update form values
            setFormValues((prev) => ({
                ...prev,
                image: file,
            }))
        }
    }

    const removeFile = () => {
        setSelectedFile(null)
        setPreviewUrl(null)
        setFormValues((prev) => ({
            ...prev,
            image: null,
        }))
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitLoading(true)

        try {
            // Create FormData for file upload
            const formData = new FormData()
            formData.append("title", formValues.title)
            formData.append("category", formValues.category)

            // Strip HTML tags before saving
            const plainDescription = stripHtml(formValues.description)
            formData.append("description", plainDescription)
            // formData.append("description", formValues.description)

            // Only append image if a new one was selected
            if (selectedFile) {
                formData.append("image", selectedFile)
            }

            // Send PUT request to update blog
            const response = await axios.put(`https://api.basementex.com/blog/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            console.log("Update response:", response.data)
            toast.success("Blog updated successfully!")
            navigate("/blogs") // Redirect to blogs list
        } catch (error) {
            console.error("Error updating blog:", error)
            setError("Failed to update blog. Please try again.")
        } finally {
            setSubmitLoading(false)
        }
    }

    if (loading) {
        return (
            <section className="main-sec">
                <div className="text-center py-5">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading blog data...</p>
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section className="main-sec">
                <div className="alert alert-danger" role="alert">
                    {error}
                    <button className="btn btn-sm btn-outline-danger ms-3" onClick={() => window.location.reload()}>
                        Retry
                    </button>
                </div>
            </section>
        )
    }

    return (
        <>
            <section className="main-sec">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <div className="dashboard-title">
                            <h4 className="dash-head">
                                <i className="fa fa-users me-2" />
                                Edit Post
                            </h4>
                        </div>
                        <div className="custom-bredcump">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/">Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Edit Post
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="col-lg-6 d-flex justify-content-end">
                        <Link to="/blogs" className="btn btn-info text-white">
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
                                        <label htmlFor="title" className="form-label">
                                            Title<sup className="text-danger">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="title"
                                            id="title"
                                            placeholder="Title"
                                            value={formValues.title}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-lg-6 mb-4">
                                        <label htmlFor="category" className="form-label">
                                            Category<sup className="text-danger">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="category"
                                            id="category"
                                            value={formValues.category}
                                            onChange={handleInputChange}
                                            disabled
                                        />
                                    </div>
                                    <div className="col-lg-12 mb-4">
                                        <label htmlFor="image" className="form-label">
                                            Image<sup className="text-danger">*</sup>
                                        </label>
                                        <div className="file-upload-container">
                                            <div
                                                className={`file-upload-area ${isDragging ? "dragging" : ""}`}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                            >
                                                {!previewUrl ? (
                                                    <>
                                                        <div className="file-upload-icon">
                                                            <i className="fa fa-cloud-upload"></i>
                                                        </div>
                                                        <div className="file-upload-text">Drag & Drop your image here</div>
                                                        <div className="file-upload-subtext">or click to browse files</div>
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
                                                            onError={(e) => {
                                                                console.error("Image failed to load:", e.target.src)
                                                                e.target.src = "/blog-concept.png"
                                                            }}
                                                        />
                                                        <button type="button" className="file-remove-btn" onClick={removeFile}>
                                                            <i className="fa fa-times"></i>
                                                        </button>
                                                        <div className="file-info">
                                                            {selectedFile ? (
                                                                <>
                                                                    {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                                                                </>
                                                            ) : (
                                                                "Current image"
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-12 mb-4">
                                        <label htmlFor="description" className="form-label">
                                            Description<sup className="text-danger">*</sup>
                                        </label>
                                        <ReactQuill
                                            theme="snow"
                                            value={formValues.description}
                                            onChange={handleEditorChange}
                                            modules={{
                                                toolbar: [
                                                    [{ header: [1, 2, false] }],
                                                    ["bold", "italic", "underline"],
                                                    ["link", "image"],
                                                    ["clean"],
                                                ],
                                            }}
                                        />
                                    </div>
                                    <div className="col-lg-12 text-center">
                                        <button type="submit" className=" btn-for-add text-white" disabled={submitLoading}>
                                            {submitLoading ? (
                                                <>
                                                    <span
                                                        className="spinner-border spinner-border-sm me-2"
                                                        role="status"
                                                        aria-hidden="true"
                                                    ></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa fa-save me-2"></i>
                                                    Save
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
