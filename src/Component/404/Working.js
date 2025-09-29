import React from "react";
import Img from "../../assets/images/work.jpg"; // You can keep or replace this image
import { Link } from "react-router-dom";

export default function Working() {
    return (
        <section className="under-construction py-5">
            <div className="container">
                <div className="row justify-content-center align-items-center">
                    <div className="col-lg-8 text-center">
                        <img
                            src={Img}
                            alt="Work in Progress"
                            className="img-fluid mb-4"
                            style={{ maxWidth: "400px" }}
                        />
                        <h2 className="mb-3">🚧 Work in Progress</h2>
                        <p className="mb-4">
                            This page is currently under development. We’ll be live very soon!
                        </p>
                        <Link to="/" className="btn btn-outline-primary px-4">
                            Go Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
