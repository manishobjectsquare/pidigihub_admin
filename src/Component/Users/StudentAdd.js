"use client";

import { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { baseUrl } from "../../config/baseUrl";
import axios from "axios" 

const StudentAdd = () => {
  
  let navigate=useNavigate()

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhoneChange = (value) => {
    setFormData({
      ...formData,
      phone: value,
    });
  };

  const handleSubmit =async (e) => {
    e.preventDefault(); 
      let response = await axios(`${baseUrl}/api/v1/admin/user/create-user`, {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        data: formData,
      });
      if (!(response?.data?.status)) {
        alert("some error accoured");
        return;
      } 
    navigate(`/students`); 
  };

  return (
    <>
      <section className="main-sec">
        <div className="row">
          <div className="col-lg-12">
            <div className="dashboard-title">
              <h4 className="dash-head">
                <i className="fa fa-user me-2" />
                Add Students
              </h4>
            </div>
            <div className="custom-bredcump">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Add New Student
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="cards edit-usr">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <h4 className="card-title mb-5">Student Registration</h4>

                  <div className="col-lg-6 mb-4">
                    <label htmlFor="fullName" className="form-label">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="fullName"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="col-lg-6 mb-4">
                    <label htmlFor="email" className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="col-lg-6 mb-4">
                    <label htmlFor="phone" className="form-label">
                      Phone
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="phome"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter Phone"
                      required
                    />
                  </div>

                  <div className="col-lg-6 mb-4">
                    <label htmlFor="gender" className="form-label">
                      Gender
                    </label>
                    <select
                      className="form-control"
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="col-lg-6 mb-4">
                    <label htmlFor="age" className="form-label">
                      Age
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Enter your age"
                      min="1"
                      max="120"
                    />
                  </div>

                  <div className="col-lg-6 mb-4">
                    <label htmlFor="password" className="form-label">
                      Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <div className="col-lg-12 text-center">
                    <button
                      type="submit"
                      className="btn btn-for-add text-white"
                    >
                      Add Student
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
};

export default StudentAdd;
