import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { baseUrl } from "../../config/baseUrl"
import empty from "../../assets/images/empty-box.png"
import Swal from "sweetalert2"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBoxOpen,
  faPlus,
  faEye,
  faEdit,
  faTrash,
  faCheck,
  faTimes,
  faSearch,
  faInr,
  faArrowUp,
  faArrowDown,
  faSpinner,
  faClipboard,
} from "@fortawesome/free-solid-svg-icons"
import { toast } from "react-toastify"

export default function TestPackageList() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [sequenceLoading, setSequenceLoading] = useState({})
  const [subcategoryFilter, setSubcategoryFilter] = useState("")

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${baseUrl}/package`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })

      // Sort packages by sequence, fallback to creation date
      const sortedPackages = response.data.data.sort((a, b) => {
        if (a.sequence && b.sequence) {
          return a.sequence - b.sequence
        }
        if (a.sequence && !b.sequence) return -1
        if (!a.sequence && b.sequence) return 1
        return new Date(a.createdAt) - new Date(b.createdAt)
      })

      setPackages(sortedPackages)
    } catch (error) {
      console.log("error", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatus = async (id, curentStatus) => {
    const newStatus = curentStatus === "active" ? "inactive" : "active"
    try {
      await axios(`${baseUrl}/package/status/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        data: {
          status: newStatus,
        },
      })
      fetchPackages()
      toast.success("Status updated successfully")
    } catch (error) {
      toast.success(" Error updating status")
    }
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    })

    if (result.isConfirmed) {
      try {
        await axios.delete(`${baseUrl}/package/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        fetchPackages()
        Swal.fire("Deleted!", "Package has been deleted.", "success")
      } catch (error) {
        Swal.fire("Error!", "Failed to delete package.", "error")
      }
    }
  }

  const handleSequenceChange = async (packageId, direction) => {
    const currentIndex = packages.findIndex((pkg) => pkg._id === packageId)

    if ((direction === "up" && currentIndex === 0) || (direction === "down" && currentIndex === packages.length - 1)) {
      return
    }

    setSequenceLoading((prev) => ({ ...prev, [packageId]: true }))

    try {
      const newPackages = [...packages]
      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

      // Swap
      const temp = newPackages[currentIndex]
      newPackages[currentIndex] = newPackages[targetIndex]
      newPackages[targetIndex] = temp

      // Update local state with new sequence values
      const updatedWithSequence = newPackages.map((pkg, index) => ({
        ...pkg,
        sequence: index + 1,
      }))
      setPackages(updatedWithSequence)

      // Send only one package to API
      const updatedPackage = {
        packageId: updatedWithSequence[currentIndex]._id,
        targetSequence: currentIndex + 1,
      }

      await axios.post(`${baseUrl}/package/update-sequence`, updatedPackage, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })

      toast.success("Package sequence updated successfully")
    } catch (error) {
      console.error("Error updating sequence:", error)
      fetchPackages()
      Swal.fire({
        title: "Error!",
        text: "Failed to update package sequence",
        icon: "error",
      })
    } finally {
      setSequenceLoading((prev) => ({ ...prev, [packageId]: false }))
    }
  }

  const truncateText = (text, maxLength = 50) => {
    return text?.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  const calculateDiscount = (price, discountPrice) => {
    if (!price || !discountPrice || price <= discountPrice) return 0
    return Math.round(((price - discountPrice) / price) * 100)
  }

  const getUniqueSubcategories = () => {
    const subcategories = packages
      .filter((pkg) => pkg.subcategoryID && pkg.subcategoryID.title)
      .map((pkg) => ({
        id: pkg.subcategoryID._id,
        title: pkg.subcategoryID.title,
      }))

    // Remove duplicates based on id
    const uniqueSubcategories = subcategories.filter(
      (subcat, index, self) => index === self.findIndex((s) => s.id === subcat.id),
    )

    return uniqueSubcategories
  }

  // Filter packages based on search term and status
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "" || pkg.status === statusFilter
    const matchesSubcategory =
      subcategoryFilter === "" || (pkg.subcategoryID && pkg.subcategoryID._id === subcategoryFilter)
    return matchesSearch && matchesStatus && matchesSubcategory
  })

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

        .btn-add-package {
          background: #008080;
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          color: white;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-add-package:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
          color: white;
        }

        .search-filter-container {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .search-input {
          flex: 1;
          min-width: 250px;
          border-radius: 8px;
          border: 1px solid #ddd;
          padding: 0.75rem 1rem;
          padding-left: 2.5rem;
        }

        .search-container {
          position: relative;
          flex: 1;
          min-width: 250px;
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }

        .filter-select {
          border-radius: 8px;
          border: 1px solid #ddd;
          padding: 0.75rem 1rem;
          min-width: 150px;
        }

        .custom-table {
          border-radius: 10px;
          overflow: hidden;
        }

        .table {
          margin: 0;
        }

        .table thead th {
          background: #008080;
          color: white;
          font-weight: 600;
          border: none;
          padding: 1rem;
        }

        .table tbody td {
          padding: 1rem;
          vertical-align: middle;
          border-bottom: 1px solid #f0f0f0;
        }

        .table tbody tr:hover {
          background-color: #f8f9ff;
        }

        .package-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .package-image {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          object-fit: cover;
        }

        .package-details h6 {
          margin: 0;
          font-weight: 600;
          color: #333;
        }

        .package-details p {
          margin: 0;
          color: #666;
          font-size: 0.85rem;
        }

        .badge-container {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .badge-item {
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .badge-popular {
          background: #d4edda;
          color: #155724;
        }

        .badge-featured {
          background: #fff3cd;
          color: #856404;
        }

        .badge-homepage {
          background: #d1ecf1;
          color: #0c5460;
        }

        .stats-container {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.85rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #666;
        }

        .stat-icon {
          color: #667eea;
          width: 16px;
        }

        .price-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .regular-price {
          font-size: 1.1rem;
          font-weight: 700;
          color: #333;
        }

        .discount-price {
          font-size: 0.9rem;
          color: #999;
          text-decoration: line-through;
        }

        .discount-badge {
          background: #ef5350;
          color: white;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-left: 0.5rem;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .status-active {
          background: #d4edda;
          color: #155724;
        }

        .status-inactive {
          background: #f8d7da;
          color: #721c24;
        }

        .status-draft {
          background: #fff3cd;
          color: #856404;
        }

        .status-badge:hover {
          transform: scale(1.05);
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          width: 35px;
          height: 35px;
          border-radius: 8px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .view-btn {
          background: #4facfe;
          color: white;
        }

        .edit-btn {
          background: #ffa726;
          color: white;
        }

        .delete-btn {
          background: #ef5350;
          color: white;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .tooltip-text {
          position: absolute;
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: #333;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          white-space: nowrap;
        }

        .action-btn:hover .tooltip-text {
          opacity: 1;
        }

        .sequence-controls {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          align-items: center;
        }

        .sequence-btn {
          width: 28px;
          height: 28px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.75rem;
          position: relative;
        }

        .sequence-btn:hover:not(:disabled) {
          background: #f8f9fa;
          border-color: #667eea;
          color: #667eea;
        }

        .sequence-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #f8f9fa;
        }

        .sequence-number {
          font-size: 0.8rem;
          font-weight: 600;
          color: #666;
          margin: 0.25rem 0;
        }

        .sequence-loading {
          color: #667eea;
          animation: spin 1s linear infinite;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
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
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .search-filter-container {
            flex-direction: column;
          }

          .search-container,
          .filter-select {
            min-width: 100%;
          }

          .table-responsive {
            font-size: 0.85rem;
          }

          .package-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .stats-container {
            font-size: 0.75rem;
          }

          .sequence-controls {
            gap: 0.15rem;
          }

          .sequence-btn {
            width: 24px;
            height: 24px;
            font-size: 0.7rem;
          }
        }
      `}</style>

      <section className="main-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="dashboard-title">
                <h4 className="dash-head">
                  <FontAwesomeIcon icon={faBoxOpen} className="me-2" />
                  Test Packages
                </h4>
              </div>
              <div className="custom-bredcump">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Test Packages
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="col-lg-6 d-flex justify-content-end align-items-start">
              <Link to="create" className="btn-add-package">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Package
              </Link>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="cards bus-list">
                <div className="bus-filter">
                  <div className="row align-items-center">
                    <div className="col-lg-6">
                      <h5 className="card-title">Test Packages List ({filteredPackages.length})</h5>
                    </div>
                  </div>
                </div>

                <div className="search-filter-container">
                  <div className="search-container">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search packages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    className="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <select
                    className="filter-select"
                    value={subcategoryFilter}
                    onChange={(e) => setSubcategoryFilter(e.target.value)}
                  >
                    <option value="">All Subcategories</option>
                    {getUniqueSubcategories().map((subcat) => (
                      <option key={subcat.id} value={subcat.id}>
                        {subcat.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="table-responsive custom-table">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>SN</th>
                        <th>Sequence</th>
                        <th>Package</th>
                        {/* <th>Details</th> */}
                        <th>Category</th>
                        <th>Price</th>
                        <th>Off Price</th>
                        <th>Status</th>
                        <th>Tests</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <div>
                          <div className="loading-spinner">
                            <div className="spinner border-0"></div>
                          </div>
                        </div>
                      ) : filteredPackages.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="empty-state">
                            <img src={empty || "/placeholder.svg"} alt="No packages" width="200px" />
                            <h4>No Test Packages found!</h4>
                            <p className="text-muted">
                              {searchTerm || statusFilter
                                ? "Try adjusting your search or filter criteria"
                                : "Start by creating your first test package"}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredPackages.map((pkg, i) => (
                          <tr key={pkg?._id}>
                            <td>{i + 1}</td>
                            <td>
                              <div className="sequence-controls">
                                <button
                                  className="sequence-btn"
                                  onClick={() => handleSequenceChange(pkg._id, "up")}
                                  disabled={i === 0 || sequenceLoading[pkg._id]}
                                  title="Move up"
                                >
                                  {sequenceLoading[pkg._id] ? (
                                    <FontAwesomeIcon icon={faSpinner} className="sequence-loading" />
                                  ) : (
                                    <FontAwesomeIcon icon={faArrowUp} />
                                  )}
                                </button>
                                <div className="sequence-number">{pkg.sequence || i + 1}</div>
                                <button
                                  className="sequence-btn"
                                  onClick={() => handleSequenceChange(pkg._id, "down")}
                                  disabled={i === filteredPackages.length - 1 || sequenceLoading[pkg._id]}
                                  title="Move down"
                                >
                                  {sequenceLoading[pkg._id] ? (
                                    <FontAwesomeIcon icon={faSpinner} className="sequence-loading" />
                                  ) : (
                                    <FontAwesomeIcon icon={faArrowDown} />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td>
                              <div className="package-info">
                                <img
                                  src={`${baseUrl}/${pkg?.image}` || "/jslogo.png"}
                                  alt={pkg?.title}
                                  className="package-image"
                                  onError={(e) => {
                                    e.target.onError = null
                                    e.target.src = "/jslogo.png"
                                  }}
                                />
                                <div className="package-details">
                                  <h6>{truncateText(pkg?.title, 40)}</h6>
                                </div>
                              </div>
                            </td>
                            {/* <td dangerouslySetInnerHTML={{ __html: pkg?.description }} /> */}
                            <td>{pkg?.subcategoryID?.title}</td>
                            <td>
                              <div className="price-container">
                                <div className="d-flex align-items-center">
                                  <span className="regular-price">
                                    <FontAwesomeIcon icon={faInr} className="me-1" />
                                    {pkg?.price}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="regular-price">
                                <FontAwesomeIcon icon={faInr} className="me-1" />
                                {pkg?.offerPrice}
                              </span>
                            </td>
                            <td>
                              <button
                                onClick={() => handleStatus(pkg?._id, pkg?.status)}
                                className={`status-badge ${pkg.status === "active"
                                  ? "status-active"
                                  : pkg.status === "inactive"
                                    ? "status-inactive"
                                    : "status-draft"
                                  }`}
                              >
                                {pkg?.status === "active" ? (
                                  <>
                                    <FontAwesomeIcon icon={faCheck} className="me-1" />
                                    Active
                                  </>
                                ) : pkg?.status === "inactive" ? (
                                  <>
                                    <FontAwesomeIcon icon={faTimes} className="me-1" />
                                    Inactive
                                  </>
                                ) : (
                                  <>
                                    <FontAwesomeIcon icon={faEdit} className="me-1" />
                                    Draft
                                  </>
                                )}
                              </button>
                            </td>
                            <td>
                              <Link
                                to={`/test-packages/test-list/${pkg?._id}`}
                                className="action-btn edit-btn"
                                title="Tests In This Package"
                              >
                                <FontAwesomeIcon icon={faClipboard} className="me-1" />
                                {pkg?.testCount || "0"}
                              </Link>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <Link to={`/test-packages/view/${pkg?._id}`} className="action-btn view-btn">
                                  <FontAwesomeIcon icon={faEye} />
                                  <span className="tooltip-text">View</span>
                                </Link>
                                <Link to={`/test-packages/edit/${pkg?._id}`} className="action-btn edit-btn">
                                  <FontAwesomeIcon icon={faEdit} />
                                  <span className="tooltip-text">Edit</span>
                                </Link>
                                <button className="action-btn delete-btn" onClick={() => handleDelete(pkg?._id)}>
                                  <FontAwesomeIcon icon={faTrash} />
                                  <span className="tooltip-text">Delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
