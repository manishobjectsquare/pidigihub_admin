import { useState, useContext, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../../config/baseUrl";
import Swal from "sweetalert2";
import loaderContext from "../../../context/LoaderContext";

export default function StudentListTable() {
  const [userList, setUserList] = useState([]);
  const { setLoader } = useContext(loaderContext);

  // STUDENT LIST API H
  useEffect(() => {
    fetchLiveData();
  }, []);

  const fetchLiveData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/user/user-list?role=instructor`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setUserList(response.data.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleDelete = (id) => {
    let apiCall = async () => {
      let res = await fetch(`${baseUrl}/api/v1/admin/user/instructor-delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const result = await res.json();
      if (result.status) {
        fetchLiveData();
      }
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

  const handleStatus = (id) => {
    let apiCall = async () => {
      await axios(`${baseUrl}/api/v1/admin/user/change-status/${id}`, {
        method: "PUT",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      fetchLiveData();
      Swal.fire({
        title: "Status Changed!",
        icon: "success",
        draggable: true,
      });
    };
    apiCall();
  };

  return (
    <>
      <div className="cards user-list">
        <div className="row">
          <div className="col-lg-12">
            <div className="table table-responsive custom-table management-table">
              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th>Sr No.</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Joined At</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="">
                  {userList.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.name}</td>
                      <td>
                        <span className="thm-clr">{user.email}</span>
                      </td>
                      <td>{moment(user.created_at).format("lll")}</td>
                      <td>
                        <button
                          className={`btn btn-pill ${user.status === "active"
                            ? "btn-success"
                            : "btn-danger"
                            } text-capitalize`}
                          onClick={() => handleStatus(user?._id)}
                        >
                          {user.status === "active" ? "active" : "inactive"}
                        </button>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link to="" className="action-btn edit-btn">
                            <i className="fa fa-eye"></i>
                            <span className="tooltip-text">View</span>
                          </Link>
                          <button
                            className="action-btn delete-btn"
                            type="button"
                            onClick={() => handleDelete(user?._id)}
                          >
                            <i className="fa fa-trash"></i>
                            <span className="tooltip-text">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
