// import { useState, useEffect } from "react"
// import { Link } from "react-router-dom"
// import axios from "axios"
// import { baseUrl } from "../../config/baseUrl"
// import { toast } from "react-toastify"

// export default function CouponList() {
//     const [coupon, setCoupon] = useState([])
//     const [loading, setLoading] = useState(false)
//     const [deleteLoading, setDeleteLoading] = useState(null)
//     const [statusLoading, setStatusLoading] = useState(null)

//     useEffect(() => {
//         fetchCoupons()
//     }, [])

//     const fetchCoupons = async () => {
//         try {
//             setLoading(true)
//             const response = await axios.get(`${baseUrl}/coupons`, {
//                 headers: {
//                     Authorization: localStorage.getItem("token"),
//                 },
//             })
//             console.log("response", response)
//             setCoupon(response.data.data)
//         } catch (error) {
//             console.log("error", error)
//             toast.error("Failed to fetch coupons")
//         } finally {
//             setLoading(false)
//         }
//     }

//     const deleteCoupon = async (couponId) => {
//         if (!window.confirm("Are you sure you want to delete this coupon?")) {
//             return
//         }

//         try {
//             setDeleteLoading(couponId)
//             const response = await axios.delete(`${baseUrl}/api/v1/admin/coupon/coupon-delete/${couponId}`, {
//                 headers: {
//                     Authorization: localStorage.getItem("token"),
//                 },
//             })

//             if (response.status === 200) {
//                 toast.success("Coupon deleted successfully")
//                 // Remove the deleted coupon from the state
//                 setCoupon(coupon.filter((item) => item._id !== couponId))
//             }
//         } catch (error) {
//             console.log("Delete error", error)
//             toast.error("Failed to delete coupon")
//         } finally {
//             setDeleteLoading(null)
//         }
//     }

//     const toggleCouponStatus = async (couponId) => {
//         try {
//             setStatusLoading(couponId)
//             const response = await axios.get(`${baseUrl}/api/v1/admin/coupon/coupon-status/${couponId}`, {
//                 headers: {
//                     Authorization: localStorage.getItem("token"),
//                 },
//             })

//             if (response.status === 200) {
//                 toast.success("Coupon status updated successfully")
//                 // Update the coupon status in the state
//                 setCoupon(
//                     coupon.map((item) =>
//                         item._id === couponId ? { ...item, status: item.status === true ? false : true } : item,
//                     ),
//                 )
//             }
//         } catch (error) {
//             console.log("Status toggle error", error)
//             toast.error("Failed to update coupon status")
//         } finally {
//             setStatusLoading(null)
//         }
//     }

//     const formatDate = (dateString) => {
//         const date = new Date(dateString)
//         return date.toLocaleString("en-US", {
//             year: "numeric",
//             month: "2-digit",
//             day: "2-digit",
//         })
//     }

//     // Function to check if coupon is expired
//     const isCouponExpired = (endDate) => {
//         const today = new Date()
//         today.setHours(0, 0, 0, 0)
//         const couponEndDate = new Date(endDate)
//         return today > couponEndDate
//     }

//     const getEffectiveStatus = (coupon) => {
//         if (isCouponExpired(coupon.validTill && coupon.isActive)) {
//             return "false"
//         }
//         return coupon.status
//     }

//     if (loading) {
//         return (
//             <section className="main-sec">
//                 <div className="text-center py-5">
//                     <div className="spinner-border" role="status">
//                         <span className="visually-hidden">Loading...</span>
//                     </div>
//                     <p className="mt-2">Loading coupons...</p>
//                 </div>
//             </section>
//         )
//     }

//     return (
//         <>
//             <section className="main-sec">
//                 <div className="row">
//                     <div className="col-lg-6">
//                         <div className="dashboard-title">
//                             <h4 className="dash-head">
//                                 <i className="fa fa-chart-bar me-2" />
//                                 Coupon List
//                             </h4>
//                         </div>
//                         <div className="custom-bredcump">
//                             <nav aria-label="breadcrumb">
//                                 <ol className="breadcrumb">
//                                     <li className="breadcrumb-item">
//                                         <Link to="/">Dashboard</Link>
//                                     </li>
//                                     <li className="breadcrumb-item active" aria-current="page">
//                                         Coupon List
//                                     </li>
//                                 </ol>
//                             </nav>
//                         </div>
//                     </div>
//                     <div className="col-lg-6 text-end">
//                         <Link to="add" className="btn py-2 px-5 text-white btn-for-add">
//                             <i className="fa fa-plus me-2"></i>
//                             Add New
//                         </Link>
//                     </div>

//                     <div className="col-lg-12">
//                         <div className="cards bus-list">
//                             <div className="bus-filter">
//                                 <div className="row ">
//                                     <div className="col-lg-6">
//                                         <h5 className="card-title">Coupon List ({coupon.length})</h5>
//                                     </div>

//                                 </div>
//                             </div>
//                             <div className="table table-responsive custom-table">
//                                 <table className="table table-borderless">
//                                     <thead>
//                                         <tr>
//                                             <th>SN</th>
//                                             <th>Coupon Code</th>
//                                             <th>Type</th>
//                                             <th>Offer</th>
//                                             <th>For</th>
//                                             <th>Start Date</th>
//                                             <th>End Date</th>
//                                             <th>Status</th>
//                                             <th>Actions</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {coupon.length > 0 ? (
//                                             coupon.map((couponItem, i) => {
//                                                 const effectiveStatus = getEffectiveStatus(couponItem)
//                                                 const isExpired = isCouponExpired(couponItem.end_date)

//                                                 return (
//                                                     <tr key={couponItem?._id}>
//                                                         <td>{i + 1}</td>
//                                                         <td>
//                                                             <span
//                                                                 style={{
//                                                                     display: "inline-block",
//                                                                     padding: "6px 12px",
//                                                                     border: "2px dashed #f5c6cb",
//                                                                     borderRadius: "6px",
//                                                                     color: "#d9534f",
//                                                                     backgroundColor: "#fcebea",
//                                                                     fontWeight: "bold",
//                                                                     letterSpacing: "1px",
//                                                                 }}
//                                                             >
//                                                                 {couponItem?.code}
//                                                             </span>
//                                                         </td>
//                                                         <td>
//                                                             {couponItem?.discountType}
//                                                         </td>
//                                                         <td>
//                                                             <span
//                                                                 style={{
//                                                                     display: "inline-block",
//                                                                     padding: "4px 10px",
//                                                                     backgroundColor: "#fcebea",
//                                                                     color: "#d9534f",
//                                                                     border: "1px solid #f5c6cb",
//                                                                     borderRadius: "4px",
//                                                                     fontWeight: "bold",
//                                                                 }}
//                                                             >
//                                                                 {couponItem?.discountValue || "N/A"}%
//                                                             </span>
//                                                         </td>
//                                                         <td>
//                                                             {couponItem?.for}
//                                                         </td>
//                                                         <td>{formatDate(couponItem?.start_date)}</td>
//                                                         <td>
//                                                             {formatDate(couponItem?.validTill)}
//                                                             {couponItem?.isActive && (
//                                                                 <span className="ms-2 badge bg-danger" style={{ fontSize: "10px" }}>
//                                                                     Expired
//                                                                 </span>
//                                                             )}
//                                                         </td>
//                                                         <td>
//                                                             <button
//                                                                 className={
//                                                                     effectiveStatus === "true"
//                                                                         ? "btn btn-pill btn-success btn-sm"
//                                                                         : "btn btn-pill btn-danger btn-sm"
//                                                                 }
//                                                                 onClick={() => toggleCouponStatus(couponItem._id)}
//                                                                 disabled={statusLoading === couponItem._id || isExpired}
//                                                                 title={isExpired ? "Cannot change status of expired coupon" : "Click to toggle status"}
//                                                             >
//                                                                 {statusLoading === couponItem._id ? (
//                                                                     <span className="spinner-border spinner-border-sm me-1"></span>
//                                                                 ) : null}
//                                                                 <span>{effectiveStatus === true ? "Active" : "Inactive"}</span>
//                                                             </button>
//                                                         </td>
//                                                         <td>
//                                                             <div className="action-buttons d-flex gap-2">
//                                                                 <Link
//                                                                     to={`edit/${couponItem._id}`}
//                                                                     title="Edit"
//                                                                     className="action-btn edit-btn btn btn-outline-primary btn-sm"
//                                                                 >
//                                                                     <i className="fa fa-edit"></i>
//                                                                 </Link>
//                                                                 <button
//                                                                     title="Delete"
//                                                                     className="action-btn delete-btn btn btn-outline-danger btn-sm"
//                                                                     onClick={() => deleteCoupon(couponItem._id)}
//                                                                     disabled={deleteLoading === couponItem._id}
//                                                                 >
//                                                                     {deleteLoading === couponItem._id ? (
//                                                                         <span className="spinner-border spinner-border-sm"></span>
//                                                                     ) : (
//                                                                         <i className="fa fa-trash"></i>
//                                                                     )}
//                                                                 </button>
//                                                             </div>
//                                                         </td>
//                                                     </tr>
//                                                 )
//                                             })
//                                         ) : (
//                                             <tr>
//                                                 <td colSpan="7" className="text-center py-4">
//                                                     <div className="text-muted">
//                                                         <i className="fa fa-ticket fa-2x mb-3"></i>
//                                                         <p>No coupons found</p>
//                                                         <Link to="add" className="btn btn-primary btn-sm">
//                                                             <i className="fa fa-plus me-1"></i>
//                                                             Add First Coupon
//                                                         </Link>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         )}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </>
//     )
// }
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl";
import { toast } from "react-toastify";
import moment from "moment/moment";

export default function CouponList() {
  const [coupon, setCoupon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [statusLoading, setStatusLoading] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/coupons`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      console.log("response", response);
      setCoupon(response.data.data);
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  const deleteCoupon = async (couponId) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;

    try {
      setDeleteLoading(couponId);
      const response = await axios.delete(`${baseUrl}/coupons/${couponId}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (response.status === 200) {
        toast.success("Coupon deleted successfully");
        setCoupon(coupon.filter((item) => item._id !== couponId));
      }
    } catch (error) {
      console.log("Delete error", error);
      toast.error("Failed to delete coupon");
    } finally {
      setDeleteLoading(null);
    }
  };

  const toggleCouponStatus = async (couponId, currentStatus) => {
    try {
      setStatusLoading(couponId);

      // const currentCoupon = coupon.find((item) => item._id === couponId)
      // const newStatus = !currentCoupon.isActive // Toggle the current status
      const newStatus = currentStatus === true ? false : true;
      const response = await axios.patch(
        `https://api.pidigihub.in/coupons/status/${couponId}`,
        { isActive: newStatus },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.status === 200) {
        toast.success("Coupon status updated successfully");
        setCoupon(
          coupon.map((item) =>
            item._id === couponId ? { ...item, isActive: newStatus } : item
          )
        );
      }
    } catch (error) {
      console.log("Status toggle error", error);
      toast.error("Failed to update coupon status");
    } finally {
      setStatusLoading(null);
    }
  };

  const isCouponExpired = (endDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const couponEndDate = new Date(endDate);
    return today > couponEndDate;
  };

  const getEffectiveStatus = (coupon) => {
    if (isCouponExpired(coupon.validTill)) {
      return false;
    }
    return coupon.isActive;
  };

  if (loading) {
    return (
      <section className="main-sec">
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading coupons...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="main-sec">
      <div className="row">
        <div className="col-lg-6">
          <div className="dashboard-title">
            <h4 className="dash-head">
              <i className="fa fa-chart-bar me-2" />
              Coupon List
            </h4>
          </div>
          <div className="custom-bredcump">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Coupon List
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="col-lg-6 text-end">
          <Link to="add" className="btn py-2 px-5 text-white btn-for-add">
            <i className="fa fa-plus me-2"></i>
            Add New
          </Link>
        </div>

        <div className="col-lg-12">
          <div className="cards bus-list">
            <div className="bus-filter">
              <div className="row">
                <div className="col-lg-6">
                  <h5 className="card-title">Coupon List ({coupon.length})</h5>
                </div>
              </div>
            </div>
            <div className="table table-responsive custom-table">
              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th>SN</th>
                    <th>Coupon Code</th>
                    <th>Offer</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupon.length > 0 ? (
                    coupon.map((couponItem, i) => {
                      const isExpired = isCouponExpired(couponItem.validTill);
                      const effectiveStatus = getEffectiveStatus(couponItem);

                      return (
                        <tr key={couponItem._id}>
                          <td>{i + 1}</td>
                          <td>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "6px 12px",
                                border: "2px dashed #f5c6cb",
                                borderRadius: "6px",
                                color: "#d9534f",
                                backgroundColor: "#fcebea",
                                fontWeight: "bold",
                                letterSpacing: "1px",
                              }}
                            >
                              {couponItem.code}
                            </span>
                          </td>
                          {/* <td>{couponItem.discountType}</td> */}
                          <td>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "4px 10px",
                                backgroundColor: "#fcebea",
                                color: "#d9534f",
                                border: "1px solid #f5c6cb",
                                borderRadius: "4px",
                                fontWeight: "bold",
                              }}
                            >
                              {couponItem.discountValue || "N/A"}%
                            </span>
                          </td>
                          <td>{moment(couponItem.validFrom).format("ll")}</td>
                          <td>
                            {moment(couponItem.validTill).format("ll")}
                            {isExpired && (
                              <span
                                className="ms-2 badge bg-danger"
                                style={{ fontSize: "10px" }}
                              >
                                Expired
                              </span>
                            )}
                          </td>
                          <td>
                            <button
                              className={
                                effectiveStatus
                                  ? "btn btn-pill btn-success btn-sm"
                                  : "btn btn-pill btn-danger btn-sm"
                              }
                              onClick={() =>
                                toggleCouponStatus(
                                  couponItem._id,
                                  couponItem?.isActive
                                )
                              }
                              disabled={
                                statusLoading === couponItem._id || isExpired
                              }
                              title={
                                isExpired
                                  ? "Cannot change status of expired coupon"
                                  : "Click to toggle status"
                              }
                            >
                              {statusLoading === couponItem._id && (
                                <span className="spinner-border spinner-border-sm me-1"></span>
                              )}
                              <span>
                                {effectiveStatus ? "Active" : "Inactive"}
                              </span>
                            </button>
                          </td>
                          <td>
                            <div className="action-buttons d-flex gap-2">
                              <Link
                                to={`edit/${couponItem._id}`}
                                title="Edit"
                                className="action-btn edit-btn btn btn-outline-primary btn-sm"
                              >
                                <i className="fa fa-edit"></i>
                              </Link>
                              <button
                                title="Delete"
                                className="action-btn delete-btn btn btn-outline-danger btn-sm"
                                onClick={() => deleteCoupon(couponItem._id)}
                                disabled={deleteLoading === couponItem._id}
                              >
                                {deleteLoading === couponItem._id ? (
                                  <span className="spinner-border spinner-border-sm"></span>
                                ) : (
                                  <i className="fa fa-trash"></i>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-4">
                        <div className="text-muted">
                          <i className="fa fa-ticket fa-2x mb-3"></i>
                          <p>No coupons found</p>
                          <Link to="add" className="btn btn-primary btn-sm">
                            <i className="fa fa-plus me-1"></i>
                            Add First Coupon
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
