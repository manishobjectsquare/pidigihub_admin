"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

export default function EditSubject() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    status: "active",
  });
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [errors, setErrors] = useState({});
  const [notFound, setNotFound] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjectData();
  }, [id]);

  const fetchSubjectData = async () => {
    try {
      setFetchingData(true);
      const response = await axios.get(`${baseUrl}/subjects/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (response.data.status) {
        // const subject = response.data.data.find((s) => s._id === id);
        const subject = response.data.data;

        if (subject) {
          setFormData({
            name: subject.name,
            status: subject.status,
          });
        } else {
          toast.error("Subject Not Found");
        }
      }
    } catch (error) {
      console.error("Error fetching subject data:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Subject name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.patch(
        `${baseUrl}/subjects/${id}`,
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        toast.success("Subject Updated Successfully!");
        navigate("/subjects");
      } else {
        Swal.fire({
          title: "Error!",
          text: response.data.message || "Failed to update subject",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error updating subject:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to update subject",
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
                <h3 className="text-danger mb-4">Subject Not Found</h3>
                <p className="mb-4">
                  The subject you are trying to edit does not exist or has been
                  deleted.
                </p>
                <Link to="/subjects" className="btn-back">
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  Back to Subjects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="main-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="dashboard-title">
                <h4 className="dash-head">
                  <FontAwesomeIcon icon={faBook} className="me-2" />
                  Edit Subject
                </h4>
              </div>
              <div className="custom-bredcump">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="/subjects">Subjects</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Edit Subject
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="col-lg-6 d-flex justify-content-end align-items-start">
              <Link to="/subjects" className="btn-back">
                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                Back to Subjects
              </Link>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="cards">
                {fetchingData ? (
                  <div className="text-center py-5">
                    <div className="spinner"></div>
                    <p className="mt-3">Loading subject data...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="form-section">
                      <div className="row">
                        <div className="col-lg-6 mb-4">
                          <label htmlFor="name" className="form-label">
                            Subject Name<sup className="text-danger">*</sup>
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              errors.name ? "is-invalid" : ""
                            }`}
                            id="name"
                            name="name"
                            placeholder="Enter subject name"
                            value={formData.name}
                            onChange={handleChange}
                          />
                          {errors.name && (
                            <div className="invalid-feedback">
                              {errors.name}
                            </div>
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
                              Update Subject
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

      <style jsx>{`
        .form-section {
          background-color: #f8f9ff;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 20px;
          border-left: 4px solid #667eea;
        }

        .form-label {
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .form-control {
          border-radius: 5px;
          border: 1px solid #ced4da;
          padding: 10px 15px;
          transition: all 0.3s ease;
        }

        .form-control:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25);
        }

        .btn-save {
          background: #008080;
          color: white;
          border: none;
          padding: 10px 30px;
          border-radius: 5px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-save:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-save:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .btn-back {
          background-color: #f8f9fa;
          color: #333;
          border: 1px solid #ced4da;
          padding: 8px 15px;
          border-radius: 5px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-back:hover {
          background-color: #e9ecef;
          color: #333;
        }

        .cards {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 25px;
          margin-bottom: 30px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid #667eea;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
