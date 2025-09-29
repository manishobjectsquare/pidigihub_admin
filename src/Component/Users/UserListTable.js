import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl";
import Pagination from "../Pagination/Pagination";
import moment from "moment";

import loaderContext from "../../context/LoaderContext";

export default function UserListTable() {
  let [userList, setUserList] = useState();
  let [paginationDetails, setPaginationDetails] = useState();
  let [pageNumber, setPageNumber] = useState(1);
  let [pageLimit, setPageLimit] = useState(1);
  let [totalPages, setTotalPages] = useState();
  let [searchData, setSearchData] = useState({
    is_staff: "",
    name: "",
  });

  let { setLoader } = useContext(loaderContext);

  let userListApi = async () => {
    setLoader(true);
    try {
      let response = await axios(
        `${baseUrl}/api/v1/admin/user-list?page=${pageNumber}&name=${searchData?.name}&is_staff=${searchData?.is_staff}`,
        {
          method: "GET",
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        }
      );

      if (response?.data.status) {
        setUserList(response.data.data);
        setPageNumber(response?.data?.currentPage);
        setPageLimit(response?.data?.totalRecords);
        setTotalPages(response?.data?.totalPages);
      }
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    // let id;
    // if(!id){
    //     id=setTimeout(()=>{
    //     },2000)
    //   }
    //   return () => clearTimeout(id);
    userListApi();
  }, [pageNumber, searchData]);

  let filterHandler = async (e) => {
    setPageNumber(1);
    setSearchData((curr) => {
      return { ...curr, [e.target.name]: e.target.value };
    });
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
                    <div className="col-lg-2">
                      <input
                        type="text"
                        name="name"
                        value={searchData?.name}
                        className="form-control"
                        onChange={filterHandler}
                        placeholder="Enter Name"
                      />
                    </div>
                    <div className="col-lg-2">
                      <select
                        name="is_staff"
                        value={searchData?.is_staff}
                        className="form-select"
                        onChange={filterHandler}
                      >
                        <option value="">Is Staff</option>
                        <option value="1">YES</option>;
                        <option value="0">NO</option>
                      </select>
                    </div>

                    <div className="col-lg-2">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                          setPageNumber(1);
                          setSearchData({
                            is_staff: "",
                            name: "",
                          });
                        }}
                      >
                        Reset
                      </button>
                    </div>
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
                    <th>Name </th>
                    <th>Email </th>
                    <th>Mobile </th>
                    <th>City (State)</th>
                    <th>App Version</th>
                    <th>Status</th>
                    <th>Role Name</th>
                    <th>Is Staff</th>
                    <th> Created At</th>
                  </tr>
                </thead>
                <tbody className="">
                  {userList?.map((arr, i) => {
                    return (
                      <tr key={arr?._id}>
                        {/* <td >{++i}</td> */}
                        {++i + 50 * (pageNumber - 1)}
                        <td>{arr?.name}</td>
                        <td>
                          <span> {arr?.mobile}</span>
                        </td>
                        <td>
                          <span className="thm-clr">{arr?.email}</span>
                        </td>
                        <td>
                          {arr?.city} <span>( {arr?.state})</span>
                        </td>
                        <td>{arr?.app_version}</td>
                        <td>
                          {" "}
                          <button className="btn btn-outline-primary text-capitalize">
                            {arr?.status}
                          </button>{" "}
                        </td>
                        <td>App User</td>
                        <td>
                          {" "}
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={arr?.is_staff}
                          />{" "}
                        </td>
                        <td>{moment(arr?.created_at).format("LLL")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {totalPages && (
                <Pagination
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                  pageLimit={pageLimit}
                  paginationDetails={paginationDetails}
                  totalPages={totalPages}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
