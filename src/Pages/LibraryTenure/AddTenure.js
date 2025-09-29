"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faSave,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

export default function AddTenure() {
  const [formData, setFormData] = useState({
    tenure: "",
    status: "active",
    days: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tenure.trim()) {
      newErrors.tenure = "tenure title is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/library-tenure`, formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });

      if (response.data.status) {
        toast.success("Tenure created successfully");
        navigate("/tenures");
      } else {
        Swal.fire({
          title: "Error!",
          text: response.data.message || "Failed to add tenure",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error adding tenure:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to add tenure",
        icon: "error",
      });
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
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                  Add Tenure
                </h4>
              </div>
              <div className="custom-bredcump">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="/tenures">Tenure</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Add Tenure
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="col-lg-6 d-flex justify-content-end align-items-start">
              <Link to="/tenures" className="btn-back">
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                Back to Tenures
              </Link>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="cards">
                <form onSubmit={handleSubmit}>
                  <div className="form-section">
                    <div className="row">
                      <div className="col-lg-6 mb-4">
                        <label htmlFor="title" className="form-label">
                          Tenure Title<sup className="text-danger">*</sup>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            errors.title ? "is-invalid" : ""
                          }`}
                          id="title"
                          name="tenure"
                          placeholder="Enter tenure"
                          value={formData.tenure}
                          onChange={handleChange}
                        />
                        {errors.title && (
                          <div className="invalid-feedback">{errors.title}</div>
                        )}
                      </div>
                      <div className="col-lg-6 mb-4">
                        <label htmlFor="days" className="form-label">
                          Tenure days<sup className="text-danger">*</sup>
                        </label>
                        <input
                          type="Number"
                          className={`form-control ${
                            errors.days ? "is-invalid" : ""
                          }`}
                          id="days"
                          name="days"
                          placeholder="Enter days"
                          value={formData.days}
                          onChange={handleChange}
                        />
                        {errors.title && (
                          <div className="invalid-feedback">{errors.title}</div>
                        )}
                      </div>

                      <div className="col-lg-6 mb-4">
                        <label htmlFor="status" className="form-label">
                          Status
                        </label>
                        <select
                          className="form-control"
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row mt-4">
                    <div className="col-12 text-center">
                      <button
                        type="submit"
                        className="btn-save"
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
                            Save Tenure
                          </>
                        )}
                      </button>
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
}
