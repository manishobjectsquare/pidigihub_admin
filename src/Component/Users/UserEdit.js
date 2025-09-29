import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../../config/baseUrl";
import { ToastMessgae } from "../utils/toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function UserEdit() {
  const { modelType, id } = useParams();
  let navigate = useNavigate();
  const [formval, setFormval] = useState({
    first_name: "",
    last_name: "",
    username: "",
    mobile: "",
    email: "",
    company: "",
    depo: [],
    user_type: "",
    country_code: "us ",
  });
  let loginUser = JSON.parse(localStorage.getItem("user"));
  const [companyData, setCompanyData] = useState([]);
  const [userType, setUserType] = useState("");
  const [img, setImg] = useState("");
  const [depoData, setDepoData] = useState([]);

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
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
      setFormval((currVal) => ({
        ...currVal,
        profile_image: e.target.files[0],
      }));
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
    setDepoData(response?.data?.data);
  };

  //user_data
  useEffect(() => {
    (async () => {
      // let response = await axios(`${baseUrl}/module/admin/user-viewset/${id}`, {
      let response = await axios(
        modelType === "ADMIN_MANAGER"
          ? `${baseUrl}/module/admin/user-viewset/${id}`
          : `${baseUrl}/module/admin/adminlist/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        }
      );
      // console.log(response.data.data);
      setUserType(response?.data?.data?.user_type);
      response.data.data.mobile =
        response.data.data.country_code + response.data.data.mobile;
      // console.log(response.data.data)
      if (response?.data.code === 200) {
        setFormval({
          ...response?.data?.data,
          company: response?.data?.data?.company?._id,
        });
      } else {
        alert("Login First");
      }
    })();
    depoApi();
  }, []);

  const company = async () => {
    let response = await axios(`${baseUrl}/module/admin/company-list`, {
      method: "GET",
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    });
    // console.log(response?.data?.data);
    setCompanyData(response?.data?.data || []);
  };

  useEffect(() => {
    company();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formval);
    // return
    formval.mobile = formval.mobile.replace(formval.country_code, "");
    delete formval.profile_image;
    delete formval.last_login;

    try {
      const response = await axios(
        modelType === "ADMIN_MANAGER"
          ? `${baseUrl}/module/admin/user-viewset/${id}`
          : `${baseUrl}/module/admin/adminlist/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
          data: formval,
        }
      );
      console.log(response);
      if (response.data.code === 201) {
        ToastMessgae(response.data);
      }
      if (response.data.code === 400) {
        ToastMessgae({ message: response?.data?.data?.mobile[0] });
      }
      {
        modelType === "ADMIN_MANAGER"
          ? navigate("/user-List")
          : navigate("/user-List?model=admin");
      }
    } catch (error) {
      console.log("Error :", error.response.data);
    }
  };
  // loginUser

  return (
    <>
      <section className="main-sec">
        <div className="row">
          <div className="col-lg-12">
            <div className="dashboard-title">
              <h4 className="dash-head">
                <i className="fa fa-users me-2" />
                {userType === "ADMIN_MANAGER" ? "Edit Admin" : "Edit Users"}
              </h4>
            </div>
            <div className="custom-bredcump">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {userType === "ADMIN_MANAGER" ? "Edit Admin" : "Edit Users"}
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="cards edit-usr">
              <form action="" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-lg-3 mb-4">
                    <label htmlFor="" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="first_name"
                      onChange={ChangeHandler}
                      value={formval?.first_name}
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
                      onChange={ChangeHandler}
                      value={formval?.last_name}
                    />
                  </div>
                  <div className="col-lg-3 mb-4">
                    <label htmlFor="" className="form-label">
                      User Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      onChange={ChangeHandler}
                      value={formval?.username}
                    />
                  </div>
                  {/* <div className="col-lg-3 mb-4">
                    <label htmlFor="" className="form-label">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="mobile"
                      onChange={ChangeHandler}
                      value={formval?.mobile}
                    />
                  </div> */}
                  <div className="col-lg-3 mb-4">
                    <label htmlFor="" className="form-label">
                      Mobile Number
                    </label>
                    {/* <input
                      type="text"
                      className="form-control"
                      name="mobile"
                      onChange={ChangeHandler}
                      value={formval?.mobile}
                    /> */}
                    <PhoneInput
                      country={"in"}
                      name="mobile"
                      // country={formval.country_code}
                      value={formval.mobile}
                      placeholder="Mobile number"
                      // country={"in"}
                      onChange={ChangeHandler}
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
                      onChange={ChangeHandler}
                      value={formval?.email}
                    />
                  </div>
                  {/* <div className="col-lg-3 mb-4">
                    <label htmlFor="" className="form-label">
                      Birthday
                    </label>
                    <input
                      type="date"`
                      onChange={ChangeHandler}
                      value={formval.date_of_birth}
                      className="form-control"
                      name="date_of_birth"
                      placeholder=""
                    />
                  </div>  */}
                  {(loginUser?.user_type === "ADMIN_MANAGER" ||
                    loginUser?.user_type === "CLEANING_MANAGER") && (
                    <>
                      <div className="col-lg-3 mb-4">
                        <label htmlFor="" className="form-label">
                          Role
                        </label>
                        <select
                          name="user_type"
                          onChange={ChangeHandler}
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

                      {loginUser?.user_type !== "SUPER_ADMIN" && (
                        <div className="tablemenu-bar col-lg-3 mb-4">
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
                                      // checked={busArr.includes(arr?._id)?true:false}
                                      checked={
                                        formval?.depo?.includes(arr?._id) &&
                                        true
                                      }
                                      // onChange={addInputBox}
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
                        </div>
                      )}
                    </>
                  )}
                  {/* {console.log(userType)}     */}
                  {loginUser?.user_type === "SUPER_ADMIN" &&
                    userType === "ADMIN_MANAGER" && (
                      <div className="col-lg-3 mb-4">
                        <label htmlFor="" className="form-label">
                          Company
                        </label>
                        <select
                          name="company"
                          onChange={ChangeHandler}
                          className="form-select"
                          value={formval?.company}
                        >
                          <option defaultValue="">Select Company Name </option>
                          {companyData?.map((arr) => (
                            <option key={arr?._id} value={arr?._id}>
                              {arr?.company_name}
                              {/* {console.log(formval?.company?._id)} */}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  {/* <div className="col-lg-3 mb-4">
                    <label htmlFor="" className="form-label">
                      profile Image
                    </label>
                    <input
                      type="file"
                      onChange={ChangeHandler}
                      // value={formval.profile_image}
                      className="form-control"
                      name="profile_image"
                      placeholder=""
                    />
                    <div className="image-box">
                      <div className="image-box-innr img-50">
                        <img src={img ? img : formval?.profile_image} alt="" />
                      </div>
                    </div>
                  </div> */}

                  <div className="col-lg-12 text-center">
                    <button type="Submit" className="thm-btn">
                      Submit
                    </button>
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
