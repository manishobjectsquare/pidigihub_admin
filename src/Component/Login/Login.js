import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import { baseUrl } from "../../config/baseUrl";
import toastify from "../../config/toastify";

export default function Login() {
  let navigate = useNavigate();
  let token = localStorage.getItem("token");
  const [showPass, setshowPass] = useState(false);
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    localStorage.clear();
    if (token != null) {
      navigate("/");
    }
  });

  let [formval, setFormval] = useState({ username: "", password: "" });
  let ChangeHandler = (e) => {
    setFormval((currVal) => {
      return { ...currVal, [e.target.name]: e.target.value };
    });
  };

  let handleSubmit = async (e) => {
    e.preventDefault();
    if (!formval.username || !formval.password) {
      return alert("all fileds is required");
    }
    formval.email = formval.username;
    setLoading(true)
    try {
      const response = await axios(`https://api.youtheducation.in/api/v1/admin/login`, {
        method: "POST",
        data: {
          email: formval.username,
          password: formval.password,
        },
      });

      if (response?.data?.status) {
        localStorage.setItem("token", response?.data?.token);
        localStorage.setItem("user", JSON.stringify(response?.data?.data));
        navigate("/");
        toast.success(response?.data.message, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } else {
        toastify.error(response.data.message);
      }
    }
    catch (error) {
      console.log("Error :", error);
      toast.error(`Something Went Wrong..!, Please Contact Developer Team`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setLoading(false)
    }
  };

  return (
    <>
      <section className="main-login">
        <div className="container-fluid">
          <div className="row">
            <div
              className="col-xl-6 b-center bg-size d-none d-lg-block d-xl-block"
              style={{
                backgroundImage: `url(/Pilogin.png)`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
                display: "block",
              }}
            >
              <div className="login-lft">
                <img className="" src="/Pidigihub_Logo.png" alt="Pidigihub" />
              </div>
            </div>
            <div className="col-xl-6 p-0">
              <div className="login-card">
                <form action="" onSubmit={handleSubmit} className="login-form">
                  <h4>
                    <span>Login</span>
                  </h4>
                  <div className="mb-4 frm-bx">
                    <label htmlFor="" className="form-label">
                      User Name/Mobile Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      onChange={ChangeHandler}
                      placeholder="UserName"
                      value={formval.username}
                    />
                    <span className="fa fa-user" />
                  </div>
                  <div className="mb-3 frm-bx">
                    <label htmlFor="" className="form-label">
                      Password
                    </label>
                    <input
                      type={showPass ? "text" : "password"}
                      className="form-control"
                      name="password"
                      onChange={ChangeHandler}
                      placeholder="Password"
                      value={formval.password}
                    />
                    {showPass ? (
                      <span
                        className="fa fa-eye-slash"
                        onClick={() => setshowPass(!showPass)}
                      />
                    ) : (
                      <span
                        className="fa fa-eye"
                        onClick={() => setshowPass(!showPass)}
                      />
                    )}
                  </div>
                  {/* <div className=" text-end">
                    <Link to="/forget-password">
                      <b> Forgot Password </b>
                    </Link>
                  </div> */}
                  <div className="mb-4 mt-5 frm-bx">
                    <button className="frm-btn w-100" type="submit" disabled={loading}>
                      {loading ? (
                        <div className="btn-loader-a">
                          <svg
                            className="spinner-a"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="spinner-track"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="spinner-path"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"
                            ></path>
                          </svg>
                          {/* Proceeding... */}
                        </div>
                      ) : (
                        "Login"
                      )}
                    </button>
                  </div>


                  {/* <div className="mb-4 mt-5 frm-bx">
                    <button className=" w-100  btn btn-warning" type="submit">
                      Forget Password
                    </button>
                  </div> */}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <style>{`
      
           .btn-loader-a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.spinner-a {
  width: 20px;
  height: 20px;
  animation: spin 0.7s linear infinite;
  color: #ffffff; /* Change based on button background */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.spinner-track {
  opacity: 0.25;
}

.spinner-path {
  opacity: 0.75;
}


      
      `}</style>
    </>
  );
}
