import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl";
import Swal from "sweetalert2";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

export default function AllSubcategories() {
    const [category, setCategory] = useState([]);
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(
                `${baseUrl}/subcategory`,
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

    const handleDelete = (id) => {
        let apiCall = async () => {
            let res = await fetch(
                `${baseUrl}/subcategory/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );
            const result = await res.json();
            fetchCategories();
        };
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                apiCall();
                toast.success("Deleted Succesfully!")
            }
        });
    };

    const handleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === "active" ? "inactive" : "active";
        await axios(
            `${baseUrl}/subcategory/${id}`,
            {
                method: "PATCH",
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
                data: { status: newStatus },
            }
        );
        fetchCategories();
        toast.success("Status Changed!")
    };
    return (
        <>
            <section className="main-sec">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="dashboard-title">
                            <h4 className="dash-head">
                                <i className="fa fa-chart-bar me-2" />
                                Parent Category &gt; Parent Category Name
                            </h4>
                        </div>
                        <div className="custom-bredcump">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/">Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Sub Category List
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="col-lg-6 text-end">
                        <div className="d-flex align-items-center justify-content-end gap-3">
                            <Link
                                to="/categories"
                                download
                                className="btn btn-info text-white"
                            >
                                <i className="fa fa-arrow-left me-1"></i>
                                Back
                            </Link>
                            <Link
                                to="create"
                                className="btn btn-primary d-flex align-items-center justify-content-center"
                            >
                                <i className="fa fa-plus me-1"></i>
                                Add New
                            </Link>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="cards bus-list">
                            <div className="bus-filter">
                                <div className="row ">
                                    <div className="col-lg-6">
                                        <h5 className="card-title">Sub Category List</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="table table-responsive custom-table">
                                <table className="table table-borderless">
                                    <thead>
                                        <tr>
                                            <th>SN</th>
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>Package Count</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {category?.map((cat, i) => {

                                            return (
                                                <tr key={cat?._id}>
                                                    <td>{i + 1}</td>
                                                    <td>
                                                        <span>{cat?.title}</span>
                                                    </td>
                                                    <td>
                                                        <span>{cat?.categoryId?.title || "N/A"}</span>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex justify-content-center">
                                                            <Link
                                                                to={``}
                                                                className="action-btn edit-btn"
                                                            >
                                                                {cat?.packageId?.length || 0}
                                                            </Link>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <button
                                                            onClick={() => handleStatus(cat?._id, cat?.status)}
                                                            className={`status-badge ${cat.status === "active" ? "status-active" : "status-inactive"
                                                                }`}
                                                        >
                                                            {cat?.status === "active" ? (
                                                                <>
                                                                    <FontAwesomeIcon icon={faCheck} className="me-1" />
                                                                    Active
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FontAwesomeIcon icon={faTimes} className="me-1" />
                                                                    Inactive
                                                                </>
                                                            )}
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button
                                                                className="action-btn delete-btn "
                                                                onClick={() => handleDelete(cat?._id)}
                                                            >
                                                                <i className="fa fa-trash"></i>
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
