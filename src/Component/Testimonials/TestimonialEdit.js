import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { baseUrl } from "../../config/baseUrl";

export default function TestimonialEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formval, setFormval] = useState({
        name: "",
        role: "",
        content: "",
        image: "",
        status: "active",
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    // Fetch existing data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseUrl}/feedback/${id}`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                });
                if (response.data.status) {
                    const data = response.data.data;
                    setFormval({
                        name: data.name || "",
                        role: data.role || "",
                        content: data.text || "",
                        status: data.status || "active",
                        image: data.avatar || "",
                    });
                    setPreviewUrl(`${baseUrl}/${data.avatar}` || null);
                } else {
                    toast.error("Failed to fetch testimonial");
                }
            } catch (error) {
                console.error("Error fetching testimonial:", error);
            }
        };

        fetchData();
    }, [id]);

    const changeHandler = (e) => {
        setFormval((prevVal) => ({ ...prevVal, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("text", formval.content);
        formData.append("name", formval.name);
        formData.append("role", formval.role);
        formData.append("status", formval.status);
        if (selectedFile) {
            formData.append("avatar", selectedFile);
        }

        try {
            const response = await axios.put(`${baseUrl}/feedback/${id}`, formData, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });

            if (response.data.status === true) {
                toast.success("Testimonial Updated Successfully");
                navigate("/testimonials");
            } else {
                toast.error("Something went wrong");
            }
        } catch (error) {
            console.error("Error updating testimonial:", error);
            toast.error("Update failed");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => setPreviewUrl(reader.result);
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
            const reader = new FileReader();
            reader.onload = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    return (
        <section className="main-sec">
            <div className="row align-items-center">
                <div className="col-lg-6">
                    <div className="dashboard-title">
                        <h4 className="dash-head">
                            <i className="fa fa-users me-2" />
                            Edit Testimonial
                        </h4>
                    </div>
                    <div className="custom-bredcump">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/">Dashboard</Link>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    Edit Testimonial
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <div className="col-lg-6 d-flex justify-content-end">
                    <Link to="/testimonials" className="btn btn-info text-white">
                        <i className="fa fa-arrow-left me-1"></i>
                        Back
                    </Link>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-12">
                    <div className="cards edit-usr">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-lg-6 mb-4">
                                    <label htmlFor="name" className="form-label">
                                        Name<sup className="text-danger">*</sup>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        id="name"
                                        placeholder="Name"
                                        onChange={changeHandler}
                                        value={formval.name}
                                    />
                                </div>

                                <div className="col-lg-6 mb-4">
                                    <label htmlFor="role" className="form-label">
                                        Role<sup className="text-danger">*</sup>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="role"
                                        id="role"
                                        placeholder="Role"
                                        onChange={changeHandler}
                                        value={formval.role}
                                    />
                                </div>

                                <div className="col-lg-6 mb-4">
                                    <label htmlFor="content" className="form-label">
                                        Comment<sup className="text-danger">*</sup>
                                    </label>
                                    <textarea
                                        rows={6}
                                        className="form-control"
                                        name="content"
                                        id="content"
                                        placeholder="Comment"
                                        onChange={changeHandler}
                                        value={formval.content}
                                    ></textarea>
                                </div>

                                <div className="col-lg-6 mb-4">
                                    <label htmlFor="status" className="form-label">
                                        Status<sup className="text-danger">*</sup>
                                    </label>
                                    <select
                                        className="form-control"
                                        name="status"
                                        id="status"
                                        onChange={changeHandler}
                                        value={formval.status}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                <div className="col-lg-6 mb-4">
                                    <label htmlFor="image" className="form-label">
                                        Avatar Image<sup className="text-danger">*</sup>
                                    </label>
                                    <div className="file-upload-container">
                                        <div
                                            className={`file-upload-area ${isDragging ? "dragging" : ""}`}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                        >
                                            {!previewUrl ? (
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
                                                        src={previewUrl}
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
                                                    {selectedFile && (
                                                        <div className="file-info">
                                                            {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-12 text-center">
                                    <button type="submit" className="btn btn-for-add text-white">
                                        <i className="fa fa-save me-1"></i>
                                        Update
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
