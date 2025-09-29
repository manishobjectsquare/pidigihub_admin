"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";

export default function AddPackage() {
  const [preview, setPreview] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [fetchingSections, setFetchingSections] = useState(false);
  const [fetchingOrganizations, setFetchingOrganizations] = useState(false);

  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    duration: "",
    description: "",
    image: null,
    organization_id: "",
    section_id: "",
    status: "active",
    mentorCommission: "",
    libraryCommission: "",
    authorCommission: "",
    language: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [languageList, setLanguageList] = useState([]);

  useEffect(() => {
    fetchOrganizations();
    fetchLanguageList();
  }, []);

  const fetchLanguageList = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/language/language-list?status=true`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.data.status) {
        setLanguageList(response.data.data);
      } else {
        toast.error("Failed to fetch language list");
      }
    } catch (error) {
      console.error("Error fetching language list:", error);
      toast.error("Error fetching language list");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };
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

  useEffect(() => {
    if (formData?.organization_id) {
      fetchSections();
    }
  }, [formData?.organization_id]);

  const fetchSections = async () => {
    try {
      setFetchingSections(true);
      const response = await axios.get(
        `${baseUrl}/sections?organization_id=${formData?.organization_id}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response?.data?.status) {
        // Filter only active sections
        const activeSections =
          response?.data?.data?.filter(
            (section) => section?.status === "active"
          ) || [];
        setSections(activeSections);
      } else {
        toast.error(response?.data?.message || "Failed to fetch sections");
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      toast.error("Failed to fetch sections");
    } finally {
      setFetchingSections(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setPreview(URL.createObjectURL(file)); // for preview
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const handleEditorChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));

    if (errors.description) {
      setErrors((prev) => ({
        ...prev,
        description: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.price.trim()) newErrors.price = "Price is required";
    if (!formData.duration.trim()) newErrors.duration = "Duration is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("price", formData.price);
      form.append("duration", formData.duration);
      form.append("description", formData.description);
      form.append("status", formData.status);
      form.append("organization_id", formData.organization_id);
      form.append("section_id", formData.section_id);
      form.append("mentorCommission", formData.mentorCommission || 0);
      form.append("libraryCommission", formData.libraryCommission || 0);
      form.append("authorCommission", formData.authorCommission || 0);
      form.append("language", formData.language);

      if (formData.image) form.append("image", formData.image);

      const response = await axios.post(`${baseUrl}/admin/package`, form, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.data?.status) {
        toast.success(
          response?.data?.message || "Package created successfully"
        );
        navigate("/packages");
      } else {
        toast.error(response?.data?.message || "Failed to create package");
      }
    } catch (err) {
      console.error("Error creating package:", err);
      toast.error(err?.response?.data?.message || "Failed to create package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="main-sec">
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-6">
            <div className="dashboard-title">
              <h4 className="dash-head">
                <FontAwesomeIcon icon={faBox} className="me-2" />
                Add Package
              </h4>
            </div>
          </div>
          <div className="col-lg-6 d-flex justify-content-end align-items-start">
            <Link to="/packages" className="btn-back">
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Back to Packages
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="cards">
              <form onSubmit={handleSubmit}>
                <div className="form-section">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Organization <span className="text-danger">*</span>
                      </label>
                      <select
                        name="organization_id"
                        className={`form-select ${errors.organization_id ? "is-invalid" : ""
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
                        <div className="invalid-feedback">
                          {errors.organization_id}
                        </div>
                      )}
                      {fetchingOrganizations && (
                        <div className="text-muted mt-1">
                          <small>Loading organizations...</small>
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Section <span className="text-danger">*</span>
                      </label>
                      <select
                        name="section_id"
                        className={`form-select ${errors.section_id ? "is-invalid" : ""
                          }`}
                        value={formData.section_id}
                        onChange={handleInputChange}
                        disabled={fetchingOrganizations}
                        required
                      >
                        <option value="">-- Select Section --</option>
                        {sections.map((section) => (
                          <option key={section._id} value={section._id}>
                            {section.name}
                          </option>
                        ))}
                      </select>
                      {errors.section_id && (
                        <div className="invalid-feedback">
                          {errors.section_id}
                        </div>
                      )}
                      {fetchingSections && (
                        <div className="text-muted mt-1">
                          <small>Loading sections...</small>
                        </div>
                      )}
                    </div>
                    <div className="col-lg-6 mb-4">
                      <label htmlFor="title" className="form-label">
                        Title<sup className="text-danger">*</sup>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={`form-control ${errors.title ? "is-invalid" : ""
                          }`}
                        placeholder="Enter package title"
                      />
                      {errors.title && (
                        <div className="invalid-feedback">{errors.title}</div>
                      )}
                    </div>

                    <div className="col-lg-6 mb-4">
                      <label htmlFor="price" className="form-label">
                        Price<sup className="text-danger">*</sup>
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={`form-control ${errors.price ? "is-invalid" : ""
                          }`}
                        placeholder="Enter price"
                      />
                      {errors.price && (
                        <div className="invalid-feedback">{errors.price}</div>
                      )}
                    </div>

                    <div className="col-lg-4 mb-4">
                      <label htmlFor="duration" className="form-label">
                        Duration (In Days)<sup className="text-danger">*</sup>
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className={`form-control ${errors.duration ? "is-invalid" : ""
                          }`}
                        placeholder="e.g. 14 days"
                      />
                      {errors.duration && (
                        <div className="invalid-feedback">
                          {errors.duration}
                        </div>
                      )}
                    </div>


                    <div className="col-md-3 mb-4">
                      <label className="form-label">
                        Language <span className="text-danger">*</span>
                      </label>
                      <select
                        name="language"
                        className={`form-select ${errors.language ? "is-invalid" : ""
                          }`}
                        value={formData.language}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">-- Select language --</option>
                        {languageList.map((lang) => (
                          <option key={lang._id} value={lang._id}>
                            {lang.name}
                          </option>
                        ))}
                      </select>
                      {errors.language && (
                        <div className="invalid-feedback">
                          {errors.language}
                        </div>
                      )}
                    </div>
                    <div className="col-lg-4 mb-4">
                      <label htmlFor="status" className="form-label">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="form-control"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="col-lg-6 mb-4">
                      <label htmlFor="image" className="form-label">
                        Image
                      </label>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="form-control"
                      />
                      {preview && (
                        <div className="mt-3">
                          <img
                            src={preview}
                            alt="Preview"
                            style={{ maxWidth: "200px", borderRadius: "8px" }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="col-lg-6 mb-4">
                      <label htmlFor="price" className="form-label">
                        Mentor Commission(IN %)
                        <sup className="text-danger">*</sup>
                      </label>
                      <input
                        type="number"
                        name="mentorCommission"
                        value={formData.mentorCommission}
                        onChange={handleChange}
                        className={`form-control ${errors.price ? "is-invalid" : ""
                          }`}
                        placeholder="Enter mentor Commission"
                      />
                    </div>
                    <div className="col-lg-6 mb-4">
                      <label htmlFor="price" className="form-label">
                        Library Commission(IN %)
                        <sup className="text-danger">*</sup>
                      </label>
                      <input
                        type="number"
                        name="libraryCommission"
                        value={formData.libraryCommission}
                        onChange={handleChange}
                        className={`form-control ${errors.price ? "is-invalid" : ""
                          }`}
                        placeholder="Enter library Commission"
                      />
                    </div>
                    <div className="col-lg-6 mb-4">
                      <label htmlFor="price" className="form-label">
                        Author Commission(IN %)
                        <sup className="text-danger">*</sup>
                      </label>
                      <input
                        type="number"
                        name="authorCommission"
                        value={formData.authorCommission}
                        onChange={handleChange}
                        className={`form-control ${errors.price ? "is-invalid" : ""
                          }`}
                        placeholder="Enter owner Commission"
                      />
                    </div>

                    <div className="col-lg-12 mb-4">
                      <label htmlFor="description" className="form-label">
                        Description<sup className="text-danger">*</sup>
                      </label>
                      <ReactQuill
                        name="description"
                        value={formData.description}
                        onChange={handleEditorChange}
                      />
                      {errors.description && (
                        <div className="invalid-feedback">
                          {errors.description}
                        </div>
                      )}
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
                          Save Package
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
      <style>{`
            .ql-container {
                height: 200px !important;
            }
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
                
                .subject-select-container {
                    display: flex;
                    gap: 10px;
                    position: relative;
                }
                
                .btn-add-subject {
                    width: 38px;
                    height: 38px;
                    background: #008080;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                    margin-top: 1px;
                }
                
                .btn-add-subject:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
                    color: white;
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
            `}</style>
    </section>
  );
}
