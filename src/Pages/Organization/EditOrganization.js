"use client"

import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { baseUrl } from "../../config/baseUrl"
import Swal from "sweetalert2"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBook, faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { toast } from "react-toastify"

export default function EditOrganization() {
    const { id } = useParams()
    const [formData, setFormData] = useState({
        name: "",
        status: "active",
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const navigate = useNavigate()

    // Fetch organization data on mount
    useEffect(() => {
        const fetchOrganization = async () => {
            try {
                const response = await axios.get(`${baseUrl}/organizations/${id}`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                })

                if (response.data?.data) {
                    setFormData({
                        name: response.data.data.name,
                        status: response.data.data.status,
                    })
                } else {
                    Swal.fire("Error", "Organization not found", "error")
                    navigate("/organizations")
                }
            } catch (error) {
                console.error("Error fetching organization:", error)
                Swal.fire("Error", "Failed to fetch organization", "error")
                navigate("/organizations")
            }
        }

        fetchOrganization()
    }, [id, navigate])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            })
        }
    }

    const validateForm = () => {
        const newErrors = {}
        if (!formData.name.trim()) {
            newErrors.name = "Organization name is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return
        setLoading(true)

        try {
            const response = await axios.patch(`${baseUrl}/organizations/${id}`, formData, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            })

            if (response.data.status) {
                toast.success("Updated Successfully!")
                navigate("/organizations")
            } else {
                Swal.fire("Error", response.data.message || "Failed to update organization", "error")
            }
        } catch (error) {
            console.error("Error updating organization:", error)
            Swal.fire("Error", error.response?.data?.message || "Failed to update organization", "error")
        } finally {
            setLoading(false)
        }
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
                                    Edit Organization
                                </h4>
                            </div>
                            <div className="custom-bredcump">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link to="/">Dashboard</Link>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <Link to="/organizations">Organizations</Link>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            Edit Organization
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                        <div className="col-lg-6 d-flex justify-content-end align-items-start">
                            <Link to="/organizations" className="btn-back">
                                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                                Back to Organization
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
                                                <label htmlFor="name" className="form-label">
                                                    Organization<sup className="text-danger">*</sup>
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                                    id="name"
                                                    name="name"
                                                    placeholder="Enter name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                />
                                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
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
                                            <button type="submit" className="btn-save" disabled={loading}>
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        Updating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FontAwesomeIcon icon={faSave} className="me-2" />
                                                        Update Organization
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
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
        </>
    )
}
