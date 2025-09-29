import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl";
import Swal from "sweetalert2";

export default function CourseCatgory() {
  let [data, setData] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/banner`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch banners", error);
    }
  };

  const handleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    await axios(`${baseUrl}/banner/${id}/status`, {
      method: "PATCH",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
      data: {
        status: newStatus,
      },
    });
    fetchData();
    Swal.fire({
      title: "Status Changed!",
      icon: "success",
      draggable: true,
    });
  };

  const handleDelete = (id) => {
    let apiCall = async () => {
      let res = await fetch(`${baseUrl}/banner/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const result = await res.json();
      fetchData();
    };
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        apiCall();
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  };
  // const handleDelete = (id) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!",
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       try {
  //         const res = await fetch(`${baseUrl}/banner/deletebanner/${id}`, {
  //           method: "DELETE",
  //           headers: {
  //             Authorization: localStorage.getItem("token"),
  //           },
  //         });
  //         const data = await res.json();
  //         fetchData()
  //         if (res.ok) {
  //           setData((prev) => prev.filter((b) => b._id !== id));
  //           Swal.fire("Deleted!", "Your banner has been deleted.", "success");
  //         }
  //       } catch (error) {
  //         console.error("Delete error:", error);
  //         Swal.fire("Error", "Failed to delete banner", "error");
  //       }
  //     }
  //   });
  // };

  return (
    <>
      <section className="main-sec">
        <div className="row">
          <div className="col-lg-6">
            <div className="dashboard-title">
              <h4 className="dash-head">
                <i className="fa fa-chart-bar me-2" />
                Banner List
              </h4>
            </div>
            <div className="custom-bredcump">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Banner
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="col-lg-6 text-end">
            <Link
              to="/banner-add"
              className="btn py-2 px-5 text-white btn-for-add"
            >
              <i className="fa fa-plus me-2"></i>
              Add Banner
            </Link>
          </div>
          <div className="col-lg-12">
            <div className="cards bus-list">
              <div className="bus-filter">
                <div className="row ">
                  <div className="col-lg-6">
                    <h5 className="card-title">Banner List</h5>
                  </div>
                </div>
              </div>
              <div className="table table-responsive custom-table">
                <table className="table table-borderless">
                  <thead>
                    <tr>
                      <th>SN</th>
                      <th>Link</th>
                      <th>Banner</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.map((item, i) => {
                      return (
                        <tr key={item?._id}>
                          <td>{i + 1}</td>
                          <td>
                            <span>{item?.link}</span>
                          </td>
                          <td>
                            <img
                              src={`${baseUrl}/${item?.image}` || "/jslogo.png"}
                              style={{ width: "100px", height: "100px" }}
                              className="p-2"
                              alt="category"
                              onError={(e) => {
                                e.target.onerror = null; // Prevents infinite loop in case fallback also fails
                                e.target.src = "/jslogo.png";
                              }}
                            />
                          </td>

                          <td>
                            <button
                              onClick={() =>
                                handleStatus(item?._id, item?.status)
                              }
                              className={
                                item.status === "active"
                                  ? "btn btn-pill btn-primary  btn-sm"
                                  : "btn btn-pill btn btn-danger btn btn-sm"
                              }
                            >
                              <span>
                                {item?.status === "active"
                                  ? "Active"
                                  : "InActive"}
                              </span>
                            </button>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <Link
                                className="action-btn edit-btn"
                                to={`/banner-edit/${item?._id}`}
                              >
                                <i className="fa fa-edit" />
                              </Link>
                              {/* 
                              <Link
                                title="Sub Category"
                                className="action-btn edit-btn bg-primary"
                                to="subcategories"
                              >
                                <i className="fa fa-list" />
                                <span className="tooltip-text">
                                  Sub Category
                                </span>
                              </Link> */}
                              <button
                                onClick={() => handleDelete(item?._id)}
                                className="action-btn edit-btn bg-danger"
                              >
                                <i className="fa fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
