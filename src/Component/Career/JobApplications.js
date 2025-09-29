import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { baseUrl } from "../../config/baseUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
const JobApplications = () => {
    const [Applications, setApplications] = useState([]);

    const fetchJobApplications = async () => {
        try {
            const response = await fetch(`${baseUrl}/job`);
            const data = await response.json();
            setApplications(data.data);
        }
        catch (error) {
            console.error("Error fetching job applications:", error);
        }
    };

    useEffect(() => {
        fetchJobApplications();
    }, []);
    return (
        <>
            <section className="main-sec">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="dashboard-title">
                            <h4 className="dash-head">
                                <i className="fa fa-chart-bar me-2" />
                                Job Application List
                            </h4>
                        </div>
                        <div className="custom-bredcump">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/">Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Job Application List
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="col-lg-6 text-end">
                        {/* <Link
                            to="/add-cms"
                            className="btn py-2 px-5 text-white btn-for-add"
                        >
                            <i className="fa fa-plus me-2"></i>
                            Add Page
                        </Link> */}
                    </div>

                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title">Job Application List</h5>
                            </div>
                            <div className="card-body">
                                <div className="table table-responsive custom-table management-table general-table">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Resume</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Applications.map((appl, i) => (
                                                <tr key={appl?._id}>
                                                    <td>{i + 1}</td>
                                                    <td>{appl?.name}</td>
                                                    <td>
                                                        {appl?.email}
                                                    </td>
                                                    <td>
                                                        {appl?.mobile_number}
                                                    </td>
                                                    <td>
                                                        {appl?.resume}
                                                        <Link
                                                            to={`https://api.basementex.com/${appl?.resume}`}
                                                            className="p-2 bg-primary ms-4 text-white rounded"
                                                            target="_blank"
                                                        >
                                                            <i className="fa fa-eye"></i>
                                                            <span className="tooltip-text">View</span>
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button
                                                                className="action-btn delete-btn"
                                                                type="button"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#pupup"
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                                <span className="tooltip-text">Delete</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default JobApplications;
