import React,{useState} from 'react'
import axios from "axios";
import { baseUrl } from "../../config/baseUrl";
import { toast, Bounce } from "react-toastify";

export default function PasswordReset() {

  let [formval, setFormval] = useState({
    old_password: "",
    new_password : "",
  });

  let ChangeHandler = (e) => {

    setFormval((currVal) => {
      return { ...currVal, [e.target.name]: e.target.value };
    });
  };

  
  let handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formval.old_password ||
      !formval.new_password 
    ) {
      return alert("all fileds is required");
    } 
    try {
      const response = await axios(`${baseUrl}/module/admin/change-password`, {
        method: "PUT",
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
        data: formval,
      });
      console.log(response.data);
    
      if(response?.data?.code == 204){
        toast.error(response?.data?.message, {
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
        return  
      }
      toast.success("Password Reset Successfully", {
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

      let unique = document.getElementById("close");
      unique.click();
      setFormval({
        old_password: "",
        new_password : "",
      });
    } catch (error) {
      console.error("Error :", error);

    }
  };


  return (
    <>
    <div
        className="modal fade shift-model right "
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Reset Password
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id='close'
              />
            </div>
            <div className="modal-body">
              <form action="" >
                <div className=" mt-2 mb-3 text-start">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Old Password"
                    name="old_password"
                    onChange={ChangeHandler}
                    value={formval?.old_password}
                  />
                </div>
                <div className=" mb-3 text-start">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="New Password"
                    name="new_password"
                    onChange={ChangeHandler}
                    value={formval?.new_password}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" onClick={handleSubmit} className="btn btn-primary">
                Reset Password 
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
