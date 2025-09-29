// /* eslint-disable no-unused-vars */
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { baseUrl } from "../../config/baseUrl"
// import { toast } from "react-toastify";

// export default function JobAdd() {
//     const navigate = useNavigate();
//     const [formval, setFormval] = useState({
//         coupon_code: "",
//         discount: "",
//         start_date: "",
//         end_date: "",
//         status: "true",
//     });

//     let changeHandler = (e) => {
//         setFormval((preVal) => ({ ...preVal, [e.target.name]: e.target.value }));
//     };

//     let handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await fetch(`${baseUrl}/coupon`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(formval),
//             });
//             if (response.ok) {
//                 const data = await response.json();
//                 toast.success("Coupon Added Successfully");
//                 setFormval({
//                     coupon_code: "",
//                     discount: "",
//                     start_date: "",
//                     end_date: "",
//                     status: "true",
//                 });
//                 navigate("/coupons");
//             }
//             else {
//                 const errorData = await response.json();
//                 toast.error(errorData.message);
//             }

//         } catch (error) {
//             console.error("Error :", error);
//         }
//     };

//     return (
//         <>
//             <section className="main-sec">
//                 <div className="row align-items-center">
//                     <div className="col-lg-6">
//                         <div className="dashboard-title">
//                             <h4 className="dash-head">
//                                 <i className="fa fa-users me-2" />
//                                 Add Coupon
//                             </h4>
//                         </div>
//                         <div className="custom-bredcump">
//                             <nav aria-label="breadcrumb">
//                                 <ol className="breadcrumb">
//                                     <li className="breadcrumb-item">
//                                         <Link to="/">Dashboard</Link>
//                                     </li>
//                                     <li className="breadcrumb-item active" aria-current="page">
//                                         Add Coupon
//                                     </li>
//                                 </ol>
//                             </nav>
//                         </div>
//                     </div>
//                     <div className="col-lg-6 d-flex justify-content-end">
//                         <Link to="/coupons" className="btn btn-info text-white">
//                             <i className="fa fa-arrow-left me-1"></i>
//                             Back
//                         </Link>
//                     </div>
//                 </div>
//                 <div className="row">
//                     <div className="col-lg-12">
//                         <div className="cards edit-usr">
//                             <form action="" onSubmit={handleSubmit}>
//                                 <div className="row">
//                                     <div className="col-lg-6 mb-4">
//                                         <label htmlFor="coupon_code" className="form-label">
//                                             Coupon Code<sup className="text-danger">*</sup>
//                                         </label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="coupon_code"
//                                             id="coupon_code"
//                                             placeholder="Coupon Code"
//                                             onChange={changeHandler}
//                                             value={formval?.coupon_code}
//                                         />
//                                     </div>
//                                     <div className="col-lg-6 mb-4">
//                                         <label htmlFor="discount" className="form-label">
//                                             Discount(%)<sup className="text-danger">*</sup>
//                                         </label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="discount"
//                                             id="discount"
//                                             placeholder="Offer(%)"
//                                             onChange={changeHandler}
//                                             value={formval?.discount}
//                                         />
//                                     </div>

//                                     <div className="col-lg-6 mb-4">
//                                         <label htmlFor="start_date" className="form-label">
//                                             Start Date<sup className="text-danger">*</sup>
//                                         </label>
//                                         <input
//                                             type="date"
//                                             className="form-control"
//                                             name="start_date"
//                                             id="start_date"
//                                             placeholder="End Time"
//                                             onChange={changeHandler}
//                                             value={formval?.start_date}
//                                         />
//                                     </div>

//                                     <div className="col-lg-6 mb-4">
//                                         <label htmlFor="end_date" className="form-label">
//                                             End Date<sup className="text-danger">*</sup>
//                                         </label>
//                                         <input
//                                             type="date"
//                                             className="form-control"
//                                             name="end_date"
//                                             id="end_date"
//                                             placeholder="End Time"
//                                             onChange={changeHandler}
//                                             value={formval?.end_date}
//                                             min={formval.start_date || ""}
//                                         />
//                                     </div>

//                                     <div className="col-lg-6 mb-4">
//                                         <label htmlFor="status" className="form-label">
//                                             Status<sup className="text-danger">*</sup>
//                                         </label>
//                                         <select className="form-control">
//                                             <option value={"true"}>Active</option>
//                                             <option value={"false"}>Inactive</option>
//                                         </select>
//                                     </div>


//                                     <div className="col-lg-12 text-center">
//                                         <button
//                                             type="Submit"
//                                             className="btn btn-for-add text-white"
//                                         >
//                                             <i className="fa fa-save me-1"></i>
//                                             Save
//                                         </button>
//                                     </div>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </>
//     );
// }
