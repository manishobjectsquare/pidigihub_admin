"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { baseUrl } from "../../config/baseUrl"
import axios from "axios"
import toastify from "../../config/toastify"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faFileText, faSave } from "@fortawesome/free-solid-svg-icons"
import ReactQuill from "react-quill"

export default function CmsAdd() {
  const [formval, setFormval] = useState({
    title: "",
    content: "",
    status: "active",
  })
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const changeHandler = (e) => {
    const { name, value } = e.target
    setFormval((prevVal) => ({
      ...prevVal,
      [name]: value,
    }))
  }
  const handleQuillChange = (value) => {
    setFormval((prevVal) => ({
      ...prevVal,
      content: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Form validation
    if (!formval.title) {
      return toastify.error("Title is required")
    }
    if (!formval.content) {
      return toastify.error("Content is required")
    }

    setLoading(true)

    try {
      const payload = {
        title: formval.title,
        content: formval.content,
        status: formval.status,
      }

      const response = await axios.post(`${baseUrl}/cms/add`, payload, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })

      if (response.data.status) {
        toastify.success("CMS content created successfully")
        navigate("/cms")
      } else {
        toastify.error(response.data.message || "An error occurred while creating CMS content")
      }
    } catch (error) {
      console.error("Error:", error)
      toastify.error(error.response?.data?.message || "Failed to create CMS content")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="main-sec">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="dashboard-title">
                <h4 className="dash-head">
                  <FontAwesomeIcon icon={faFileText} className="me-2" />
                  Add CMS Content
                </h4>
              </div>
              <div className="custom-bredcump">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="/cms">CMS</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Add CMS Content
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="col-lg-6 d-flex justify-content-end">
              <Link to="/cms" className="btn btn-info text-white">
                <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                Back
              </Link>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="cards edit-usr">
                <form onSubmit={handleSubmit}>
                  {/* Basic Information */}
                  <div className="form-section">
                    <h5 className="section-title">CMS Content Information</h5>
                    <div className="row">
                      <div className="col-lg-6 mb-4">
                        <label htmlFor="title" className="form-label">
                          Title<sup className="text-danger">*</sup>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="title"
                          placeholder="Enter CMS title (e.g., privacy-policy, terms-conditions)"
                          onChange={changeHandler}
                          value={formval?.title}
                        />
                        <small className="text-muted">
                          Use lowercase with hyphens (e.g., privacy-policy, refund-policy)
                        </small>
                      </div>
                      <div className="col-lg-6 mb-4">
                        <label htmlFor="status" className="form-label">
                          Status<sup className="text-danger">*</sup>
                        </label>
                        <select className="form-control" name="status" onChange={changeHandler} value={formval?.status}>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      <div className="col-lg-12 mb-4">
                        <label htmlFor="content" className="form-label">
                          Content<sup className="text-danger">*</sup>
                        </label>
                        {/* <textarea
                          className="form-control"
                          name="content"
                          rows="15"
                          placeholder="Enter CMS content (HTML supported)"
                          onChange={changeHandler}
                          value={formval?.content}
                          style={{ minHeight: "400px" }}
                        ></textarea> */}
                        <ReactQuill
                          value={formval?.content}
                          onChange={handleQuillChange}
                        />
                        <small className="text-muted">You can use HTML tags for formatting</small>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12 text-center mt-4">
                    <button type="submit" className="btn btn-for-add text-white" disabled={loading}>
                      {loading && <div className="loading-spinner"></div>}
                      <FontAwesomeIcon icon={faSave} className="me-2" />
                      {loading ? "Creating..." : "Create CMS Content"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
