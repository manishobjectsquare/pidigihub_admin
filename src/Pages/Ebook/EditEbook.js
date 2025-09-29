import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function EditEbook() {
  const { id } = useParams();
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
  const [existingBookImage, setExistingBookImage] = useState(null);
  const [existingUploadBook, setExistingUploadBook] = useState(null);

  const [bookImage, setBookImage] = useState(null);
  const [uploadBook, setUploadBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [list, setList] = useState([]);

  useEffect(() => {
    fetchEbook();
  }, []);

  const fetchEbook = async () => {
    try {
      const response = await axios.get(`${baseUrl}/ebook/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (response.data?.status) {
        const ebook = response.data.data;
        setFormData({
          bookTitle: ebook.bookTitle,
          aboutEbook: ebook.aboutEbook,
          price: ebook.price,
          referralCommission: ebook.referralCommission || "",
          adminCommission: ebook.adminCommission,
          writer: ebook.writer,
          type: ebook.type,
          mentorId: ebook.mentorId || "",
          libraryId: ebook.libraryId || "",
        });
        if (ebook.type === "mentor") {
          fetchList("mentor");
        } else {
          fetchList("library");
        }
        setExistingBookImage(`${baseUrl}/${ebook.bookImage}`);
        setExistingUploadBook(`${baseUrl}/${ebook.uploadBook}`);
      } else {
        toast.error(response.data.message || "Failed to fetch ebook");
      }
    } catch (error) {
      toast.error("Error loading ebook");
      console.error("Fetch error:", error);
    }
  };

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
    if (name === "type") {
      if (value === "library" || value === "mentor") {
        fetchList(value);
      }
      if (value === "library") {
        setFormData((prev) => ({ ...prev, ["mentorId"]: "" }));
      } else if (value === "mentor") {
        setFormData((prev) => ({ ...prev, ["libraryId"]: "" }));
      }
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const required = [
      "bookTitle",
      "aboutEbook",
      "price",
      "adminCommission",
      "writer",
      "type",
    ];
    required.forEach((field) => {
      if (!formData[field]) newErrors[field] = "Required";
    });

    if (formData.type === "library" && !formData.libraryId) {
      newErrors.libraryId = "Library ID required";
    }

    if (formData.type === "mentor" && !formData.mentorId) {
      newErrors.mentorId = "Mentor ID required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    // console.log(formData);

    // return;
    setLoading(true);
    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value) payload.append(key, value);
    });

    if (bookImage) payload.append("bookImage", bookImage);
    if (uploadBook) payload.append("uploadBook", uploadBook);

    try {
      const response = await axios.patch(`${baseUrl}/ebook/${id}`, payload, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.status) {
        toast.success("Ebook updated successfully!");
        navigate("/ebook");
      } else {
        toast.error(response.data.message || "Failed to update");
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Server error occurred");
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
              <FontAwesomeIcon icon={faSave} className="me-2" />
              Edit Ebook
            </h4>
          </div>
          <div className="col-lg-6 text-end">
            <Link to="/ebook" className="btn btn-secondary">
              <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
              Back to Ebooks
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
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
              <label>Author *</label>
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
                <option value="library">Library</option>
                <option value="mentor">Mentor</option>
              </select>
              {errors.type && (
                <div className="invalid-feedback">{errors.type}</div>
              )}
            </div>

            {/* {formData.type === "library" && (
              <div className="col-md-6 mb-3">
                <label>Library ID *</label>
                <input
                  type="text"
                  className={`form-control ${errors.libraryId && "is-invalid"}`}
                  name="libraryId"
                  value={formData.libraryId}
                  onChange={handleChange}
                />
                {errors.libraryId && (
                  <div className="invalid-feedback">{errors.libraryId}</div>
                )}
              </div>
            )}

            {formData.type === "mentor" && (
              <div className="col-md-6 mb-3">
                <label>Mentor ID *</label>
                <input
                  type="text"
                  className={`form-control ${errors.mentorId && "is-invalid"}`}
                  name="mentorId"
                  value={formData.mentorId}
                  onChange={handleChange}
                />
                {errors.mentorId && (
                  <div className="invalid-feedback">{errors.mentorId}</div>
                )}
              </div>
            )} */}

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
              <label>Change Book Cover </label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setBookImage(e.target.files[0])}
                accept="image/*"
              />
              {existingBookImage && !bookImage && (
                <div className="mt-2">
                  <strong>Current Image:</strong>
                  <br />
                  <img
                    src={existingBookImage}
                    alt="Book Cover"
                    style={{
                      maxWidth: "150px",
                      maxHeight: "200px",
                      borderRadius: 8,
                    }}
                  />
                </div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label>Change PDF File </label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setUploadBook(e.target.files[0])}
                accept="application/pdf"
              />
              {existingUploadBook && !uploadBook && (
                <div className="mt-2">
                  <strong>Current PDF:</strong>
                  <br />
                  <a
                    href={existingUploadBook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm mt-1"
                  >
                    View Current PDF
                  </a>
                </div>
              )}
            </div>

            <div className="col-12 text-center">
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? "Saving..." : "Update Ebook"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
