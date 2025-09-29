import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Slide, toast } from "react-toastify";
import toastify from "../../config/toastify";



export default function BlogCategoryAdd() {
    const [formval, setFormval] = useState({ title: "" });

    const uploadCategory = async (e) => {
        e.preventDefault();


        try {
            const response = await fetch(`https://api.basementex.com/blog-category`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: formval.title,
                }),
            });

            const data = await response.json();

            if (data.status === true) {
                toastify.success(data.message, {
                    position: "top-right",
                    autoClose: 2000,
                    transition: Slide,
                });
            } else {
                toast.error(data.message || "Something went wrong", {
                    position: "top-right",
                    autoClose: 2000,
                    transition: Slide,
                });
            }

        } catch (error) {
            console.log("error", error);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        uploadCategory(e);
        formval.title = "";
        setFormval({
            ...formval,
            title: "",
        });
    }
    return (
        <>
            <section className="main-sec">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <div className="dashboard-title">
                            <h4 className="dash-head">
                                <i className="fa fa-users me-2" />
                                Add Blog Category
                            </h4>
                        </div>
                        <div className="custom-bredcump">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/">Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Add Blog Category
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="col-lg-6 d-flex justify-content-end">
                        <Link to="/blogs/category" className="btn btn-info text-white">
                            <i className="fa fa-arrow-left me-1"></i>
                            Back
                        </Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="cards edit-usr" >
                            <form action="" onSubmit={handleSubmit}>
                                <div className="row justify-content-center">
                                    <div className="col-lg-6 mb-4">
                                        <label htmlFor="title" className="form-label">
                                            Category Name<sup className="text-danger">*</sup>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="title"
                                            placeholder="Category Name"
                                            id="title"
                                            onChange={(e) =>
                                                setFormval({
                                                    ...formval,
                                                    title: e.target.value,
                                                })
                                            }
                                            value={formval?.title}
                                        />
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
