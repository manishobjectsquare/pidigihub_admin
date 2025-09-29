"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

export default function EditTenure() {
  const [formData, setFormData] = useState({
    tenure: "",
    status: "active",
    days: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchTenure = async () => {
      try {
        const response = await axios.get(`${baseUrl}/library-tenure/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        if (response.data.status && response.data.data) {
          const { tenure, status, days } = response.data.data;
          setFormData({ tenure, status, days });
        } else {
          Swal.fire("Error", "Failed to fetch tenure data", "error");
        }
      } catch (error) {
        console.error("Error fetching tenure:", error);
        Swal.fire("Error", "Unable to load tenure details", "error");
      }
    };

    fetchTenure();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.tenure.trim()) {
      newErrors.tenure = "Tenure title is required";
    }
    if (!formData.days || formData.days <= 0) {
      newErrors.days = "Tenure days must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await axios.patch(
        `${baseUrl}/library-tenure/${id}`,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        toast.success("Tenure updated successfully");
        navigate("/tenures");
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Failed to update",
          "error"
        );
      }
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="main-sec">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="dashboard-title">
              <h4 className="dash-head">
                <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                Edit Tenure
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
                    Edit Tenure
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
                          errors.tenure ? "is-invalid" : ""
                        }`}
                        id="title"
                        name="tenure"
                        placeholder="Enter tenure"
                        value={formData.tenure}
                        onChange={handleChange}
                      />
                      {errors.tenure && (
                        <div className="invalid-feedback">{errors.tenure}</div>
                      )}
                    </div>
                    <div className="col-lg-6 mb-4">
                      <label htmlFor="days" className="form-label">
                        Tenure Days<sup className="text-danger">*</sup>
                      </label>
                      <input
                        type="number"
                        className={`form-control ${
                          errors.days ? "is-invalid" : ""
                        }`}
                        id="days"
                        name="days"
                        placeholder="Enter days"
                        value={formData.days}
                        onChange={handleChange}
                      />
                      {errors.days && (
                        <div className="invalid-feedback">{errors.days}</div>
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
                          Updating...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faSave} className="me-2" />
                          Update Tenure
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
  );
}
