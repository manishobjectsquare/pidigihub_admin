"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { baseUrl } from "../../config/baseUrl"
import empty from "../../assets/images/empty-box.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar, faStarHalfAlt, faSearch, faComments, faUser, faCalendarAlt } from "@fortawesome/free-solid-svg-icons"

export default function ReviewList() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${baseUrl}/api/v1/admin/reviews`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      setReviews(response.data.data || response.data)
    } catch (error) {
      console.log("error", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter reviews based on search term
  const filteredReviews = reviews.filter(
    (review) =>
      review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.review.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} className="star-filled" />)
    }

    if (hasHalfStar) {
      stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} className="star-filled" />)
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={faStar} className="star-empty" />)
    }

    return stars
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      <style >{`
      

        .dashboard-title {
          margin-bottom: 1.5rem;
        }

        .dash-head {
          color: #333;
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0;
        }

        .cards {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .bus-filter {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #eee;
        }

        .card-title {
          color: #333;
          font-weight: 700;
          margin: 0;
        }

        .search-container {
          position: relative;
          margin-bottom: 1.5rem;
          max-width: 400px;
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }

        .search-input {
          width: 100%;
          border-radius: 8px;
          border: 1px solid #ddd;
          padding: 0.75rem 1rem;
          padding-left: 2.5rem;
        }

        .review-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .review-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          border: 1px solid #f0f0f0;
          transition: all 0.3s ease;
        }

        .review-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .review-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .student-image {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #f0f0f0;
        }

        .student-info h6 {
          margin: 0;
          font-weight: 600;
          color: #333;
          font-size: 1.1rem;
        }

        .student-info p {
          margin: 0;
          color: #666;
          font-size: 0.85rem;
          margin-top: 0.25rem;
        }

        .rating-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .stars {
          display: flex;
          gap: 0.2rem;
        }

        .star-filled {
          color: #ffc107;
          font-size: 1.1rem;
        }

        .star-empty {
          color: #e0e0e0;
          font-size: 1.1rem;
        }

        .rating-number {
          font-weight: 600;
          color: #333;
          margin-left: 0.5rem;
        }

        .review-text {
          color: #555;
          line-height: 1.6;
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }

        .review-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1rem;
          border-top: 1px solid #f0f0f0;
          font-size: 0.85rem;
          color: #666;
        }

        .review-date {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          grid-column: 1 / -1;
        }

        .empty-state img {
          opacity: 0.7;
          margin-bottom: 1rem;
        }

        .empty-state h4 {
          color: #666;
          margin-bottom: 1rem;
        }

        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 3rem;
          grid-column: 1 / -1;
        }

        .spinner {
          width: 40px;
          height: 40px;
          // border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .stats-summary {
          display: flex;
          gap: 2rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #666;
          font-size: 0.9rem;
        }

        .stat-icon {
          color: #667eea;
        }

        @media (max-width: 768px) {
          .review-grid {
            grid-template-columns: 1fr;
          }
          
          .review-card {
            padding: 1rem;
          }
          
          .review-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          
          .student-image {
            width: 50px;
            height: 50px;
          }
          
          .stats-summary {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>

      <section className="main-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="dashboard-title">
                <h4 className="dash-head">
                  <FontAwesomeIcon icon={faComments} className="me-2" />
                  Student Reviews
                </h4>
              </div>
              <div className="custom-bredcump">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Reviews
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="cards">
                <div className="bus-filter">
                  <div className="row align-items-center">
                    <div className="col-lg-6">
                      <h5 className="card-title">All Reviews ({filteredReviews.length})</h5>
                    </div>
                  </div>

                  <div className="stats-summary">
                    <div className="stat-item">
                      <FontAwesomeIcon icon={faComments} className="stat-icon" />
                      <span>Total Reviews: {reviews.length}</span>
                    </div>
                    <div className="stat-item">
                      <FontAwesomeIcon icon={faStar} className="stat-icon" />
                      <span>
                        Average Rating:{" "}
                        {reviews.length > 0
                          ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
                          : "0.0"}
                      </span>
                    </div>
                    <div className="stat-item">
                      <FontAwesomeIcon icon={faUser} className="stat-icon" />
                      <span>Unique Students: {new Set(reviews.map((review) => review.name)).size}</span>
                    </div>
                  </div>
                </div>

                <div className="search-container">
                  <FontAwesomeIcon icon={faSearch} className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search reviews by student name or review text..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="review-grid">
                  {loading ? (
                    <div className="loading-spinner">
                      <div className="spinner"></div>
                    </div>
                  ) : filteredReviews.length === 0 ? (
                    <div className="empty-state">
                      <img src={empty || "/placeholder.svg"} alt="No reviews" width="200px" />
                      <h4>No Reviews found!</h4>
                      <p className="text-muted">
                        {searchTerm ? "Try adjusting your search criteria" : "No student reviews available yet"}
                      </p>
                    </div>
                  ) : (
                    filteredReviews.map((review) => (
                      <div key={review._id} className="review-card">
                        <div className="review-header">
                          <img
                            src={review.image ? `${baseUrl}${review.image}` : "/placeholder.svg?height=60&width=60"}
                            alt={review.name}
                            className="student-image"
                          />
                          <div className="student-info">
                            <h6>{review.name}</h6>
                            <p>{review.student_desc}</p>
                          </div>
                        </div>

                        <div className="rating-container">
                          <div className="stars">{renderStars(review.rating)}</div>
                          <span className="rating-number">{review.rating}/5</span>
                        </div>

                        <div className="review-text">"{review.review}"</div>

                        <div className="review-footer">
                          <div className="review-date">
                            <FontAwesomeIcon icon={faCalendarAlt} />
                            <span>{formatDate(review.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
