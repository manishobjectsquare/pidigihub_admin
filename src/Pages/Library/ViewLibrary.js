"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faPlus,
  faTrash,
  faSave,
  faArrowLeft,
  faClock,
  faRupeeSign,
  faUsers,
  faSpinner,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { baseUrl } from "../../config/baseUrl";

export default function ViewLibrary() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [libraryPhoto, setLibraryPhoto] = useState(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState("");
  const [tenureList, setTenureList] = useState([]);

  const [formData, setFormData] = useState({
    libraryName: "",
    email: "",
    password: "",
    city: "",
    area: "",
    address: "",
    pinCode: "",
    contactPersonName: "",
    contactPersonNumber: "",
    aboutLibrary: "",
    paymentAcceptance: "Both",
    ownerName: "",
    ownerPhoneNumber: "",
    bankName: "",
    bankAccountNumber: "",
    bankIfscCode: "",
    emptyField1: "",
    emptyField2: "",
    adminCommission: {
      type: "",
      value: null,
    },
  });

  const [slots, setSlots] = useState([
    {
      libraryPrice: "",
      numberOfSeats: "",
      tenure: "",
      fromTimeHours: "",
      fromTimestamp: "AM",
      toTimeHours: "",
      toTimestamp: "AM",
    },
  ]);

  useEffect(() => {
    if (id) {
      fetchLibraryData();
    }
    fetchTenureData();
  }, [id]);

  const fetchTenureData = async () => {
    try {
      const response = await fetch(`${baseUrl}/library-tenure?status=active`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (data.status && data.data) {
        setTenureList(data.data);
      } else {
        toast.error(data.message || "Failed to fetch tenure data");
      }
    } catch (error) {
      toast.error("Failed to fetch tenure data");
    }
  };
  const fetchLibraryData = async () => {
    try {
      setFetchLoading(true);
      const response = await fetch(`${baseUrl}/library/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (data.status && data.data) {
        const library = data.data;

        // Set form data
        setFormData({
          libraryName: library.libraryName || "",
          email: library.email || "",
          password: library.password || "",
          city: library.city || "",
          area: library.area || "",
          address: library.address || "",
          pinCode: library.pinCode || "",
          contactPersonName: library.contactPersonName || "",
          contactPersonNumber: library.contactPersonNumber || "",
          aboutLibrary: library.aboutLibrary || "",
          paymentAcceptance: library.paymentAcceptance || "Both",
          ownerName: library.ownerName || "",
          ownerPhoneNumber: library.ownerPhoneNumber || "",
          bankName: library.bankName || "",
          bankAccountNumber: library.bankAccountNumber || "",
          bankIfscCode: library.bankIfscCode || "",
          emptyField1: library.emptyField1 || "",
          emptyField2: library.emptyField2 || "",
          adminCommission: {
            type: library?.adminCommission?.type,
            value: library?.adminCommission?.value,
          },
        });

        // Set existing photo URL
        if (library.libraryPhoto) {
          setExistingPhotoUrl(library.libraryPhoto);
        }

        // Set slots data
        if (library.slots && library.slots.length > 0) {
          const formattedSlots = library.slots.map((slot) => ({
            libraryPrice: slot.libraryPrice?.toString() || "",
            numberOfSeats: slot.numberOfSeats?.toString() || "",
            remainingSeats: slot.remainingSeats?.toString() || "",
            tenure: slot.tenure || "",
            fromTimeHours: slot.fromTimeHours || "",
            fromTimestamp: slot.fromTimestamp || "AM",
            toTimeHours: slot.toTimeHours || "",
            toTimestamp: slot.toTimestamp || "AM",
          }));
          setSlots(formattedSlots);
        }
      } else {
        toast.error(data.message || "Failed to fetch library data");
        navigate("/library");
      }
    } catch (error) {
      console.error("Error fetching library data:", error);
      toast.error("Failed to fetch library data");
      navigate("/library");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSlotChange = (index, field, value) => {
    const updatedSlots = [...slots];
    updatedSlots[index][field] = value;
    setSlots(updatedSlots);
  };

  const addSlot = () => {
    setSlots([
      ...slots,
      {
        libraryPrice: "",
        numberOfSeats: "",
        tenure: "",
        fromTimeHours: "",
        fromTimestamp: "AM",
        toTimeHours: "",
        toTimestamp: "AM",
      },
    ]);
  };

  const removeSlot = (index) => {
    if (slots.length > 1) {
      const updatedSlots = slots.filter((_, i) => i !== index);
      setSlots(updatedSlots);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLibraryPhoto(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.libraryName || !formData.email) {
      toast.error("Please fill in all disabled fields");
      return;
    }

    if (
      !formData.contactPersonNumber ||
      formData.contactPersonNumber.length !== 10
    ) {
      toast.error("Please enter a valid 10-digit contact number");
      return;
    }

    if (!formData.pinCode || formData.pinCode.length !== 6) {
      toast.error("Please enter a valid 6-digit pin code");
      return;
    }

    // Validate slots
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      if (
        !slot.libraryPrice ||
        !slot.numberOfSeats ||
        !slot.fromTimeHours ||
        !slot.toTimeHours
      ) {
        toast.error(`Please fill in all fields for slot ${i + 1}`);
        return;
      }
    }

    try {
      setLoading(true);

      // Create FormData object
      const submitFormData = new FormData();

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        submitFormData.append(key, formData[key]);
      });

      // Add slots as JSON string
      submitFormData.append("slots", JSON.stringify(slots));

      // Add library photo if selected
      if (libraryPhoto) {
        submitFormData.append("libraryPhoto", libraryPhoto);
      }

      const response = await fetch(`${baseUrl}/library/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: submitFormData,
      });

      const data = await response.json();

      if (data.status) {
        toast.success("Library updated successfully!");
        navigate("/library");
      } else {
        toast.error(data.message || "Failed to update library");
      }
    } catch (error) {
      console.error("Error updating library:", error);
      toast.error("Failed to update library");
    } finally {
      setLoading(false);
    }
  };

  const timeOptions = [];
  for (let i = 1; i <= 12; i++) {
    timeOptions.push(`${i}:00`);
    timeOptions.push(`${i}:30`);
  }

  if (fetchLoading) {
    return (
      <section className="main-sec">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="cards">
                <div className="text-center py-5">
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    size="3x"
                    className="text-primary mb-3"
                  />
                  <h4>Loading Library Data...</h4>
                  <p className="text-muted">
                    Please wait while we fetch the library information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="main-sec">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6">
            <div className="dashboard-title">
              <h4 className="dash-head">
                <FontAwesomeIcon icon={faBook} className="me-2" />
                View Library
              </h4>
            </div>
            <div className="custom-bredcump">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/library">Library</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    View Library
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="col-lg-6 d-flex justify-content-end align-items-start">
            <Link to="/library" className="btn btn-secondary me-2">
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Back to Library
            </Link>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="cards">
              <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h5 className="section-title">Basic Information</h5>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Library Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="libraryName"
                      value={formData.libraryName}
                      onChange={handleInputChange}
                      placeholder="Modern Study Center"
                      disabled
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="modernstudy@email.com"
                      disabled
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="text"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Leave blank to keep current password"
                      disabled
                    />
                    <small className="text-muted">
                      Leave blank to keep current password
                    </small>
                  </div>
                  {/* <div className="col-md-6 mb-3">
                                        <label className="form-label">Library Photo</label>
                                        {existingPhotoUrl && !libraryPhoto && (

                                            <div>
                                                <img src={`${baseUrl}/${existingPhotoUrl}`} alt="" />
                                            </div>

                                        )}
                                        {libraryPhoto && (
                                            <small className="text-success d-block mt-1">New photo selected: {libraryPhoto.name}</small>
                                        )}
                                    </div> */}
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Library Photo</label>
                    <div
                      className="library-photo-preview border rounded p-2 bg-light d-flex align-items-center justify-content-center"
                      style={{ minHeight: "200px" }}
                    >
                      {existingPhotoUrl && !libraryPhoto ? (
                        <img
                          src={`${baseUrl}/${existingPhotoUrl}`}
                          alt="Library"
                          className="img-fluid rounded shadow-sm"
                          style={{ maxHeight: "180px", objectFit: "cover" }}
                        />
                      ) : (
                        <div className="text-muted fst-italic">
                          No photo available
                        </div>
                      )}
                    </div>
                    {libraryPhoto && (
                      <small className="text-success d-block mt-2">
                        New photo selected: {libraryPhoto.name}
                      </small>
                    )}
                  </div>
                </div>

                {/* Location Information */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h5 className="section-title">Location Information</h5>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      City
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Pune"
                      disabled
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Area
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder="Kothrud"
                      disabled
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Address
                    </label>
                    <textarea
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="2nd Floor, Green Plaza, FC Road"
                      rows="3"
                      disabled
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Pin Code
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleInputChange}
                      placeholder="411038"
                      maxLength="6"
                      disabled
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h5 className="section-title">Contact Information</h5>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Contact Person Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="contactPersonName"
                      value={formData.contactPersonName}
                      onChange={handleInputChange}
                      placeholder="Ramesh Patil"
                      disabled
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Contact Person Number{" "}

                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      name="contactPersonNumber"
                      value={formData.contactPersonNumber}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      maxLength="10"
                      disabled
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Owner Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleInputChange}
                      placeholder="Suresh Patil"
                      disabled
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Owner Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="ownerPhoneNumber"
                      value={formData.ownerPhoneNumber}
                      onChange={handleInputChange}
                      placeholder="9123456789"
                      maxLength="10"
                      disabled
                    />
                  </div>
                </div>

                {/* About Library */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h5 className="section-title">About Library</h5>
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">About Library</label>
                    <textarea
                      className="form-control"
                      name="aboutLibrary"
                      value={formData.aboutLibrary}
                      onChange={handleInputChange}
                      placeholder="This library offers a peaceful environment for study."
                      rows="4"
                      disabled
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Payment Acceptance</label>
                    <select
                      className="form-select"
                      name="paymentAcceptance"
                      value={formData.paymentAcceptance}
                      onChange={handleInputChange}
                      disabled
                    >
                      <option value="Both">Both (Online & Offline)</option>
                      <option value="Online">Online Only</option>
                      <option value="Offline">Offline Only</option>
                    </select>
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Admin Commission Type</label>
                    <select
                      className="form-select"
                      name="adminCommissionType"
                      value={formData?.adminCommission?.type}
                      onChange={handleInputChange}
                      disabled
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed (₹)</option>
                    </select>
                  </div>

                  <div className="col-md-3 mb-3">
                    <label className="form-label">Admin Commission Value</label>
                    <input
                      type="number"
                      className="form-control"
                      name="adminCommissionValue"
                      value={formData?.adminCommission?.value}
                      onChange={handleInputChange}
                      placeholder="Enter value"
                      min="0"
                      disabled
                    />
                  </div>
                </div>

                {/* Bank Information */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h5 className="section-title">Bank Information</h5>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Bank Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      placeholder="HDFC Bank"
                      disabled
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Bank Account Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="bankAccountNumber"
                      value={formData.bankAccountNumber}
                      onChange={handleInputChange}
                      placeholder="123456789012"
                      disabled
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Bank IFSC Code</label>
                    <input
                      type="text"
                      className="form-control"
                      name="bankIfscCode"
                      value={formData.bankIfscCode}
                      onChange={handleInputChange}
                      placeholder="HDFC0001234"
                      disabled
                    />
                  </div>
                </div>

                {/* Additional Fields */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h5 className="section-title">Additional Information</h5>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Empty Field 1</label>
                    <input
                      type="text"
                      className="form-control"
                      name="emptyField1"
                      value={formData.emptyField1}
                      onChange={handleInputChange}
                      placeholder="N/A"
                      disabled
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Empty Field 2</label>
                    <input
                      type="text"
                      className="form-control"
                      name="emptyField2"
                      value={formData.emptyField2}
                      onChange={handleInputChange}
                      placeholder="N/A"
                      disabled
                    />
                  </div>
                </div>

                {/* Slots Section */}
                <div className="row mb-4">
                  <div className="col-12 d-none">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="section-title">Library Slots</h5>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={addSlot}
                      >
                        <FontAwesomeIcon icon={faPlus} className="me-2" />
                        Add Slot
                      </button>
                    </div>
                  </div>
                  {slots.map((slot, index) => (
                    <div key={index} className="col-12 mb-3">
                      <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <h6 className="mb-0">Slot {index + 1}</h6>
                          {slots.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => removeSlot(index)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          )}
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-2 mb-3">
                              <label className="form-label">
                                Price
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                value={slot.libraryPrice}
                                onChange={(e) =>
                                  handleSlotChange(
                                    index,
                                    "libraryPrice",
                                    e.target.value
                                  )
                                }
                                placeholder="100"
                                disabled
                              />
                            </div>
                            <div className="col-md-2 mb-3">
                              <label className="form-label">
                                total Seats{" "}

                              </label>
                              <input
                                type="number"
                                className="form-control"
                                value={slot.numberOfSeats}
                                onChange={(e) =>
                                  handleSlotChange(
                                    index,
                                    "numberOfSeats",
                                    e.target.value
                                  )
                                }
                                placeholder="10"
                                disabled
                              />
                            </div>
                            <div className="col-md-2 mb-3">
                              <label className="form-label">
                                remainingSeats{" "}
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                value={slot.remainingSeats}
                                onChange={(e) =>
                                  handleSlotChange(
                                    index,
                                    "numberOfSeats",
                                    e.target.value
                                  )
                                }
                                placeholder="10"
                                disabled
                              />
                            </div>
                            {/* <div className="col-md-2 mb-3">
                              <label className="form-label">Tenure</label>
                              <div className="form-control bg-light">
                                {slot?.tenure || "—"}
                              </div>
                            </div> */}

                            <div className="col-md-2 mb-3">
                              <label className="form-label">
                                Tenure
                              </label>
                              <select
                                className="form-select"
                                value={slot.tenure}
                                onChange={(e) =>
                                  handleSlotChange(
                                    index,
                                    "tenure",
                                    e.target.value
                                  )
                                }
                                required
                                disabled
                              >
                                <option value="">Select Tenure</option>
                                {tenureList.map((arr) => (
                                  <option key={arr?._id} value={arr?._id}>
                                    {arr?.tenure}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="col-md-2 mb-3">
                              <label className="form-label">
                                From Time
                              </label>
                              <div className="d-flex">
                                <select
                                  className="form-select me-2"
                                  value={slot.fromTimeHours}
                                  onChange={(e) =>
                                    handleSlotChange(
                                      index,
                                      "fromTimeHours",
                                      e.target.value
                                    )
                                  }
                                  disabled
                                >
                                  <option value="">Select Time</option>
                                  {timeOptions.map((time) => (
                                    <option key={time} value={time}>
                                      {time}
                                    </option>
                                  ))}
                                </select>
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
                                  style={{ maxWidth: "60px" }}
                                >
                                  <option value="AM">AM</option>
                                  <option value="PM">PM</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-md-2 mb-3">
                              <label className="form-label">
                                To Time
                              </label>
                              <div className="d-flex">
                                <select
                                  className="form-select me-2"
                                  value={slot.toTimeHours}
                                  onChange={(e) =>
                                    handleSlotChange(
                                      index,
                                      "toTimeHours",
                                      e.target.value
                                    )
                                  }
                                  disabled
                                >
                                  <option value="">Select Time</option>
                                  {timeOptions.map((time) => (
                                    <option key={time} value={time}>
                                      {time}
                                    </option>
                                  ))}
                                </select>
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
                                  style={{ maxWidth: "60px" }}
                                >
                                  <option value="AM">AM</option>
                                  <option value="PM">PM</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
                input::placeholder , textArea::placeholder {
                    color: transparent !important;
                }
                    .form-select {
    background-image: none !important;
}
    .library-photo-preview {
    transition: box-shadow 0.3s ease-in-out;
}
.library-photo-preview img:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
    .main-sec{
          padding-left:0 !important;
          padding-right:0 !important;
    }
          .card-body{
                   padding-left:4px !important;
          padding-right:4px !important;
          }
     `}
      </style>
    </section>
  );
}
