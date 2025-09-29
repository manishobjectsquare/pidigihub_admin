import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { baseUrl } from "../../config/baseUrl";
const JobList = () => {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${baseUrl}/career`);

      const data = await response.json();
      setJobs(data.data);
    } catch (error) { }
  };

  useEffect(() => {
    fetchJobs();
  }, []);
  return (
    <>
      <section className="main-sec">
        <div className="row">
          <div className="col-lg-6">
            <div className="dashboard-title">
              <h4 className="dash-head">
                <i className="fa fa-chart-bar me-2" />
                Jobs List
              </h4>
            </div>
            <div className="custom-bredcump">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Jobs List
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
                <h5 className="card-title">Jobs List</h5>
              </div>
              <div className="card-body">
                <div className="table table-responsive custom-table management-table general-table">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Location</th>
                        <th>Department</th>
                        <th>Description</th>
                        <th>Experience</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job, i) => (
                        <tr key={job?._id}>
                          <td>{i + 1}</td>
                          <td>{job?.title}</td>
                          <td>
                            {job?.location?.location_title}
                          </td>
                          <td>
                            {job?.department?.department_title}
                          </td>
                          <td>
                            {job?.description || "-"}
                          </td>
                          <td>
                            {job?.experience}
                          </td>
                          <td>
                            <div className="action-buttons">
                              <Link
                                to="/edit-cms"
                                className="action-btn edit-btn"
                              >
                                <i className="fa fa-edit"></i>
                                <span className="tooltip-text">Edit</span>
                              </Link>
                              <Link
                                to="/view-cms"
                                className="action-btn edit-btn"
                              >
                                <i className="fa fa-eye"></i>
                                <span className="tooltip-text">View</span>
                              </Link>
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

export default JobList;
