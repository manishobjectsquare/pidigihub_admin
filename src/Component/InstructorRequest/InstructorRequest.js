
import { Link } from "react-router-dom";

import moment from "moment";

import { baseUrl } from "../../config/baseUrl"
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";


export default function InstructorRequest() {

    const [requests, setRequests] = useState([])

    const fetchRequests = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/v1/web/instructor-request-list`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setRequests(data.data);
            } else {
                console.error("Failed to fetch requests:", data.message);
            }
        } catch (error) {
            console.error("Error fetching requests:", error);

        }
    }

    const handleStatus = () => {

    }
    useEffect(() => {
        fetchRequests()
    }, [])

    const handleApproveDetails = async (id, status) => {
        try {
            const response = await axios.post(`${baseUrl}/api/v1/web/instructor-approve`, {
                id,
                status,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.data.status) {
                Swal.fire({
                    title: "Status Changed!",
                    icon: "success",
                    draggable: true,
                });
                fetchRequests();
            } else {
                Swal.fire({
                    title: "Failed to update status",
                    text: response.data.message || "Something went wrong.",
                    icon: "error"
                });
            }

        } catch (error) {
            console.error("Error updating status:", error);
            Swal.fire({
                title: "Error",
                text: "Failed to update status.",
                icon: "error"
            });
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
                                Instructor Request
                            </h4>
                        </div>
                        <div className="custom-bredcump">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/">Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Instructor Request
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>


                    <div className="col-lg-12">
                        <div className="cards bus-list">
                            <div className="bus-filter">
                                <div className="row ">
                                    <div className="col-lg-6">
                                        <h5 class="card-title">Instructor Request List</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="table table-responsive custom-table">
                                <table className="table table-borderless">
                                    <thead>
                                        <tr>
                                            <th>Sr. no.</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Status</th>
                                            <th>Approve / Reject</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requests.map((req, i) => {
                                            return (
                                                <tr key={req?.id}>
                                                    <td>{i + 1}</td>
                                                    <td>
                                                        <span>{req?.instructorName}</span>
                                                    </td>
                                                    <td>
                                                        <span>{req?.user_id?.email}</span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            onClick={() => handleStatus(req?._id, req?.status)}

                                                            className={
                                                                req?.status === "approved"
                                                                    ? "btn btn-pill btn btn-success btn-sm"
                                                                    : req?.status === "rejected"
                                                                        ? "btn btn-pill btn btn-danger btn-sm"
                                                                        : "btn btn-pill btn btn-warning btn-sm text-white"
                                                            }>
                                                            <span>
                                                                {
                                                                    req?.status === "approved"
                                                                        ? "Approved"
                                                                        : req?.status === "rejected"
                                                                            ? "Rejected"
                                                                            : "Pending"
                                                                }
                                                            </span>


                                                        </button>
                                                    </td>
                                                    <td className="course-table-approve">
                                                        <select
                                                            name="status"
                                                            value={req?.status}
                                                            onChange={(e) => handleApproveDetails(req?._id, e.target.value)}
                                                            className="form-control course-change-status"
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="approved">Approved</option>
                                                            <option value="rejected">Rejected</option>
                                                        </select>

                                                    </td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <Link
                                                                to={`view/${req?._id}`}
                                                                className="action-btn edit-btn "
                                                            >
                                                                <i className="fa fa-eye"></i>
                                                                <span className="tooltip-text">View</span>
                                                            </Link>
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
