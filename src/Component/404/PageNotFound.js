import React from "react";
import Img from "../../assets/images/404Img.png";
import { Link } from "react-router-dom";
export default function PageNotFound() {
  return (
    <>
      <section className="error">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-12 text-center">
              <img src={Img} alt="" />
              <Link to="/" className="thm-btn">
                Back To home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
