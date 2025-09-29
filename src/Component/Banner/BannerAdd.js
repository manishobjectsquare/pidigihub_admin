import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../../config/baseUrl";
import axios from "axios";
import toastify from "../../config/toastify";

export default function BannerAdd() {
  const [formval, setFormval] = useState({
    name: "",
    link: "",
    status: "",
  });
  let navigate = useNavigate();
  let changeHandler = (e) => {
    setFormval((preVal) => ({ ...preVal, [e.target.name]: e.target.value }));
  };

  let handleSubmit = async (e) => {
    e.preventDefault();

    if (!formval.link) {
      return toastify.error("link is required");
    }

    if (!selectedFile) {
      return toastify.error("Image is required");
    }

    let formData = new FormData();
    formData.append("link", formval.link);
    formData.append("status", formval.status);
    formData.append("image", selectedFile); // field name expected by backend

    try {
      let response = await axios.post(`${baseUrl}/banner`, formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (!response?.data?.status) {
        toastify.error(response?.data?.message || "Some error occurred");
        return;
      }

      toastify.success("Banner added successfully");
      navigate(`/banner`);
    } catch (error) {
      console.error("Error :", error);
      toastify.error("Server error");
    }
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <>
      <section className="main-sec">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="dashboard-title">
              <h4 className="dash-head">
                <i className="fa fa-users me-2" />
                Add Banner
              </h4>
            </div>
            <div className="custom-bredcump">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Add Banner
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="col-lg-6 d-flex justify-content-end">
            <Link to="/banner" className="btn btn-info text-white">
              <i className="fa fa-arrow-left me-1"></i>
              Back
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="cards edit-usr">
              <form action="" onSubmit={handleSubmit}>
                <div className="row">
                  {/* <div className="col-lg-6 mb-4">
                    <label htmlFor="name" className="form-label">
                      Title<sup className="text-danger">*</sup>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Enter Title"
                      onChange={changeHandler}
                      value={formval?.title}
                    />
                  </div> */}
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="slug" className="form-label">
                      link <sup className="text-danger">*</sup>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="link"
                      placeholder="link"
                      onChange={changeHandler}
                      value={formval?.link}
                    />
                  </div>

                  {/* <div className="col-lg-6 mb-4">
                    <label htmlFor="select-user" className="form-label">
                      Show at trending<sup className="text-danger">*</sup>
                    </label>
                    <select className="form-control">
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div> */}

                  <div className="col-lg-6 mb-4">
                    <label htmlFor="select-user" className="form-label">
                      Status<sup className="text-danger">*</sup>
                    </label>
                    <select
                      className="form-control"
                      name="status"
                      onChange={changeHandler}
                      value={formval?.status}
                    >
                      <option value={""}>Select Status</option>
                      <option value={"active"}>Active</option>
                      <option value={"inactive"}>Inactive</option>
                    </select>
                  </div>
                  <div className="col-lg-12 mb-4">
                    <label htmlFor="icon" className="form-label">
                      Icon<sup className="text-danger">*</sup>
                    </label>
                    <div className="file-upload-container">
                      <div
                        className={`file-upload-area ${
                          isDragging ? "dragging" : ""
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        {!selectedFile ? (
                          <>
                            <div className="file-upload-icon">
                              <i className="fa fa-cloud-upload"></i>
                            </div>
                            <div className="file-upload-text">
                              Drag & Drop your image here
                            </div>
                            <div className="file-upload-subtext">
                              or click to browse files
                            </div>
                            <input
                              type="file"
                              className="file-upload-input"
                              id="icon"
                              name="icon"
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </>
                        ) : (
                          <div className="file-preview-container">
                            <img
                              src={previewUrl || "/placeholder.svg"}
                              alt="Preview"
                              className="file-preview"
                            />
                            <button
                              type="button"
                              className="file-remove-btn"
                              onClick={removeFile}
                            >
                              <i className="fa fa-times"></i>
                            </button>
                            <div className="file-info">
                              {selectedFile.name} (
                              {Math.round(selectedFile.size / 1024)} KB)
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 text-center">
                    <button
                      type="Submit"
                      className="btn btn-for-add text-white"
                    >
                      <i className="fa fa-save me-1"></i>
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
