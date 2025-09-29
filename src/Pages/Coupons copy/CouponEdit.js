// import { useState, useEffect } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { baseUrl } from "../../config/baseUrl";
// import { toast } from "react-toastify";
// import axios from "axios";

// export default function CouponEdit() {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [formval, setFormval] = useState({
//     code: "",
//     discountValue: "",
//     validFrom: "",
//     validTill: "",
//     isActive: Boolean,
//     for: "",
//   });

//   useEffect(() => {
//     if (id) {
//       fetchCouponDetails();
//     }
//   }, [id]);

//   const fetchCouponDetails = async () => {
//     try {
//       setFetchLoading(true);
//       const response = await axios.get(`${baseUrl}/coupons/${id}`, {
//         headers: {
//           Authorization: localStorage.getItem("token"),
//         },
//       });

//       if (response.status === 200) {
//         const couponData = response.data.data;
//         setFormval({
//           code: couponData.code || "",
//           discountValue: couponData.discountValue || "",
//           validFrom: couponData.validFrom
//             ? couponData.validFrom.split("T")[0]
//             : "",
//           validTill: couponData.validTill
//             ? couponData.validTill.split("T")[0]
//             : "",
//           isActive: couponData.isActive,
//           category: couponData.category,
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching coupon:", error);
//       toast.error("Failed to fetch coupon details");
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   const changeHandler = (e) => {
//     setFormval((preVal) => ({ ...preVal, [e.target.name]: e.target.value }));
//   };

//   // Validation function
//   const validateForm = () => {
//     const { code, discountValue, validFrom, validTill } = formval;

//     if (!code.trim()) {
//       toast.error("Coupon code is required");
//       return false;
//     }

//     if (!discountValue || discountValue <= 0 || discountValue > 100) {
//       toast.error("discountValue must be between 1 and 100");
//       return false;
//     }

//     if (!validFrom) {
//       toast.error("Start date is required");
//       return false;
//     }

//     if (!validTill) {
//       toast.error("End date is required");
//       return false;
//     }

//     if (new Date(validTill) <= new Date(validFrom)) {
//       toast.error("End date must be after start date");
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await axios.patch(`${baseUrl}/coupons/${id}`, formval, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: localStorage.getItem("token"),
//         },
//       });

//       if (response.status === 200) {
//         toast.success("Coupon updated successfully");
//         navigate("/coupons");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       if (error.response?.data?.message) {
//         toast.error(error.response.data.message);
//       } else {
//         toast.error("Failed to update coupon");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (fetchLoading) {
//     return (
//       <section className="main-sec">
//         <div className="text-center py-5">
//           <div className="spinner-border" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-2">Loading coupon details...</p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <>
//       <section className="main-sec">
//         <div className="row align-items-center">
//           <div className="col-lg-6">
//             <div className="dashboard-title">
//               <h4 className="dash-head">
//                 <i className="fa fa-edit me-2" />
//                 Edit Coupon
//               </h4>
//             </div>
//             <div className="custom-bredcump">
//               <nav aria-label="breadcrumb">
//                 <ol className="breadcrumb">
//                   <li className="breadcrumb-item">
//                     <Link to="/">Dashboard</Link>
//                   </li>
//                   <li className="breadcrumb-item">
//                     <Link to="/coupons">Coupons</Link>
//                   </li>
//                   <li className="breadcrumb-item active" aria-current="page">
//                     Edit Coupon
//                   </li>
//                 </ol>
//               </nav>
//             </div>
//           </div>
//           <div className="col-lg-6 d-flex justify-content-end">
//             <Link to="/coupons" className="btn btn-info text-white">
//               <i className="fa fa-arrow-left me-1"></i>
//               Back
//             </Link>
//           </div>
//         </div>
//         <div className="row">
//           <div className="col-lg-12">
//             <div className="cards edit-usr">
//               <form onSubmit={handleSubmit}>
//                 <div className="row">
//                   <div className="col-lg-6 mb-4">
//                     <label htmlFor="code" className="form-label">
//                       Coupon Code<sup className="text-danger">*</sup>
//                     </label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="code"
//                       id="code"
//                       placeholder="Enter coupon code (e.g., SAVE20)"
//                       onChange={changeHandler}
//                       value={formval?.code}
//                       required
//                       style={{ textTransform: "uppercase" }}
//                     />
//                   </div>
//                   <div className="col-lg-6 mb-4">
//                     <label htmlFor="discountValue" className="form-label">
//                       discountValue (%)<sup className="text-danger">*</sup>
//                     </label>
//                     <input
//                       type="number"
//                       className="form-control"
//                       name="discountValue"
//                       id="discountValue"
//                       placeholder="Enter discountValue percentage"
//                       onChange={changeHandler}
//                       value={formval?.discountValue}
//                       min="1"
//                       max="100"
//                       required
//                     />
//                   </div>
//                   <div className="col-lg-6 mb-4">
//                     <label className="form-label">
//                       Coupon Type<sup className="text-danger">*</sup>
//                     </label>
//                     <select
//                       name="category"
//                       className="form-control"
//                       value={formval.category}
//                       onChange={changeHandler}
//                       required
//                     >
//                       <option value="">Select Type</option>
//                       <option value="library">Library</option>
//                       <option value="mentor">Mentor</option>
//                       <option value="ebook">ebook</option>
//                       <option value="exam">exam</option>
//                     </select>
//                   </div>

//                   <div className="col-lg-6 mb-4">
//                     <label htmlFor="validFrom" className="form-label">
//                       Start Date<sup className="text-danger">*</sup>
//                     </label>
//                     <input
//                       type="date"
//                       className="form-control"
//                       name="validFrom"
//                       id="validFrom"
//                       onChange={changeHandler}
//                       value={formval?.validFrom}
//                       required
//                     />
//                   </div>

//                   <div className="col-lg-6 mb-4">
//                     <label htmlFor="validTill" className="form-label">
//                       End Date<sup className="text-danger">*</sup>
//                     </label>
//                     <input
//                       type="date"
//                       className="form-control"
//                       name="validTill"
//                       id="validTill"
//                       onChange={changeHandler}
//                       value={formval?.validTill}
//                       min={formval.validFrom || ""}
//                       required
//                     />
//                   </div>

//                   {/* <div className="col-lg-6 mb-4">
//                                         <label className="form-label">Status</label>
//                                         <select
//                                             name="isActive"
//                                             className="form-control"
//                                             value={formval.isActive}
//                                             onChange={changeHandler}
//                                         >
//                                             <option value="true">Active</option>
//                                             <option value="false">Inactive</option>
//                                         </select>
//                                     </div> */}

//                   <div className="col-lg-12 text-center">
//                     <button
//                       type="submit"
//                       className="btn btn-for-add text-white"
//                       disabled={loading}
//                     >
//                       {loading ? (
//                         <>
//                           <span className="spinner-border spinner-border-sm me-2"></span>
//                           Updating...
//                         </>
//                       ) : (
//                         <>
//                           <i className="fa fa-save me-1"></i>
//                           Update Coupon
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../../config/baseUrl";
import { toast } from "react-toastify";
import axios from "axios";

const API_MAP = {
  library: "https://api.pidigihub.in/library",
  mentor: "https://api.pidigihub.in/mentors",
  exam: "https://api.pidigihub.in/exams",
  ebook: "https://api.pidigihub.in/ebook",
};

export default function CouponEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [typeOptions, setTypeOptions] = useState([]);
  const [formval, setFormval] = useState({
    code: "",
    discountValue: "",
    validFrom: "",
    validTill: "",
    isActive: "true",
    category: "",
    forId: "",
  });

  useEffect(() => {
    if (id) fetchCouponDetails();
  }, [id]);

  const fetchCouponDetails = async () => {
    try {
      setFetchLoading(true);
      const res = await axios.get(`${baseUrl}/coupons/${id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });

      if (res.status === 200) {
        const data = res.data.data;
        const category = data.category || "";
        const forId =
          data.libraryId?._id ||
          data.mentorId?._id ||
          data.ebookId?._id ||
          data.examId?._id ||
          "";

        setFormval({
          code: data.code || "",
          discountValue: data.discountValue || "",
          validFrom: data.validFrom?.split("T")[0] || "",
          validTill: data.validTill?.split("T")[0] || "",
          isActive: String(data.isActive),
          category,
          forId,
        });

        // trigger entity fetch
        if (category && API_MAP[category]) fetchEntityList(category);
      }
    } catch (err) {
      toast.error("Failed to fetch coupon details");
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchEntityList = async (type) => {
    const url = API_MAP[type];

    // “All” or empty → nothing to fetch
    if (!url) {
      setTypeOptions([]);
      return;
    }
    try {
      const res = await axios.get(url, {
        headers: { Authorization: localStorage.getItem("token") },
      });

      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];

      setTypeOptions(list);
    } catch (err) {
      console.error("Failed to load entity list", err);
      toast.error("Failed to load target list");
      setTypeOptions([]);
    }
  };

  const getLabel = (item) =>
    // item?.name || item?.title || item?.code || item?._id;
    item?.mentorName ||
    item?.libraryName ||
    item?.bookTitle ||
    item?.exam_title;
  // mentorName libraryName bookTitle exam_title

  const changeHandler = (e) => {
    let { name, value } = e.target;

    if (name === "code") value = value.toUpperCase();

    if (name === "category") {
      fetchEntityList(value);
      setFormval((prev) => ({ ...prev, category: value, forId: "" }));
    } else {
      setFormval((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const { code, discountValue, validFrom, validTill, category, forId } =
      formval;

    if (!code.trim()) return toast.error("Coupon code is required"), false;
    if (!discountValue || discountValue <= 0 || discountValue > 100)
      return toast.error("Discount must be between 1 and 100"), false;
    if (!validFrom) return toast.error("Start date is required"), false;
    if (!validTill) return toast.error("End date is required"), false;
    if (new Date(validTill) <= new Date(validFrom))
      return toast.error("End date must be after start date"), false;
    if (category && category !== "all" && !forId)
      return toast.error(`Please select a ${category} item`), false;

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      code: formval.code.trim(),
      discountType: "percentage",
      discountValue: formval.discountValue,
      validFrom: formval.validFrom,
      validTill: formval.validTill,
      isActive: formval.isActive === "true",
      category: formval.category,
    };

    // Attach correct ID field
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
      case "all":
        payload.examId = null;
        break;
    }

    try {
      setLoading(true);
      const res = await axios.patch(`${baseUrl}/coupons/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });

      if (res.status === 200) {
        toast.success("Coupon updated successfully");
        navigate("/coupons");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update coupon");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <section className="main-sec">
        <div className="text-center py-5">
          <div className="spinner-border" role="status"></div>
          <p className="mt-2">Loading coupon details...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="main-sec">
      <div className="row align-items-center">
        <div className="col-lg-6">
          <div className="dashboard-title">
            <h4 className="dash-head">
              <i className="fa fa-edit me-2" />
              Edit Coupon
            </h4>
          </div>
          <div className="custom-bredcump">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/coupons">Coupons</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Edit Coupon
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="col-lg-6 d-flex justify-content-end">
          <Link to="/coupons" className="btn btn-info text-white">
            <i className="fa fa-arrow-left me-1" />
            Back
          </Link>
        </div>
      </div>

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
                    className="form-control"
                    name="code"
                    value={formval.code}
                    onChange={changeHandler}
                    style={{ textTransform: "uppercase" }}
                    required
                  />
                </div>

                {/* Discount */}
                <div className="col-lg-6 mb-4">
                  <label className="form-label">
                    Discount (%)<sup className="text-danger">*</sup>
                  </label>
                  <input
                    type="number"
                    name="discountValue"
                    className="form-control"
                    value={formval.discountValue}
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
                    <option value="">Select Type</option>
                    <option value="all">All</option>
                    <option value="library">Library</option>
                    <option value="mentor">Mentor</option>
                    <option value="ebook">ebook</option>
                    <option value="exam">Exam</option>
                  </select>
                </div>

                {/* Target select dropdown if applicable */}
                {/* {typeOptions.length > 0 && (
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
                        </option>
                      ))}
                    </select>
                  </div>
                )} */}

                {/* Valid From */}
                <div className="col-lg-6 mb-4">
                  <label className="form-label">
                    Valid From<sup className="text-danger">*</sup>
                  </label>
                  <input
                    type="date"
                    name="validFrom"
                    className="form-control"
                    value={formval.validFrom}
                    onChange={changeHandler}
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
                    name="validTill"
                    className="form-control"
                    value={formval.validTill}
                    onChange={changeHandler}
                    min={formval.validFrom || ""}
                    required
                  />
                </div>

                {/* Status */}
                <div className="col-lg-6 mb-4">
                  <label className="form-label">Status</label>
                  <select
                    name="isActive"
                    className="form-control"
                    value={formval.isActive}
                    onChange={changeHandler}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>

                {/* Submit Button */}
                <div className="col-lg-12 text-center">
                  <button
                    type="submit"
                    className="btn btn-for-add text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="fa fa-save me-1" />
                        Update Coupon
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
