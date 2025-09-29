"use client"

import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import { baseUrl } from "../../config/baseUrl"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faArrowLeft,
    faBoxOpen,
    faRupeeSign,
    faCalendarAlt,
    faEdit,
    faCheck,
    faTimes,
    faImage,
} from "@fortawesome/free-solid-svg-icons"
import toastify from "../../config/toastify"

export default function ViewTestPackage() {
    const { id } = useParams()
    const [packageData, setPackageData] = useState(
        {

        }
    )
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (id) {
            fetchPackageData()
        }
    }, [id])

    const fetchPackageData = async () => {
        try {

            // Fetch package list
            const response = await axios.get(`${baseUrl}/package`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })

            if (response.data.status && response.data.data) {
                // Find the specific package by ID
                const packageData = response.data.data.find((pkg) => pkg._id === id)

                if (packageData) {
                    setPackageData(packageData)
                } else {
                    toastify.error("Package not found")
                }
            }
        } catch (error) {
            console.error("Error fetching package data:", error)
            toastify.error("Failed to fetch package data")

        } finally {

        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    // if (!packageData) {
    //     return (
    //         <div className="text-center" style={{ minHeight: "400px", paddingTop: "100px" }}>
    //             <h4>Package not found</h4>
    //         </div>
    //     )
    // }

    return (
        <>
            <style jsx>{`
        .main-sec {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
          padding: 2rem 0;
        }

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

        .package-header {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #eee;
        }

        .package-image {
          width: 200px;
          height: 200px;
          border-radius: 15px;
          object-fit: cover;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .package-info h2 {
          color: #333;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .package-info p {
          color: #666;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-active {
          background: #d4edda;
          color: #155724;
        }

        .status-inactive {
          background: #f8d7da;
          color: #721c24;
        }

        .detail-section {
          background: #f8f9ff;
          border-radius: 10px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          border-left: 4px solid #667eea;
        }

        .section-title {
          color: #667eea;
          font-weight: 700;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .detail-item {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .detail-label {
          font-weight: 600;
          color: #555;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-size: 1.1rem;
          color: #333;
          font-weight: 500;
        }

        .price-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #667eea;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-edit {
          background: #008080;
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          color: white;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-edit:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
          color: white;
        }

        .btn-back {
          background: #4facfe;
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-back:hover {
          background: #2f86fe;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(79, 172, 254, 0.3);
        }

        .no-image {
          width: 200px;
          height: 200px;
          border-radius: 15px;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          font-size: 3rem;
          border: 2px dashed #ddd;
        }

        @media (max-width: 768px) {
          .package-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .package-image,
          .no-image {
            width: 150px;
            height: 150px;
          }
          
          .detail-grid {
            grid-template-columns: 1fr;
          }
          
          .cards {
            padding: 1.5rem;
          }
        }
      `}</style>

            <section className="main-sec">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="dashboard-title">
                                <h4 className="dash-head">
                                    <FontAwesomeIcon icon={faBoxOpen} className="me-2" />
                                    Package Details
                                </h4>
                            </div>
                            <div className="custom-bredcump">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link to="/">Dashboard</Link>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <Link to="/test-packages">Test Packages</Link>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            View Package
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                        <div className="col-lg-6 d-flex justify-content-end gap-2">
                            <Link to="/test-packages" className="btn btn-back text-white">
                                <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                                Back
                            </Link>
                            <Link to={`/test-packages/edit/${packageData._id}`} className="btn-edit">
                                <FontAwesomeIcon icon={faEdit} className="me-1" />
                                Edit Package
                            </Link>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="cards">
                                <div className="package-header">
                                    {/* {packageData.image === "" || null ? (
                                        <img src={`${baseUrl}/${packageData.image} || "/bslogo.png"`}
                                            alt={packageData.title}
                                            className="package-image"
                                        />
                                    ) : (
                                        <div className="no-image">
                                            <FontAwesomeIcon icon={faImage} />
                                        </div>
                                    )} */}
                                    <img
                                        src={`${baseUrl}/${packageData.image}` || "/jslogo.png"}
                                        alt={packageData.title}
                                        className="package-image"
                                        onError={((e) => {
                                            e.target.onError = null
                                            e.target.src = "/jslogo.png"
                                        })}
                                    />
                                    <div className="package-info">
                                        <h2>{packageData.title}</h2>
                                        <p dangerouslySetInnerHTML={{ __html: packageData?.description }} />

                                        <div
                                            className={`status-badge ${packageData.status === "active" ? "status-active" : "status-inactive"}`}
                                        >
                                            {packageData.status === "active" ? (
                                                <>
                                                    <FontAwesomeIcon icon={faCheck} />
                                                    Active
                                                </>
                                            ) : (
                                                <>
                                                    <FontAwesomeIcon icon={faTimes} />
                                                    Inactive
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <h5 className="section-title">Package Information</h5>
                                    <div className="detail-grid">
                                        <div className="detail-item">
                                            <div className="detail-label">Package Category</div>
                                            <div className="detail-value">{packageData?.subcategoryID?.title}</div>
                                        </div>
                                        <div className="detail-item">
                                            <div className="detail-label">Price</div>
                                            <div className="detail-value price-value">
                                                <FontAwesomeIcon icon={faRupeeSign} />
                                                {packageData.price}
                                            </div>
                                        </div>
                                        <div className="detail-item">
                                            <div className="detail-label">Offer Price</div>
                                            <div className="detail-value price-value">
                                                <FontAwesomeIcon icon={faRupeeSign} />
                                                {packageData?.offerPrice || "N/A"}
                                            </div>
                                        </div>
                                        <div className="detail-item">
                                            <div className="detail-label">Status</div>
                                            <div className="detail-value">{packageData.status}</div>
                                        </div>
                                        <div className="detail-item">
                                            <div className="detail-label">Created Date</div>
                                            <div className="detail-value">
                                                <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                                                {formatDate(packageData.createdAt)}
                                            </div>
                                        </div>
                                        <div className="detail-item">
                                            <div className="detail-label">Last Updated</div>
                                            <div className="detail-value">
                                                <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                                                {formatDate(packageData.updatedAt)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
