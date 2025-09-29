import { useState, useContext, useEffect, useRef } from "react";
import Pagination from "../Pagination/Pagination";
import moment from "moment";
import loaderContext from "../../context/LoaderContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export default function StudentListTable() {
  const [userList, setUserList] = useState([{}]);
  const fileInputRef = useRef(null);

  const [paginationDetails, setPaginationDetails] = useState({
    currentPage: 1,
    totalPages: 3,
    totalItems: 15,
  });
  const [pageNumber, setPageNumber] = useState(1);
  const [pageLimit, setPageLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(3);
  const [searchData, setSearchData] = useState({
    is_staff: "",
    name: "",
  });

  const { setLoader } = useContext(loaderContext);

  const filterHandler = async (e) => {
    setPageNumber(1);
    setSearchData((curr) => {
      return { ...curr, [e.target.name]: e.target.value };
    });
  };

  useEffect(() => {
    fetchLiveData();
  }, []);

  const fetchLiveData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/user/user-list`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = response.data.data;
      setUserList(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleDelete = (id) => {
    let apiCall = async () => {
      let res = await fetch(`${baseUrl}/api/v1/admin/user/user-delete/${id}`, {
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

  const handleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === true ? false : true;
    let apiCall = async () => {
      await axios(`${baseUrl}/user/user-status/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        data: { status: newStatus }
      });
      setUserList((prevUser) => prevUser.map((q) => (q._id === id ? { ...q, status: newStatus } : q)))
      toast.success("Status Updated Successfully")
    };
    apiCall();
  };

  const handleUploadFile = (e) => {
    let file = e.target.files[0];
    let postData = new FormData();
    postData.append("excel", file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    apiCall(postData);
  };

  let apiCall = async (file) => {
    try {
      let response = await axios({
        method: "POST",
        url: `${baseUrl}/api/v1/admin/user/bulk-upload`,
        data: file,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (response.data.status) {
        fetchLiveData();
        Swal.fire({
          title: "data uploaded!",
          icon: "success",
          draggable: true,
        });
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  return (
    <>
      <div className="cards user-list">
        <div className="row">
          <div className="col-lg-12">
            <div className="bus-filter">
              <div className="row justify-content-end">
                <form action="">
                  <div className="row justify-content-end  ">
                    {/* <div class="d-flex align-items-center justify-content-end gap-3">
                      <div class="d-flex align-items-center">
                        <label
                          for="fileUpload"
                          class="btn btn-primary me-2 mb-0"
                        >
                          <i class="fa fa-upload me-1"></i>
                          Bulk Upload
                        </label>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleUploadFile}
                          id="fileUpload"
                          class="d-none"
                        />
                      </div>
                      <Link
                        to={`${baseUrl}/bulk_upload_sample.xlsx`}
                        download
                        class="btn btn-info text-white"
                      >
                        <i class="fa fa-arrow-down me-1"></i>
                        Download Format
                      </Link>
                      <Link
                        to="/student-add"
                        class="btn btn-primary d-flex align-items-center justify-content-center"
                      >
                        <i class="fa fa-plus me-1"></i>
                        Add Student
                      </Link>
                    </div> */}
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="table table-responsive custom-table management-table">
              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th>Sr No.</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Mobile Number</th>
                    <th>Joined At</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="">
                  {userList.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>
                        <img
                          src={`${baseUrl}/uploads/${user?.photo}` || "/jslogo.png"}
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "/jslogo.png"
                          }}
                          alt=""
                          style={{ width: '100px' }}
                        />
                      </td>
                      <td>{user?.name}</td>
                      <td>{user?.mobile || "N/A"}</td>
                      <td>{moment(user?.createdAt).format("lll")}</td>
                      <td>
                        <button
                          className={`btn btn-pill ${user.status === true
                            ? "btn-success"
                            : "btn-danger"
                            } text-capitalize`}
                          onClick={() => handleStatus(user?._id, user?.status)}
                        >
                          {user.status === true ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link to="" className="action-btn edit-btn">
                            <i className="fa fa-eye"></i>
                            <span className="tooltip-text">View</span>
                          </Link>
                          {/* <button
                            className="action-btn delete-btn"
                            type="button"

                            onClick={() => handleDelete(user?._id)}
                          >
                            <i className="fa fa-trash"></i>
                            <span className="tooltip-text">Delete</span>
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* {totalPages && (
                <Pagination
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                  pageLimit={pageLimit}
                  paginationDetails={paginationDetails}
                  totalPages={totalPages}
                />
              )} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
