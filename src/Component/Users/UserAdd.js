import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl";
import { ToastMessgae } from "../utils/toast";
import { toast, Bounce } from "react-toastify";
import { useNavigate } from "react-router-dom";
// import 'react-phone-number-input/style.css'
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
export default function UserAdd({
  modelType,
  showModel,
  setShowModel,
  adminDataApi,
  companyNameData,
}) {
  let navigate = useNavigate();
  let loginUser = JSON.parse(localStorage.getItem("user"));
  // console.log(loginUser._id);
  const [formval, setFormval] = useState({
    first_name: "",
    last_name: "",
    password: "",
    mobile: "",
    email: "",
    username: "",
    company: "",
    depo: [],
    country_code: "",
  });

  const [depoData, setDepoData] = useState([]);
  // let [companyNameData, setCompanyNameData] = useState([]);

  let ChangeHandler = (e, countryData) => {
    if (typeof e === "string") {
      return setFormval((currVal) => {
        return {
          ...currVal,
          ["country_code"]: countryData.dialCode,
          mobile: e,
        };
      });
    }
    if (e.target.name === "depo") {
      return setFormval((curval) => {
        let id = parseInt(e.target.value);
        if (curval.depo.includes(id)) {
          let data = curval.depo.filter((item) => item !== id);
          return { ...curval, [e.target.name]: data };
        }
        return {
          ...curval,
          [e.target.name]: [...curval.depo, parseInt(e.target.value)],
        };
      });
    }
    if (e.target.name === "profile_image") {
      setFormval((currVal) => {
        return { ...currVal, [e.target.name]: e.target.files[0] };
      });
    } else {
      setFormval((currVal) => {
        return { ...currVal, [e.target.name]: e.target.value };
      });
    }
  };

  const depoApi = async () => {
    let response = await axios(`${baseUrl}/module/admin/depo-viewset`, {
      method: "GET",
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    });
    // console.log(response?.data?.data);
    setDepoData(response?.data?.data);
  };

  // const companyName = async () => {
  //   let response = await axios(`${baseUrl}/module/admin/company-viewset`, {
  //     method: "GET",
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token"),
  //     },
  //   });
  //   setCompanyNameData(response?.data?.data);
  // };
  useEffect(() => {
    depoApi();
    // companyName();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(busArr);
    formval.mobile = formval.mobile.slice(2);
    // console.log(formval);
    if (
      !formval.first_name ||
      !formval.last_name ||
      !formval.password ||
      !formval.username ||
      !formval.email
    ) {
      ToastMessgae({ message: "all fileds is required" });
      return;
    }

    if (modelType === "ADMIN_MANAGER") {
      if (!formval?.user_type) {
        ToastMessgae({ message: "role is required" });
        return;
      }
    }

    if (!formval.company) {
      formval.company = loginUser.company;
    }
    try {
      const response = await axios(`${baseUrl}/module/admin/user-viewset`, {
        method: "POST",
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
        data: formval,
      });
      console.log(response?.data);
      if (response?.data?.code === 400) {
        toast.error(response?.data?.error_message || response?.data?.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        return;
      }
      setShowModel(false);
      toast.success(response?.data?.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      let a = showModel + 1;
      setShowModel(a);
      adminDataApi();
      setFormval({
        first_name: "",
        last_name: "",
        password: "",
        mobile: "",
        email: "",
        username: "",
        company: "",
        depo: [],
        country_code: "",
      });
      let unique = document?.getElementById("unique");
      unique.click();
      navigate("/user-List");
    } catch (error) {
      console.log("Error :", error?.response?.data);
    }
  };

  // let addInputBox = (e) => {
  //   setCheckval((currVal) => {
  //     return { ...currVal, [e.target.name]: e.target.checked };
  //   });
  // };

  return (
    <>
      <div
        className="modal fade custom-modal users-modal"
        id="add-user"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header justify-content-center">
              <h5 className="modal-title">
                {modelType === "ADMIN_MANAGER" ? "Add New User" : "Add Admin"}
              </h5>
              <button
                type="button"
                className="modal-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="fa fa-times" />
              </button>
            </div>
            <div className="modal-body">
              <div className="table modal-table">
                <table className="table">
                  <thead>
                    <tr>
                      <th>
                        First Name <i className="fa fa-star fz-12" />{" "}
                      </th>
                      <th>
                        Last Name <i className="fa fa-star fz-12" />
                      </th>
                      <th>
                        Email <i className="fa fa-star fz-12" />
                      </th>
                      <th>
                        User Name <i className="fa fa-star fz-12" />
                      </th>
                      <th>Mobile Number</th>
                      <th>
                        Password <i className="fa fa-star fz-12" />
                      </th>
                      {modelType === "SUPER_ADMIN" ? (
                        <th>Company</th>
                      ) : (
                        <>
                          <th>
                            Role <i className="fa fa-star fz-12" />
                          </th>
                          <th>Depo</th>
                          {/* {checkval?.department && <th>Department</th>} */}
                          {/* {checkval?.branch && <th>Branch</th>} */}
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="First name"
                          name="first_name"
                          onChange={ChangeHandler}
                          value={formval?.first_name}
                        />
                      </td>

                      <td>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Last name"
                          name="last_name"
                          onChange={ChangeHandler}
                          value={formval?.last_name}
                        />
                      </td>

                      <td>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Email"
                          name="email"
                          onChange={ChangeHandler}
                          value={formval?.email}
                          id="email"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="username"
                          name="username"
                          onChange={ChangeHandler}
                          value={formval?.username}
                          id="username"
                        />
                      </td>

                      <td>
                        <PhoneInput
                          name="mobile"
                          // country={formval.country_code}
                          value={formval.mobile}
                          placeholder="Mobile number"
                          country={"in"}
                          // country={"us"}
                          onChange={ChangeHandler}
                        />
                      </td>

                      <td>
                        <input
                          type="password"
                          onChange={ChangeHandler}
                          className="form-control"
                          placeholder="password"
                          name="password"
                          value={formval?.password}
                        />
                      </td>

                      {modelType === "SUPER_ADMIN" ? (
                        <td>
                          <select
                            name="company"
                            onChange={ChangeHandler}
                            className="form-select"
                            value={formval?.company}
                          >
                            <option defaultValue="">Select Company Name</option>
                            {companyNameData?.map((arr) => {
                              return (
                                <option key={arr?._id} value={arr?._id}>
                                  {arr.company_name}
                                </option>
                              );
                            })}
                          </select>
                        </td>
                      ) : (
                        <>
                          <td>
                            <select
                              name="user_type"
                              onChange={ChangeHandler}
                              className="form-select"
                              value={formval.user_type}
                            >
                              <option value="">Roles</option>
                              <option value="CLEANER">Cleaner</option>;
                              <option value="CLEANING_MANAGER">
                                Cleaning Manager
                              </option>
                              <option value="CLIENT">Client</option>
                            </select>
                          </td>
                          <td className="tablemenu-bar">
                            <div className="dropdown ">
                              <button
                                className="dropdown-toggle"
                                type="button"
                                id="tablemenu"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                select depo{" "}
                              </button>
                              <ul
                                className="dropdown-menu"
                                aria-labelledby="tablemenu"
                              >
                                {depoData?.map((arr) => (
                                  <li key={arr?._id} className="dropdown-item">
                                    <div className="form-check">
                                      <input
                                        className="form-check-input checkbox"
                                        type="checkbox"
                                        defaultValue=""
                                        id="check-04"
                                        name="depo"
                                        checked={
                                          formval?.depo?.includes(arr?._id) &&
                                          true
                                        }
                                        value={arr._id}
                                        onChange={ChangeHandler}
                                      />
                                      <label htmlFor="check-04">
                                        {arr?.depo_name}
                                      </label>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-5"
                data-bs-dismiss="modal"
                id="unique"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                type="button"
                className="thm-btn"
                // data-bs-dismiss="modal"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// System.out.println(list.indexOf(1));
//
