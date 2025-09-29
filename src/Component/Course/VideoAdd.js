import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import loaderContext from "../../context/LoaderContext";
import { baseUrl } from "../../config/baseUrl";
import toastify from "../../config/toastify";

export default function VideoAdd() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    file: "",
  });
  let navigate = useNavigate();

  let { setLoader } = useContext(loaderContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "file") {
      setProgress(0);
      return setFormData({ ...formData, [name]: e.target.files[0] });
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  //  let date= new Date()
  // console.log(Date.now());

  // let handleSubmit = async (e) => {
  //   e.preventDefault()
  //   console.log(formData);
  //   if (!formData.title) return alert('Please Add video Title');
  //   if (!formData.file) return alert('Please select a file first.');

  //   setUploading(true);

  //   const accessKey = '68f52585-3890-4bda-806e3908c1e5-1216-468b';
  //   const storageZoneName = 'basementexcourses';
  //   const region = 'sg';
  //   const remoteFilePath = formData.file.name;

  //   // console.log(formData);
  //   const url = `https://storage.bunnycdn.com/${storageZoneName}/newStore/${Date.now()}-${remoteFilePath}`;

  //   setLoader(true)
  //   try {
  //     const response = await axios.put(url, formData.file, {
  //       headers: {
  //         AccessKey: accessKey,
  //         'Content-Type': 'application/octet-stream',
  //       },
  //       maxBodyLength: Infinity,
  //       maxContentLength: Infinity,
  //       onUploadProgress: (progressEvent) => {
  //         const percentCompleted = Math.round(
  //           (progressEvent.loaded * 100) / progressEvent.total
  //         );
  //         setProgress(percentCompleted);
  //       },
  //     });

  //     // console.log('Upload successful!', response);
  //     // console.log('Upload successful!', response.status);
  //     // console.log('Upload url!', response.url);
  //     if (response.status == 201) {

  //       formData.link = `https://teachera.b-cdn.net/newStore/${url.split("/").pop()}`
  //       const response = await axios.post(`${baseUrl}/api/v1/admin/videoLink/video-link-store`, formData,)

  //       if (response.status) {
  //         alert('Upload successful!');
  //         navigate("/videos")
  //       }
  //     }

  //   } catch (error) {
  //     console.error('Upload failed:', error.response ? error.response.data : error.message);
  //     alert('Upload failed. See console for details.');
  //   } finally {
  //     setUploading(false);
  //     setLoader(false)
  //   }

  // }

  let handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    if (!formData.title) return alert("Please add a video title.");
    if (!formData.file) return alert("Please select a file first.");

    setUploading(true);
    setLoader(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append("title", formData.title);
      formDataObj.append("file", formData.file);

      const response = await axios.post(
        "http://localhost:8201/api/v1/admin/videoLink/upload-video",
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );

      if (response.status === 200) {
        alert("Upload successful!");
        console.log("Video URL:", response.data.videoUrl);
        formData.link = response.data.videoUrl;
        if (response.data.status) {
          toastify.success(response.data.message);
          navigate("/videos");
        } else {
          toastify.errorColor(response.data.message);
        }
      }
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
      alert("Upload failed. Check console for details.");
    } finally {
      setUploading(false);
      setLoader(false);
    }
  };

  return (
    <>
      <section className="main-sec">
        <div className="row">
          <div className="col-lg-6">
            <div className="dashboard-title">
              <h4 className="dash-head">
                <i className="fa fa-users me-2" />
                Add Video
              </h4>
            </div>
            <div className="custom-bredcump">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Add Video
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="cards edit-usr">
              <form action="" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="title" className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      placeholder="Enter Title"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label htmlFor="path" className="form-label">
                      Video Path
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      name="file"
                      placeholder="Enter Video Path"
                      onChange={handleChange}
                      accept="video/*"
                    />
                  </div>

                  <div className="col-lg-12 text-center">
                    <button
                      type="submit"
                      className="btn btn-for-add text-white"
                    >
                      Submit
                    </button>

                    {uploading && (
                      <div style={{ marginTop: "20px" }}>
                        <progress
                          value={progress}
                          max="100"
                          style={{ width: "100%" }}
                        />
                        <p>{progress}%</p>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
