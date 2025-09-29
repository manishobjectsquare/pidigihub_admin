import React from "react";
import { Link } from "react-router-dom";
import StudentListTable from "../StudentListTable";
import InstructorListTable from "./InstructorListTable";
export default function Instructors() {
    const handleFormChange = () => {

    }
    return (
        <>
            <section className="main-sec">
                <div className="row">
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
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Instructors List
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <form
                                    action=""
                                    method="GET"
                                    onChange={handleFormChange}
                                    className="form_padding"
                                >
                                    <div className="row">
                                        <div className="col-md-4 form-group">
                                            <input
                                                type="text"
                                                name="keyword"
                                                value=""
                                                className="form-control"
                                                placeholder="Search"
                                            />
                                        </div>
                                        <div className="col-md-2 form-group">
                                            <select name="verified" id="verified" className="form-control">
                                                <option value="">Select Verified</option>
                                                <option value="1">Verified</option>
                                                <option value="0">Non-verified</option>
                                            </select>
                                        </div>
                                        <div className="col-md-2 form-group">
                                            <select name="banned" id="banned" className="form-control">
                                                <option value="">Select Banned</option>
                                                <option value="1">Banned</option>
                                                <option value="0">Non-banned</option>
                                            </select>
                                        </div>
                                        <div className="col-md-2 form-group">
                                            <select name="order_by" id="order_by" className="form-control">
                                                <option value="">Order By</option>
                                                <option value="1">ASC</option>
                                                <option value="0">DESC</option>
                                            </select>
                                        </div>
                                        <div className="col-md-2 form-group">
                                            <select name="par-page" id="par-page" className="form-control">
                                                <option value="">Per Page</option>
                                                <option value="10">10</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                                <option value="all">All</option>
                                            </select>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="cstm-tab card mt-3">
                            <div className="tab-content" id="myTabContent">
                                <InstructorListTable />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
