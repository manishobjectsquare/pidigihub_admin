import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { baseUrl } from "../../../config/baseUrl";

const RequestView = () => {
    const { id } = useParams();
    const [request, setRequest] = useState(null);
    const [status, setStatus] = useState("");

    useEffect(() => {
        const fetchRequestDetail = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/v1/web/instructor-request-list`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const data = res.data.data.find((item) => item._id === id);
                setRequest(data);
                setStatus(data?.status || "pending");
            } catch (error) {
                console.error("Error fetching request detail:", error);
            }
        };

        fetchRequestDetail();
    }, [id]);

    const handleStatusUpdate = async () => {
        try {
            const res = await axios.post(`${baseUrl}/api/v1/web/instructor-approve`, {
                id: id,
                status: status
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (res.data.status) {
                Swal.fire({
                    title: "Status Updated!",
                    icon: "success"
                });
                setRequest(prev => ({ ...prev, status }));
            } else {
                Swal.fire({
                    title: "Failed to update status",
                    text: res.data.message || "Something went wrong.",
                    icon: "error"
                });
            }
        } catch (error) {
            console.error("Status update error:", error);
            Swal.fire({
                title: "Error",
                text: "Something went wrong.",
                icon: "error"
            });
        }
    };
    const isImage = (filename) => /\.(jpg|jpeg|png|gif|bmp|webp|avif)$/i.test(filename);
    const isPDF = (filename) => /\.pdf$/i.test(filename);

    if (!request) return <div>Loading...</div>;

    const { user_id, extra_information, payout_account, payout_information } = request;

    return (
        <div className='main-sec'>
            <div className='row'>
                <div className="col-lg-12">
                    <div className="dashboard-title">
                        <h4 className="dash-head">
                            <i className="fa fa-users me-2" />
                            Instructors
                        </h4>
                    </div>
                    <div className="custom-bredcump">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/">Dashboard</Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link to="/instructor-requests">Instructors Request</Link>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    View
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-3 col-lg-4 mb-4">
                    <div className="card shadow text-center">
                        <div className="card-body">
                            <div className="d-flex justify-content-center mb-3">
                                <img
                                    src={user_id?.image ? `${baseUrl}/${user_id.image}` : "/user.jpg"}
                                    width={120}
                                    height={120}
                                    className="rounded-circle img-thumbnail"
                                    alt="User Profile"
                                />
                            </div>

                            <h5 className="card-title mb-1">{user_id?.name || "N/A"}</h5>
                            <p className="text-muted mb-2">
                                <i className="fa fa-envelope me-1"></i>{user_id?.email || "N/A"}
                            </p>

                            <p className="mb-2">
                                <i className="fa fa-calendar-alt me-1"></i>
                                <strong>Joined:</strong> {new Date(user_id?.created_at).toLocaleDateString()}
                            </p>

                            {/* <p className="mb-0">
                                <i className="fa fa-check-circle me-1"></i>
                                <strong>Email Verified:</strong>{" "}
                                <span className={user_id?.email_verified_at ? "text-success" : "text-danger"}>
                                    {user_id?.email_verified_at ? "Yes" : "No"}
                                </span>
                            </p> */}
                        </div>
                    </div>
                </div>


                <div className="col-md-9">
                    <div className="card mb-3">
                        <div className="card-header">
                            <h5 className="service_card card-title">Informations</h5>
                        </div>
                        <div className="card-body">
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <td><b>Status</b></td>
                                        <td>
                                            <span className={
                                                status === "approved" ? "btn btn-pills btn-success" :
                                                    status === "rejected" ? "btn btn-pills btn-danger" :
                                                        "btn btn-pills btn-warning text-white"
                                            }>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><b>Extra Information</b></td>
                                        <td>{extra_information || "Not Provided"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="card mb-3">
                        <div className="card-header">
                            <h5 className="service_card card-title">Payout Information</h5>
                        </div>
                        <div className="card-body">
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <td><b>Payout Account</b></td>
                                        <td>{payout_account || "Not Provided"}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Payout Details</b></td>
                                        <td>{payout_information || "Not Provided"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="card mb-3">
                        <div className="card-header">
                            <h5 className="service_card card-title">Uploaded Documents</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">

                                {/* Certificate */}
                                <div className="col-md-6 text-center">
                                    <h6>Certificate</h6>
                                    {request?.certificate ? (
                                        isImage(request?.certificate) ? (
                                            <a
                                                href={`${baseUrl}/${request?.certificate}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <img
                                                    src={`${baseUrl}/${request?.certificate}`}
                                                    alt="Certificate"
                                                    style={{ width: '100%', maxHeight: '250px', objectFit: 'contain' }}
                                                />
                                            </a>
                                        ) : (
                                            <a
                                                href={`${baseUrl}/${request?.certificate}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-outline-primary"
                                            >
                                                View Certificate PDF
                                            </a>
                                        )
                                    ) : (
                                        <p>No Certificate Uploaded</p>
                                    )}
                                </div>

                                {/* Identity Scan */}
                                <div className="col-md-6 text-center">
                                    <h6>Identity Scan</h6>
                                    {request?.identity_scan ? (
                                        isImage(request?.identity_scan) ? (
                                            <a
                                                href={`${baseUrl}/${request?.identity_scan}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <img
                                                    src={`${baseUrl}/${request?.identity_scan}`}
                                                    alt="Identity Scan"
                                                    style={{ width: '100%', maxHeight: '250px', objectFit: 'contain' }}
                                                />
                                            </a>
                                        ) : (
                                            <a
                                                href={`${baseUrl}/${request?.identity_scan}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-outline-primary"
                                            >
                                                View Identity PDF
                                            </a>
                                        )
                                    ) : (
                                        <p>No Identity Document Uploaded</p>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>


                    <div className="card">
                        <div className="card-header">
                            <h5 className="service_card card-title">Update Status</h5>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label htmlFor="statusSelect"><b>Change Status</b></label>
                                <select
                                    id="statusSelect"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="form-control"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <button
                                    onClick={handleStatusUpdate}
                                    className="btn btn-success mt-2"
                                >
                                    Update Status
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestView;
