import React from "react";
import { Link } from "react-router-dom";
import StudentListTable from "./StudentListTable";
export default function Students() {
  return (
    <>
      <section className="main-sec">
        <div className="row">
          <div className="col-lg-12">
            <div className="dashboard-title">
              <h4 className="dash-head">
                <i className="fa fa-users me-2" />
                Student List
              </h4>
            </div>
            <div className="custom-bredcump">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Student List
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="cstm-tab">
              <div className="tab-content" id="myTabContent">
                <StudentListTable />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
