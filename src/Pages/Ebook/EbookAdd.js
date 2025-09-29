import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

export default function EbookAdd() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bookTitle: "",
    aboutEbook: "",
    price: "",
    referralCommission: "",
    adminCommission: "",
    writer: "",
    type: "library",
    mentorId: "",
    libraryId: "",
  });

  const [bookImage, setBookImage] = useState(null);
  const [uploadBook, setUploadBook] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async (type) => {
    try {
      const response = await axios.get(
        type === "mentor" ? `${baseUrl}/web/mentors` : `${baseUrl}/web/library`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.data?.status) {
        setList(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch list");
      }
    } catch (error) {
      toast.error("Error loading list");
      console.error("Fetch error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "type") {
      if (value === "library" || value === "mentor") {
        fetchList(value);
      }
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "bookTitle",
      "aboutEbook",
      "price",
      "adminCommission",
      "writer",
      "type",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) newErrors[field] = "This field is required";
    });

    if (formData.type === "library" && !formData.libraryId) {
      newErrors.libraryId = "Library ID is required for type 'library'";
    }

    if (formData.type === "mentor" && !formData.mentorId) {
      newErrors.mentorId = "Mentor ID is required for type 'mentor'";
    }

    if (!bookImage) newErrors.bookImage = "Book cover image is required";
    if (!uploadBook) newErrors.uploadBook = "PDF file is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value) payload.append(key, value);
    });

    payload.append("bookImage", bookImage);
    payload.append("uploadBook", uploadBook);

    try {
      const response = await axios.post(`${baseUrl}/ebook`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem("token"),
        },
      });

      if (response?.data?.status) {
        toast.success("Ebook added successfully!");
        navigate("/ebook");
      } else {
        toast.error(response?.data?.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed");
      console.error("Add Ebook Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="main-sec">
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-6">
            <h4>
              <FontAwesomeIcon icon={faSave} className="me-2" /> Add Ebook
            </h4>
          </div>
          <div className="col-lg-6 text-end">
            <Link to="/ebook" className="btn btn-secondary">
              <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
              Back to Ebooks
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Book Title *</label>
              <input
                type="text"
                className={`form-control ${errors.bookTitle && "is-invalid"}`}
                name="bookTitle"
                value={formData.bookTitle}
                onChange={handleChange}
              />
              {errors.bookTitle && (
                <div className="invalid-feedback">{errors.bookTitle}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label>Author (Writer) *</label>
              <input
                type="text"
                className={`form-control ${errors.writer && "is-invalid"}`}
                name="writer"
                value={formData.writer}
                onChange={handleChange}
              />
              {errors.writer && (
                <div className="invalid-feedback">{errors.writer}</div>
              )}
            </div>

            <div className="col-md-12 mb-3">
              <label>About Ebook *</label>
              <textarea
                className={`form-control ${errors.aboutEbook && "is-invalid"}`}
                name="aboutEbook"
                value={formData.aboutEbook}
                onChange={handleChange}
              />
              {errors.aboutEbook && (
                <div className="invalid-feedback">{errors.aboutEbook}</div>
              )}
            </div>

            <div className="col-md-4 mb-3">
              <label>Price *</label>
              <input
                type="number"
                className={`form-control ${errors.price && "is-invalid"}`}
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
              {errors.price && (
                <div className="invalid-feedback">{errors.price}</div>
              )}
            </div>

            <div className="col-md-4 mb-3">
              <label>Admin Commission *</label>
              <input
                type="number"
                className={`form-control ${
                  errors.adminCommission && "is-invalid"
                }`}
                name="adminCommission"
                value={formData.adminCommission}
                onChange={handleChange}
              />
              {errors.adminCommission && (
                <div className="invalid-feedback">{errors.adminCommission}</div>
              )}
            </div>

            <div className="col-md-4 mb-3">
              <label>Referral Commission</label>
              <input
                type="number"
                className="form-control"
                name="referralCommission"
                value={formData.referralCommission}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Type *</label>
              <select
                className={`form-control ${errors.type && "is-invalid"}`}
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="">Select type</option>
                <option value="library">Library</option>
                <option value="mentor">Mentor</option>
              </select>
              {errors.type && (
                <div className="invalid-feedback">{errors.type}</div>
              )}
            </div>

            {formData.type === "library" && (
              <div className="col-md-6 mb-3">
                <label>Library *</label>

                <select
                  className={`form-control ${errors.libraryId && "is-invalid"}`}
                  name="libraryId"
                  value={formData.libraryId}
                  onChange={handleChange}
                  //   disabled={}
                >
                  <option value="">Select library </option>
                  {list?.map((arr) => (
                    <option value={arr?._id}>
                      {arr.libraryName} ({arr?.libraryCode})
                    </option>
                  ))}
                </select>

                {errors.libraryId && (
                  <div className="invalid-feedback">{errors.libraryId}</div>
                )}
              </div>
            )}

            {formData.type === "mentor" && (
              <div className="col-md-6 mb-3">
                <label>Mentor *</label>
                <select
                  className={`form-control ${errors.mentorId && "is-invalid"}`}
                  name="mentorId"
                  value={formData.mentorId}
                  onChange={handleChange}
                  //   disabled={}
                >
                  <option value="">Select Mentor</option>
                  {list?.map((arr) => (
                    <option value={arr?._id}>
                      {arr.mentorName} ({arr?.mentorCode})
                    </option>
                  ))}
                </select>

                {errors.mentorId && (
                  <div className="invalid-feedback">{errors.mentorId}</div>
                )}
              </div>
            )}

            <div className="col-md-6 mb-3">
              <label>Book Cover Image *</label>
              <input
                type="file"
                accept="image/*"
                className={`form-control ${errors.bookImage && "is-invalid"}`}
                onChange={(e) => setBookImage(e.target.files[0])}
              />
              {errors.bookImage && (
                <div className="invalid-feedback">{errors.bookImage}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label>Upload PDF Book *</label>
              <input
                type="file"
                accept="application/pdf"
                className={`form-control ${errors.uploadBook && "is-invalid"}`}
                onChange={(e) => setUploadBook(e.target.files[0])}
              />
              {errors.uploadBook && (
                <div className="invalid-feedback">{errors.uploadBook}</div>
              )}
            </div>
          </div>

          <div className="text-center mt-4">
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} className="me-2" />
                  Save Ebook
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
