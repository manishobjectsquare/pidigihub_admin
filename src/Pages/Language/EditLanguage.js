"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

export default function EditLanguage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    status: "active",
  });

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [errors, setErrors] = useState({});
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchLanguageData();
  }, [id]);

  const fetchLanguageData = async () => {
    try {
      setFetchingData(true);
      const response = await axios.get(
        `${baseUrl}/language/language-get/${id}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.data.status) {
        const language = response.data.data;

        if (language) {
          setFormData({
            name: language.name || "",
            code: language.code || "",
            status: language.isActive ? "active" : "inactive",
          });
        } else {
          setNotFound(true);
        }
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Error fetching language data:", error);
      setNotFound(true);
    } finally {
      setFetchingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Language name is required";
    if (!formData.code.trim()) newErrors.code = "Language code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        code: formData.code,
        isActive: formData.status === "active",
      };

      const response = await axios.put(
        `${baseUrl}/language/language-update/${id}`,
        payload,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        toast.success("Language updated successfully!");
        navigate("/languages");
      } else {
        Swal.fire({
          title: "Error!",
          text: response.data.message || "Failed to update language",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error updating language:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to update language",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (notFound) {
    return (
      <section className="main-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="cards text-center py-5">
                <h3 className="text-danger mb-4">Language Not Found</h3>
                <p className="mb-4">
                  The language you're trying to edit doesn't exist or was
                  deleted.
                </p>
                <Link to="/languages" className="btn-back">
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  Back to Languages
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="main-sec">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="dashboard-title">
              <h4 className="dash-head">
                <FontAwesomeIcon icon={faBook} className="me-2" />
                Edit Language
              </h4>
            </div>
            <div className="custom-bredcump">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/languages">Languages</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Edit Language
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="col-lg-6 d-flex justify-content-end align-items-start">
            <Link to="/languages" className="btn-back">
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Back to Languages
            </Link>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="cards">
              {fetchingData ? (
                <div className="text-center py-5">
                  <div className="spinner"></div>
                  <p className="mt-3">Loading language data...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-section">
                    <div className="row">
                      <div className="col-lg-6 mb-4">
                        <label htmlFor="name" className="form-label">
                          Language Name<sup className="text-danger">*</sup>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            errors.name ? "is-invalid" : ""
                          }`}
                          id="name"
                          name="name"
                          placeholder="Enter language name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                        {errors.name && (
                          <div className="invalid-feedback">{errors.name}</div>
                        )}
                      </div>

                      <div className="col-lg-6 mb-4">
                        <label htmlFor="code" className="form-label">
                          Language Code<sup className="text-danger">*</sup>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            errors.code ? "is-invalid" : ""
                          }`}
                          id="code"
                          name="code"
                          placeholder="Enter language code"
                          value={formData.code}
                          onChange={handleChange}
                        />
                        {errors.code && (
                          <div className="invalid-feedback">{errors.code}</div>
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
                            Update Language
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
