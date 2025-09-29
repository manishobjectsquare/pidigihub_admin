import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl";
import { toast, Slide } from "react-toastify";

export default function OrderList() {
  const [order, setOrderData] = useState([]);

  // const order = [
  //     {
  //         id: "1",
  //         name: "User Name",
  //         order_id: "123456",
  //         Paid_Amount: "599",
  //         Gateway: "Bank",
  //         Payment_status: "paid",
  //         payment: "Paid",
  //         status: "Completed",
  //     },
  // ]

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/purchase-history/purchase-list`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setOrderData(response.data.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <section className="main-sec">
        <div className="row">
          <div className="col-lg-6">
            <div className="dashboard-title">
              <h4 className="dash-head">
                <i className="fa fa-chart-bar me-2" />
                Category List
              </h4>
            </div>
            <div className="custom-bredcump">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Categories
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <form action="" method="GET" className="form_padding">
                  <div className="row">
                    <div className="col-md-4 form-group">
                      <input
                        type="text"
                        name="keyword"
                        value=""
                        className="form-control"
                        placeholder="Search"
                      />
                    </div>
                    <div className="col-md-2 form-group">
                      <select
                        name="verified"
                        id="verified"
                        className="form-control"
                      >
                        <option value="">Select Status</option>
                        <option value="1">Paid</option>
                        <option value="0">Failed</option>
                        <option value="0">Pending</option>
                      </select>
                    </div>
                    <div className="col-md-2 form-group">
                      <select
                        name="order_by"
                        id="order_by"
                        className="form-control"
                      >
                        <option value="">Order By</option>
                        <option value="1">ASC</option>
                        <option value="0">DESC</option>
                      </select>
                    </div>
                    <div className="col-md-2 form-group">
                      <select
                        name="par-page"
                        id="par-page"
                        className="form-control"
                      >
                        <option value="">Per Page</option>
                        <option value="10">10</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="all">All</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="cards bus-list">
              <div className="bus-filter">
                <div className="row ">
                  <div className="col-lg-6">
                    <h5 class="card-title">cateo List</h5>
                  </div>
                </div>
              </div>
              <div className="table table-responsive custom-table">
                <table className="table table-borderless">
                  <thead>
                    <tr>
                      <th>SN</th>
                      <th>User</th>
                      <th>Order Id</th>
                      <th>Paid Amount</th>
                      <th>Payment</th>
                      <th>Status</th>
                      {/* <th>Actions</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {order.map((ord, i) => {
                      return (
                        <tr key={ord?.id}>
                          <td>{i + 1}</td>
                          <td>
                            <span>{ord?.userId?.name}</span>
                          </td>
                          <td>
                            <span>{ord?.paymentMethod}</span>
                          </td>
                          <td>{ord?.totalAmount}</td>
                          <td>
                            <button
                              className={
                                ord.paymentStatus === "success"
                                  ? "btn btn-pill btn-success btn-sm"
                                  : ord.payment === "Failed"
                                  ? "btn btn-pill btn btn-danger btn btn-sm"
                                  : "btn btn-pill btn btn-warning text-white btn btn-sm"
                              }
                            >
                              <span>
                                {ord?.paymentStatus === "success"
                                  ? "Success"
                                  : ord?.payment === "Failed"
                                  ? "Failed"
                                  : "Pending"}
                              </span>
                            </button>
                          </td>
                          <td>
                            <button
                              className={
                                ord.status === "success"
                                  ? "btn btn-pill btn-success btn-sm"
                                  : ord.status === "Failed"
                                  ? "btn btn-pill btn btn-danger btn btn-sm"
                                  : "btn btn-pill btn btn-warning text-white btn btn-sm"
                              }
                            >
                              <span>
                                {ord?.status === "success"
                                  ? "Completed"
                                  : ord?.status === "Failed"
                                  ? "Failed"
                                  : "Pending"}
                              </span>
                            </button>
                          </td>
                          {/* <td>
                                                        <div className="action-buttons">
                                                            <Link
                                                                className="action-btn edit-btn"
                                                                to={`category/edit/`}
                                                            >
                                                                <i className="fa fa-edit" />
                                                            </Link>
                                                            <Link
                                                                to={`category/view/`}
                                                                className="action-btn edit-btn bg-warning"
                                                            >
                                                                <i className="fa fa-eye"></i>
                                                                <span className="tooltip-text">View</span>
                                                            </Link>
                                                        </div>
                                                    </td> */}
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
