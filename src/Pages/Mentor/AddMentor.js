// "use client"

// import { useState } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { toast } from "react-toastify"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faUserTie, faTrash, faSave, faTimes } from "@fortawesome/free-solid-svg-icons"
// import ReactQuill from "react-quill"
// import "react-quill/dist/quill.snow.css"
// import { baseUrl } from "../../config/baseUrl"

// export default function AddMentor() {
//     const navigate = useNavigate()
//     const [loading, setLoading] = useState(false)
//     const [formData, setFormData] = useState({
//         mentorName: "",
//         qualification: "",
//         specialization: "",
//         location: "",
//         email: "",
//         password: "",
//         contact: "",
//         mentorAmount: "",
//         mentorPhoto: null,
//         aboutMentor: "",
//         experience: "",
//         professionalBackground: "",
//         contactPersonName: "",
//         contactPersonNumber: "",
//         ownerName: "",
//         ownerPhoneNumber: "",
//         adminCommission: "",
//         bankName: "",
//         bankIfscCode: "",
//         bankAccountNumber: "",
//     })

//     const [slots, setSlots] = useState([
//         {
//             mentorDay: "",
//             fromTimeHours: "",
//             fromTimestamp: "AM",
//             toTimeHours: "",
//             toTimestamp: "AM",
//         },
//     ])

//     const specializationOptions = [
//         "Mathematics",
//         "Physics",
//         "Chemistry",
//         "Biology",
//         "Computer Science",
//         "English",
//         "History",
//         "Geography",
//         "Economics",
//         "Accounting",
//         "Business Studies",
//         "Psychology",
//         "Sociology",
//     ]

//     const dayOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

//     const timeOptions = [
//         "1:00",
//         "2:00",
//         "3:00",
//         "4:00",
//         "5:00",
//         "6:00",
//         "7:00",
//         "8:00",
//         "9:00",
//         "10:00",
//         "11:00",
//         "12:00",
//     ]

//     const handleInputChange = (e) => {
//         const { name, value } = e.target
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }))
//     }

//     const handleFileChange = (e) => {
//         const file = e.target.files[0]
//         if (file) {
//             if (file.size > 2 * 1024 * 1024) {
//                 // 2MB limit
//                 toast.error("File size should be less than 2MB")
//                 return
//             }
//             setFormData((prev) => ({
//                 ...prev,
//                 mentorPhoto: file,
//             }))
//         }
//     }

//     const handleAboutMentorChange = (value) => {
//         setFormData((prev) => ({
//             ...prev,
//             aboutMentor: value,
//         }))
//     }

//     const handleSlotChange = (index, field, value) => {
//         const updatedSlots = [...slots]
//         updatedSlots[index][field] = value
//         setSlots(updatedSlots)
//     }

//     const addMoreSlots = () => {
//         setSlots([
//             ...slots,
//             {
//                 mentorDay: "",
//                 fromTimeHours: "",
//                 fromTimestamp: "AM",
//                 toTimeHours: "",
//                 toTimestamp: "AM",
//             },
//         ])
//     }

//     const removeSlot = (index) => {
//         if (slots.length > 1) {
//             const updatedSlots = slots.filter((_, i) => i !== index)
//             setSlots(updatedSlots)
//         }
//     }

//     const validateForm = () => {
//         const requiredFields = [
//             "mentorName",
//             "qualification",
//             "specialization",
//             "location",
//             "email",
//             "password",
//             "contact",
//             "mentorAmount",
//             "aboutMentor",
//             "experience",
//             "professionalBackground",
//             "contactPersonName",
//             "contactPersonNumber",
//             "ownerName",
//             "ownerPhoneNumber",
//             "adminCommission",
//             "bankName",
//             "bankIfscCode",
//             "bankAccountNumber",
//         ]

//         for (const field of requiredFields) {
//             if (!formData[field] || formData[field].toString().trim() === "") {
//                 toast.error(`${field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())} is required`)
//                 return false
//             }
//         }

//         // Validate email format
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//         if (!emailRegex.test(formData.email)) {
//             toast.error("Please enter a valid email address")
//             return false
//         }

//         // Validate phone numbers
//         const phoneRegex = /^[0-9]{10}$/
//         if (!phoneRegex.test(formData.contact)) {
//             toast.error("Contact number should be 10 digits")
//             return false
//         }

//         if (!phoneRegex.test(formData.contactPersonNumber)) {
//             toast.error("Contact person number should be 10 digits")
//             return false
//         }

//         if (!phoneRegex.test(formData.ownerPhoneNumber)) {
//             toast.error("Owner phone number should be 10 digits")
//             return false
//         }

//         // Validate mentor amount
//         if (isNaN(formData.mentorAmount) || Number.parseFloat(formData.mentorAmount) <= 0) {
//             toast.error("Please enter a valid mentor amount")
//             return false
//         }

//         // Validate admin commission
//         if (
//             isNaN(formData.adminCommission) ||
//             Number.parseFloat(formData.adminCommission) < 0 ||
//             Number.parseFloat(formData.adminCommission) > 100
//         ) {
//             toast.error("Admin commission should be between 0 and 100")
//             return false
//         }

//         // Validate slots
//         for (let i = 0; i < slots.length; i++) {
//             const slot = slots[i]
//             if (!slot.mentorDay || !slot.fromTimeHours || !slot.toTimeHours) {
//                 toast.error(`Please fill all fields for slot ${i + 1}`)
//                 return false
//             }
//         }

//         return true
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault()

//         if (!validateForm()) {
//             return
//         }

//         setLoading(true)

//         try {
//             const submitData = new FormData()

//             // Add all form fields
//             Object.keys(formData).forEach((key) => {
//                 if (key !== "mentorPhoto") {
//                     submitData.append(key, formData[key])
//                 }
//             })

//             // Add photo if selected
//             if (formData.mentorPhoto) {
//                 submitData.append("mentorPhoto", formData.mentorPhoto)
//             }

//             // Add slots
//             submitData.append("slots", JSON.stringify(slots))

//             const response = await fetch(`${baseUrl}/mentors`, {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//                 body: submitData,
//             })

//             const data = await response.json()

//             if (data.status) {
//                 toast.success("Mentor added successfully!")
//                 navigate("/mentors")
//             } else {
//                 toast.error(data.message || "Failed to add mentor")
//             }
//         } catch (error) {
//             console.error("Error adding mentor:", error)
//             toast.error("Failed to add mentor")
//         } finally {
//             setLoading(false)
//         }
//     }

//     const quillModules = {
//         toolbar: [
//             [{ header: [1, 2, false] }],
//             ["bold", "italic", "underline", "strike"],
//             [{ list: "ordered" }, { list: "bullet" }],
//             ["link", "image"],
//             [{ align: [] }],
//             ["clean"],
//         ],
//     }

//     return (
//         <>
//             <section className="main-sec">
//                 <div className="container">
//                     <div className="row">
//                         <div className="col-lg-6">
//                             <div className="dashboard-title">
//                                 <h4 className="dash-head">
//                                     <FontAwesomeIcon icon={faUserTie} className="me-2" />
//                                     Add Mentor
//                                 </h4>
//                             </div>
//                             <div className="custom-bredcump">
//                                 <nav aria-label="breadcrumb">
//                                     <ol className="breadcrumb">
//                                         <li className="breadcrumb-item">
//                                             <Link to="/">Dashboard</Link>
//                                         </li>
//                                         <li className="breadcrumb-item">
//                                             <Link to="/mentors">Mentors</Link>
//                                         </li>
//                                         <li className="breadcrumb-item active" aria-current="page">
//                                             Add Mentor
//                                         </li>
//                                     </ol>
//                                 </nav>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="row">
//                         <div className="col-lg-12">
//                             <div className="cards">
//                                 <form onSubmit={handleSubmit}>
//                                     <div className="row">
//                                         {/* Mentor Name */}
//                                         <div className="col-md-6 mb-3">
//                                             <label className="form-label">
//                                                 Mentor Name<span className="text-danger">*</span>
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 name="mentorName"
//                                                 placeholder="Enter Mentor Name"
//                                                 value={formData.mentorName}
//                                                 onChange={handleInputChange}
//                                                 required
//                                             />
//                                         </div>

//                                         {/* Qualification */}
//                                         <div className="col-md-6 mb-3">
//                                             <label className="form-label">
//                                                 Qualification<span className="text-danger">*</span>
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 name="qualification"
//                                                 placeholder="Enter qualification"
//                                                 value={formData.qualification}
//                                                 onChange={handleInputChange}
//                                                 required
//                                             />
//                                         </div>

//                                         {/* Specialization */}
//                                         <div className="col-md-6 mb-3">
//                                             <label className="form-label">
//                                                 Specialization<span className="text-danger">*</span>
//                                             </label>
//                                             <select
//                                                 className="form-select"
//                                                 name="specialization"
//                                                 value={formData.specialization}
//                                                 onChange={handleInputChange}
//                                                 required
//                                             >
//                                                 <option value="">Select Specialization</option>
//                                                 {specializationOptions.map((spec) => (
//                                                     <option key={spec} value={spec}>
//                                                         {spec}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </div>

//                                         {/* Location */}
//                                         <div className="col-md-6 mb-3">
//                                             <label className="form-label">
//                                                 Location<span className="text-danger">*</span>
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 name="location"
//                                                 placeholder="Enter location"
//                                                 value={formData.location}
//                                                 onChange={handleInputChange}
//                                                 required
//                                             />
//                                         </div>

//                                         {/* Email */}
//                                         <div className="col-md-6 mb-3">
//                                             <label className="form-label">
//                                                 Email<span className="text-danger">*</span>
//                                             </label>
//                                             <input
//                                                 type="email"
//                                                 className="form-control"
//                                                 name="email"
//                                                 placeholder="Enter email"
//                                                 value={formData.email}
//                                                 onChange={handleInputChange}
//                                                 required
//                                             />
//                                         </div>

//                                         {/* Password */}
//                                         <div className="col-md-6 mb-3">
//                                             <label className="form-label">
//                                                 Password<span className="text-danger">*</span>
//                                             </label>
//                                             <input
//                                                 type="password"
//                                                 className="form-control"
//                                                 name="password"
//                                                 placeholder="Enter password"
//                                                 value={formData.password}
//                                                 onChange={handleInputChange}
//                                                 required
//                                             />
//                                         </div>

//                                         {/* Contact */}
//                                         <div className="col-md-6 mb-3">
//                                             <label className="form-label">
//                                                 Contact<span className="text-danger">*</span>
//                                             </label>
//                                             <input
//                                                 type="tel"
//                                                 className="form-control"
//                                                 name="contact"
//                                                 placeholder="Enter contact number"
//                                                 value={formData.contact}
//                                                 onChange={handleInputChange}
//                                                 required
//                                             />
//                                         </div>

//                                         {/* Mentor Amount */}
//                                         <div className="col-md-6 mb-3">
//                                             <label className="form-label">
//                                                 Mentor Amount (₹/hr)<span className="text-danger">*</span>
//                                             </label>
//                                             <input
//                                                 type="number"
//                                                 className="form-control"
//                                                 name="mentorAmount"
//                                                 placeholder="Enter Mentor Amount (₹/hr)"
//                                                 value={formData.mentorAmount}
//                                                 onChange={handleInputChange}
//                                                 min="0"
//                                                 step="0.01"
//                                                 required
//                                             />
//                                         </div>

//                                         {/* Mentor Photo */}
//                                         <div className="col-md-6 mb-3">
//                                             <label className="form-label">
//                                                 Mentor Photo<span className="text-danger">*</span>
//                                                 <small className="text-danger"> (max file Size 2 MB)</small>
//                                             </label>
//                                             <div className="file-upload-container">
//                                                 <input
//                                                     type="file"
//                                                     className="form-control"
//                                                     name="mentorPhoto"
//                                                     accept="image/*"
//                                                     onChange={handleFileChange}
//                                                     id="mentorPhoto"
//                                                 />
//                                                 <label htmlFor="mentorPhoto" className="file-upload-label">
//                                                     <span className="file-upload-text">
//                                                         {formData.mentorPhoto ? formData.mentorPhoto.name : "No file selected."}
//                                                     </span>
//                                                     <button type="button" className="browse-btn">
//                                                         Browse...
//                                                     </button>
//                                                 </label>
//                                             </div>
//                                         </div>

//                                         {/* About Mentor */}
//                                         <div className="col-md-6 mb-3">
//                                             <label className="form-label">
//                                                 About Mentor<span className="text-danger">*</span>
//                                             </label>
//                                             <ReactQuill
//                                                 theme="snow"
//                                                 value={formData.aboutMentor}
//                                                 onChange={handleAboutMentorChange}
//                                                 modules={quillModules}
//                                                 placeholder="Enter details about the mentor"
//                                                 style={{ height: "150px", marginBottom: "50px" }}
//                                             />
//                                         </div>

//                                         {/* Experience */}
//                                         <div className="col-md-6 mb-3">
//                                             <label className="form-label">
//                                                 Experience<span className="text-danger">*</span>
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 name="experience"
//                                                 placeholder="Enter experience"
//                                                 value={formData.experience}
//                                                 onChange={handleInputChange}
//                                                 required
//                                             />
//                                         </div>

//                                         {/* Professional Background */}
//                                         <div className="col-md-6 mb-3">
//                                             <label className="form-label">
//                                                 Professional Background<span className="text-danger">*</span>
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 name="professionalBackground"
//                                                 placeholder="Enter professional background"
//                                                 value={formData.professionalBackground}
//                                                 onChange={handleInputChange}
//                                                 required
//                                             />
//                                         </div>

//                                         {/* Contact Person Name */}
//                                         <div className="col-md-6 mb-3">
//                                             <label className="form-label">Contact Person Name</label>
//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 name="contactPersonName"
//                                                 placeholder="Enter contact person name"
//                                                 value={formData.contactPersonName}
//                                                 onChange={handleInputChange}
//                                             />
//                                         </div>

//                                         {/* Contact Person Number */}
//                                         <div className="col-md-6 mb-3">
//                                             <label className="form-label">Contact Person Number</label>
//                                             <input
//                                                 type="tel"
//                                                 className="form-control"
//                                                 name="contactPersonNumber"
//                                                 placeholder="Enter contact person number"
//                                                 value={formData.contactPersonNumber}
//                                                 onChange={handleInputChange}
//                                             />
//                                         </div>

//                                         {/* Owner Name */}
//                                         <div className="col-md-6 mb-3">
//                                             <label className="form-label">Owner Name</label>
//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 name="ownerName"
//                                                 placeholder="Enter owner name"
//                                                 value={formData.ownerName}
//                                                 onChange={handleInputChange}
//                                             />
//                                         </div>

//                                         {/* Owner Phone Number */}
//                                         <div className="col-md-6 mb-3">
//                                             <label className="form-label">Owner Phone Number</label>
//                                             <input
//                                                 type="tel"
//                                                 className="form-control"
//                                                 name="ownerPhoneNumber"
//                                                 placeholder="Enter owner phone number"
//                                                 value={formData.ownerPhoneNumber}
//                                                 onChange={handleInputChange}
//                                             />
//                                         </div>

//                                         {/* Admin Commission */}
//                                         <div className="col-md-12 mb-3">
//                                             <label className="form-label">
//                                                 Admin Commission %<span className="text-danger">*</span>
//                                             </label>
//                                             <input
//                                                 type="number"
//                                                 className="form-control"
//                                                 name="adminCommission"
//                                                 placeholder="Enter admin commission percentage"
//                                                 value={formData.adminCommission}
//                                                 onChange={handleInputChange}
//                                                 min="0"
//                                                 max="100"
//                                                 step="0.01"
//                                                 required
//                                             />
//                                         </div>

//                                         {/* Bank Details Section */}
//                                         <div className="col-12 mb-4">
//                                             <h5 className="section-title">Bank Details</h5>
//                                             <div className="row">
//                                                 {/* Bank Name */}
//                                                 <div className="col-md-6 mb-3">
//                                                     <label className="form-label">Bank Name</label>
//                                                     <input
//                                                         type="text"
//                                                         className="form-control"
//                                                         name="bankName"
//                                                         placeholder="Enter Bank Name"
//                                                         value={formData.bankName}
//                                                         onChange={handleInputChange}
//                                                     />
//                                                 </div>

//                                                 {/* Bank IFSC Code */}
//                                                 <div className="col-md-6 mb-3">
//                                                     <label className="form-label">Bank Ifsc Code</label>
//                                                     <input
//                                                         type="text"
//                                                         className="form-control"
//                                                         name="bankIfscCode"
//                                                         placeholder="Enter Ifsc Code"
//                                                         value={formData.bankIfscCode}
//                                                         onChange={handleInputChange}
//                                                     />
//                                                 </div>

//                                                 {/* Bank Account Number */}
//                                                 <div className="col-md-12 mb-3">
//                                                     <label className="form-label">Bank Account Number</label>
//                                                     <input
//                                                         type="text"
//                                                         className="form-control"
//                                                         name="bankAccountNumber"
//                                                         placeholder="Enter Account Number"
//                                                         value={formData.bankAccountNumber}
//                                                         onChange={handleInputChange}
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         {/* Time Slots Section */}
//                                         <div className="col-12 mb-4">
//                                             <h5 className="section-title">Time Slots</h5>
//                                             {slots.map((slot, index) => (
//                                                 <div key={index} className="slot-container mb-3">
//                                                     <div className="row align-items-end">
//                                                         {/* Mentor Day */}
//                                                         <div className="col-md-3 mb-2">
//                                                             <label className="form-label">
//                                                                 Mentor Day<span className="text-danger">*</span>
//                                                             </label>
//                                                             <select
//                                                                 className="form-select"
//                                                                 value={slot.mentorDay}
//                                                                 onChange={(e) => handleSlotChange(index, "mentorDay", e.target.value)}
//                                                                 required
//                                                             >
//                                                                 <option value="">Select Day</option>
//                                                                 {dayOptions.map((day) => (
//                                                                     <option key={day} value={day}>
//                                                                         {day}
//                                                                     </option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>

//                                                         {/* From Time */}
//                                                         <div className="col-md-2 mb-2">
//                                                             <label className="form-label">
//                                                                 From Time<span className="text-danger">*</span>
//                                                             </label>
//                                                             <select
//                                                                 className="form-select"
//                                                                 value={slot.fromTimeHours}
//                                                                 onChange={(e) => handleSlotChange(index, "fromTimeHours", e.target.value)}
//                                                                 required
//                                                             >
//                                                                 <option value="">Hour</option>
//                                                                 {timeOptions.map((time) => (
//                                                                     <option key={time} value={time}>
//                                                                         {time}
//                                                                     </option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>

//                                                         <div className="col-md-2 mb-2">
//                                                             <select
//                                                                 className="form-select"
//                                                                 value={slot.fromTimestamp}
//                                                                 onChange={(e) => handleSlotChange(index, "fromTimestamp", e.target.value)}
//                                                             >
//                                                                 <option value="AM">AM</option>
//                                                                 <option value="PM">PM</option>
//                                                             </select>
//                                                         </div>

//                                                         {/* To Time */}
//                                                         <div className="col-md-2 mb-2">
//                                                             <label className="form-label">
//                                                                 To Time<span className="text-danger">*</span>
//                                                             </label>
//                                                             <select
//                                                                 className="form-select"
//                                                                 value={slot.toTimeHours}
//                                                                 onChange={(e) => handleSlotChange(index, "toTimeHours", e.target.value)}
//                                                                 required
//                                                             >
//                                                                 <option value="">Hour</option>
//                                                                 {timeOptions.map((time) => (
//                                                                     <option key={time} value={time}>
//                                                                         {time}
//                                                                     </option>
//                                                                 ))}
//                                                             </select>
//                                                         </div>

//                                                         <div className="col-md-2 mb-2">
//                                                             <select
//                                                                 className="form-select"
//                                                                 value={slot.toTimestamp}
//                                                                 onChange={(e) => handleSlotChange(index, "toTimestamp", e.target.value)}
//                                                             >
//                                                                 <option value="AM">AM</option>
//                                                                 <option value="PM">PM</option>
//                                                             </select>
//                                                         </div>

//                                                         {/* Remove Slot Button */}
//                                                         <div className="col-md-1 mb-2">
//                                                             {slots.length > 1 && (
//                                                                 <button
//                                                                     type="button"
//                                                                     className="btn btn-danger btn-sm"
//                                                                     onClick={() => removeSlot(index)}
//                                                                     title="Remove Slot"
//                                                                 >
//                                                                     <FontAwesomeIcon icon={faTrash} />
//                                                                 </button>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             ))}

//                                             {/* Add More Slots Button */}
//                                             <button type="button" className="btn btn-secondary btn-add-slot" onClick={addMoreSlots}>
//                                                 Add More Slots
//                                             </button>
//                                         </div>

//                                         {/* Submit Buttons */}
//                                         <div className="col-12">
//                                             <div className="form-submit-buttons">
//                                                 <button type="submit" className="btn btn-primary me-3" disabled={loading}>
//                                                     {loading ? (
//                                                         <>
//                                                             <span
//                                                                 className="spinner-border spinner-border-sm me-2"
//                                                                 role="status"
//                                                                 aria-hidden="true"
//                                                             ></span>
//                                                             Saving...
//                                                         </>
//                                                     ) : (
//                                                         <>
//                                                             <FontAwesomeIcon icon={faSave} className="me-2" />
//                                                             Save
//                                                         </>
//                                                     )}
//                                                 </button>
//                                                 <Link to="/mentors" className="btn btn-secondary">
//                                                     <FontAwesomeIcon icon={faTimes} className="me-2" />
//                                                     Cancel
//                                                 </Link>
//                                             </div>
//                                         </div>
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
"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTie,
  faTrash,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { baseUrl } from "../../config/baseUrl";

const AddMentorForm = () => {
  const [formData, setFormData] = useState({
    mentorName: "",
    qualification: "",
    specialization: "",
    location: "",
    email: "",
    contact: "",
    mentorAmount: "",
    mentorPhoto: null,
    aboutMentor: "",
    experience: "",
    professionalBackground: "",
    adminCommission: "",
    bankName: "",
    bankIfscCode: "",
    bankAccountNumber: "",
    password: " ",
  });

  const [loading, setLoading] = useState(false);

  const [slots, setSlots] = useState([
    {
      mentorDay: "",
      fromTimeHours: "",
      fromTimestamp: "AM",
      toTimeHours: "",
      toTimestamp: "AM",
      price: "",
    },
  ]);

  const specializationOptions = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "English",
    "History",
    "Geography",
    "Economics",
    "Accounting",
    "Business Studies",
    "Psychology",
    "Sociology",
  ];

  const dayOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const timeOptions = [
    "1:00",
    "2:00",
    "3:00",
    "4:00",
    "5:00",
    "6:00",
    "7:00",
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "12:00",
  ];

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      ["link"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleAboutMentorChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      aboutMentor: value,
    }));
  };

  const handleSlotChange = (index, field, value) => {
    const updatedSlots = [...slots];
    updatedSlots[index][field] = value;
    setSlots(updatedSlots);
  };

  const addMoreSlots = () => {
    setSlots([
      ...slots,
      {
        mentorDay: "",
        fromTimeHours: "",
        fromTimestamp: "AM",
        toTimeHours: "",
        toTimestamp: "AM",
        price: "",
      },
    ]);
  };

  const removeSlot = (index) => {
    if (slots.length > 1) {
      setSlots(slots.filter((_, i) => i !== index));
    }
  };

  // const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     setLoading(true);

  //     try {
  //         const formDataToSend = new FormData();

  //         // Ensure required backend fields exist
  //         const finalData = {
  //             ...formData,
  //             password: formData.password || "123456", // default if not provided
  //         };

  //         // Append all non-empty fields
  //         Object.keys(finalData).forEach((key) => {
  //             if (finalData[key] !== null && finalData[key] !== "") {
  //                 formDataToSend.append(key, finalData[key]);
  //             }
  //         });

  //         // Map slots to backend format
  //         const formattedSlots = slots.map((slot) => ({
  //             day: slot.mentorDay,
  //             fromTime: `${slot.fromTimeHours} ${slot.fromTimestamp}`,
  //             toTime: `${slot.toTimeHours} ${slot.toTimestamp}`,
  //         }));

  //         // Backend also requires availability
  //         formDataToSend.append("slots", JSON.stringify(formattedSlots));
  //         formDataToSend.append("availability", JSON.stringify(formattedSlots));

  //         const response = await fetch(`${baseUrl}/mentors`, {
  //             method: "POST",
  //             body: formDataToSend,
  //         });

  //         const data = await response.json();

  //         if (response.ok) {
  //             alert("Mentor added successfully!");
  //             // Reset form
  //             setFormData({
  //                 mentorName: "",
  //                 qualification: "",
  //                 specialization: "",
  //                 location: "",
  //                 email: "",
  //                 contact: "",
  //                 mentorAmount: "",
  //                 mentorPhoto: null,
  //                 aboutMentor: "",
  //                 experience: "",
  //                 professionalBackground: "",
  //                 adminCommission: "",
  //                 bankName: "",
  //                 bankIfscCode: "",
  //                 bankAccountNumber: "",
  //                 password: "123456",
  //             });
  //             setSlots([
  //                 {
  //                     mentorDay: "",
  //                     fromTimeHours: "",
  //                     fromTimestamp: "AM",
  //                     toTimeHours: "",
  //                     toTimestamp: "AM",
  //                 },
  //             ]);
  //         } else {
  //             alert(`Error: ${data.message || "Failed to add mentor"}`);
  //         }
  //     } catch (error) {
  //         console.error("Error adding mentor:", error);
  //         alert("Error adding mentor. Please try again.");
  //     } finally {
  //         setLoading(false);
  //     }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Prepare availability from slots
      const availability = slots.map((slot) => ({
        price: slot.price,
        day: slot.mentorDay,
        fromTime: `${slot.fromTimeHours} ${slot.fromTimestamp}`,
        toTime: `${slot.toTimeHours} ${slot.toTimestamp}`,
      }));

      // Append all text fields except mentorPhoto
      const textFields = {
        ...formData,
        availability: JSON.stringify(availability),
        password: formData.password || "123456",
      };
      for (const key in textFields) {
        if (
          key !== "mentorPhoto" &&
          textFields[key] !== "" &&
          textFields[key] !== null
        ) {
          formDataToSend.append(key, textFields[key]);
        }
      }

      // Append file separately, only if it exists
      if (formData.mentorPhoto) {
        formDataToSend.append("mentorPhoto", formData.mentorPhoto); // Must match backend Multer field name
      }

      const response = await fetch(`${baseUrl}/mentors`, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok && data.status) {
        alert("Mentor added successfully!");
        // Reset form
        setFormData({
          mentorName: "",
          qualification: "",
          specialization: "",
          location: "",
          email: "",
          contact: "",
          mentorAmount: "",
          mentorPhoto: null,
          aboutMentor: "",
          experience: "",
          professionalBackground: "",
          adminCommission: "",
          bankName: "",
          bankIfscCode: "",
          bankAccountNumber: "",
          password: "123456",
        });
        setSlots([
          {
            mentorDay: "",
            fromTimeHours: "",
            fromTimestamp: "AM",
            toTimeHours: "",
            toTimestamp: "AM",
            price: "",
          },
        ]);
      } else {
        alert(`Error: ${data.message || "Failed to add mentor"}`);
      }
    } catch (error) {
      console.error("Error adding mentor:", error);
      alert("Error adding mentor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="main-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="dashboard-title">
                <h4 className="dash-head">
                  <FontAwesomeIcon icon={faUserTie} className="me-2" />
                  Add Mentor
                </h4>
              </div>
              <div className="custom-bredcump">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="/">Dashboard</a>
                    </li>
                    <li className="breadcrumb-item">
                      <a href="/mentors">Mentors</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Add Mentor
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="cards">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {/* Mentor Name */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Mentor Name<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="mentorName"
                        placeholder="Enter Mentor Name"
                        value={formData.mentorName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Qualification */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Qualification<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="qualification"
                        placeholder="Enter qualification"
                        value={formData.qualification}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Specialization */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Specialization<span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Specialization</option>
                        {specializationOptions.map((spec) => (
                          <option key={spec} value={spec}>
                            {spec}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Location */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Location<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="location"
                        placeholder="Enter location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Email<span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Password<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="password"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Contact */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Contact<span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        name="contact"
                        placeholder="Enter contact number"
                        value={formData.contact}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Mentor Amount */}
                    {/* <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Mentor Amount (₹/hr)
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="mentorAmount"
                        placeholder="Enter Mentor Amount (₹/hr)"
                        value={formData.mentorAmount}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div> */}

                    {/* Mentor Photo */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Mentor Photo<span className="text-danger">*</span>
                        <small className="text-danger">
                          {" "}
                          (max file Size 2 MB)
                        </small>
                      </label>
                      <div className="file-upload-container">
                        <input
                          type="file"
                          className="form-control"
                          name="mentorPhoto"
                          accept="image/*"
                          onChange={handleFileChange}
                          id="mentorPhoto"
                        />
                        <label
                          htmlFor="mentorPhoto"
                          className="file-upload-label"
                        >
                          <span className="file-upload-text">
                            {formData.mentorPhoto
                              ? formData.mentorPhoto.name
                              : "No file selected."}
                          </span>
                          <button type="button" className="browse-btn">
                            Browse...
                          </button>
                        </label>
                      </div>
                    </div>

                    {/* About Mentor */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        About Mentor<span className="text-danger">*</span>
                      </label>
                      <ReactQuill
                        theme="snow"
                        value={formData.aboutMentor}
                        onChange={handleAboutMentorChange}
                        modules={quillModules}
                        placeholder="Enter details about the mentor"
                        style={{ height: "150px", marginBottom: "50px" }}
                      />
                    </div>

                    {/* Experience */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Experience<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="experience"
                        placeholder="Enter experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Professional Background */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Professional Background
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="professionalBackground"
                        placeholder="Enter professional background"
                        value={formData.professionalBackground}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Admin Commission */}
                    <div className="col-md-12 mb-3">
                      <label className="form-label">
                        Admin Commission %<span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="adminCommission"
                        placeholder="Enter admin commission percentage"
                        value={formData.adminCommission}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        step="0.01"
                        required
                      />
                    </div>

                    {/* Bank Details Section */}
                    <div className="col-12 mb-4">
                      <h5 className="section-title">Bank Details</h5>
                      <div className="row">
                        {/* Bank Name */}
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Bank Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="bankName"
                            placeholder="Enter Bank Name"
                            value={formData.bankName}
                            onChange={handleInputChange}
                          />
                        </div>

                        {/* Bank IFSC Code */}
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Bank Ifsc Code</label>
                          <input
                            type="text"
                            className="form-control"
                            name="bankIfscCode"
                            placeholder="Enter Ifsc Code"
                            value={formData.bankIfscCode}
                            onChange={handleInputChange}
                          />
                        </div>

                        {/* Bank Account Number */}
                        <div className="col-md-12 mb-3">
                          <label className="form-label">
                            Bank Account Number
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="bankAccountNumber"
                            placeholder="Enter Account Number"
                            value={formData.bankAccountNumber}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Time Slots Section */}
                    <div className="col-12 mb-4">
                      <h5 className="section-title">Time Slots</h5>
                      {slots.map((slot, index) => (
                        <div key={index} className="slot-container mb-3">
                          <div className="row align-items-end">
                            {/* Mentor Day */}
                            <div className="col-md-2 mb-2">
                              <label className="form-label">
                                Mentor Day<span className="text-danger">*</span>
                              </label>
                              <select
                                className="form-select"
                                value={slot.mentorDay}
                                onChange={(e) =>
                                  handleSlotChange(
                                    index,
                                    "mentorDay",
                                    e.target.value
                                  )
                                }
                                required
                              >
                                <option value="">Select Day</option>
                                {dayOptions.map((day) => (
                                  <option key={day} value={day}>
                                    {day}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="col-md-2 mb-2">
                              <label className="form-label">
                                Price<span className="text-danger">*</span>
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                value={slot.price}
                                onChange={(e) =>
                                  handleSlotChange(
                                    index,
                                    "price",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            {/* From Time */}
                            <div className="col-md-2 mb-2">
                              <label className="form-label">
                                From Time<span className="text-danger">*</span>
                              </label>
                              <select
                                className="form-select"
                                value={slot.fromTimeHours}
                                onChange={(e) =>
                                  handleSlotChange(
                                    index,
                                    "fromTimeHours",
                                    e.target.value
                                  )
                                }
                                required
                              >
                                <option value="">Hour</option>
                                {timeOptions.map((time) => (
                                  <option key={time} value={time}>
                                    {time}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="col-md-2 mb-2">
                              <select
                                className="form-select"
                                value={slot.fromTimestamp}
                                onChange={(e) =>
                                  handleSlotChange(
                                    index,
                                    "fromTimestamp",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                              </select>
                            </div>

                            {/* To Time */}
                            <div className="col-md-2 mb-2">
                              <label className="form-label">
                                To Time<span className="text-danger">*</span>
                              </label>
                              <select
                                className="form-select"
                                value={slot.toTimeHours}
                                onChange={(e) =>
                                  handleSlotChange(
                                    index,
                                    "toTimeHours",
                                    e.target.value
                                  )
                                }
                                required
                              >
                                <option value="">Hour</option>
                                {timeOptions.map((time) => (
                                  <option key={time} value={time}>
                                    {time}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="col-md-2 mb-2">
                              <select
                                className="form-select"
                                value={slot.toTimestamp}
                                onChange={(e) =>
                                  handleSlotChange(
                                    index,
                                    "toTimestamp",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                              </select>
                            </div>

                            {/* Remove Slot Button */}
                            <div className="col-md-1 mb-2">
                              {slots.length > 1 && (
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() => removeSlot(index)}
                                  title="Remove Slot"
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add More Slots Button */}
                      <button
                        type="button"
                        className="btn btn-secondary btn-add-slot"
                        onClick={addMoreSlots}
                      >
                        Add More Slots
                      </button>
                    </div>

                    {/* Submit Buttons */}
                    <div className="col-12">
                      <div className="form-submit-buttons">
                        <button
                          type="submit"
                          className="btn btn-primary me-3"
                          disabled={loading}
                        >
                          {loading ? (
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
                              <FontAwesomeIcon icon={faSave} className="me-2" />
                              Save
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => window.history.back()}
                        >
                          <FontAwesomeIcon icon={faTimes} className="me-2" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddMentorForm;
