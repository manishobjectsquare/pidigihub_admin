import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toastify from "../../config/toastify";
import { baseUrl } from "../../config/baseUrl";

export default function EditSubcategory() {
    const { id, categoryId } = useParams();
    console.log(useParams())
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [formval, setFormval] = useState({
        title: "",
        status: "active",
    });

    // Fetch all subcategories and find the one matching the id
    useEffect(() => {
        const fetchSubcategory = async () => {
            try {
                const res = await axios.get("https://jobsuccessapi.objectsquare.in/subcategory", {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                });

                const subcategory = res.data?.data?.find((item) => item._id === id);

                if (!subcategory) {
                    toastify.error("Subcategory not found");
                    return;
                }

                setFormval({
                    title: subcategory.title,
                    status: subcategory.status,
                });
                if (subcategory.image) {
                    setPreviewUrl(`${baseUrl}/${subcategory.image}`); // adjust path if different
                }

            } catch (error) {
                console.error("Fetch error:", error);
                toastify.error("Failed to load subcategory");
            }
        };

        fetchSubcategory();
    }, [id]);

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setFormval((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", formval.title);
        formData.append("status", formval.status);
        if (selectedFile) {
            formData.append("image", selectedFile);
        }
        try {
            await axios.patch(
                `https://jobsuccessapi.objectsquare.in/subcategory/${id}`, formData,
                {
                    headers: {

                        Authorization: localStorage.getItem("token"),
                    },
                }
            );

            toastify.success("Subcategory updated successfully");
            navigate(`/categories/subcategories/${categoryId}`);
        } catch (error) {
            console.error("Update error:", error);
            toastify.error("Failed to update subcategory");
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

    const removeFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    return (
        <section className="main-sec">
            <div className="row align-items-center">
                <div className="col-lg-6">
                    <h4 className="dash-head">
                        <i className="fa fa-edit me-2" />
                        Edit Subcategory
                    </h4>
                </div>
                <div className="col-lg-6 d-flex justify-content-end">
                    <button to={""} className="btn btn-info text-white" onClick={() => navigate(-1)}>
                        <i className="fa fa-arrow-left me-1"></i> Back
                    </button>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="row mt-3">
                    <div className="col-lg-6 mb-4">
                        <label className="form-label">
                            Title <sup className="text-danger">*</sup>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formval.title}
                            onChange={changeHandler}
                            className="form-control"
                            placeholder="Subcategory Title"
                        />
                    </div>
                    <div className="col-lg-6 mb-4">
                        <label className="form-label">
                            Status <sup className="text-danger">*</sup>
                        </label>
                        <select
                            className="form-control"
                            name="status"
                            value={formval.status}
                            onChange={changeHandler}
                        >
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="col-lg-12 mb-4">
                        <label htmlFor="image" className="form-label">
                            Icon {previewUrl ? "" : <sup className="text-danger">*</sup>}
                        </label>
                        <div className="file-upload-container">
                            {!previewUrl ? (
                                <div className="file-upload-area">
                                    <div className="file-upload-icon">
                                        <i className="fa fa-cloud-upload"></i>
                                    </div>
                                    <div className="file-upload-text">Drag & drop or click to upload</div>
                                    <input
                                        type="file"
                                        className="file-upload-input"
                                        id="image"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            ) : (
                                <div className="file-preview-container">
                                    <img src={previewUrl} alt="Preview" className="file-preview" />
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

                    <div className="col-lg-12 text-center">
                        <button type="submit" className="btn btn-for-add text-white">
                            <i className="fa fa-save me-1"></i> Update
                        </button>
                    </div>
                </div>
            </form>
        </section >
    );
}
