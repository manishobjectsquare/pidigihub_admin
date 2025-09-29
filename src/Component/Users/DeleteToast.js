import React from "react";
import "../../assets/css/dashboard.css";
import loadergif from "../../assets/images/model-loader.gif";
import logoutgif from "../../assets/images/logout.gif";
import { Link } from "react-router-dom";

export default function DeleteToast({ deleteHandle, id }) {
  return (
    <>
      <div
        className="modal fade"
        id="pupup"
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
                <img src={loadergif} alt="" className="w-100" />
                <h4>Are You sure want To Delete</h4>
                <div className="modal-trash-btn">
                  <button
                    className="btn btn-outline-info"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <Link
                    className="btn btn-outline-danger"
                    data-bs-dismiss="modal"
                    onClick={() => deleteHandle(id)}
                  >
                    Delete
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
