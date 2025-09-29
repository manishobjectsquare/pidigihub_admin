"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { baseUrl } from "../../config/baseUrl"
import axios from "axios"
import toastify from "../../config/toastify"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileText, faPlus, faEdit, faTrash, faSearch } from "@fortawesome/free-solid-svg-icons"

export default function CmsList() {
  const [cmsData, setCmsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  useEffect(() => {
    fetchCmsData()
  }, [])

  const fetchCmsData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${baseUrl}/cms/get`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })

      if (response.data.status) {
        setCmsData(response.data.data || [])
      }
    } catch (error) {
      console.error("Error fetching CMS data:", error)
      toastify.error("Failed to fetch CMS data")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (window.confirm("Are you sure you want to delete this CMS content?")) {
      try {
        const response = await axios.delete(`${baseUrl}/cms/delete/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
          data: { title: title } // moved here correctly
        });
        if (response.data.status) {
          toastify.success("CMS content deleted successfully")
          fetchCmsData()
        } else {
          toastify.error("Failed to delete CMS content")
        }
      } catch (error) {
        console.error("Error deleting CMS:", error)
        toastify.error("Failed to delete CMS content")
      }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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
                  CMS Management
                </h4>
              </div>
              <div className="custom-bredcump">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      CMS
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="col-lg-6 d-flex justify-content-end">
              <Link to="/cms/add" className="btn btn-for-add text-white">
                <FontAwesomeIcon icon={faPlus} className="me-1" />
                Add CMS Content
              </Link>
            </div>
          </div>


          <div className="row">
            <div className="col-lg-12">
              <div className="cards">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="loading-spinner mx-auto mb-3"></div>
                    <h5>Loading CMS content...</h5>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Content Preview</th>
                          <th>Status</th>
                          <th>Created Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cmsData.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="text-center py-4">
                              <h5 className="text-muted">No CMS content found</h5>
                              <p>Create your first CMS content to get started.</p>
                            </td>
                          </tr>
                        ) : (
                          cmsData.map((cms) => (
                            <tr key={cms._id}>
                              <td>
                                <span className="text-primary">{cms.title}</span>
                              </td>
                              <td>
                                <div
                                  style={{
                                    maxWidth: "300px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {cms.content.replace(/<[^>]*>/g, "").substring(0, 100)}...
                                </div>
                              </td>
                              <td>
                                <span className={`badge ${cms.status === "active" ? "bg-success" : "bg-danger"}`}>
                                  {cms.status}
                                </span>
                              </td>
                              <td>{formatDate(cms.createdAt)}</td>
                              <td>
                                <div className="action-buttons">
                                  <Link
                                    to={`/cms/edit/${cms._id}`}
                                    className="btn btn-sm btn-primary me-2"
                                    title="Edit"
                                  >
                                    <FontAwesomeIcon icon={faEdit} />
                                  </Link>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(cms._id, cms?.title)}
                                    title="Delete"
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
