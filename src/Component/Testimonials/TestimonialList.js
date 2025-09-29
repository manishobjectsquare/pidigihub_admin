
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function TestimonialList() {
    const [testimonial, setTestimonial] = useState([]);
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        fetchTestimonial();
    }, []);

    const fetchTestimonial = async () => {
        try {
            const response = await axios.get(`${baseUrl}/feedback/all`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });
            setTestimonial(response.data.data);
        } catch (error) {
            console.log("error", error);
        }
    };

    const handleDelete = async (_id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (confirm.isConfirmed) {
            try {
                await axios.delete(`${baseUrl}/feedback/${_id}`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                });

                // Update local state
                setTestimonial((prev) => prev.filter((item) => item._id !== _id));

                toast.error("Feedback has been deleted");
            } catch (error) {
                console.error("Delete Error:", error);
                toast.error("Failed To Delete")
            }
        }
    };


    // ✅ Handle Status Toggle
    const handleStatus = async (_id, currentStatus) => {
        const newStatus = currentStatus === "active" ? "inactive" : "active";
        setLoading(true)
        try {
            await axios.patch(
                `${baseUrl}/feedback/${_id}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );

            // Update local state
            setTestimonial((prev) =>
                prev.map((item) =>
                    item._id === _id ? { ...item, status: newStatus } : item
                )
            );
            toast.success("Status Updated")
        } catch (error) {
            console.log("Status Update Error:", error);
        } finally {
            setLoading(false)
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
                                Testimonial List
                            </h4>
                        </div>
                        <div className="custom-bredcump">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/">Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Testimonials
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="col-lg-6 text-end">
                        <Link to="add" className="btn py-2 px-5 text-white btn-for-add">
                            <i className="fa fa-plus me-2"></i>
                            Add New
                        </Link>
                    </div>
                    <div className="col-lg-12">
                        <div className="cards bus-list">
                            <div className="bus-filter">
                                <div className="row ">
                                    <div className="col-lg-6">
                                        <h5 className="card-title">Testimonials List</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="table table-responsive custom-table">
                                <table className="table table-borderless">
                                    <thead>
                                        <tr>
                                            <th>SN</th>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Comment</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {testimonial.map((test, i) => {
                                            return (
                                                <tr key={test?._id}>
                                                    <td>{i + 1}</td>
                                                    <td>
                                                        <img
                                                            src={`${baseUrl}/${test?.avatar}`}
                                                            width={100}
                                                            className="p-2"
                                                            alt="Testimonial"
                                                        />
                                                    </td>
                                                    <td>{test?.name}</td>
                                                    <td>{test?.role}</td>
                                                    <td>
                                                        <span className="cstm-wdth">{test?.text}</span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            onClick={() =>
                                                                handleStatus(test._id, test.status)
                                                            }
                                                            className={
                                                                test.status === "active"
                                                                    ? "btn btn-pill btn-primary btn-sm"
                                                                    : "btn btn-pill btn-danger btn-sm"
                                                            }
                                                        >
                                                            {test?.status}
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <Link
                                                                className="action-btn edit-btn"
                                                                to={`edit/${test?._id}`}
                                                                title="Edit"
                                                            >
                                                                <i className="fa fa-edit" />
                                                            </Link>
                                                            <button
                                                                className="action-btn delete-btn"
                                                                title="Delete"
                                                                onClick={() => handleDelete(test._id)}
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                                <span className="tooltip-text">Delete</span>
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
