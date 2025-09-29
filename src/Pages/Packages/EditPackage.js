"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";

export default function EditPackage() {
  const [preview, setPreview] = useState(null);
  const { id } = useParams();
  const [organizations, setOrganizations] = useState([]);
  const [fetchingOrganizations, setFetchingOrganizations] = useState(false);
  const [fetchingSections, setFetchingSections] = useState(false);
  const [sections, setSections] = useState([]);
  const [languageList, setLanguageList] = useState([]);

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
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/admin/package/package/${id}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        if (response?.data?.status && response?.data?.data) {
          const data = response.data.data;
          setFormData(data);
          if (response.data.data?.organization_id) {
            fetchSections(response.data.data.organization_id);
          }
          if (data.image) {
            setPreview(`${baseUrl}/${data.image}`); // update path as per your backend
          }
        } else {
          toast.error("Failed to load package data");
        }
      } catch (error) {
        console.error("Error fetching package:", error);
        toast.error("Error fetching package details");
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) fetchPackage();
  }, [id]);
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

  const fetchSections = async (organization_id) => {
    try {
      setFetchingSections(true);
      const response = await axios.get(
        `${baseUrl}/sections?organization_id=${
          formData?.organization_id || organization_id
        }`,
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
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.language) newErrors.language = "language is required";
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
      if (formData.image instanceof File) {
        form.append("image", formData.image);
      }

      const response = await axios.put(
        `${baseUrl}/admin/package/package/${id}`,
        form,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data?.status) {
        toast.success(
          response?.data?.message || "Package updated successfully"
        );
        navigate("/packages");
      } else {
        toast.error(response?.data?.message || "Failed to update package");
      }
    } catch (err) {
      console.error("Error updating package:", err);
      toast.error(err?.response?.data?.message || "Failed to update package");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="text-center p-5">Loading package data...</div>;
  }

  return (
    <section className="main-sec">
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-6">
            <div className="dashboard-title">
              <h4 className="dash-head">
                <FontAwesomeIcon icon={faEdit} className="me-2" />
                Edit Package
              </h4>
            </div>
          </div>
          <div className="col-lg-6 d-flex justify-content-end align-items-start">
            <Link to="/packages" className="btn-back btn-add-question">
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
                        className={`form-select ${
                          errors.section_id ? "is-invalid" : ""
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
                      <label className="form-label">
                        Title<sup className="text-danger">*</sup>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.title ? "is-invalid" : ""
                        }`}
                      />
                      {errors.title && (
                        <div className="invalid-feedback">{errors.title}</div>
                      )}
                    </div>

                    <div className="col-lg-6 mb-4">
                      <label className="form-label">
                        Price<sup className="text-danger">*</sup>
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.price ? "is-invalid" : ""
                        }`}
                      />
                      {errors.price && (
                        <div className="invalid-feedback">{errors.price}</div>
                      )}
                    </div>

                    <div className="col-lg-4 mb-4">
                      <label className="form-label">
                        Duration (In Days)<sup className="text-danger">*</sup>
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.duration ? "is-invalid" : ""
                        }`}
                      />
                      {errors.duration && (
                        <div className="invalid-feedback">
                          {errors.duration}
                        </div>
                      )}
                    </div>
                    <div className="col-md-4 mb-4">
                      <label className="form-label">
                        Language <span className="text-danger">*</span>
                      </label>
                      <select
                        name="language"
                        className={`form-select ${
                          errors.language ? "is-invalid" : ""
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
                      <label className="form-label">Status</label>
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
                        className={`form-control ${
                          errors.price ? "is-invalid" : ""
                        }`}
                        placeholder="Enter mentor Commission"
                      />
                      {errors.mentorCommission && (
                        <div className="invalid-feedback">
                          {errors.mentorCommission}
                        </div>
                      )}
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
                        className={`form-control ${
                          errors.price ? "is-invalid" : ""
                        }`}
                        placeholder="Enter library Commission"
                      />
                      {errors.libraryCommission && (
                        <div className="invalid-feedback">
                          {errors.libraryCommission}
                        </div>
                      )}
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
                        className={`form-control ${
                          errors.price ? "is-invalid" : ""
                        }`}
                        placeholder="Enter owner Commission"
                      />
                    </div>

                    <div className="col-lg-12 mb-4">
                      <label className="form-label">
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
                      className="btn-save btn-add-question"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faSave} className="me-2" />
                          Update Package
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
      <style>
        {`
                .ql-container {
                height: 200px !important;
            }
                `}
      </style>
    </section>
  );
}
