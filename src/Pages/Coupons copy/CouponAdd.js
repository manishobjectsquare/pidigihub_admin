// import { useState } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { baseUrl } from "../../config/baseUrl"
// import { toast } from "react-toastify"
// import axios from "axios"

// export default function CouponAdd() {
//     const navigate = useNavigate()
//     const [loading, setLoading] = useState(false)

//     const [formval, setFormval] = useState({
//         coupon_Code: "",
//         discount: "",
//         valid_from: "",
//         valid_till: "",
//         for: "Library", // default selected
//         status: "true",
//     })

//     const changeHandler = (e) => {
//         setFormval((prev) => ({
//             ...prev,
//             [e.target.name]: e.target.value,
//         }))
//     }

//     const validateForm = () => {
//         const { coupon_Code, discount, valid_from, valid_till } = formval

//         if (!coupon_Code.trim()) {
//             toast.error("Coupon code is required")
//             return false
//         }

//         if (!discount || discount <= 0 || discount > 100) {
//             toast.error("Discount must be between 1 and 100")
//             return false
//         }

//         if (!valid_from) {
//             toast.error("Valid From date is required")
//             return false
//         }

//         if (!valid_till) {
//             toast.error("Valid Till date is required")
//             return false
//         }

//         if (new Date(valid_till) <= new Date(valid_from)) {
//             toast.error("Valid Till must be after Valid From")
//             return false
//         }

//         if (new Date(valid_from) < new Date().setHours(0, 0, 0, 0)) {
//             toast.error("Valid From date cannot be in the past")
//             return false
//         }

//         return true
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault()

//         if (!validateForm()) return

//         try {
//             setLoading(true)
//             const response = await axios.post(`${baseUrl}/api/v1/admin/coupon/coupon-store`, formval, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: localStorage.getItem("token"),
//                 },
//             })

//             if (response.status === 200 || response.status === 201) {
//                 toast.success("Coupon added successfully")
//                 setFormval({
//                     coupon_Code: "",
//                     discount: "",
//                     valid_from: "",
//                     valid_till: "",
//                     for: "Library",
//                     status: "true",
//                 })
//                 navigate("/coupons")
//             }
//         } catch (error) {
//             console.error("Error:", error)
//             toast.error(error.response?.data?.message || "Failed to add coupon")
//         } finally {
//             setLoading(false)
//         }
//     }

//     return (
//         <section className="main-sec">
//             <div className="row align-items-center">
//                 <div className="col-lg-6">
//                     <div className="dashboard-title">
//                         <h4 className="dash-head">
//                             <i className="fa fa-ticket me-2" />
//                             Add Coupon
//                         </h4>
//                     </div>
//                     <div className="custom-bredcump">
//                         <nav aria-label="breadcrumb">
//                             <ol className="breadcrumb">
//                                 <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
//                                 <li className="breadcrumb-item"><Link to="/coupons">Coupons</Link></li>
//                                 <li className="breadcrumb-item active" aria-current="page">Add Coupon</li>
//                             </ol>
//                         </nav>
//                     </div>
//                 </div>
//                 <div className="col-lg-6 d-flex justify-content-end">
//                     <Link to="/coupons" className="btn btn-info text-white">
//                         <i className="fa fa-arrow-left me-1"></i>Back
//                     </Link>
//                 </div>
//             </div>

//             <div className="row">
//                 <div className="col-lg-12">
//                     <div className="cards edit-usr">
//                         <form onSubmit={handleSubmit}>
//                             <div className="row">
//                                 <div className="col-lg-6 mb-4">
//                                     <label htmlFor="coupon_Code" className="form-label">
//                                         Coupon Code<sup className="text-danger">*</sup>
//                                     </label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="coupon_Code"
//                                         id="coupon_Code"
//                                         placeholder="Enter coupon code (e.g., SAVE20)"
//                                         onChange={changeHandler}
//                                         value={formval.coupon_Code}
//                                         required
//                                         style={{ textTransform: "uppercase" }}
//                                     />
//                                     <small className="text-muted">Use uppercase letters and numbers only</small>
//                                 </div>

//                                 <div className="col-lg-6 mb-4">
//                                     <label htmlFor="discount" className="form-label">
//                                         Discount (%)<sup className="text-danger">*</sup>
//                                     </label>
//                                     <input
//                                         type="number"
//                                         className="form-control"
//                                         name="discount"
//                                         id="discount"
//                                         placeholder="Enter discount percentage"
//                                         onChange={changeHandler}
//                                         value={formval.discount}
//                                         min="1"
//                                         max="100"
//                                         required
//                                     />
//                                 </div>

//                                 <div className="col-lg-6 mb-4">
//                                     <label htmlFor="valid_from" className="form-label">
//                                         Valid From<sup className="text-danger">*</sup>
//                                     </label>
//                                     <input
//                                         type="date"
//                                         className="form-control"
//                                         name="valid_from"
//                                         id="valid_from"
//                                         onChange={changeHandler}
//                                         value={formval.valid_from}
//                                         min={new Date().toISOString().split("T")[0]}
//                                         required
//                                     />
//                                 </div>

//                                 <div className="col-lg-6 mb-4">
//                                     <label htmlFor="valid_till" className="form-label">
//                                         Valid Till<sup className="text-danger">*</sup>
//                                     </label>
//                                     <input
//                                         type="date"
//                                         className="form-control"
//                                         name="valid_till"
//                                         id="valid_till"
//                                         onChange={changeHandler}
//                                         value={formval.valid_till}
//                                         min={formval.valid_from || new Date().toISOString().split("T")[0]}
//                                         required
//                                     />
//                                 </div>

//                                 <div className="col-lg-6 mb-4">
//                                     <label htmlFor="for" className="form-label">
//                                         For<sup className="text-danger">*</sup>
//                                     </label>
//                                     <select
//                                         className="form-control"
//                                         name="for"
//                                         id="for"
//                                         onChange={changeHandler}
//                                         value={formval.for}
//                                     >
//                                         <option value="Library">Library</option>
//                                         <option value="E-Book">E-Book</option>
//                                         <option value="Mentor">Mentor</option>
//                                         <option value="Exam">Exam</option>
//                                     </select>
//                                 </div>

//                                 <div className="col-lg-6 mb-4">
//                                     <label htmlFor="status" className="form-label">
//                                         Status<sup className="text-danger">*</sup>
//                                     </label>
//                                     <select
//                                         className="form-control"
//                                         name="status"
//                                         id="status"
//                                         onChange={changeHandler}
//                                         value={formval.status}
//                                     >
//                                         <option value="true">Active</option>
//                                         <option value="false">Inactive</option>
//                                     </select>
//                                 </div>

//                                 <div className="col-lg-12 text-center">
//                                     <button type="submit" className="btn btn-for-add text-white" disabled={loading}>
//                                         {loading ? (
//                                             <>
//                                                 <span className="spinner-border spinner-border-sm me-2"></span>
//                                                 Saving...
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <i className="fa fa-save me-1"></i>
//                                                 Save Coupon
//                                             </>
//                                         )}
//                                     </button>
//                                 </div>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     )
// }

// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { baseUrl } from "../../config/baseUrl";
// import { toast } from "react-toastify";
// import axios from "axios";

// export default function CouponAdd() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const [formval, setFormval] = useState({
//     coupon_Code: "",
//     discount: "",
//     valid_from: "",
//     valid_till: "",
//     for: "Library",
//     forId: "",
//     status: "true",
//   });

//   const changeHandler = (e) => {
//     setFormval((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const validateForm = () => {
//     const { coupon_Code, discount, valid_from, valid_till } = formval;

//     if (!coupon_Code.trim()) {
//       toast.error("Coupon code is required");
//       return false;
//     }

//     if (!discount || discount <= 0 || discount > 100) {
//       toast.error("Discount must be between 1 and 100");
//       return false;
//     }

//     if (!valid_from) {
//       toast.error("Valid From date is required");
//       return false;
//     }

//     if (!valid_till) {
//       toast.error("Valid Till date is required");
//       return false;
//     }

//     if (new Date(valid_till) <= new Date(valid_from)) {
//       toast.error("Valid Till must be after Valid From");
//       return false;
//     }

//     if (new Date(valid_from) < new Date().setHours(0, 0, 0, 0)) {
//       toast.error("Valid From date cannot be in the past");
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     const payload = {
//       code: formval.coupon_Code,
//       discountType: "percentage", // Hardcoded, or use a field to toggle
//       discountValue: formval.discount,
//       validFrom: formval.valid_from,
//       validTill: formval.valid_till,
//       isActive: formval.status === "true",
//       category: formval.category,
//     };

//     try {
//       setLoading(true);
//       const res = await axios.post(`${baseUrl}/coupons/add`, payload, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: localStorage.getItem("token"),
//         },
//       });

//       if (res.status === 200 || res.status === 201) {
//         toast.success("Coupon added successfully");
//         setFormval({
//           coupon_Code: "",
//           discount: "",
//           valid_from: "",
//           valid_till: "",
//           for: "Library",
//           forId: "",
//           status: "true",
//         });
//         navigate("/coupons");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error(error.response?.data?.message || "Failed to add coupon");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="main-sec">
//       <div className="row align-items-center">
//         <div className="col-lg-6">
//           <div className="dashboard-title">
//             <h4 className="dash-head">
//               <i className="fa fa-edit me-2" />
//               Add Coupon
//             </h4>
//           </div>
//           <div className="custom-bredcump">
//             <nav aria-label="breadcrumb">
//               <ol className="breadcrumb">
//                 <li className="breadcrumb-item">
//                   <Link to="/">Dashboard</Link>
//                 </li>
//                 <li className="breadcrumb-item">
//                   <Link to="/coupons">Coupons</Link>
//                 </li>
//                 <li className="breadcrumb-item active" aria-current="page">
//                   Add Coupon
//                 </li>
//               </ol>
//             </nav>
//           </div>
//         </div>
//         <div className="col-lg-6 d-flex justify-content-end">
//           <Link to="/coupons" className="btn btn-info text-white">
//             <i className="fa fa-arrow-left me-1"></i>
//             Back
//           </Link>
//         </div>
//       </div>

//       <div className="row">
//         <div className="col-lg-12">
//           <div className="cards edit-usr">
//             <form onSubmit={handleSubmit}>
//               <div className="row">
//                 {/* Coupon Code */}
//                 <div className="col-lg-6 mb-4">
//                   <label className="form-label">
//                     Coupon Code<sup className="text-danger">*</sup>
//                   </label>
//                   <input
//                     type="text"
//                     name="coupon_Code"
//                     className="form-control"
//                     value={formval.coupon_Code}
//                     onChange={changeHandler}
//                     style={{ textTransform: "uppercase" }}
//                     required
//                   />
//                 </div>

//                 {/* Discount */}
//                 <div className="col-lg-6 mb-4">
//                   <label className="form-label">
//                     Discount (%)<sup className="text-danger">*</sup>
//                   </label>
//                   <input
//                     type="number"
//                     name="discount"
//                     className="form-control"
//                     value={formval.discount}
//                     onChange={changeHandler}
//                     min="1"
//                     max="100"
//                     required
//                   />
//                 </div>
//                 <div className="col-lg-6 mb-4">
//                   <label className="form-label">
//                     Coupon Type<sup className="text-danger">*</sup>
//                   </label>
//                   <select
//                     name="category"
//                     className="form-control"
//                     value={formval.category}
//                     onChange={changeHandler}
//                     required
//                   >
//                     <option value="">Select Type</option>
//                     <option value="all">All</option>
//                     <option value="library">Library</option>
//                     <option value="mentor">Mentor</option>
//                     <option value="ebook">ebook</option>
//                     <option value="exam">exam</option>
//                   </select>
//                 </div>
//                 {/* Valid From */}
//                 <div className="col-lg-6 mb-4">
//                   <label className="form-label">
//                     Valid From<sup className="text-danger">*</sup>
//                   </label>
//                   <input
//                     type="date"
//                     name="valid_from"
//                     className="form-control"
//                     value={formval.valid_from}
//                     onChange={changeHandler}
//                     min={new Date().toISOString().split("T")[0]}
//                     required
//                   />
//                 </div>

//                 {/* Valid Till */}
//                 <div className="col-lg-6 mb-4">
//                   <label className="form-label">
//                     Valid Till<sup className="text-danger">*</sup>
//                   </label>
//                   <input
//                     type="date"
//                     name="valid_till"
//                     className="form-control"
//                     value={formval.valid_till}
//                     onChange={changeHandler}
//                     min={
//                       formval.valid_from ||
//                       new Date().toISOString().split("T")[0]
//                     }
//                     required
//                   />
//                 </div>

//                 {/* For */}
//                 {/* <div className="col-lg-6 mb-4">
//                                     <label className="form-label">For<sup className="text-danger">*</sup></label>
//                                     <select
//                                         name="for"
//                                         className="form-control"
//                                         value={formval.for}
//                                         onChange={changeHandler}
//                                     >
//                                         <option value="Library">Library</option>
//                                         <option value="E-Book">E-Book</option>
//                                         <option value="Mentor">Mentor</option>
//                                         <option value="Exam">Exam</option>
//                                     </select>
//                                 </div> */}

//                 {/* For ID */}
//                 {/* <div className="col-lg-6 mb-4">
//                                     <label className="form-label">{formval.for} ID<sup className="text-danger">*</sup></label>
//                                     <input
//                                         type="text"
//                                         name="forId"
//                                         className="form-control"
//                                         placeholder={`Enter ${formval.for} Object ID`}
//                                         value={formval.forId}
//                                         onChange={changeHandler}
//                                         required
//                                     />
//                                     <small className="text-muted">Must be a valid MongoDB ObjectId</small>
//                                 </div> */}

//                 {/* Status */}
//                 <div className="col-lg-6 mb-4">
//                   <label className="form-label">Status</label>
//                   <select
//                     name="status"
//                     className="form-control"
//                     value={formval.status}
//                     onChange={changeHandler}
//                   >
//                     <option value="true">Active</option>
//                     <option value="false">Inactive</option>
//                   </select>
//                 </div>

//                 {/* Submit */}
//                 <div className="col-lg-12 text-center">
//                   <button
//                     type="submit"
//                     className="btn btn-for-add text-white"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-2"></span>
//                         Saving...
//                       </>
//                     ) : (
//                       <>
//                         <i className="fa fa-save me-1"></i>
//                         Save Coupon
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../../config/baseUrl";
import { toast } from "react-toastify";
import axios from "axios";

const API_MAP = {
  library: "https://api.pidigihub.in/library",
  mentor: "https://api.pidigihub.in/mentors",
  exam: "https://api.pidigihub.in/exams",
  ebook: "https://api.pidigihub.in/ebook",
};

export default function CouponAdd() {
  const navigate = useNavigate();

  /* ────────────────  Local state ──────────────── */
  const [loading, setLoading] = useState(false); // save button
  const [typeOptions, setTypeOptions] = useState([]); // items for dropdown
  const [isFetchingOptions, setIsFetchingOptions] = useState(false);

  const [formval, setFormval] = useState({
    coupon_Code: "",
    discount: "",
    valid_from: "",
    valid_till: "",
    category: "",
    forId: "",
    status: "true",
  });

  /* ────────────────  Handlers ──────────────── */
  const changeHandler = (e) => {
    let { name, value } = e.target;

    // always store coupon code in UPPERCASE
    if (name === "coupon_Code") value = value.toUpperCase();

    // when the user changes type, clear any previously selected target
    if (name === "category") {
      setFormval((prev) => ({ ...prev, [name]: value, forId: "" }));
      return; // `forId` cleared, fetch happens via useEffect below
    }

    setFormval((prev) => ({ ...prev, [name]: value }));
  };

  /* ────────────────  Fetch target list when type changes ──────────────── */
  useEffect(() => {
    const type = formval.category;
    const url = API_MAP[type];

    // “All” or empty → nothing to fetch
    if (!url) {
      setTypeOptions([]);
      return;
    }

    (async () => {
      try {
        setIsFetchingOptions(true);
        const res = await axios.get(url, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        // Some endpoints wrap the array in {data:[]}, others return [] directly
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        // console.log(list);

        setTypeOptions(list);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load list for selected type");
        setTypeOptions([]);
      } finally {
        setIsFetchingOptions(false);
      }
    })();
  }, [formval.category]);

  /* ────────────────  Validation ──────────────── */
  const validateForm = () => {
    const { coupon_Code, discount, valid_from, valid_till, category, forId } =
      formval;

    if (!coupon_Code.trim())
      return toast.error("Coupon code is required"), false;
    if (!discount || discount <= 0 || discount > 100)
      return toast.error("Discount must be between 1 and 100"), false;
    if (!valid_from) return toast.error("Valid From date is required"), false;
    if (!valid_till) return toast.error("Valid Till date is required"), false;
    if (new Date(valid_till) <= new Date(valid_from))
      return toast.error("Valid Till must be after Valid From"), false;
    if (new Date(valid_from) < new Date().setHours(0, 0, 0, 0))
      return toast.error("Valid From date cannot be in the past"), false;

    // If a specific type was chosen, a target must be selected
    if (category && category !== "all" && !forId)
      return toast.error(`Please select a ${category} item`), false;

    return true;
  };

  /* ────────────────  Submit ──────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      code: formval.coupon_Code.trim(),
      discountType: "percentage",
      discountValue: formval.discount,
      validFrom: formval.valid_from,
      validTill: formval.valid_till,
      isActive: formval.status === "true",
      category: formval.category || "all",
    };

    // Dynamically attach the correct target field
    switch (formval.category) {
      case "library":
        payload.libraryId = formval.forId;
        break;
      case "mentor":
        payload.mentorId = formval.forId;
        break;
      case "ebook":
        payload.ebookId = formval.forId;
        break;
      case "exam":
        payload.examId = formval.forId;
        break;
      // no extra field for “all”
      default:
        break;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${baseUrl}/coupons/add`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Coupon added successfully");
        setFormval({
          coupon_Code: "",
          discount: "",
          valid_from: "",
          valid_till: "",
          category: "",
          forId: "",
          status: "true",
        });
        setTypeOptions([]);
        navigate("/coupons");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add coupon");
    } finally {
      setLoading(false);
    }
  };

  /* ────────────────  Render ──────────────── */
  const today = new Date().toISOString().split("T")[0];

  // helper: guess a label field (name / title / code)
  const getLabel = (item) =>
    // item?.name || item?.title || item?.code || item?._id;
    item?.mentorName ||
    item?.libraryName ||
    item?.bookTitle ||
    item?.exam_title;
  // mentorName libraryName bookTitle exam_title

  return (
    <section className="main-sec">
      {/*  Page Heading + Breadcrumb omitted for brevity  */}

      <div className="row">
        <div className="col-lg-12">
          <div className="cards edit-usr">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Coupon Code */}
                <div className="col-lg-6 mb-4">
                  <label className="form-label">
                    Coupon Code<sup className="text-danger">*</sup>
                  </label>
                  <input
                    type="text"
                    name="coupon_Code"
                    className="form-control"
                    value={formval.coupon_Code}
                    onChange={changeHandler}
                    required
                    style={{ textTransform: "uppercase" }}
                  />
                </div>

                {/* Discount */}
                <div className="col-lg-6 mb-4">
                  <label className="form-label">
                    Discount (%)<sup className="text-danger">*</sup>
                  </label>
                  <input
                    type="number"
                    name="discount"
                    className="form-control"
                    value={formval.discount}
                    onChange={changeHandler}
                    min="1"
                    max="100"
                    required
                  />
                </div>

                {/* Coupon Type */}
                <div className="col-lg-6 mb-4">
                  <label className="form-label">
                    Coupon Type<sup className="text-danger">*</sup>
                  </label>
                  <select
                    name="category"
                    className="form-control"
                    value={formval.category}
                    onChange={changeHandler}
                    required
                  >
                    {/* <option value="">Select Type</option>
                    <option value="all">All (Site‑wide)</option>
                    <option value="library">Library</option>
                    <option value="mentor">Mentor</option>
                    <option value="ebook">ebook</option>
                                      <option value="exam">Mock Test</option> */}
                    <option value="">Select Type</option>
                    <option value="all">All</option>
                    <option value="library">Library</option>
                    <option value="mentor">Mentor</option>
                    <option value="ebook">ebook</option>
                    <option value="exam">Exam</option>
                  </select>
                </div>

                {/* Target selector appears only when options are loaded */}
                {typeOptions.length > 0 && (
                  <div className="col-lg-6 mb-4">
                    <label className="form-label">
                      Select {formval.category}
                      <sup className="text-danger">*</sup>
                    </label>
                    <select
                      name="forId"
                      className="form-control"
                      value={formval.forId}
                      onChange={changeHandler}
                      required
                    >
                      <option value="">Choose one</option>
                      {typeOptions.map((item) => (
                        <option key={item._id} value={item._id}>
                          {getLabel(item)}
                          {/* mentorName libraryName bookTitle exam_title */}
                        </option>
                      ))}
                    </select>
                    {isFetchingOptions && (
                      <small className="text-muted ms-2">
                        <span className="spinner-border spinner-border-sm me-1"></span>
                        Loading…
                      </small>
                    )}
                  </div>
                )}

                {/* Valid From */}
                <div className="col-lg-6 mb-4">
                  <label className="form-label">
                    Valid From<sup className="text-danger">*</sup>
                  </label>
                  <input
                    type="date"
                    name="valid_from"
                    className="form-control"
                    value={formval.valid_from}
                    onChange={changeHandler}
                    min={today}
                    required
                  />
                </div>

                {/* Valid Till */}
                <div className="col-lg-6 mb-4">
                  <label className="form-label">
                    Valid Till<sup className="text-danger">*</sup>
                  </label>
                  <input
                    type="date"
                    name="valid_till"
                    className="form-control"
                    value={formval.valid_till}
                    onChange={changeHandler}
                    min={formval.valid_from || today}
                    required
                  />
                </div>

                {/* Status */}
                <div className="col-lg-6 mb-4">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    className="form-control"
                    value={formval.status}
                    onChange={changeHandler}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>

                {/* Submit */}
                <div className="col-lg-12 text-center">
                  <button
                    type="submit"
                    className="btn btn-for-add text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving…
                      </>
                    ) : (
                      <>
                        <i className="fa fa-save me-1"></i>Save Coupon
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
