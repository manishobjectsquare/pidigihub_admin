import React, { useState, useEffect } from "react";
import Loginimg from "../../assets/images/login-img.png";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import { ToastMessgae } from "../utils/toast";
import { baseUrl } from "../../config/baseUrl";
import logo from "../../assets/images/head-logo.png"
export default function ResetPassword() {
  let navigate = useNavigate();
  let token = localStorage.getItem("token");
  let loginEmail = localStorage.getItem("loginEmail");
const [showPass, setshowPass] = useState({newPassword:false,Cpassword:false})
// const [searchParams, setSearchParams] = useSearchParams();
// let queryString = searchParams.get("email")
  useEffect(() => {
    if (token != null) {
      navigate("/");
    }
    if (loginEmail === null) {
      navigate("/forget-password");
    }
  });

  let [formval, setFormval] = useState({ email: loginEmail , new_password:"" ,confirm_password :"" });
  let ChangeHandler = (e) => { 
    setFormval((currVal) => {
      return { ...currVal, [e.target.name]: e.target.value };
    });
  };

  let handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formval);
    // return
    console.log(showPass);
    if (!formval.email || !formval.new_password || !formval.confirm_password ) {
      return alert("emplty filed not allowed");
    }
    try {
      const response = await axios(
        `${baseUrl}/module/mobile/reset_password`,
        {
          method: "POST",
          data: formval,
        }
      );
      localStorage.clear();
      console.log(response);
      // return
      if (response?.data?. code === 200) {
        console.log(response);
        localStorage.clear();
        navigate("/login")
        ToastMessgae(response?.data);
      } else {
        ToastMessgae(response?.data);
      }
      // localStorage.clear();
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
  let showpasswordHanlde=(name)=>{
    console.log("work")
    setshowPass(
      (curval)=>{
        console.log(curval);
       return {...curval,[name]:!(curval[name])}
      }
    )
  }

  return (
    <>
      <section className="main-login">
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
                  <span > <img  className="img-logo" src={logo}/> </span>
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
                    <span>Reset Password</span>
                  </h4>
                  <div className="mb-4 frm-bx">
                    <label htmlFor="" className="form-label">
                     EmailID
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      onChange={ChangeHandler}
                      placeholder="email"
                      value={formval?.email}
                    />
                    <span className="fa fa-user" />
                  </div>
                  <div className="mb-3 frm-bx">
                    <label htmlFor="" className="form-label">
                      New Password
                    </label>
                    <input
                      type={showPass.newPassword? "text" : "password"}
                      className="form-control"
                      name="new_password"
                      onChange={ChangeHandler}
                      placeholder="New Password"
                      value={formval?.new_password}
                    />
                    {/* <span className="fa fa-lock" onClick={()=>showpasswordHanlde("newPassword")} /> */}
                    { showPass.newPassword ?  
                     <span className="fa fa-eye-slash" onClick={()=>showpasswordHanlde("newPassword")} />
                     : <span className="fa fa-eye" onClick={()=>showpasswordHanlde("newPassword")} />}
                  </div>
                  <div className="mb-3 frm-bx">
                    <label htmlFor="" className="form-label">
                     Confirm Password
                    </label>
                    <input
                      type={showPass.Cpassword? "text" : "password"}
                      className="form-control"
                      name="confirm_password"
                      onChange={ChangeHandler}
                      placeholder="Confirm Password"
                      value={formval?.confirm_password }
                    />
                    { showPass.Cpassword ?  
                     <span className="fa fa-eye-slash" onClick={()=>showpasswordHanlde("Cpassword")} />
                     : <span className="fa fa-eye" onClick={()=>showpasswordHanlde("Cpassword")} />}
                    {/* <span className="fa fa-lock" onClick={()=>showpasswordHanlde("Cpassword")} /> */}
                  </div>
                 
                  <div className="mb-4 mt-5 frm-bx">
                    <button className="frm-btn w-100" type="submit">
                      Submit
                    </button>
                  </div>
                  
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
