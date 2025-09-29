import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";


export default function BlogAdd() {
    const [formval, setFormval] = useState({
        title: "",
        image: "",
        category: "",
        description: "",
    });

    let changeHandler = (e) => {
        setFormval((preVal) => ({ ...preVal, [e.target.name]: e.target.value }));
    };

    const stripHtml = (html) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || "";
    };
    const [category, setCategory] = useState([]);
    useEffect(() => {
        fetchCategories();
    }, []);
    const fetchCategories = async () => {
        try {
            const response = await axios.get(
                `https://api.basementex.com/blog-category`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            setCategory(response.data.data);
        } catch (error) {
            console.log("error", error);
        }
    };


    // let handleSubmit = async (e) => {
    //     e.preventDefault();

    //     try {
    //         const formData = new FormData();
    //         formData.append("title", formval.title);
    //         formData.append("category", formval.category);
    //         formData.append("description", formval.description);

    //         if (selectedFile) {
    //             formData.append("image", selectedFile);
    //         }

    //         const response = await axios.post(
    //             "https://api.basementex.com/blog",
    //             formData,
    //             {
    //                 headers: {
    //                     Authorization: localStorage.getItem("token"),
    //                     // Note: Don't manually set "Content-Type" for FormData
    //                 },
    //             }
    //         );

    //         if (response.data.status === true) {
    //             alert("Blog Added Successfully");
    //             setFormval({
    //                 title: "",
    //                 image: "",
    //                 category: "",
    //                 description: "",
    //             });
    //             setSelectedFile(null);
    //             setPreviewUrl(null);
    //         } else {
    //             alert("Something went wrong");
    //         }

    //     } catch (error) {
    //         console.error("Error :", error);
    //     }
    // };

    let handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("title", formval.title);
            formData.append("category", formval.category);

            // Strip HTML tags before saving
            const plainDescription = stripHtml(formval.description);
            formData.append("description", plainDescription);

            if (selectedFile) {
                formData.append("image", selectedFile);
            }

            const response = await axios.post("https://api.basementex.com/blog", formData, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });

            if (response.data.status === true) {
                toast.success("Blog Added Successfully");
                setFormval({ title: "", image: "", category: "", description: "" });
                setSelectedFile(null);
                setPreviewUrl(null);
            } else {
                toast.error("Something went wrong");
            }
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
                                Create Post
                            </h4>
                        </div>
                        <div className="custom-bredcump">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/">Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Create Post
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="col-lg-6 d-flex justify-content-end">
                        <Link to="/blogs" className="btn btn-info text-white">
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
                                            Title<sup className="text-danger">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="title"
                                            id="title"
                                            placeholder="Title"
                                            onChange={changeHandler}
                                            value={formval?.title}
                                        />
                                    </div>
                                    {/* <div className="col-lg-6 mb-4">
                                            <label htmlFor="slug" className="form-label">
                                                Slug<sup className="text-danger">*</sup>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="slug"
                                                placeholder="Slug"
                                                onChange={changeHandler}
                                                value={formval?.slug}
                                            />
                                        </div> */}
                                    <div className="col-lg-6 mb-4">
                                        <label htmlFor="category" className="form-label">
                                            Category<sup className="text-danger">*</sup>
                                        </label>
                                        {category.length > 0 ? (
                                            <select
                                                className="form-control"
                                                name="category"
                                                id="category"
                                                onChange={changeHandler}
                                                value={formval?.category}
                                            >
                                                <option>Select Category</option>
                                                {category.map((cat) => (
                                                    <option key={cat._id} value={cat._id}>
                                                        {cat.title}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <p>No categories available</p>
                                        )}
                                    </div>
                                    {/* <div className="col-lg-6 mb-4">
                                            <label htmlFor="select-user" className="form-label">
                                                Show at Homepage<sup className="text-danger">*</sup>
                                            </label>
                                            <select className="form-control">
                                                <option>Yes</option>
                                                <option>No</option>
                                            </select>
                                        </div>

                                        <div className="col-lg-6 mb-4">
                                            <label htmlFor="select-user" className="form-label">
                                                Status<sup className="text-danger">*</sup>
                                            </label>
                                            <select className="form-control">
                                                <option>Active</option>
                                                <option>Inactive</option>
                                            </select>
                                        </div>
                                        <div className="col-lg-6 mb-4">
                                            <label htmlFor="select-user" className="form-label">
                                                Mark As Popular<sup className="text-danger">*</sup>
                                            </label>
                                            <select className="form-control">
                                                <option>Yes</option>
                                                <option>No</option>
                                            </select>
                                        </div> */}
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
                                    <div className="col-lg-12 mb-4">
                                        <label htmlFor="description" className="form-label">
                                            Description<sup className="text-danger">*</sup>
                                        </label>
                                        <ReactQuill
                                            theme="snow"
                                            value={formval?.description}
                                            onChange={(value) =>
                                                setFormval({
                                                    ...formval,
                                                    description: value,
                                                })
                                            }
                                            modules={{
                                                toolbar: [
                                                    [{ header: [1, 2, false] }],
                                                    ["bold", "italic", "underline"],
                                                    ["link", "image"],
                                                    ["clean"],
                                                ],
                                            }} />
                                    </div>
                                    <div className="col-lg-12 text-center">
                                        <button
                                            type="Submit"
                                            className="btn btn-for-add text-white"
                                        >
                                            <i className="fa fa-save me-2"></i>
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
