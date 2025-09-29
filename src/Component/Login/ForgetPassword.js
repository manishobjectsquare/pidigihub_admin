import React, { useState, useEffect } from "react";
import Loginimg from "../../assets/images/login-img.png";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import { ToastMessgae } from "../utils/toast";
import { baseUrl } from "../../config/baseUrl";
import logo from "../../assets/images/head-logo.png"
export default function ForgetPassword() {
  let navigate = useNavigate();
  let token = localStorage.getItem("token");
  const [showPass, setshowPass] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    localStorage.clear();
    if (token != null) {
      navigate("/");
    }
  });

  let [formval, setFormval] = useState({ email: "", otp: "" });
  let ChangeHandler = (e) => {
    setFormval((currVal) => {
      return { ...currVal, [e.target.name]: e.target.value };
    });
  };

  let handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formval);

    // toast.update( "progress" )
    // toast.play({ containerId: "123" })
    if (!formval.email) {
      return ToastMessgae({ message: 'Email Filed empty is Not Allwed' })
    }
    setLoader(true)
    // setTimeout(() => {
    //   if(!setShowOtp){
    //     toast.info('OTP Request Sended!', {
    //       position: "top-right",
    //       autoClose: 2700,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //       theme: "light",
    //       transition: Bounce,
    //       });
    //   }

    // }, 1000);                   

    try {
      const response = await axios(
        `${baseUrl}/module/admin/forget_password`,
        {
          method: "POST",
          data: formval,
        }
      );
      // setLoader(false)
      if (response?.data?.code == 200) {
        setLoader(false)
        setShowOtp(true)
        console.log("enterds");
        ToastMessgae(response?.data);
      } else {
        setLoader(false)
        ToastMessgae(response?.data);
      }
    } catch (error) {
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
      // alert("Something Went Wrong..! , Please Contact Developer Team")
    }
  };



  let varifyOtp = async (e) => {
    e.preventDefault();
    // console.log(formval);
    if (!formval.otp) {
      return ToastMessgae({ message: 'Email Filed empty is Not Allwed' })
    }
    try {
      const response = await axios(
        `${baseUrl}/module/admin/otp_verify`,
        {
          method: "POST",
          data: formval,
        }
      );
      console.log(response.data)

      if (response?.data?.code == 200) {
        ToastMessgae(response?.data);
        localStorage.setItem("loginEmail", (response?.data?.data?.mobile))
        navigate(`/reset-password`)
      } else {
        ToastMessgae(response?.data);
      }
    } catch (error) {
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
      // alert("Something Went Wrong..! , Please Contact Developer Team")
    }
  };

  return (
    <>
      <div className={`${loader ? "loader-main" : ""}`} >
        <div className={`${loader ? "loader" : ""}`}></div>
      </div>
      <section className={`${loader ? "  main-login" : "main-login"}`}>
        <div className="container-fluid">
          <div className="row">
            <div
              className="col-xl-6 b-center bg-size d-none d-lg-block d-xl-block"
              style={{
                backgroundImage: `url(${Loginimg})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
                display: "block",
              }}
            >
              <div className="login-lft">
                <div className="login-lft-innr">
                  <h3>Welcome</h3>
                  <span > <img className="img-logo" src={logo} /> </span>
                  <p className="text-white">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Optio vel, laborum omnis atque quisquam ducimus, eius
                    expedita alias! Repellat alias sint at dignissimos adipisci
                    quis vitae quod culpa labore voluptatum.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-6 p-0">
              <div className="login-card">
                <form action="" onSubmit={handleSubmit} className="login-form">
                  <h4>
                    <span>Forgot Password</span>
                  </h4>
                  <div className="mb-4 frm-bx">
                    <label htmlFor="" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      onChange={ChangeHandler}
                      placeholder="Enter Your Mail "
                      value={formval.email}
                    />
                    <span><i className="fa fa-envelope-o" aria-hidden="true"></i></span>
                  </div>
                  {showOtp &&
                    <div className="mb-3 frm-bx">
                      <label htmlFor="" className="form-label">
                        OTP
                      </label>
                      <input
                        type='number'
                        className="form-control"
                        name="otp"
                        onChange={ChangeHandler}
                        placeholder="Enter OTP"
                        value={formval.otp}
                      />
                    </div>}
                  {/* <span className="fa fa-lock" onClick={()=>setshowPass(!showPass)} /> */}

                  <div className="mb-4 mt-5 frm-bx">
                    {showOtp === false ? <button className="frm-btn w-100" type="submit">
                      Send OTP
                    </button> :
                      <button className="frm-btn w-100" type="button" onClick={varifyOtp}>
                        Varify  Otp
                      </button>}
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
    </>
  );
}
