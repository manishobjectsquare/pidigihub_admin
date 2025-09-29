"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import axios from "axios"
import { baseUrl } from "../../config/baseUrl"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { toast } from "react-toastify"

export default function EditPackage() {
    const [preview, setPreview] = useState(null)
    const { id } = useParams()
    const [organizations, setOrganizations] = useState([])
    const [fetchingOrganizations, setFetchingOrganizations] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        duration: "",
        description: "",
        image: null,
        organization_id: "",
        status: "active",
    })

    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const response = await axios.get(`${baseUrl}/admin/package/package/${id}`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                })
                if (response?.data?.status && response?.data?.data) {
                    const data = response.data.data
                    setFormData(data)
                    if (data.image) {
                        setPreview(`${baseUrl}/${data.image}`) // update path as per your backend
                    }
                } else {
                    toast.error("Failed to load package data")
                }
            } catch (error) {
                console.error("Error fetching package:", error)
                toast.error("Error fetching package details")
            } finally {
                setInitialLoading(false)
            }
        }

        if (id) fetchPackage()
    }, [id])
    useEffect(() => {
        fetchOrganizations()
    }, [])
    const fetchOrganizations = async () => {
        try {
            setFetchingOrganizations(true)
            const response = await axios.get(`${baseUrl}/organizations`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })

            if (response?.data?.status) {
                // Filter only active organizations
                const activeOrganizations = response?.data?.data?.filter((org) => org?.status === "active") || []
                setOrganizations(activeOrganizations)
            } else {
                toast.error(response?.data?.message || "Failed to fetch organizations")
            }
        } catch (error) {
            console.error("Error fetching organizations:", error)
            toast.error("Failed to fetch organizations")
        } finally {
            setFetchingOrganizations(false)
        }
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        // Clear error when field is edited
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            })
        }
    }
    const handleChange = (e) => {
        const { name, value, files } = e.target

        if (name === "image") {
            const file = files[0]
            setFormData((prev) => ({
                ...prev,
                image: file,
            }))
            setPreview(URL.createObjectURL(file)) // for preview
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }))
        }

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }



    if (initialLoading) {
        return <div className="text-center p-5">Loading package data...</div>
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
                            <form >
                                <div className="form-section">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">
                                                Organization <span className="text-danger">*</span>
                                            </label>
                                            <select
                                                name="organization_id"
                                                className={`form-select ${errors.organization_id ? "is-invalid" : ""}`}
                                                value={formData.organization_id}
                                                onChange={handleInputChange}
                                                disabled
                                            >
                                                <option value="">-- Select Organization --</option>
                                                {organizations.map((org) => (
                                                    <option key={org._id} value={org._id}>
                                                        {org.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.organization_id && <div className="invalid-feedback">{errors.organization_id}</div>}
                                            {fetchingOrganizations && (
                                                <div className="text-muted mt-1">
                                                    <small>Loading organizations...</small>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-lg-6 mb-4">
                                            <label className="form-label">Title<sup className="text-danger">*</sup></label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                                                disabled
                                            />
                                            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                                        </div>

                                        <div className="col-lg-6 mb-4">
                                            <label className="form-label">Price<sup className="text-danger">*</sup></label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                className={`form-control ${errors.price ? "is-invalid" : ""}`}
                                                disabled
                                            />
                                            {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                                        </div>

                                        <div className="col-lg-6 mb-4">
                                            <label className="form-label">Duration<sup className="text-danger">*</sup></label>
                                            <input
                                                type="text"
                                                name="duration"
                                                value={formData.duration}
                                                onChange={handleChange}
                                                className={`form-control ${errors.duration ? "is-invalid" : ""}`}
                                                disabled
                                            />
                                            {errors.duration && <div className="invalid-feedback">{errors.duration}</div>}
                                        </div>

                                        <div className="col-lg-6 mb-4">
                                            <label className="form-label">Status</label>
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleChange}
                                                className="form-control"
                                                disabled
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
                                        <div className="col-lg-6 mb-4">
                                            <label htmlFor="image" className="form-label">
                                                Package Image
                                            </label>
                                            {preview && (
                                                <div className="mt-3">
                                                    <img src={preview} alt="Preview" style={{ maxWidth: "200px", borderRadius: "8px" }} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-lg-12 mb-4">
                                            <label className="form-label">Description<sup className="text-danger">*</sup></label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                rows="4"
                                                className={`form-control ${errors.description ? "is-invalid" : ""}`}
                                                disabled
                                            />
                                            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
