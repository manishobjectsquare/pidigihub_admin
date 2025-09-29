"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { baseUrl } from "../../config/baseUrl";

export default function AddLibrary() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [libraryPhoto, setLibraryPhoto] = useState(null);
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
      type: "percentage",
      value: 10,
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "adminCommissionType") {
      setFormData((prev) => ({
        ...prev,
        adminCommission: {
          ...prev.adminCommission,
          type: value,
        },
      }));
    } else if (name === "adminCommissionValue") {
      setFormData((prev) => ({
        ...prev,
        adminCommission: {
          ...prev.adminCommission,
          value: Number(value),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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

    if (!formData.libraryName || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
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
        !slot.toTimeHours ||
        !slot.tenure
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
      submitFormData.append(
        "adminCommission[type]",
        formData.adminCommission.type
      );
      submitFormData.append(
        "adminCommission[value]",
        formData.adminCommission.value
      );

      // Add library photo if selected
      if (libraryPhoto) {
        submitFormData.append("libraryPhoto", libraryPhoto);
      }

      const response = await fetch(`${baseUrl}/library/library-store`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: submitFormData,
      });

      const data = await response.json();

      if (data.status) {
        toast.success("Library added successfully!");
        navigate("/library");
      } else {
        toast.error(data.message || "Failed to add library");
      }
    } catch (error) {
      console.error("Error adding library:", error);
      toast.error("Failed to add library");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenureData();
  }, []);

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

  const timeOptions = [];
  for (let i = 1; i <= 12; i++) {
    timeOptions.push(`${i}:00`);
    timeOptions.push(`${i}:30`);
  }

  return (
    <section className="main-sec">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6">
            <div className="dashboard-title">
              <h4 className="dash-head">
                <FontAwesomeIcon icon={faBook} className="me-2" />
                Add Library
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
                    Add Library
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
                      Library Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="libraryName"
                      value={formData.libraryName}
                      onChange={handleInputChange}
                      placeholder="Modern Study Center"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="modernstudy@email.com"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter secure password"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Library Photo</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                {/* Location Information */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h5 className="section-title">Location Information</h5>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      City <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Pune"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Area <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder="Kothrud"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Address <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="2nd Floor, Green Plaza, FC Road"
                      rows="3"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Pin Code <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleInputChange}
                      placeholder="411038"
                      maxLength="6"
                      required
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
                      Contact Person Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="contactPersonName"
                      value={formData.contactPersonName}
                      onChange={handleInputChange}
                      placeholder="Ramesh Patil"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Contact Person Number{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      name="contactPersonNumber"
                      value={formData.contactPersonNumber}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      maxLength="10"
                      required
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
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Library Category</label>
                    <select
                      className="form-select"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                    >
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Payment Acceptance</label>
                    <select
                      className="form-select"
                      name="paymentAcceptance"
                      value={formData.paymentAcceptance}
                      onChange={handleInputChange}
                    >
                      <option value="Both">Both (Cash & Online)</option>
                      <option value="Offline">Cash Only</option>
                      <option value="Online">Online Only</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Admin Commission Type</label>
                    <select
                      className="form-select"
                      name="adminCommissionType"
                      value={formData.adminCommission.type}
                      onChange={handleInputChange}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed (₹)</option>
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Admin Commission Value</label>
                    <input
                      type="number"
                      className="form-control"
                      name="adminCommissionValue"
                      value={formData.adminCommission.value}
                      onChange={handleInputChange}
                      placeholder="Enter value"
                      min="0"
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
                    />
                  </div>
                </div>

                {/* Slots Section */}
                <div className="row mb-4">
                  <div className="col-12">
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
                                {/* <FontAwesomeIcon icon={faRupeeSign} className="me-1" /> */}
                                Price <span className="text-danger">*</span>
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
                                required
                              />
                            </div>
                            <div className="col-md-2 mb-3">
                              <label className="form-label">
                                {/* <FontAwesomeIcon icon={faUsers} className="me-1" /> */}
                                Seats <span className="text-danger">*</span>
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
                                required
                              />
                            </div>
                            <div className="col-md-3 mb-3">
                              <label className="form-label">
                                {/* <FontAwesomeIcon icon={faCalendarAlt} className="me-1" /> */}
                                Tenure <span className="text-danger">*</span>
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
                              >
                                <option value="">Select</option>
                                {/* <option value="Monthly">Monthly</option>
                                <option value="Bi-monthly">Bi-monthly</option>
                                <option value="Quarterly">Quarterly</option>
                                <option value="Half-yearly">Half-yearly</option>
                                <option value="Yearly">Yearly</option> */}
                                {tenureList.map((arr) => (
                                  <option key={arr?._id} value={arr?._id}>
                                    {arr?.tenure}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="col-lg-2 mb-3">
                              <label className="form-label">
                                {/* <FontAwesomeIcon icon={faClock} className="me-1" /> */}
                                From <span className="text-danger">*</span>
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
                                  required
                                >
                                  <option value="">Time</option>
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
                            <div className="col-lg-2 mb-3">
                              <label className="form-label">
                                {/* <FontAwesomeIcon icon={faClock} className="me-1" /> */}
                                To <span className="text-danger">*</span>
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
                                  required
                                >
                                  <option value="">Time</option>
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

                {/* Submit Button */}
                <div className="row">
                  <div className="col-12">
                    <div className="d-flex justify-content-end gap-2">
                      <Link to="/library" className="btn btn-secondary">
                        Cancel
                      </Link>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                            Adding Library...
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faSave} className="me-2" />
                            Add Library
                          </>
                        )}
                      </button>
                    </div>
                  </div>
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

                `}
      </style>
    </section>
  );
}
