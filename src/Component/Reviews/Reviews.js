import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl";
import empty from "../../assets/images/empty-box.png";
import Swal from "sweetalert2";
export default function Reviews() {
  const [review, setReview] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/student`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setReview(response.data.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleStatus = async (id) => {
    await axios(`${baseUrl}/api/v1/admin/course-review/reviews/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    fetchCategories();
    Swal.fire({
      title: "Status Changed!",
      icon: "success",
      draggable: true,
    });
  };

  return (
    <>
      <section className="main-sec">
        <div className="row">
          <div className="col-lg-6">
            <div className="dashboard-title">
              <h4 className="dash-head">
                <i className="fa fa-chart-bar me-2" />
                Reviews
              </h4>
            </div>
            <div className="custom-bredcump">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Review List
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="cards bus-list">
              <div className="bus-filter">
                <div className="row ">
                  <div className="col-lg-6">
                    <h5 class="card-title">Review List</h5>
                  </div>
                </div>
              </div>
              <div className="table table-responsive custom-table">
                <table className="table table-borderless">
                  <thead>
                    <tr>
                      <th>SN</th>
                      <th>By</th>
                      <th>Review</th>
                      <th>Rating</th>
                      {/* <th>Status</th> */}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {review.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-5 text-center">
                          <img src={empty} alt="" width="200px" />
                          <h4 className="py-2">No Reviews found!</h4>
                        </td>
                      </tr>
                    ) : (
                      review?.map((rev, i) => {
                        return (
                          <tr key={rev?.id}>
                            <td>{i + 1}</td>
                            <td>{rev?.name}</td>
                            <td>{rev?.review}</td>
                            <td className="text-warning">
                              {Array.from({ length: +rev?.rating }, (_, i) => (
                                <i key={i} className="fa fa-star ms-1" />
                              ))}
                            </td>
                            {/* <td>
                              <button
                                onClick={() => handleStatus(rev?._id)}
                                className={
                                  rev.status === "active"
                                    ? "btn btn-pill btn-primary btn-sm"
                                    : "btn btn-pill btn-danger btn-sm"
                                }
                              >
                                <span>
                                  {rev?.status === "active"
                                    ? "Active"
                                    : "InActive"}
                                </span>
                              </button>
                            </td> */}
                            <td>
                              <div className="action-buttons">
                                <Link
                                  //   to={`view/${rev?._id}`}
                                  className="action-btn edit-btn"
                                >
                                  <i className="fa fa-eye"></i>
                                  <span className="tooltip-text">View</span>
                                </Link>
                                <button className="action-btn delete-btn">
                                  <i className="fa fa-trash"></i>
                                  <span className="tooltip-text">Delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
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
