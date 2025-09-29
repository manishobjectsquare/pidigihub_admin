import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "../Pagination/Pagination";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl";
import { toast, Bounce, Zoom, Slide } from "react-toastify";

export default function Videos() {
  const [pageNumber, setPageNumber] = useState(1);

  const [video, setVideo] = useState([]);
  const [totalPages, setTotalPages] = useState(3);

  const [paginationDetails, setPaginationDetails] = useState({
    currentPage: 1,
    totalPages: 3,
    totalRecords: 25,
  });

  useEffect(() => {
    fetchLiveData();
  }, []);

  const fetchLiveData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/videoLink/video-link-list`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setVideo(response.data.data);
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
                Videos
              </h4>
            </div>
            <div className="custom-bredcump">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Videos
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="col-lg-6 text-end">
            <Link
              to="/add-video"
              className="btn py-2 px-5 text-white btn-for-add"
            >
              <i className="fa fa-plus me-2"></i>
              Add Video
            </Link>
          </div>
          <div className="col-lg-12">
            <div className="cards bus-list">
              <div className="bus-filter">
                <div className="row ">
                  <div className="col-lg-6">
                    <h5 className="card-title">Video List</h5>
                  </div>
                </div>
              </div>
              <div className="table table-responsive custom-table">
                <table className="table table-borderless">
                  <thead>
                    <tr>
                      <th>Sr. no.</th>
                      <th>Title</th>
                      <th>Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {video.map((vid, i) => {
                      return (
                        <tr key={vid?._id}>
                          <td>{i + 1}</td>
                          <td>
                            <span>{vid?.title}</span>
                          </td>
                          <td className="d-flex justify-content-center align-items-center gap-3">
                            {vid?.link}
                            <button
                              className="edit-btn rounded-1 fs-6"
                              title="Copy"
                              onClick={async () => {
                                await navigator.clipboard.writeText(vid?.link);
                                toast.info(` Video link Copy`, {
                                  position: "top-center",
                                  autoClose: 100,
                                  hideProgressBar: true,
                                  closeOnClick: false,
                                  pauseOnHover: true,
                                  draggable: true,
                                  progress: undefined,
                                  theme: "colored",
                                  transition: Slide,
                                });
                              }}
                            >
                              <i className="fa fa-copy"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {/* {totalPages > 1 && (
                  <Pagination
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                    paginationDetails={paginationDetails}
                    totalPages={totalPages}
                  />
                )} */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
