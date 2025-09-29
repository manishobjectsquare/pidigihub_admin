"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserTie, faTrash, faSave, faTimes } from "@fortawesome/free-solid-svg-icons"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { baseUrl } from "../../config/baseUrl"


const ViewMentor = () => {
    const params = useParams()
    const mentorId = params?.id

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
        password: "",
    })

    const [loading, setLoading] = useState(false)
    const [fetchLoading, setFetchLoading] = useState(true)
    const [currentPhotoUrl, setCurrentPhotoUrl] = useState("")

    const [slots, setSlots] = useState([
        {
            mentorDay: "",
            fromTimeHours: "",
            fromTimestamp: "AM",
            toTimeHours: "",
            toTimestamp: "AM",
        },
    ])

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
    ]

    const dayOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

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
    ]

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            ["link"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["clean"],
        ],
    }

    useEffect(() => {
        const fetchMentorData = async () => {
            if (!mentorId) return

            try {
                setFetchLoading(true)
                const response = await fetch(`${baseUrl}/mentors/${mentorId}`)

                if (!response.ok) {
                    throw new Error("Failed to fetch mentor data")
                }
                const data = await response.json()
                const mentorData = data.data

                setFormData({
                    mentorName: mentorData.mentorName || "",
                    qualification: mentorData.qualification || "",
                    specialization: mentorData.specialization || "",
                    location: mentorData.location || "",
                    email: mentorData.email || "",
                    contact: mentorData.contact || "",
                    mentorAmount: mentorData.mentorAmount || "",
                    mentorPhoto: null, // Keep as null for file input
                    aboutMentor: mentorData.aboutMentor || "",
                    experience: mentorData.experience || "",
                    professionalBackground: mentorData.professionalBackground || "",
                    adminCommission: mentorData.adminCommission || "",
                    bankName: mentorData.bankName || "",
                    bankIfscCode: mentorData.bankIfscCode || "",
                    bankAccountNumber: mentorData.bankAccountNumber || "",
                    password: mentorData.password || "123456",
                })

                if (mentorData.mentorPhoto) {
                    setCurrentPhotoUrl(mentorData.mentorPhoto)
                }

                if (mentorData.slots && mentorData.slots.length > 0) {
                    const formattedSlots = mentorData.slots.map((slot) => {
                        // Parse time strings like "9:00 AM" into components
                        const fromTimeParts = slot.fromTime?.split(" ") || ["", "AM"]
                        const toTimeParts = slot.toTime?.split(" ") || ["", "AM"]

                        return {
                            mentorDay: slot.day || "",
                            fromTimeHours: fromTimeParts[0] || "",
                            fromTimestamp: fromTimeParts[1] || "AM",
                            toTimeHours: toTimeParts[0] || "",
                            toTimestamp: toTimeParts[1] || "AM",
                        }
                    })
                    setSlots(formattedSlots)
                } else if (mentorData.availability && mentorData.availability.length > 0) {
                    // Fallback to availability field if slots not present
                    const formattedSlots = mentorData.availability.map((slot) => {
                        const fromTimeParts = slot.fromTime?.split(" ") || ["", "AM"]
                        const toTimeParts = slot.toTime?.split(" ") || ["", "AM"]

                        return {
                            mentorDay: slot.day || "",
                            fromTimeHours: fromTimeParts[0] || "",
                            fromTimestamp: fromTimeParts[1] || "AM",
                            toTimeHours: toTimeParts[0] || "",
                            toTimestamp: toTimeParts[1] || "AM",
                        }
                    })
                    setSlots(formattedSlots)
                }
            } catch (error) {
                console.error("Error fetching mentor data:", error)
                alert("Error loading mentor data. Please try again.")
            } finally {
                setFetchLoading(false)
            }
        }

        fetchMentorData()
    }, [mentorId])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleFileChange = (e) => {
        const { name, files } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: files[0],
        }))
    }

    const handleAboutMentorChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            aboutMentor: value,
        }))
    }

    const handleSlotChange = (index, field, value) => {
        const updatedSlots = [...slots]
        updatedSlots[index][field] = value
        setSlots(updatedSlots)
    }

    const addMoreSlots = () => {
        setSlots([
            ...slots,
            {
                mentorDay: "",
                fromTimeHours: "",
                fromTimestamp: "AM",
                toTimeHours: "",
                toTimestamp: "AM",
            },
        ])
    }

    const removeSlot = (index) => {
        if (slots.length > 1) {
            setSlots(slots.filter((_, i) => i !== index))
        }
    }

    // const handleSubmit = async (e) => {
    //   e.preventDefault()
    //   setLoading(true)

    //   try {
    //     const formDataToSend = new FormData()

    //     // Ensure required backend fields exist
    //     const finalData = {
    //       ...formData,
    //       password: formData.password || "123456", // default if not provided
    //     }

    //     // Append all non-empty fields
    //     Object.keys(finalData).forEach((key) => {
    //       if (finalData[key] !== null && finalData[key] !== "") {
    //         formDataToSend.append(key, finalData[key])
    //       }
    //     })

    //     // Map slots to backend format
    //     const formattedSlots = slots.map((slot) => ({
    //       day: slot.mentorDay,
    //       fromTime: `${slot.fromTimeHours} ${slot.fromTimestamp}`,
    //       toTime: `${slot.toTimeHours} ${slot.toTimestamp}`,
    //     }))

    //     // Backend also requires availability
    //     formDataToSend.append("slots", JSON.stringify(formattedSlots))
    //     formDataToSend.append("availability", JSON.stringify(formattedSlots))

    //     const response = await fetch(`${baseUrl}/mentors/${mentorId}`, {
    //       method: "patch",
    //       body: formDataToSend,
    //     })

    //     const data = await response.json()

    //     if (response.ok) {
    //       alert("Mentor updated successfully!")
    //       // Optionally redirect back to mentors list
    //       // window.location.href = "/mentors";
    //     } else {
    //       alert(`Error: ${data.message || "Failed to update mentor"}`)
    //     }
    //   } catch (error) {
    //     console.error("Error updating mentor:", error)
    //     alert("Error updating mentor. Please try again.")
    //   } finally {
    //     setLoading(false)
    //   }
    // }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();

            // Append all non-empty fields
            Object.entries({
                ...formData,
                password: formData.password || "123456", // default password
            }).forEach(([key, value]) => {
                if (value !== null && value !== "") {
                    formDataToSend.append(key, value);
                }
            });

            // Append new mentor photo if selected
            if (formData.mentorPhoto) {
                formDataToSend.append("mentorPhoto", formData.mentorPhoto);
            }

            // Format slots for backend
            const formattedSlots = slots.map((slot) => ({
                day: slot.mentorDay,
                fromTime: `${slot.fromTimeHours} ${slot.fromTimestamp}`,
                toTime: `${slot.toTimeHours} ${slot.toTimestamp}`,
            }));

            formDataToSend.append("slots", JSON.stringify(formattedSlots));
            formDataToSend.append("availability", JSON.stringify(formattedSlots));

            const response = await fetch(`${baseUrl}/mentors/${mentorId}`, {
                method: "PATCH",
                body: formDataToSend,
            });

            const data = await response.json();

            if (response.ok && data.status) {
                alert("Mentor updated successfully!");
                // Optional: redirect back to mentor list
                // window.location.href = "/mentors";
            } else {
                alert(`Error: ${data.message || "Failed to update mentor"}`);
            }
        } catch (error) {
            console.error("Error updating mentor:", error);
            alert("Error updating mentor. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <section className="main-sec">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3">Loading mentor data...</p>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <>
            <section className="main-sec">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="dashboard-title">
                                <h4 className="dash-head">
                                    <FontAwesomeIcon icon={faUserTie} className="me-2" />
                                    Edit Mentor
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
                                            Edit Mentor
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
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">
                                                Mentor Amount (₹/hr)<span className="text-danger">*</span>
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
                                        </div>

                                        {/* Mentor Photo */}
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">
                                                Mentor Photo<span className="text-danger">*</span>
                                                <small className="text-danger"> (max file Size 2 MB)</small>
                                            </label>
                                            {currentPhotoUrl && (
                                                <div className="mb-2">
                                                    <img
                                                        src={`${baseUrl}/${currentPhotoUrl}` || "/placeholder.svg"}
                                                        alt={currentPhotoUrl ? "Mentor Photo" : "Placeholder"}
                                                        className="img-thumbnail"
                                                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                                    />
                                                    <small className="d-block text-muted">Current photo</small>
                                                </div>
                                            )}
                                            <div className="file-upload-container">
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    name="mentorPhoto"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    id="mentorPhoto"
                                                />
                                                <label htmlFor="mentorPhoto" className="file-upload-label">
                                                    <span className="file-upload-text">
                                                        {formData.mentorPhoto ? formData.mentorPhoto.name : "Choose new photo (optional)"}
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
                                                Professional Background<span className="text-danger">*</span>
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
                                                    <label className="form-label">Bank Account Number</label>
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
                                                        <div className="col-md-3 mb-2">
                                                            <label className="form-label">
                                                                Mentor Day<span className="text-danger">*</span>
                                                            </label>
                                                            <select
                                                                className="form-select"
                                                                value={slot.mentorDay}
                                                                onChange={(e) => handleSlotChange(index, "mentorDay", e.target.value)}
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

                                                        {/* From Time */}
                                                        <div className="col-md-2 mb-2">
                                                            <label className="form-label">
                                                                From Time<span className="text-danger">*</span>
                                                            </label>
                                                            <select
                                                                className="form-select"
                                                                value={slot.fromTimeHours}
                                                                onChange={(e) => handleSlotChange(index, "fromTimeHours", e.target.value)}
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
                                                                onChange={(e) => handleSlotChange(index, "fromTimestamp", e.target.value)}
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
                                                                onChange={(e) => handleSlotChange(index, "toTimeHours", e.target.value)}
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
                                                                onChange={(e) => handleSlotChange(index, "toTimestamp", e.target.value)}
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
                                            <button type="button" className="btn btn-secondary btn-add-slot" onClick={addMoreSlots}>
                                                Add More Slots
                                            </button>
                                        </div>

                                        {/* Submit Buttons */}
                                        {/* <div className="col-12">
                                            <div className="form-submit-buttons">
                                                <button type="submit" className="btn btn-primary me-3" disabled={loading}>
                                                    {loading ? (
                                                        <>
                                                            <span
                                                                className="spinner-border spinner-border-sm me-2"
                                                                role="status"
                                                                aria-hidden="true"
                                                            ></span>
                                                            Updating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FontAwesomeIcon icon={faSave} className="me-2" />
                                                            Update
                                                        </>
                                                    )}
                                                </button>
                                                <button type="button" className="btn btn-secondary" onClick={() => window.history.back()}>
                                                    <FontAwesomeIcon icon={faTimes} className="me-2" />
                                                    Cancel
                                                </button>
                                            </div>
                                        </div> */}
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

export default ViewMentor
