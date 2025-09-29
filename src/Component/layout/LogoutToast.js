import React from "react";
import "../../assets/css/dashboard.css";
// import loadergif from "../../assets/images/model-loader.gif";
import logoutgif from "../../assets/images/logout.gif";
import axios from 'axios'
import { Link,useNavigate } from "react-router-dom";
import { baseUrl } from "../../config/baseUrl";
// import { ToastMessgae } from "../utils/toast";
import toastify from "../../config/toastify";
export default function LogoutToast() {
  let navigate = useNavigate();
  let logout = async () => {
    // const response = await axios(
    //   `${baseUrl}/module/admin/logout`,
    //   {
    //     method: "POST",
    //     headers: {
    //       Authorization: "Token " + localStorage.getItem("token"),
    //     },
    //   }
    // );
    // console.log(response.data)
    localStorage.clear();
    navigate("/Login");
    toastify.success("Logout Successful") 
  };


  return (
    <>
      <div
        className="modal fade"
        id="logout"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="modal-trash">
                <img src={logoutgif} alt="" className="w-100" />
                <h4>Are You sure want To Logout</h4>
                <div className="modal-trash-btn">
                  <button
                    className="btn btn-outline-info"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={logout}
                    className="btn btn-outline-danger"
                    data-bs-dismiss="modal"
                  >
                    <Link> logout</Link>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
