"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { baseUrl } from "../../config/baseUrl";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import axios from "axios";

export default function EditSection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    status: "active",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [organizations, setOrganizations] = useState([]);
  const [fetchingOrganizations, setFetchingOrganizations] = useState(false);

  useEffect(() => {
    fetch(`${baseUrl}/sections/${id}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.data) {
          setFormData({
            name: data.data.name || "",
            status: data.data.status || "active",
            organization_id: data.data?.organization_id?._id || "active",
          });
        } else {
          toast.error("Section not found");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        navigate("/sections");
      });
  }, [id, navigate]);

  useEffect(() => {
    fetchOrganizations();
  }, []);
  const fetchOrganizations = async () => {
    try {
      setFetchingOrganizations(true);
      const response = await axios.get(`${baseUrl}/organizations`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (response?.data?.status) {
        // Filter only active organizations
        const activeOrganizations =
          response?.data?.data?.filter((org) => org?.status === "active") || [];

        setOrganizations(activeOrganizations);
      } else {
        toast.error(response?.data?.message || "Failed to fetch organizations");
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
      toast.error("Failed to fetch organizations");
    } finally {
      setFetchingOrganizations(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Section name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/sections/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status) {
        toast.success("Section updated successfully");
        navigate("/sections");
      } else {
        Swal.fire(
          "Error!",
          data.message || "Failed to update section",
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating section:", error);
      Swal.fire("Error!", "Failed to update section", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };
  return (
    <section className="main-sec">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="dashboard-title">
              <h4 className="dash-head">
                <FontAwesomeIcon icon={faBook} className="me-2" />
                Edit Section
              </h4>
            </div>
            <div className="custom-bredcump">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/sections">Sections</Link>
                </li>
                <li className="breadcrumb-item active">Edit Section</li>
              </ol>
            </div>
          </div>
          <div className="col-lg-6 d-flex justify-content-end align-items-start">
            <Link to="/sections" className="btn-back">
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Back to Sections
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="cards mt-4">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">
                Organization <span className="text-danger">*</span>
              </label>
              <select
                name="organization_id"
                className={`form-select ${
                  errors.organization_id ? "is-invalid" : ""
                }`}
                value={formData.organization_id}
                onChange={handleInputChange}
                disabled={fetchingOrganizations}
                required
              >
                <option value="">-- Select Organization --</option>
                {organizations.map((org) => (
                  <option key={org._id} value={org._id}>
                    {org.name}
                  </option>
                ))}
              </select>
              {errors.organization_id && (
                <div className="invalid-feedback">{errors.organization_id}</div>
              )}
              {fetchingOrganizations && (
                <div className="text-muted mt-1">
                  <small>Loading organizations...</small>
                </div>
              )}
            </div>
            <div className="col-lg-6 mb-4">
              <label htmlFor="name" className="form-label">
                Section Name <sup className="text-danger">*</sup>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                placeholder="Enter section name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name}</div>
              )}
            </div>
            <div className="col-lg-6 mb-4">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                name="status"
                id="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="text-center">
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Saving...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} className="me-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
