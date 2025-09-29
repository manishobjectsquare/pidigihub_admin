// "use client"

// import { useState, useEffect } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { baseUrl } from "../../config/baseUrl"
// import axios from "axios"
// import toastify from "../../config/toastify"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faArrowLeft, faBoxOpen, faSave, faUpload, faPlus, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons"

// export default function AddTestPackage() {
//     const [formval, setFormval] = useState({
//         title: "",
//         description: "",
//         price: "",
//         discountPrice: "",
//         validityDays: "365",
//         status: "",
//         isPopular: false,
//         isFeatured: false,
//         showOnHomepage: false,
//     })

//     const [selectedFile, setSelectedFile] = useState(null)
//     const [previewUrl, setPreviewUrl] = useState(null)
//     const [isDragging, setIsDragging] = useState(false)
//     const [loading, setLoading] = useState(false)
//     const [availableTests, setAvailableTests] = useState([])
//     const [selectedTests, setSelectedTests] = useState([])
//     const [searchTerm, setSearchTerm] = useState("")

//     const navigate = useNavigate()

//     useEffect(() => {
//         fetchAvailableTests()
//     }, [])

//     const fetchAvailableTests = async () => {
//         try {
//             setLoading(true)
//             const response = await axios.get(`${baseUrl}/api/v1/admin/test-series`, {
//                 headers: {
//                     Authorization: localStorage.getItem("token"),
//                 },
//             })
//             setAvailableTests(response.data.data.filter((test) => test.status === "active"))
//         } catch (error) {
//             console.error("Error fetching test series:", error)

//         } finally {
//             setLoading(false)
//         }
//     }

//     const changeHandler = (e) => {
//         const { name, value, type, checked } = e.target
//         setFormval((prevVal) => ({
//             ...prevVal,
//             [name]: type === "checkbox" ? checked : value,
//         }))
//     }

//     const handleFileChange = (e) => {
//         const file = e.target.files[0]
//         if (file) {
//             setSelectedFile(file)
//             const reader = new FileReader()
//             reader.onload = () => {
//                 setPreviewUrl(reader.result)
//             }
//             reader.readAsDataURL(file)
//         }
//     }

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
//             const reader = new FileReader()
//             reader.onload = () => {
//                 setPreviewUrl(reader.result)
//             }
//             reader.readAsDataURL(file)
//         }
//     }

//     const removeFile = () => {
//         setSelectedFile(null)
//         setPreviewUrl(null)
//     }

//     const handleAddTest = (test) => {
//         if (!selectedTests.find((t) => t._id === test._id)) {
//             setSelectedTests([...selectedTests, test])
//         }
//     }

//     const handleRemoveTest = (testId) => {
//         setSelectedTests(selectedTests.filter((test) => test._id !== testId))
//     }

//     const filteredTests = availableTests.filter(
//         (test) =>
//             test.title.toLowerCase().includes(searchTerm.toLowerCase()) && !selectedTests.find((t) => t._id === test._id),
//     )

//     const handleSubmit = async (e) => {
//         e.preventDefault()

//         // Form validation
//         if (!formval.title) {
//             return toastify.error("Title is required")
//         }
//         if (!formval.description) {
//             return toastify.error("Description is required")
//         }
//         if (!formval.price) {
//             return toastify.error("Price is required")
//         }
//         if (!formval.validityDays) {
//             return toastify.error("Validity period is required")
//         }
//         if (!formval.status) {
//             return toastify.error("Status is required")
//         }
//         if (selectedTests.length === 0) {
//             return toastify.error("Please select at least one test series")
//         }

//         setLoading(true)

//         try {
//             const formData = new FormData()

//             // Append all form fields
//             Object.keys(formval).forEach((key) => {
//                 formData.append(key, formval[key])
//             })

//             // Append test series IDs
//             formData.append("testSeriesIds", JSON.stringify(selectedTests.map((test) => test._id)))

//             // Append image if selected
//             if (selectedFile) {
//                 formData.append("image", selectedFile)
//             }

//             const response = await axios(`${baseUrl}/api/v1/admin/test-packages/store`, {
//                 method: "POST",
//                 headers: {
//                     Authorization: localStorage.getItem("token"),
//                 },
//                 data: formData,
//             })

//             if (!response?.data?.status) {
//                 toastify.error("An error occurred while creating test package")
//                 return
//             }

//             toastify.success("Test package created successfully")
//             navigate("/test-packages")
//         } catch (error) {
//             console.error("Error:", error)
//             toastify.error("Failed to create test package")
//         } finally {
//             setLoading(false)
//         }
//     }

//     return (
//         <>
//             <style jsx>{`
//         .main-sec {
//           background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
//           min-height: 100vh;
//           padding: 2rem 0;
//         }

//         .dashboard-title {
//           margin-bottom: 1.5rem;
//         }

//         .dash-head {
//           color: #333;
//           font-size: 1.8rem;
//           font-weight: 700;
//           margin: 0;
//         }

//         .cards {
//           background: white;
//           border-radius: 15px;
//           padding: 2rem;
//           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
//           margin-bottom: 2rem;
//         }

//         .form-label {
//           font-weight: 600;
//           color: #555;
//           margin-bottom: 0.5rem;
//         }

//         .form-control {
//           border-radius: 8px;
//           border: 1px solid #ddd;
//           padding: 0.75rem 1rem;
//           transition: all 0.3s ease;
//         }

//         .form-control:focus {
//           border-color: #667eea;
//           box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.25);
//         }

//         .form-section {
//           background: #f8f9ff;
//           border-radius: 10px;
//           padding: 1.5rem;
//           margin-bottom: 2rem;
//           border-left: 4px solid #667eea;
//         }

//         .section-title {
//           color: #667eea;
//           font-weight: 700;
//           margin-bottom: 1rem;
//           font-size: 1.1rem;
//         }

//         .checkbox-container {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           margin-bottom: 1rem;
//         }

//         .checkbox-container input[type="checkbox"] {
//           accent-color: #667eea;
//           width: 18px;
//           height: 18px;
//         }

//         .file-upload-container {
//           margin-bottom: 1.5rem;
//         }

//         .file-upload-area {
//           border: 2px dashed #ddd;
//           border-radius: 10px;
//           padding: 2rem;
//           text-align: center;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           position: relative;
//         }

//         .file-upload-area.dragging {
//           border-color: #667eea;
//           background: rgba(102, 126, 234, 0.1);
//         }

//         .file-upload-area:hover {
//           border-color: #667eea;
//         }

//         .file-upload-icon {
//           font-size: 3rem;
//           color: #667eea;
//           margin-bottom: 1rem;
//         }

//         .file-upload-text {
//           font-size: 1.1rem;
//           font-weight: 600;
//           color: #333;
//           margin-bottom: 0.5rem;
//         }

//         .file-upload-subtext {
//           color: #666;
//           font-size: 0.9rem;
//         }

//         .file-upload-input {
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           opacity: 0;
//           cursor: pointer;
//         }

//         .file-preview-container {
//           position: relative;
//           display: inline-block;
//         }

//         .file-preview {
//           max-width: 200px;
//           max-height: 200px;
//           border-radius: 10px;
//           box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
//         }

//         .file-remove-btn {
//           position: absolute;
//           top: -10px;
//           right: -10px;
//           background: #ef5350;
//           color: white;
//           border: none;
//           border-radius: 50%;
//           width: 30px;
//           height: 30px;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .file-info {
//           margin-top: 1rem;
//           font-size: 0.9rem;
//           color: #666;
//         }

//         .btn-for-add {
//           background: #008080;
//           border: none;
//           border-radius: 8px;
//           padding: 0.75rem 2rem;
//           font-weight: 600;
//           transition: all 0.3s ease;
//           color: white;
//         }

//         .btn-for-add:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
//         }

//         .btn-for-add:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//           transform: none;
//         }

//         .btn-info {
//           background: #4facfe;
//           border: none;
//           border-radius: 8px;
//           padding: 0.75rem 1.5rem;
//           font-weight: 600;
//           transition: all 0.3s ease;
//         }

//         .btn-info:hover {
//           background: #2f86fe;
//           transform: translateY(-2px);
//           box-shadow: 0 10px 20px rgba(79, 172, 254, 0.3);
//         }

//         .loading-spinner {
//           width: 20px;
//           height: 20px;
//           border: 2px solid #f3f3f3;
//           border-top: 2px solid #667eea;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//           margin-right: 0.5rem;
//         }

//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }

//         .test-selection-container {
//           display: flex;
//           flex-direction: column;
//           gap: 1.5rem;
//         }

//         .search-container {
//           position: relative;
//         }

//         .search-icon {
//           position: absolute;
//           left: 1rem;
//           top: 50%;
//           transform: translateY(-50%);
//           color: #999;
//         }

//         .search-input {
//           padding-left: 2.5rem;
//           width: 100%;
//         }

//         .available-tests {
//           border: 1px solid #ddd;
//           border-radius: 8px;
//           max-height: 300px;
//           overflow-y: auto;
//         }

//         .test-item {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           padding: 0.75rem 1rem;
//           border-bottom: 1px solid #eee;
//           transition: all 0.3s ease;
//         }

//         .test-item:last-child {
//           border-bottom: none;
//         }

//         .test-item:hover {
//           background: #f8f9ff;
//         }

//         .test-info {
//           display: flex;
//           align-items: center;
//           gap: 1rem;
//         }

//         .test-image {
//           width: 40px;
//           height: 40px;
//           border-radius: 6px;
//           object-fit: cover;
//         }

//         .test-details h6 {
//           margin: 0;
//           font-weight: 600;
//           color: #333;
//           font-size: 0.9rem;
//         }

//         .test-details p {
//           margin: 0;
//           color: #666;
//           font-size: 0.8rem;
//         }

//         .add-test-btn {
//           background: #667eea;
//           color: white;
//           border: none;
//           border-radius: 6px;
//           width: 30px;
//           height: 30px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }

//         .add-test-btn:hover {
//           background: #5a6eea;
//           transform: scale(1.1);
//         }

//         .selected-tests {
//           border: 1px solid #ddd;
//           border-radius: 8px;
//           padding: 1rem;
//         }

//         .selected-test-item {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           padding: 0.75rem;
//           background: #f8f9ff;
//           border-radius: 8px;
//           margin-bottom: 0.75rem;
//         }

//         .selected-test-item:last-child {
//           margin-bottom: 0;
//         }

//         .remove-test-btn {
//           background: #ef5350;
//           color: white;
//           border: none;
//           border-radius: 6px;
//           width: 30px;
//           height: 30px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }

//         .remove-test-btn:hover {
//           background: #e53935;
//           transform: scale(1.1);
//         }

//         .empty-message {
//           text-align: center;
//           padding: 2rem;
//           color: #666;
//         }

//         @media (max-width: 768px) {
//           .cards {
//             padding: 1.5rem;
//           }

//           .form-section {
//             padding: 1rem;
//           }
//         }
//       `}</style>

//             <section className="main-sec">
//                 <div className="container">
//                     <div className="row align-items-center">
//                         <div className="col-lg-6">
//                             <div className="dashboard-title">
//                                 <h4 className="dash-head">
//                                     <FontAwesomeIcon icon={faBoxOpen} className="me-2" />
//                                     Add Test Package
//                                 </h4>
//                             </div>
//                             <div className="custom-bredcump">
//                                 <nav aria-label="breadcrumb">
//                                     <ol className="breadcrumb">
//                                         <li className="breadcrumb-item">
//                                             <Link to="/">Dashboard</Link>
//                                         </li>
//                                         <li className="breadcrumb-item">
//                                             <Link to="/test-packages">Test Packages</Link>
//                                         </li>
//                                         <li className="breadcrumb-item active" aria-current="page">
//                                             Add Test Package
//                                         </li>
//                                     </ol>
//                                 </nav>
//                             </div>
//                         </div>
//                         <div className="col-lg-6 d-flex justify-content-end">
//                             <Link to="/test-packages" className="btn btn-info text-white">
//                                 <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
//                                 Back
//                             </Link>
//                         </div>
//                     </div>

//                     <div className="row">
//                         <div className="col-lg-12">
//                             <div className="cards edit-usr">
//                                 <form onSubmit={handleSubmit}>
//                                     {/* Basic Information */}
//                                     <div className="form-section">
//                                         <h5 className="section-title">Basic Information</h5>
//                                         <div className="row">
//                                             <div className="col-lg-6 mb-4">
//                                                 <label htmlFor="title" className="form-label">
//                                                     Package Title<sup className="text-danger">*</sup>
//                                                 </label>
//                                                 <input
//                                                     type="text"
//                                                     className="form-control"
//                                                     name="title"
//                                                     placeholder="Enter package title"
//                                                     onChange={changeHandler}
//                                                     value={formval?.title}
//                                                 />
//                                             </div>
//                                             {/* <div className="col-lg-6 mb-4">
//                                                 <label htmlFor="validityDays" className="form-label">
//                                                     Validity (days)<sup className="text-danger">*</sup>
//                                                 </label>
//                                                 <input
//                                                     type="number"
//                                                     className="form-control"
//                                                     name="validityDays"
//                                                     placeholder="365"
//                                                     onChange={changeHandler}
//                                                     value={formval?.validityDays}
//                                                 />
//                                             </div> */}
//                                             <div className="col-lg-6 mb-4">
//                                                 <label htmlFor="price" className="form-label">
//                                                     Price (₹)<sup className="text-danger">*</sup>
//                                                 </label>
//                                                 <input
//                                                     type="number"
//                                                     className="form-control"
//                                                     name="price"
//                                                     placeholder="999"
//                                                     onChange={changeHandler}
//                                                     value={formval?.price}
//                                                 />
//                                             </div>
//                                             <div className="col-lg-12 mb-4">
//                                                 <label htmlFor="description" className="form-label">
//                                                     Description<sup className="text-danger">*</sup>
//                                                 </label>
//                                                 <textarea
//                                                     className="form-control"
//                                                     name="description"
//                                                     rows="4"
//                                                     placeholder="Enter package description"
//                                                     onChange={changeHandler}
//                                                     value={formval?.description}
//                                                 ></textarea>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Pricing */}
//                                     {/* <div className="form-section">
//                                         <h5 className="section-title">Pricing</h5>
//                                         <div className="row">
//                                             <div className="col-lg-6 mb-4">
//                                                 <label htmlFor="price" className="form-label">
//                                                     Regular Price (₹)<sup className="text-danger">*</sup>
//                                                 </label>
//                                                 <input
//                                                     type="number"
//                                                     className="form-control"
//                                                     name="price"
//                                                     placeholder="999"
//                                                     onChange={changeHandler}
//                                                     value={formval?.price}
//                                                 />
//                                             </div>
//                                             <div className="col-lg-6 mb-4">
//                                                 <label htmlFor="discountPrice" className="form-label">
//                                                     Discount Price (₹)
//                                                 </label>
//                                                 <input
//                                                     type="number"
//                                                     className="form-control"
//                                                     name="discountPrice"
//                                                     placeholder="799"
//                                                     onChange={changeHandler}
//                                                     value={formval?.discountPrice}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div> */}

//                                     {/* Test Series Selection */}
//                                     {/* <div className="form-section">
//                                         <h5 className="section-title">Select Test Series</h5>
//                                         <div className="test-selection-container">
//                                             <div className="search-container">
//                                                 <FontAwesomeIcon icon={faSearch} className="search-icon" />
//                                                 <input
//                                                     type="text"
//                                                     className="form-control search-input"
//                                                     placeholder="Search test series..."
//                                                     value={searchTerm}
//                                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                                 />
//                                             </div>

//                                             <div className="available-tests">
//                                                 {loading ? (
//                                                     <div className="d-flex justify-content-center p-4">
//                                                         <div className="loading-spinner"></div>
//                                                         <span className="ms-2">Loading test series...</span>
//                                                     </div>
//                                                 ) : filteredTests.length === 0 ? (
//                                                     <div className="empty-message">
//                                                         {searchTerm
//                                                             ? "No matching test series found"
//                                                             : availableTests.length === 0
//                                                                 ? "No test series available"
//                                                                 : "All test series have been selected"}
//                                                     </div>
//                                                 ) : (
//                                                     filteredTests.map((test) => (
//                                                         <div key={test._id} className="test-item">
//                                                             <div className="test-info">
//                                                                 <img
//                                                                     src={test?.image || "/placeholder.svg?height=40&width=40&query=test"}
//                                                                     alt={test?.title}
//                                                                     className="test-image"
//                                                                 />
//                                                                 <div className="test-details">
//                                                                     <h6>{test.title}</h6>
//                                                                     <p>
//                                                                         {test.totalQuestions} questions • {test.duration} min • ₹{test.price || "Free"}
//                                                                     </p>
//                                                                 </div>
//                                                             </div>
//                                                             <button
//                                                                 type="button"
//                                                                 className="add-test-btn"
//                                                                 onClick={() => handleAddTest(test)}
//                                                                 title="Add to package"
//                                                             >
//                                                                 <FontAwesomeIcon icon={faPlus} />
//                                                             </button>
//                                                         </div>
//                                                     ))
//                                                 )}
//                                             </div>

//                                             <div className="mt-4">
//                                                 <h6 className="mb-3">Selected Test Series ({selectedTests.length})</h6>
//                                                 <div className="selected-tests">
//                                                     {selectedTests.length === 0 ? (
//                                                         <div className="empty-message">No test series selected yet</div>
//                                                     ) : (
//                                                         selectedTests.map((test) => (
//                                                             <div key={test._id} className="selected-test-item">
//                                                                 <div className="test-info">
//                                                                     <img
//                                                                         src={test?.image || "/placeholder.svg?height=40&width=40&query=test"}
//                                                                         alt={test?.title}
//                                                                         className="test-image"
//                                                                     />
//                                                                     <div className="test-details">
//                                                                         <h6>{test.title}</h6>
//                                                                         <p>
//                                                                             {test.totalQuestions} questions • {test.duration} min • ₹{test.price || "Free"}
//                                                                         </p>
//                                                                     </div>
//                                                                 </div>
//                                                                 <button
//                                                                     type="button"
//                                                                     className="remove-test-btn"
//                                                                     onClick={() => handleRemoveTest(test._id)}
//                                                                     title="Remove from package"
//                                                                 >
//                                                                     <FontAwesomeIcon icon={faTimes} />
//                                                                 </button>
//                                                             </div>
//                                                         ))
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div> */}

//                                     {/* Package Image */}
//                                     <div className="form-section">
//                                         <h5 className="section-title">Package Image</h5>
//                                         <div className="file-upload-container">
//                                             <div
//                                                 className={`file-upload-area ${isDragging ? "dragging" : ""}`}
//                                                 onDragOver={handleDragOver}
//                                                 onDragLeave={handleDragLeave}
//                                                 onDrop={handleDrop}
//                                             >
//                                                 {!selectedFile ? (
//                                                     <>
//                                                         <div className="file-upload-icon">
//                                                             <FontAwesomeIcon icon={faUpload} />
//                                                         </div>
//                                                         <div className="file-upload-text">Drag & Drop your image here</div>
//                                                         <div className="file-upload-subtext">or click to browse files</div>
//                                                         <input
//                                                             type="file"
//                                                             className="file-upload-input"
//                                                             accept="image/*"
//                                                             onChange={handleFileChange}
//                                                         />
//                                                     </>
//                                                 ) : (
//                                                     <div className="file-preview-container">
//                                                         <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="file-preview" />
//                                                         <button type="button" className="file-remove-btn" onClick={removeFile}>
//                                                             <FontAwesomeIcon icon={faTimes} />
//                                                         </button>
//                                                         <div className="file-info">
//                                                             {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Additional Settings */}
//                                     {/* <div className="form-section">
//                                         <h5 className="section-title">Additional Settings</h5>
//                                         <div className="row">
//                                             <div className="col-lg-4 mb-3">
//                                                 <div className="checkbox-container">
//                                                     <input
//                                                         type="checkbox"
//                                                         name="isPopular"
//                                                         checked={formval.isPopular}
//                                                         onChange={changeHandler}
//                                                     />
//                                                     <label>Mark as Popular</label>
//                                                 </div>
//                                             </div>
//                                             <div className="col-lg-4 mb-3">
//                                                 <div className="checkbox-container">
//                                                     <input
//                                                         type="checkbox"
//                                                         name="isFeatured"
//                                                         checked={formval.isFeatured}
//                                                         onChange={changeHandler}
//                                                     />
//                                                     <label>Mark as Featured</label>
//                                                 </div>
//                                             </div>
//                                             <div className="col-lg-4 mb-3">
//                                                 <div className="checkbox-container">
//                                                     <input
//                                                         type="checkbox"
//                                                         name="showOnHomepage"
//                                                         checked={formval.showOnHomepage}
//                                                         onChange={changeHandler}
//                                                     />
//                                                     <label>Show on Homepage</label>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div> */}

//                                     {/* Status */}
//                                     <div className="form-section">
//                                         <h5 className="section-title">Status</h5>
//                                         <div className="row">
//                                             <div className="col-lg-6 mb-4">
//                                                 <label htmlFor="status" className="form-label">
//                                                     Status<sup className="text-danger">*</sup>
//                                                 </label>
//                                                 <select className="form-control" name="status" onChange={changeHandler} value={formval?.status}>
//                                                     <option value="">Select Status</option>
//                                                     <option value="active">Active</option>
//                                                     <option value="inactive">Inactive</option>
//                                                 </select>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="col-lg-12 text-center mt-4">
//                                         <button type="submit" className="btn btn-for-add text-white" disabled={loading}>
//                                             {loading && <div className="loading-spinner"></div>}
//                                             <FontAwesomeIcon icon={faSave} className="me-2" />
//                                             {loading ? "Creating..." : "Create Package"}
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </>
//     )
// }
"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { baseUrl } from "../../config/baseUrl"
import axios from "axios"
import toastify from "../../config/toastify"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faBoxOpen, faSave, faUpload, faTimes } from "@fortawesome/free-solid-svg-icons"
import ReactQuill from "react-quill"

export default function AddPackage() {
    const [formval, setFormval] = useState({
        title: "",
        description: "",
        price: "",
        offerPrice: "",
        status: "",
        subcategoryID: "",
        categoryID: "",
        validity: "1 yr.",
    })

    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [loading, setLoading] = useState(false)
    const [subcategories, setSubcategories] = useState([])

    const navigate = useNavigate()

    const changeHandler = (e) => {
        const { name, value } = e.target
        setFormval((prevVal) => ({
            ...prevVal,
            [name]: value,
        }))
    }
    const handleQuillChange = (value) => {
        setFormval((prevVal) => ({
            ...prevVal,
            description: value,
        }));
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onload = () => {
                setPreviewUrl(reader.result)
            }
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

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onload = () => {
                setPreviewUrl(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeFile = () => {
        setSelectedFile(null)
        setPreviewUrl(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Form validation
        if (!formval.title) {
            return toastify.error("Title is required")
        }
        if (!formval.description) {
            return toastify.error("Description is required")
        }
        if (!formval.price) {
            return toastify.error("Price is required")
        }
        if (!formval.status) {
            return toastify.error("Status is required")
        }
        if (!formval.subcategoryID) {
            return toastify.error("Subcategory is required")
        }
        if (!formval.categoryID) {
            return toastify.error("Category is required")
        }

        setLoading(true)

        try {
            const formData = new FormData()

            // Append all form fields
            Object.keys(formval).forEach((key) => {
                formData.append(key, formval[key])
            })

            // Append image if selected
            if (selectedFile) {
                formData.append("image", selectedFile)
            }

            const response = await axios(`${baseUrl}/package`, {
                method: "POST",
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
                data: formData,
            })

            if (!response?.data?.status) {
                toastify.error("An error occurred while creating package")
                return
            }

            toastify.success("Package created successfully")
            navigate("/test-packages")
        } catch (error) {
            console.error("Error:", error)
            toastify.error("Failed to create package")
        } finally {
            setLoading(false)
        }
    }
    const [categories, setCategories] = useState([])
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${baseUrl}/category`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })
            setCategories(response.data.data)
        } catch (error) {
            console.error("Error fetching subcategories:", error)
        }
    }
    const fetchSubcategories = async () => {
        try {
            const response = await axios.get(`${baseUrl}/subcategory`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })
            setSubcategories(response.data.data)
        } catch (error) {
            console.error("Error fetching subcategories:", error)
        }
    }

    useEffect(() => {
        fetchSubcategories()
        fetchCategories()
    }, [])

    const filteredSubCat = formval.categoryID
        ? subcategories.filter((subcat) => subcat?.categoryId?._id === formval.categoryID)
        : subcategories;
    return (
        <>
            <style >{`
        

        .dashboard-title {
          margin-bottom: 1.5rem;
        }

        .dash-head {
          color: #333;
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0;
        }

        .cards {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .form-label {
          font-weight: 600;
          color: #555;
          margin-bottom: 0.5rem;
        }

        .form-control {
          border-radius: 8px;
          border: 1px solid #ddd;
          padding: 0.75rem 1rem;
          transition: all 0.3s ease;
        }

        .form-control:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.25);
        }

        .form-section {
          background: #f8f9ff;
          border-radius: 10px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          border-left: 4px solid #667eea;
        }

        .section-title {
          color: #667eea;
          font-weight: 700;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .file-upload-container {
          margin-bottom: 1.5rem;
        }

        .file-upload-area {
          border: 2px dashed #ddd;
          border-radius: 10px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .file-upload-area.dragging {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.1);
        }

        .file-upload-area:hover {
          border-color: #667eea;
        }

        .file-upload-icon {
          font-size: 3rem;
          color: #667eea;
          margin-bottom: 1rem;
        }

        .file-upload-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .file-upload-subtext {
          color: #666;
          font-size: 0.9rem;
        }

        .file-upload-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .file-preview-container {
          position: relative;
          display: inline-block;
        }

        .file-preview {
          max-width: 200px;
          max-height: 200px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .file-remove-btn {
          position: absolute;
          top: -10px;
          right: -10px;
          background: #ef5350;
          color: white;
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .file-info {
          margin-top: 1rem;
          font-size: 0.9rem;
          color: #666;
        }

        .btn-for-add {
          background: #008080;
          border: none;
          border-radius: 8px;
          padding: 0.75rem 2rem;
          font-weight: 600;
          transition: all 0.3s ease;
          color: white;
        }

        .btn-for-add:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .btn-for-add:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-info {
          background: #4facfe;
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-info:hover {
          background: #2f86fe;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(79, 172, 254, 0.3);
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 0.5rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .cards {
            padding: 1.5rem;
          }
          
          .form-section {
            padding: 1rem;
          }
        }
      `}</style>

            <section className="main-sec">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="dashboard-title">
                                <h4 className="dash-head">
                                    <FontAwesomeIcon icon={faBoxOpen} className="me-2" />
                                    Add Package
                                </h4>
                            </div>
                            <div className="custom-bredcump">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link to="/">Dashboard</Link>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <Link to="/packages">Packages</Link>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            Add Package
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                        <div className="col-lg-6 d-flex justify-content-end">
                            <Link to="/test-packages" className="btn btn-info text-white">
                                <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                                Back
                            </Link>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="cards edit-usr">
                                <form onSubmit={handleSubmit}>
                                    {/* Basic Information */}
                                    <div className="form-section">
                                        <h5 className="section-title">Package Details</h5>
                                        <div className="row">
                                            <div className="col-lg-6 mb-4">
                                                <label htmlFor="title" className="form-label">
                                                    Title<sup className="text-danger">*</sup>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="title"
                                                    placeholder="Enter package title"
                                                    onChange={changeHandler}
                                                    value={formval?.title}
                                                />
                                            </div>
                                            <div className="col-lg-6 mb-4">
                                                <label htmlFor="price" className="form-label">
                                                    Price (₹)<sup className="text-danger">*</sup>
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="price"
                                                    placeholder="Enter price"
                                                    onChange={changeHandler}
                                                    value={formval?.price}
                                                />
                                            </div>
                                            <div className="col-lg-6 mb-4">
                                                <label htmlFor="offerPrice" className="form-label">
                                                    Offer Price (₹)
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="offerPrice"
                                                    placeholder="Enter offer price"
                                                    onChange={changeHandler}
                                                    value={formval?.offerPrice}
                                                />
                                            </div>
                                            <div className="col-lg-6 mb-4">
                                                <label htmlFor="validity" className="form-label">
                                                    Validity (Default: 1 yr)
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="validity"
                                                    placeholder="Enter Validity (Eg: 1 month, 3 months etc.)"
                                                    onChange={changeHandler}
                                                    value={formval?.validity}
                                                />
                                            </div>
                                            <div className="col-lg-12 mb-4">
                                                <label htmlFor="description" className="form-label">
                                                    Description<sup className="text-danger">*</sup>
                                                </label>
                                                {/* <textarea
                                                    className="form-control"
                                                    name="description"
                                                    rows="4"
                                                    placeholder="Enter package description"
                                                    onChange={changeHandler}
                                                    value={formval?.description}
                                                ></textarea> */}
                                                <ReactQuill
                                                    value={formval.description}
                                                    onChange={handleQuillChange}
                                                />

                                            </div>
                                        </div>
                                    </div>

                                    {/* Package Image */}
                                    <div className="form-section">
                                        <h5 className="section-title">Package Image</h5>
                                        <div className="file-upload-container">
                                            <div
                                                className={`file-upload-area ${isDragging ? "dragging" : ""}`}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                            >
                                                {!selectedFile ? (
                                                    <>
                                                        <div className="file-upload-icon">
                                                            <FontAwesomeIcon icon={faUpload} />
                                                        </div>
                                                        <div className="file-upload-text">Drag & Drop your image here</div>
                                                        <div className="file-upload-subtext">or click to browse files</div>
                                                        <input
                                                            type="file"
                                                            className="file-upload-input"
                                                            accept="image/*"
                                                            onChange={handleFileChange}
                                                        />
                                                    </>
                                                ) : (
                                                    <div className="file-preview-container">
                                                        <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="file-preview" />
                                                        <button type="button" className="file-remove-btn" onClick={removeFile}>
                                                            <FontAwesomeIcon icon={faTimes} />
                                                        </button>
                                                        <div className="file-info">
                                                            {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-section">
                                        <h5 className="section-title">Category Selection</h5>
                                        <div className="row">
                                            <div className="col-lg-6 mb-4">
                                                <label htmlFor="subcategoryID" className="form-label">
                                                    Category<sup className="text-danger">*</sup>
                                                </label>
                                                <select
                                                    className="form-control"
                                                    name="categoryID"
                                                    onChange={changeHandler}
                                                    value={formval?.categoryID}
                                                >
                                                    <option value="">Select Category</option>
                                                    {categories.map((cat) => (
                                                        <option key={cat._id} value={cat._id}>
                                                            {cat?.title}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-lg-6 mb-4">
                                                <label htmlFor="subcategoryID" className="form-label">
                                                    Subcategory<sup className="text-danger">*</sup>
                                                </label>
                                                <select
                                                    className="form-control"
                                                    name="subcategoryID"
                                                    onChange={changeHandler}
                                                    value={formval?.subcategoryID}
                                                >
                                                    <option value="">Select Subcategory</option>
                                                    {filteredSubCat.map((subcat) => (
                                                        <option key={subcat._id} value={subcat._id}>
                                                            {subcat.title}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="form-section">
                                        <h5 className="section-title">Status</h5>
                                        <div className="row">
                                            <div className="col-lg-6 mb-4">
                                                <label htmlFor="status" className="form-label">
                                                    Status<sup className="text-danger">*</sup>
                                                </label>
                                                <select className="form-control" name="status" onChange={changeHandler} value={formval?.status}>
                                                    <option value="">Select Status</option>
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-12 text-center mt-4">
                                        <button type="submit" className="btn btn-for-add text-white" disabled={loading}>
                                            {loading && <div className="loading-spinner"></div>}
                                            <FontAwesomeIcon icon={faSave} className="me-2" />
                                            {loading ? "Creating..." : "Create Package"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
