import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faLink } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import CourseNavigation from "./CourseNavigation";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { baseUrl } from "../../config/baseUrl";
import axios from "axios";
import toastify from "../../config/toastify";
import "../../assets/css/instructor.css";
import Swal from "sweetalert2";

// ReactQuill
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

const CourseForm = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const editMode = !!id;
  let navigate = useNavigate();

  // State for form data
  const [instructorsList, setInstructorsList] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    seo_description: "",
    thumbnail: "",
    demo_video_storage: "upload",
    upload_path: "",
    external_path: "",
    price: "",
    instructor_id: "",
    discount_price: "",
    description: "",
  });



  useEffect(() => {
    if (editMode && id) {
      const fetchCourse = async () => {
        try {
          const res = await axios.get(
            `${baseUrl}/api/v1/admin/course/course-get/${id}`
          );
          if (res.data.status) {
            const course = res.data.data;
            console.log("sdddd", res.data.data)
            setSelectedFile(course.thumbnail)
            setFormData({
              instructor_id: course?.instructor_id,
              title: course.title || "",
              seo_description: course.seo_description || "",
              thumbnail: course.thumbnail || "",
              demo_video_storage: course.demo_video_storage || "",
              upload_path:
                course.demo_video_storage === "upload"
                  ? course.demo_video_source || ""
                  : "",
              external_path:
                course.demo_video_storage !== "upload"
                  ? course.demo_video_source || ""
                  : "",
              price: course.price || 0,
              discount_price: course.discount_price || 0,
              description: course.description || "",
            });
          } else {
            console.error("Failed to fetch course:", res.data.message);
          }
        } catch (error) {
          console.error("Error fetching course:", error);
        }
      };

      fetchCourse();
    }
  }, [editMode, id]);

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
      setInstructorsList(response.data.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle rich text editor changes
  const handleEditorChange = (content) => {
    setFormData({ ...formData, description: content });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(t("Form submitted:"), formData);
    let postData = new FormData();
    postData.append("title", formData.title);
    postData.append("instructor_id", formData?.instructor_id);
    postData.append("upload_path", formData.upload_path);
    postData.append("thumbnail", selectedFile);
    postData.append("demo_video_storage", formData.demo_video_storage);
    postData.append("seo_description", formData.seo_description);
    postData.append("external_path", formData.external_path || null);
    postData.append("discount_price", formData.discount_price);
    postData.append("price", formData.price);
    postData.append("description", formData.description);

    try {
      let response = await axios(
        editMode && id
          ? `${baseUrl}/api/v1/admin/course/course-update/${id}`
          : `${baseUrl}/api/v1/admin/course/course-store`,
        {
          method: "POST",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
          data: postData,
        }
      );
      console.log(response?.data.data);

      if (!response?.data?.status) {
        toastify.error(response?.data?.message);
        return;
      }
      navigate(`/courses/add/${response?.data.data?._id}/step=2`);
    } catch (error) {
      console.error("Error :", error);
    }
    // In a real app, you would send this data to your API
  };

  // Handle file manager clicks
  // const handleFileManagerClick = (inputId) => {
  //   if (inputId.target.name === "thumbnail") {
  //     setFormData({ ...formData, thumbnail: inputId.target.files[0] });
  //   } else if (inputId.target.name === "upload_path") {
  //     setFormData({ ...formData, upload_path: inputId.target.files[0] });
  //   }
  // };
  const handleFileManagerClick = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (e.target.name === "thumbnail") {
      setFormData({ ...formData, thumbnail: file });
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else if (e.target.name === "upload_path") {
      setFormData({ ...formData, upload_path: file });
    }
  };


  // Video storage options
  const videoStorageOptions = [
    { value: "upload", label: t("Upload") },
    { value: "youtube", label: t("YouTube") },
    { value: "vimeo", label: t("Vimeo") },
    { value: "external_link", label: t("External Link") },
  ];
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };
  return (
    <div className="main-sec">
      <CourseNavigation />
      <div className="">
        <div className="instructor__profile-form-wrap">
          <form
            onSubmit={handleSubmit}
            className="instructor__profile-form course-form"
          >
            {/* Hidden fields */}
            <input type="hidden" name="step" value="1" />
            <input type="hidden" name="next_step" value="2" />
            <input
              type="hidden"
              name="edit_mode"
              value={editMode ? "true" : "false"}
            />

            <div className="row g-3">
              <div className="col-md-12">
                <div className="custom-frm-bx">
                  <label htmlFor="instructor_id" className="form-label">
                    Instructor <span className="text-danger">*</span>
                  </label>
                  <select
                    name="instructor_id"
                    id="instructor_id"
                    className="form-select"
                    value={formData.instructor_id}
                    onChange={handleChange}
                    aria-label={t("Select demo video storage type")}
                  >
                    <option value="">Select Instructor</option>
                    {instructorsList?.map((option) => (
                      <option key={option._id} value={option._id}>
                        {option?.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-12">
                <div className="custom-frm-bx">
                  <label htmlFor="title" className="form-label">
                    {t("Title")} <span className="text-danger">*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    className="form-control"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    aria-label={t("Course title")}
                  />
                </div>
              </div>

              <div className="col-md-12">
                <div className="custom-frm-bx">
                  <label htmlFor="seo_description" className="form-label">
                    {t("SEO Description")}
                  </label>
                  <input
                    id="seo_description"
                    name="seo_description"
                    type="text"
                    className="form-control"
                    value={formData.seo_description}
                    onChange={handleChange}
                    placeholder={t("150 - 160 characters recommended")}
                    aria-label={t("SEO description")}
                  />
                </div>
              </div>
              {/* <div className="col-md-12">
                <div className="custom-frm-bx">
                  <label className="form-label">
                    {t("Thumbnail")} <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      id="thumbnail"
                      name="thumbnail"
                      type="file"
                      className="form-control file-manager-input"
                      readOnly
                      onChange={handleFileManagerClick}
                      accept="image/*"
                      //   value={formData.thumbnail}
                      aria-label={t("Thumbnail path")}
                    />
                  </div>
                </div>
              </div> */}
              <div className="col-lg-12 mb-4">
                <label htmlFor="image" className="form-label">
                  Thumbnail<sup className="text-danger">*</sup>
                </label>
                <div className="file-upload-container">
                  <div
                    className={`file-upload-area ${isDragging ? "dragging" : ""
                      }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {!selectedFile ? (
                      <>
                        <div className="file-upload-icon">
                          <i className="fa fa-cloud-upload"></i>
                        </div>
                        <div className="file-upload-text">
                          Drag & Drop your image here
                        </div>
                        <div className="file-upload-subtext">
                          or click to browse files
                        </div>
                        <input
                          type="file"
                          className="file-upload-input"
                          id="thumbnail"
                          name="thumbnail"
                          accept="image/*"
                          onChange={handleFileManagerClick}
                        />
                      </>
                    ) : (
                      <div className="file-preview-container">
                        <img
                          src={previewUrl || `${baseUrl}/${formData.thumbnail}`}
                          alt="Preview"
                          className="file-preview"
                        />
                        <button
                          type="button"
                          className="file-remove-btn"
                          onClick={removeFile}
                        >
                          <i className="fa fa-times"></i>
                        </button>
                        {previewUrl && <div className="file-info">
                          {selectedFile.name} (
                          {Math.round(selectedFile.size / 1024)} KB)
                        </div>}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="custom-frm-bx">
                  <label htmlFor="demo_video_storage" className="form-label">
                    {t("Demo Video Storage")}
                  </label>
                  <select
                    name="demo_video_storage"
                    id="demo_video_storage"
                    className="form-select"
                    value={formData.demo_video_storage}
                    onChange={handleChange}
                    aria-label={t("Select demo video storage type")}
                  >
                    {videoStorageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Upload Path */}
              <div
                className={`col-md-6 upload ${formData.demo_video_storage === "upload" ? "" : "d-none"
                  }`}
              >
                <div className="custom-frm-bx">
                  <label className="form-label">{t("Upload Path")}</label>
                  <div className="input-group">
                    {/* <button
                      type="button"
                      className="btn btn-outline-secondary file-manager"
                      onClick={() => handleFileManagerClick("path")}
                      aria-label={t("Choose video file")}
                    >
                      <FontAwesomeIcon icon={faImage} /> {t("Choose")}
                    </button> */}
                    <input
                      id="path"
                      name="upload_path"
                      type="file"
                      className="form-control file-manager-input"
                      readOnly
                      onChange={handleFileManagerClick}
                      accept="image/*"
                      aria-label={t("Video file path")}
                    />
                  </div>
                </div>
              </div>

              {/* External Link Path */}
              <div
                className={`col-md-6 external_link ${formData.demo_video_storage !== "upload" ? "" : "d-none"
                  }`}
              >
                <div className="custom-frm-bx">
                  <label className="form-label">{t("External Link")}</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FontAwesomeIcon icon={faLink} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      name="external_path"
                      placeholder={t("Paste your external link")}
                      value={formData.external_path}
                      onChange={handleChange}
                      aria-label={t("External video link")}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="custom-frm-bx">
                  <label htmlFor="price" className="form-label">
                    {t("Price")} <span className="text-danger">*</span>
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    className="form-control"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    aria-label={t("Course price")}
                  />
                  <small className="text-muted">{t("Put 0 for free")}</small>
                </div>
              </div>

              <div className="col-md-6">
                <div className="custom-frm-bx">
                  <label htmlFor="discount_price" className="form-label">
                    {t("Discount Price")}
                  </label>
                  <input
                    id="discount_price"
                    name="discount_price"
                    type="number"
                    className="form-control"
                    value={formData.discount_price}
                    onChange={handleChange}
                    aria-label={t("Course discount price")}
                  />
                </div>
              </div>

              <div className="col-md-12">
                <div className="custom-frm-bx">
                  <label htmlFor="description" className="form-label">
                    {t("Description")}
                  </label>
                  <ReactQuill
                    value={formData.description}
                    onChange={handleEditorChange}
                    theme="snow"
                    className="text-editor"
                    placeholder={t("Enter course description")}
                  />
                </div>
              </div>

              <div className="col-md-12">
                <button className="thm-btn w-100" type="submit">
                  {t("Save")}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
