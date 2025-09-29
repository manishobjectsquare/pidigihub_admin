import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"


export default function BlogCategory() {


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
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );
            setCategory(response.data.data);
        } catch (error) {
            console.log("error", error);
        }
    };

    return (
        <>
            <section className="main-sec">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="dashboard-title">
                            <h4 className="dash-head">
                                <i className="fa fa-chart-bar me-2" />
                                Category List
                            </h4>
                        </div>
                        <div className="custom-bredcump">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/">Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Categories
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="col-lg-6 text-end">
                        <Link
                            to="add"
                            className="btn py-2 px-5 text-white btn-for-add"
                        >
                            <i className="fa fa-plus me-2"></i>
                            Add New
                        </Link>
                    </div>
                    <div className="col-lg-12">
                        <div className="cards bus-list">
                            <div className="bus-filter">
                                <div className="row ">
                                    <div className="col-lg-6">
                                        <h5 class="card-title">Category List</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="table table-responsive custom-table">
                                <table className="table table-borderless">
                                    <thead>
                                        <tr>
                                            <th>SN</th>
                                            <th>Name</th>
                                            {/* <th>Slug</th>
                                            <th>Status</th> */}
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {category.map((cat, i) => {
                                            return (
                                                <tr key={cat?._id}>
                                                    <td>{i + 1}</td>
                                                    <td>
                                                        <span>{cat?.title}</span>
                                                    </td>
                                                    {/* <td>
                                                        <span>{cat?.slug}</span>
                                                    </td> */}
                                                    {/* <td>
                                                        <button className={cat.status === "Active" ? "btn btn-pill btn-primary    btn-sm" : "btn btn-pill btn btn-danger btn btn-sm"}>
                                                            <span>{cat?.status === "Active" ? "Active" : "InActive"}</span>
                                                        </button>
                                                    </td> */}
                                                    <td>
                                                        <div className="action-buttons">
                                                            <Link
                                                                className="action-btn edit-btn"
                                                                to={`category/edit/${cat?._id}`}
                                                            >
                                                                <i className="fa fa-edit" />
                                                            </Link>
                                                            <button
                                                                title="Delete"
                                                                className="action-btn delete-btn"
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                                <span className="tooltip-text">View</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
