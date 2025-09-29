import React, { useEffect } from "react";
import avtar from "../../assets/images/avtar.jpg";
import { Link, useNavigate } from "react-router-dom";
// import DeleteToast from "../Users/DeleteToast";
import LogoutToast from "./LogoutToast";
import PasswordReset from "./PasswordReset";
import { toast } from "react-toastify";
export default function Header({ useAutoLogout }) {
  let navigate = useNavigate();
  // let [deleteid, setDeleteid] = useState();
  // let [logout, setlogout] = useState(false);
  let token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);
  let UserDetails = JSON.parse(localStorage.getItem("user"));

  // console.log(UserDetails)
  // manish@objectsquare.com
  // let logoutfunction = () => {
  //   localStorage.clear();
  //   navigate("/Login");
  // };
  const removeClass = (e) => {
    document?.body?.classList?.toggle("resize-menu");
  };
  const handleError = (e) => {
    e.target.src = avtar;
  };
  const logoutAuto = async () => {
    localStorage.clear();
    navigate("/login");
    toast.info("Your Session Expired")
  }
  useAutoLogout(logoutAuto)
  return (
    <>
      <header className="header">
        <div className="navbar-header">
          <div className="row align-items-center">
            <div className="col-lg-5 col-md-6 col-sm-6 col-6">
              <div className="header-fltr">
                <button className="toggle fs-4" onClick={removeClass}>
                  <i className="fa fa-bars" />
                </button>
                <form action="">
                  <div className="header-fltr-bx">
                    {/* <input
                      type="text"
                      className="form-control"
                      placeholder="Type here..."
                    />
                    <span className="fa fa-search" /> */}
                    {/* <div className="text-light fs-5">
                  Youth Education — Education With Your Trust
                  </div> */}
                  </div>
                </form>
              </div>
            </div>
            <div className="col-lg-7 col-md-6 col-sm-6 col-6">
              <div className="app-header-right-side">
                {/* <ul className="app-header-right-side-list">
                  <li>
                    <Link to="">Help</Link>
                  </li>
                  <li>
                    <button type="button" className="position-relative">
                      <i className="fa fa-bell" />
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        1
                      </span>
                    </button>
                  </li>
                </ul> */}
                <div className="prfl-bar">
                  <div className="prfl-bar-img">
                    <img
                      onError={handleError}
                      src="/Pidigihub_Logo.png"
                      className="profle"
                      alt="profile_image"
                    />
                  </div>
                  <div className="prfl-bar-content">
                    <div className="dropdown">
                      <button
                        className="dropdown-toggle"
                        type="button"
                        id="profile-menu"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <span>
                          Admin
                        </span>
                      </button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="profile-menu"
                      >
                        <li>
                          <Link
                            data-bs-toggle="modal"
                            data-bs-target="#logout"
                          >
                            <i className="fa fa-sign-out me-2" />
                            Signout
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <LogoutToast />
      <PasswordReset />
    </>
  );
}
