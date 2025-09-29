import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../../config/baseUrl";
import axios from "axios";
import toastify from "../../config/toastify";

export default function CourseCategoryAdd() {
  const [formval, setFormval] = useState({
    title: "",
    image: null,
    status: "active",
  });

  let changeHandler = (e) => {
    setFormval((preVal) => ({ ...preVal, [e.target.name]: e.target.value }));
  };
  let navigate = useNavigate();

  let handleSubmit = async (e) => {
    e.preventDefault();

    if (!formval.title) {
      return toastify.error("name is require");
    }

    if (!formval.status) {
      return toastify.error("status is require");
    }
    if (!selectedFile) {
      return toastify.error("Img is require");
    }

    let formData = new FormData();
    formData.append("title", formval.title);
    formData.append("image", selectedFile);
    formData.append("status", formval.status);

    try {
      let response = await axios(
        `${baseUrl}/category`,
        {
          method: "POST",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
          data: formData,
        }
      );
      if (!response.status) {
        toastify.error("some error accoured");
        return;
      } else {
        toastify.success("Category Added");
      }
      navigate(`/categories`);
    } catch (error) {
      console.error("Error :", error);
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
                Add Course Category
              </h4>
            </div>
            <div className="custom-bredcump">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Add Course Category
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="col-lg-6 d-flex justify-content-end">
            <Link to="/categories" className="btn btn-info text-white">
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
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="title" className="form-label">
                      Name<sup className="text-danger">*</sup>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      placeholder="Category Name"
                      onChange={changeHandler}
                      value={formval?.title}
                    />
                  </div>
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
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="col-lg-12 mb-4">
                    <label htmlFor="image" className="form-label">
                      Icon<sup className="text-danger">*</sup>
                    </label>
                    <div className="file-upload-container">
                      <div
                        className={`file-upload-area ${isDragging ? "dragging" : ""
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
                              id="image"
                              name="image"
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
