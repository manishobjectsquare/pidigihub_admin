import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { baseUrl } from "../../config/baseUrl";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
export default function UserView() {
  let { id } = useParams();
  const [formval, setFormval] = useState({});

  useEffect(() => {
    (async () => {
      let response = await axios(`${baseUrl}/module/admin/user-viewset/${id}`, {
        method: "GET",
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      });
      // console.log(response);
      if (response?.data.code === 200) {
        let responsedata = response.data.data;
        responsedata.mobile = responsedata.country_code + responsedata.mobile;
        setFormval(responsedata);
      }
    })();
  }, []);

  return (
    <>
      <section className="main-sec">
        <div className="row">
          <div className="col-lg-12">
            <div className="dashboard-title">
              <h4 className="dash-head">
                <i className="fa fa-users me-2" />
                View Users
              </h4>
            </div>
            <div className="custom-bredcump">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    View Users
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="cards edit-usr">
              <form action="">
                <div className="row">
                  <div className="col-lg-3 mb-4">
                    <label htmlFor="" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="first_name"
                      disabled
                      defaultValue={formval?.first_name}
                    />
                  </div>
                  <div className="col-lg-3 mb-4">
                    <label htmlFor="" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="last_name"
                      disabled
                      defaultValue={formval?.last_name}
                    />
                  </div>
                  <div className="col-lg-3 mb-4">
                    <label htmlFor="" className="form-label">
                      Mobile Number
                    </label>
                    <PhoneInput
                      country={"in"}
                      name="mobile"
                      // country={formval.country_code}
                      value={formval.mobile}
                      placeholder="Mobile number"
                      style={{
                        backgroundColor: "#e9ecef",
                      }}
                      inputStyle={{
                        width: "100%",
                        height: "37px",
                        backgroundColor: "#e9ecef",
                      }}
                      disabled
                      // onChange={ChangeHandler}
                      containerStyle={{
                        padding: "40px",
                      }}
                    />
                  </div>
                  <div className="col-lg-3 mb-4">
                    <label htmlFor="" className="form-label">
                      User Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="mobile"
                      disabled
                      defaultValue={formval?.username}
                    />
                  </div>
                  <div className="col-lg-3 mb-4">
                    <label htmlFor="" className="form-label">
                      Email
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="email"
                      disabled
                      defaultValue={formval?.email}
                    />
                  </div>
                  <div className="col-lg-3 mb-4">
                    <label htmlFor="" className="form-label">
                      Role
                    </label>
                    <select
                      name="user_type"
                      disabled
                      className="form-select"
                      value={formval?.user_type}
                    >
                      <option>Roles</option>
                      <option value={"CLEANER"}>Cleaner</option>;
                      <option value={"CLEANING_MANAGER"}>
                        Cleaning Manager
                      </option>
                      <option value={"CLIENT"}>Client</option>
                    </select>
                  </div>
                  <div className="col-lg-3 mb-4">
                    <label htmlFor="" className="form-label">
                      Depot
                    </label>
                    <select name="user_type" className="form-select">
                      {formval?.depo_details?.map((arr) => (
                        <option value="" key={arr?._id}>
                          {arr?.depo_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-lg-3 mb-4">
                    <label htmlFor="" className="form-label">
                      Company
                    </label>
                    <select name="user_type" disabled className="form-select">
                      {formval?.company?.company_name === undefined ? (
                        <option value="">No depo</option>
                      ) : (
                        <option value="">
                          {formval?.company?.company_name}
                        </option>
                      )}
                    </select>
                  </div>

                  <div className="col-lg-12 text-center">
                    <Link
                      to="/user-List"
                      type="Submit"
                      className="thm-btn"
                      disabled
                    >
                      <i className="fa fa-chevron-left" /> &nbsp; back
                    </Link>
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
